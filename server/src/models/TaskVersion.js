/**
 * Created by YanJixian on 2015/11/12.
 */

var sequelize = require('../core/db').conn;
var Sequelize = require('sequelize');

module.exports =  TaskVersion = sequelize.define('TaskVersion', {
    id: {
        type: Sequelize.STRING,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true,
        field: 'pk_tvi_id',
        comment: '主键'
    },
    //name: {
    //    type: Sequelize.STRING,
    //    allowNull: false,
    //    field: 'f_tvi_name',
    //    comment: '版本名称'
    //},
    name:{
        type: Sequelize.STRING,
        field: 'f_tvi_name',
        comment: '任务名称'
    },
    version: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'f_tvi_version',
        comment: '版本号'
    },
    currentStatus:{
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue:'false',
        field: 'f_tvi_currentstatus',
        comment: 'true:当前版本,false：不是当前版本'
    },
    status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'f_tvi_status',
        defaultValue:0,
        //comment: '接收状态，0：未发送；1:已发送；2:接收；3:拒绝, 4:停止,5:已提交'
        comment: '-1：已退回，0：待制卡；1:未派发；2:制作中；3:审核中,4:审核完成,5:已完成'
    },
    readStatus: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue:'false',
        field: 'f_tvi_readstatus',
        comment: '是否已读，true：已读，false：未读'
    },
    taskId: {
        type: Sequelize.STRING,
        allowNull: false,
        references:{
            model: 't_taskinfo',
            key: 'pk_ti_id'
        },
        field: 'f_tvi_taskid',
        comment: '所属任务编号',
        onDelete: 'CASCADE'
    },
    startDate: {
        type: Sequelize.DATE,
        field: 'f_tvi_startdate',
        comment: '开始时间'
    },
    planDate: {
        type: Sequelize.DATE,
        field: 'f_tvi_plandate',
        comment: '预期时间'
        },
    endDate: {
        type: Sequelize.DATE,
        field: 'f_tvi_enddate',
        comment: '结束时间'
    },
    workDays:{
        type:Sequelize.INTEGER,
        field:'f_tvi_workdays',
        comment:'任务卡工作日'
    },
    creatorId:{
        type:Sequelize.STRING,
        references:{
            model: 't_userinfo',
            key: 'pk_ui_id'
        },
        field: 'f_tvi_creatorid',
        comment: '创建人编号'
    },
    productorId:{
        type:Sequelize.STRING,
        references:{
            model: 't_userinfo',
            key: 'pk_ui_id'
        },
        field: 'f_tvi_productorid',
        comment: '制作人编号'
     },
    senderId: {
        type: Sequelize.STRING,
        references:{
            model: 't_userinfo',
            key: 'pk_ui_id'
        },
        field: 'f_tvi_senderid',
        comment: '发送人编号'
    },
    completeProgress:{
        type: Sequelize.STRING ,
        defaultValue: 0,
        field: 'f_tvi_completeprogress',
        comment: '任务卡完成进度'
    },
    //senderName: {
    //    type: Sequelize.STRING,
    //    field: 'f_tvi_sendername',
    //    comment: '发送人姓名'
    //},
    //receiverId: {
    //    type: Sequelize.STRING,
    //    references:{
    //        model: 't_userinfo',
    //        key: 'pk_ui_id'
    //    },
    //    field: 'f_tvi_receiverid',
    //    comment: '接收人编号'
    //},
    type: {
        type: Sequelize.INTEGER,
        field: 'f_tvi_type',
        comment: '任务卡类型，0：内部任务，1：外部任务'
    },
    priority: {
        type: Sequelize.STRING,
        field: 'f_tvi_priority',
        comment: '等级(优先级)A+，B+，C+，A-，B-，C-，A，B，C'
    },
    points: {
        type: Sequelize.INTEGER,
        field: 'f_tvi_points',
        comment: '积分'
    },
    reason:{
        type: Sequelize.STRING,
        field: 'f_tvi_reason',
        comment: '退回原因'
    },
    //remark: {
    //    type: Sequelize.ARRAY(Sequelize.TEXT),
    //    field: 'f_tvi_remark',
    //    comment: '备注'
    //},
    //index: {
    //    type: Sequelize.STRING,
    //    field: 'f_tvi_index',
    //    comment: '表格中的位置，row、col'
    //},
    //progress: {
    //    type: Sequelize.ARRAY(Sequelize.JSON),
    //    field: 'f_tvi_progress',
    //    comment: '最后三进程状态'
    //},
    //projectId: {
    //    type: Sequelize.STRING,
    //    allowNull: true,
    //    field: 'f_tvi_prjid',
    //    comment: '项目编号'
    //},
    //progressDoneNum: {
    //    type: Sequelize.INTEGER,
    //    defaultValue: 0,
    //    allowNull: false,
    //    field: 'f_tvi_progressdonenum',
    //    comment: '进程表完成的个数'
    //},
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
        tableName:'t_taskversioninfo',
        classMethods: {
            associate: function(models) {
                models.Version=TaskVersion.belongsTo(models.Task, {foreignKey: 'f_tvi_taskid',onDelete:'CASCADE'});
                models.creator=TaskVersion.belongsTo(models.User, {foreignKey: 'f_tvi_creatorid', as: 'creator'});
                models.productor=TaskVersion.belongsTo(models.User, {foreignKey: 'f_tvi_productorid', as: 'productor'});
                models.sender=TaskVersion.belongsTo(models.User, {foreignKey: 'f_tvi_senderid', as: 'sender'});
                //TaskVersion.belongsToMany(models.User,  {through: models.TaskCheckMember, foreignKey: 'pk_tvi_id'});
                TaskVersion.hasMany(models.TaskCheckMember,{foreignKey:'f_tcm_versionid'});
                TaskVersion.hasMany(models.Progress, {foreignKey: 'f_pi_taskversionid',onDelete: 'CASCADE'});
                TaskVersion.hasOne(models.Plan, {foreignKey: 'f_pi_taskversionid',/*onDelete: 'cascade'*/});
                TaskVersion.hasOne(models.Contract,{foreignKey:'f_ct_taskcardversionid'});
            }
        },
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);