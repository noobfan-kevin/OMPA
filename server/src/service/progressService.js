/**
 * Created by wangziwei on 2015/9/13.
 */
var Progress = process.core.db.models.Progress;
var User = process.core.db.models.User;
var Creator = process.core.db.models.Creator;
var Producer = process.core.db.models.Producer;
var TaskCheckMember=process.core.db.models.TaskCheckMember;
var TaskVersion=process.core.db.models.TaskVersion;
var ReviewComment=process.core.db.models.ReviewComment;
var CreditsDetail=process.core.db.models.CreditsDetail;
var File=process.core.db.models.File;
var log = process.core.log;
var userLog = require('../core/userLog');
var async = require('async');
var taskCardService = require('./taskVersionService');
var creditService = require('./creditService');
var progressService = module.exports;

// 新建
progressService.create = function (progress) {

    return Progress.create(progress).then(function (data) {
        return progressService.getLimitByTaskVersion(data.taskVersionId).then(function ( dbPro) {
            var taskCardPro = [];
            for (var i = dbPro.length - 1; i >= 0; i--) {
                var taskObj = {};
                taskObj.name = dbPro[i].name;
                taskObj.percent = dbPro[i].percent;
                taskObj.status = dbPro[i].status;
                taskCardPro.push(taskObj);
            }
            var newData = {
                receiverId: dbPro[0] && dbPro[0].producerId,
                progress: taskCardPro
            };
            return taskCardService.updateById(data.taskVersionId, newData).then(function () {
                return progressService.getById(data.id);
            });
        })
    });
};

// 保存进程
progressService.createArray = function (progress) {
    var promises = progress.map(function (pro) {
        return Progress.create(pro);
    });
    return Promise.all(promises);
};

// 根据主键ID获取信息
progressService.getById = function (id) {
    return Progress.findById(id);
};

// 根据任务卡号获取信息
progressService.getByTaskVersion = function (id) {
    return progressService.query({
        where: {
            taskVersionId: id
        },
        order: [["index"]]
    });
};

// 查询最后三个进程
progressService.getLimitByTaskVersion = function (id) {
    return taskCardService.getById(id).then(function(results){
        return progressService.query({
            where: {
                taskVersionId: id
            },
            order: [["index"]],
            limit: results.progressDoneNum+1
        })
    }).then(function(results){
        if(results.length>3){
            //for(var i = 0; i<results.length;i++){
            var  status = [];
            status.push(results[results.length-3]);
            status.push(results[results.length-2]);
            status.push(results[results.length-1]);
            //}
            return status
        }
        else{
            return results;
        }
    });
};

// 根据主键ID删除
progressService.deleteById = function (id) {
    return progressService.getById(id).then(function (dbPro) {
        return dbPro.destroy();
    });
};

// 根据任务卡版本删除进程
progressService.deleteByTaskVersion = function (id) {
    return Plan.destroy({
        where: {
            taskVersionId: id
        }
    });
};

progressService.insertCredit = function (progress) {
    var credit = {
        progressId: progress.id,
        taskVersionId: progress.taskVersionId,
        percent: progress.percent,
        userId: progress.producerId,
        projectId: progress.projectId,
        name: progress.name
    };
    return creditService.createByTaskVersionId(credit);
};

// 修改
progressService.updateById = function (id, progress) {

    return Progress.findById( id).then(function (dbProgress) {

        return dbProgress.update(progress);
    }).then(function (data) {
        return progressService.getLimitByTaskVersion(data.taskVersionId).then(function (dbPro) {
            var taskCardPro = [];
            for (var i = dbPro.length - 1; i >= 0; i--) {
                var taskObj = {};
                taskObj.name = dbPro[i].name;
                taskObj.percent = dbPro[i].percent;
                taskObj.status = dbPro[i].status;
                taskCardPro.push(taskObj);
            }
            var newData = {
                receiverId: dbPro[0] && dbPro[0].producerId,
                progress: taskCardPro
            };
            //进程改变， 任务卡也变
            if (data.status === 1) {
                //已提交未审核
                newData.status = 5;
            } else if (data.status === 2) {
                newData.status = 2;
            }else if (data.status === 3 && progress.update) {
                //进程完成
                newData.status = 2;
                newData.progressDoneNumAdd = 1;
            }

            return taskCardService.updateById(data.taskVersionId, newData).then(function () {
                if (data.status === 3 && progress.update) {
                    //进程完成
                    return progressService.insertCredit(data);
                }
            }).then(function () {
                return data;
            });
        });
    });
};

progressService.count = function (conditions) {
    return Progress.count(conditions);
};


// 修改所有进程
progressService.updateAll = function (progress) {
    var promises = progress.map(function (pro) {
        return progressService.updateById(pro.id, pro);
    });
    return Promise.all(promises).then(function (dbProgresses){
        var complete = dbProgresses.every(function (dbPro) {
           return  !!dbPro.completeDate || !dbPro.name;
        });
        if (complete) {
            return taskCardService.updateById(dbProgresses[0].taskVersionId ,{completeDate: new Date()}).then(function () {
                return dbProgresses;
            });
        } else {
            return dbProgresses;
        }
    });
};

/**
 *
 * @param args attributes:查询字段,where:查询条件,offset:跳过数据条数,limit:查询数据条数,order:排序,include:关联
 * 参考：http://note.youdao.com/groupshare/?token=1851646F75074E9C88180593AD747223&gid=11001280
 * @returns promise
 */
progressService.query = function (args) {
    if (!args) {
        args = {};
    }
    var attributes = args.attributes;
    var where = args.where || {};
    var offset = args.offset || 0;
    var limit = args.limit;
    var order = args.order || '';
    var include = args.include || [Creator, Producer];
    return Progress.all(
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

// 保存进程
progressService.updateAndCreate = function (progress) {
    var promises = progress.map(function (pro) {
        if (pro.id) {
            return progressService.updateById(pro.id, pro);
        }
        else {
            return progressService.create(pro);
        }
    });
    return Promise.all(promises).then(function (dbProgresses){
        var complete = dbProgresses.every(function (dbPro) {
            return  !!dbPro.completeDate || !dbPro.name;
        });
        if (complete) {
            return taskCardService.updateById(dbProgresses[0].taskVersionId ,{completeDate: new Date()}).then(function () {
                return dbProgresses;
            });
        } else {
            return dbProgresses;
        }
    });
};


/*
* new progress
* */
//新建进程
progressService.createProgress=function(data){
    return Progress.findAll({where:{taskVersionId:data.taskVersionId}}).then(function(params){
        if(params.length==0){
            data.curProgress='true';
        }else{
            data.curProgress='false';
        }
        return  Progress.create(data).then(function(progressData){
            return taskCardService.getCheckUsers(progressData.taskVersionId).then(function(checkUsers){
                if(checkUsers.length!=0){
                    var array=[];
                    for(var i=0;i<checkUsers.length;i++){
                            array.push({
                                progressId:progressData.id,
                                userId:checkUsers[i].userId,
                                checkFlag:checkUsers[i].checkFlag,
                                checkType:1,
                                curCheck:'false'
                            });
                    }
                    return TaskCheckMember.bulkCreate(array).then(function(checkMembers){
                        userLog.log({type:1,typeId:progressData.taskVersionId,projectId:progressData.projectId,description:'新建任务卡进程:'+progressData.name});
                        return progressData;
                    });
                }
            });
        });
    });
}

//编辑进程
progressService.updateProgress=function(data){
    if(data.id){
       return  Progress.findAll({where:{id:data.id}}).then(function(progressData){
            if(progressData){
              var changeInfo=progressLog(progressData,data);
                if(changeInfo!='修改任务卡进程：\r\n'){
                    userLog.log({type:1,typeId:progressData[0].taskVersionId,projectId:progressData[0].projectId,description:changeInfo});
                    return  Progress.update(data,{where:{id:data.id}});
                }else{
                    return 1;
                }
            }
        });
    }
}

function progressLog(oldData,newData){
    var changeInfo='修改任务卡进程：\r\n';
    if(oldData[0].name!=newData.name){
        changeInfo+='将进程名字：'+oldData[0].name+'修改为'+newData.name+'\r\n';
    }
    if(oldData[0].step!=newData.step){
        changeInfo+='将进程制作步骤：'+oldData[0].step+'修改为'+newData.step+'\r\n';
    }
    if(oldData[0].percent!=newData.percent){
        changeInfo+='将进程比重：'+oldData[0].percent+'修改为'+newData.percent+'\r\n';
    }
    if(oldData[0].startDate!=newData.startDate){
        changeInfo+='将进程开始时间：'+JSON.stringify(oldData[0].startDate).substr(1,10)+'修改为'+newData.startDate+'\r\n';
    }
    if(oldData[0].predictDate!=newData.predictDate){
        changeInfo+='将进程预计时间：'+JSON.stringify(oldData[0].predictDate).substr(1,10)+'修改为'+newData.predictDate+'\r\n';
    }
    return changeInfo;
}
//获取进程列表
progressService.getProgress=function(taskVersionId){
  return   Progress.findAll({where:{taskVersionId:taskVersionId}, order: [['createdAt','ASC']] ,
               include:[Creator,Producer,TaskCheckMember,{model:ReviewComment,include:[{model:File,as:'belongFile',attributes:['originalName']},{model:User,as:'sender',attributes:['id','name']}],
                   attributes:['content']},
              {model:TaskVersion,attributes:['id'],include:
              [{model:TaskCheckMember,where:{versionId:taskVersionId},attributes:['id'],include:
                [{model:User,attributes:['id','name','image']}]}]}]}).then(function(data){
        return getProressData(data);
    });
}
//获取单个进程的审核状态
progressService.getOneProgress=function(id){
    return TaskCheckMember.find({progressId:id}).then(function(data){
       return data;
    });
}
//删除一个进程及进程下的所有评论
progressService.deleteProgress=function(progressId){
    return progressService.getProgressInfo(progressId).then(function(progressData){
        return  ReviewComment.destroy({where:{progressId:progressId}}).then(function(data){
            return Progress.destroy({where:{id:progressId}}).then(function(proData){
                userLog.log({type:1,typeId:progressData.taskVersionId,projectId:progressData.projectId,description:'删除任务卡进程：'+progressData.name});
                return proData;
            });
        });
    });
}
//删除一个任务卡下所有进程及进程下的所有评论
progressService.deleteTaskAllProgress=function(versionId){
    return  ReviewComment.destroy({where:{versionId:versionId}}).then(function(data){
        return Progress.destroy({where:{taskVersionId:versionId}});
    });
}
//审核人对进程的审核
/*
* 0:审核失败
* 1:审核成功
* 2:已审核过
* 3:没有审核权限
* */
progressService.checkProgress=function(progressData){
       var checkStatus=progressData.status;//审核状态
       var promise1= progressService.getCheckUserInfo(progressData.progressId,progressData.userId);
        var promise2=progressService.getProgressInfo(progressData.progressId);
       return Promise.all([promise1,promise2]).then(function(dbs){
          if(dbs[0].length!=0&&dbs[1].length!=0){
              if(dbs[0][0].checkType==1){
                  return TaskCheckMember.update({checkType:checkStatus,curCheck:'false'},{where:{progressId:progressData.progressId,userId:progressData.userId}}).
                  then(function(db){
                      if(db==1) {
                          return TaskCheckMember.findAll({where:{progressId:progressData.progressId}}).then(function(checkUserInfo){
                              if(dbs[0][0].checkFlag!=checkUserInfo.length){
                                  return TaskCheckMember.update({curCheck:'true'},{where:{progressId:progressData.progressId,checkFlag:(dbs[0][0].checkFlag+1)}}).then(function(data){
                                      if(data==1){
                                          return progressService.getProgressStatusToChangeVersion(checkStatus,progressData,dbs[1]);
                                      }else{
                                          return 0;
                                      }
                                  });
                              }else{
                                  return progressService.getProgressStatusToChangeVersion(checkStatus,progressData,dbs[1]);
                              }
                          });
                      }
                      else{
                          return 0;
                      }
                  });
              }else{
                  return 2;
              }
          }else{
              return 3;
          }
       });
}
//根据审核状态，改变当前任务卡的状态
progressService.getProgressStatusToChangeVersion=function(checkStatus,progressData,progressInfo){
            userLog.log({type:1,typeId:progressInfo[0].taskVersionId,projectId:progressInfo[0].projectId,description:progressInfo[0].name+'进程审核完成'});
            if (checkStatus == 0) {
                return TaskVersion.update({status: 4,readStatus:'false'}, {where: {id: progressData.taskVersionId}}).then(function(datas){
                    return TaskCheckMember.update({curCheck:'false'},{where:{progressId:progressData.progressId}}).then(function(){
                        return 1;
                    })
                });
            } else {
                return progressService.getProgressCheckStatus(progressData.progressId).then(function (data) {//根据进程审核状态，改变任务卡版本的状态
                    if (data.length != 0) {
                        var _length = data.length;
                        var str = 0;
                        for (var i = 0; i < _length; i++) {
                            if (data[i].checkType == 2) {
                                str += 1;
                            }
                        }
                        if (str == _length) {
                            var now=new Date();
                            return Progress.update({
                                status: 1,
                                curProgress: 'false',
                                completeDate:now
                            }, {where: {id: progressData.progressId}}).then(function (updata) {
                                if (updata == 1) {
                                            return progressService.getVersionProgressType(progressData.taskVersionId,progressData.progressId).then(function(versonType) {
                                                if (versonType != 1) {
                                                    return TaskVersion.update({status: 4,readStatus:'false'}, {where: {id: progressData.taskVersionId}}).then(function(){
                                                        return Progress.findAll({
                                                            where: {
                                                                taskVersionId: progressData.taskVersionId,
                                                                status: {$ne: 1}
                                                            }, order: [['createdAt', 'ASC']]
                                                        }).
                                                        then(function (progresses) {
                                                            if (progresses.length != 0) {
                                                                return Progress.update({curProgress: 'true'}, {where: {id: progresses[0].id}}).then(function(){
                                                                   return TaskVersion.findOne({where:{id:progressData.taskVersionId}}).then(function(dbData){
                                                                        return progressService.saveProgressProductor(progressData.taskVersionId,dbData.productorId);
                                                                   });
                                                                });
                                                            } else {
                                                                return 1;
                                                            }
                                                        });
                                                    });
                                                }else{
                                                    return Progress.findAll({
                                                        where: {
                                                            taskVersionId: progressData.taskVersionId,
                                                            status: {$ne: 1}
                                                        }, order: [['createdAt', 'ASC']]
                                                    }).
                                                    then(function (progresses) {
                                                        if (progresses.length != 0) {
                                                            return Progress.update({curProgress: 'true'}, {where: {id: progresses[0].id}}).then(function(){
                                                                return TaskVersion.findOne({where:{id:progressData.taskVersionId}}).then(function(dbData){
                                                                    return progressService.saveProgressProductor(progressData.taskVersionId,dbData.productorId);
                                                                });
                                                            });
                                                        } else {
                                                            return 1;
                                                        }
                                                    });
                                                }
                                            });
                                } else {
                                    return 0;
                                }
                            });
                        } else {
                            return TaskVersion.update({readStatus:'false'},{where:{id:progressData.taskVersionId}});
                        }
                    } else {
                        return 0;
                    }
                });
          }
   }

//获取一个任务卡版本下的所有进程审核状态，并改变任务卡状态,添加用户积分
progressService.getVersionProgressType=function(taskVersionId,progressId){
    return Progress.findAll({where:{taskVersionId: taskVersionId},attributes:['id']}).then(function (progressNum) {
        var array=[];
        for(var i=0;i<progressNum.length;i++){
            array.push(progressNum[i].id);
        }
        return TaskCheckMember.findAll({where:{progressId:{$in:array}}}).then(function(progressCheckNum){
            var check_length=progressCheckNum.length;
            var srr=0;
            for(var j=0;j<check_length;j++){
               if(progressCheckNum[j].checkType==2){
                   srr+=1;
               }
            }
            return TaskVersion.findAll({include:{model:Progress,where:{id:progressId,status:1}}}).then(function(taskProgress) {
                var data={taskVersionId:taskProgress[0].id,taskVersionName:taskProgress[0].name,taskVersion:taskProgress[0].version,
                    progressId:taskProgress[0].Progresses[0].id,progressName:taskProgress[0].Progresses[0].name,
                    userId:taskProgress[0].productorId,score:Math.ceil((taskProgress[0].points)*(parseFloat(taskProgress[0].Progresses[0].percent) / 100))};
                var completeProgress=parseFloat(taskProgress[0].completeProgress)+parseFloat(taskProgress[0].Progresses[0].percent);
                return TaskVersion.update({completeProgress:completeProgress},{where:{id:taskVersionId}}).then(function(){
                                    if(srr==check_length){
                                        var now=new Date();
                                        return CreditsDetail.findAll({where:{taskVersionId:taskVersionId}}).then(function(progressDetail){
                                            var _length=progressDetail.length;
                                            var _point=0;
                                            if(_length!=0){
                                                for(var i=0;i<_length;i++){
                                                    _point+=parseInt(progressDetail[i].score);
                                                }
                                            }
                                            data.score=taskProgress[0].points-_point;
                                            return CreditsDetail.create(data).then(function(){
                                                return User.findOne({
                                                    where: {id: taskProgress[0].productorId},
                                                    attributes: ['points']
                                                }).then(function (userPoints) {//进程审核完成后更新用户积分
                                                    var points = parseInt(userPoints.points) + parseInt(data.score);
                                                    return User.update({points: points}, {where: {id: taskProgress[0].productorId}}).then(function (userDb) {
                                                        return TaskVersion.update({status:5,readStatus:'true',endDate:now},{where:{id:taskVersionId}}).then(function(dbs){
                                                            return 1;
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    }else{
                                        return CreditsDetail.create(data).then(function() {
                                            return User.findOne({
                                                where: {id: taskProgress[0].productorId},
                                                attributes: ['points']
                                            }).then(function (userPoints) {//进程审核完成后更新用户积分
                                                var points = parseInt(userPoints.points) + parseInt(data.score);
                                                return User.update({points: points}, {where: {id: taskProgress[0].productorId}}).then(function (userDb) {
                                                    return null;
                                                });
                                            });
                                        });
                                    }
                                });
                            });
                        });
                    });
}

//获取一个进程的一个审核人的审核状态
progressService.getCheckUserInfo=function(progressId,userId){
    return TaskCheckMember.findAll({where:{progressId:progressId,userId:userId}});
}
//获取当前进程是否全部审核完成
progressService.getProgressCheckStatus=function(progressId){
    return TaskCheckMember.findAll({where:{progressId:progressId}});
}
//获取进程信息
progressService.getProgressInfo=function(progressId){
    return Progress.findAll({where:{id:progressId}});
}

//保存进程的的制作人
progressService.saveProgressProductor=function(taskVersionId,productorId){
   return Progress.update({producerId:productorId},{where:{taskVersionId:taskVersionId,curProgress:'true'}});
}
/*
* 安卓获取进程状态并返回
*
* */
progressService.getProgressStatusForAndroid=function(versionId){
    return Progress.findAll({where:{taskVersionId:versionId},order: [['createdAt','DESC']],
        include:[{model:ReviewComment,include:[{model:File,as:'belongFile',attributes:['originalName']},{model:User,as:'sender',attributes:['id','name']}],
            attributes:['content']}]
        }).then(function(progresses){
        var _length=progresses.length;
        var data={};
         if(_length!=0){
             var finishData=[],curData=[],unFinish=[],str='';
             for(var i=0;i<_length;i++){
                     var dataInfo={
                         id:progresses[i].id,
                         name:progresses[i].name,
                         step:progresses[i].step,
                         percent:progresses[i].percent,
                         startDate:progresses[i].startDate!=null?JSON.stringify(progresses[i].startDate).substr(1,10):null,
                         progressStatus:progresses[i].status,
                         curProgress:progresses[i].curProgress,
                         predictDate:progresses[i].predictDate!=null?JSON.stringify(progresses[i].startDate).substr(1,10):null,
                         completeDate:progresses[i].completeDate!=null?JSON.stringify(progresses[i].startDate).substr(1,10):null,
                         producerName:progresses[i].producer!=null?progresses[i].producer.name:'',
                     };
                     if(progresses[i].status==1){
                         if(progresses[i].ReviewComments.length!=0){
                             var length=progresses[i].ReviewComments!=null?progresses[i].ReviewComments.length:0;
                                    dataInfo.reviewContent=progresses[i].ReviewComments[length-1]!=null?progresses[i].ReviewComments[length-1].content:null;
                                    dataInfo.reviewSender=progresses[i].ReviewComments[length-1]!=null?progresses[i].ReviewComments[length-1].sender.name:null;
                                    dataInfo.fileName=progresses[i].ReviewComments[length-1].belongFile!=null?progresses[i].ReviewComments[length-1].belongFile.originalName:nulll;
                             }else{
                                     dataInfo.reviewContent=null;
                                     dataInfo.reviewSender=null;
                                     dataInfo.fileName=null;
                              }
                             finishData.push(dataInfo);
                      }else if(progresses[i].curProgress=='true'){
                             if(progresses[i].ReviewComments.length!=0){
                                 var length=progresses[i].ReviewComments!=null?progresses[i].ReviewComments.length:0;
                                 dataInfo.reviewContent=progresses[i].ReviewComments[length-1]!=null?progresses[i].ReviewComments[length-1].content:null;
                                 dataInfo.reviewSender=progresses[i].ReviewComments[length-1]!=null?progresses[i].ReviewComments[length-1].sender.name:null;
                                 dataInfo.fileName=progresses[i].ReviewComments[length-1].belongFile!=null?progresses[i].ReviewComments[length-1].belongFile.originalName:nulll;
                             }else{
                                 dataInfo.reviewContent=null;
                                 dataInfo.reviewSender=null;
                                 dataInfo.fileName=null;
                             }
                                 curData.push(dataInfo);
                         }  else{
                                 if(progresses[i].ReviewComments.length!=0){
                                     var length=progresses[i].ReviewComments!=null?progresses[i].ReviewComments.length:0;
                                     dataInfo.reviewContent=progresses[i].ReviewComments[length-1]!=null?progresses[i].ReviewComments[length-1].content:null;
                                     dataInfo.reviewSender=progresses[i].ReviewComments[length-1]!=null?progresses[i].ReviewComments[length-1].sender.name:null;
                                     dataInfo.fileName=progresses[i].ReviewComments[length-1].belongFile!=null?progresses[i].ReviewComments[length-1].belongFile.originalName:nulll;
                                 }else {
                                     dataInfo.reviewContent=null;
                                     dataInfo.reviewSender=null;
                                     dataInfo.fileName=null;
                                 }
                                     unFinish.push(dataInfo);
                                 }
                   }
                     data={finishData:finishData,curData:curData,unFinish:unFinish};
                     return data;
              }
           else {
             return data;
         }
    });
}
function getProressData(data){
    var _length=data.length;
    var arrayProgress=[];
    var startDate='';
    var predictDate='';
    var completeDate='';
    var checkUser='';
    var checkStatus='';
    var progressData={};
    for(var i=0;i<_length;i++ ){
        var checkUserStatus=[];
         checkUser=data[i].TaskVersion.TaskCheckMembers;
         checkStatus=data[i].TaskCheckMembers;
         startDate=JSON.stringify(data[i].startDate).substr(1,10);
         predictDate=JSON.stringify(data[i].predictDate).substr(1,10);
         completeDate=data[i].completeDate!=null?JSON.stringify(data[i].completeDate).substr(1,10):'';
             for(var t=0;t<checkStatus.length;t++){
                 checkUserStatus.push({userId:checkStatus[t].userId,name:checkUser[t].User.name,image:checkUser[t].User.image,checkFlag:checkStatus[t].checkFlag,checkType:checkStatus[t].checkType});
             }
        progressData={
              id:data[i].id,
              name:data[i].name,
              step:data[i].step,
              percent:data[i].percent,
              startDate:startDate,
              progressStatus:data[i].status,
              curProgress:data[i].curProgress,
              predictDate:predictDate,
              completeDate:completeDate,
              producerName:data[i].producer?data[i].producer.name:'',
              checkUser:checkUserStatus,
              sender:null,
              content:null,
              fileName:null
          };
         var review=data[i].ReviewComments;
            if(review.length!=0){
                var length=review.length;
                progressData.sender=data[i].ReviewComments[length-1].sender.name;
                progressData.content=data[i].ReviewComments[length-1].content;
                progressData.fileName=data[i].ReviewComments[length-1].belongFile!=null?data[i].ReviewComments[length-1].belongFile.originalName:null;
            }
        arrayProgress.push(progressData);
    }
    return arrayProgress;
}