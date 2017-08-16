/**
 * Created by Wangziwei on 2015/10/30.
 */

var should = require('chai').use(require("chai-as-promised")).should();
var utils = require('./utils');
var path = require('path');
var projectData = require('./data/projectData');
var projectArray = null;
var _ = require('lodash');
var Project;
var projectService;
var userData = require('./data/userData');
var userArray = null;
var User;
var ProjectMember;
xdescribe('项目模块', function () {
    before('初始化', function () {
        Project = process.core.db.models.Project;
        User = process.core.db.models.User;
        ProjectMember = process.core.db.models.ProjectMember;
        projectService = require(path.join(utils.getServerRoot(), 'src/service/projectService'));
    });
    beforeEach('插入数据。', function () {
        return User.bulkCreate(_.values(userData)).then(() => User.findAll()).then(function (dbUsers) {
            userArray = dbUsers;
            _.values(projectData).forEach((prj) => prj.creatorId = dbUsers[1].id);
            return Project.bulkCreate(_.values(projectData)).then(() => Project.findAll()).then((dbs) => projectArray = dbs);
        }).then(() =>
            projectArray[0].addUsers(userArray, {job: 0})
        ).catch((err) =>
            console.log(err));
    });

    afterEach('清理数据', function () {
        return Promise.all([ Project.truncate({cascade: true}),
            User.truncate({cascade: true,force:true})]);
    });

    xit('getById根据id查询项目信息', function () {
        return projectService.getById(projectArray[0].id).then(function (db) {

            projectArray[0].getUsers({ include: [{ model:ProjectMember ,  where: { job:0 }  }] }).then(function(users){
            //    console.log(1111,users[0].ProjectMember.get('userId'));
            }).catch(function(err){
                console.log(err);
            });
            return db.get('name').should.equal(projectArray[0].name);
        });
    });

    it('getByProjectName根据项目名称查询', function () {
        return projectService.getByProjectName(projectArray[1].name).then(function (db) {
            return db.id.should.equal(projectArray[1].id);
        });
    });

    it('updateById更新', function () {
        return projectService.updateById(projectArray[1].id,{name:projectArray[2].name}).then(function (db) {
            return db.name.should.equal(projectArray[2].name);
        });
    });

    it('projectCount项目数量总和', function () {
        return projectService.projectCount().then(function (db) {
            return db.should.equal(3);
        });
    });
    it('addMembers添加项目成员', function () {
        return projectService.addMembers(projectArray[1].id,[userArray[0].id,userArray[1].id],1,projectArray[1].id).then(function (db) {
            //return db.length.should.equal(3);
            console.log(db)
        });
    });
    it('queryLeaderByPrjId根据项目查询管理人员信息', function () {
        return projectService.queryRoleByPrjId(projectArray[0].id).then(function (db) {
            //return db.should.equal(3);
         //   console.log(db.toJSON())

        });
    });
    it('query查询项目列表', function () {
        return projectService.query({
            where:{'creatorId':userArray[1].id,'status':1,'parentId':null}
        }).then(function (db) {
            console.log(db.length);
        });
    });



    it('deleteById根据编号删除', function () {
        return projectService.deleteById(projectArray[1].id).then(function (db) {
            return db.length.should.equal(0);
        });
    });
});