/**
 * Created by wangziwei on 2015/8/25.
 */
var express = require('express');
var router = module.exports = express.Router();
var log = process.core.log;
var io = process.core.io;
var async = require('async');
var TaskCardService = require('../service/taskVersionService');
var reviewCommentService = require('../service/reviewComment');
var progressService=require('../service/progressService');
var userLog = require('../core/userLog');
var stepTreeService = require('../service/stepTreeService');
var contractService = require('../service/contractService');
//
///**
// * @api {post} /api/taskCard 保存任务卡
// * @apiName saveTaskCard
// * @apiGroup taskCard
// * @apiPermission Leader
// *
// * @apiParam {String} name 任务名称
// * @apiParam {String} versions 版本号
// * @apiParam {Boolean} isSend 是否发送
// * @apiParam {Number} status 接收状态
// * @apiParam {String} fatherId 所属任务编号
// * @apiParam {Date} startDate 开始时间
// * @apiParam {Date} planDate 预期时间
// * @apiParam {Date} endDate 结束时间
// * @apiParam {String} senderId 发送人编号
// * @apiParam {String} receiverId 接收人编号
// * @apiParam {Number} points 积分
// *
// * @apiSuccess {Boolean} ok 操作是否成功
// */
//router.post('/',function(req,res,next){
//    TaskCardService.create(req.body).then(function(result){
//        res.result = {ok: true, target: result._id, desc: "保存任务卡"};
//        res.json(result);
//    }).catch(function(err){
//        next(err);
//    });
//});
//
///**
// * @api {get} /api/taskCard/queryByTaskId 根据所属任务编号查询任务卡
// * @apiName getByFatherId
// * @apiGroup taskCard
// * @apiPermission Leader
// *
// * @apiParam {String} fatherId 所属任务编号
// *
//
// * @apiSuccess {Array} list 结果数组
// * @apiSuccess {Boolean} ok 操作是否成功
// */
//router.get('/queryByTaskId',function(req,res,next){
//    TaskCardService.getByTaskId(req.query.taskId).then(function(results){
//        res.result = {ok: true,desc: "根据所属任务编号查询任务卡"};
//        res.json({ok:true,list:results});
//    }).catch(function(err){
//        next(err);
//    });
//});
//
///**
// * @api {get} /api/taskCard/queryByReceiverId 根据接收人获取任务卡
// * @apiName getByReceiverId
// * @apiGroup taskCard
// * @apiPermission All
// *
// * @apiParam {String} receiverId 接收人编号
// *
//
// * @apiSuccess {Array} list 结果数组
// * @apiSuccess {Boolean} ok 操作是否成功
// */
//router.get('/queryByReceiverId',function(req,res,next){
//
//    TaskCardService.getByReceiverId(req.query.receiverId,req.query.projectId).then(function(results){
//        res.result = {ok: true,desc: "根据接收人编号查询任务卡"};
//        res.json({ok:true,list:results});
//    }).catch(function(err){
//        next(err)
//    });
//});
//
///**
// * @api {put} /api/taskCard/update-all 修改所有表单信息
// * @apiName EditAllCard
// * @apiGroup taskCard
// * @apiPermission all
// *
// * @apiParam (body) {Array} data 表单数组
// *
// * @apiSuccess {Boolean} ok 更新操作是否成功
// *
// */
//router.put('/update-all',function(req,res,next){
//    var datas = JSON.parse(req.body.data);
//    console.log(req.body);
//    TaskCardService.updateAll(datas).then(function(result,numberAffected){
//        res.result = {ok: true, desc: '更新表单'};
//
//        if (req.body.isSend==="true") {
//            io.sockets.emit('newTask', { "projectId" : JSON.parse(req.body.data)[0].projectId});
//        }
//        res.json(result);
//    }).catch(function(err){
//        next(err);
//    });
//});
//
///**
// * @api {put} /api/taskCard/remark/:taskId' 修改备注
// * @apiName UpdateRemark
// * @apiGroup taskCard
// * @apiPermission all
// *
// * @apiParam (body) {String} taskId 任务卡编号
// * @apiParam (body) {String} remark 备注信息
// *
// * @apiSuccess {Boolean} ok 更新操作是否成功
// *
// */
//router.put('/remark/:taskId',function(req,res,next){
//    var id = req.params.taskId;
//    var remark = req.body.remark;
//    TaskCardService.updateRemarkById(id,remark).then(function(result){
//        res.result = {ok: true, desc: '更新备注'};
//        res.json(result);
//    }).catch(function(err){
//        next(err);
//    });
//});
//
///**
// * @api {put} /api/taskCard/:taskId 修改任务信息
// * @apiName UpdateTask
// * @apiGroup taskCard
// * @apiPermission All
// *
// * @apiParam {String} taskId 任务编号
// * @apiParam {String} status 状态
// *
// * @apiSuccess {Boolean} ok 操作是否成功
// */
//router.put('/:taskId', function (req, res, next){
//    var id = req.params.taskId;
//    TaskCardService.updateById(id,req.body.data || req.body).then(function(results){
//        res.result = {ok: true,target: id, desc: "修改任务信息"};
//        res.json({ok:true});
//
//    }).catch(function(err){
//        next(err);
//    });
//});
//
///**
// * @api {get} /api/taskCard/queryOther/:versionId 根据版本id获取任务卡所有版本
// * @apiName QueryVersionsByOtherVersionId
// * @apiGroup taskCard
// * @apiPermission All
// *
// * @apiParam {String} versionId 当前版本编号
// *
//
// * @apiSuccess {Array} list 结果数组
// * @apiSuccess {Boolean} ok 操作是否成功
// */
//router.get('/queryOther/:versionId', function (req, res, next){
//    var versionId = req.params.versionId;
//    TaskCardService.queryVersionsByOtherVersionId(versionId).then(function(result){
//        res.json({list: result});
//    }).catch(function(err){
//        next(err);
//    });
//});
//
///**
// * @api {get} /api/taskCard/queryByAuditor/:auditorId 根据进程审核人获取任务卡信息
// * @apiName getTaskByAuditor
// * @apiGroup taskCard
// *
// * @apiParam {String} auditorId 审核人编号
// *
// * @apiSuccess {String} name 任务名称
// * @apiSuccess {String} versions 版本号
// * @apiSuccess {Number} status 接收状态
// * @apiSuccess {String} fatherId 所属任务编号
// * @apiSuccess {Date} startDate 开始时间
// * @apiSuccess {Date} planDate 预期时间
// * @apiSuccess {Date} endDate 结束时间
// * @apiSuccess {String} senderId 发送人编号
// * @apiSuccess {String} senderName 发送人姓名
// * @apiSuccess {String} receiverId 接收人编号
// * @apiSuccess {Array} progress 进程
// * @apiSuccess {String} priority 等级
// * @apiSuccess {Number} points 积分
// * @apiSuccess {Date} creatDate 创建时间
// * @apiSuccess {Date} updateTime 更新时间
// * @apiSuccess {String} index 位置
// * @apiSuccess {Array} list 任务卡信息
// * @apiSuccess {Boolean} ok 操作是否成功
// */
//router.get('/queryByAuditor/:auditorId',function(req,res,next){
//    var auditorId = req.params.auditorId;
//    TaskCardService.queryVersionsByAuditor(auditorId).then(function(results){
//        res.json({ok:true,list:results});
//    }).catch(function(err){
//        next(err);
//    });
//});
//
//router.get('/getCurrentTaskCardById/:taskId', function (req, res, next){
//    var id = req.params.taskId;
//    TaskCardService.getCurrentTaskCardById(id).then(function(result){
//        res.json(result);
//    }).catch(function(err){
//        next(err);
//    });
//});
//
///**
// * @api {get} /api/taskCard/:taskId 取得任务信息
// * @apiName GetTask
// * @apiGroup taskCard
// * @apiPermission All
// *
// * @apiParam {String} taskId 任务编号
// *
// * @apiSuccess {String} name 任务名称
// * @apiSuccess {String} versions 版本号
// * @apiSuccess {Boolean} isSend 是否发送
// * @apiSuccess {Number} status 接收状态
// * @apiSuccess {String} fatherId 所属任务编号
// * @apiSuccess {Date} startDate 开始时间
// * @apiSuccess {Date} planDate 预期时间
// * @apiSuccess {Date} endDate 结束时间
// * @apiSuccess {String} senderId 发送人编号
// * @apiSuccess {String} receiverId 接收人编号
// * @apiSuccess {Number} points 积分
// */
//router.get('/:taskId', function (req, res, next){
//    var id = req.params.taskId;
//    TaskCardService.getById(id).then(function(result){
//        res.json(result);
//    }).catch(function(err){
//        next(err);
//    });
//});
//
///**
// * @api {delete} /api/taskCard/:taskCardId 删除任务卡
// * @apiName DeleteTaskCard
// * @apiGroup taskCard
// * @apiPermission leader
// *
// * @apiParam {String} taskCardId 任务卡编号
// *
// * @apiSuccess {Boolean} ok 操作是否成功
// */
//router.delete('/:taskCardId',function(req,res,next){
//    var id = req.params.taskCardId;
//    TaskCardService.deleteById(id).then(function(result){
//        res.result = {ok: true, target: id, desc: "删除任务卡"};
//        res.json({ok:true});
//    }).catch(function(err){
//        next(err);
//    });
//});
/*
* new
* */
/**
 * @api {post}/api/taskCard/createTask
 * 新建任务卡
 * */
router.post('/createTask',function(req,res,next){
    var taskData=req.body;
    var info=getData(taskData);
    TaskCardService.createTask(info).then(function(data){
        res.json(data);
    }).catch(function(err){
        next(err);
    });

});
/*
* @api {put}/api/taskCard/updateTask
* 编辑任务卡,将要编辑的任务卡版本变成当前版本
* **/
router.put('/updateTask',function(req,res,next){
   var upTaskData=req.body;
    var info=getData(upTaskData);
        TaskCardService.updateTask(info).then(function(data){
            res.json(data);
        }).catch(function(err){
            next(err);
        });
});
/*
 * @api {put}/api/taskCard/updateCurTask
 * 编辑任务卡,任务卡创建人编辑
 * **/
router.put('/updateCurTask',function(req,res,next){
    var upTaskData=req.body;
    var info=getData(upTaskData);
         TaskCardService.updateCurTaskVersion(info).then(function(data){
             res.json(data);
         }).catch(function(err){
             next(err);
         });
});


/*
* @pai {post}/api/taskCard/createVersion
* 新建任务卡版本
* */
router.post('/createVersion',function(req,res,next){
    var versionData=req.body;
    var version=getData(versionData);
    TaskCardService.createVersion(version).then(function(data){
       res.json(data);
    }).catch(function(err){
        next(err);
    });
});
/**
 *@api {get}/api/taskCard/selectTasks
 *获取所有任务卡列表
 * @param{offset,userId,flag}
 * offset 偏移量
 * flag 标识是创建者，制作者等，可选值{‘create','product'}
 *
 * */
router.get('/selectTasks',function(req,res,next){
    var $data=req.query;
    if($data.flag=='create'){
        TaskCardService.getUserSenderTask($data).then(function(Data){
            if(Data!=null){
                TaskCardService.selectAllTasks(Data).then(function(data){
                    TaskCardService.getCountTask(Data).then(function(page){
                        res.json({list:data,page:page.page,count:page.count});
                    }).catch(function(err){
                        next(err);
                    });
                }).catch(function(err){
                    next(err);
                });
            }else{
                res.json({list:null});
            }
        });
    }else{
        TaskCardService.selectAllTasks($data).then(function(data){
            TaskCardService.getCountTask($data).then(function(page){
                res.json({list:data,page:page.page,count:page.count});
            }).catch(function(err){
                next(err);
            });
        }).catch(function(err){
            next(err);
        });
    }
});
/*
* @api {get}/api/taskCard/getSenderTasks
* 获取由我发送的任务卡列表
* @param{offset,userId,flag='send'}
 * offset 偏移量
 *
* */
router.get('/getSenderTasks',function(req,res,next){
    var _data=req.query;
    TaskCardService.getUserSenderTask(_data).then(function(data){
        if(data!=null){
            TaskCardService.selectAllTasks(data).then(function(taskDatas){
                TaskCardService.getCountTask(data).then(function(page){
                    res.json({list:taskDatas,page:page.page,count:page.count});
                });
            });
        }else{
           res.json({list:null});
        }
    }).catch(function(err){
        next(err);
    });
});
/**
 * @api {get}/api/taskCard/getCheckerTasks
 * 获取由我审核的任务卡列表
 *  @param{ offset,userId,flag='send' }
 * */
router.get('/getCheckerTasks',function(req,res,next){
    var _data=req.query;
      TaskCardService.getCurUserCheckAuth(_data.userId).then(function(datas){
          if(datas!=null){
              _data.progressId=datas;
          }else {
              _data.progressId=[];
          }
          TaskCardService.selectAllTasks(_data).then(function(taskDatas){
              TaskCardService.getCountTask(_data).then(function(page){
                  if(taskDatas!=null){
                      var len = 0;
                      for(var i=0;i<taskDatas.length;i++){
                              TaskCardService.getTaskFinishProgress(taskDatas[i].DT_RowId).then(function(db){
                                  taskDatas[len].percent=db;
                                  len+=1;
                                  if(len==taskDatas.length){
                                      res.json({list:taskDatas,page:page.page,count:page.count});
                                  }
                              });
                      }
                  }else{
                      res.json({list:taskDatas,page:page.page,count:page.count});
                  }
              });
          });

      }).catch(function(err){
          next(err);
      });
});
/*
 * @api {get}/api/taskCard/getUnReadTaskCount
 * 获取我的任务标签下的所有未读任务卡个数
 * @param{userId}
 * */
router.get('/getUnReadTaskCount/:userId',function(req,res,next){
        var _data={};
       _data.userId=req.params.userId;
       _data.unRead=true;
      TaskCardService.getBymeCreateTaskUnRead(_data).then(function(createCount){
          TaskCardService.getBymeSendTaskUnRead(_data).then(function(sendCount){
              TaskCardService.getBymeProductTaskUnRead(_data).then(function(productCount){
                  TaskCardService.getBymeCheckTaskUnRead(_data).then(function(checkCount){
                      res.json({createCount:createCount,sendCount:sendCount,productCount:productCount,checkCount:checkCount});
                  });
              });
          });
      }).catch(function(err){
          next(err);
      });
});
/*
 * @api {get}/api/taskCard/getToDealtTaskCount
 * 获取主页任务卡待办个数
 * @param{userId}
 * */
router.get('/getToDealtTaskCount/:userId',function(req,res,next){
    var _data={};
    _data.userId=req.params.userId;
    _data.toDealt=true;
    TaskCardService.getBymeCreateTaskUnRead(_data).then(function(createCount){
        TaskCardService.getBymeSendTaskUnRead(_data).then(function(sendCount){
            TaskCardService.getBymeProductTaskUnRead(_data).then(function(productCount){
                TaskCardService.getBymeCheckTaskUnRead(_data).then(function(checkCount) {
                    contractService.getAllToDealContractCount(_data).then(function (contractCount) {
                        res.json({
                            createCount: createCount,
                            sendCount: sendCount,
                            productCount: productCount,
                            checkCount: checkCount,
                            contractCount:contractCount
                        });
                    });
                });
            });
        });
    }).catch(function(err){
        next(err);
    });
});
/*
 * @api {get}/api/taskCard/getToDealtContractCount
 * 获取主页合同待办个数
 * @param{userId}
 * */
router.get('/getToDealtContractCount/:userId',function(req,res,next){
    var _data={};
    _data.userId=req.params.userId;
    contractService.getAllToDealContractCount(_data).then(function(contractCount){
        res.json(contractCount);
    }).catch(function(err){
        next(err);
    });
});
/**
 *@api {get}/api/taskCard/queryTasks
 *获取所有完成状态的任务卡
 * @param{offset,limit,userId,flag,finished}
 * offset 偏移量
 * flag 标识是创建者，接受者，制作者等，可选值{‘create','send','product','check'}
 * status status array [-1 - 5]，optional,
 *任务卡状态-1：已退回，0：制卡未完成；1:未派发；2:制作中；3:审核中, 4:审核完成,5:任务完成
 * */
router.get('/queryList', function (req, res, next) {
    var $data = req.query;
    $data.where = {};
    if ($data.status){
       var array=[];
        for(var i=0;i<$data.status.length;i++){
            array.push(parseInt($data.status[i]));
        }
        $data.where.status =array;
    }
    else{
        $data.where.status = {$in: [-1, 0, 1, 2, 3, 4, 5]};
    }
    TaskCardService.androidSelectAllTasks($data).then(function (tasks) {
       // TaskCardService.getAndroidCountTask($data).then(function (page) {
            var _data={};
            _data.userId=$data.userId;
            _data.unRead=true;
           switch ($data.flag) {
               case 'create':
                   TaskCardService.getBymeCreateTaskUnRead(_data).then(function(sendCount){
                       res.json({list: tasks,unRead:sendCount});

                   }).catch(function(err){
                       next(err);
                   });
                   break;
               case 'product':
                   TaskCardService.getBymeProductTaskUnRead(_data).then(function(productCount){
                       res.json({list: tasks,unRead:productCount});
                   }).catch(function(err){
                       next(err);
                   });
                   break;
               case 'check':
                   if (tasks != null) {
                       var len = 0;
                       for (var i = 0; i < tasks.length; i++) {
                           TaskCardService.getTaskFinishProgress(tasks[i].versionId).then(function (db) {
                               tasks[len].percent = db;
                               len += 1;
                               if (len == tasks.length) {
                                   TaskCardService.getBymeCheckTaskUnRead(_data).then(function(checkCount){
                                       res.json({list: tasks,unRead:checkCount});
                                   }).catch(function(err){
                                       next(err);
                                   });
                               }
                           });
                       }
                   }else{
                       res.json({list: tasks,unRead:{count:0,page:0}});
                   }
                   break;
           }
              //  res.json({list: tasks, page: page.page, count: page.count});

        //}).catch(function (err) {
        //    next(err);
        //});
    }).catch(function (err) {
        next(err);
    });
});
/**
 * @api {get}/api/taskCard/selectOneTask/:Id
 * 根据id查看任务卡版本信息
 * 传任务卡版本id
 * */
router.get('/selectOneTask/:Id',function(req,res,next){
   var taskVersionId=req.params.Id;
    TaskCardService.selectOneTask(taskVersionId).then(function(data){
        res.json(data);
    }).catch(function(err){
        next(err);
    });
});
/**
 * @api {get}/api/taskCard/selectOneCurTask/:Id
 * 根据id查看当前版本的任务卡信息
 * 传任务卡id
 * */
router.get('/selectOneCurTask/:Id',function(req,res,next){
    var taskId=req.params.Id;
    var where={currentStatus:'true'};
    TaskCardService.selectOneCurTask(taskId,where).then(function(data){
        res.json(data);
    }).catch(function(err){
        next(err);
    });
});
/*
*@api {delete}/api/taskCard/deleteTask/:data
 * 根据id删除任务卡
 * 传任务卡id，版本id
*
* */
router.delete('/deleteTask/:data',function(req,res,next){
    var datas=JSON.parse(req.params.data);
    var versionId = datas.versionId;
    reviewCommentService.findByVersionId(versionId).then(function(success){
        TaskCardService.deleteTask(datas).then(function(data){
            res.json(success); //TODO 返回值前台需要，需要修改找（HK55）沟通
        }).catch(function(err){
            next(err);
        });
    }).catch(function(data){
        next(data);
    });

});
/**
 * @api{get}/api/taskCard/getStepTasks
 * @param{moduleId:moduleId}
 * 获取一个步骤节点下的外部未派发的任务卡
 * */
router.get('/getStepTasks/:moduleId',function(req,res,next){
    var moduleId=req.params.moduleId;
    TaskCardService.getStepOuterTask(moduleId).then(function(data){
        res.json(data);
    }).catch(function(err){
        next(err);
    });
});

router.get('/getAllTasksUnderM/:moduleId',function(req,res,next){
    var moduleId=req.params.moduleId;
    TaskCardService.getAllTasksUnderM(moduleId).then(function(data){
        res.json(data);
    }).catch(function(err){
        next(err);
    });
});

router.get('/getStepTasksInList',function(req,res,next){
    //console.log(req.query,'shusdjkahdkashdbnka');
    TaskCardService.getStepOuterTaskInList(req.query).then(function(data){
        res.json(data);
    }).catch(function(err){
        next(err);
    });
});
/*
* @api {get}/api/taskCard/getCurUserAndroidPosition
* @params{userId,versionId}
* 获取当前的用户的权限,并获取任务卡的详情
* 返回的数值含义{
* seeAllProject：查看项目内容的权限，manageAllContracts：管理合同的权限}
* */
router.get('/queryDetails',function(req,res,next){
    var _data=req.query;
    TaskCardService.getCurUserPosition(_data.userId).then(function(data){
        TaskCardService.selectOneTask(_data.versionId).then(function(taskInfo){
            if(data.manageAllContracts==true||data.seeAllProject==true){
               res.json(taskInfo);
            }else{
               if(taskInfo.contract.contractLeaderId==_data.userId||taskInfo.contract.partBId==_data.userId||taskInfo.contract.paidManId==_data.userId){
                   res.json(taskInfo);
               }else{
                   taskInfo.contract=null;
                   res.json(taskInfo);
               }
            }
        });
    }).catch(function(err){
        next(err);
    });
});
/*
 * @api {get}/api/taskCard/getCurUserTaskAuth
 * @params{project,userId}
 * 获取当前的用户是否可以新建，编辑任务卡
 * 返回数据含义{
 * manageAllTasks---管理任务卡的权限
 * manageAllProjectJieGou--管理项目
 * manageAllContracts--管理合同
 * seeAllProjects--查看项目
 * manageProjectTasks--项目负责人
 * taskLeader--任务卡负责人
 * contractLeader--合同负责人
 * payLeader--支付负责人
 * puTongChengYuan--普通成员
 * }
 * */
router.get('/getCurUserProjectAuth',function(req,res,next){
    var _data=req.query;
    TaskCardService.getCurUserProjectAuth(_data).then(function(data){
        res.json(data);
    }).catch(function(err){
        next(err);
    });
});
/*@api{get} /api/taskCard/getCheckUsers
* @params{任务卡版本id}
* 获取任务卡版本的审核人
* */
router.get('/getCheckUsers/:taskVersionId',function(req,res,next){
    var taskVersionId=req.params.taskVersionId;
    TaskCardService.getCheckUsers(taskVersionId).then(function(data){
        res.json(data);
    }).catch(function(err){
        next(err);
    });
});
/**
 * @api {post}/api/taskCard/getStepChildren
 * @params {projectId：id,type:1||2,userId,curUserManageTaskAuth(是否具有管理所有任务卡的权限)，curUserProjectLeader:(是否是项目负责人)}
 * 获取一个项目下的资产后镜头步骤的所有叶子节点
 * */
router.post('/getStepChildren',function(req,res,next){
    var params=req.body;
    TaskCardService.getlineInfo(params).then(function(data){
        TaskCardService.getAllAssetOrShot(params).then(function(ssdata){
            res.json({step:data,data:ssdata});
        }).catch(function(err){
            next(err);
        });
    }).catch(function(err){
        next(err);
    });
});

/*
* @api {put}/api/taskCard/turnVersion
* @params {taskId:id,versionId:id}
*切换任务卡版本
* */
router.put('/turnVersion',function(req,res,next){
    TaskCardService.turnVersion(req.body).then(function(data){
        res.json(data);
    }).catch(function(err){
        next(err);
    });
});

/*
 * @api {get}/api/taskCard/getOneTaskVersion
 * @params {taskId:id}
 *获取一个任务卡的所有版本
 * */
router.get('/getOneTaskVersion/:taskId',function(req,res,next){
    TaskCardService.getOneTasksVersion(req.params.taskId).then(function(data){
        res.json(data);
    }).catch(function(err){
        next(err);
    });
});
/*
* @api {put}/api/taskCard/updateTaskStatus
* @params{status:XX,versionId:id}
* 改变任务卡的状态
* */
router.put('/updateTaskStatus',function(req,res,next){
    //var status=req.body.status;
    //var versionId=req.body.versionId;
    //var userId=req.body.userId;
    TaskCardService.updateTaskStutas(req.body).then(function(data){
        if(data==1){
            res.json({message:'success'});
        }else{
            res.json({message:'failed'});
        }
    }).catch(function(err){
        next(err);
    });
});
/**
 * @api {post}/api/taskCard/saveTaskType
 * @param{type,productorId,priority,points,versionId}
 * 发送人指定任务卡类型和制作人等
 * */
router.post('/saveTaskType',function(req,res,next){
    var _data=req.body;
    TaskCardService.senderOperateTask(_data).then(function(data){
        res.json({list:data});
    }).catch(function(err){
        next(err);
    });
});
/**
 * @api {post}/api/taskCard/backTask
 * Aparam{versionId,reason}
 * 发送人退回任务卡重做
 * */
router.post('/backToTask',function(req,res,next){
    var _data=req.body;
    TaskCardService.backTask(_data).then(function(data){
        res.json(data);
    }).catch(function(err){
        next(err);
    });
});
function getData(taskData){
    var params={};
    params.Info={
        projectId:taskData.projectId,
        moduleId:taskData.moduleId,//关联步骤
        associatedType:taskData.associatedType
    };
    params.associatedName={
        associatedTypeName:taskData.associatedTypeName,
        associatedName:taskData.associatedName,
        moduleName:taskData.moduleName
    };
    if(taskData.taskId){
        params.Info.taskId=taskData.taskId;
    }
    if(taskData.associatedType==2){
        if(taskData.associatedId){
            params.Info.associatedAssetId=taskData.associatedId;//关联资产
        }
    }
     else{
        if(taskData.associatedId){
            params.Info.associatedShotId=taskData.associatedId;//关联镜头
        }
    }
    var checkId=JSON.parse(taskData.checkId);
    params.version={
        name:taskData.name,
        version:taskData.version,
        startDate:taskData.startDate,
        planDate:taskData.planDate,
        workDays:taskData.workDays,
        creatorId:taskData.creatorId
    };
    params.checkId=checkId.length!=0?checkId:'';
    params.checkName=taskData.checkName?(taskData.checkName).split('， '):'';
    if(taskData.versionId){
        params.version.versionId=taskData.versionId;
    }else{
        params.version.currentStatus='true';
    }
    return params;
}

router.get('/taskUnderModule',function(req,res,next){
    console.log('shujudaodalij',req.query.list);
    TaskCardService.getTasksUnderModule(req.query.list).then(function(data){
        console.log(data,'datatatatattatat');
    })
});

router.put('/updateTaskInfo/:idList',function(req,res,next){
    var idList = req.params.idList.split(',');
    //console.log(req.body,idList,'hdasjhdashn');
    var nameList = '';
    var moduleName = '';
    var projectId = '';
    var TaskVersionList = [];
    new Promise(function(resolve,reject){
        TaskCardService.getAllTasksById(idList).then(function(data){
            //TODO versionID
            var len = data.length;
            nameList =data[0].TaskVersions[0].name;
            projectId = data[0].projectId;
            moduleName = data[0].StepInfo.name;
            TaskVersionList.push(data[0].TaskVersions[0].id);
            for(var i=1;i<len;i++){
                nameList+=','+data[i].TaskVersions[0].name;
                TaskVersionList.push(data[i].TaskVersions[0].id);
            }
            resolve();
        });
    }).then(function(){
        TaskCardService.updateTaskInfo(idList,req.body).then(function(data){
            //console.log(moduleName,'12312312312312')
            stepTreeService.getById(req.body.moduleId).then(function(info){
                //console.log(info,'infofdasdaa');
                userLog.log({type:0,typeId:'',projectId:projectId,description:'任务卡所属步骤调整:\r\n'+'任务卡：“'+nameList+'”,由步骤“'+moduleName+'”调整到“'+info.name+'”\r\n任务卡所属合同内容同步更新为新节点信息（合同负责人、支付负责人、合同类型）'});
                stepTreeService.getNodeMember(req.body.moduleId).then(function(MemberInfo){
                    //console.log('1122312312312',MemberInfo.contractLeader);
                    //console.log('1122312312312',MemberInfo.payLeader);
                    contractService.updateByModuleId({taskCardVersionId:{$in:TaskVersionList}},
                        {contractLeaderId:MemberInfo.contractLeader.id,
                            paidMan:MemberInfo.payLeader.name,
                            paidManId:MemberInfo.payLeader.id,
                            taskCardType:info.name}).then(function(data){
                        //console.log(data,'dddddddddddddddddddd')
                    })
                });
            });


            //console.log('dasa',data,nameList,moduleName);
            res.json({ok:true,data:data});
        });
    }).catch(function(err){
        console.log(err);
    });

});
