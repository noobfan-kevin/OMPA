/**
 * Created by yang on 15/1/12.
 */

var express = require('express');
var router = module.exports = express.Router();
var userService = require('../service/userService');
var ProjectService = require('../service/projectService');
var MessageStatusService = require('../service/messageStatusService');
var async = require('async');
var roles = require('../core/auth').roles;
   
var io = process.core.io;

/**
 * Created by hk60 on 16/5/12.
 */
router.get('/departmentMembers/:departmentId', (req, res, next) =>{
    var departmentId = req.params.departmentId;
    userService.getUsersByDepartmentId(departmentId).then( data => {
        res.json(data)
    }).catch(err => next(err));
});


/**
 * @api {get} /api/user/exist 用户是否存在
 * @apiName UserIsExist
 * @apiGroup User
 * @apiPermission 0-管理员
 *
 * @apiParam {String} username 用户名
 *
 * @apiSuccess {Boolean} ok 用户是否存在
 *
 */
router.get('/exist', function (req, res, next) {
    var username = req.query.username;
    userService.getByUsername(username).then(function (dbUser) {
        res.json(dbUser ? {ok: true}: {ok: false});
    }).catch(function(err){
        next(err);
    });
});

/*
修改默认项目
* */
router.get('/updateDefPro', function (req, res, next) {
    var projectId = req.query.projectid;
    var userid=req.query.userid;
    userService.updateDefProj(projectId,userid).then(function (dbUser) {
        res.json(dbUser);
    }).catch(function(err){
        next(err);
    });
});
/**
 * @api {post} /api/user 管理员添加用户
 * @apiName AddUser
 * @apiGroup User
 * @apiPermission 0-管理员
 *
 * @apiParam {String} username 用户名
 * @apiParam {String} password 密码
 * @apiParam {String} name 真实姓名
 * @apiParam {String} departmentId 所属部门Id
 * @apiParam {String} level 用户级别
 *
 * @apiSuccess {String} _id 用户id
 * @apiSuccess {String} username 用户名
 * @apiSuccess {String} name 真实姓名
 * @apiSuccess {String} departmentId 所属部门Id
 * @apiSuccess {String} level 用户级别
 * @apiSuccess {Number} points=0 用户积分
 * @apiSuccess {Number} online 在线状态
 * @apiSuccess {String} image=uploads/defaultAvatar.png 用户头像
 *
 */
router.post('',function(req,res, next){
    userService.getByUsername(JSON.parse(req.body.user).username).then(function(users){
       if(users.length){
           res.send({ok:false,mes:'账户已存在'});
       }else{
           userService.create(JSON.parse(req.body.user)).then(function(dbUser){
               res.result = {ok: true, target: dbUser._id, desc: '添加用户'};  //记录日志
               res.send({ok:true,mes:dbUser});

               //io.sockets.emit('UpdateUser_SIG', {type:'add', body:dbUser});
               //
               //userService.query({},function(err,allUser) {
               //    async.each(allUser, function (user, cb) {
               //        MessageStatusService.create({sender: dbUser._id, receiverId: user._id, type: 0}, function (err, dbMs) {
               //            MessageStatusService.create({sender: user._id, receiverId: dbUser._id, type: 0}, cb);
               //        });
               //    })
               //});
           }).catch(function(err){
               next(err);
           });
       }
    }).catch(function(err2){
        next(err2);
    });
});

/**
 * @api {get} /api/user/count 取得用户数
 * @apiName GetUserCount
 * @apiGroup User
 * @apiPermission all
 *
 * @apiParam {Object} [conditions = {}] 查询条件
 *
 * @apiSuccess {Number} count 符合条件的用户数
 *
 */
router.get('/count', function (req, res, next) {
    userService.userTotal(req.query.conditions || {}).then(function (count) {
        res.json({ok: true, count:count})
    }).catch(function(err){
        next(err);
    });
});

/**
 * @api {get} /api/user/byrole 根据角色查询用户
 * @apiName GetUserByRole
 * @apiGroup User
 *
 * @apiParam {Array} roles 角色
 *
 * @apiSuccess {Array} results 用户查询结果
 *
 */
router.get('/byrole', function (req, res, next) {
    var roles = JSON.parse(req.query.roles);
    userService.queryUserByRole(roles).then(function (results) {
        res.json({ok: true, list:results})
    }).catch(function(err){
        next(err);
    });
});



/**
 * @api {get} /api/user/search 按姓名查询用户列表
 * @apiName SearchUserListByName
 * @apiGroup User
 * @apiPermission all
 *
 * @apiParam {String} [name] 名字关键字
 *
 * @apiSuccess {Array} list 用户数组
 *
 */
router.get('/search', function (req, res, next) {
    userService.queryByName(req.query.name).then(function (list) {
        res.result = {ok: true, desc: 'search列表'};
        res.json({ok: true, list:list});
    }).catch(function(err){
        next(err);
    });
});

/**
 * @api {get} /api/user/:userId 取得用户信息
 * @apiName GetUser
 * @apiGroup User
 * @apiPermission all
 *
 * @apiParam {String} userId 用户Id
 *
 * @apiSuccess {String} _id 用户id
 * @apiSuccess {String} username 用户名
 * @apiSuccess {String} name 真实姓名
 * @apiSuccess {String} label 个人签名
 * @apiSuccess {String} image 头像链接
 * @apiSuccess {String} weixin 微信号
 * @apiSuccess {String} email 邮箱
 * @apiSuccess {String} occupationName 职位
 * @apiSuccess {Date} birthday 生日
 * @apiSuccess {String} departmentId 所属部门Id
 * @apiSuccess {String} level 用户级别
 * @apiSuccess {Number} points=0 用户积分
 * @apiSuccess {Number} online 在线状态
 * @apiSuccess {String} IDCardNumber 身份证号
 * @apiSuccess {Number} account 账户
 *
 */
router.get('/:userId',function (req, res, next) {
    var userId = req.params.userId;
    userService.getById(userId).then(function (result) {
        ProjectService.query().then(function(pros){
            var proinfos=pros;
            for(var i=0;i<result.dataValues.Projects.length;i++)
            {
                if(result.dataValues.Projects[i].dataValues.parentId!==null)
                {
                    var name=getProjname(result.dataValues.Projects[i].dataValues.parentId,proinfos);
                    result.dataValues.Projects[i].dataValues.name=name;
                    result.dataValues.Projects[i].dataValues.id=result.dataValues.Projects[i].dataValues.parentId;
                }
            }
            res.json(result);
        });
    }).catch(function(err){
        next(err);
    });
});



/**
 * @api {get} /api/user 取得用户列表
 * @apiName GetUserList
 * @apiGroup User
 * @apiPermission all
 *
 * @apiParam {Object} [where={}] 查询条件
 *
 *
 * @apiSuccess {Array} list 用户数组
 *
 */
router.get('', function (req, res, next) {
    userService.query(req.query).then(function (list) {
        res.result = {ok: true, desc: '查询列表'};
        res.json({ok: true, list:list});
    }).catch((err) => next(err));

});

/**
 * @api {put} /api/user/:userId 用户修改自己的信息
 * @apiName EditUserSelf
 * @apiGroup User
 * @apiPermission user
 *
 * @apiParam {String} [name] 真实姓名
 * @apiParam {String} [label] 个人签名
 * @apiParam {String} [image] 头像链接
 * @apiParam {String} [weixin] 微信号
 * @apiParam {String} [email] 邮箱
 * @apiParam {String} [occupationName] 职位
 * @apiParam {Date} [birthday] 生日
 * @apiParam {String} IDCardNumber 身份证号
 * @apiParam {Number} account 账户
 *
 * @apiSuccess {Boolean} ok 更新操作是否成功
 *
 */
router.put('/:userId' ,function(req,res, next){
    var userId = req.params.userId;
    userService.updateById(userId, req.body).then(function (dbUser) {
        res.result = {ok: true, target: userId, desc: '更新用户'};
        res.json({ok:true});
      //  io.sockets.emit('UpdateUser_SIG', {type:'modify', body:dbUser});
    }).catch(function(err){
        next(err);
    });
});

/**
 * @api {put} /api/user/:userId 管理员修改用户信息
 * @apiName EditUser
 * @apiGroup User
 * @apiPermission admin
 *
 * @apiParam (params) {String} userId 用户Id
 *
 * @apiParam (body) {String} [name] 真实姓名
 * @apiParam (body) {String} [label] 个人签名
 * @apiParam (body) {String} [password] 密码
 * @apiParam (body) {String} [image] 头像链接
 * @apiParam (body) {String} [weixin] 微信号
 * @apiParam (body) {String} [email] 邮箱
 * @apiParam (body) {String} [occupationName] 职位
 * @apiParam (body) {Date} [birthday] 生日
 * @apiParam (body) {String} [departmentId] 部门Id
 * @apiParam (body) {String} [level] 用户级别
 * @apiParam (body) {Number} [points=0] 用户积分
 *
 * @apiSuccess {Boolean} ok 更新操作是否成功
 *
 */
router.put('/updata/:userId',function(req,res, next){
    var userId = req.params.userId;
    userService.updateById(userId,JSON.parse(req.body.user)).then(function(dbUser){
        res.result = {ok: true, target: userId, desc: '管理员更新用户'};
        res.send({ok:true});
        //io.sockets.emit('UpdateUser_SIG', {type:'modify', body:dbUser});
    }).catch(function(err){
        next(err);
    });

});

/**
 * @api {put} /api/user/department/:userId 管理员修改用户部门
 * @apiName EditUserDepartment
 * @apiGroup User
 * @apiPermission admin
 *
 * @apiParam (params) {String} userId 用户Id
 *
 * @apiParam (body) {String} departmentId 部门Id
 *
 * @apiSuccess {Boolean} ok 更新操作是否成功
 *
 */
router.put("/department/:userId", function (req, res, next) {
    var userId = req.params.userId;
    userService.assignUserToDepartmentById(userId, req.body.departmentId).then(function () {
            res.result = {ok: true, target: userId, desc: '更新用户部门'};
            res.json({ok:true});
          //  io.sockets.emit('UpdateUser_SIG', {type:'modify', body:dbUser});
    }).catch((err) => next(err));
});

/**
 * @api {delete} /api/user/:userId 删除用户
 * @apiName DeleteUser
 * @apiGroup User
 * @apiPermission admin
 *
 * @apiParam {String} userId 需要删除的用户id
 *
 * @apiSuccess {Boolean} ok 删除操作是否成功
 *
 */
router.delete("/:userId", function (req, res, next) {
    var userId = req.params.userId;
    userService.deleteById(userId).then(function(){
        res.result = {ok: true, target: userId, desc: '删除用户'};
        res.send({ok:true});
        //io.sockets.emit('UpdateUser_SIG', {type:'delete', _id:userId});
    }).catch(function(err){
        next(err);
    });

});

/**
 * @api {post} /api/user/login 用户登录
 * @apiName UserLogin
 * @apiGroup User
 * @apiPermission all
 *
 * @apiParam {String} username 用户名
 * @apiParam {String} password 密码
 *
 * @apiSuccess {Boolean} ok=true 登录成功
 * @apiSuccess {User} value 登录用户信息
 * @apiSuccess {String} sid sessionId
 *
 * @apiError (401) {Boolean} ok=false 登录失败
 * @apiError (401) {String} message 登录失败消息
 *
 */
router.post('/login', function (req, res, next) {
    userService.login(req.body.username, req.body.password).then(function (result) {
        if(result.ok){
            var sessionInstance = req.session;
            var sid = sessionInstance.setItemAuto(result.value.dataValues);
            result.sid = sid;

            ProjectService.query().then(function(pros){
                var proinfos=pros;
                var porjs=result.value.dataValues.Projects;
                for(var i=0;i<result.value.dataValues.Projects.length;i++)
                {
                    if(result.value.dataValues.Projects[i].dataValues.parentId!==null)
                    {
                        var name=getProjname(result.value.dataValues.Projects[i].dataValues.parentId,proinfos);
                        result.value.dataValues.Projects[i].dataValues.name=name;
                        result.value.dataValues.Projects[i].dataValues.id=result.value.dataValues.Projects[i].dataValues.parentId;
                    }
                }
                res.json(result);
                if(result.value.dataValues.online===1) {
                    io.sockets.emit('secondaryLogon', {"Id": result.value.dataValues.id});
                }
            });
        }else{
            res.json(result);
        }
    }).catch(function(err){
        next(err);
    });
});


function getProjname(id,proinfos)
{
    var result="";
    for(var i=0;i<proinfos.length;i++)
    {
        if(proinfos[i].dataValues.id===id)
        {
            result=proinfos[i].dataValues.name;
            break;
        }
    }
    return result;
}
/**
 * @api {post} /api/user/logout 退出登录
 * @apiName UserLogout
 * @apiGroup User
 * @apiPermission all
 *
 *
 * @apiSuccess {Boolean} ok=true 退出成功
 *
 */
router.get('/logout',function(req,res,next){
    req.session.removeItem(req.session.user.sid);
    res.json({ok:true});
});

/**
 * @api {post} /api/user/getUserList 获取用户表
 * @apiName getUserList
 * @apiGroup User
 * @apiPermission all
 *
 * @apiParam {String} projectid 项目id
 * @apiParam {String} usertype 用户类型
 *
 */
router.post('/getUserList', function (req, res, next) {
    //ProjectService
    userService.getUserAll().then(function (resultUser) {
        ProjectService.getByModule(req.body.projectid).then(function(modules){
            userService.queryUserByProjectId(req.body.projectid).then(function (users) {
                for(var i=0;i<users.length;i++)
                {
                    users[i].dataValues.proname=getModuleName(modules,users[i].dataValues.moduleId);
                    /*name:users[i].dataValues.name,
                        username:users[i].dataValues.username,
                    image:users[i].dataValues.image*/
                    var userinfo=getUserName(resultUser,users[i].dataValues.userId);
                    if(userinfo!==null)
                    {
                        users[i].dataValues.chinese_name=userinfo.name;
                        users[i].dataValues.user_name=userinfo.username;
                        users[i].dataValues.image=userinfo.image;
                    }
                }
                res.json(users);
            }).catch(function(err3){
                next(err3);
            });
        }).catch(function(err2){
            next(err2);
        });
       // res.json(result);
    }).catch(function(err){
        next(err);
    });
    function getModuleName(modules,id){
        var result=null;
        for(var i=0;i<modules.length;i++)
        {
            if(modules[i].dataValues.id===id)
            {
                result=modules[i].dataValues.name;
                break;
            }
        }
        return result;
    }
    function getUserName(users,id)
    {
        var result=null;
        for(var i=0;i<users.length;i++)
        {
            if(users[i].dataValues.id===id)
            {
                result={
                    name:users[i].dataValues.name,
                    username:users[i].dataValues.username,
                    image:users[i].dataValues.image
                };
                break;
            }
        }
        return result;
    }
});
/*
* my
* 新建/编辑用户
* */
router.post('/createUser',function(req,res,next){
    console.log(req.body);
    userService.createUser(JSON.parse(req.body.data),JSON.parse(req.body.offset)).then(function(data){
        if(data==false){
            res.json(false);
        }else if(data.message=="updateSuccess"){
            res.json({message: "updatesuccess", data: data.user});
        }else{
            res.json({message: "createsuccess", data: data.user,'pagecount':data.count});
        }
    }).catch(function(err){
        next(err);
    });
});
/*
* 获取所有用户列表
* */
router.post('/getAllusers',function(req,res,next){
     userService.selectAllusers().then(function(data){
             res.json({data:data,message:"getSuccess"});
     }).catch(function(err){
         res.json(err);
     });
});
/*筛选*/
router.post('/getUsersByDR',function(req,res,next){
    var data=req.body;
    var roleLists=JSON.parse(data.roleId);
    var departmentLists=JSON.parse(data.departmentId);
    var userType=JSON.parse(data.userType);
    userService.selectByDR(departmentLists,roleLists,userType).then(function(data){
        //console.log(data);
        res.json({data:data,message:'getSuccess'});
    }).catch(function(err){
        res.json(err);
    });
});

/*
* 分页查询，显示
* */
router.post('/getTenUsers',function(req,res,next){
    userService.getTenUsers(req.body.offset).then(function(data){
        res.json({data:data,message:"getTenSuccess"});
    }).catch(function(err){
       next(err);
    });
});
/*
* 获取最后数据
* */
router.post('/getLastUser',function(req,res,next){
          userService.getLastUser().then(function(data){
              res.json({data:data.data,message:"getLastSuccess",offset:data.len});
          }).catch(function(err){
              res.json(err);
          });
});
/*
* 获取一个用户的详细信息
* */
router.post('/getuser',function(req,res,next){
    userService.selectUser(req.body.id).then(function(user){
        userService.getOneUserAuth(user.roleId).then(function(roleAuth){
            res.json({data:user,message:'getUserSuccess',roleAuth:roleAuth});
        }).catch(function(err){
            res.json(err);
        });

    }).catch(function(err){
        res.json(err);
    });
});
/*
* 删除一个用户
* */
router.post('/deleteUser',function(req,res,next){
    userService.deleteUser(JSON.parse(req.body.id),JSON.parse(req.body.offset)).then(function(users){
        var userjson=users.user;
        res.json({message:"delSuccess",data:userjson,count:users.count});
    }).catch(function(err){
        res.json(err);
    });
});
/*
* 获取所有角色的权限
* */
router.post('/getAllRoles',function(req,res,next){
    userService.getAllRoles().then(function(data){
        res.json({list:data});
    }).catch(function(err){
        res.json(err);
    });
});

/**
 * 获取当前页数
 * */
router.post('/getCount',function(req,res,next){
    userService.getCount().then(function(data){
        //console.log('ttttt'+data);
        res.json({count:data.page,all:data.count});
    }).catch(function(err){
        res.json(err);
    });
});

/*
* 获取外部人员和外部企业
* @api {post}
* */
router.post('/getOuterUser',function(req,res,next){
    userService.getOuterUsers().then(function(data){
        res.json(data);
    }).catch(function(err){
        next(err);
    });
});
/*
* 在外部人员和外部企业中进行搜素
* @API {post}
* @param{name}
* */
router.post('/selectOuterUser',function(req,res,next){
    userService.selectOuterUsers(req.body.name).then(function(data){
        console.log('ttttttttttttttttt',data);
        res.json(data);
    }).catch(function(err){
        next(err);
    });
});


/**
 * 获取个人积分详情
 * @api get
 * @param{offset,userId}
 * */
router.post('/getUserPoints',function(req,res,next){
    console.log(req.body);
    var _data=req.body;
   userService.getUsersPoint(_data).then(function(data){
       res.json(data);
   }).catch(function(err){
       next(err);
   });
});




