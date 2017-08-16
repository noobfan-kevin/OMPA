/**
 * Created by hk61 on 2016/3/28.
 */

var Sequelize = require('sequelize');
var importConfig = require('./importConfig');
var path = require('path');
var fs = require('fs');
var userInfo = require('./aliasMap/userInfo');

sequelize = new Sequelize(importConfig.source_server.database,
    importConfig.source_server.user,
    importConfig.source_server.password,
    importConfig.source_server);

var importDb = module.exports = {};

var models = {};
!function loadModels(){
     var dir = path.join(__dirname,'../src/models');
     var files = fs.readdirSync(dir);

     files.forEach(function(file){
         var name = file.split('.')[0];
         var file_path = path.join(dir,name);
         models[name] = require(file_path);
     });
}();


/*
* 为表fields添加默认值
* 
* @Param {JSON} rowData 表的一行数据
* @Param {JSON} fields 键值对集合
* */
function addDefaults(rowData, fields) {
    for(var field in fields){
        rowData[field] = fields[field];
    }
}


/*
* 返回sql方式的别名
* 
* @Param {JSON} fields 字段与别名的映射 ，例：{username: "admin", password: "123456"}
* @return {String}  返回sql查询方式的别名连接，例："PK_UI_Id" AS id,"F_UI_UserName" AS username …
* */
function aliasSQL(fields) {
    var aAlias = []
        , queryAlias = '';

    for(var k in fields){
        if( fields[k] ){
            aAlias.push('"' + k + '" AS ' + fields[k]);
        }
    }
    queryAlias = aAlias.join();
    return queryAlias;
}



importDb.importUserInfo = function() {
    var queryStr = 'SELECT ' + aliasSQL(userInfo.fields) +' FROM "T_UserInfo"';
    var User = models.User;
    var Role = models.Role;
    var Department = models.Department;
    sequelize.query(queryStr).spread(function(dbUsers, metadata) {

        var PromiseRoleId = Role.find({
                where: {
                    name: '普通人员'
                }
            }).then(function(dbRole) {
                return  dbRole ? dbRole.id : '';
            });

        var PromiseDepartmentId = Department.find({
                where: {
                    fatherId:null
                }
            }).then(function(dbDepartment) {
                return  dbDepartment ? dbDepartment.id : '';
            });

        Promise.all([PromiseRoleId, PromiseDepartmentId]).then(function(dbDefault) {
            dbUsers.forEach(function(user) {
                addDefaults(user,{
                    image: 'defaultAvatar.jpg',
                    roleId: dbDefault[0],
                    departmentId:dbDefault[1]
                });
                User.create(user).then(function(newUser) {
                    console.log('添加用户' + newUser.username + '成功');
                }).catch(function(err) {
                    throw new Error('添加用户 ' + user.username +' 失败！' + err.message);
                })
            })
        }).catch(function(err) {
            throw new Error(err.message);
        });

    });

};

importDb.importAll = function() {

    this.importUserInfo();

};


