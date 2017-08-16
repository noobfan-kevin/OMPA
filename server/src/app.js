/**
 * Created by Yang on 2014/10/8.
 */
var config = require('./config');
var Server = require('./core/Server');
var express = require('express');
var path = require('path');

var port = config.portConfig.site;
var ompa = new Server('ompa-server',port);


ompa.loadRouters = function(){
    var app = this.app;

    app.use('/api/user',require('./api/user'));
    app.use('/api/project',require('./api/project'));
    app.use('/api/role',require('./api/role'));
    app.use('/api/credit',require('./api/credit'));
    app.use('/api/inform',require('./api/inform'));
    app.use('/api/file',require('./api/file'));
    app.use('/api/taskCard',require('./api/taskCard'));
    app.use('/api/plan',require('./api/plan'));
    app.use('/api/group',require('./api/group'));
    app.use('/api/progress',require('./api/progress'));
    app.use('/api/chat',require('./api/chat'));
    app.use('/api/group',require('./api/group'));
    app.use('/api/reviewComment',require('./api/reviewComment'));
    app.use('/api/messageStatus',require('./api/messageStatus'));
    app.use('/api/department',require('./api/department'));
    app.use('/api/assetType',require('./api/assetType'));
    app.use('/api/assetInfo',require('./api/assetInfo'));
    app.use('/api/stepAsset',require('./api/stepAsset'));
    app.use('/api/stepShot',require('./api/stepShot'));
    app.use('/api/fileType',require('./api/fileType'));
    app.use('/api/projectDataBase',require('./api/projectDataBase'));
    app.use('/api/sceneInfo',require('./api/sceneInfo'));
    app.use('/api/scene',require('./api/scene'));
    app.use('/api/fundDataBase',require('./api/fundDataBase'));
    app.use('/api/payDataBase',require('./api/payDataBase'));
    app.use('/api/partAInfo',require('./api/partAInfo'));
    app.use('/api/contract',require('./api/contract'));
    app.use('/api/contractSupplement',require('./api/supplementaryAgreement'));
    app.use('/api/voucher',require('./api/voucher'));
    app.use('/api/publicDataBase',require('./api/publicDataBase'));
    app.use('/api/log',require('./api/log'));
    app.use('/api/statistics',require('./api/statistics'));
    app.use('/api/notice',require('./api/noticeInfo'));
    require('./api/socket');
};

ompa.init = function(){
    this.useCoreLogger();
    this.loadFrontend();  //挂载前端
    this.useCookieParser();
    this.useBodyParser();
    this.useMulterUpload();
    this.useCrossSetting(); //允许跨域
    this.useLocalSession();
    this.useAuthenticate();
    this.createSocketIO();
    this.uncaughtExceptionHandler();
    this.prepareData();  // 修改配置，是否recreateDb
    this.importDb();
    this.useUserLog();
    require('./service/scheduleTaskService');

};



if (require.main === module) {
    ompa.run();
}

