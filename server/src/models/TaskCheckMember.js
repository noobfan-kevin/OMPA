/**
 * Created by hk053 on 2016/5/6.
 */
var sequelize = require('../core/db').conn;
var Sequelize = require('sequelize');

module.exports =  TaskCheckMember = sequelize.define('TaskCheckMember', {
        id: {
            type: Sequelize.STRING,
            defaultValue: Sequelize.UUIDV1,
            primaryKey: true,
            field: 'pk_tcm_id',
            comment: '主键'
        },
        versionId: {
            type: Sequelize.STRING,
            references:{
                model: 't_taskversioninfo',
                key: 'pk_tvi_id'
            },
            field: 'f_tcm_versionid',
            comment: '版本编号',
            onDelete: 'CASCADE'
        },
       progressId:{
           type: Sequelize.STRING,
           references:{
               model: 't_progressinfo',
               key: 'pk_pi_id'
           },
           field: 'f_tcm_progressid',
           comment: '进程编号',
           onDelete: 'CASCADE'
       },
        userId: {
            type: Sequelize.STRING,
            allowNull: false,
            references:{
                model: 't_userinfo',
                key: 'pk_ui_id'
            },
            field: 'f_tcm_checkid',
            comment: '审核人编号'
        },
      checkFlag:{
          type: Sequelize.INTEGER,
          field: 'pk_tcm_checkflag',
          comment: '审核人顺序'
      },
      checkType:{
          type: Sequelize.INTEGER,
          field: 'pk_tcm_checktype',
          comment: '审核人是否审核过当前进程，0：审核不通过，1：待审核，2：审核通过'
      },
     curCheck:{
         type: Sequelize.STRING,
         field: 'pk_tcm_curcheck',
         comment: '审核人是否审核过'
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
        tableName:'t_taskcheckmemberinfo',
        classMethods: {
            associate: function (models) {
                TaskCheckMember.belongsTo(models.User, {foreignKey: 'f_tcm_checkid'});
                TaskCheckMember.belongsTo(models.TaskVersion, {foreignKey: 'f_tcm_versionid',onDelete: 'CASCADE'});
                TaskCheckMember.belongsTo(models.Progress, {foreignKey: 'f_tcm_progressid',onDelete: 'CASCADE'});
            }
        },
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);