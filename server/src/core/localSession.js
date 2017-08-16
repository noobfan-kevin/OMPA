/**
 * Created by YanJixian on 2014/11/18.
 */


var uid = require('uid-safe');
var logger = require('./Logger');
var DefaultStore = function () {
    this.cache = {};
};

DefaultStore.prototype.save = function (key, value, callback) {

    this.cache[key] = value;
    callback && setImmediate(callback);
};

DefaultStore.prototype.get = function (key, callback) {
    setImmediate(callback, null, this.cache[key]);
};

DefaultStore.prototype.getTotal = function (callback) {
    setImmediate(callback, null, Object.keys(this.cache).length);
};

DefaultStore.prototype.delete = function (key, callback) {
    //this.cache[key] = undefined;
    delete this.cache[key];
    callback && setImmediate(callback);
};

DefaultStore.prototype.clear = function (callback) {
    this.cache = {};
    callback && setImmediate(callback);
};

/**
 * Session model.
 *
  * @api private
 */
function Session(ops) {
    ops = ops || {};
    this.maxAge = ops.maxAge || 60 * 60 * 24* 1000;
    this.storage = ops.storage || new DefaultStore();
}

/**
 * Return how many values there are in the session's cache object.
 *
 * @return {Number}
 * @api public
 */
Session.prototype.length = function(callback){
    this.storage.getTotal(function (err, total) {
        if (err) {
            logger.error(err.stack);
            return callback(null);
        }
        callback(total);
    });
};

/**
 * clear all the cache
 */
Session.prototype.clear = function () {
    this.storage.clear(function (err) {
        if (err)
        logger.error(err.stack);
    });
};

Session.prototype.setItem = function (key, value) {
    if (typeof  value === 'undefined') {
        throw new Error('you must offer a value.');
    }
    if (!value.value) {
        value = {value: value};
    }
    if (value.maxAge === undefined) {
        value.maxAge = this.maxAge;  //默认一天
    }
    value.createTime = Date.now();
    this.storage.save(key, value, function (err) {
        if (err)
        logger.error(err.stack);
    });
};

Session.prototype.setItemAuto = function (value) {
    if (!value) throw new Error('you must offer a value.');
    var key = uid.sync(16);
    this.setItem(key, value);
    return key;
};


Session.prototype.getItem = function (key, callback) {
    if ( !key ) return callback(null);
    var that = this;
    this.storage.get(key, function (err, value){
        if (err) {
            logger.error(err.stack);
            return callback(null);
        }
        if (!value) {
            return callback(null);
        }
        if (!that.hasExpired(value)) {
            return callback(value.value);
        } else {
            logger.warn('The session '+ key +' is expired.');
            that.storage.delete(key);
            return callback(null);
        }
    });

};

Session.prototype.removeItem = function (key) {
    this.storage.delete(key, function (err) {
        if (err)
        logger.error(err.stack);
    });
};

Session.prototype.hasExpired = function (value) {

    var now = new Date().getTime();
    if (value.maxAge === 0) {
            return false;
    }

    return now > (value.createTime + value.maxAge);
};

module.exports = function (ops) {
    var sess = new Session(ops);

    return function localSession(req, res, next) {

        Object.defineProperty(req, 'session', {
            get:  function(){
                if (sess) return sess;
                else return null;
            },
            set: function(val){
                if (null == val) return sess = false;
                if (val instanceof Session) return sess = val;
                throw new Error('req.session can only be set as null or a session object.');
            }
        });

        next();
    }
};
