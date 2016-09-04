var express = require('express'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    errorhandler = require('errorhandler'),
   // csrf = require('csurf'),
    routes = require('./routes'),
    api = require('./routes/api'),
    DB = require('./accessDB'),
    app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(session({ 
    secret: 'mySecratekey', 
    saveUninitialized: true,
    resave: true }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/../'));
app.use(errorhandler());
//app.use(csrf());

/*app.use(function (req, res, next) {
    var csrf = req.csrfToken();
    res.cookie('XSRF-TOKEN', csrf);
    res.locals._csrf = csrf;
    next();
})*/

process.on('uncaughtException', function (error) {
    if (error) console.log(error, error.stack);
});

// default to a 'localhost' configuration:
var connection_string = 'localhost:27017/got_battles';
// if OPENSHIFT env variables are present, use the available connection info:
if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
  connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
  process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
  process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
  process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
  process.env.OPENSHIFT_APP_NAME;
}

var db = new DB.startup(connection_string);


app.get('/', routes.index);

// JSON API
var baseUrl = '/data/got_battles/';

app.get(baseUrl + 'list', api.getPlacesList);
app.get(baseUrl + 'count', api.getTotalCount);
app.get(baseUrl + 'stats', api.getStats);
//app.get(baseUrl + 'CustomerById/:id', api.customer);


// redirect all others to the index (HTML5 history)
app.get('*', routes.index);



var ip_addr = process.env.OPENSHIFT_NODEJS_IP   || '127.0.0.1';
var port    = process.env.OPENSHIFT_NODEJS_PORT || 3000;

app.listen(port,ip_addr, function () {
    console.log("got_battles Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
