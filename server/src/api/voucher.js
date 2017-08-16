/**
 * Created by hk61 on 2016/6/17.
 */

var express = require('express');
var router = module.exports = express.Router();

var log = process.core.log;
var io = process.core.io;

var Voucher = process.core.db.models.Voucher;
var voucherService = require('../service/voucherService');
var fileService = require('../service/fileService');

/*
* 创建
* */
router.post('/upload', function (req, res, next) {
    var files = req.files['voucher'];
    var user = req.session.user;
    return voucherService.create(req.body).then(function(dbVoucher) {
        var voucherId = dbVoucher.getDataValue('id');
        var tableName = Voucher.getTableName();

        files.forEach(function(file) {
            file.sourceTable = tableName;
            file.sourceKey = voucherId;
            file.parentId = req.body.fatherId;
            file.originalName = file.originalname;
            if(user){    //  session停用
                file.authorId = user.id;
            }
            file.name= file.fieldname + '/' + file.filename;
            file.logicPath = '/' + file.fieldname;
        });
        return fileService.bulkCreate(files).then(function(dbFiles) {
            dbVoucher.setDataValue('files', dbFiles);
            res.json(dbVoucher);
        })

    }).catch(function(err) {
        next(err)
    });
});

/*
 * 删除
 * */
router.delete('/:voucherId', function (req, res, next) {
    var voucherId = req.params.voucherId;

    return fileService.delete(voucherId).then(function(dbFile) {
        res.json({ok: true, message: '删除支付凭证成功'})
    }).catch(function(err) {
        next(err)
    })
});

/*
 * 查询所有
 * */
router.get('/:contractId', function (req, res, next) {
    var contractId = req.params.contractId;
    return voucherService.query({
        where: {
            contractId: contractId
        },
        order: ['createdAt']
    }).then(function(dbFiles) {
        dbFiles = dbFiles || [];
        res.json(dbFiles)
    }).catch(function(err) {
        next(err)
    })
});


/*
 * 查询支付凭证图片
 * */
router.get('/image/:voucherId', function (req, res, next) {
    var voucherId = req.params.voucherId;

    return fileService.findGroupFile(voucherId).then(function(dbFiles) {
        res.json(dbFiles)
    }).catch(function(err) {
        next(err)
    })
});