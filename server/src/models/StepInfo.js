/**
 * Created by hk053 on 2016/3/28.
 */


var sequelize = require('../core/db').conn;
var Sequelize = require('sequelize');

module.exports =  StepInfo = sequelize.define('StepInfo', {
        id: {
            type: Sequelize.STRING,
            defaultValue: Sequelize.UUIDV1,
            primaryKey: true,
            field: 'pk_si_id',
            comment: '主键'
        },
        name: {
            type: Sequelize.STRING,
            allowNull: true,
            field: 'f_si_name',
            comment: '步骤名称'
        },
        //progress:{
        //    type: Sequelize.INTEGER,
        //    allowNull: true,
        //    field: 'f_si_progress',
        //    comment: '节点进度'
        //},
        belong: {
            type: Sequelize.INTEGER,
            allowNull: true,
            field: 'f_si_belong',
            comment: '资产步骤：2；镜头步骤：1'
        },
        creatorId: {
            type: Sequelize.STRING,
            references:{
                model: 't_userinfo',
                key: 'pk_ui_id'
            },
            field: 'f_si_creatorid',
            comment: '创建人编号'
        },
        projectId: {
            type: Sequelize.STRING,
            references:{
                model: 't_projectinfo',
                key: 'pk_pi_id'
            },
            field: 'f_si_prjid',
            comment: '所属项目ID'
        },
        fatherId:{
            type: Sequelize.STRING,
            references:{
                model: 't_stepinfo',
                key: 'pk_si_id'
            },
            field: 'f_si_fatherid',
            comment: '父级模块ID'
        },
        lft: {
            type: Sequelize.INTEGER,
            field: 'f_si_left',
            comment: '树结构辅助计算'
        },
        rgt: {
            type: Sequelize.INTEGER,
            field: 'f_si_right',
            comment: '树结构辅助计算'
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
        tableName:'t_stepinfo',
        classMethods: {
            associate: function(models) {
                StepInfo.belongsTo(models.User, {foreignKey: 'f_si_creatorid'});
                StepInfo.belongsTo(models.Project, {foreignKey: 'f_si_prjid'});
                StepInfo.belongsTo(models.AssetsInfo, {foreignKey: 'f_si_belongassetsid'});
                StepInfo.belongsTo(models.SceneInfo, {foreignKey: 'f_si_belongsceneid'});
                StepInfo.belongsTo(models.StepInfo, {foreignKey: 'f_si_fatherid',as: 'father'});
                models.StepChildren = StepInfo.hasMany(StepInfo,{foreignKey: 'f_si_fatherid', as: 'children'});
                StepInfo.hasMany(models.Task, {foreignKey: 'f_ti_moduleid'});
                StepInfo.hasMany(models.ProjectMember, {foreignKey: 'f_pm_module_id'});
                StepInfo.belongsToMany(models.Statistics, {through: models.StatisticsNode, foreignKey: 'f_sni_nodeid'})
            }
        },
        scopes: {
            root: function() {
                return  { where: { fatherId: null } }
            }
        },
        createdAt: 'created_at',
        updatedAt: 'updated_at'

    }
);