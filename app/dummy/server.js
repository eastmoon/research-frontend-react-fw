// Ref : Moment.js, using to calculate time difference https://momentjs.com/docs/

// Import library
const args = require('args');
var jsonServer = require('json-server');
var _ = require("underscore")
var fs = require('fs')
var path = require('path');
var moment = require('moment');

// Defined server
let port = 7777;
let host = "localhost";

// Retrieve arguments
args
  .option('port', 'json-server will run at Port, default :', port)
  .option('host', 'json-server will run at Host, default :', host)

const flags = args.parse(process.argv)

if (flags.host) {
  console.log(`I'll be running on host ${flags.host}`)
  host = flags.host
}

if (flags.port) {
  console.log(`I'll be running on port ${flags.port}`)
  port = flags.port
}

// Create database from 'db'
var databaseDir = "db";
var scriptDir = "api";
var database = {};
var scripts = [];
var apis = [];

// 1. search directory function
function mergeDatabase(_dir, _sDir, _api) {
    var files = fs.readdirSync(_dir);
    var db = {};
    files.forEach((file) => {
        var fullname = path.join(_dir, file);
        var scriptname = path.join(_sDir, file);
        var apiName = path.join(_api, file);
        var stats = fs.statSync(fullname);
        // 1. if file is project directory, find *.json file by merge function
        if (stats.isDirectory()) {
            db[file] = mergeDatabase(fullname, scriptname, apiName);
            // 1.1 push api routes in array.
            apis.push(apiName);
            // 1.2 check service exist or not, if exist, import object in list
            var scriptfile = scriptname + ".js";
            if (fs.existsSync(scriptfile)) {
                scripts[apiName] = require("./" + scriptfile);
            }
        }
        // 2. if file is *.json, merge in database.
        if (stats.isFile()) {
            if (path.extname(file) === '.json') {
                _.extend(db, require(path.resolve(_dir, file)));
            }
        }
    });
    return db;
};
// 2. Merge database by function
database = mergeDatabase(databaseDir, scriptDir, "");

// Declare variable
var server = jsonServer.create();
var router = jsonServer.router(database);
var db = router.db;

// Add custom routes before JSON Server router
_.map(apis, (value, key, list) => {
    // 1. Retrieve api name
    let api = "";
    _.map(value.split('\\'), (value) => {
        if (value !== databaseDir) {
            api += "/" + value;
        }
    });
    console.log("[" + key + "] " + api);

    // 2. setting routes by custom script or default script
    if (scripts[value] != undefined && scripts[value].bind != undefined) {
        // 2.1 Bind custom service.
        scripts[value].bind(api, server, db);
    } else {
        // 2.2 Set default service router
        server.get(api, (req, res) => {
            // stdout info
            console.log("-- [" + req.method + "] " + req.url);
            // 1. Retrieve url params.
            console.log(req.query);
            // 2. Do action at params exist.
            // 3. Returen action result.
            let result = null;
            _.map(api.split('/'), (value, key) => {
                console.log(key, value);
                if (key === 0) {
                    result = db;
                } else if (result !== null) {
                    result = result.get(value);
                    console.log(value, result.value());
                }
            });
            res.jsonp(result);
        });
    }
});

// Start server
var middlewares = jsonServer.defaults();
server.use(middlewares);
server.use(router);
server.listen({
  host: host,
  port: port
}, function() {
    console.log('[*] Custom JSON Server is running');
    console.log('\t- http://%s:%s', host, port);
});;
