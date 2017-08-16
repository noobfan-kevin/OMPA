/**
 * Created by hk053 on 2016/7/19.
 */
var express = require('express');
var router = module.exports = express.Router();
var NoticeService = require('../service/noticeService');
/*
 * @api /notice/createNotice
 * @param 通知标题title
 *        通知内容content
 *        接收部门（ID）departmentId
 *        附件  fileId
 *        发送人（ID，名字）senderId,senderName
 * */
router.post('/createNotice',function(req,res,next){
    NoticeService.createNotice(req.body).then(function(data){
        res.json(data);
    }).catch(function(err){
        next(err);
    });
});

/*
 * @api /notice/selectNotice
 * @param 通知Id
 *
 * */
router.get('/selectNotice',function(req,res,next){
    var _data=req.query;
    NoticeService.selectNotice(_data).then(function(data){
        res.json(data);
    }).catch(function(err){
        next(err);
    });
});


/*
 * @api /notice/getNotices
 * @param userId
 * 获取通知列表
 * */
router.get('/getNotices',function(req,res,next){
    var _data=req.query;
    NoticeService.getNoticeList(_data).then(function(data){
        res.json(data);
    }).catch(function(err){
        next(err);
    });
});

/*
 * @api /notice/getUnReadNotices
 * @param userId
 * 获取未读通知个数
 * */
router.get('/getUnReadNotices/:userId',function(req,res,next){
    var _data=req.params.userId;
    NoticeService.getUnReadNotice(_data).then(function(data){
        res.json(data);
    }).catch(function(err){
        next(err);
    });
});

///*
// * @api /notice/getNeibarNotice
// * @param noticeId
// * 获取相邻通知
// * */
//router.get('/getNeibarNotice/:noticeId',function(req,res,next){
//    var _data=req.params.noticeId;
//    NoticeService.getXiangLinNotice(_data).then(function(data){
//        res.json(data);
//    }).catch(function(err){
//        next(err);
//    });
//});