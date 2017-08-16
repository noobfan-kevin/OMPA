/**
 * Created by wangziwei on 2015/7/15.
 */
var Group = process.core.db.models.Group;
var User = process.core.db.models.User;
var GroupMember = process.core.db.models.GroupMember;
var MessageStatus = process.core.db.models.MessageStatus;
var UserService = require("./userService");
var MessageStatusService = require('../service/messageStatusService');
var departmentService = require('../service/departmentService');
var userService = require('../service/userService');
var log = process.core.log;
var async = require('async');
//var mongoose = require('mongoose');

var groupService = module.exports;

// 新建群
groupService.create = function (group) {
    return Group.create(group);
};

// 根据主键ID获取群信息
groupService.getById = function (id) {
    return Group.findById(id,{include: User});
};

// 根据主键ID删除群信息
groupService.deleteById = function (id) {
    return Group.destroy({
        where: {
            id: id
        },
        cascade: true
    }).then(function(){
        return MessageStatusService.delByGroupId(id);
    });
};

/**
 *
 * @param args attributes:查询字段,where:查询条件,offset:跳过数据条数,limit:查询数据条数,order:排序,include:关联
 * 参考：http://note.youdao.com/groupshare/?token=1851646F75074E9C88180593AD747223&gid=11001280
 * @returns promise
 */
groupService.query = function (args) {
    if (!args) {
        args = {};
    }
    var attributes = args.attributes;
    var where = args.where || {};
    var offset = args.offset || 0;
    var limit = args.limit;
    var order = args.order || '';
    var include = args.include || [{all: true, nested: true}];
    return Group.all(
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

// 修改
groupService.updateById = function (id, group) {
    return groupService.getById(id).then(function (dbGroup) {
        return dbGroup.update(group);
    });
};
//取出该创建人建立的所同名群
groupService.getUserSameGroup=function(groupname,userid,projid){
    return Group.all(
        {
            where:{projectId:projid,name:groupname,creatorId:userid},
            order: [["createdAt", "DESC"]]
        }
    );
};
// 增加成员
groupService.addMembers = function (id, memberids,projectId) {
    var proArr = memberids.map(function (memberId) {
        return userService.getById(memberId);
    });
    var promise1 = groupService.getById(id);
    proArr.push(promise1);
    return Promise.all(proArr).then((dbs) => (dbs.pop()).addUsers(dbs,{projectId:projectId})).then(function(){
        var promise = memberids.map(function(memberId){
            return MessageStatus.create({
                senderId:id,receiverId:memberId,type:1,projectId:projectId
            });
        });
        return Promise.all(promise);
    });

    /*var member={
        groupId:id,
        userId:memberid
    }
    console.log(member);
    return GroupMember.create(member);*/
    /*console.log("/////////////////////////////////////////////////")
    console.log(id);
    console.log(members)
    Group.findOne({id: id}).then(function (dbGroup) {
        async.each(members, function (member, cb) {
            if (dbGroup.members.indexOf(member) === -1) {
                dbGroup.members.push(member);
                User.findOne({id: member}, function (err, dbUser) {
                    dbUser.groups.push(id);
                    dbUser.save(function (err) {
                        MessageStatusService.create({
                            sender: id,
                            receiverId: member,
                            type: 1,
                            chatTime: Date.now()
                        }, cb);
                    });
                });
            } else {
                cb(null);
            }
        }, function (err) {
            if (err) {
                callback(err);
            }
            else {
                dbGroup.save(callback);
            }
        });
    });

    var promise1 = groupService.getById(id);
    var promise2 = userService.query({where: {id: {$in: members}}});

    return Promise.all([promise1, promise2]).then((dbs) => dbs[0].addUsers(dbs[1]));*/
};

// 数量
groupService.groupCount = function (conditions) {
    return Group.count(conditions);
};

// 根据用户编号查询所属群组信息
groupService.queryGroupsByUser = function (id) {
    return UserService.getById(id).then((dbUser) => dbUser.getGroups());
};

// 根据群号查找群成员
groupService.memberByGroup = function (id) {
    return groupService.getById(id).then(function (dbGroup) {
        return dbGroup.getUsers();
    });
};

// 删除群成员
groupService.delMemberByGroup = function (groupId, memberId) {
    return groupService.getById(groupId).then(function (dbGroup) {
        return dbGroup.removeUser(memberId);
    }).then(function(){
        MessageStatusService.delByRereceiverId(groupId,memberId);
    });
};

// 查询所有群以及群成员信息 todo
groupService.queryAllMemberByGroup = function () {
    return groupService.query({
        include:process.core.db.models.User
    });
};

/*groupService.queryAddMember = function(groupId,callback){
 userService.query({conditions:{$not:{'groups':groupId}}},callback);
 };*/

// todo
groupService.queryAddMember = function (groupId, departmentId, callback) {
    userService.query({
        conditions: {
           // groups: {$not: {$all: [mongoose.Types.ObjectId(groupId)]}},
            departmentId: departmentId
        }
    }, function (err, list) {
        callback(err, list);
    });
};

// todo
groupService.membersGroup = function (groupId, callback) {
    departmentService.query({}, function (err, list) {
        if (err) {
            return callback(err);
        }
        async.map(list, function (dm, cb) {
            groupService.queryAddMember(groupId, dm._id, function (err, members) {
                dm._doc.members = members;
                cb(err, dm);
            });

        }, callback);
    });
};





