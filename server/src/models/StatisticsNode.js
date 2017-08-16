/**
 * Created by hk61 on 2016/7/4.
 */

var sequelize = require('../core/db').conn;
var Sequelize = require('sequelize');

module.exports = StatisticsNode = sequelize.define('StatisticsNode', {
        statisticsId: {
            type: Sequelize.STRING,
            allowNull: true,
            field: 'f_sni_statisticsid',
            references:{
                model: 't_statisticsinfo',
                key: 'pk_si_id',
                constraints:false
            },
            comment: '统计id'
        },
        nodeId:{
            type: Sequelize.STRING,
            allowNull: true,
            field: 'f_sni_nodeid',
            references:{
                model: 't_stepinfo',
                key: 'pk_si_id',
                constraints:false
            },
            comment: '节点id(stepInfo的id)'
        }
    },
    {
        tableName:'t_statisticsnodeinfo',
        comment: '统计表(t_statisticinfo)和步骤表（t_stepinfo)多对多关联中间表' ,
        timestamps: false
    }
);