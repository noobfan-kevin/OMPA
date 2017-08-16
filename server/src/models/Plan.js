/**
 * Created by wangziwei on 2015/11/13.
 */

var sequelize = require('../core/db').conn;
var Sequelize = require('sequelize');

module.exports =  Plan = sequelize.define('Plan', {
    id: {
        type: Sequelize.STRING,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true,
        field: 'pk_pi_id',
        comment: '编号'
    },
    creatorId:{
        type:Sequelize.STRING,
        references:{
            model: 't_userinfo',
            key: 'pk_ui_id'
        },
        field: 'f_pi_creatorid',
        comment: '创建人id'
    },
    taskVersionId: {
        type: Sequelize.STRING,
        allowNull: false,
        references:{
            // 这是别的模型的引用
            model: 't_taskversioninfo',
            // 引用的模型的列名
            key: 'pk_tvi_id'
        },
        field: 'f_pi_taskversionid',
        comment: '任务卡版本编号',
        //onDelete: 'CASCADE',
    },
    content: {
        type: Sequelize.TEXT,
        field: 'f_pi_content',
        comment: '方案内容'
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
},{
    tableName:'t_planinfo',
    classMethods: {
        associate: function(models) {
            Plan.belongsTo(models.TaskVersion, {foreignKey: 'f_pi_taskversionid'/*,onDelete: 'CASCADE',hooks: true*/});
            Plan.belongsTo(models.User,{foreignKey: 'f_pi_creatorid'});
        }
    },
    hooks: {
        beforeDestroy: function(dbPlan) {
            deleteFileByPlan(dbPlan);
        },
        beforeBulkDestroy: function(options) {
            return Plan.all({where:options.where}).then(function(dbPlan) {
                deleteFileByPlan(dbPlan);
            })
        }
    },
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});


function deleteFileByPlan(dbPlan) {
    var aPlanIds = [];

    if(!dbPlan) return [];

    if(Array.isArray(dbPlan)){
        dbPlan.forEach(function(v) {
            aPlanIds.push(v.getDataValue('id'))
        })
    }else{
        aPlanIds.push(dbPlan.getDataValue('id'));
    }
    deletePlanFiles(aPlanIds);
}

// 根据任务版本id删除方案文件
function deletePlanFiles(aTaskVersionId) {
    var File = process.core.db.models.File;
    File.destroy({
        where: {
            sourceTable: Plan.getTableName(),
            sourceKey: {
                $in: aTaskVersionId
            }
        }
    })
}
