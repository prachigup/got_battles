// Module dependencies
var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , Battles = require('./models/battles')
  , q = require('q')
  , async = require('async');

// connect to database
module.exports = {
    // initialize DB
    startup: function (dbToUse) {
        mongoose.connect('mongodb://'+dbToUse);
        // Check connection to mongoDB
        mongoose.connection.on('open', function () {
            console.log('We have connected to mongodb');
        });

    },

    // disconnect from database
    closeDB: function () {
        mongoose.disconnect();
    },

    getPlacesList: function(){
        console.log("---getting the list of places---");
        var defer = q.defer();
        Battles.aggregate([{$group:{_id:{region:"$region",location:"$location"}
                             , battles:{$push:{name: "$name", year: "$year", battle_number: "$battle_number","attacker_king":"$attacker_king",defender_king:"$defender_king",attacker_outcome:"$attacker_outcome",battle_type:"$battle_type",attacker_commander:"$attacker_commander", defender_commander:"$defender_commander"}}}}
                             , {$project:{_id:0,region:"$_id.region", location:"$_id.location", battles:"$battles"}} ]
                             , function(err, results){
                                    if(err){
                                        defer.reject(err);
                                    } else{
                                        defer.resolve(results);
                                    }
                                });
        return defer.promise;
    },

    getTotalCount: function(){
        console.log("---getting the total count of records---");
        var defer = q.defer();
        Battles.count({}, function(err, count){
            if(err){
                defer.reject(err);
            } else{
                defer.resolve({'count':count});
            }
        });
        return defer.promise;
    },

    getStats: function(){
        console.log("---getting the stats---");
        var defer = q.defer();
        var stats = {  
                       "most_active":{  
                          "attacker_king":"",
                          "defender_king":"",
                          "region":"",
                          "name":""
                       },
                       "attacker_outcome":{  
                          "win":"",
                          "loss":""
                       },
                       "battle_type":[],
                       "defender_size":{  
                          "average":"",
                          "min":"",
                          "max":""
                       }
                    };

        async.parallel({
            mostActive_attacker_king: function(callback){
                Battles.aggregate([{$match:{"attacker_king":{$ne:""}}}
                        , {$group:{_id:"$attacker_king", count:{$sum:1}}},{$sort :{"count":-1}},{$limit:1} ]
                         , function(err, results){
                                if(err){
                                    callback(err);
                                } else{
                                    callback(null, results);
                                }
                            });
            },
            mostActive_defender_king: function(callback){
               Battles.aggregate([{$match:{"defender_king":{$ne:""}}}
                        , {$group:{_id:"$defender_king", count:{$sum:1}}},{$sort :{"count":-1}},{$limit:1} ]
                         , function(err, results){
                                if(err){
                                    callback(err);
                                } else{
                                    callback(null, results);
                                }
                            });
            },
            mostActive_region: function(callback){
                Battles.aggregate([{$match:{"region":{$ne:""}}}
                        , {$group:{_id:"$region", count:{$sum:1}}},{$sort :{"count":-1}},{$limit:1} ]
                        , function(err, results){
                            if(err){
                                callback(err);
                            } else{
                                callback(null, results);
                            }
                        });
            },
            mostActive_battle_name: function(callback){
                Battles.aggregate([{$match:{$and:[ {"name":{$ne:""}}, {"defender_size":{$ne:""}}, {"attacker_size":{$ne:""}} ]} }
                        , {$group:{_id:"$name", count:{$max:{$add:["$attacker_size","$defender_size"]}}}},{$sort :{"count":-1}},{$limit:1} ]
                        , function(err, results){
                            if(err){
                                callback(err);
                            } else{
                                callback(null, results);
                            }
                        });
            },
            number_of_battle_won: function(callback){
               Battles.count({attacker_outcome:"win"}, function(err, results){
                            if(err){
                                callback(err);
                            } else{
                                callback(null, results);
                            }
                        });
            },
            number_of_battle_lost: function(callback){
                Battles.count({attacker_outcome:"loss"}, function(err, results){
                            if(err){
                                callback(err);
                            } else{
                                callback(null, results);
                            }
                        });
            },
            battle_type: function(callback){
               Battles.distinct("battle_type",{"battle_type":{$ne:""}},function(err, results){
                            if(err){
                                callback(err);
                            } else{
                                callback(null, results);
                            }
                        })
            },
            defender_size: function(callback){
                Battles.aggregate([{$match:{"defender_size":{$ne:""}}}
                        ,{$group:{_id:null, average_defender_size:{$avg:"$defender_size"}, max_defender_size:{$max:"$defender_size"}, min_defender_size:{$min:"$defender_size"}}}]
                        , function(err, results){
                            if(err){
                                callback(err);
                            } else{
                                callback(null, results);
                            }
                        });
            }
        },
        function(err, results) {
           if(err) defer.reject(err);
           else{
                console.log("stats, "+ JSON.stringify(results));
                stats.most_active.attacker_king = results["mostActive_attacker_king"][0]._id;
                stats.most_active.defender_king = results["mostActive_defender_king"][0]._id;
                stats.most_active.region  = results["mostActive_region"][0]._id;
                stats.most_active.name = results["mostActive_battle_name"][0]._id;
                stats.attacker_outcome.win = results["number_of_battle_won"];
                stats.attacker_outcome.loss = results["number_of_battle_lost"];
                stats.battle_type = [].concat(results["battle_type"]);
                stats.defender_size.average = results["defender_size"][0].average_defender_size;
                stats.defender_size.min = results["defender_size"][0].min_defender_size;
                stats.defender_size.max = results["defender_size"][0].max_defender_size;
            
                defer.resolve(stats)
           }
        });
        return defer.promise;
    }

}