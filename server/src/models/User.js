/**
 * Created by wangziwei on 2015/11/12.
 */

var sequelize = require('../core/db').conn;
var Sequelize = require('sequelize');
var crypto = require('crypto');
var config = require('../config');

module.exports =  User = sequelize.define('User', {
    id: {
        type: Sequelize.STRING,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true,
        field: 'pk_ui_id',
        comment: '主键'
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        field: 'f_ui_username',
        comment: '登录用户名'
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
        set: function (value) {
            if (!value) {
                return  this.setDataValue('password', '');
            }

            if(config.dbConfig.importDB){
                this.setDataValue('password', value);
            }else{
                var hmac = crypto.createHmac('sha1', process.core.config.pwdKey);
                hmac.update(value);
                this.setDataValue('password', hmac.digest('hex'));
            }

        },
        field: 'f_ui_password',
        comment: '登录密码'
    },
    online: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue:0,
        field: 'f_ui_online',
        comment: '在线状态0:不在线1:在线;冻结：-1(假删除)'
    },
    label: {
        type: Sequelize.STRING,
        field: 'f_ui_label',
        comment: '个人签名'
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'f_ui_name',
        comment: '真实姓名'
    },
    image: {
        type: Sequelize.TEXT,
        field: 'f_ui_image',
        defaultValue: 'defaultAvatar.jpg',
        comment: '头像'
    },
    address: {
        type: Sequelize.STRING,
        field: 'f_ui_address',
        comment: '签约方/用户地址'
    },
    account: {
        type: Sequelize.STRING,
        field: 'f_ui_account',
        comment: '签约方/用户银行账户'
    },
    accountName:{
        type: Sequelize.STRING,
        field: 'f_ui_accountname',
        comment: '签约方/用户银行账户名称'
    },
    phone: {
        type: Sequelize.STRING,
        field: 'f_ui_phone',
        comment: '电话'
    },
    email: {
        type: Sequelize.STRING,
        field: 'f_ui_email',
        comment: '电子邮箱'
    },
    departmentId: {
        type: Sequelize.STRING,
        references:{
            // 这是别的模型的引用
            model: 't_departmentinfo',
            // 引用的模型的列名
            key: 'pk_di_id'
        },
        field: 'f_ui_departmentid',
        comment: '所属部门编号'
    },
    position: {
        type: Sequelize.STRING,
        field: 'f_ui_position',
        comment: '职位'
    },
    userCardId:{
        type: Sequelize.STRING,
        field: 'f_ui_usercardid',
        comment: '用户身份证号'
    },
    points: {
        type: Sequelize.STRING                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   ,
        allowNull: false,
        field: 'f_ui_points',
        defaultValue: 0,
        comment: '积分 默认为0，通过积分明细表中个明细相加得到'
    },
    roleId:{
        type: Sequelize.STRING,
        references:{
            // 这是别的模型的引用
            model: 't_roleinfo',
            // 引用的模型的列名
            key: 'pk_ri_id'
        },
        field: 'f_ui_roleid',
        comment: '所属角色编号'
    },
    userType:{
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue:0,
        field: 'f_ui_usertype',
        comment: '用户类型,0:内部个人；1：外部个人；2：外部企业'
    },
    companyName:{
        type: Sequelize.STRING,
        field: 'f_ui_companyname',
        comment: '签约方名称'
    },
    companyCode:{
        type: Sequelize.STRING,
        field: 'f_ui_unicode',
        comment: '签约方编码'
    },
    companyBank:{
        type: Sequelize.STRING,
        field: 'f_ui_bank',
        comment: '开户银行'
    },
    companyBankAddress:{
        type: Sequelize.STRING,
        field: 'f_ui_bankaddress',
        comment: '开户银行地址'
    },
    companyClass:{
        type: Sequelize.STRING,
        field: 'f_ui_level',
        comment: '签约方等级'
    },
    companyType:{
        type: Sequelize.STRING,
        field: 'f_ui_type',
        comment: '签约方类型'
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
        tableName:'t_userinfo',
        classMethods: {
        associate: function(models) {
            User.belongsTo(models.Role,  { foreignKey: 'f_ui_roleid'});
            User.belongsTo(models.Department, {foreignKey: 'f_ui_departmentid'});
            User.hasMany(models.Log, {foreignKey: 'f_li_userid'});
            User.hasMany(models.Group, {foreignKey: 'f_gi_creatorid'});
            User.hasMany(models.Project,  {foreignKey: 'f_pi_creatorid'});
            User.hasMany(models.Task,  {foreignKey: 'f_ti_creatorid'});
            User.hasMany(models.TaskVersion,{foreignKey: 'f_tvi_creatorid',as:'creator'});
            User.hasMany(models.TaskVersion,{foreignKey: 'f_tvi_productorid',as:'productor'});
            User.hasMany(models.TaskVersion,{foreignKey: 'f_tvi_senderid',as:'sender'});
            User.hasMany(models.ReviewComment,{foreignKey: 'f_rci_senderid',as:'reviewSender'});
            User.hasMany(models.TaskVersion,{foreignKey: 'f_tvi_receiverid',as:'receiver'});
            User.hasMany(models.Progress,  {foreignKey: 'f_pi_creatorid'});
            User.hasMany(models.File,  {foreignKey: 'f_fi_creatorid'});
            User.hasMany(models.ProjectDataBase,  {foreignKey: 'f_pi_creatorid'});
            User.hasMany(models.PublicDataBase,  {foreignKey: 'f_pi_creatorid'});
            User.hasMany(models.Plan,{foreignKey: 'f_pi_creatorid'});
            User.hasOne(models.Credit,  {foreignKey: 'f_cd_userid'});
            User.belongsToMany(models.Group,  {through: models.GroupMember, foreignKey: 'f_gmi_userid'});
            User.belongsToMany(models.Project,  {through: models.ProjectMember, foreignKey: 'f_pm_userid'});
            //User.belongsToMany(models.TaskVersion,  {through: models.TaskCheckMember, foreignKey: 'f_tcm_checkid'});
        }
    },
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    paranoid: false
});
