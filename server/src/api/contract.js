/**
 * Created by hk60 on 2016/6/3.
 */
var express = require('express');
var router = module.exports = express.Router();
var contractService = require('../service/contractService');
var roles = require("../core/auth").roles;
var TaskCardService = require('../service/taskVersionService');
var stepTreeService = require('../service/stepTreeService');
var io = process.core.io;
var userLog = require('../core/userLog');

router.get('/contractList', function (req, res, next) {
    //console.log('数据到服务器了');
    contractService.query({order:[["createdAt"]]}).
    then(function (list) {
        res.json(list);
    }).catch(function(err){
        next(err);
    });
});

router.get('/filterContractList', function (req, res, next) {
    contractService.getListByFilter(req.query).
    then(function (list) {
        res.json(list);
    }).catch(function(err){
        next(err);
    });
});

router.get('/getOnePageContractList', function (req, res, next) {
    //console.log('数据到服务器了',req.query);
    contractService.getOnePageContractList(req.query).
    then(function (list) {
        //console.log('111111',list);
        var len = list.length;
        var t_len = 0;
        var new_data =[] ;
        for(var i=0;i<len;i++){
            TaskCardService.selectOneTask(list[i].taskCardVersionId).then(function(data){
                //list[len].dataValues.percent = data.percent;
                new_data.push({lists:list[t_len],percent:data.percent});
                //console.log(data.percent);
                if(t_len==len-1){
                    res.json(new_data);
                }
                t_len+=1;
            });
        }
        //TaskCardService.selectOneTask()


    }).catch(function(err){
        next(err);
    });
});
router.get('/getContractInfo/:contractId', function (req, res, next) {
    //console.log('数据到服务器了');
    var id = req.params.contractId;
    contractService.getById(id).
    then(function (list) {
        //res.json(list)
        TaskCardService.selectOneTask(list.taskCardVersionId).then(function(success){
            res.json({"contract":list,"task":success});
        });
    }).catch(function(err){
        next(err);
    });
});

router.get('/nodeMember/:id', function (req, res, next) {
    //console.log('数据到服务器了');
    var id = req.params.id;
    stepTreeService.getNodeMember(id).then(function(stepInfo){
        res.json(stepInfo);
    }).catch(function(err){
        next(err);
    });
});

router.get('/count', function (req, res, next) {
    //console.log('数据到服务器了',req.query);
    contractService.getCount(req.query).
    then(function (list) {
        res.json(list);
    }).catch(function(err){
        next(err);
    });
});

router.post('/newContract',function(req,res, next){
    contractService.create(req.body).then(function (dbDm) {
        userLog.log({type:2,typeId:dbDm.id,projectId:req.body.projectId,description:'新建合同:'+req.body.contractName});
        res.json(dbDm);
    }).catch(function(err){
        next(err);
    });
});

router.delete('/:contractId', function (req, res, next) {
    var id = req.params.contractId;
    new Promise(function(resolve,reject){
        contractService.getById(id).then(function(data){
            resolve(data);
        })
    }).then(function(info){
        contractService.deleteById(id).then(function(){
            userLog.log({type:2,typeId:id,projectId:info.projectId,description:'删除合同:'+info.contractName});
            res.json({ok:true});
        }).catch(function(err){
            next(err);
        });
    }).catch(function(err){
        console.log(err);
    });

});
router.put('/:contractId',function (req, res, next) {
    var id = req.params.contractId;
    new Promise(function(resolve,reject){
        var changeInfo = '修改合同：\r\n';
        var re = req.body;
        contractService.getById(id).then(function(data){
            if(re.contractName!=data.contractName){
                changeInfo+='合同名称：“'+data.contractName+'”修改为“'+re.contractName+'”\r\n';
            }
            if(re.taskCardVersionId!=data.taskCardVersionId){
                changeInfo+='任务卡：“'+data.taskCardName+'”修改为“'+re.taskCardName+'”\r\n';
            }
            if(re.contractCode!=data.contractCode){
                changeInfo+='合同编号：“'+data.contractCode+'”修改为“'+re.contractCode+'”\r\n';
            }
            if(re.totalMoney!=data.totalMoney){
                changeInfo+='合同金额：“'+data.totalMoney+'”修改为“'+re.totalMoney+'”\r\n';
            }
            if(re.partBId!=data.partBId){
                changeInfo+='乙方：“'+data.partBName+'”修改为“'+re.partBName+'”\r\n';
            }
            var _data={};
            _data.info = changeInfo;
            _data.id = data.projectId;
            resolve(_data);
        })
    }).then(function(info){
        contractService.updateById(id,req.body).then(function(){
            if(info.info!='修改合同：'){
                userLog.log({type:2,typeId:id,projectId:info.id,description:'修改合同:'+info.info});
            }
            res.json({ok:true});
            io.sockets.emit('updateContractList');
        }).catch(function(err){
            next(err);
        });
    }).catch(function(err){
        console.log(err);
    });

});

/*
* 我的合同列表过滤
* @Param {String} userId  用户Id
* @Param {Number} page  页数
* @Param {Array} status  状态数组,['未发送1', '已发送2', '已退回3', '进行中4', '待支付5', '已支付7', '已完成6']的任意组合
* @Param {String} type  'send'、'pay'、'sign'之一
*
* @return {JSON} 如：{count:11, rows:[...]}
* */
router.post('/filterByUser', function(req, res, next) {
    var userId = req.body.userId;
    var page = req.body.page;
    var status = req.body.status || [];
    if(!status.length){
        status = [1, 2, 3, 4, 5, 6, 7, 8];
    }
    var type = req.body.type || 'send';
    var query = {
        where: {
            contractStatus: status
        },
        page: page
    };

    switch(type){
        case 'pay':
            query.where.paidManId = userId;
            query.where.contractStatus = getAuthStatus(status, [1, 2, 3, 4]);
            break;
        case 'sign':
            query.where.partBId = userId;
            query.where.contractStatus = getAuthStatus(status, [1, 3]);
            break;
        default:
            query.where.contractLeaderId = userId;

    }

    contractService.queryByStatus(query).then(function(results) {
        res.json(results);
    }).catch(function(err) {
        next(err);
    });

    function getAuthStatus(status, unAuthStatus) {
        var authStatus = [];
        status.forEach(function(v, i) {
            if(unAuthStatus.indexOf(v) == -1){
                authStatus.push(v)
            }
        });
        return authStatus;
    }

});

//更改合同状态、已读未读（读人ID）、支付进度
router.put('/status/:contractId',function (req, res, next) {
    var id = req.params.contractId;
    contractService.updateStatusById(id,req.body).then(function(data){
        userLog.log(function() {
            var info = '合同状态修改：';
            if(req.body.contractStatus){
                switch (req.body.contractStatus){
                    case 2:
                        info+='合同'+data.name+':负责人已发送';
                        break;
                    case 3:
                        info+='合同'+data.name+':签约方已退回';
                        break;
                    case 4:
                        info+='合同'+data.name+':进行中';
                        break;
                    case 5:
                        info+='合同'+data.name+':负责人指定支付';
                        break;
                    case 6:
                        info+='合同'+data.name+':完成';
                        break;
                    case 7:
                        info+='合同'+data.name+':阶段支付完成';
                        break;
                    case 8:
                        info+='合同'+data.name+':合同作废';
                        break;
                }
                return {type:2,typeId:id,projectId:data.getDataValue('projectId'),description:'修改合同:'+info}
            }
        });
        res.json({ok:true});
        io.sockets.emit('updateContractList');
    }).catch(function(err){
        next(err);
    });
});

//获取人所负责的合同。
router.get('/getContractByUserId', function (req, res, next) {
    //console.log('数据到服务器了',req.query);
    contractService.getContractById(req.query).
    then(function (list) {
        res.json(list);
    }).catch(function(err){
        next(err);
    });
});