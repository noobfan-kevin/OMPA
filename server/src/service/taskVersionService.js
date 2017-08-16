/**
 * Created by YanJixian on 2015/11/19.
 */

var TaskVersion = process.core.db.models.TaskVersion;//任务卡版本
var Task=process.core.db.models.Task;//任务卡
var Plan=process.core.db.models.Plan;//方案
var creator=process.core.db.models.creator;
var productor=process.core.db.models.productor;
var sender=process.core.db.models.sender;
var User=process.core.db.models.User;
var Role = process.core.db.models.Role;
var Authority = process.core.db.models.Authority;
var Project=process.core.db.models.Project;
var Contract=process.core.db.models.Contract;
var TaskCheckMember=process.core.db.models.TaskCheckMember;//审核人
var ProjectMember=process.core.db.models.ProjectMember;//节点负责人
var AssetsInfo=process.core.db.models.AssetsInfo;//资产
var Scene=process.core.db.models.Scene;//镜头
var StepInfo=process.core.db.models.StepInfo;//步骤
var StepChildren=process.core.db.models.StepChildren;//步骤的叶子节点
var log = process.core.log;
var userLog = require('../core/userLog');
var taskVersionService = module.exports;
var planService = require('./planService');
var progressService = require('./progressService');
var Progress = process.core.db.models.Progress;

//taskVersionService.create = function (taskVersion) {
//    return TaskVersion.create(taskVersion);
//};
//
//taskVersionService.getById = function (id) {
//    return TaskVersion.findById(id, {include : [{all: true}]});
//};
//
//taskVersionService.getCurrentTaskCardById = function (id) {
//    return TaskVersion.findById(id);
//};
//
//taskVersionService.updateById = function (id, taskVersion) {
//    return taskVersionService.getById(id).then(function (dbTaskVersion) {
//        if (taskVersion.progressDoneNumAdd ===1 ){
//            taskVersion.progressDoneNum = dbTaskVersion.progressDoneNum+1;
//        }
//        return dbTaskVersion.update(taskVersion);
//    });
//};
//
//taskVersionService.deleteById = function (id) {
//    return taskVersionService.getById(id).then(function (dbTaskVersion) {
//        return dbTaskVersion.destroy({cascade: true});
//    });
//};
//
//taskVersionService.count = function (conditions) {
//    return TaskVersion.count(conditions);
//};
//
///**
// *
// * @param args attributes:查询字段,where:查询条件,offset:跳过数据条数,limit:查询数据条数,order:排序,include:关联
// * 参考：http://note.youdao.com/groupshare/?token=1851646F75074E9C88180593AD747223&gid=11001280
// * @returns promise
// */
//taskVersionService.query = function (args) {
//    if (!args) {
//        args = {};
//    }
//    var attributes = args.attributes;
//    var where = args.where || {};
//    var offset = args.offset || 0;
//    var limit = args.limit;
//    var order = args.order || '';
//    var include = args.include || [{all: true}];
//    return TaskVersion.all(
//        {
//            attributes: attributes,
//            where: where,
//            offset: offset,
//            limit: limit,
//            order: order,
//            include: include
//        }
//    );
//};
//
//taskVersionService.taskVersionTotal = function (where) {
//    return TaskVersion.count(where);
//};
//
//// 根据所属任务编号查询
//taskVersionService.getByTaskId = function (taskId) {
//    return taskVersionService.query({
//        where: {
//            taskId: taskId
//        },
//        order: [["createdAt"]]
//    });
//};
//
//// 根据所属接收人编号查询
//taskVersionService.getByReceiverId = function (receiverId,projectId) {
//    return taskVersionService.query({
//        where: {
//            receiverId: receiverId,
//            projectId:projectId,
//            status: {$in: [1, 2, 5]}
//        },
//        order: ["status", ["updatedAt", "DESC"]]
//    });
//};
//
//
//// 修改备注
//taskVersionService.updateRemarkById = function (id, remark) {
//
//    return taskVersionService.getById(id).then(function (dbTask) {
//
//        dbTask.remark = remark;
//
//        return dbTask.save();
//    });
//
//};
//
//// 根据任务名称修改任务卡名称
//taskVersionService.updateNameByTaskId = function(name,taskId){
//    return TaskVersion.update({name:name},{
//        where:{
//            taskId:taskId
//        }
//    });
//};
//
///**
// *
// * @param where
// * @param taskCard
// * @param useTransact 是否用事务，慢！
// * @returns {Promise.<Instance, created>} .spread((function(task, created){})
// */
//taskVersionService.findOrCreate = function (where, taskCard, useTransact) {
//    if (useTransact) {
//        return TaskVersion.findOrCreate({where: where, defaults: taskCard});
//    }
//    else {
//        return TaskVersion.findCreateFind({where: where, defaults: taskCard});
//    }
//};
//
//
//// 根据当前任务卡的所属任务编号查询任务卡
//taskVersionService.queryVersionsByOtherVersionId = function (versionId) {
//    return taskVersionService.getById(versionId).then(function (dbVersion) {
//        if (dbVersion) {
//            return taskVersionService.getByTaskId(dbVersion.taskId);
//        }
//        else {
//            return Promise.resolve(null);
//        }
//    })
//};
//
//// 根据审核人编号查询任务卡信息
//taskVersionService.queryVersionsByAuditor = function (auditorId) {
//    // 去重查询
//    return taskVersionService.query({
//        include: [{
//            model: Progress
//        }],
//        order: [['createdAt']]
//
//    }).then(function (dbTasks) {
//        dbTasks.map(function (dbTask) {
//            dbTask.Progresses.sort(function (p1, p2) {
//                return p1.index - p2.index;
//            });
//        });
//        return dbTasks;
//    }).then(function (dbTasks) {
//
//        return dbTasks.map(function (dbTask) {
//            var length = dbTask.progressDoneNum;
//            if (dbTask.Progresses[length] && dbTask.Progresses[length].auditors && dbTask.Progresses[length].auditors.some(function (auditor) {
//                    return auditor.id === auditorId && auditor.isAudit === false;
//                }) && dbTask.status === 5 ){
//                return dbTask;
//            }
//        })
//    });
//};



/**
  new
 * */
/*新建任务卡
* @params任务卡基本信息
* */
taskVersionService.createTask=function(params){
    var taskInfo=params.Info;
  return  Task.create(taskInfo).then(function(newTask){
         var taskVersion=params.version;
          taskVersion.taskId=newTask.id;
        return  TaskVersion.create(taskVersion).then(function(taskVersion){
            var array=[];
            for(var i=0;i<params.checkId.length;i++){
                array.push({
                    versionId:taskVersion.id,
                    userId:params.checkId[i],
                    checkFlag:i+1
                });
            }
             return TaskCheckMember.bulkCreate(array).then(function(checkMember){
                 userLog.log({type:1,typeId:taskVersion.id,projectId:taskInfo.projectId,description:'新建任务卡:'+taskVersion.name+'('+taskVersion.version+')'});
                 return taskVersion==''?'createFailed':{message:'createSuccess',list:newTask};
             });
         });
    });
}

/*
* 编辑任务卡
*@params 任务卡编辑后的信息,将要编辑的任务卡版本修改为当前版本
* */
taskVersionService.updateTask=function(params){
    var taskInfo=params.Info;
     if(params.version.versionId){
         taskVersionService.selectOneTask(params.version.versionId).then(function(versionData){
             var changeInfo=updateTaskLog(versionData,params);
             if(changeInfo!='修改任务卡:\r\n') {
                 return Task.update(taskInfo,{where:{id:taskInfo.taskId}}).then(function(updateTask){
                     var taskVersion=params.version;
                     taskVersion.taskId=taskInfo.taskId;
                     taskVersion.currentStatus='true';
                     return TaskVersion.update({currentStatus:'false'},{where:{id:{$ne:taskVersion.versionId},taskId:taskInfo.taskId}}).then(function(){
                         return  updateCommon(params,taskVersion);
                     });
                 });
             }else{
                 return 1;
             }
         });
     }
}
/*
* 改变任务卡版本的状态
*1:修改成功
* 0：修改失败
* */
taskVersionService.updateTaskStutas=function(data){
    var where={};
    if(data.userId&&data.status){
        where={status:data.status,senderId:data.userId};
    }
    if(data.status){
        where.status=data.status;
    }
    if(data.readStatus){
      where.readStatus=data.readStatus;
    }
   return  TaskVersion.findOne({where:{id:data.versionId}}).then(function(taskVersionData){
       if(taskVersionData!=null){
           return taskVersionData.update(where).then(function(versiondata) {
               if(data.projectId){
                   taskChangeStatus(taskVersionData,data);
               }
               return taskVersionService.productorComitProgress(taskVersionData,data);
           });
       }else{
            return 'Noexist';
       }
   });
}
function taskChangeStatus(taskVersionData,data){
    var changeInfo = '';
    switch (parseInt(data.status)){
        case -1:changeInfo='退回:'+taskVersionData.name+'(版本:'+taskVersionData.version+')';break;
        case 1:
            if(data.flag){
                changeInfo='撤回:'+taskVersionData.name+'(版本:'+taskVersionData.version+')任务卡';
            }else{
                changeInfo='提交:'+taskVersionData.name+'(版本:'+taskVersionData.version+')提交给发送人';
            }
            break;
        case 2:changeInfo='提交:'+taskVersionData.name+'(版本:'+taskVersionData.version+')提交给制作人';break;
        case 3:changeInfo='提交:'+taskVersionData.name+'(版本:'+taskVersionData.version+')提交给审核人';break;
        case 4:changeInfo='审核:'+taskVersionData.name+'(版本:'+taskVersionData.version+')审核完成';break;
    }
    userLog.log({type:1,typeId:taskVersionData.id,projectId:data.projectId,description:changeInfo});
}
//制作人提交进程
taskVersionService.productorComitProgress=function(taskVersionData,data){
    if(data.status==3){
        return Progress.findAll({where:{taskVersionId:data.versionId,curProgress:'true'},include:[TaskCheckMember]}).then(function(progresses){
            return progressService.saveProgressProductor(taskVersionData.id,taskVersionData.productorId).then(function(db){
                // for(var i=0;i<progresses.length;i++){
                var str=0;
                var checkUsersStatus=progresses[0].TaskCheckMembers;
                for(var j=0;j<checkUsersStatus.length;j++){
                    if(checkUsersStatus[j].checkType==0){
                        str+=1;
                    }
                }
                if(str!=0){
                    return   TaskCheckMember.update({checkType:1,curCheck:'false'},{where:{progressId:progresses[0].id}}).then(function(taskmember){
                        if(taskmember!=0){
                            return TaskCheckMember.update({curCheck:'true'},{where:{progressId:progresses[0].id,checkFlag:1}});
                        }else{
                            return 0;
                        }
                    });
                }else{
                    return TaskCheckMember.findAll({where:{progressId:progresses[0].id}}).then(function(checkUsers){
                        var srr=0;
                        var checkFlag='';
                        for(var j=0;j<checkUsers.length;j++){
                            if(checkUsers[j].curCheck=='true'){
                                srr+=1;
                                checkFlag=checkUsers[j].checkFlag;
                            }
                        }
                        if(srr==0){
                            return TaskCheckMember.update({curCheck:'true'},{where:{progressId:progresses[0].id,checkFlag:1}});
                        }else{
                            if(checkFlag!=checkUsers.length){
                                return TaskCheckMember.update({curCheck:'true'},{where:{progressId:progresses[0].id,checkFlag:checkFlag+1}});
                            }else{
                                return 1;
                            }
                        }
                    });
                }
                // }
            });
        });
    }
}

/**
 * 创建人编辑自己所创建的任务卡
 * */
taskVersionService.updateCurTaskVersion=function(params){
    var taskInfo=params.Info;
    if(params.version.versionId){
       return  taskVersionService.selectOneTask(params.version.versionId).then(function(versionData) {
            var changeInfo=updateTaskLog(versionData,params);
            if(changeInfo!='修改任务卡:\r\n') {
                return Task.update(taskInfo, {where: {id: taskInfo.taskId}}).then(function (updateTask) {
                    var taskVersion = params.version;
                    taskVersion.taskId = taskInfo.taskId;
                    return updateCommon(params,taskVersion,changeInfo);
                });
            }else{
                return 1;
            }
        });
    }
}

function  updateTaskLog(versionData,info){
    var changeInfo = '修改任务卡:\r\n',checkArray=[],oldLength= 0,newLength=0;
    if(versionData.name!=info.version.name){
        changeInfo+='任务卡名称:'+versionData.name+'修改为'+info.version.name+'"\r\n';
    }
    if(versionData.version!=info.version.version){
        changeInfo+='任务卡版本:'+versionData.version+'修改为'+info.version.version+'"\r\n';
    }
    for(var i=0;i<versionData.check.length;i++){
        checkArray.push(versionData.check[i].checkUserName);
    }
    oldLength=checkArray.length;newLength=info.checkName.length;
    if(oldLength==newLength){
        var str=0;
        for(var j=0;j<oldLength;j++){
            if(info.checkName[j]==checkArray[j]){
                str+=1;
            }
        }
        if(str!=oldLength){
            changeInfo+='任务卡审核人:'+checkArray.join(",")+'修改为'+(info.checkName).join(",")+'\r\n';
        }
    }else{
        changeInfo+='任务卡审核人:'+checkArray.join(",")+'修改为'+(info.checkName).join(",")+'\r\n';
    }
    if(versionData.startDate!=info.version.startDate){
        changeInfo+='任务卡开始时间:'+versionData.startDate+'修改为'+info.version.startDate+'\r\n';
    }
    if(versionData.planDate!=info.version.planDate){
        changeInfo+='任务卡预计时间:'+versionData.planDate+'修改为'+info.version.planDate+'\r\n';
    }
    if(versionData.workDays!=info.version.workDays){
        changeInfo+='任务卡工作日:'+versionData.workDays+'修改为'+info.version.workDays+'\r\n';
    }
    if(versionData.associatedType!=info.associatedName.associatedTypeName){
        changeInfo+='任务卡类别:'+versionData.associatedType+'修改为'+info.associatedName.associatedTypeName+'\r\n';
    }
    if(versionData.stepId!=info.Info.moduleId){
        changeInfo+='任务卡所属步骤:'+versionData.step+'修改为'+info.associatedName.moduleName+'\r\n';
    }
    if(info.Info.associatedAssetId){
        if(versionData.assetOrshotId!=info.Info.associatedAssetId){//资产
            changeInfo+='任务卡所属资产或镜头:'+versionData.assetOrshot+'修改为'+info.associatedName.associatedName+'\r\n';
        }
    }else{
        if(versionData.assetOrshotId!=info.Info.associatedShotId){//镜头
            changeInfo+='任务卡所属资产或镜头:'+versionData.assetOrshot+'修改为'+info.associatedName.associatedName+'\r\n';
        }
    }
    return changeInfo;
}
 function updateCommon(params,taskVersion,changeInfo){
    return  TaskVersion.update(taskVersion,{where:{id:taskVersion.versionId}}).then(function(updateTaskVersion){
        var array=[];
        for(var i=0;i<params.checkId.length;i++){
            array.push({
                versionId:taskVersion.versionId,
                userId:params.checkId[i],
                checkFlag:i+1
            });
        }
        return TaskCheckMember.destroy({where:{versionId:taskVersion.versionId}}).then(function(data){
            return TaskCheckMember.bulkCreate(array).then(function(checkMember){
                userLog.log({type:1,typeId:taskVersion.versionId,projectId:params.Info.projectId,description:changeInfo});
                return updateTaskVersion==''?'updateFailed':{message:'updateSuccess'};
            });
        });
    });
}
/*
* 新建任务卡版本
*
* */
taskVersionService.createVersion= function (params) {
        var taskInfo=params.Info;
             return TaskVersion.update({currentStatus:'false'},{where:{taskId:taskInfo.taskId}}).then(function(data){
                var taskVersion=params.version;
                taskVersion.taskId=taskInfo.taskId;
                return TaskVersion.create(taskVersion).then(function(newTaskVersion){
                    var array=[];
                    for(var i=0;i<params.checkId.length;i++){
                        array.push({
                            versionId:newTaskVersion.id,
                            userId:params.checkId[i],
                            checkFlag:i+1
                        });
                    }
                    return TaskCheckMember.bulkCreate(array).then(function(checkMember){
                        userLog.log({type:1,typeId:newTaskVersion.id,projectId:params.Info.projectId,description:'新建任务卡版本:'+newTaskVersion.name+'('+newTaskVersion.version+')'});
                        return newTaskVersion==''?'createFailed':{message:'createSuccess',list:newTaskVersion};
                    });
                });
            });
 }

/**
 *
 * 切换任务卡版本
 *
 * */
taskVersionService.turnVersion=function(params){
    return TaskVersion.update({currentStatus:'false'},{where:{id:{$ne:params.versionId},taskId:params.taskId}}).then(function(){
          return TaskVersion.update({currentStatus:'true'},{where:{id:params.versionId,taskId:params.taskId}}).then(function(data){
              var where={currentStatus:'true'};
            return  taskVersionService.selectOneCurTask(params.taskId,where).then(function(versionInfo){
                return versionInfo;
            });
        });
    });
}
/*
* 查询所有任务卡
* 由我创建，接受，等等
* @offset 偏移量
* */
taskVersionService.selectAllTasks=function(data){
    var where={};
    var taskWhere={};
    var userId=data.userId;
    var flag=data.flag;
    var checkUser={all:true};
    var readCondition;
    var readCondition1=null;
    var include=[creator,productor,sender,{model:Task, where:taskWhere},{model:Progress,include:[TaskCheckMember]},checkUser];
    switch (flag){
        case 'create':taskWhere.moduleId={$in:data.moduleId};readCondition=-1;
            include=[creator,productor,sender,{model:Task, where:taskWhere},{model:Progress,include:[TaskCheckMember]},checkUser];
            break;
        case 'send': taskWhere.moduleId={$in:data.moduleId};where.status={$in:[1,2,3,4,5]};readCondition=1;
            include=[creator,productor,sender,{model:Task, where:taskWhere},{model:Progress,include:[TaskCheckMember]},checkUser];
            break;
        case 'product':where.productorId=userId;where.status={$in:[2,3,4,5]};readCondition=2;readCondition1=4;break;
        case 'check':
            readCondition=3;
            where.status={$in:[3,5]};
                include=[creator,productor,sender,{model:Progress,where:{id:{$in:data.progressId}},
                    include:[{model:TaskCheckMember, where:{ userId:userId}}]},checkUser];

            break;
    }
    if(data.TaskStatus){
        var status=JSON.parse(data.TaskStatus);
        where.status={$in:status};
    }
    return TaskVersion.findAll({
        where:where,
        include:include,
        order: [['createdAt','DESC']] ,
        offset:data.offset*10,
        limit:10}).
      then(function(tasks){
        if(tasks.length!=0) {
            if(readCondition1!=null){
                return getTaskCommon(tasks,readCondition,readCondition1);
            }else{
                return getTaskCommon(tasks,readCondition,null);
            }
            }
        else{
            return null;
        }
    });
}
//获取进程的审核状况,判定任务卡的完成情况
taskVersionService.getProgressJinDu=function(progress){
    var finishProcess=0;
    var progressDone=0;
    if(progress.length!=0){
        var _length=progress.length;
        for(var i=0;i<_length;i++){
              if(progress[i].status==1){
                  progressDone+=1;
                  finishProcess+=parseInt(progress[i].percent)
              }
           }
           progressDone==_length?finishProcess:finishProcess;
        }
    return finishProcess==0?0+'%':finishProcess+'%';
}
//返回任务卡列表
function  getTaskCommon(tasks,readCondition,readCondition1){
    var taskData = [];//未读任务卡
    var taskDoneData=[];//已读任务卡
    var taskLength = tasks.length;
    for (var i = 0,taskInfo; i < taskLength; i++) {
            taskInfo=tasks[i];
       // for (var j = 0; j < tasks[i].length; j++) {
            var startDate=JSON.stringify(taskInfo.startDate);
            startDate=startDate.substr(1,10);
            var planDate=JSON.stringify(taskInfo.planDate);
            planDate=planDate.substr(1,10);
            var type='';
            if(taskInfo.type!=null){
                type =taskInfo.type==0?'内部任务':'外部任务';
            }else{
                type='';
            }
            var status='';
            switch(taskInfo.status){
                case -1:status='已退回'; break;
                case  0:status='待制卡'; break;
                case  1:status='未派发'; break;
                case  2:status='制作中'; break;
                case  3:status='审核中'; break;
                case  4:status='审核完成'; break;
                case  5:status='已完成'; break;
            }
            var productor=taskInfo.productor!=null?taskInfo.productor.name:'';
            var process=taskInfo.Progresses;
            var finishProcess=taskVersionService.getProgressJinDu(process);
            if (taskInfo.readStatus == 'false'&&(taskInfo.status==readCondition||taskInfo.status==readCondition1)) {
                taskData.push({
                        "DT_RowId":taskInfo.id,
                        name:'<i style="width: 10px;height:10px;background-color: red;border-radius: 50%;position: absolute;top:3px;right: 3%;">&#12288;</i>'+ taskInfo.name,
                        version: taskInfo.version,
                        type: type,
                        startDate: startDate,
                        planDate: planDate,
                        percent: finishProcess,
                        status: status,
                        productor: productor,
                        points: taskInfo.points,
                        readStatus: taskInfo.readStatus,
                        projectId: taskInfo.Task.projectId
                     });
                 }else{
                taskDoneData.push({
                        "DT_RowId":taskInfo.id,
                        name: taskInfo.name,
                        version: taskInfo.version,
                        type: type,
                        startDate: startDate,
                        planDate: planDate,
                        percent: finishProcess,
                        status: status,
                        productor: productor,
                        points: taskInfo.points,
                        readStatus: taskInfo.readStatus,
                        projectId: taskInfo.Task.projectId
                     });
                 }
            //}
    }
    return taskData.concat(taskDoneData);
}
/*
 * 获取当前用户的职位并且获取由我发送的任务卡
 * */
taskVersionService.getUserSenderTask=function(param){
    return  ProjectMember.findAll({where:{userId:param.userId,role:{$in:[2,3]}}}).then(function(data){
        var _length=data.length;
        if(_length!=0){
            var taskArray=[],controArray=[];
           for(var i=0;i<_length;i++){
               if(data[i].role==3){
                   controArray.push(data[i].moduleId);
               }else if(data[i].role==2){
                   taskArray.push(data[i].moduleId);
               }
           }
            if(param.flag=='send'){
                param.moduleId=controArray;
                return param;
            }else{
                param.moduleId=taskArray;
                return param;
            }
        }else{
            return null;
        }
    });
}
/**
 * 安卓查询任务卡{任务卡完成，任务卡未完成}
 * */
taskVersionService.androidSelectAllTasks=function(data){
    //var where={currentStatus:'true'};
    //var where={};
    var userId=data.userId;
    var flag=data.flag;
    var checkUser={all:true};
    var taskWhere={};
    var include=[creator,productor,sender,{model:Task, where:taskWhere},
        {model:Progress,include:[TaskCheckMember]},checkUser];
    var unReadWhere={};
    if(data.TaskStatus){
        var status=JSON.parse(data.TaskStatus);
        data.where.status={$in:status};
    }
    if(data.projectId){
        taskWhere={projectId:data.projectId};
    }
    switch (flag){
        case 'create':
            return taskVersionService.getUserSenderTask(data).then(function(dbs){
                taskWhere.moduleId={$in:dbs.moduleId};
                unReadWhere.readCondition=-1;
                include=[creator,productor,sender,{model:Task, where:taskWhere},
                    {model:Progress,include:[TaskCheckMember]},checkUser];
                return androidCheckfun(data,include,unReadWhere);
            });
           break;
        case 'send':taskWhere.moduleId={$in:data.moduleId};unReadWhere.readCondition=1;
            include=[creator,productor,sender,{model:Task, where:taskWhere},
                {model:Progress,include:[TaskCheckMember]},checkUser];
            break;
        case 'product':data.where.productorId=userId;unReadWhere.readCondition=2;unReadWhere.readCondition1=4;break;
        case 'check':
            unReadWhere.readCondition=3;
            return  taskVersionService.getCurUserCheckAuth(data.userId).then(function(datas){
                if(datas!=null){
                    data.progressId=datas;
                }else {
                    data.progressId=[];
                }
                include=[creator,productor,sender,{model:Task},{model:Progress,where:{id:{$in:data.progressId}},
                    include:[{model:TaskCheckMember, where:{ userId:userId}}]},checkUser];
                return androidCheckfun(data,include,unReadWhere);
            });
            break;
    }
    if(flag!='check'){
       return androidCheckfun(data,include,unReadWhere);
    }
}

function androidCheckfun(data,include,unReadWhere){
    return TaskVersion.findAll({
        where:data.where,
        include:include,
        order: [['createdAt','DESC']] ,
        offset:parseInt(data.offset)*10,
        limit:parseInt(data.limit)}).
    then(function(tasks){
        if(tasks.length!=0){
            //var taskData=[];
            var unReadTask=[],ReadTask=[];
            var taskLength=tasks.length;
            for(var i= 0,taskInfo;i<taskLength;i++){
                     taskInfo=tasks[i];
                // for(var j=0;j<tasks[i]..length;j++){
                     var startDate=JSON.stringify(taskInfo.startDate);
                     startDate=startDate.substr(1,10);
                     var planDate=JSON.stringify(taskInfo.planDate);
                     planDate=planDate.substr(1,10);
                     var productor=taskInfo.productor!=null?{userId:taskInfo.productor.id,name:taskInfo.productor.name}:null;
                     var process=taskInfo.Progresses;
                     var finishProcess=taskVersionService.getProgressJinDu(process);
                     if(taskInfo.readStatus == 'false'&&(taskInfo.status==unReadWhere.readCondition||taskInfo.status==unReadWhere.readCondition1)){
                         unReadTask.push({
                             "versionId":taskInfo.id,
                             name:taskInfo.name,
                             version:taskInfo.version,
                             type:taskInfo.type,
                             startDate:startDate,
                             planDate:planDate,
                             priority:taskInfo.priority,
                             readStatus:taskInfo.readStatus,
                             percent:finishProcess,
                             status:taskInfo.status,
                             productor:productor,
                             workDays:taskInfo.workDays,
                             points:taskInfo.points,
                             projectId:taskInfo.Task.projectId
                         });
                     }else{
                         ReadTask.push({
                             "versionId":taskInfo.id,
                             name:taskInfo.name,
                             version:taskInfo.version,
                             type:taskInfo.type,
                             startDate:startDate,
                             planDate:planDate,
                             priority:taskInfo.priority,
                             readStatus:taskInfo.readStatus,
                             percent:finishProcess,
                             status:taskInfo.status,
                             productor:productor,
                             workDays:taskInfo.workDays,
                             points:taskInfo.points,
                             projectId:taskInfo.Task.projectId
                         });
                     }
                //}
            }
            return unReadTask.concat(ReadTask);
        }else{
            return null;
        }
    });
}

/*
* 由我创建，由我制作，由我审核,由我发送
* 获取任务的个数，num/10，得到有多少页
* */
taskVersionService.getCountTask=function(data){
    var taskWhere={};
    var where={};
    var checkUser={all:true};
    var checkUserWhere={};
    var include=[{model:Task,where:taskWhere},checkUser];
    switch (data.flag){
        case 'create':taskWhere.moduleId={$in:data.moduleId};
            if(data.unRead==true){
                where.status=-1;where.readStatus='false';
            }
            if(data.toDealt==true){
                where.status={$in:[-1,0]};
            }
            include=[{model:Task,where:taskWhere},checkUser];break;
        case 'send':taskWhere.moduleId={$in:data.moduleId};
            if(data.unRead==true){
                where.status={$in:[1]};
                where.readStatus='false';
            }else if(data.toDealt==true){
                where.status={$in:[1]};
            }else {
               where.status={$in:[1,2,3,4,5]};
            }
            include=[{model:Task,where:taskWhere},checkUser];
            break;
        case 'product':where.productorId=data.userId;
            if(data.unRead==true){
                where.status={$in:[2,4]};
                where.readStatus='false';
            }else if(data.toDealt==true){
                where.status={$in:[2,4]};
            }else {
                where.status={$in:[2,3,4,5]};
            }
          break;
        case 'check':
                checkUserWhere={model:Progress,where:{id:{$in:data.progressId}},
                    include:[{model:TaskCheckMember,
                        where:{ userId:data.userId}
                    }]};
            if(data.unRead==true){
                where.status={$in:[3]};
                where.readStatus='false';
            }else if(data.toDealt==true){
                where.status={$in:[3]};
            }else {
                where.status={$in:[3,5]};
            }
            include=[{model:Task,where:taskWhere},checkUser,checkUserWhere];
            break;
    }
    if(data.TaskStatus){
        var taskStatus='';
        taskStatus=JSON.parse(data.TaskStatus);
        where.status={$in:taskStatus};
    }
    return  TaskVersion.findAndCountAll({include:include,where:where}).then(function(data){
        var num=data.count;
        var page=Math.ceil(num/10);
        return {page:page,count:num};
    });
}
//由我创建未读个数
taskVersionService.getBymeCreateTaskUnRead=function(data){
    data.flag='create';
    return taskVersionService.getUserSenderTask(data).then(function(send){
        if(send!=null){
            return taskVersionService.getCountTask(send);
        }else{
            return null;
        }
    });
}
//由我制作未读个数
taskVersionService.getBymeProductTaskUnRead=function(data){
    data.flag='product';
    return taskVersionService.getCountTask(data);
}
//由我发送未读个数
taskVersionService.getBymeSendTaskUnRead=function(data){
    data.flag='send';
    return taskVersionService.getUserSenderTask(data).then(function(send){
        if(send!=null){
            return taskVersionService.getCountTask(send);
        }else{
            return null;
        }
    });

}
//由我审核未读个数
taskVersionService.getBymeCheckTaskUnRead=function(data){
    return taskVersionService.getCurUserCheckAuth(data.userId).then(function(check){
        if(check!=null){
            data.progressId=check;
        }else{
            data.progressId=[];
        }
        data.flag='check';
        return taskVersionService.getCountTask(data);
    });
}
/*
 * 安卓获取任务的个数，num/10，得到有多少页
 * */
taskVersionService.getAndroidCountTask=function(data){
     var checkUser={all:true};
      var checkWhere={};
      var include=[Task,checkUser];
    switch (data.flag){
        case 'create':data.where.creatorId=data.userId;break;
       // case 'send':data.where.senderId=data.userId;break;
        case 'product':data.where.productorId=data.userId;data.where.status={$in:[2,3,4,5]};break;
        case 'check':checkWhere={model:TaskCheckMember,
            where:{
                userId:data.userId
            }
        };
            data.where.status={$in:[3,5]};
            include=[Task,checkUser,checkWhere];
            break;
    }
        return  TaskVersion.findAndCountAll({include:include,where:data.where}).then(function(data){
            var num=data.count;
            var page=Math.ceil(num/10);
            return {page:page,count:num};
        });
}
/*
* 发送人保存任务卡为内部或外部任务
* */
taskVersionService.senderOperateTask=function(params){
   return TaskVersion.findOne({where:{id:params.versionId},include:[productor]}).then(function(versionData){
       if(versionData!=null){
           return TaskVersion.update({productorId:params.productorId,
               type:params.type,priority:params.priority,points:params.points},{where:{id:params.versionId}}).then(function(data){
              // return progressService.saveProgressProductor({versionId:versionData.id,productorId:params.productorId}).then(function(progressdata){
                   return TaskVersion.findOne({where:{id:params.versionId},include:[productor]}).then(function(versionDatas){
                       var type=versionDatas.type==0?'内部任务;':'外部任务;';
                          var changeInfo='修改'+versionDatas.name+'('+versionDatas.version+')任务卡:' +'\r\n';
                           if(versionData.type!=versionDatas.type){
                               changeInfo+= '类型设置为'+ type+'\r\n';
                           }
                           if(versionData.priority!=versionDatas.priority){
                               changeInfo+='等级设置为'+versionDatas.priority+'\r\n';
                           }
                           if(versionData.points!=versionDatas.points){
                               changeInfo+='积分设置为'+versionDatas.points+'\r\n'
                           }
                           if(versionData.productor!=null){
                               if(versionData.productor.id!=versionDatas.productorId){
                                   changeInfo+='制作人设置为'+versionDatas.productor.name+'\r\n';
                               }
                           }else{
                               changeInfo+='制作人设置为'+versionDatas.productor.name+'\r\n';
                           }
                           if(changeInfo!='修改'+versionDatas.name+'('+versionDatas.version+')任务卡:' +'\r\n'){
                               userLog.log({type:1,typeId:versionDatas.id,projectId:params.projectId,description:changeInfo});
                           }
                           return versionDatas;
                   });
              // });
           });
       }else {
           return 'Noexist';
       }
   });
}
/**
 * 发送人退回任务卡,并改变任务卡的状态
 * */
taskVersionService.backTask=function(params){
   return  TaskVersion.findOne({where:{id:params.versionId}}).then(function(versionData){
       if(versionData!=null){
           return TaskVersion.update({status:-1,reason:params.reason,readStatus:'false'},{where:{id:params.versionId}}).then(function(upVersionData){
             taskChangeStatus(versionData,{status:-1,projectId:params.projectId});
             return upVersionData==1?'backSuccess':'backFailed';
           });
       }
   });
}


/*
* 查询单个任务卡的基本信息
* */
taskVersionService.selectOneTask=function(taskVersionId){
    return TaskVersion.findAll({where:{id:taskVersionId}}).then(function(data){
        if(data.length!=0){
          var where={id:taskVersionId};
           return taskVersionService.selectOneCurTask(data[0].taskId,where);
        }
    });
}
/*
 * 查询当前版本的任务卡的基本信息
 * */
taskVersionService.selectOneCurTask=function(taskId,where){
    return Task.findAll({where:{id:taskId}}).then(function(data){
        if(data.length!=0){
            if(data[0].dataValues.associatedType==2){
                return Task.findAll({where:{id:taskId},include:[AssetsInfo,StepInfo,{model:Project,attributes:['id','name']},
                    {model:TaskVersion,where:where,
                        include:[creator,productor,sender,Progress,{model:Contract},
                            {model:TaskCheckMember,attributes:['id','versionId','userId','checkFlag'],
                        include:[{model:User,attributes:['id','name','image']}]}]}]}).then(function(task){
                      var taskJinDu=taskVersionService.getProgressJinDu(task[0].TaskVersions[0].Progresses);
                      var taskInfo= getTaskData(task);
                      taskInfo.percent=taskJinDu;
                    return taskInfo;
                });
            }else{
                return Task.findAll({where:{id:taskId},include:[Scene,StepInfo,{model:Project,attributes:['id','name']},
                    {model:TaskVersion,where:where,
                        include:[creator,productor,sender,Progress,{model:Contract},
                            {model:TaskCheckMember,attributes:['id','versionId','userId','checkFlag'],
                        include:[{model:User,attributes:['id','name','image']}]}]}]}).then(function(task){
                        var taskJinDu=taskVersionService.getProgressJinDu(task[0].TaskVersions[0].Progresses);
                        var taskInfo= getTaskData(task);
                        taskInfo.percent=taskJinDu;
                        return taskInfo;
                });
            }
        }
    });
}
/**
 * 获取一个任务的所有版本
 * */
taskVersionService.getOneTasksVersion=function(taskId){
     return Task.findAll({include:[{model:TaskVersion, order: [['createdAt','DESC']]}],where:{id:taskId}}).then(function(data){
       //  console.log('kkkk',data);
       //  var str=data[0];
       //  var array=[],params={};
       //  params.taskId=data[0].id
       //for(var i=0;i<str;i++){
       //
       //}
         return data;
     });
}

/**
 * 删除任务卡或任务卡版本
 * */
taskVersionService.deleteTask=function(params){
  var taskId=params.taskId,versionId=params.versionId;
  return TaskVersion.findAndCountAll({where:{taskId:taskId}}).then(function(versions){
      var num=versions.count;
      if(num==1){
         //return taskVersionService.deleteTaskProgress(versionId).then(function(data){
             return TaskCheckMember.destroy({where:{versionId:versionId}}).then(function(vermemberData){
                 return Plan.destroy({where:{taskVersionId:versionId}}).then(function() {
                     return  TaskVersion.destroy({where:{id:versionId}}).then(function(versionData){
                         return  Task.destroy({where:{id:taskId}}).then(function(taskData){
                             if(vermemberData&&versionData&&taskData){
                                 userLog.log({type:1,typeId:versions[0].id,projectId:params.projectId,description:'删除任务卡:'+versions[0].name+'(版本:'+versions[0].version+')'});
                                 return {message:'deleteSuccess'};
                             }else{
                                 return {message:'deleteFailed'};
                             }
                         });
                     });
                 });
             });
       // });
      }else {
             return TaskVersion.findAll({where: {id: versionId}}).then(function (versionData) {
                  var currentStatus = versionData[0].currentStatus;
                  if (currentStatus == 'true') {
                    //  return taskVersionService.deleteTaskProgress(versionId).then(function (data) {
                          return TaskCheckMember.destroy({where: {versionId: versionId}}).then(function (vermemberData) {
                              return Plan.destroy({where:{taskVersionId:versionId}}).then(function() {
                                  return TaskVersion.destroy({where: {id: versionId}}).then(function (taskData) {
                                      return TaskVersion.findAll({
                                          where: {taskId: taskId},
                                          order: [['createdAt', 'DESC']]
                                      }).then(function (versionsData) {
                                          return TaskVersion.update({currentStatus: 'true'}, {where: {id: versionsData[0].id}}).then(function (updateData) {
                                              if (vermemberData && taskData && updateData) {
                                                  userLog.log({type:1,typeId:versionData[0].id,projectId:params.projectId,description:'删除任务卡:'+versionData[0].name+'(版本:'+versionData[0].version+')'});
                                                  return {message: 'deleteSuccess'};
                                              } else {
                                                  return {message: 'deleteFailed'};
                                              }
                                          });
                                      });

                                  });
                              });
                          });
                     // });
                  } else {
                      //return taskVersionService.deleteTaskProgress(versionId).then(function (data) {
                          return TaskCheckMember.destroy({where: {versionId: versionId}}).then(function (vermemberData) {
                              return Plan.destroy({where:{taskVersionId:versionId}}).then(function() {
                                  return TaskVersion.destroy({where: {id: versionId}}).then(function (taskData) {
                                      if (vermemberData && taskData) {
                                          userLog.log({type:1,typeId:versionData[0].id,projectId:params.projectId,description:'删除任务卡:'+versionData[0].name+'(版本:'+versionData[0].version+')'});
                                          return {message: 'deleteSuccess'};
                                      } else {
                                          return {message: 'deleteFailed'};
                                      }
                                  });
                              });
                          });
                      //});
                  }
              });
      }
  });
};

//获取一个步骤节点下的所有未派发并且是外部任务卡
taskVersionService.getStepOuterTask=function(moduleId){
    return Task.findAll({where:{moduleId:moduleId},include:[StepInfo,{model:TaskVersion,where:{status:1,type:1,currentStatus:"true"}}]}).then(function(data){
            return data;
    });
}
taskVersionService.getAllTasksUnderM=function(moduleId){
    return Task.findAll({where:{moduleId:moduleId},include:[StepInfo,{model:TaskVersion,where:{currentStatus:"true"}}]}).then(function(data){
        return data;
    });
}
taskVersionService.getStepOuterTaskInList=function(args){
    var where = {};
    if(args.projectId){
        where.projectId = args.projectId;
    }else{
        where.moduleId = {$in:args.list}
    }
    return Task.findAll({where:where,include:[StepInfo,{model:TaskVersion,
        include:[{model:Contract}]}]}).then(function(data){
        var d_len = data.length;
        var t_len = 0;
        var __data__ = [];
        var _data_ = [];
        var tempData_v = {};
        var tempData_t = {};
        for(var i=0;i<d_len;i++){
            tempData_t.StepInfo = data[i].StepInfo;
            tempData_t.moduleId = data[i].moduleId;
            tempData_v = data[i].TaskVersions;
            t_len = tempData_v.length;
            _data_=[];
            for(var t=0;t<t_len;t++){
                if(tempData_v[t].Contract==null||tempData_v[t].Contract.id==args.contractId){
                    _data_.push(tempData_v[t]);
                }
            }
            if(_data_.length!=0){
                tempData_t.TaskVersions = _data_;
                __data__.push(tempData_t);
            }
        }
        return __data__;
    })
}
//获取当前用户的职位，权限等
taskVersionService.getCurUserPosition=function(userId){
    var message={};
    //return ProjectMember.findOne({where:{projectId:params.projectId,userId:params.userId}}).then(function(projectData){
    //        projectData==null?message.projectMember=null:(projectData.role==1? message.projectLeader=true: message.projectLeader=null);
                    return User.findOne({where:{id:userId},include:[{model:Role,include:[Authority]}]}).then(function(userData) {
                        if (userData) {
                            var authority = userData.Role.Authorities;
                            for (var j = 0; j < authority.length; j++) {
                                if (authority[j].name == 'Manage_All_Pro_Contracts') {
                                    message.manageAllContracts = true;
                                } else if (authority[j].name == 'See_All_Project') {
                                    message.seeAllProject = true;
                                }
                            }
                            return message;
                        }else{
                            return message;
                        }
                    });
      //});
}
/**
 * 获取当前用户是否有新建编辑任务卡的权限，并列出他可以在哪些模块底下新建任务卡
 * 以及后期判断时是够有合同相关的权限
 * */
taskVersionService.getCurUserProjectAuth=function(params){
    return User.findAll({where:{id:params.userId},include:{model:Role,include:[Authority]}}).then(function(userData){
        var message={};
        if(userData.length!=0){
            var authority=userData[0].Role.Authorities;
            for(var i=0;i<authority.length;i++){
                if(authority[i].name=='Manage_All_Pro_Tasks'){//管理任务卡权限
                    message.manageAllTasks=true;
                }else if(authority[i].name=='Manage_All_Project'){//管理所有项目
                    message.manageAllProject=true;
                }else if(authority[i].name=='Manage_All_Pro_Contracts'){//管理合同
                    message.manageAllContracts=true;
                 }else if(authority[i].name=='See_All_Project'){//查看项目内容
                    message.seeAllProjects=true;
                }
            }
              return ProjectMember.findAll({where:{userId:params.userId,projectId:params.projectId}}).then(function(projectData){
                  if(projectData.length!=0){
                      var assetArray=[],shotArray=[],assetContractArray=[],assetPayArray=[],shotContractArray=[],shotPayArray=[];
                     for(var j=0;j<projectData.length;j++){
                         if(projectData[j].role==1){//项目负责人
                             message.manageProjectTasks=true;
                         }
                     }
                     if(message.manageProjectTasks!=true){
                        return ProjectMember.findAll({where:{userId:params.userId},include:{model:StepInfo,where:{projectId:params.projectId}}}).then(function(moduleData){
                            var assetAuth={},shotAuth={};
                            if(moduleData.length!=0){
                                for(var t=0;t<moduleData.length;t++){
                                     if(moduleData[t].StepInfo.belong==1){
                                         if(moduleData[t].role==2){//镜头任务卡负责人
                                             shotAuth.taskLeader=true;
                                             shotArray.push(moduleData[t].moduleId);
                                             shotAuth.taskModuleId=shotArray;
                                         }else if(moduleData[t].role==3){//镜头合同负责人
                                             shotAuth.contractLeader=true;
                                             shotContractArray.push(moduleData[t].moduleId);
                                             shotAuth.contractModuleId=shotContractArray;
                                         }else if(moduleData[t].role==4){//镜头支付负责人
                                             shotAuth.payLeader=true;
                                             shotPayArray.push(moduleData[t].moduleId);
                                             shotAuth.payModuleId=shotPayArray;
                                         }else if(moduleData[t].role==0){//镜头普通成员
                                             shotAuth.puTongChengYuan=true;
                                         }
                                     }else{
                                         if(moduleData[t].role==2){//资产任务卡负责人
                                             assetAuth.taskLeader=true;
                                             assetArray.push(moduleData[t].moduleId);
                                             assetAuth.taskModuleId=assetArray;
                                         }else if(moduleData[t].role==3){//资产合同负责人
                                             assetAuth.contractLeader=true;
                                             assetContractArray.push(moduleData[t].moduleId);
                                             assetAuth.contractModuleId=assetContractArray;
                                         }else if(moduleData[t].role==4){//资产支付负责人
                                             assetAuth.payLeader=true;
                                             assetPayArray.push(moduleData[t].moduleId);
                                             assetAuth.payModuleId=assetPayArray;
                                         }else if(moduleData[t].role==0){//资产普通成员
                                             assetAuth.puTongChengYuan=true;
                                         }
                                     }
                                }
                                message.assetAuth=assetAuth;message.shotAuth=shotAuth;
                                return message;
                            }
                        });
                     }else{
                         return message;
                     }
                  }else{
                      message.warn='当前用户不在本项目中';
                      return message;
                  }
              });
        }else{
            message.warn='不存在当前用户';
            return message;
        }
    });
}
//获取当前用户是否是任务卡的审核人,并返回由我审核的当前进程和任务卡已经完成并且任务卡的进程是由我审核的进程
taskVersionService.getCurUserCheckAuth=function(userId){
    return TaskCheckMember.findAll({where:{userId:userId,progressId:{$ne:null}},attributes:['id','progressId','userId','checkFlag','checkType','curCheck'],
        include:[{model:Progress}]}).then(function(data){
        if(data.length!=0) {
            var array=[];
            var curArray=[];
            for(var i=0;i<data.length;i++){
                if(data[i].curCheck=='true'){
                    curArray.push(data[i].progressId);//该审核人审核的进程
                }else{
                    array.push(data[i].progressId);
                }
            }
            return Progress.findAll({where:{id:{$in:array}},include:{model:TaskVersion,where:{status:5}}}).then(function(progresses){
                var versionArray=[];
                for(var j=0;j<progresses.length;j++){
                  curArray.push(progresses[j].id);//完成的任务卡下的所有由我审核过的进程
                }
                    return curArray;
            });
        }else{
            return null;
        }
    });
}

//获取一个任务卡的完成进度
taskVersionService.getTaskFinishProgress=function(taskVersionId){
    return Progress.findAll({where:{taskVersionId:taskVersionId}}).then(function(dbs){
        return taskVersionService.getProgressJinDu(dbs);
    });
}
    //查看其他审核人的审核状态
taskVersionService.selectOtherCheckStatus=function(progressId,array){
    return  TaskCheckMember.findAll({where:{progressId:progressId,checkFlag:array}});
}
/***
 * 删除任务卡中的方案
 * */
taskVersionService.deletePlan=function(versionId){
   return  planService.getByTaskVersionId(versionId).then(function(planData){
       if(planData!=null){
           return planService.deleteById(planData.id);
       }else{
           return false;
       }
   });
}
/***
 * 删除任务卡中所有进程
 * */
taskVersionService.deleteTaskProgress=function(versionId){
    return  progressService.deleteTaskAllProgress(versionId).then(function(data){
       return taskVersionService.deletePlan(versionId);
    });
}

/*
* 获取任务卡版本的审核人
* */
taskVersionService.getCheckUsers=function(taskVersionId){
    return TaskCheckMember.findAll({where:{versionId:taskVersionId},include:[{model:User,attributes:['id','name','image']}]}).then(function(data){
        return data;
    });
}
/**
 * 获取关联步骤信息
 * @params {项目id,资产2 镜头1}
 * */

taskVersionService.getlineInfo=function(params){
    if(params.manageAllTasks=='true'){//是项目负责人或者是具有管理项目任务卡的权限或者有管理项目的权限
        return StepInfo.findAll({where:{projectId:params.projectId,belong:params.type},include:[StepChildren]}
          ).then(function(steps){
            if(steps.length!=0){
                var _length=steps.length;
                var list=[];
                for(var i=0;i<_length;i++){
                    if(steps[i].children.length==0&&steps[i].fatherId!=null){
                        list.push(steps[i]);
                    }
                }
                return {list:list};
            }else{
                return {list:''};
            }
    });
    }else{
        return StepInfo.findAll({where:{projectId:params.projectId,belong:params.type},include:[StepChildren,
            {model:ProjectMember,where:{userId:params.userId,role:2}}]}).then(function(steps){
            if(steps.length!=0){
                var _length=steps.length;
                var list=[];
                for(var i=0;i<_length;i++){
                    if(steps[i].children.length==0&&steps[i].fatherId!=null){
                        list.push(steps[i]);
                    }
                }
                return {list:list};
            }else{
                return {list:''};
            }
        });
    }

}

/**
 * 一个项目下的所有资产或者镜头
 *@params {项目id,资产2 镜头1}
 * */

taskVersionService.getAllAssetOrShot=function(params){
    if(params.type==1){
    return  Scene.findAll({where:{projectId:params.projectId}}).then(function(shots){
          return shots;
      });
    }else{
       return  AssetsInfo.findAll({where:{projectId:params.projectId}}).then(function(assets){
            return assets;
        });
    }
}

/**
 * 获取任务卡版本的制作人
 * */
taskVersionService.getTaskProductor=function(versionId){
    return TaskVersion.findAll({where:{id:versionId},attributes:['id','creatorId','productorId','senderId']}).then(function(data){
        return {userId:data,taskVersionId:data[0].id};
    });
}
/**
 * 获取任务卡版本的制卡人
 * */
taskVersionService.getTaskCreator=function(versionId){
    if(versionId){
        return Task.findAll({include:[{model:TaskVersion,where:{id:versionId}}]}).then(function(data){
            return ProjectMember.findAll({where:{moduleId:data[0].moduleId}}).then(function(module){
                if(module.length!=0){
                    var creatorId=null;
                    var _length=module.length;
                    for(var i=0;i<_length;i++){
                        if(module[i].role==2){
                            creatorId=module[i].userId;
                        }
                    }
                    return {userId:creatorId,taskVersionId:data[0].id};
                }else{
                    return null;
                }
            });
        });
    }else{
        return null;
    }
}
/**
 * 制卡完成后，获取发送人的
 *
 * */
taskVersionService.getSendTaskUser=function(versionId){
    if(versionId){
        return Task.findAll({include:[{model:TaskVersion,where:{id:versionId}}]}).then(function(data){
            return ProjectMember.findAll({where:{moduleId:data[0].moduleId}}).then(function(module){
                if(module.length!=0){
                    var sendUserId=null;
                    var _length=module.length;
                    for(var i=0;i<_length;i++){
                        if(module[i].role==3){
                            sendUserId=module[i].userId;
                        }
                    }
                    return {userId:sendUserId,taskVersionId:data[0].id};
                }else{
                    return null;
                }
            });
        });
    }else{
        return null;
    }
}
/*获取任务卡版本的审核人，并返回当前审核人*/
taskVersionService.getTaskCheckers=function(versionId,progressId){
    if(versionId){//点提交审核的时候
        return Progress.findAll({where:{taskVersionId:versionId,curProgress:'true'}}).then(function(progress){
            return TaskCheckMember.findAll({progressId:progress[0].id}).then(function(checkData){
                var _length=checkData.length,checkUserId=null;
                for(var i=0;i<_length;i++){
                    if(checkData[i].checkType==1&&checkData[i].curCheck=='true'){
                        checkUserId=checkData[i].userId;
                    }
                }
                return {userId:checkUserId,taskVersionId:progress[0].taskVersionId};
            });
        });
    }else if(progressId){
        return TaskCheckMember.findAll({where:{progressId:progressId}}).then(function(checkDatas){
            var str= 0,_length=checkDatas.length,checkUserId=null,stringStr= 0,array=[];
               for(var j=0;j<_length;j++){
                   array.push(checkDatas[j].userId);
                   if(checkDatas[j].checkType!=1){
                       str+=1;
                   }
                   if(checkDatas[j].checkType==0){
                       stringStr+=1;
                   }
                   if(checkDatas[j].checkType==1&&checkDatas[j].curCheck=='true'){
                       checkUserId=checkDatas[j].userId;
                   }
               }
             if(str==_length||stringStr!=0){
                 return TaskVersion.findAll({include:[{model:Progress,where:{id:progressId}}]}).then(function(taskData){
                     return {productor:taskData[0].productorId,taskVersionId:taskData[0].id,checkUser:array,status:taskData[0].status};
                 });
             }else{
                 return TaskVersion.findAll({include:[{model:Progress,where:{id:progressId}}]}).then(function(taskData){
                     return {userId:checkUserId,taskVersionId:taskData[0].id,checkUser:array,status:taskData[0].status};
                 });
             }
        });
    }else {
        return null;
    }
}

function  getTaskData(Taskdata){
    var _length=Taskdata.length,taskVersion=Taskdata[0].TaskVersions[0];
   // var stepUser=Taskdata[0].StepInfo.ProjectMembers;
    var startDate=JSON.stringify(taskVersion.startDate).substr(1,10);
    var endDate=taskVersion.endDate!=null?JSON.stringify(taskVersion.endDate).substr(1,10):null;
    var planDate=JSON.stringify(taskVersion.planDate).substr(1,10);
    var data={
        taskId:Taskdata[0].id,
        projectId:Taskdata[0].projectId,
        projectName:Taskdata[0].Project.name,
        versionId:taskVersion.id,
        name:taskVersion.name,
        version:taskVersion.version,
        startDate:startDate,
        planDate:planDate,
        type:taskVersion.type,
        priority:taskVersion.priority,
        points:taskVersion.points,
        endDate:endDate,
        workDays:taskVersion.workDays,
        status:taskVersion.status,
        reason:taskVersion.reason,
        readStatus:taskVersion.readStatus,
        isHasContract:taskVersion.Contract!=null?true:false,
        contract:taskVersion.Contract!=null?taskVersion.Contract:null,
        productor:taskVersion.productor!=null?{userId:taskVersion.productor.id,name:taskVersion.productor.name}:null,
        sender:taskVersion.sender!=null?{userId:taskVersion.sender.id,name:taskVersion.sender.name}:null,
        creator:taskVersion.creator!=null?{userId:taskVersion.creator.id,name:taskVersion.creator.name}:null,
        step:Taskdata[0].StepInfo.name,
        stepId:Taskdata[0].StepInfo.id,
        associatedType:Taskdata[0].associatedType
    };
    if(Taskdata[0].associatedType==2){
        data.associatedType='资产';
        data.assetOrshotId=Taskdata[0].AssetsInfo.id;
        data.assetOrshot=Taskdata[0].AssetsInfo.name;
    }else{
        data.associatedType='镜头';
        data.assetOrshotId=Taskdata[0].Scene.id;
        data.assetOrshot=Taskdata[0].Scene.name;
    }
    var checkMember=taskVersion.TaskCheckMembers;
    var checkLength=checkMember.length;
    var array=[];
     for(var i=0;i<checkLength;i++){
         var checkData=checkMember[i];
         array.push({
             checkSequence:checkData.checkFlag,
             checkUserName:checkData.User.name,
             checkUserId:checkData.User.id,
             checkUserImg:checkData.User.image
         });
     }
    data.check=array;
    return data;
}
taskVersionService.getTasksUnderModule=function(id){
    console.log('idididididiidid',id);
    return Task.all({
        where:{moduleId:{$in:id}},
        include:[{model:TaskVersion,where:{type:1}}]

    })
};

taskVersionService.getAllTasksById = function(id){
    return Task.all({
        where:{id:{$in:id}},
        include:[StepInfo,{model:TaskVersion,where:{currentStatus:'true'}}]
    })
};

taskVersionService.updateTaskInfo=function(idList,info){
    //console.log('222222222',info,idList);
    return Task.update(info,{
        where:{id:{$in:idList}}
    });
};
