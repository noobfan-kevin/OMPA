/**
 * Created by hk054 on 2016/7/4.
 */
var sequelize = require('../core/db').conn;
var Sequelize = require('sequelize');

module.exports  = CreditsDetail = sequelize.define('CreditsDetail', {
        id: {
            type: Sequelize.STRING,
            defaultValue: Sequelize.UUIDV1,
            primaryKey: true,
            field: 'pk_cd_id',
            comment: '主键'
        },
        score: {
            type: Sequelize.STRING,
            allowNull: false,
            field: 'f_cd_scores',
            comment: '积分'

        },
        type: {
            type: Sequelize.INTEGER,
            field: 'f_cd_type',
            comment: '类型：（0:任务积分,暂时没用到）'
        },
        taskVersionId: {
            type: Sequelize.STRING,
            allowNull: false,
            /*references:{
                // 这是别的模型的引用
                model: 't_taskversioninfo',
                // 引用的模型的列名
                key: 'pk_tvi_id'
            },*/
            field: 'f_cd_taskversionid',
            comment: '任务卡版本Id',
        },
        taskVersionName: {
            type: Sequelize.STRING,
            allowNull: false,
            field: 'f_cd_taskversionname',
            comment: '任务卡名称',
        },
        taskVersion: {
            type: Sequelize.STRING,
            allowNull: false,
            field: 'f_cd_taskversion',
            comment: '版本号',
        },
        progressId:{
            type: Sequelize.STRING,
            allowNull: false,
            /*references:{
                model: 't_projectinfo',
                key: 'pk_pi_id'
            },*/
            field: 'f_cd_progressid',
            comment: '所属进程ID',
        },
        progressName:{
            type: Sequelize.STRING,
            allowNull: false,
            field: 'f_cd_progressname',
            comment: '所属进程名称',
        },
        userId: {
            type: Sequelize.STRING,
            allowNull: false,
            references:{
                model: 't_userinfo',
                key: 'pk_ui_id'
            },
            field: 'f_cd_userid',
            comment: '积分所属的人'
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
        tableName:'t_creditsdetail',
        classMethods: { //
            associate: function(models) {
                CreditsDetail.belongsTo(models.User, {foreignKey: 'f_cd_userid'})
                /*CreditsDetail.belongsTo(models.TaskVersion, {foreignKey: 'f_cd_taskversionid'/!*, onDelete:'CASCADE'*!/});
                CreditsDetail.belongsTo(models.Progress,{foreignKey:'f_cd_progressid'/!*,onDelete:'CASCADE'*!/}*/
            }
        },
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);