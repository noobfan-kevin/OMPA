/**
 * Created by YanJixian on 2015/10/30.
 */

var should = require('chai').use(require("chai-as-promised")).should();
var utils = require('./utils');
var path = require('path');
var roleData = require('./data/roleData');
var roleArray = null;
var _ = require('lodash');
var Role;
var roleService;
describe('用户模块', function () {
    before('初始化', function () {
        Role = process.core.db.models.Role;
        roleService = require(path.join(utils.getServerRoot(), 'src/service/roleService'));
        return Role.bulkCreate(_.values(roleData)).then(() => Role.findAll()).then((dbUsers) => roleArray = dbUsers);
    });

    after('after', function () {
        return Role.truncate({cascade: true});
    });

    //it('query条件查询', function () {
    //    return roleService.query({
    //        attributes: 'name',
    //        where: {
    //            level:0
    //        },
    //        offset: 0
    //        //limit: limit,
    //        //order: order,
    //        //include: include
    //    }).then(function (db) {
    //        return db.length.should.equal(1);
    //    });
    //});



});