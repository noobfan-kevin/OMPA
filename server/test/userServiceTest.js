/**
 * Created by YanJixian on 2015/10/30.
 */

var should = require('chai').use(require("chai-as-promised")).should();
var utils = require('./utils');
var path = require('path');
var userData = require('./data/userData');
var departmentData = require('./data/departmentData');
var roleData = require('./data/roleData');
var userArray = null;
var departmentArray = null;
var roleArray = null;
var _ = require('lodash');
var User;
var Department;
var Role;
var UserRole;
var userService;
var departmentService;
xdescribe('用户模块', function () {
    before('初始化', function () {
        User = process.core.db.models.User;
        Department = process.core.db.models.Department;
        Role = process.core.db.models.Role;
        UserRole = process.core.db.models.UserRoles;
        userService = require(path.join(utils.getServerRoot(), 'src/service/userService'));
        departmentService = require(path.join(utils.getServerRoot(), 'src/service/departmentService'));

    });

    beforeEach('插入数据。', function () {
        return  Promise.all([
            Department.bulkCreate(_.values(departmentData)).then(() => Department.findAll()).then((dbs) => departmentArray = dbs),
            User.bulkCreate(_.values(userData)).then(() => User.findAll()).then((dbUsers) => userArray = dbUsers),
            Role.bulkCreate(_.values(roleData)).then(() => Role.findAll()).then((dbRoles) => roleArray = dbRoles)])
            .then(function(dbs){
               return dbs[1][0].addRole(dbs[2][0]);
            })
            .catch(function (err) {
                console.log(err.stack)
            });
    });

    afterEach('清理数据', function () {
        return Promise.all([
            Department.truncate({cascade: true}),
            User.truncate({force:true, cascade: true}),
          //  Role.truncate()




        ]).catch(function(err){
            console.log(err);
        });
    });

    //after('after', function () {
    //    return User.truncate({cascade: true});
    //});

    it('create建立用户', function () {
        var user = {
            username: "wang",
            password: "123456",
            online: 0,
            label: '我也只是测试',
            weChat: '123456',
            name: '小黄人',
            address: '模式楼303',
            phone: '12345678908',
            email: '1293@qq.com',
            position: '总监',
            points: 0,
            roles: [

            ]
        };

        return userService.create(user).then(function (db) {
            return db.get('username').should.equal(user.username);
        }).catch((err) =>
        console.log(err));
    });

    it('findOrCreate建立用户,已存在不再创建', function () {
        return userService.findOrCreate({username: userData.user1.username}, userData.user1).spread(function (db, isCreated) {
            return isCreated.should.equal(false);
        });
    });

    it('getById根据id查找用户', function () {
        return userService.getById(userArray[1].id).then(function (db) {
            return db.get('username').should.equal(userArray[1].username);
        });
    });
    it('getByUsername根据用户名查找用户', function () {
        return userService.getByUsername(userArray[1].username).then(function (db) {
            return db.id.should.equal(userArray[1].id);
        });
    });
    it('queryByName根据真是姓名查找', function () {
        return userService.queryByName('佳').then(function (db) {
            return db.length.should.equal(2);
        });
    });
    // todo
    //it('queryByDepartmentId根据真是姓名查找', function () {
    //    return userService.queryByDepartmentId(userArray[1].departmentId).then(function (db) {
    //        return db.length.should.equal(2);
    //    });
    //});
    it('updateById更新', function () {
        return userService.updateById(userArray[1].id,{name:userArray[2].name, roles:[]}).then(function (db) {
            return db.name.should.equal(userArray[2].name);
        });
    });

    it('changeOnlineStatus修改在线状态', function () {
        return userService.changeOnlineStatus(userArray[1].id,userArray[2].online).then(function (db) {
            return db.online.should.equal(userArray[2].online);
        });
    });
    it('deleteById根据编号删除', function () {
        return userService.deleteById(userArray[1].id, false).then(function () {
            return User.findById(userArray[1].id).then (function(db) {
                return should.not.exist(db);
            });
        });
    });
    it('deleteById根据编号惰性删除', function () {
        return userService.deleteById(userArray[1].id).then(function () {
            return User.findById(userArray[1].id, {paranoid: false}).then (function(db) {
                return should.exist(db);
            });
        });
    });
    it('userTotal用户数量总和', function () {
        return userService.userTotal().then(function (db) {
            return db.count.should.equal(userArray.length);
        });
    });
    it('resetPassword重置密码', function () {
        return userService.resetPassword(userArray[1].phone,userData.user2.password).then(function (db) {
            return db.password.should.equal(userArray[2].password);
        });
    });
    it('changePassword修改密码', function () {
        return userService.changePassword({
            username:userArray[0].username,
            oldPassword:'123456',
            newPassword:'111'
        }).then(function (db) {
            return db.password.should.equal(utils.encryptStr('111'));
        });
    });
    it('login登录', function () {
        return userService.login('admin','123456').then(function (db) {
            return db.ok.should.be.true;
        });
    });

    it('assignUserToDepartment给用户分配部门', function () {

        return userService.assignUserToDepartment(userArray[1].id, departmentArray[1].id).then(function () {
            return User.findById(userArray[1].id).then((dbUser) => dbUser.departmentId.should.equal(departmentArray[1].id));
        });
    });

    it('assignUsersToDepartment给多个用户分配部门', function () {

        var ids = userArray.map((user) => user.id);
        return userService.assignUsersToDepartment(ids, departmentArray[1].id).then(function () {
            return userService.queryByDepartmentId(departmentArray[1].id).then((dbUsers) => dbUsers.length.should.equal(ids.length));
        });
    });
    it('queryUserByRole根据role查询用户', function () {
        //var roles = [roleArray[0].level,roleArray[1].level];
        return userService.queryUserByRole([0]).then(function (data) {
            return data.length.should.equal(1);
        });
    });

});