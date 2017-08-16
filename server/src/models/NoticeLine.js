/**
 * Created by hk053 on 2016/7/19.
 */

var sequelize = require('../core/db').conn;
var Sequelize = require('sequelize');

module.exports  = NoticeLine = sequelize.define('NoticeLine', {
        id: {
            type: Sequelize.STRING,
            defaultValue: Sequelize.UUIDV1,
            primaryKey: true,
            field: 'pk_nli_id',
            comment: '主键'
        },
        noticeId:{
            type: Sequelize.STRING,
            references:{
                model: 't_noticeinfo',
                key: 'pk_ni_id'
            },
            field: 'f_nli_noticeid',
            comment: '通知Id'
        },
        departmentId:{
            type: Sequelize.STRING,
            references:{
                model: 't_departmentinfo',
                key: 'pk_di_id'
            },
            field: 'f_nli_departmentid',
            comment: '接收通知的部门Id'
        },
        fileId:{
            type: Sequelize.STRING,
            references:{
                model: 't_fileinfo',
                key: 'pk_fi_id'
            },
            field: 'f_nli_fileid',
            comment: '通知文件Id'
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
        tableName:'t_noticelineinfo',
        classMethods: {
            associate: function(models) {
                NoticeLine.belongsTo(models.Department,{foreignKey:'f_nli_departmentid',onDelete:'SET NULL'});
                NoticeLine.belongsTo(models.Notice,{foreignKey:'f_nli_noticeid'});
                NoticeLine.belongsTo(models.File, {foreignKey: 'f_nli_fileid'});
            }
        },
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);