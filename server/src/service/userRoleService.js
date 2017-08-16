/**
 * Created by hk054 on 2016/3/17.
 */
var User = process.core.db.models.User;
var utils = process.core.utils;
var async = require('async');

var userRoleService = module.exports;

userRoleService.getById = function (id) {
    return User.find({where:{roleId:id}});
};
//{where:{id:id}}