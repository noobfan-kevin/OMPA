/**
 * Created by wangziwei on 2015/9/16.
 */
var express = require('express');
var router = module.exports = express.Router();
var utils = require('../core/utils');
var log = process.core.log;
var progressService = require('../service/progressService');
var io = process.core.io;
//var roles = require('../../core/auth').roles;

/**
 * @api {post} /api/progress 保存进程
 * @apiName AddProgress
 * @apiGroup Progress
 * @apiPermission leader
 *
 * @apiParam {String} _id 主键ID
 * @apiParam {String} name 文件名
 * @apiParam {String} process 制作步骤
 * @apiParam {String} progress 进度百分比
 * @apiParam {Date} startDate 开始时间
 * @apiParam {Date} planDate 预期时间
 * @apiParam {Date} endDate 完成时间
 * @apiParam {Object} creater 创建人{_id:}{name:}
 * @apiParam {Array} auditor 审核人
 * @apiParam {String} producer 制作人姓名
 * @apiParam {String} remark 备注
 * @apiParam {String} taskVersion 任务卡版本编号
 *
 * @apiSuccess {Boolean} ok 操作是否成功
 */
//router.post('/',function(req,res,next){
//    var arr = JSON.parse(req.body.data);
//    var isSend = arr[0].isSend;
//    for(var i=0;i<arr.length;i++){
//        if(!arr[i].notEncode) {
//            arr[i].name = utils.decode(arr[i].name);
//            arr[i].step = utils.decode(arr[i].step);
//        }
//    }
//    progressService.updateAndCreate(arr).then(function(results){
//        res.result = {ok: true, desc: "保存进程"};
//        if(isSend === "true"){
//            io.sockets.emit('newTask', { "projectId" : JSON.parse(req.body.data)[0].projectId});
//        }
//        res.json({ok:true, list: results});
//
//    }).catch((err) =>  next(err));
//});
//
///**
// * @api {get} /api/progress/:taskVersion 获取当前任务卡版本进程
// * @apiName GetCurrentProgress
// * @apiGroup Progress
// * @apiPermission leader
// *
// * @apiParam {String} taskVersion 任务卡版本编号
// *
// * @apiSuccess {String} id 主键ID
// * @apiSuccess {String} name 文件名
// * @apiSuccess {String} process 制作步骤
// * @apiSuccess {String} progress 进度百分比
// * @apiSuccess {Date} startDate 开始时间
// * @apiSuccess {Date} planDate 预期时间
// * @apiSuccess {Date} endDate 完成时间
// * @apiSuccess {Object} creater 创建人{_id:}{name:}
// * @apiSuccess {Array} auditor 审核人
// * @apiSuccess {String} producer 制作人姓名
// * @apiSuccess {String} remark 备注
// * @apiSuccess {String} taskVersion 任务卡版本编号
// *
// *
// * @apiSuccess {Boolean} ok 操作是否成功
// */
//router.get('/:taskVersion',function(req,res,next){
//    var taskVersion = req.params.taskVersion;
//    progressService.getByTaskVersion(taskVersion).then(function(results){
//        res.result = {ok: true,target: taskVersion, desc: "获取任务卡当前版本进程"};
//        res.json({ok:true,list:results});
//    }).catch((err) =>  next(err));
//});
//
///**
// * @api {delete} /api/progress/:progressId 删除进程
// * @apiName DeteleProgress
// * @apiGroup Progress
// * @apiPermission leader
// *
// * @apiParam {String} progressId 进程编号
// *
// * @apiSuccess {Boolean} ok 操作是否成功
// */
//router.delete('/:progressId',function(req,res,next){
//    var progressId = req.params.progressId;
//    progressService.deleteById(progressId).then(function(){
//        res.result = {ok: true,target: progressId, desc: "删除进程"};
//        res.json({ok:true});
//    }).catch((err) =>  next(err));
//});

/*
* new progress
* */
/**
 * @api {post} /api/progress/createProgress 新建进程
 * @apiName AddProgress
 * @apiGroup Progress
 * @apiPermission leader
 *

 * @apiParam {String} name 进程名称
 * @apiParam {String} process 制作步骤
 * @apiParam {String} progress 进度百分比
 * @apiParam {Date} startDate 开始时间
 * @apiParam {Date} planDate 预期时间
 * @apiParam {Object} creater 创建人{_id:}
 * @apiParam {String} producer 制作人id
 * @apiParam {String} taskVersion 任务卡版本编号
 *
 * @apiSuccess {Boolean} ok 操作是否成功*/
router.post('/createProgress',function(req,res,next){
      progressService.createProgress(req.body).then(function(data){
          if(data){
              res.json({message:'createSuccess',list:data});
          }
      }).catch(function(err){
          next(err);
      });
});

/**
 * @api{put} /api/progress/updateProgress
 *
 * @apiParam {String} _id 主键ID
 * @apiParam {String} name 进程名称
 * @apiParam {String} process 制作步骤
 * @apiParam {String} progress 进度百分比
 * @apiParam {Date} startDate 开始时间
 * @apiParam {Date} planDate 预期时间
  * @apiParam {String} producer 制作人id
 * @apiParam {String} taskVersion 任务卡版本编号
 * */

router.put('/updateProgress',function(req,res,next){
    progressService.updateProgress(req.body).then(function(data){
        if(data){
            res.json({message:'updateSuccess',list:data});
        }
    }).catch(function(err){
        next(err);
    });
});

/*
@api{get} /api/progress/getProgress
获取一个任务卡版本的所有进程
* */
router.get('/getProgress/:taskVersionId',function(req,res,next){
    var taskVersionId=req.params.taskVersionId;
 progressService.getProgress(taskVersionId).then(function(data){
     res.json(data);
 }).catch(function(err){
     next(err);
 });
});

/*
* @api{delete} /api/progress/deleteProgress
* 删除一个任务卡下的一个进程
* */
router.delete('/deleteProgress/:id',function(req,res,next){
    var progressId=req.params.id;
    progressService.deleteProgress(progressId).then(function(data){
        if(data==1){
            res.json({message:'deleteSuccess'});
        }
    }).catch(function(err){
        next(err);
    });
});
/*
@api{post} /api/progress/checkProgress
* 审核人进行审核
*@param{审核人id,当前任务卡版本id，当前审核进程id,审核状态：0(审核不通过)or 1(审核通过)}
* */
router.post('/checkProgress',function(req,res,next){
    var progress=req.body;
    progressService.checkProgress(progress).then(function(data){
        res.json(data);
    }).catch(function(err){
        next(err);
    });
});
/**
 * @api {get}/api/progress/getProgressStatusForAndroid
 *安卓获取进程的状态
 * @param{versionId}
 * */
router.get('/getProgressStatus',function(req,res,next){
    var versionId=req.query.versionId;
    progressService.getProgressStatusForAndroid(versionId).then(function(data){
        res.json(data);
    }).catch(function(err){
        next(err);
    });
});
