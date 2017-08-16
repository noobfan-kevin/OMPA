/**
 * Created by hk61 on 2016/7/4.
 */

var Log = process.core.db.models.Log;
var User=process.core.db.models.User;
var logService = module.exports;
var ProjectMember=process.core.db.models.ProjectMember;//节点负责人
var Project=process.core.db.models.Project;
var StepInfo=process.core.db.models.StepInfo;//步骤
var TaskVersion = process.core.db.models.TaskVersion;//任务卡版本
var Task=process.core.db.models.Task;//任务卡
var Contract=process.core.db.models.Contract;
var userService = require('../service/userService');
/*
* 查询
* */
logService.query = function(query){
    return Log.all(query);
};

logService.getOnePageLogs=function(args){
    var where = {};
    if(args.projectId){
        where.projectId = {$in:[args.projectId,'123456']};
    }
    if(args.versionId){
       where.typeId=args.versionId;
    }
    if(args.contractId){
        where.typeId=args.contractId;
    }
    if(args.like){
        where.$or={description:{$like:'%'+args.like+'%'},userName:{$like:'%'+args.like+'%'}};
    }
    return Log.all({
        where:where,
        order:[ ['time','DESC']],
        offset:args.offset*10,
        limit:10
    });
};

logService.getCount = function(args){
    var where = {};
    if(args.projectId){
        where.projectId = {$in:[args.projectId,'123456']};
    }
    if(args.versionId){
        where.typeId=args.versionId;
    }
    if(args.contractId){
        where.typeId=args.contractId;
    }
    if(args.like){
        where.$or={description:{$like:'%'+args.like+'%'},userName:{$like:'%'+args.like+'%'}};
    }
    console.log(where,'dadasdasdasdas');
    return Log.findAndCountAll({
        where:where
    }).then(function(data){
        return data.count;
    })
};

/*
* 创建
* */
logService.create = function(log){
    console.log('=====',log);
    return Log.create(log);
};


/*
 * 删除
 * */
logService.delete = function(query){
    return Log.destroy(query);
};

/**
 * 个人工作动态
 *
 * */
logService.getPersonDynamics=function(data){
     return ProjectMember.findAll({where:{userId:data.userId},include:[{model:Project,where:{status:0}}],order: [['createdAt','DESC']]}).then(function(projectData){
         var _length=projectData.length;
         if(_length!=0){
             var projectLeader=false,array=[],notArray=[];
             for(var i=0;i<_length;i++){
                 if(projectData[i].role==1){
                     projectLeader=true;
                     array.push(projectData[i].Project.id);//负责的项目
                 }else{
                     notArray.push(projectData[i].Project.id);//参与的项目
                 }
             }
             data.projectId=array;
            return   getOperation(data);
         }else{
             return null;
         }
     });
}
function getOperation (data){
    return ProjectMember.findAll({where:{userId:data.userId},include:[{model:StepInfo}],order:[['createdAt','DESC']]}).then(function(modules){
        var $length=modules.length,taskArray=[],puArray=[],contractArray=[];
        for(var i=0;i<$length;i++){
            if(modules[i].moduleId!=null){
                if(modules[i].role==2){
                    taskArray.push(modules[i].moduleId);//所负责的节点id
                }else if(modules[i].role==3){
                    contractArray.push(modules[i].moduleId);//合同负责人
                }else if(modules[i].role!=4){
                    puArray.push(modules[i].moduleId);//普通人员所参与的节点
                }
            }
        }
        return  TaskVersion.findAll({include:[{model:Task,where:{moduleId:{$in:(taskArray.concat(contractArray))}}}]}).then(function(taskData){
            return Contract.findAll({where:{contractLeaderId:data.userId}}).then(function(contractData){
                return Contract.findAll({where:{paidManId:data.userId}}).then(function(payData) {
                    return Contract.findAll({where:{partBId:data.userId}}).then(function(partBData) {
                        var task = [], contract = [], pay = [], partB = [];
                        var _taskLength = taskData.length, _contractLength = contractData.length, _payLength = payData.length, _partBLength = partBData.length;
                        if (_taskLength != 0) {
                            for (var j = 0; j < _taskLength; j++) {
                                task.push(taskData[j].id);
                            }
                        }
                        if (_contractLength != 0) {
                            for (var j = 0; j < _contractLength; j++) {
                                contract.push(contractData[j].id);
                            }
                        }
                        if (_payLength != 0) {
                            for (var j = 0; j < _payLength; j++) {
                                pay.push(payData[j].id);
                            }
                        }
                        if (_partBLength != 0) {
                            for (var j = 0; j < _partBLength; j++) {
                                partB.push(partBData[j].id);
                            }
                        }
                        var selectArray = task.concat(contract).concat(pay).concat(partB);
                            return Log.findAll({where:{$or:[{$or:[{typeId: {$in: selectArray}},{projectId:{$in:data.projectId}}]},{userId: data.userId}]},
                                  include:[User],offset:parseInt(data.offset)*10,limit:10,order:[['time','DESC']]}).then(function (logData) {
                                      var _length=logData.length;
                                      if(_length!=0){
                                        var _data=[];
                                        for(var i=0;i<_length;i++){
                                            var log=logData[i];
                                            var time=userService.formatDateTime(log.time),image='';
                                            if(logData[i].User!=null){
                                                image=log.User.image;
                                            }else{
                                                image='defaultAvatar.jpg';
                                            }
                                            _data.push({
                                                userId:log.userId,
                                                userName:log.userName,
                                                description:log.description,
                                                image:image,
                                                time:time
                                            });
                                        }
                                        return {logs: _data};
                                    }else{
                                          return null;
                                      }
                            });
                    });
                });
            });
        });
    });
}



