/**
 * Created by wangziwei on 2015/7/15.
 */
var Chat = process.core.db.models.Chat;
var MessageStatus = process.core.db.models.MessageStatus;
var MessageStatusService = require('../service/messageStatusService');
var GroupService = require('../service/groupService');
var async = require('async');
var log = process.core.log;

var chatService = module.exports;

// 插入
chatService.create = function (chat,fn) {
    chat.schemeId="";
    //console.log("=======15==========");
    // console.log(chat);
    return Chat.create(chat).then(fn).then(function () {
        return MessageStatusService.updateRecentlyById(chat.senderId, chat.receiverId, new Date()).then(function(result){
            if((""+chat.type)==="0") {
                return MessageStatus.all({
                    where: {
                        senderId:chat.senderId,
                        receiverId:chat.receiverId,
                        // projectId:chat.projectId,
                        type:chat.type
                    }
                }).then(function(result2){
                    if(!result2||result2.length===0)
                    {
                        var time = Date.now()-10*60*1000;
                        return MessageStatusService.create({
                            senderId:chat.senderId,
                            receiverId:chat.receiverId,
                            // projectId:chat.projectId,
                            chatTime:new Date(),
                            time:new Date(time),
                            type:chat.type
                        });
                    }
                });
            }
            else{
                return MessageStatus.all({
                    where: {
                        senderId:chat.senderId,
                        // projectId:chat.projectId,
                        type:chat.type
                    }
                }).then(function(result2){
                    var time = Date.now()-10*60*1000;
                    return GroupService.memberByGroup(chat.senderId).then(function(result3){
                        //console.log("==========52================");
                        //console.log(result3);
                        var noStatuses=[];
                        for(var i=0;i<result3.length;i++){
                            var flag=false;
                            for(var ii=0;ii<result2.length;ii++){
                                if(result2[ii].dataValues.receiverId===result3[i].dataValues.id){
                                    flag=true;
                                    break;
                                }
                            }
                            if(!flag){
                                noStatuses.push(result3[i]);
                            }
                        }
                        if(noStatuses.length!==0)
                        {
                            var promises = noStatuses.map(function (user) {
                                return MessageStatusService.create({
                                    senderId:chat.senderId,
                                    receiverId:user.id,
                                    // projectId:chat.projectId,
                                    chatTime:new Date(),
                                    time:new Date(time),
                                    type:chat.type
                                });
                            });
                            return Promise.all(promises);
                        }
                    });
                });
            }
        });
    }).then(function () {
        return MessageStatusService.updateRecentlyById(chat.receiverId, chat.senderId, new Date()).then(function(result3){
            if((""+chat.type)!=="1")
            {
                return MessageStatus.all({
                    where: {
                        senderId:chat.receiverId,
                        receiverId:chat.senderId,
                        // projectId:chat.projectId,
                        type:chat.type
                    }
                }).then(function(result2){
                    if(!result2||result2.length===0)
                    {
                        var time = Date.now()-10*60*1000;
                        return MessageStatusService.create({
                            senderId:chat.receiverId,
                            receiverId:chat.senderId,
                            // projectId:chat.projectId,
                            chatTime:new Date(),
                            time:new Date(time),
                            type:chat.type
                        });
                    }
                });
            }

        });
    });
};

// 根据主键ID获取
chatService.getById = function (id) {
    return Chat.findById(id);
};

chatService.updateById = function (id, chat) {
    return chatService.getById(id).then(function (dbChat) {
        return dbChat.update(chat);
    });
};

// 根据主键ID删除
chatService.deleteById = function (id) {
    return chatService.getById(id).then(function (dbChat) {
        return dbChat.destroy();
    });
};

// 获取个人聊天记录
chatService.getChattingRecords = function (senderId, receiverId) {
    return Chat.all({
        where: {
            type: 0,
            $or: [{senderId: senderId, receiverId: receiverId}, {senderId: receiverId, receiverId: senderId}]
        }
    });
};

// 获取群聊天记录
chatService.getGroupChatting = function (groupId) {
    return Chat.all({
        where: {
            type: 1, receiverId: groupId
        }
    });
};

/**
 *
 * @param args attributes:查询字段,where:查询条件,offset:跳过数据条数,limit:查询数据条数,order:排序,include:关联
 * 参考：http://note.youdao.com/groupshare/?token=1851646F75074E9C88180593AD747223&gid=11001280
 * @returns promise
 */
chatService.query = function (args) {
    if (!args) {
        args = {};
    }
    var attributes = args.attributes;
    var where = args.where || {};
    var offset = args.offset || 0;
    var limit = args.limit;
    var order = args.order || '';
    var include = args.include || [{all: true, nested: true}];
    return Chat.all(
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

// 根据接收人查未读信息
chatService.queryByRereceiver = function (receiverId) {
    return Chat.all({
        where: {
            type: 0, receiverId: receiverId, status: false
        }
    });
};

// 根据接收人和状态 修改 状态
chatService.updateOnReadByRereceiverId = function (receiverId) {
    Chat.update({status: true}, {where: {type: 0, receiverId: receiverId, status: false}});
};

// 查询未读信息
chatService.queryNoReadInfo = function (receiverId,projId) {
    //console.log("=========102=========="+projId);
    return MessageStatusService.queryMessageStatus(receiverId, projId).then(function (results2) {
        var results = [];
        for (var i = 0; i < results2.length; i++) {
            //if(checkRepeat(results,senderId,receiverId))
            if(checkRepeat(results,results2[i].dataValues.senderId,results2[i].dataValues.receiverId))
            {
                results.push(results2[i]);
            }
        }
        var promises = results.map(function (messageStatus) {
            // console.log(messageStatus.time);
            if (messageStatus.type === 0) {
                //console.log(1111111111);
                return Chat.all({
                    where: {
                        receiverId: receiverId,
                        // projectId: projId,
                        senderId: messageStatus.senderId,
                        sendTime: {$gt: messageStatus.time}
                    },
                    order: [["f_ci_sendtime", "ASC"]]
                    //order: 'F_CI_SendTime'
                });
            }
            else {
                return Chat.all({
                    where: {
                        senderId: messageStatus.senderId,
                        // projectId: projId,
                        sendTime: {$gt: messageStatus.time}
                    },
                    order: [["f_ci_sendtime", "ASC"]]
                });
            }
        });
        return Promise.all(promises);
    }).catch(function (error) {
        console.log(error);
    });
    function checkRepeat(arrays,senderId,receiverId)
    {
        var flag=true;
        for(var i=0;i<arrays.length;i++)
        {
            if(arrays[i].dataValues.senderId===senderId&&arrays[i].dataValues.receiverId===receiverId)
            {
                flag=false;
                break;
            }
        }
        return flag;
    }
};


