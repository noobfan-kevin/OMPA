/**
 * Created by hk053 on 2016/3/28.
 */

var sequelize = require('../core/db').conn;
var Sequelize = require('sequelize');

module.exports =  AssetsType = sequelize.define('AssetsType', {
    id: {
        type: Sequelize.STRING,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true,
        field: 'pk_at_id',
        comment: '主键'
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'f_at_name',
        comment: '资产类型名称'
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
        tableName:'t_assetstype',
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);