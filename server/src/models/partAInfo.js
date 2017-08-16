/**
 * Created by hk60 on 2016/6/2.
 */
var sequelize = require('../core/db').conn;
var Sequelize = require('sequelize');

module.exports =  partAInfo = sequelize.define('partAInfo', {
        id: {
            type: Sequelize.STRING,
            defaultValue: Sequelize.UUIDV1,
            primaryKey: true,
            field: 'pk_pai_id',
            comment: '主键'
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            field: 'f_pai_name',
            comment: '甲方名称'
        },
        phone: {
            type: Sequelize.STRING,
            allowNull: false,
            field: 'f_pai_phone',
            comment: '甲方电话'
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            field: 'f_pai_email',
            comment: '甲方邮箱'
        },
        location: {
            type: Sequelize.STRING,
            allowNull: false,
            field: 'f_pai_location',
            comment: '甲方地址'
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
        tableName:'t_partainfo',
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);