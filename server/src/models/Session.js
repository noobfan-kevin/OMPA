/**
 * Created by wangziwei on 2015/11/12.
 */

var sequelize = require('../core/db').conn;
var Sequelize = require('sequelize');

module.exports =  Session = sequelize.define('Session', {
        id: {
            type: Sequelize.STRING,
            defaultValue: Sequelize.UUIDV1,
            primaryKey: true,
            field: 'pk_si_id',
            comment: '主键'
        },
        key:{
            type: Sequelize.STRING,
            field: 'f_si_key',
            comment: 'sid'
        },
        value:{
            type: Sequelize.TEXT,
            field: 'f_si_value',
            comment: '创建时间'
        },
        maxAge:{
            type: Sequelize.TEXT,
            field: 'f_si_maxage',
            comment: '有效期'
        },
        createTime:{
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
            field: 'created_at',
            comment: '创建时间'
        }
    },
    {
        tableName:'t_sessioninfo',
        classMethods: {
        },
        timestamps: false
    });
