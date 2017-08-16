/**
 * Created by YanJixian on 2015/7/28.
 */

var auth = module.exports;


auth.config = {
    useAuthority: false
};

auth.roles = function(authority){

    var authorities = arguments;
    var len = authorities.length;

    return function(req, res, next){
        return next(); // 暂时不验证
        // 是否启用了用户权限验证
        if(!auth.config.useAuthority) {
            return next();
        }

        if(req.session.user){
            var user = req.session.user;
            //var projectId = req.query.projectId;

            for(var i = 0; i< len; i++){
                if( user.authorities.indexOf(authorities[i])!= -1 ){
                    return next();
                }
            }
            return res.status(401).json({ok: false, message: '用户权限不足。'});
        }

        res.status(304).json({ok: true, redirect:'login.html', message: '用户未登录。'});

    }

};

auth.authenticate = function () {
    
    return function auth(req, res, next) {

        if(req.originalUrl == '/api/user/login'){
            return next();
        }

/*        var key = req.get('sid');
        if(!key){
            return res.status(200).json({ok: false, redirect:'login.html', message: '请先登录'});
        }

        req.session.getItem(key, function (user) {
            if(user){
                req.session.user = user;
                return next();
            }
            return res.status(200).json({ok: false, redirect:'login.html', message: '验证已超时'});
        });*/
        var userService = require('../service/userService');
        var userId = req.get('userId');

        userService.getById(userId).then(function(dbUser) {

            if(dbUser){
                req.session.user = dbUser.dataValues;
            }
            return next();
        })

    };
};
