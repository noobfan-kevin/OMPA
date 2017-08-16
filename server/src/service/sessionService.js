/**
 * Created by hk61 on 2016/7/6.
 */

var Session = process.core.db.models.Session;

var userService = module.exports;

userService.getAll = function() {
    return Session.all()
};

userService.create = function(sessionInfo) {
    return Session.create(sessionInfo)
};

userService.deleteByKey = function(key) {
    return Session.destroy({
        where: {
            key: key
        }
    })
};

userService.clear = function(key) {
    return Session.destroy();
};

userService.getByKey = function(key) {
    return Session.findOne({
        where: {
            key: key
        }
    })
};