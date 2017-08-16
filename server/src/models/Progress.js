/**
 * Created by wangziwei on 2015/11/13.
 */

var sequelize = require('../core/db').conn;
var Sequelize = require('sequelize');
var utils = require('../core/utils');

module.exports = Progress = sequelize.define('Progress', {
    id: {
        type: Sequelize.STRING,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true,
        field: 'pk_pi_id',
        comment: '编号'
    },
    name: {
        type: Sequelize.STRING,
        field: 'f_pi_name',
        comment: '进程名称'
    },
    //index: {
    //    type: Sequelize.INTEGER,
    //    field: 'f_pi_index',
    //    comment: '进程显示序号'
    //},
    step: {
        type: Sequelize.STRING,
        field: 'f_pi_step',
        comment: '制作步骤',
    },
    //progress: {
    //    type: Sequelize.FLOAT,
    //    field: 'f_pi_progress',
    //    comment: '进度'
    //},
    percent: {
        type: Sequelize.STRING,
        field: 'f_pi_percent',
        comment: '百分比'
    },
    startDate: {
        type: Sequelize.DATE,
        field: 'f_pi_startdate',
        comment: '开始时间'
    },
    predictDate: {
        type: Sequelize.DATE,
        field: 'f_pi_predictdate',
        comment: '预期时间'
    },
    completeDate: {
        type: Sequelize.DATE,
        field: 'f_pi_completedate',
        comment: '完成时间'
    },
    creatorId: {
        type: Sequelize.STRING,
        allowNull: false,
        references:{
            model: 't_userinfo',
            key: 'pk_ui_id'
        },
        field: 'f_pi_creatorid',
        comment: '创建人编号'
    },
    //auditors: {
    //    type: Sequelize.ARRAY(Sequelize.JSON),
    //    field: 'f_pi_auditors',
    //    comment: '审核人[{id：审核人编号;name：审核人姓名;idea：审核人意见;isAudit：是否审核}]'
    //},
    producerId: {
        type: Sequelize.STRING,
        allowNull: true,
        references:{
            model: 't_userinfo',
            key: 'pk_ui_id'
        },
        field: 'f_pi_producerid',
        comment: '制作人'
    },
    //remark: {
    //    type: Sequelize.TEXT,
    //    defaultValue: "",
    //    field: 'f_pi_remark',
    //    comment: '备注'
    //},
    taskVersionId: {
        type: Sequelize.STRING,
        allowNull: false,
        references:{
            // 这是别的模型的引用
            model: 't_taskversioninfo',
            // 引用的模型的列名
            key: 'pk_tvi_id'
        },
        field: 'f_pi_taskversionid',
        comment: '任务卡版本号',
        onDelete: 'CASCADE'
    },
    status: {
        type: Sequelize.INTEGER,
        field: 'f_pi_status',
        defaultValue: 0,
        comment: '进程审核状态，0：未审核完，1：审核完成'
    },
    curProgress:{
        type: Sequelize.STRING,
        field: 'f_pi_curprogress',
        comment: 'true:当前进程,false:非当前进程'
    },
    //readStatus: {
    //    type: Sequelize.STRING,
    //    allowNull: false,
    //    defaultValue:'false',
    //    field: 'f_pi_readstatus',
    //    comment: '是否已读，true：已读，false：未读'
    //},
    //dirPathId: {
    //    type: Sequelize.STRING,
    //    field: 'f_pi_dirpathid',
    //    comment: '文件夹路径编号'
    //},
    //dirPathName: {
    //    type: Sequelize.STRING,
    //    field: 'f_pi_dirpathname'
    //},
    projectId: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'f_pi_projid',
        comment: '所属项目ID',
        onDelete: 'CASCADE'
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
},{
    tableName:'t_progressinfo',
    classMethods: {
        associate: function(models) {
            models.Creator = Progress.belongsTo(models.User, {foreignKey: 'f_pi_creatorid', as: 'creator'});
            models.Producer = Progress.belongsTo(models.User, {foreignKey: 'f_pi_producerid', as: 'producer'});
           // Plan.belongsTo(models.TaskVersion, {foreignKey: 'f_pi_taskversionid',onDelete: 'CASCADE'});
            Progress.belongsTo(models.TaskVersion, {foreignKey: 'f_pi_taskversionid',onDelete: 'CASCADE'});
            Progress.hasMany(models.ReviewComment,{foreignKey:'f_rci_progressid',onDelete: 'CASCADE'});
            Progress.hasMany(models.TaskCheckMember,{foreignKey:'f_tcm_progressid'});
            //Progress.hasMany(models.File, {foreignKey: 'f_pi_dirpathid', as: 'dirPath',constraints: false});
           // Progress.hasOne(models.Credit,  {foreignKey: 'f_cd_prgid'});
        }
    },
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});
