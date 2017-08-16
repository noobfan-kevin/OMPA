
var express = require('express');
var router = module.exports = express.Router();
var log = process.core.log;
var reviewCommentService = require('../service/reviewComment');
var userLog = require('../core/userLog');

router.get('/:progressId',function(req,res,next){
    var progressId = req.params.progressId;
    reviewCommentService.query(progressId).then(function(results){
        res.json(results);
    }).catch(function(error){
        next(error);
    });
});

router.delete('/:fileId',function(req,res,next){
    var fileId = req.params.fileId;
    var projectId = req.body.projectId;
    new Promise(function(resolve,reject){
        reviewCommentService.getById(fileId).then(function(data){
            //console.log('12331231231231',data.belongFile);
            var _data = {};
                _data.id = data.taskVersionId;
                _data.name = data.belongFile.originalName;
            resolve(_data);
        })
    }).then(function(info){
        reviewCommentService.deleteById(fileId).then(function(){
            userLog.log({type:1,typeId:info.id,projectId:projectId,description:'任务进程中删除文件:'+info.name});
            res.json({ok:true});
        }).catch(function(error){
            next(error);
        });
    }).catch(function(err){
        console.log(err);
    });
});

/**
 * @api {post} /api/reviewComment 新建审核信息
 * @apiName AddReviewComment
 * @apiGroup ReviewComment
 *
 * @apiParam {String} content 审核意见内容
 * @apiParam {String} senderId 发送人编号
 * @apiParam {String} senderName 发送人姓名
 * @apiParam {Number} stutas 审核状态
 * @apiParam {String} taskVersion 任务卡版本编号
 * @apiParam {Date} creatTime 创建日期
 *
 * @apiSuccess {String} _id 审核编号
 * @apiSuccess {String} content 审核意见内容
 * @apiSuccess {Date} endDate 完成时间
 * @apiSuccess {Object} senderId 发送人编号
 * @apiSuccess {String} senderName 发送人姓名
 * @apiSuccess {Number} stutas 审核状态
 * @apiSuccess {String} taskVersion 任务卡版本编号
 * @apiSuccess {Date} creatTime 创建日期
 */
router.post('/',function(req,res,next){
    var re = req.body;
    var changeInfo = '';
    reviewCommentService.create(req.body).then(function(results){
        if(re.content!='上传了 '){
            changeInfo='进程文件上传：'+re.fileName;
        }else{
            changeInfo='进程发表评论：'+re.content;
        }
        userLog.log({type:1,typeId:re.taskVersionId,projectId:re.projectId,description:changeInfo});
        res.json(results);
    }).catch(function(error){
       next(error);
    });
    /*reviewCommentService.create(req.body, function(err,results){
        if(err){
            next(err);
        }
        else{
            res.result = {ok: true, target: results._id, desc: "新建审核信息"};
            res.json(results);
        }
    });*/
});

/**
 * @api {post} /api/reviewComment/save 保存审核信息
 * @apiName SaveReviewComment
 * @apiGroup ReviewComment
 *
 * @apiParam {String} content 审核意见内容
 * @apiParam {String} senderId 发送人编号
 * @apiParam {senderName} senderName 发送人姓名
 * @apiParam {String} stutas 审核状态
 * @apiParam {String} taskVersion 任务卡版本编号
 * @apiParam {Date} creatTime 创建日期
 *
 * @apiSuccess {Boolean} ok 操作是否成功
 */
router.post('/save',function(req,res,next){
    reviewCommentService.updateAndCreate(req.body).then(function(results){
        res.json(results);
    }).catch(function(error){
        next(error);
    });
    /*reviewCommentService.updateAndCreate(req.body, function(err,results){
        if(err){
            next(err);
        }
        else{
            res.result = {ok: true, target: results._id, desc: "保存审核信息"};
            res.json(results);
        }
    });*/
});


/**
 * @api {get} /api/reviewComment/:taskVersion 获取当前任务卡版本审核意见
 * @apiName GetCurrentReviewComment
 * @apiGroup ReviewComment
 * @apiPermission leader
 *
 * @apiParam (params){String} taskVersion 任务卡版本编号
 *
 * @apiSuccess {String} content 审核意见内容
 * @apiSuccess {String} senderId 发送人编号
 * @apiSuccess {String} producer 发送人姓名
 * @apiSuccess {Number} stutas 审核状态
 * @apiSuccess {String} taskVersion 任务卡版本编号
 * @apiSuccess {Date} creatTime 创建日期
 * @apiSuccess {Boolean} ok 操作是否成功
 * @apiSuccess {Array} list 审核意见数据
 *
 */
router.get('/:taskVersion',function(req,res,next){
    var taskVersion = req.params.taskVersion;
    reviewCommentService.getByTaskVersion(taskVersion).then(function(results){
        res.json({ok:true,list:results});
    }).catch(function(error){
        next(error);
    });
    /*reviewCommentService.getByTaskVersion(taskVersion,function(err,results){
        if(err){
            next(err);
        }
        else{
            res.result = {ok: true,target: taskVersion, desc: "获取任务卡当前版本审核意见"};
            res.json({ok:true,list:results});
        }
    });*/
});