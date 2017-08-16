/**
 * Created by hk61 on 2016/7/4.
 */

var sequelize = require('../core/db').conn;
var Sequelize = require('sequelize');

module.exports = Statistics = sequelize.define('Statistics', {
        id: {
            type: Sequelize.STRING,
            defaultValue: Sequelize.UUIDV1,
            primaryKey: true,
            field: 'pk_si_id',
            comment: '主键'
        },
        projectId: {
            type: Sequelize.STRING,
            allowNull: false,
            field: 'pk_si_projectid',
            comment: '所属项目id'
        },
        creatorId: {
            type: Sequelize.STRING,
            allowNull: false,
            field: 'pk_si_userid',
            comment: '创建人id'
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            field: 'f_si_name',
            comment: '记录名'
        },
        startTime:{
            type: Sequelize.DATE,
            allowNull: true,
            field: 'f_si_starttime',
            comment: '选择时间段-开始'
        },
        endTime: {
            type: Sequelize.DATE,
            allowNull: true,
            field: 'f_si_endtime',
            comment: '选择时间段-结束'
        },
        createdAt:{
            type: Sequelize.DATE,
            field: 'created_at',
            comment: '创建时间'
        },
        updatedAt:{
            type: Sequelize.DATE,
            field: 'updated_at',
            comment: '创建时间'
        }
    },
    {
        tableName:'t_statisticsinfo',
        classMethods: {
            associate: function(models) {
                Statistics.belongsToMany(models.StepInfo, {through: models.StatisticsNode, foreignKey: 'f_sni_statisticsid'})
            }
        },
        comment: '统计表，和步骤表（t_stepinfo)多对多关联，用于项目下统计部分' ,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);