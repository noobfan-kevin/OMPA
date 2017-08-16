/**
 * Created by hk053 on 2016/7/19.
 */
var log = process.core.log;
var noticeService = module.exports;
var Notice=process.core.db.models.Notice;
var NoticeLine=process.core.db.models.NoticeLine;
var UserReadNotice=process.core.db.models.UserReadNotice;
var User=process.core.db.models.User;
var File=process.core.db.models.File;
var userService = require('../service/userService');
//新建通知
noticeService.createNotice=function(data){
    var $data=commonJieXin(data);
    return Notice.create($data.data).then(function(notice){
        var fileId=$data.fileId,depart=$data.depart;
        var fileArray=[],departArray=[];
        if(fileId!=null){
            for(var i=0;i<fileId.length;i++){
                fileArray.push({
                    noticeId:notice.id,
                    fileId:fileId[i]
                });
            }
        }
        for(var j=0;j<depart.length;j++){
            departArray.push({
                noticeId:notice.id,
                departmentId:depart[j]
            });
        }
        if(fileArray.length!=0){
            return NoticeLine.bulkCreate(fileArray).then(function(fileData){
                return NoticeLine.bulkCreate(departArray).then(function(departData){
                    if(fileData&&departData) {
                        return {notice:notice,depart:depart};
                    }else{
                        return null;
                    }
                });
            });
        }else{
            return NoticeLine.bulkCreate(departArray).then(function(departData){
                if(departData) {
                    return {notice:notice,depart:depart};
                }else{
                    return null;
                }
            });
        }
    });
};

//发送通知，获取接收通知的部门人员
noticeService.getDepartUser=function(params){
    var depart=params;
    return User.findAll({where:{departmentId:{$in:depart}}}).then(function(users){
        var _length=users.length;
        if(_length!=0){
            var array=[];
            for(var i=0;i<_length;i++){
                array.push(users[i].id);
            }
            return array;
        }else{
            return null;
        }
    });
}

//查看通知
noticeService.selectNotice=function(params){
    console.log();
    return Notice.findOne({where:{id:params.id},include:[{model:NoticeLine,include:[File]}]}).then(function(data){
        return UserReadNotice.findOne({where:{readUserId:params.userId,noticeId:data.id}}).then(function(hasData){
            return noticeService.getXiangLinNotice(data).then(function(xiangLinData){
                if(hasData==null){
                    return  UserReadNotice.create({readUserId:params.userId,noticeId:data.id}).then(function(readData){
                        var time=JSON.stringify(data.created_at).substr(1,10);
                        data.createdAt=time;
                        return {noticeInfo:data,xianglin:xiangLinData};
                    });
                }else{
                    var time=JSON.stringify(data.created_at).substr(1,10);
                    data.createdAt=time;
                    return {noticeInfo:data,xianglin:xiangLinData};
                }
            });
        });
    });
}
//获取通知列表
noticeService.getNoticeList=function(data){
    //if(data.TaskStatus){
    //    var status=JSON.parse(data.TaskStatus);
    //    where.status={$in:status};
    //}
    return User.findOne({where:{id:data.userId}}).then(function(userData){
        var depart=userData.departmentId;
       return  UserReadNotice.findAll({where:{readUserId:data.userId}}).then(function(userData){
           return Notice.findAndCountAll({include:[{model:NoticeLine,where:{departmentId:depart}}],offset:(data.offset)*10,limit:10,order: [['createdAt','DESC']]}).then(function(data){
               var row=data.rows;
               var userDataLength= 0,notice=[];
               if(userData.length!=0){
                   userDataLength=userData.length;
                   for(var j=0;j<userDataLength;j++){
                       notice.push(userData[j].noticeId);
                   }
               }
               var _length=row.length,array=[],unArray=[];
               if(_length!=0){
                   for(var i= 0,time='';i<_length;i++){
                       time=userService.formatDateTime(row[i].created_at);
                           if(userDataLength!=0){
                                   if (notice.indexOf(row[i].id)!=-1) {
                                       array.push({
                                           "DT_RowId":row[i].id,
                                           title:'<span style="color: grey">'+row[i].noticetitle+'</span>',
                                           titleMain:row[i].noticetitle,
                                           sendName:row[i].sendUserName,
                                           time:'<p>'+ time.substr(0,10)+'</p>'+'<p>'+time.substr(11,18)+'</p>',
                                           content:row[i].noticeInfo
                                       });
                                   }
                                   else{
                                       unArray.push({
                                           "DT_RowId": row[i].id,
                                           title:'<i style="width: 10px;height:10px;background-color: black;border-radius: 50%;position: absolute;top:22px;left:10%; font-weight: bold;margin-left: -16px;">&#12288;</i><span style="font-weight: bold">' + row[i].noticetitle+'</span>',
                                           titleMain:row[i].noticetitle,
                                           sendName: row[i].sendUserName,
                                           time:'<p>'+ time.substr(0,10)+'</p>'+'<p>'+time.substr(11,18)+'</p>',
                                           content:row[i].noticeInfo
                                       });
                                   }
                           }else{
                               unArray.push({
                                   "DT_RowId": row[i].id,
                                   title: '<i style="width: 10px;height:10px;background-color: black;border-radius: 50%;position: absolute;top:22px;left:10%; font-weight: bold;margin-left: -16px;">&#12288;</i><span style="font-weight: bold">' +row[i].noticetitle+'</span>',
                                   titleMain:row[i].noticetitle,
                                   sendName: row[i].sendUserName,
                                   time: '<p>'+ time.substr(0,10)+'</p>'+'<p>'+time.substr(11,18)+'</p>',
                                   content:row[i].noticeInfo
                               });
                           }
                   }
                   return {array:unArray.concat(array),count:data.count};
               }else {
                   return null;
               }
           });
       });

    });
}

//通知未读个数
noticeService.getUnReadNotice=function(userId){
    return User.findOne({where:{id:userId}}).then(function(userData) {
        var depart = userData.departmentId;
        return Notice.findAndCountAll({include:[{model:NoticeLine,where:{departmentId:depart}}]}).then(function(data){
            var _length=data.rows.length,array=[];
            if(_length!=0){
               for(var i=0;i<_length;i++){
                   array.push(data.rows[i].id);
               }
            }
            return UserReadNotice.findAndCountAll({where:{readUserId:userId,noticeId:{$in:array}}}).then(function(userNotice){
                var count=0;
                if(data.count>=userNotice.count){
                  count=data.count-userNotice.count;
                }
                return {count:count};
            });
        });
    });
}
//获取通知的上一个，下一个通知
noticeService.getXiangLinNotice=function(notice) {
    return Notice.findAll({where:{created_at:{$gt:notice.created_at}},order:[['created_at','ASC']]}).then(function (lgData) {
         return Notice.findAll({where:{created_at:{$lt:notice.created_at}},order:[['created_at','DESC']]}).then(function(ltData){
             var time='',uptime='';
             if(ltData.length!=0&&lgData.length!=0){
                 time=userService.formatDateTime(ltData[0].created_at);
                 uptime=userService.formatDateTime(lgData[0].created_at);
                 return {downNotice:{id:lgData[0].id,title:lgData[0].noticetitle,time:uptime},upNotice:{id:ltData[0].id,title:ltData[0].noticetitle,time:time}};
             }else if(ltData.length==0&&lgData.length!=0){
                 uptime=userService.formatDateTime(lgData[0].created_at);
                 return {downNotice:{id:lgData[0].id,title:lgData[0].noticetitle,time:uptime}};
             }else if(ltData.length!=0&&lgData.length==0){
                 time=userService.formatDateTime(ltData[0].created_at);
                 return {upNotice:{id:ltData[0].id,title:ltData[0].noticetitle,time:time}};
             }else{
                 return null;
             }
         });
    });
};


function  commonJieXin(data){
    var depart=JSON.parse(data.department);
    var _data={
        data:{noticetitle:data.title,
            noticeInfo:data.content,
            sendUserId:data.senderId,
            sendUserName:data.senderName
        },
        depart:depart
    };
    _data.fileId=data.fileId?JSON.parse(data.fileId):null;
    return _data;
}