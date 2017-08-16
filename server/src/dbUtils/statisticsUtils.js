/**
 * Created by hk61 on 2016/7/15.
 */

var TaskVersion = process.core.db.models.TaskVersion;
var Task = process.core.db.models.Task;
var Contract = process.core.db.models.Contract;
var Voucher = process.core.db.models.Voucher;

var statisticsUtils = module.exports;

statisticsUtils.mountCountAsync = mountCountAsync;
statisticsUtils.getNodes = getNodes;
statisticsUtils.getVersionTaskIdsAsync = getVersionTaskIdsAsync;
statisticsUtils.mountCountForNodes = mountCountForNodes;
statisticsUtils.mountCountForDefaultAsync = mountCountForDefaultAsync;

/*
* 获取指定统计下的所有节点
* */
function getNodes(statsInstance) {
    var dbNodes = statsInstance.StepInfos || statsInstance.getDataValue('StepInfos');
    return dbNodes ? dbNodes : [];
}

/*
* 获取指定统计下的所有节点
* */
function getNodeIds(statsInstance) {
    var dbNodes = statsInstance.StepInfos || statsInstance.getDataValue('StepInfos');
    if(!dbNodes) return [];

    return dbNodes.map(function(dbNode) {
        return dbNode.getDataValue('id');
    })
}


/*
 * 获取节点下所有任务卡版本id
 * */
function getVersionTaskIdsAsync(nodeIds) {
    return TaskVersion.all({
        include: [{
            model: Task,
            where: {
                moduleId: { $in: nodeIds }
            }
        }]
    }).then(function(dbs) {
        return dbs.map(function(db) {
            return db.getDataValue('id');
        })
    })
}

/*
 * 挂载任务数量统计
 * totalTask: 总量
 * doneTask: 已完成
 * */
function mountTaskCountAsync(dbInstance, isNode, timeWhere) {
    var nodeIds;

    if(!isNode){
        nodeIds =  getNodeIds(dbInstance)
    }else{
        nodeIds = [dbInstance.getDataValue('id')];
    }


    var PromiseTotal = TaskVersion.count({
        include: [{
            model: Task,
            where: {
                moduleId: { $in: nodeIds },
                createdAt: timeWhere
            }
        }]
    });
    var promiseDone = TaskVersion.count({
        include: [{
            model: Task,
            where: {
                moduleId: { $in: nodeIds }
            }
        }],
        where: {
            status: 5,
            endDate: timeWhere
        }
    });
    return Promise.all([PromiseTotal, promiseDone]).then(function(dbs) {
        dbInstance.setDataValue('totalTask', dbs[0]);
        dbInstance.setDataValue('doneTask', dbs[1]);
        return dbInstance;
    })
}


/*
 * 挂载合同数量统计
 * totalContract: 总量
 * signedContract: 已签约
 * doneContract: 已完成
 * */
function mountContractCountAsync(dbInstance, isNode, timeWhere) {
    var nodeIds;

    if(!isNode){
        nodeIds =  getNodeIds(dbInstance)
    }else{
        nodeIds = [dbInstance.getDataValue('id')];
    }

    return getVersionTaskIdsAsync(nodeIds).then(function(ids) {
        var promiseTotal = Contract.count({
            where: {
                taskCardVersionId: {
                    $in: ids
                },
                createdAt: timeWhere
            }
        });
        var promiseSigned = Contract.count({
            where: {
                taskCardVersionId: {
                    $in: ids
                },
                contractStatus: {
                    $in: [4, 5, 6, 7]
                },
                signTime: timeWhere
            }
        });
        var promiseDone = Contract.count({
            where: {
                taskCardVersionId: {
                    $in: ids
                },
                contractStatus: 6,
                updatedAt: timeWhere
            }
        });
        return Promise.all([promiseTotal, promiseSigned, promiseDone]).then(function(dbs) {
            dbInstance.setDataValue('totalContract', dbs[0]);
            dbInstance.setDataValue('signedContract', dbs[1]);
            dbInstance.setDataValue('doneContract', dbs[2]);
            return dbInstance;
        })
    });
}

/*
 * 获取指定版本下的所有合同id
 * */
function getContractIdsAsync(versionTaskIds) {
    return Contract.all({
        where:{
            taskCardVersionId: {
                $in: versionTaskIds
            },
            contractStatus: {
                $in: [4, 5, 6, 7]
            }
        }
    }).then(function(dbs) {
        return dbs.map(function(db) {
            return db.getDataValue('id');
        })
    })
}

/*
 * 挂载合同已经支出金额
 * */
function mountMoneyAsync(dbInstance, isNode, timeWhere) {
    var nodeIds;

    if(!isNode){
        nodeIds =  getNodeIds(dbInstance)
    }else{
        nodeIds = [dbInstance.getDataValue('id')];
    }
    return getVersionTaskIdsAsync(nodeIds).then(function(versionTaskIds) {
        return getContractIdsAsync(versionTaskIds);
    }).then(function(contractIds) {
        return Voucher.all({
            where: {
                contractId: { $in: contractIds }
            },
            createdAt: timeWhere
        })
    }).then(function(dbVouchers) {
        var paidMoney = 0;
        dbVouchers.forEach(function(dbVoucher) {
            paidMoney += dbVoucher.getDataValue('money')/1;   // [ /1 ]隐式强制转换为数字
        });
        dbInstance.setDataValue('paidMoney', paidMoney);
        return dbInstance;
    })
}

/*
 * 为每个统计实例挂载，任务卡、合同、金额统计数据
 * */
function mountCountAsync(statsInstances) {
    var promiseAll;

    promiseAll = statsInstances.map(function(db) {
        var timeWhere = null;
        var startTime = db.getDataValue('startTime');
        var endTime = db.getDataValue('endTime');

        timeWhere = {
            $gte:startTime,
            $lte:endTime
        };

        var promise1 = mountTaskCountAsync(db, false, timeWhere);
        var promise2 = mountContractCountAsync(db, false, timeWhere);
        var promise3 = mountMoneyAsync(db, false, timeWhere);
        return Promise.all([promise1, promise2, promise3]).then(function() {
            return statsInstances;
        });
    });
    return Promise.all(promiseAll).then(function() {
        return statsInstances;
    })
}


/*
* 为节点挂载统计数据
* */
function mountCountForNodes(nodeInstances, timeWhere) {
    var promiseAll;

    nodeInstances = Array.isArray(nodeInstances) ? nodeInstances : [nodeInstances];

    promiseAll = nodeInstances.map(function(db) {
        var promise1 = mountTaskCountAsync(db, true, timeWhere);
        var promise2 = mountContractCountAsync(db, true, timeWhere);
        var promise3 = mountMoneyAsync(db, true, timeWhere);
        return Promise.all([promise1, promise2, promise3]).then(function() {
            return nodeInstances;
        });
    });
    return Promise.all(promiseAll).then(function() {
        return nodeInstances;
    })
}


/*
* 为默认统计，挂载统计数据
* */
function mountCountForDefaultAsync(defaultStatsObj, nodeIds) {

    var PromiseTotal = TaskVersion.count({
        include: [{
            model: Task,
            where: {
                moduleId: { $in: nodeIds }
            }
        }]
    });
    var promiseDone = TaskVersion.count({
        include: [{
            model: Task,
            where: {
                moduleId: { $in: nodeIds }
            }
        }],
        where: {
            status: 5
        }
    });

    return Promise.all([PromiseTotal, promiseDone]).then(function(dbs) {

        defaultStatsObj.totalTask = dbs[0];
        defaultStatsObj.doneTask = dbs[1];

        return getVersionTaskIdsAsync(nodeIds).then(function(ids) {
            var promiseTotal = Contract.count({
                where: {
                    taskCardVersionId: {
                        $in: ids
                    }
                }
            });
            var promiseSigned = Contract.count({
                where: {
                    taskCardVersionId: {
                        $in: ids
                    },
                    contractStatus: {
                        $in: [4, 5, 6, 7]
                    }
                }
            });
            var promiseDone = Contract.count({
                where: {
                    taskCardVersionId: {
                        $in: ids
                    },
                    contractStatus: 6
                }
            });

            var promiseMoney = getContractIdsAsync(ids).then(function(contractIds) {
                return Voucher.all({
                    where: {
                        contractId: { $in: contractIds }
                    }
                })
            }).then(function(dbVouchers) {
                var paidMoney = 0;
                dbVouchers.forEach(function(dbVoucher) {
                    paidMoney += dbVoucher.getDataValue('money')/1;   // [ /1 ]隐式强制转换为数字
                });
                return paidMoney;
            });

            return Promise.all([promiseTotal, promiseSigned, promiseDone, promiseMoney]).then(function(dbs) {
                defaultStatsObj.totalContract = dbs[0];
                defaultStatsObj.signedContract = dbs[1];
                defaultStatsObj.doneContract = dbs[2];
                defaultStatsObj.paidMoney = dbs[3];
                return defaultStatsObj;
            })
        });
    })

}