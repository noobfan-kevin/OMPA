/**
 * Created by YanJixian on 2015/7/31.
 */

var io = process.core.io;

//var http = require('http');
//var server = http.createServer();
var GroupService = require('../service/groupService');
var UserService = require('../service/userService');
var chatService = require('../service/chatService');
var TaskCardService=require('../service/taskVersionService');
var ProjectService = require('../service/projectService');
var NoticeService = require('../service/noticeService');

//登陆的用户
var users = {};

//sockect 套结字
var clients = {};

//群的成员
var groupmember={};

io.sockets.on('connection', function (socket) {
    /*new Project*/
    //退回
    socket.on('createTask',function(data){
        TaskCardService.getTaskCreator(data.versionId).then(function(creator){
            if(creator){
                data.userId=creator.userId;
            }
            TaskCardService.getBymeCreateTaskUnRead(data).then(function(dbs){
               if(dbs){
                   if(creator){
                       dbs.createUserId=creator.userId;
                       dbs.taskVersionId=creator.taskVersionId;
                   }
                   io.sockets.emit('createTaskFinish',dbs);
               }
              });
        });
    });
    //制卡完成
    socket.on('sendTask',function(data){
       if(data.versionId){
           TaskCardService.getSendTaskUser(data.versionId).then(function(sender){
               if(sender!=null){
                   data.userId=sender.userId;
               }
               TaskCardService.getBymeSendTaskUnRead(data).then(function(dbs){
                   if(dbs){
                       if(sender!=null){
                           dbs.sendUserId=sender.userId;
                           dbs.taskVersionId=sender.taskVersionId;
                       }
                       io.sockets.emit('sendTaskFinish',dbs);
                   }
               });
           });
       }else{
           TaskCardService.getBymeSendTaskUnRead(data).then(function(dbs){
               if(dbs){
                   io.sockets.emit('sendTaskFinish',dbs);
               }
           });
       }
    });
    //派发
    socket.on('productTask',function(data){
        TaskCardService.getTaskProductor(data.versionId).then(function(productor){
            if(productor){
              data.userId=productor.userId[0].productorId;
            }
            TaskCardService.getBymeProductTaskUnRead(data).then(function(dbs){
                if(dbs){
                    if(productor.length!=0){
                        dbs.productorUserId=productor.userId[0].productorId;
                        dbs.taskVersionId=productor.taskVersionId;
                    }
                    io.sockets.emit('productTaskFinish',dbs);
                }
            });
        });
    });
    //提交&审核
    socket.on('checkTask',function(data){
        if(data.versionId){
            TaskCardService.getTaskCheckers(data.versionId,'').then(function(checkuser){
                if(checkuser){
                    data.userId=checkuser.userId;
                }
                TaskCardService.getBymeCheckTaskUnRead(data).then(function(dbs){
                    if(dbs){
                        if(checkuser!=null){
                            dbs.checkUserId=checkuser.userId;
                            dbs.taskVersionId=checkuser.taskVersionId;
                        }
                        io.sockets.emit('checkTaskFinish',dbs);
                    }
                });
            });
        }
        else if(data.progressId){
            TaskCardService.getTaskCheckers('',data.progressId).then(function(user){
                if(user.productor){
                    data.userId=user.productor;
                }else{
                    data.userId=user.userId;
                }
                TaskCardService.getBymeCheckTaskUnRead(data).then(function(dbs){
                    if(dbs){
                        if(user!=null){
                            if(user.productor){
                                dbs.productorId=user.productor;
                                dbs.taskVersionId=user.taskVersionId;
                            }else{
                                dbs.checkUserId=user.userId;
                                dbs.taskVersionId=user.taskVersionId;
                            }
                           if(user.status==5){
                               dbs.status=user.status;
                               dbs.checkUser=user.checkUser;
                               io.sockets.emit('completeTask',dbs);
                           }else{
                               io.sockets.emit('checkTaskFinish',dbs);
                           }
                        }
                    }
                });
            });
        }else{
            TaskCardService.getBymeCheckTaskUnRead(data).then(function(dbs){
                if(dbs){
                    io.sockets.emit('checkTaskFinish',dbs);
                }
            });
        }
    });
    //发送通知
    socket.on('createNotice',function(data){
        console.log('88888',data);
        NoticeService.getDepartUser(data.departId).then(function(users){
            if(users){
                io.sockets.emit('receiveNotice',users);
            }
        });
    });

    /* end new Project*/


    //判断用户是否已经连接服务器
    //连接时判断 用户列表中是否已经存在该用户
    socket.on("joinProjectMember",function(data) {   //添加项目的管理员
        clientMem(data.members, clients, "joinProject", {
            projectId: data["projectId"],
            projectName: data["projectName"],
            job: data["job"]
        });

        addMember(data["projectId"],data.members,clients, "addGovernMember", {
            projectId: data["projectId"],
            job: data["job"]
        });
    });

    socket.on("projectDelMember",function(data){
        var client_member = clients[data.memberId];
        if(client_member) {
            client_member.emit("leaveProject",{ "projectId" : data.projectId });
        }
        sendInfoToProjectStaff(data["projectId"],clients, "projectDelMember", {memberId : data.memberId,projectId: data["projectId"],job: data["job"]});
        groupmember = [];
    });

    socket.on("projectRename",function(data){
        sendInfoToProjectStaff(data["projectId"],clients, "projectRename",data);
    });

    socket.on("projectPutdate",function(data){
        var dateObj = data.dateInfo,
            parameObj = null;
        if(dateObj["endDate"]){
            parameObj = {'endDate' : new Date(dateObj["endDate"])};
        }else{
            parameObj = {'startDate' : new Date(dateObj["startDate"])};
        }
        ProjectService.updateById(data.projectId,parameObj);
    });

    socket.on("delProjectModule",function(data){
        sendInfoToProjectStaff(data["projectId"],clients, "delProjectModule",data,function(){
            ProjectService.deleteById(data["moduleId"]).then(function(list){});
        });
    });

    socket.on("reModuleName",function(data){
        sendInfoToProjectStaff(data["projectId"],clients, "reModuleName",data);
    });

    //添加模块
    socket.on("addModule",function(data){
        sendInfoToProjectStaff(data["projectId"],clients, "addModule",data);
    });

    //删除模块中的成员
    socket.on("delModuleMember",function(data){
        if(data.memberId && clients[data.memberId] ){
            clients[data.memberId].emit("delModuleMember",data);
        }
        ProjectService.removeMember(data.projectId,data.memberId,data.moduleId).then(function(){
            sendInfoToProjectStaff(data["projectId"],clients, "delModuleMember",data);
        });
        groupmember = [];
    });

    socket.on("addModuleMember",function(data){
        var member = JSON.parse(data.members);
        for(var i= 0,j=member.length;i<j;i++){
            if(clients[member[i]]){
                clients[member[i]].emit("addModuleMember",data);
            }
        }
        addMember(data["projectId"],data.members, clients, "addModuleMember", {
            'projectId': data.projectId,
            'moduleId': data.moduleId,
            'moduleName': data.moduleName
        });
    });

    //有人上线
    socket.on('getFriend', function (data) {
        socket.emit('friend', { "users": users });
    });

    socket.on('newNotice', function(data){
        io.sockets.emit('newNotice');
    });

    socket.on('newTask', function(data){
        //io.sockets.emit('newTask',{'sender': socket.id});
        io.sockets.emit('newTask');
        /*if (recipient&& users[recipient]) {
         if(clients[recipient]) {
         clients[recipient].emit('newTask', {'audit':data.audit});
         }
         }*/
    });

    socket.on('updateTask', function(data){
        var recipient=data.recipient;
        if (recipient&& users[recipient]) {
            if(clients[recipient]) {
                clients[recipient].emit('updateTask');
            }
        }
    });
    socket.on('online', function (data) {
        //将上线的用户名存储为 socket 对象的属性，以区分每个 socket 对象，方便后面使用
        var userId = data.userId,
            userName = data.userName;

        socket.id = userId;
        socket.userName =data.userName;

        if (!users[userId]) {
            users[userId] ={"userName":userName,"onLine":true};
        }
        clients[userId]=socket;
        //对群聊进行处理
        for(var property in groupmember){
            var singleObj = groupmember[property];
            if(singleObj[userId])
            {
                singleObj[userId].isonline=true;
            }
        }
        io.sockets.emit('online', {"userId": userId, "userName": userName});
        //用户上线的状态修改
        UserService.changeOnlineStatus(userId,1, function (list, err) {
            if (err) {
                socket.broadcast.emit('online', { "error": err});
            }
        });

    });

    //单聊
    socket.on('singleChat',function(data){
        var recipient = data.recipient,
            senderId = socket.id,
            dateTime=(new Date()).getTime();

        if(!users[senderId]) {
            io.sockets.emit('online', {"userId": senderId});
            users[senderId] ={"userName":userName,"onLine":true};
            clients[senderId]=socket;
        }
        if(clients[senderId]) {
            clients[senderId].emit('singleChat_me', {       //为了统一事件，消息全部经过服务器
                'recipient': recipient,
                'msg': data.message,
                "date": dateTime,
                'projectId': data.pjId
            });
        }
        chat(senderId,recipient,data,'singleChat',dateTime);
    });
    //获得离线消息
    socket.on('getMess_noRead',function(data) {
        var userId = socket.id;
        chatService.queryNoReadInfo(userId,data.pjId).then(function(results){
            var messInfo = [];
            results.forEach(function(val){
                if(val.length) {
                    val.forEach(function (info) {
                        var infoVal = info['dataValues'],
                            mess = {};
                        mess['id'] = infoVal['id'];
                        mess['sender'] = infoVal['senderId'];
                        mess['receiverId'] = infoVal['receiverId'];
                        mess['type'] = infoVal['type'];
                        mess['message'] = infoVal['message'];
                        // mess['pjId'] = infoVal['projectId'];
                        mess['time'] = infoVal['sendTime'];
                        messInfo.push(mess);
                    });
                }
            });
            socket.emit('noRead_mess', {"noRead_mess": messInfo});
        });
    });

    //有人下线
    socket.on('disconnect', function () {
        var userId=socket.id;
        if (users[userId]) {
            for(var property in groupmember){
                var singleObj = groupmember[property];
                if(singleObj[userId])
                {
                    singleObj[userId]["isonline"]=false;
                }
            }

            delete clients[userId];
            delete users[userId];
            socket.broadcast.emit('offline', { "userId": userId});
            //用户上线的状态修改
            UserService.changeOnlineStatus(userId,0, function (list, err) {
                if (err) {
                    socket.broadcast.emit('online', { "error": err});
                }
            });
        }
    });

    //群消息
    // 获得群成员
    socket.on('getGroupMember', function (data) { //data包含群成员编号
        var groupId = data.groupId;
        if (groupmember[groupId]) {
            socket.emit('groupMember', {"groupInfo": groupmember[groupId]});
        } else {
            group_AddUsers(groupId, function (groupUser,grCreatorId) {
                socket.emit('groupMember', {"groupInfo": groupUser,'grCreatorId':grCreatorId});
            });
        }
    });
    socket.on('delGroupUser', function (data) {
        var delUserId = data["userId"];
        var userId=socket.id;
        for(var property in groupmember){
            var singleObj = groupmember[property];
            if(singleObj[delUserId] && singleObj[userId])
            {
                delete singleObj[delUserId];
                for (var user in singleObj) {
                    var user_client = clients[user];
                    if (user_client) {
                        user_client.emit('groupDelUsers',{ "groupId":property,"userId":delUserId,"pjId": data.pjId});
                    }
                }
            }
        }
    });
    //群消息
    socket.on("groupMess", function (data) {
        var groupUser = groupmember[data.groupId];
        var sendName = socket.userName,
            senderId = socket.id,
            sendTime = (new Date()).getTime();

        if(!users[senderId]) {
            io.sockets.emit('online', {"userId": senderId});
            users[senderId] ={"userName":userName,"onLine":true};
            clients[senderId]=socket;
        }

        var mesgObj = {
            "senderId": data.groupId,
            "receiverId": senderId,
            "type": 1,
            "category": 0,
            "message": data.message,
            "projectId" : data.pjId ,
            "sendTime": sendTime,
            "attachmentAmount": 0
        };
        /** 数据不一致的原因：消息转发开发完后，做的后台，后台只用来存数据和处理离线消息 **/
        if(!groupUser) {
            group_AddUsers(data.groupId,function(data){
                groupUser = data;
                groupMess();
            });
        }else{
            groupMess();
        }
        function groupMess() {
            chatService_creat(mesgObj, function () {
                if (groupUser) {
                    for (var property in groupUser) {
                        //if (property == socket.id) continue;
                        var user_client = clients[property];
                        if (user_client) {
                            user_client.emit('groupMess', {
                                "groupId": data.groupId,
                                'sender': senderId,
                                'sendName': sendName,
                                'msg': data.message,
                                "date": sendTime,
                                "pjId": data.pjId
                            });
                        }
                    }
                }
            });
        }

    });

    //添加群成员
    socket.on("groupAddUsers", function (data) {
        var groupId = data.groupId;
        group_AddUsers(groupId, function (groupUser,grCreatorId) {
            if (groupUser) {
                for (var property in groupUser) {
                    var user_client = clients[property];
                    if (user_client) {
                        user_client.emit('groupUserRefresh', {"groupId": groupId, "addUsers": data.addUsers ,"pjId" : data.pjId,'grCreatorId':grCreatorId});
                    }
                }
            }
        });
    });

    //删除群成员
    socket.on("groupDelUsers", function (data) {
        var groupId = data.groupId,
            userId = data.userId,
            groupUser = groupmember[groupId];

        if(groupUser){
            for(var property in groupUser){
                var user_client = clients[property];
                if(user_client){
                    user_client.emit('groupDelUsers',{ "groupId":groupId,"userId":userId ,"pjId" : data.pjId});
                }
            }

            if(groupmember[groupId][userId]){
                delete groupmember[groupId][userId];
            }
        }
    });
    socket.on("delGroup",function(data){
        var groupId = data.groupId;
        sendGroupMesg(groupId,'delGroup',{"groupId": groupId,'pjId':data.pjId},socket.id);
        if(groupmember[groupId]){
            delete groupmember[groupId];
        }
    });

    //发送通知
    socket.on("notice",function(){
        socket.broadcast.emit('notice');
    });

    //修改群名称
    socket.on("editGroupInfo",function(data) {
        var groupId = data.groupId;
        sendGroupMesg(groupId,'changeGroupInfo',data,socket.id);
    });

    //项目分享——转发消息
    socket.on("schemaShare",function(data){
        for(var i= 0,j=data.users.length;i<j;i++) {
            var recipientId = data.users[i];
            chat(data.sendId, recipientId, {
                pjId: data.prjId,
                message: data.mess
            },"singleChat");
        }
    });
});

/*
 * senderId:发送人id
 * receiverId：接收人ID
 * type：群聊1，单聊0
 * category:信息的种类，0单聊，1群聊
 * content:发送内容
 * time：发送的时间，取毫秒数
 * status:未读：false，已读：true
 * attachmentAmount：文件
 * */

function chat(senderId,recipient,data,emitName,dTime){
    var dateTime = dTime || new Date().getTime()
        ,mesgObj = {
        "senderId": senderId,
        "receiverId": recipient,
        "type": 0,
        "category": 0,
        "message": data.message,
        "sendTime": dateTime,
        "attachmentAmount": 0,
        'projectId' : data.pjId
    };

    if (users[recipient]) {
        if(clients[recipient]) {
            mesgObj.status = true;
            chatService_creat(mesgObj,function() {
                clients[recipient].emit(emitName, {
                    'sender': senderId,
                    'msg': data.message,
                    "date": dateTime,
                    'projectId': data.pjId
                });
            });
        }else{
            chatService_creat(mesgObj,function(){});
        }
    }else {
        mesgObj.status = false;
        chatService_creat(mesgObj,function(){});
    }
}

function chatService_creat(mesgObj,fn) {
    chatService.create(mesgObj,fn);
}
function group_AddUsers(groupId,callBack) {
    console.log('group_AddUsers')
    GroupService.getById(groupId).then(function (groupList,err) {
        var list =groupList.Users;
        if (err) {
            socket.broadcast.emit('groupMember', {"error": err});
        }
        else {
            groupmember[groupId] = {};
            for (var i = 0, j = list.length; i < j; i++) {
                var uId = list[i].dataValues["id"],
                    isonline = false;

                if (users[uId]) {
                    isonline = true;
                }

                groupmember[groupId][uId] = {
                    id: uId,
                    "name": list[i].dataValues.name,
                    "isonline": isonline,
                    "userImg": list[i].dataValues["image"]
                }
            }
            groupmember[groupId]['creatorId'] = groupList.dataValues.creatorId;
            if (callBack) {
                callBack(groupmember[groupId]);
            }
        }
    });
}

function sendInfoToProjectStaff (projectId,clients,eventName,messObj,callback){
    if(!projectId || !eventName ) return ;    //给项目成员发送消息
    ProjectService.getByProjNameById(projectId).then(function (dbProject) {
        var users = dbProject.Users,
            usersList = [];

        for (var i = 0; i < users.length; i++) {    //项目的全体成员
            var userInfoFilter = {};
            userInfoFilter["id"] = users[i]["id"];
            usersList.push(userInfoFilter);
        }

        for (var index = 0, j = usersList.length; index < j; index++) {  //通知项目成员，项目的人员变化了
            client_member = clients[usersList[index]["id"]];
            if (client_member) {
                client_member.emit(eventName,messObj);
            }
        }
        if(callback){
            callback();
        }
    })
}

//添加成员
function addMember(projectId,member,clients,emitName,emitData){
    var addMember = JSON.parse(member);

    ProjectService.getByProjNameById(projectId).then(function (dbProject) {    //查询项目信息
        var users = dbProject.Users,
            usersList = [],
            memberInfo = [];

        for (var i = 0; i < users.length; i++) {    //项目的全体成员
            var userInfoFilter = {};
            userInfoFilter["id"] = users[i]["id"];
            userInfoFilter["name"] = users[i]["name"];
            userInfoFilter["image"] = users[i]["image"];
            userInfoFilter["job"] = users[i]["ProjectMember"]["dataValues"]["job"];
            userInfoFilter["online"] = !!clients[users[i]["id"]];
            for (var a = 0, b = addMember.length; a < b; a++) {
                if (addMember[a] == users[i]["id"]) {
                    memberInfo.push(userInfoFilter);
                }
            }
            usersList.push(userInfoFilter);
        }

        emitData['memberInfo'] = JSON.stringify(memberInfo);
        for (var index = 0, j = usersList.length; index < j; index++) {  //通知项目成员，项目的人员变化了
            client_member = clients[usersList[index]["id"]];
            if (client_member) {
                client_member.emit(emitName,emitData);
            }
        }
    })
}
//给当前在线人员发送消息
//member arr 在线的人
//sendMesg   发送的对象
function clientMem(members,clients,emitName,emitData){
    var addMember = JSON.parse(members) || [],
        client_member = null;

    for (var i = 0, j = addMember.length; i < j; i++) {
        client_member = clients[addMember[i]];
        if (client_member) {
            client_member.emit(emitName, emitData);
        }
    }
}

//群组发消息
function sendGroupMesg(groupId,emitName,emitData,scoketUser){
    var groupUser = groupmember[groupId];
    if(groupUser) {
        sendGroupEmit(groupUser);
    }else{
        group_AddUsers(groupId, function (userList) {
            sendGroupEmit(userList);
        });
    }
    function sendGroupEmit(groupUsers){
        for (var property in groupUsers) {
            if (property == scoketUser) continue;
            var user_client = clients[property];
            if (user_client) {
                user_client.emit(emitName, emitData);
            }
        }
    }
}