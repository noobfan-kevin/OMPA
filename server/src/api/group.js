/**
 * Created by wangziwei on 2015/7/20.
 */
var express = require('express');
var router = module.exports = express.Router();
var log = process.core.log;
var GroupService = require('../service/groupService');
var MessageStatusService = require('../service/messageStatusService');
var async = require('async');
var roles = require('../core/auth').roles;
var userService = require('../service/userService');

var rolesAdmin = [0];
var rolesLeader = [0,1];
var rolesUser = [0,1,2,3];

/**
 * @api {post} /api/group 新建群组
 * @apiName AddGroup
 * @apiGroup Group
 * @apiPermission leader
 *
 * @apiParam {String} name 群组名称
 * @apiParam {String} creatorId 创建人编号
 * @apiParam {String} creatorName 创建人姓名
 * @apiParam {String} groupImage 群图标
 * @apiParam {Number} attachmentAmount 附件数量
 * @apiParam {Date} createTime 创建时间
 *
 * @apiSuccess {Boolean} ok 操作是否成功
 * @apiSuccess {Object} values 结果数据
 */
router.post('/',function(req,res,next){
    GroupService.create(req.body).then(function(results){
        GroupService.addMembers(results.dataValues.id, [results.dataValues.creatorId],results.dataValues.projectId).then(function(result2){
            res.send({ok:true,values:results});
        })
    }).catch(function(err){
        next(err)
    });
});

/**
 * @api {delete} /api/group/:groupId 删除群组
 * @apiName DeleteGroup
 * @apiGroup Group
 * @apiPermission leader
 *
 * @apiParam {String} groupId 群组编号
 *
 * @apiSuccess {Boolean} ok 操作是否成功
 */
router.delete('/:groupId',function(req,res,next){
    var groupId = req.params.groupId;
    GroupService.deleteById(groupId).then(function(results){
        res.result = {ok: true, target: groupId, desc: "删除群信息"};
        res.json({ok:true});
    }).catch(function(err){
        next(err);
    });
});

/**
 * @api {put} /api/group/:groupId 修改群信息
 * @apiName UpdateGroup
 * @apiGroup Group
 * @apiPermission leader
 *
 * @apiParam {String} groupId 群组编号
 * @apiParam {String} name 群组名称
 * @apiParam {String} groupImage 图标
 *
 * @apiSuccess {Boolean} ok 操作是否成功
 */
router.put('/:groupId',function(req,res,next){
    var id = req.params.groupId;
    GroupService.updateById(id,req.body).then(function(results){
        res.result = {ok: true,target: id, desc: "修改群信息"};
        res.json({ok:true});
    }).catch(function(err){
        next(err);
    });
});

/**
 * @api {get} /api/group/info/:groupId 取得群组信息
 * @apiName GetGroup
 * @apiGroup Group
 * @apiPermission all
 *
 * @apiParam {String} groupId 群组Id
 *
 * @apiSuccess {String} _id 群组编号
 * @apiSuccess {String} name 群组名称
 * @apiSuccess {String} creatorId 创建人编号
 * @apiSuccess {String} creatorName 创建人姓名
 * @apiSuccess {String} groupImage 群图标
 * @apiSuccess {Number} attachmentAmount 附件数量
 * @apiSuccess {Date} createTime 创建时间
 * @apiSuccess {Boolean} ok 操作是否成功
 * @apiSuccess {Array} list 结果数组
 */
router.get('/info/:groupId',function(req,res,next){
    var id = req.params.groupId;
    GroupService.getById(id).then(function (results) {
        res.result = {ok: true,target: id, desc: "获取群信息"};
        res.json({ok: true, list:results});
    }).catch(function(err){
        next(err);
    });
});

/**
 * @api {post} /api/group/:groupId 添加群组成员
 * @apiName AddMember
 * @apiGroup Group
 * @apiPermission leader
 *
 * @apiParam {String} groupId 群组编号
 * @apiParam {Array} members 群成员编号数组
 * @apiParam {String} projectId 项目编号
 *
 * @apiSuccess {Boolean} ok 操作是否成功
 */
router.post('/:groupId',function(req,res,next){
    var id = req.params.groupId;
    GroupService.getById(id).then(function(result){
        GroupService.addMembers(id,JSON.parse(req.body.members),result.projectId).then(function(results){
            res.result = {ok: true, target: results._id, desc: "添加群成员"};
            res.json({ok:true});
        })
    }).catch(function(err){
        next(err);
    });
});

/**
 * @api {get} /api/group/count 查询群组数
 * @apiName GetGroupCount
 * @apiGroup Group
 * @apiPermission all
 *
 * @apiParam {Object} [conditions = {}] 查询条件
 *
 * @apiSuccess {Number} count 符合条件的群组数
 *
 */
router.get('/count', function (req, res, next) {
    GroupService.groupCount(req.query.conditions || {}).then(function (count) {
        res.json({ok: true, count:count})
    }).catch(function(err){
        next(err);
    });
});

/**
 * @api {get} /api/group 查询群组列表
 * @apiName GetGroupList
 * @apiGroup Group
 * @apiPermission all
 *
 * @apiParam {Object} [conditions={}] 查询条件
 * @apiParam {String} [fields=""] 查询字段
 * @apiParam {Object} [options={}] 查询选项，分页、排序
 *
 * @apiParamExample {json} 分页请求群组name字段:
 *      conditions = {} &
 *      fields = "name" &
 *      options = {skip: 10,limit: 5}
 *
 * @apiSuccess {Array} list 通知数组
 *
 */
router.get('/', function (req, res, next) {
    GroupService.query(req.query).then(function (list) {
        res.result = {ok: true, desc: '查询列表'};
        res.json({ok: true, list:list});
    }).catch(function(err){
        next(err);
    });
});

/**
 * @api {get} /api/group/all 查询所有群组列表
 * @apiName GetAllGroupList
 * @apiGroup Group
 * @apiPermission all
 *
 * @apiParam {Object} [conditions={}] 查询条件
 * @apiParam {String} [fields=""] 查询字段
 * @apiParam {Object} [options={}] 查询选项，分页、排序
 *
 * @apiParamExample {json} 分页请求群组字段:
 *      conditions = {}
 *
 * @apiSuccess {Array} list 通知数组
 *
 */
router.get('/all',function(req,res,next){
    GroupService.queryAllMemberByGroup(req.body).then(function(list){
        res.result = {ok: true, desc: '查询列表'};
        res.json({ok: true, list:list});
    }).catch(function(err){
        next(err);
    });
});

/**
 * @api {get} /api/group/:userId 获取个人所属群信息
 * @apiName GetGroupsByUser
 * @apiGroup Group
 * @apiPermission all
 *
 * @apiParam {String} userId 用户编号
 *
 * @apiSuccess {String} _id 群组编号
 * @apiSuccess {String} name 群组名称
 * @apiSuccess {String} creatorId 创建人编号
 * @apiSuccess {String} creatorName 创建人姓名
 * @apiSuccess {String} groupImage 群图标
 * @apiSuccess {Number} attachmentAmount 附件数量
 * @apiSuccess {Date} createTime 创建时间
 * @apiSuccess {Boolean} ok 操作是否成功
 * @apiSuccess {Array} list 结果数组
 */
router.get('/getGroupByUser', function (req, res, next) {
    var userId = req.query.userId;
    GroupService.queryGroupsByUser(userId).then(function (list) {
        //console.log(list);
        /*var result=[];
        for(var i=0;i<list.length;i++)
        {
            if(list[i].dataValues.projectId===req.query.proid)
            {
                result.push(list[i]);
            }
        }*/
        res.json({ok: true, list:list});
    }).catch(function(err){
        next(err);
    });
});


/**
 * @api {get} /api/group/members/:groupId 根据群编号查询群成员信息
 * @apiName GetMembersByGroup
 * @apiGroup Group
 * @apiPermission all
 *
 * @apiParam {String} groupId 群编号
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
 * @apiSuccess {Number} online 在线状态groups
 * @apiSuccess {Array} groups 所属群
 * @apiSuccess {Boolean} ok 操作是否成功
 * @apiSuccess {Array} list 结果数组
 */
router.get('/members/:groupId', function (req, res, next) {
    var groupId = req.params.groupId;
    GroupService.memberByGroup(groupId).then(function (list) {
        res.result = {ok: true, desc: '群组成员'};
        res.json({ok: true, list:list});
    }).catch(function(err){
        next(err);
    });
});

/** TODO
 * @api {put} /api/group/members/:groupId 删除群组成员
 * @apiName DelMembersByGroup
 * @apiGroup Group
 * @apiPermission Leader
 *
 * @apiParam {String} groupId 群编号
 * @apiParam {String} userId 成员编号
 *
 * @apiSuccess {Boolean} ok 操作是否成功
 */
router.put('/members/:groupId', function (req, res, next) {
    var groupId = req.params.groupId;
    var userId = req.body.userId;
    GroupService.delMemberByGroup(groupId,userId).then(function(result){
        res.json({ok: true});
    }).catch(function(error){
       next(error);
    });
    /*GroupService.delMemberByGroup(groupId,userId, function (err, list) {
        if (err) {
            next(err);
        }
        else {
            res.result = {ok: true, desc: '删除群组成员'};
            MessageStatusService.delByRereceiverId(groupId,userId,function(err){
                res.json({ok: true});
            });

        }
    });*/
});

/**
 * @api {get} /api/group/membersGroup/:groupId 获取未进群的用户
 * @apiName queryMembersGroup
 * @apiGroup Group
 * @apiPermission Leader
 *
 * @apiParam {String} groupId 群编号
 *
 * @apiSuccess {Array} res2 未添加的用户数据
 * @apiSuccess {Boolean} ok 操作是否成功
 */
router.get('/membersGroup/:groupId', function (req, res, next) {
    userService.getUserAll().then(function (resultUser) {
        GroupService.memberByGroup(req.params.groupId).then(function(results){
            var result=[];
            // console.log('111',results)
            for(var i = 0;i<resultUser.length;i++){
                if(check(results,resultUser[i].dataValues.id)){
                    result.push(resultUser[i]);
                }
            }
            res.json({ok: true, list:result});
        })
    }).catch(function(error){
        next(error)
    });
    function checkRepeat(result,id){
        var flag=true;
        for(var i=0;i<result.length;i++)
        {
            if(result[i].dataValues.id===id){
                flag=false;
                break;
            }
        }
        return flag;
    }
    function getUserInfo(users,id){
        var result=null;
        for(var i=0;i<users.length;i++)
        {
            if(users[i].dataValues.id===id){
                result=users[i];
                break;
            }
        }
        return result;
    }
    function check(users,id){
        var flag=true;
        for(var i=0;i<users.length;i++)
        {
            // console.log('111',users[i].dataValues)
            if(users[i].dataValues.id===id)
            {
                flag=false;
                break;
            }
        }
        return flag;
    }
   /* GroupService.membersGroup(req.params.groupId).then(function(results){
        var res2 = [];
        for(var i =0;i<results.length;i++){
            if(results[i]._doc.members.length !=0){
                res2.push(results[i]);
            }
        }
        res.result = {ok: true, desc: '添加群组成员'};
        res.json({ok: true, list:res2});
    }).catch(function(err){
        next(err);
    });*/
});
