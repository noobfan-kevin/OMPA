/**
 * Created by hk60 on 2016/6/2.
 */

var sequelize = require('../core/db').conn;
var Sequelize = require('sequelize');

module.exports = Voucher = sequelize.define('Voucher', {
        id: {
            type: Sequelize.STRING,
            defaultValue: Sequelize.UUIDV1,
            primaryKey: true,
            field: 'pk_vi_id',
            comment: '主键'
        },
        contractId:{
            type: Sequelize.STRING,
            allowNull: false,
            field: 'f_vi_contractid',
            comment: '所属合同Id'
        },
        step: {
            type: Sequelize.INTEGER,
            allowNull: false,
            field: 'f_vi_step',
            comment: '所属支付阶段'
        },
        payType: {
            type: Sequelize.STRING,
            allowNull: false,
            field: 'f_vi_paytype',
            comment: '付款方式'
        },
        paidTime: {
            type: Sequelize.STRING,
            allowNull: false,
            field: 'f_vi_paidtime',
            comment: '付款时间'
        },
        money: {
            type: Sequelize.STRING,
            allowNull: false,
            field: 'f_vi_money',
            comment: '付款金额'
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
        tableName:'t_voucherinfo',
        classMethods: {
            associate: function(models) {
                //Voucher.hasMany(models.File, {foreignKey: 'f_vi_fileid', onDelete: 'CASCADE'})
            }
        },
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);