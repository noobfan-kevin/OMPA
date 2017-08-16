/**
 * Created by HK059 on 2016/6/1.
 */
var sequelize = require('../core/db').conn;
var Sequelize = require('sequelize');

module.exports =  FileType = sequelize.define('FileType', {
        id: {
            type: Sequelize.STRING,
            defaultValue: Sequelize.UUIDV1,
            primaryKey: true,
            field: 'pk_ft_id',
            comment: '主键'
        },
        name: {
            type: Sequelize.STRING,
            field: 'f_ft_name',
            comment: '文件类型名称'
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
        tableName:'t_filetype',
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);