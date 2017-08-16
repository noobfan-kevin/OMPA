/**
 * Created by wangziwei on 2015/8/14.
 */
var MessageStatus = process.core.db.models.MessageStatus;
var ProjectMember = process.core.db.models.ProjectMember;
var log = process.core.log;
var async = require('async');

var MessageStatusService = module.exports;

// 新建消息状态
MessageStatusService.create = function(Status){
    return MessageStatus.create(Status);
};

// 查询
MessageStatusService.queryMessageStatus = function(receiverId,projId){
    return MessageStatus.all({
        where:{
            receiverId:receiverId
            // projectId:projId
        }
    });
};
// 修改
MessageStatusService.updateByReceiverId = function(senders,receiverId){
    var promises = senders.map(function(sender){
        if(sender!==null&&sender.indexOf("_")>=0)
        {
            sender=sender.split("_")[0];
        }
        if(receiverId!==null&&receiverId.indexOf("_")>=0)
        {
            receiverId=receiverId.split("_")[0];
        }
        return MessageStatus.update({time:Date.now()},{where:{senderId:sender,receiverId:receiverId}});
    });

    return Promise.all(promises);


};

/**
 *
 * @param args attributes:查询字段,where:查询条件,offset:跳过数据条数,limit:查询数据条数,order:排序,include:关联
 * 参考：http://note.youdao.com/groupshare/?token=1851646F75074E9C88180593AD747223&gid=11001280
 * @returns promise
 */
MessageStatusService.query = function (args) {
    if (!args) {
        args = {};
    }
    var attributes = args.attributes;
    var where = args.where || {};
    var offset = args.offset || 0;
    var limit = args.limit;
    var order = args.order || '';
    var include = args.include || [{all: true, nested: true}];
    return MessageStatus.all(
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

// 删除(踢群组成员关系)
MessageStatusService.delByRereceiverId = function(groupId,receiverId){
    return MessageStatus.destroy({where:{senderId:groupId,receiverId:receiverId}});
};
// 删除(解散群关系)
MessageStatusService.delByGroupId = function(groupId){
    return MessageStatus.destroy({where:{senderId:groupId}});
};

// 修改最近聊天时间
MessageStatusService.updateRecentlyById = function(sender,receiverId,chatTime){
    return MessageStatus.update({chatTime:chatTime},{where:{senderId:sender,receiverId:receiverId}});
};

// 查询个人最近聊天
MessageStatusService.queryRecentlyChat = function(userId,projectid){
    var time = Date.now()-10*24*60*60*1000;
    return MessageStatus.all({
        where: {
            senderId:userId,
            // projectId:projectid,
            type:0,
            chatTime:{$gt:(new Date(time))}
        },
        order: [["chatTime", "DESC"]]
    }).then(function(infos){
        var result=[];
        for(var i=0;i<infos.length;i++){
           // console.log(infos[i]);
            var createat=(new Date(infos[i].dataValues.createdAt)).getTime();
            var updateat=(new Date(infos[i].dataValues.updatedAt)).getTime();
            if(checkRepeat(result,infos[i].dataValues.senderId,infos[i].dataValues.receiverId)
                &&infos[i].dataValues.receiverId!==userId&&createat!==updateat)
            {
                result.push(infos[i]);
            }
        }
        return result;
    });
    function checkRepeat(result,senderid,receiveid){
        var flag=true;
        for(var i=0;i<result.length;i++){
            if(result[i].dataValues.senderId===senderid&&result[i].dataValues.receiverId===receiveid){
                flag=false;
            }
        }
        return flag;
    }
};

// 查询群组最近聊天
MessageStatusService.queryRecentlyGroupChat = function(userId,projectid){
    var time = Date.now()-10*24*60*60*1000;
    return MessageStatus.all({
        where: {
            receiverId:userId,
            // projectId:projectid,
            type:1,
            chatTime:{$gt:(new Date(time))}
        },
        order: [["chatTime", "DESC"]]
    }).then(function(infos){
        var result=[];
        for(var i=0;i<infos.length;i++){
            var createat=(new Date(infos[i].dataValues.createdAt)).getTime();
            var updateat=(new Date(infos[i].dataValues.updatedAt)).getTime();
            if(checkRepeat(result,infos[i].dataValues.senderId,infos[i].dataValues.receiverId)&&createat!==updateat)
            {
                result.push(infos[i]);
            }
        }
        return result;
    });
    function checkRepeat(result,senderid,receiveid){
        var flag=true;
        for(var i=0;i<result.length;i++){
            if(result[i].dataValues.senderId===senderid&&result[i].dataValues.receiverId===receiveid){
                flag=false;
            }
        }
        return flag;
    }
};

// 删除用户关系(踢项目成员关系)
MessageStatusService.delUserByMessageStauts = function(userId){
    return MessageStatus.destroy({
        where:{
            $or: [{senderId: userId}, {receiverId: userId}]
        }
    });
};

// 项目人员关系
MessageStatusService.addProUsersStatus = function(members,projectId2){
    var promises = members.map(function(member){
        return MessageStatusService.addProUserStatus(member,projectId2);
    });
    return Promise.all(promises);
};

MessageStatusService.addProUserStatus = function(addProMebId,projectId2){

    var promises = ProjectMember.all({
        where: {projectId2:projectId2}
    }).then(function(dbProMebs){
        var members=[];
        for(var i=0;i<dbProMebs.length;i++)
        {
            //check(users,id)
            if(check(members,dbProMebs[i].dataValues.userId))
            {
                members.push(dbProMebs[i]);
            }
        }
        return members.map(function(dbProMeb){
            var inProMebId = dbProMeb.userId;
            return MessageStatus.bulkCreate([{
                senderId:addProMebId,receiverId:inProMebId,type:0,projectId:projectId2
            },{
                senderId:inProMebId,receiverId:addProMebId,type:0,projectId:projectId2
            }])
        });
    }).catch(function(error){
        console.log(error);
    });
    return Promise.all(promises);
    function check(users,id){
        var flag=true;
        for(var i=0;i<users.length;i++)
        {
            if(users[i].dataValues.userId===id)
            {
                flag=false;
                break;
            }
        }
        return flag;
    }
};

