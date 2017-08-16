/**
 * Created by wangziwei on 2015/7/16.
 */
var express = require('express');
var router = module.exports = express.Router();
var log = process.core.log;
var ChattingService = require('../service/chatService');
var MessageStatusService = require('../service/messageStatusService');
var UserService = require('../service/userService');
var GroupService = require('../service/groupService');


/**
 * @api {post} /api/chat 新建聊天
 * @apiName AddChat
 * @apiGroup Chatting
 * @apiPermission All
 *
 * @apiParam {String} senderId 发送人编号
 * @apiParam {String} receiverId 接收编号
 * @apiParam {Number} type 接收类型
 * @apiParam {Number} category 类别
 * @apiParam {String} content 聊天内容
 * @apiParam {Date} time 发送时间
 * @apiParam {Boolean} status 状态(已读：true；未读：false)
 * @apiParam {Number} attachmentAmount 附件数量
 *
 * @apiSuccess {Boolean} ok 操作是否成功
 */
router.post('/',function(req,res,next){
    ChattingService.create(req.body).then(function(results){
        res.result = {ok: true, target: results._id, desc: "新建聊天记录"};
        res.json({ok:true});
    }).catch(function(err){
        console.log(err);
    });
});

/**
 * @api {put} /api/chat/:chatId 修改个人聊天状态
 * @apiName EditChatStatus
 * @apiGroup Chatting
 * @apiPermission all
 *
 * @apiParam (params) {String} chatId 消息编号
 *
 * @apiParam (body) {Boolean} [status] 消息状态（已读未读）
 *
 * @apiSuccess {Boolean} ok 更新操作是否成功
 *
 */
router.put('/:chatId',function(req,res, next){
    var chatId = req.params.chatId;
    ChattingService.updateById(chatId, req.body).then(function () {
        res.result = {ok: true, desc: '更改消息状态'};
        res.json({ok:true});
    }).catch(function(err){
        next(err);
    });
});

/**
 * @api {get} /api/chat 查询个人聊天记录
 * @apiName getChat
 * @apiGroup Chatting
 * @apiPermission All
 *
 * @apiParam {String} senderId 发送人编号
 * @apiParam {String} receiverId 接收编号
 *
 * @apiSuccess {Number} senderId 发送人编号
 * @apiSuccess {Number} receiverId 接收编号
 * @apiSuccess {Number} type 接收类型
 * @apiSuccess {Number} category 类别
 * @apiSuccess {String} content 聊天内容
 * @apiSuccess {Date} time 发送时间
 * @apiSuccess {Number} attachmentAmount 附件数量
 * @apiSuccess {Boolean} status 状态(已读：true；未读：false)
 * @apiSuccess {Boolean} ok 操作是否成功
 * @apiSuccess {Array} list 结果数组
 */
router.get('/',function(req,res, next){
    var senderId = req.query.senderId;
    var receiverId = req.query.receiverId;

    ChattingService.getChattingRecords(senderId,receiverId).then(function(results){
        res.result = {ok: true, desc: "查询个人聊天记录"};
        res.json({ok: true, list:results});
    }).catch(function(err){
        next(err);
    });
});

/**
 * @api {get} /api/chat/queryGroup/:groupId 查询群聊天记录
 * @apiName getGroupChat
 * @apiGroup Chatting
 * @apiPermission All
 *
 * @apiParam {String} receiverId 接收编号
 *
 * @apiSuccess {String} senderId 发送人编号
 * @apiSuccess {String} receiverId 接收编号
 * @apiSuccess {Number} type 接收类型
 * @apiSuccess {Number} category 类别
 * @apiSuccess {String} content 聊天内容
 * @apiSuccess {Date} time 发送时间
 * @apiSuccess {Number} attachmentAmount 附件数量
 * @apiSuccess {Boolean} ok 操作是否成功
 * @apiSuccess {Array} list 结果数组
 */
router.get('/queryGroup/:groupId',function(req,res, next){
    var groupId = req.params.groupId;

    ChattingService.getGroupChatting(groupId).then(function(results){
        res.result = {ok: true, desc: "查询群聊天记录"};
        res.json({ok: true, list:results});
    }).catch(function(err){
        next(err);
    });
});

/**
 * @api {get} /api/chat/queryByRereceiver/:receiverId 查询未读信息(个人)
 * @apiName getQueryByRereceiver
 * @apiGroup Chatting
 * @apiPermission All
 *
 * @apiParam {String} receiverId 接收编号
 *
 * @apiSuccess {String} senderId 发送人编号
 * @apiSuccess {String} receiverId 接收编号
 * @apiSuccess {Number} type 接收类型
 * @apiSuccess {Number} category 类别
 * @apiSuccess {String} content 聊天内容
 * @apiSuccess {Date} time 发送时间
 * @apiSuccess {Number} attachmentAmount 附件数量
 * @apiSuccess {Boolean} status 状态(已读：true；未读：false)
 * @apiSuccess {Boolean} ok 操作是否成功
 * @apiSuccess {Array} list 结果数组
 */
router.get('/queryByRereceiver/:receiverId',function(req,res,next){
    var receiverId = req.params.receiverId;
    ChattingService.queryByRereceiver(receiverId).then(function(results){
        res.result = {ok: true, desc: "根据接收人查未读信息"};
        res.json({ok: true, list:results});
    }).catch(function(err){
        next(err);
    });
});

/**
 * @api {get} /api/chat/updateOnReadByRereceiverId/:receiverId 修改信息状态(个人)
 * @apiName getUpdateOnReadByRereceiverId
 * @apiGroup Chatting
 * @apiPermission All
 *
 * @apiParam {String} receiverId 接收编号
 *
 * @apiSuccess {Boolean} ok 操作是否成功
 */
router.get('/updateOnReadByRereceiverId/:receiverId',function(req,res,next){
    var receiverId = req.params.receiverId;
    ChattingService.updateOnReadByRereceiverId(receiverId).then(function(results){
        res.result = {ok: true, desc: "修改未读状态"};
        res.json({ok: true});
    }).catch(function(err){
        next(err);
    });
});

/**
 * @api {get} /api/chat/getNoReadInfo/:receiverId 查询未读信息
 * @apiName getQueryNoReadInfo
 * @apiGroup Chatting
 * @apiPermission All
 *
 * @apiParam {String} receiverId 接收编号
 *
 * @apiSuccess {Boolean} ok 操作是否成功
 * @apiSuccess {Array} list 结果数组
 */
router.get('/getNoReadInfo/:receiverId',function(req,res,next){
    var receiverId = req.params.receiverId;
    ChattingService.queryNoReadInfo(receiverId).then(function(results){
        res.result = {ok: true, desc: "获取未读信息"};
        res.json({ok: true,list:results});
    }).catch(function(err){
        next(err);
    });
});

/**
 * @api {get} /api/chat/queryRecentlyChat/:userId 查询最近聊天人
 * @apiName queryRecentlyChat
 * @apiGroup Chatting
 * @apiPermission All
 *
 * @apiParam (params) {String} userId 用户编号
 *
 * @apiParam (body) {String} projectId 项目编号
 *
 * @apiSuccess {Boolean} ok 操作是否成功
 * @apiSuccess {Array} list 个人信息
 */
router.get('/queryRecentlyChat/:userId',function(req,res,next){
    var userId = req.params.userId;
    var projectId = req.query.projectId;
    MessageStatusService.queryRecentlyChat(userId, projectId).then(function(results){
        //console.log(results);
        var promises = results.map(function (result) {
            return UserService.getById(result.receiverId).then(function (dbUser) {
                if(dbUser)
                {
                    dbUser.setDataValue('chatTime', result.chatTime.getTime());

                }
                return dbUser;
            });
        });
        //console.log(Promise.all(promises));
        return Promise.all(promises);
    }).then(function (dbUsers) {
        //console.log(dbUsers);
        var result = [];
        for (var i = 0; i < dbUsers.length; i++) {
            if(dbUsers[i]!==null)
            {
                result.push(dbUsers[i]);
            }
        }
        res.result = {ok: true, desc: "获取最近聊天人信息"};
        res.json({ok: true,list:result});
    });
});

// TODO
/**
 * @api {get} /api/chat/queryRecentlyGroupChat/:userId 查询最近聊天群
 * @apiName queryRecentlyGroupChat
 * @apiGroup Chatting
 * @apiPermission All
 *
 * @apiParam {String} userId 用户编号
 *
 * @apiSuccess {Boolean} ok 操作是否成功
 * @apiSuccess {Array} list 群组信息
 */
router.get('/queryRecentlyGroupChat/:userId',function(req,res,next){
    var userId = req.params.userId;
    var projectId = req.query.projectId;
    MessageStatusService.queryRecentlyGroupChat(userId, projectId).then(function(results){
        //console.log(results);
        var promises = results.map(function (result) {
            return GroupService.getById(result.senderId).then(function (dbgroup) {
                dbgroup.setDataValue('chatTime', result.chatTime.getTime());
                return dbgroup;
            });
        });
        return Promise.all(promises);
    }).then(function (dbUsers) {
        res.result = {ok: true, desc: "获取最近聊天人信息"};
        res.json({ok: true,list:dbUsers});
    });
});