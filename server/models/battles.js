var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

var BattelsSchema = new Schema({
  name : {
    type :  String, trim: true
  },
  year : {
    type : Number
  },
  battle_number : {
    type : Number
  },
  attacker_king : {
    type :  String, trim: true
  },
  defender_king : {
    type :  String, trim: true
  },
  attacker_1 : {
    type :  String, trim: true
  },
  attacker_2 : {
    type :  String, trim: true
  },
  attacker_3 : {
    type :  String, trim: true
  },
  attacker_4 : {
    type :  String, trim: true
  },
  defender_1 : {
    type :  String, trim: true
  },
  defender_2 : {
    type :  String, trim: true
  },
  defender_3 : {
    type :  String, trim: true
  },
  defender_4: {
    type :  String, trim: true
  },
  attacker_outcome : {
    type :  String, trim: true
  },
  battle_type : {
    type :  String, trim: true
  },
  major_death : {
    type : Number
  },
  major_capture : {
    type : Number
  },
  attacker_size : {
    type : Number
  },
  defender_size : {
    type : Number
  },
  attacker_commander : {
    type :  String, trim: true
  },
  defender_commander : {
    type :  String, trim: true
  },
  summer : {
    type : Number
  },
  region : {
    type :  String, trim: true
  },
  location : {
    type :  String, trim: true
  },
  note : {
    type :  String, trim: true
  }

});

module.exports = mongoose.model('battles', BattelsSchema, 'battles');
