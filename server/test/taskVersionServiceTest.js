/**
 * Created by YanJixian on 2015/10/30.
 */

var should = require('chai').use(require("chai-as-promised")).should();
var utils = require('./utils');
var path = require('path');
var taskData = require('./data/taskVersionData');
var userData = require('./data/userData');
var taskVersionArray = null;
var userArray = null;
var _ = require('lodash');
var taskVersion;
var taskVersionService;
var User;
xdescribe('任务卡版本模块', function () {
    before('初始化', function () {
        taskVersion = process.core.db.models.TaskVersion;
        taskVersionService = require(path.join(utils.getServerRoot(), 'src/service/taskVersionService'));
        User = process.core.db.models.User;
        return User.bulkCreate(_.values(userData)).then(() => User.findAll()).then(function (dbUsers) {
            userArray = dbUsers;
            return taskVersion.bulkCreate(_.values(taskData)).then(function(){
                return taskVersion.findAll()
            }).then(
                (dbs) => taskVersionArray = dbs);
        }).then(() =>
            taskVersionArray[0].setSender(userArray[0])
        ).then(() =>
            taskVersionArray[0].seteceiver(userArray[0])
        ).catch((err) =>
            console.log(err));

    });

    after('after', function () {
        return taskVersion.truncate({cascade: true});
    });

    it('getById根据id查找任务卡版本', function () {
        return taskVersionService.getById(taskVersionArray[1].id).then(function (db) {
            return db.get('name').should.equal(taskVersionArray[1].name);
        });
    });

    it('updateById更新', function () {
        return taskVersionService.updateById(taskVersionArray[1].id,{points:taskVersionArray[2].points}).then(function (db) {
            return db.points.should.equal(taskVersionArray[2].points);
        });
    });

    it('taskVersionTotal任务卡版本数量', function () {
        return taskVersionService.taskVersionTotal().then(function (db) {
            return db.should.equal(3);
        });
    });
    it('getByReceiverId根据所属接收人编号查询', function () {
        return taskVersionService.getByReceiverId(userArray[0].id).then(function (db) {
            console.log(1111,db)
        });
    });
});