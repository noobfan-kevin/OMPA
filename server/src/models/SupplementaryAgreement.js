/**
 * Created by hk60 on 2016/6/2.
 */

var sequelize = require('../core/db').conn;
var Sequelize = require('sequelize');

module.exports =  SupplementaryAgreement = sequelize.define('SupplementaryAgreement', {
        id: {
            type: Sequelize.STRING,
            defaultValue: Sequelize.UUIDV1,
            primaryKey: true,
            field: 'pk_sa_id',
            comment: '主键'
        },
        contractId:{
            type: Sequelize.STRING,
            allowNull: false,
            field: 'f_sa_contractid',
            comment: '所属合同Id'
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false,
            field: 'f_sa_title',
            comment: '协议名称'
        },
        reason: {
            type: Sequelize.STRING,
            allowNull: false,
            field: 'f_sa_reason',
            comment: '协议原因'
        },
        content: {
            type: Sequelize.STRING,
            allowNull: false,
            field: 'f_sa_content',
            comment: '协议内容'
        },
        partATime: {
            type: Sequelize.STRING,
            allowNull: true,
            field: 'f_sa_partatime',
            comment: '甲方时间'
        },
        partBTime: {
            type: Sequelize.STRING,
            allowNull: true,
            field: 'f_sa_partbtime',
            comment: '乙方时间'
        },
        createdAt:{
            type: Sequelize.DATE,
            field: 'created_at',
            comment: '创建时间'
        },
        updatedAt:{
            type: Sequelize.DATE,
            field: 'updated_at',
            comment: '修改时间'
        }
    },
    {
        tableName:'t_supagreementinfo',
        classMethods: {
            associate: function(models) {
                //Contract.hasMany(models.Task, {foreignKey: 'f_ai_creatorid'});
                SupplementaryAgreement.belongsTo(models.Contract, {foreignKey: 'f_sa_contractid', onDelete: 'CASCADE'})
            }
        },
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);