/**
 * Created by wangziwei on 2015/11/17.
 */

var User = process.core.db.models.User;
var Role = process.core.db.models.Role;
var Authority = process.core.db.models.Authority;
var Department=process.core.db.models.Department;
var Project = process.core.db.models.Project;
var ProjectMember=process.core.db.models.ProjectMember;
var CreditsDetail=process.core.db.models.CreditsDetail;
var utils = process.core.utils;
var config = process.core.config;
var async = require('async');
var fs = require('fs');
var path = require('path');

var departmentService = require('./departmentService');
var roleService = require('./roleService');

var userService = module.exports;

/**
 * Created by hk60 on 16/5/12.
 */
userService.getUsersByDepartmentId = function(id){
    return User.findAndCountAll({
        where:{departmentId:id}
    });
};


userService.create = function (user) {
    return User.create(user).then(function (dbUser) {   
        return userService.assignUserRoles(dbUser, user.roles);
    }).then(() => userService.getByUsername(user.username) );
};

userService.createAll = function (users) {
    return User.bulkCreate(users);
};

/**
 *
 * @param where
 * @param user
 * @param useTransact 是否用事务，慢！
 * @returns {Promise.<Instance, created>} .spread((function(user, created){})
 */
userService.findOrCreate = function (where , user, useTransact) {
    if (useTransact) {
        return User.findOrCreate({where: where, defaults: user});
    } else {
        return User.findCreateFind({where: where, defaults: user});
    }
};

userService.getById = function (id) {
    return User.findById(id,{include: [Project]});
};

userService.getByUsername = function (username) {
    return User.all({
        where: {username: username}
    });
};
userService.queryByName = function (name) {
    return User.all({
        where: {
            name: {
                $iLike: '%' + name + '%'
            }
        },include:[Role,Department]
    });
};

userService.queryByDepartmentId = function (id) {
    return User.all({
        where: {departmentId: id}
    });
};

userService.queryByGroupId = function (id) {
    return User.all({
        where: {group: id}
    });
};

userService.updateById = function (id, user) {

    return userService.getById(id).then(function (dbUser) {

        // 处理密码没做修改情况
        if(user.password === dbUser.password){
            delete user.password
        }

        // 删除磁盘中之前的头像
        if(user.image){
            if( (user.image != dbUser.image) && (dbUser.image != 'defaultAvatar.jpg') ){
                fs.unlink( path.join(config.uploadPath,dbUser.image), function(status) {
                    if(!status){
                        console.log('删除disk之前头像');
                    }else{
                        console.error(status.message);
                    }
                } );
            }
        }

        return dbUser.update(user).then(function (dbU) {
            if (user.roles)
                return userService.changeRole(dbUser, user.roles);
            else
                return dbU;
        });
    });
};

/**
 *
 * @param id
 * @param status    在线状态
 */
userService.changeOnlineStatus = function (id, status) {
    return userService.getById(id).then(function (dbUser) {
        return dbUser.update({online: status});
    });
};

/**
 *
 * @param id
 * @param isForce 是否是完全删除
 * @returns {*}
 */
userService.deleteById = function (id, isForce) {
    return userService.getById(id).then(function (dbUser) {
        return dbUser.destroy({ force: isForce || false });
    });
};

/**
 *
 * @param args attributes:查询字段,where:查询条件,offset:跳过数据条数,limit:查询数据条数,order:排序,include:关联
 * 参考：http://note.youdao.com/groupshare/?token=1851646F75074E9C88180593AD747223&gid=11001280
 * @returns promise
 */
userService.query = function (args) {
    if (!args) {
        args = {};
    }
    var attributes = args.attributes;
    var where = args.where || {};
    var offset = args.offset || 0;
    var limit = args.limit;
    var order = args.order || [['f_ui_name']];
    var include = args.include || [Role];
    return User.all(
        {
            attributes: attributes,
            where: where,
            offset: offset,
            limit: limit,
            order: order,
            include: include
        }
    );
};

userService.userTotal = function (option) {
    return User.findAndCountAll(option);
};


/**
 *
 * @param phoneNumber
 * @param password
 */
userService.resetPassword = function (phoneNumber, password) {
    return User.findOne({
        where: {phone: phoneNumber}
    }).then(function(dbUser){
        return dbUser.update({password: password});
    });
};

/**
 *
 * @param option include username, oldPassword, newPassword
 */
userService.changePassword = function (option) {
    return User.findOne({
        where: {username: option.username,password: utils.encryptStr(option.oldPassword)}
    }).then(function(dbUser){
        return dbUser.update({password: option.newPassword});
    });
};

/**
 *
 * @param user
 * @param roleIds [ids]
 * @returns {Promise|Promise.<T>|*}
 */
userService.changeRole = function (user, roleIds) {
    var promise1;
    if (typeof user === 'string') {
        promise1 = userService.getById(user);
    } else {
        promise1 = Promise.resolve(user);
    }

    var promise2 = roleService.query({where: {id: {$in: roleIds}}});

    return Promise.all([promise1, promise2]).then((dbs) => dbs[0].setRoles(dbs[1])).then(() => promise1  );
};


/**
 *
 * @param username
 * @param password
 */
userService.login = function (username, password) {
    return User.findOne({
        where: {username: username},
        include: [Role, Project]
    }).then(function(dbUser){
        // 挂载权限名
        if(dbUser)
        {
            return Role.findById(dbUser.roleId,{
                include:[Authority]
            }).then(function(dbRole) {
                dbUser.dataValues.authorities = [];
                dbRole.Authorities.forEach(function(val) {
                    dbUser.dataValues.authorities.push(val.name)
                });
                return dbUser;
            });
        }
        return dbUser;
    }).then(function(dbUser) {
        if (!dbUser) {
            return Promise.resolve({ok: false, message: '用户名不存在。'});
        } else if (dbUser.password === utils.encryptStr(password)) {
            return Promise.resolve({ok: true, value: dbUser});
        } else {
            return Promise.resolve({ok: false, message: '登录信息错误。'});
        }
    });
};

userService.assignUserRoles = function (user, roleIds) {
    var promise1;
    if (typeof user === 'string') {
        promise1 = userService.getById(user);
    } else {
        promise1 = Promise.resolve(user);
    }

    var promise2 = roleService.query({where: {id: {$in: roleIds}}});

    return Promise.all([promise1, promise2]).then((dbs) => dbs[0].addRoles(dbs[1]));
};

/**
 * 为一个用户分配部门
 * @param userId
 * @param departmentId
 */
userService.assignUserToDepartment = function (userId, departmentId) {

    var promise1 = departmentService.getById(departmentId);
    var promise2 = userService.getById(userId);

    return Promise.all([promise1, promise2]).then((dbs) => dbs[0].addUser(dbs[1]));
};

/**
 * 为多个用户分配部门
 * @param userIds
 * @param departmentId
 */
userService.assignUsersToDepartment = function (userIds, departmentId) {
    var promise1 = departmentService.getById(departmentId);
    var promise2 = userService.query({where: {id: {$in: userIds}}});

    return Promise.all([promise1, promise2]).then((dbs) => dbs[0].addUsers(dbs[1]));
};

/**
 * 根据role查询用户
 * @param roles
 */
userService.queryUserByRole = function(roles){
    return userService.query({
        include: [{
            model: Role,
            where: { level: {$in:roles}}
        }]
    });
};
/**
 * 获得全部用户
 */
userService.getUserAll = function(roles){
    return User.all();
};
/**
 * 根据项目ID取成员
 * @param proId
 */
userService.queryUserByProjectId = function(proId){
    return ProjectMember.findAll({
        where: {
            projectId2: proId
        }
    });
};

userService.updateDefProj=function(projectId,userid){
    return userService.getById(userid).then(function (dbUser) {
        return dbUser.update({lastVisit: projectId});
    });
};
/*my
* 新建/编辑用户
* */
userService.createUser=function(user,offset){
    if(user.id){
        return User.find({where:{id:user.id}}).then(function(olduser){
            return olduser.update(user).then(function(data){
                return userService.getTenUsers(offset).then(function(allUsers){
                    return {message:'updateSuccess',user:allUsers};

                });
            });
        });
    }else {
        return User.find({where:{username:user.username}}).then(function(originUser){
            if(originUser){
                return false;
            }
            else{
                return User.create(user).then(function(users){
                    return userService.getTenUsers(0).then(function(Tenusers){
                        return userService.getCount().then(function(num){
                            return {user:Tenusers,count:num.page,all:num.count};
                        });
                    });
                });
            }
        });
    }
  };

/*
* 查询所有用户列表
* */
userService.selectAllusers=function(){
    return User.findAll({include:[Department,Role],where:{departmentId:{$ne:null}}});
};
userService.selectByDR=function(depLists,roleLists,userType){
    var where = {};
    if(roleLists.length!=0){
        where.roleId={$in:roleLists};
    } if(depLists.length!=0){
        where.departmentId={$and:{$in:depLists,$ne:null}};
    }if(userType.length!=0){
        where.userType={$in:userType};
    }
    return User.findAll({include:[Department, Role],where:{$and:(where)}});
};
userService.selectByRoleNull=function(depLists){
    //console.log('到服务器了');
    return User.findAll({include:[Department, Role],
        order:[ ['createdAt','DESC']],
        where:{
            departmentId:{
                $and:{
                    $in:depLists,
                    $ne:null
                }
            },
        }
    });
};
userService.selectByDepartmentNull=function(roleLists){
    //console.log('到服务器了');
    return User.findAll({include:[Department, Role],
        order:[ ['createdAt','DESC']],
        where:{
            roleId:{
                in:roleLists
            },
            departmentId:{
                $ne:null
            }
        }
    });
};

/*
* 根据name查询一个用户的信息
* */
userService.selectUser=function(data) {
    return User.find({include: [Department, Role], where: {id: data}});
};
/*
* 删除一个用户
* */
userService.deleteUser=function(id,offset){
    return User.findOne({where:{id:id}}).then(function(userdata){
            return User.destroy({where:{id:id}}).then(function(deUser){
              return  userService.selectAllusers().then(function(userAll){
                  var usernum=userAll.length;
                  if(usernum!=0){
                      if((usernum%10)!=0){
                          return  userService.getTenUsers(offset).then(function(usersData){
                              return userService.getCount().then(function(num){
                                  return {user:usersData,count:num.page,all:num.count};
                              });
                          });
                      }else{
                          if(offset>=1){
                              return  userService.getTenUsers(offset-1).then(function(usersData){
                                  return userService.getUserCount().then(function(num){
                                      return {user:usersData,count:num};
                                  });
                              });
                          }else{
                              return  userService.getTenUsers(offset).then(function(usersData){
                                  return userService.getUserCount().then(function(num){
                                      return {user:usersData,count:num};
                                  });
                              });
                          }
                      }
                  }else{
                      return {user:0,count:0};
                  }
              });
             });
        });
};
/*
 * 分页查询，显示
 * */
userService.getTenUsers=function(offset){
    return User.findAll({
        include:[Department,Role],
        order:[ ['createdAt','DESC']],
        attributes:['id','username','name','departmentId','roleId','phone','createdAt'],
        where:{departmentId:{$ne:null}},
        offset:offset*10,
        limit:10
    });
};

/*
* 最后一页数据
* */
userService.getLastUser=function(){
    return userService.selectAllusers().then(function(allusers){
        var len=allusers.length;
        var lastOff=Math.floor(len/10);
        if((len%10)!=0){
            return userService.getTenUsers(lastOff).then(function(userdata){
                return {data:userdata,len:lastOff};
            });
        }else{
            return userService.getTenUsers((Math.floor(len/10)-1)).then(function(datauser){
                return {data:datauser,len:(Math.floor(len/10)-1)};
            });
        }
    });
};

/*
* 获取个人积分详情
* */
userService.getUsersPoint=function(data){
    return CreditsDetail.findAll({limit:10,offset:data.offset*10,where:{userId:data.userId},order:[ ['createdAt','DESC']]}).then(function(db){
        return CreditsDetail.findAndCountAll({where:{userId:data.userId}}).then(function(count){
            var counts=count.count;
            var createDate='';

            var array=[];
            for(var i=0;i<db.length;i++){
                createDate=userService.formatDateTime(db[i].createdAt);
                array.push({
                    id:db[i].id,
                    score:db[i].score,
                    type:db[i].type,
                    taskVersionId:db[i].taskVersionId,
                    taskVersionName:db[i].taskVersionName,
                    progressId:db[i].progressId,
                    progressName:db[i].progressName,
                    createdAt:createDate,
                    version:db[i].taskVersion
                });
            }
            return {page:Math.ceil(counts/10),count:counts,list:array};

        });
    });
}
userService.formatDateTime = function (date) {
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    var minute = date.getMinutes();
    var second=date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second =second<10 ?('0'+second):second;
    return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;
};
/*
* 获取所有角色的权限
*
* */
userService.getAllRoles=function(){
   return Role.findAll({include:[Authority],order:[["createdAt"]]});
};
/*
* 获取一个用户所处角色的权限
* */
userService.getOneUserAuth=function(id){
    return Role.findAll({include:[Authority],where:{id:id}});
};

/**
 * 获取当前页数
 *
 * */
userService.getCount=function(){
  return User.findAndCountAll({where:{departmentId:{$ne:null}}}).then(function(users){
      var counts=users.count;
      if(counts%10!=0){
          return {page:parseInt(counts/10)+1,count:counts};
      }else{
          return {page:parseInt(counts/10),count:counts};
      }
  });
};
/***
 * 查询一个部门下的所有人员
 * */
userService.getDepartmentUser=function(departmentId){
    return User.findAll({attributes:['id','username','name','departmentId','roleId'],where:{departmentId:departmentId}}).then(function(departmentUsers){
        return departmentUsers;
    });
};
/**
 * 获取人员信息中是外部人员和外部企业
 *
 * */
userService.getOuterUsers=function(){
     return  User.findAll({include:[Role],where:{userType:{$in:[1,2]}}});
};

/*
*在外部人员和外部企业中进行搜索
*
* */
userService.selectOuterUsers=function(name){
    return  User.findAll({include:[Role],
        where:{userType:{$in:[1,2]},name:{$like:'%'+name+'%'}}
    });
};
