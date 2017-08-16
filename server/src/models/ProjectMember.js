/**
 * Created by YanJixian on 2015/11/12.
 */

var sequelize = require('../core/db').conn;
var Sequelize = require('sequelize');

module.exports =  ProjectMember = sequelize.define('ProjectMember', {
    id: {
        type: Sequelize.STRING,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true,
        field: 'pk_pm_id',
        comment: '主键'
    },
    role: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'f_pm_role',
        comment: '用户职位：0普通成员，1项目负责人，2任务卡负责人，3合同负责人 ，4 支付负责人'
    },
    userId: {
        type: Sequelize.STRING,
        allowNull: true,
        references:{
            model: 't_userinfo',
            key: 'pk_ui_id',
            constraints:false
        },
        field: 'f_pm_userid',
        comment: '用户编号'
    },
    projectId: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: true,
        field: 'f_pm_prjid',
        comment: '项目编号'
    },
    moduleId:{
        type: Sequelize.STRING,
        unique: false,
        allowNull: true,
        field: 'f_pm_module_id',
        comment: '步骤编号'
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
        tableName: 't_projectmemberinfo',
        classMethods: {
            associate: function (models) {
                ProjectMember.belongsTo(models.User, {foreignKey: 'f_pm_userid'});
                ProjectMember.belongsTo(models.Project, {foreignKey: 'f_pm_prjid'});
                ProjectMember.belongsTo(models.StepInfo, {foreignKey: 'f_pm_module_id'});
            }
        },
        scopes: {
            inCharge: function() {
                return  {
                    where: {
                        role: {
                            $in: [2, 3, 4]
                        }
                    }
                }
            }
        },
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }

);


