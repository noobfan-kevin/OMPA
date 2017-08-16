
var crypto = require('crypto');
var utils = module.exports;
var config = require('../config');

utils.getProjectRoot = function(){
    var path = require('path');
    return path.join(__dirname,'../../../');
};


utils.encryptStr = function (str) {
    if (!str) {
        return '';
    }
    var hmac = crypto.createHmac('sha1', config.pwdKey);
    hmac.update(str);
    return hmac.digest('hex');
};

utils.toPromise = function (fn) {
    return function () {
        var args = [].slice.call(arguments);

        return new Promise(function (fulfill, reject){
            var callback = function (err, res){
                if (err) reject(err);
                else fulfill(res);
            };
            args.push(callback);
            fn.apply(null ,args);
        });
    };
};

utils.encode = function (str) {
    if (!str) return '';
    var res = [];
    for (var c of str) {
        res.push(c.codePointAt(0));
    }
    return res.join('\'');

};

utils.decode = function (str) {
    if (!str) return '';
    var arr = str.split('\'');
    var res = '';
    for (var c of arr) {
        res += String.fromCodePoint(c);
    }
    return res;
};

if ( require.main === module ) {
    var a;
    console.log( a = utils.encode('!@#$%^&*()的是的范德萨'));
    console.log(utils.decode(a));
}