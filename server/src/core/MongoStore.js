/**
 * Created by YanJixian on 2015/7/27.
 */

var _ = require('lodash');
var client = require('mongodb').MongoClient;
var EventEmitter = require('events').EventEmitter;

/**
 * Default options
 */
var defaultOptions = {
    // Legacy strategy default options
    host: '127.0.0.1',
    port: 27017,
    db: '',
    w: 1,

    // Global options
    collection: 'sessions',
    auto_reconnect: true,
    ssl: false
};

var MongoStore = module.exports = function (options) {
    this.options = _.defaults(options || {}, defaultOptions);
    this.state = 'disconnected';
    this.init();
};

var fn = MongoStore.prototype = Object.create(EventEmitter.prototype);

fn.changeState = function (state) {
    this.state = state;
    this.emit(state);
    return this;
};

fn.buildMongoOptions = function () {

    var options = this.options;

    options.url = 'mongodb://';

    if (options.username) {
        options.url += options.username + ':' + (options.password || '') + '@';
    }

    options.url += options.host + ':' + options.port + '/' + options.db;

    if (options.ssl) options.url += '?ssl=true';

    if (!options.mongoOptions) {
        options.mongoOptions = {
            server: { auto_reconnect: options.autoReconnect },
            db: { w: options.w }
        };
    }

    return this;
};

fn.init = function () {
    var that = this;
    that.changeState('init');
    that.buildMongoOptions();
    client.connect(this.options.url, this.options.mongoOptions || {}, function(err, db) {
        if (err) {
            that.changeState('disconnected');
            throw err;
        } else {
            that.db = db;
            that.collection = that.db.collection(that.options.collection);
            that.changeState('connected');
        }
    });
    that.changeState('connecting');
};

fn.getCollection = function (done) {
    var that = this;
    switch (this.state) {
        case 'connected':
            done(null, that.collection);
            break;
        case 'connecting':
            this.once('connected', function () {
                done(null, that.collection);
            });
            break;
        case 'disconnected':
            done(new Error('Not connected'));
            break;
    }
};

MongoStore.prototype.save = function (key, value, callback) {
    if (!callback) callback = _.noop;
    this.getCollection(function (err, collection) {
        if (err) return callback(err);
        value._id= key;
        collection.updateOne({_id: key}, value, {upsert: true, safe: true}, function(err) {
            callback(err);
        });
    });
};

MongoStore.prototype.get = function (key, callback) {
    if (!callback) callback = _.noop;
    this.getCollection(function (err, collection) {
        if (err) return callback(err);
        collection.findOne({_id: key}, function(err, session) {
           callback(err, session);
        });
    });
};

MongoStore.prototype.getTotal = function (callback) {
    if (!callback) callback = _.noop;
    this.getCollection(function(err, collection) {
        if (err) return callback(err);
        collection.count({}, function(err, count) {

            callback(err, count);
        });
    });
};

MongoStore.prototype.delete = function (key, callback) {
    if (!callback) callback = _.noop;
    this.getCollection(function(err, collection) {
        if (err) return callback(err);
        collection.remove({_id: key}, function(err) {

            callback(err);
        });
    });

};

MongoStore.prototype.clear = function (callback) {
    if (!callback) callback = _.noop;
    this.getCollection(function(err, collection) {
        if (err) return callback(err);
        collection.drop(function(err) {
            callback(err);
        });
    });
};