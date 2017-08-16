/**
 * Created by hk60 on 2016/6/2.
 */

var sequelize = require('../core/db').conn;
var Sequelize = require('sequelize');

module.exports =  Contract = sequelize.define('Contract', {
        id: {
            type: Sequelize.STRING,
            defaultValue: Sequelize.UUIDV1,
            primaryKey: true,
            field: 'pk_ct_id',
            comment: '主键'
        },
        taskCardVersionId:{
            type: Sequelize.STRING,
            allowNull: false,
            references:{
                model: 't_taskversioninfo',
                key: 'pk_tvi_id'
            },
            field: 'f_ct_taskcardversionid',
            comment: '任务卡ID'
        },
        contractLeaderId:{
            type: Sequelize.STRING,
            allowNull: false,
            field: 'f_ct_contractleaderid',
            comment: '合同所在节点的合同负责人ID'
        },
        taskCardName: {
            type: Sequelize.STRING,
            allowNull: false,
            field: 'f_ct_taskcardname',
            comment: '任务卡名称'
        },
        taskCardType: {
            type: Sequelize.STRING,
            allowNull: false,
            field: 'f_ct_taskcardtype',
            comment: '合同类型'
        },
        taskCardStartTime: {
            type: Sequelize.STRING,
            allowNull: false,
            field: 'f_ct_taskcardstarttime',
            comment: '任务卡开始时间'
        },
        taskCardEndTime: {
            type: Sequelize.STRING,
            allowNull: false,
            field: 'f_ct_taskcardendtime',
            comment: '任务卡结束时间'
        },
        contractName: {
            type: Sequelize.STRING,
            allowNull: false,
            field: 'f_ct_contractname',
            comment: '合同名称'
        },
        contractCode: {
            type: Sequelize.STRING,
            allowNull: false,
            field: 'f_ct_contractcode',
            comment: '合同编号'
        },
        contractStatus: {
            type: Sequelize.INTEGER,
            allowNull: false,
            field: 'f_ct_contractstatus',
            comment: '合同状态:1.未发送2.已发送3.已退回4.进行中5.待支付7.已支付6.已完成8.已作废'
        },
        totalMoney: {
            type: Sequelize.STRING,
            allowNull: false,
            field: 'f_ct_totalmoney',
            comment: '合同金额'
        },
        payType: {
            type: Sequelize.STRING,
            allowNull: false,
            field: 'f_ct_paytype',
            comment: '支付方式'
        },
        partAName: {
            type: Sequelize.STRING,
            allowNull: false,
            field: 'f_ct_partaname',
            comment: '甲方名称'
        },
        partAPhone: {
            type: Sequelize.STRING,
            allowNull: false,
            field: 'f_ct_partaphone',
            comment: '甲方电话'
        },
        partAEmail: {
            type: Sequelize.STRING,
            allowNull: false,
            field: 'f_ct_partaemail',
            comment: '甲方邮箱'
        },
        partALocation: {
            type: Sequelize.STRING,
            allowNull: false,
            field: 'f_ct_partalocation',
            comment: '甲方地址'
        },
        partBId: {
            type: Sequelize.STRING,
            allowNull: false,
            field: 'f_ct_partbid',
            comment: '乙方id'
        },
        partBName: {
            type: Sequelize.STRING,
            allowNull: false,
            field: 'f_ct_partbname',
            comment: '乙方名称'
        },
        partBPhone: {
            type: Sequelize.STRING,
            allowNull: false,
            field: 'f_ct_partbphone',
            comment: '乙方电话'
        },
        partBEmail: {
            type: Sequelize.STRING,
            allowNull: false,
            field: 'f_ct_partbemail',
            comment: '乙方邮箱'
        },
        partBLocation: {
            type: Sequelize.STRING,
            allowNull: true,
            field: 'f_ct_partblocation',
            comment: '乙方地址'
        },
        partBUserCardId:{
            type: Sequelize.STRING,
            allowNull: true,
            field: 'f_ct_partbusercardid',
            comment: '乙方身份证号'
        },
        partBGatheringCountName: {
            type: Sequelize.STRING,
            allowNull: false,
            field: 'f_ct_partbgatheringcountname',
            comment: '乙方收款账户名'
        },
        partBGatheringCountNumber: {
            type: Sequelize.STRING,
            allowNull: false,
            field: 'f_ct_partbgatheringcountnumber',
            comment: '乙方收款账号'
        },
        paidStep: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 1,
            field: 'f_ct_paidstep',
            comment: '当前支付阶段'
        },
    //这个字段先不加了，需要时候再说
    //completeProgress:{
        //    type: Sequelize.STRING ,
        //    defaultValue: 0,
        //    field: 'f_ct_completeprogress',
        //    comment: '支付进度'
        //},
        paidMan: {
            type: Sequelize.STRING,
            allowNull: false,
            field: 'f_ct_paidman',
            comment: '支付负责人'
        },
        paidManId:{
            type: Sequelize.STRING,
            allowNull: false,
            field: 'f_ct_paidmanid',
            comment: '支付负责人ID'
        },
        creator: {
            type: Sequelize.STRING,
            allowNull: false,
            field: 'f_ct_creator',
            comment: '创建人'
        },
        creatorId: {
            type: Sequelize.STRING,
            allowNull: false,
            field: 'f_ct_creatorid',
            comment: '创建人ID'
        },
        projectId: {
            type: Sequelize.STRING,
            allowNull: false,
            field: 'f_ct_projectid',
            comment: '所属项目ID'
        },
        signTime: {
            type: Sequelize.STRING,
            allowNull: true,
            field: 'f_ct_signtime',
            comment: '合同签约时间'
        },
        read: {
            type: Sequelize.STRING,
            allowNull: true,
            field: 'f_ct_read',
            comment: '是否已读'
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
        tableName:'t_contractinfo',
        classMethods: {
            associate: function(models) {
                //Contract.hasOne(models.TaskVersion, {foreignKey: 'f_ct_taskcardid'});
                Contract.belongsTo(models.TaskVersion, {foreignKey: 'f_ct_taskcardversionid'});
                Contract.belongsTo(models.User, {foreignKey: 'f_ct_contractleaderid', as: 'contractLeader'});
            }
        },
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);