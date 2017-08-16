/**
 * Created by Yang on 2014/10/30.
 */
var dbConfig = require('../config').dbConfig;
if (process.env.TEST) {
    dbConfig = require('../config').dbTestConfig;
}
var Sequelize = require('sequelize');
var fs = require('fs');
var path = require('path');
var db = module.exports;
var utils = require('./utils');
var log = require('./Logger');


db.conn = sequelize = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, dbConfig);

db.models = {};

var readdir = utils.toPromise(fs.readdir);
db.loadModels = function(){
    var dir = path.join(__dirname,'../models');
    return readdir(dir).then(function(files) {
        files.forEach(function(file){
            var name = file.split('.')[0];
            var file_path = path.join(dir,name);
            db.models[name] = require(file_path);
        });
        for (var modelName of Object.keys(db.models)) {
            if ("associate" in db.models[modelName]) {
                db.models[modelName].associate(db.models);
            }
        }
        return sequelize.sync({force: dbConfig.reCreateDB});
    }).catch(function(err) {
        log.error(err);
    });
};

if (require.main === module) {
    db.loadModels();
}
