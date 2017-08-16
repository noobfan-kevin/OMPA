/**
 * Created by hk61 on 2016/7/6.
 */

var _ = require('lodash');
var sessionService = require('../service/sessionService');


var PostgreStore = module.exports = function (options) {
    this.options = options || {};
};


PostgreStore.prototype.save = function (key, value, callback) {
    if (!callback) callback = _.noop;
    value.key = key;

    sessionService.create(value).then(function() {
        callback();
    }).catch(function(err) {
        callback(err);
    });
};

PostgreStore.prototype.get = function (key, callback) {
    if (!callback) callback = _.noop;

    sessionService.getByKey(key).then(function(db) {
        callback(db);
    }).catch(function(err) {
        callback(err);
    });
};

PostgreStore.prototype.getTotal = function (callback) {
    if (!callback) callback = _.noop;

    sessionService.getAll().then(function(dbs) {
        callback(dbs);
    }).catch(function(err) {
        callback(err);
    });
};

PostgreStore.prototype.delete = function (key, callback) {
    if (!callback) callback = _.noop;

    sessionService.deleteByKey(key).then(function(result) {
        callback(result);
    }).catch(function(err) {
        callback(err);
    });
};

PostgreStore.prototype.clear = function (callback) {
    if (!callback) callback = _.noop;

    sessionService.clear().then(function(result) {
        callback(result);
    }).catch(function(err) {
        callback(err);
    });
};