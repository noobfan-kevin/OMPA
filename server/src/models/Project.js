/**
 * Created by YanJixian on 2015/11/12.
 */

var sequelize = require('../core/db').conn;
var Sequelize = require('sequelize');

module.exports =  Project = sequelize.define('Project', {
    id: {
        type: Sequelize.STRING,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true,
        field: 'pk_pi_id',
        comment: '主键'
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'f_pi_name',
        comment: '项目名称'
    },
    schedule:{
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'f_pi_schedule',
        defaultValue: 0,
        comment: '项目进度'
    },
    status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'f_pi_status',
        defaultValue: 0,
        comment: '项目状态,0：进行；1：结束;2:关闭'
    },
    startDate: {
        type: Sequelize.DATE,
        field: 'f_pi_startdate',
        comment: '开始时间'
    },
    endDate: {
        type: Sequelize.DATE,
        field: 'f_pi_enddate',
        comment: '结束时间'
    },
    creatorId: {
        type: Sequelize.STRING,
        references:{
            model: 't_userinfo',
            key: 'pk_ui_id'
        },
        field: 'f_pi_creatorid',
        comment: '创建人编号'
    },
    unicode:{
        type: Sequelize.STRING,
        allowNull: false,
        field: 'f_pi_unicode',
        comment: '项目编码'
    },
    desc:{
        type: Sequelize.TEXT,
        allowNull: false,
        field: 'f_pi_desc',
        comment: '项目描述'
    },
    projectImg:{
        type: Sequelize.TEXT,
        field: 'f_pi_projectimg',
        defaultValue: 'defaultProjectThumbnail.png',
        comment: '项目头像'
    },
    company:{
        type: Sequelize.STRING,
        field: 'f_pi_company',
        comment: '投资公司'
    },
    invest:{
        type: Sequelize.INTEGER,
        field: 'f_pi_invest',
        comment: '投资金额'
    },
    directorName:{
        type: Sequelize.STRING,
        field: 'f_pi_directorname',
        comment: '导演名字'
    },
    writerName:{
        type: Sequelize.STRING,
        field: 'f_pi_writername',
        comment: '编剧名字'
    },
    productorName:{
        type: Sequelize.STRING,
        field: 'f_pi_productorname',
        comment: '制片名字'
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
        tableName:'t_projectinfo',
        classMethods: {
            associate: function(models) {
                Project.belongsTo(models.User, {foreignKey: 'f_pi_creatorid',as:'creator'});
                Project.hasMany(models.StepInfo, {foreignKey: 'f_si_prjid'});
                //Project.hasMany(models.Chat, {foreignKey: 'f_ci_prjid'});
                //Project.hasMany(models.File, {foreignKey: 'f_fi_prjid'});
                //Project.hasMany(models.Inform, {foreignKey: 'f_ii_prjid'});
                Project.hasMany(models.Task, {foreignKey: 'f_ti_projectid'});
                Project.belongsToMany(models.User,  {through: models.ProjectMember, foreignKey: 'f_pm_prjid'});
                Project.hasMany(models.ProjectMember,  { foreignKey: 'f_pm_prjid'});
            }
        },
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);