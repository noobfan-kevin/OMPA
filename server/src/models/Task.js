/**
 * Created by YanJixian on 2015/11/12.
 */

var sequelize = require('../core/db').conn;
var Sequelize = require('sequelize');

  module.exports  = Task = sequelize.define('Task', {
    id: {
        type: Sequelize.STRING,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true,
        field: 'pk_ti_id',
        comment: '主键'
    },
    projectId:{
        type: Sequelize.STRING,
        references:{
            model: 't_projectinfo',
            key: 'pk_pi_id'
        },
        field: 'f_ti_projectid',
        comment: '所属项目ID',
        onDelete: 'CASCADE'
    },
    moduleId:{
        type: Sequelize.STRING,
        references:{
            model: 't_stepinfo',
            key: 'pk_si_id'
        },
        field: 'f_ti_moduleid',
        comment: '所属步骤ID'
    },
    associatedAssetId:{
        type: Sequelize.STRING,
        references:{
            model: 't_assetsinfo',
            key: 'pk_ai_id'
        },
        field: 'f_ti_associatedassetid',
        comment: '关联资产'
    },
    associatedShotId:{
        type: Sequelize.STRING,
        references:{
            model: 't_scene',
            key: 'pk_s_id'
        },
        field: 'f_ti_associatedshotid',
        comment: '关联镜头'
    },
    //associatedSceneId:{
    //    type: Sequelize.STRING,
    //    references:{
    //        model: 't_sceneinfo',
    //        key: 'pk_si_id'
    //    },
    //    field: 'f_ti_associatedsceneid',
    //    comment: '关联场或集'
    //},
    associatedType:{
        type: Sequelize.INTEGER,
        field: 'f_ti_associatedtype',
        comment: '关联类型，1：镜头，2：资产'
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
        tableName:'t_taskinfo',
        classMethods: {
            associate: function(models) {
                Task.belongsTo(models.User, {foreignKey: 'f_ti_creatorid',as:'creator'});
                Task.hasMany(models.TaskVersion, {foreignKey: 'f_tvi_taskid', onDelete:'CASCADE'});
                Task.belongsTo(models.Project,{foreignKey:'f_ti_projectid',onDelete:'CASCADE'})
                Task.belongsTo(models.AssetsInfo,{foreignKey:'f_ti_associatedassetid'});//关联资产
                Task.belongsTo(models.Scene,{foreignKey:'f_ti_associatedshotid'});//关联镜头
                Task.belongsTo(models.StepInfo,{foreignKey:'f_ti_moduleid'});//关联步骤
                //Task.belongsTo(models.SceneInfo,{foreignKey:'f_ti_associatedsceneid'});//关联场集
            }
        },
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);