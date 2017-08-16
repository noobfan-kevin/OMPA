/**
 * Created by hk61 on 2016/3/7.
 */

(function() {


    // 读取配置文件
    !function readConfigInfo() {

        var path = require('path')
            , fs = require('fs')
            , config_path = path.dirname(process.execPath);

        window.configInfo = JSON.parse( fs.readFileSync(config_path+"/app/config/config.json",'utf8') );

    }();



    // jQuery扩展 载入指定页面
    jQuery.fn.extend({
        loadPage: function(file) {

            $('body').off('click.ompa');
            $(document).off('click.ompa');


            var path = require('path')
                , fs = require('fs');

            if(!file) return;  // 未定义return

            if(path.extname(file) !== '.html'){
                file += '.html';
            }

            if(path.dirname(file) == '.' || path.dirname(file) == ''){
                file = configInfo.static_path + file;
            }

            var data = fs.readFileSync(file,'utf8');

            this.children().remove();
            this.html(data);
            return this;
        }
    });
    jQuery.extend({
        whetherNeedPay: function(taskPercent, payPercent){
            //去掉百分号
            taskPercent = (taskPercent.length>1)? (taskPercent.substring(0, taskPercent.length-1)): taskPercent;
            payPercent = (payPercent.length>1)? (payPercent.substring(0, payPercent.length-1)): payPercent;

            //转数字
            taskPercent= taskPercent* 1;
            payPercent= payPercent* 1;

            //支付进度为0，则需要做第一次支付（预付款）
            if(!payPercent)
            {
                return true;
            }
            return (taskPercent> payPercent);
        }
    });

     //发送ajax前设置默认基地址、sid的发送
    $.ajaxSetup({
        beforeSend: function(xhr,now) {
            var nowUrl = now.url;
            if( nowUrl.indexOf(configInfo.server_url) == -1 ){
                now.url = configInfo.server_url + nowUrl;
            }
            xhr.setRequestHeader('sid', localStorage.getItem('sid') || 0);
            xhr.setRequestHeader('userId', localStorage.getItem('userId') || void 0);
        }
    });

    // 全局ajax完成回调
    $(document).ajaxComplete(function(event, xhr) {

        var  data = xhr.responseJSON || {};

        // 重定向
        // 数据库需要返回redirect重定向到的页面
        // 例:需要重定向到login页面，服务器返回至少需含 {redirect:'login.html'}
        if(data.redirect){
            departmentObj.showAskModel('身份验证已过期，请重新登录',false,function() {
                window.location.href = data.redirect;
            });
        }

        // 成功且包含sid，修改本地sid
        // 用于处理重新登录 和 sid过期
        if(data.sid){
            localStorage.setItem('sid',data.sid);
        }

    })


})();