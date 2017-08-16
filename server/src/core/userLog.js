/**
 * Created by hk61 on 2016/7/4.
 */

function UserLog(options) {
    this.logInfo = {
        user: null,
        ip: null
    };
    this.userName = null;
    this.userId = null;
}

UserLog.prototype.mount = function() {
    return this.makeMiddleware();
};

/*
* @Param [JSON | FUNC] logInfo
*       为对象，需要包含：type[Number]、typeId[UUID]、projectId[UUID]、description[TEXT]
*       为函数，返回值需要包含：type[Number]、typeId[UUID]、projectId[UUID]、description[TEXT]
*       可选包含：modified [Boolean] 决定记录是否会被保存
* */
UserLog.prototype.log = function(logInfo) {
    var logData;
    var modified;
    if(typeof logInfo === 'function'){
        try {
            logData = logInfo();
            this.logInfo.type = logData.type;
            this.logInfo.typeId = logData.typeId || '';
            this.logInfo.projectId = logData.projectId || '';
            this.logInfo.description = logData.description || '';
            modified = logData.modified != void 0 ? logData.modified : true;
            if(modified){
                this.save();
            }
        }catch(err) {
            console.error('userLogError:', err);
        }
        return;
    }

    try{
        //this.logInfo = UserLog.extend(logInfo, this.logInfo, logInfo);
        this.logInfo.type = logInfo.type;
        this.logInfo.typeId = logInfo.typeId || '';
        this.logInfo.projectId = logInfo.projectId || '';
        this.logInfo.description = logInfo.description || '';
        modified = logInfo.modified != void 0 ? logInfo.modified : true;
        if(modified){
            this.save();
        }
    }catch (err){
        console.error('userLogError:', err);
    }

};

UserLog.prototype.save = function() {
    var logService = require('../service/logService');
    logService.create(this.logInfo);
};

UserLog.prototype.makeMiddleware = function() {
    var that = this;

    return function (req, res, next) {
        if(req.url == '/api/user/login'){
            return next();
        }

        that.logInfo.userName = that.userName = req.session.user.name;
        that.logInfo.userId = that.userId = req.session.user.id;
        that.logInfo.ip = UserLog.getClientIp(req);
        next();
    }
};

UserLog.getClientIp = function (req) {
    return req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
};

UserLog.extend = function (target, source) {
    for(var k in source){
        target[k] = source[k];
    }
    return target;
};

UserLog.typeMap = function() {
    type = type / 1; // 强制转换为数字；
    
    switch (type) {
        case 0:
            return '其它';
        case 1:
            return '任务';
        case 2:
            return '合同';
        default:
            return '未知操作';
    }
};


var logInfo = new UserLog();

module.exports = logInfo;

