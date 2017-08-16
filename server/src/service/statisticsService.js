/**
 * Created by hk61 on 2016/7/13.
 */

var Statistics = process.core.db.models.Statistics;
var StepInfo = process.core.db.models.StepInfo;
var statisticsUtils = require('../dbUtils/statisticsUtils');

var statisticsService = module.exports;

/*
* 获取节点实例
* */
statisticsService.getNodeInstances = function(nodeIds) {
    nodeIds = Array.isArray(nodeIds) ? nodeIds : [nodeIds];
    return StepInfo.all({
        where: {
            id :{
                $in: nodeIds
            }
        }
    }).then(function(dbNodes) {
        return nodeIds.length ? dbNodes : [];
    })
};


/*
* query查询
* */

statisticsService.query = function(query) {
    query.include = query.include || [{ model:StepInfo, attributes: ['id', 'name', 'fatherId'] }];
    query.order = query.order || [['updatedAt','DESC']];
    return Statistics.all(query);
};


/*
 * 新建
 * */
statisticsService.create = function(args) {
    var nodes = args.nodes;
    var promise1 = Statistics.create(args);
    var promise2 = statisticsService.getNodeInstances(nodes);

    return Promise.all([promise1, promise2]).then(function(db) {
        return db[0].addStepInfos(db[1]).then(function() {
            return db[0];
        });
    }).then(function(db) {
        var id = db.getDataValue('id');
        return statisticsService.query({where: {id: id}}).then(function(dbs) {
            return statisticsUtils.mountCountAsync(dbs)
        });
    })
};


/*
 * 删除
 * */
statisticsService.delete = function(query) {
    return Statistics.destroy(query)
};

/*
 * 通过id删除
 * */
statisticsService.deleteById = function(id) {
    return Statistics.destroy({
        where: {
            id: id
        }
    })
};


/*
 * 通过项目id删除
 * */
statisticsService.deleteByProjectId = function(projectId) {
    return Statistics.destroy({
        where: {
            projectId: projectId
        }
    })
};

/*
 * 修改
 * */
statisticsService.update = function(id, args) {
    var nodes = args.nodes;
    var promise1 = Statistics.findById(id).then(function(dbStats) {
        return dbStats.update(args);
    });
    var promise2 = statisticsService.getNodeInstances(nodes);

    return Promise.all([promise1, promise2]).then(function(db) {
        return db[0].setStepInfos(db[1]);
    }).then(function() {
        return statisticsService.query({where: {id: id}}).then(function(dbs) {
           return statisticsUtils.mountCountAsync(dbs)
        });
    });
};


/*
* 获取所有
* */
statisticsService.all = function(id) {
    return Statistics.all();
};


/*
 * 条件查询
 * */
statisticsService.all = function(query) {
    return Statistics.query(query);
};


/*
 * 根据项目id查询
 * */
statisticsService.getByProjectId = function(projectId) {
    return statisticsService.query({
        where: {
            projectId: projectId
        }
    })
};


/*
 * 根据项目id获取列表
 * */
statisticsService.getList = function(projectId) {
    return statisticsService.query({
        where: {
            projectId: projectId
        }
    }).then(function(dbs) {
        return statisticsUtils.mountCountAsync(dbs);
    })
};


/*
 * 根据id获取一个统计的详细
 * */
statisticsService.getDetailById = function(id) {
    return statisticsService.query({
        where: {
            id: id
        }
    }).then(function(dbs) {
        if(!dbs[0]) return {message: '没有找到！'};
        var db = dbs[0];
        return db.getStepInfos({
            attributes: ['id','name','fatherId'],
            order: [['lft']]
        }).then(function(dbNodes) {
            return statisticsUtils.mountCountForNodes(dbNodes).then(function(dbNodes) {
                db.setDataValue('StepInfos', dbNodes);
                return db;
            })
        });
    })
};



/*
 * 根据id获取其下的所有节点信息
 * */
statisticsService.getNodesById = function(id) {
    return Statistics.findById(id).then(function(db) {
        return db.getStepInfos({
            attributes: ['id','name','fatherId'],
            order: [['lft']]
        });
    })
};



/*
* 获取项目下所有节点
* */
statisticsService.getNodesByProjectId = function(projectId) {
    return StepInfo.all({
        where: { projectId: projectId },
        attributes: ['id','name', 'projectId', 'fatherId'],
        order: [['lft', 'DESC']]
    })
};

/*
 * 获取默认
 * */
statisticsService.getDefault = function(id) {

    var defaultStatistics = {
        name: '项目下所有',
        totalTask: null,
        doneTask: null,
        totalContract: null,
        doneContract: null,
        signedContract: null,
        paidMoney: null
    };

    return statisticsService.getNodesByProjectId(id).then(function(dbNodes) {
        var nodeIds;
        nodeIds = dbNodes.map(function(dbNode) {
            return dbNode.getDataValue('id');
        });
        return statisticsUtils.mountCountForDefaultAsync(defaultStatistics, nodeIds);
    });

};



