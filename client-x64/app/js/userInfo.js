/**
 * Created by hk61 on 2016/3/23.
 */
$(function() {

    var loginUserId = localStorage.getItem('userId');
    

    // 获取用户信息
    getUserInfo();
    function getUserInfo(){
        $.ajax({
            url:'/api/user/' + loginUserId,
            type: 'get',
            success: function(data) {
                renderUserInfo(data);
            },
            error: function() {
                console.log('读取用户信息失败！');
            }
        });
    }


    // 更改用户信息
    $('#user-info-editable-btn').click(function() {
        var allLegal = validation['userInfo'].isLegalAll();

        if($(this).html() == '保存' && allLegal ){

            $('.user-info-show-input','#user-info-detail').each(function() {
                var val = this.value;
                $(this).val( val ? val:this.dataset.init );
            });

            $.ajax({
                url: '/api/user/' + loginUserId,
                type: 'put',
                data: $('#user-info-commit').serialize(),
                success: function(data) {
                    getUserInfo();
                },
                fail: function() {
                    console.log('保存失败！');
                }
            })

        }

        if( allLegal ){
            toggleEditable();
        }
    });


    // 显示用户信息面板
    $('#user-info-show-btn').click(function() {
        $('#user-info-panel-mask').fadeIn();
        $('#user-info-panel').slideDown(200,'linear');
        getUserInfo();
    });


    // 隐藏用户信息面板
    $('#user-info-cancel,#user-panel-close').click(function() {
        $('#user-info-editable-btn').html('编辑');
        $('#user-info-detail').removeClass('user-info-editor');
        $('#user-info-cancel').hide();
        validation.clearAll();
        clearAllValue();   // 清空所有输入框的值
        if(this.id === 'user-panel-close'){
            $('#user-info-panel-mask').fadeOut();
            $('#user-info-panel').slideUp(200,'linear');
        }
    });


    function clearAllValue() {
        $('.user-info-show-input','#user-info-detail').val('');
    }

    /*
    * 将用户信息渲染到页面
    * @Param {JSON} ajax获取到的用户信息
    * */
    function renderUserInfo(data) {

        // html格式的用户信息
        $('.user-info').each(function(i, val) {
            var dataInfo = val.dataset.userInfo;
            val.innerHTML = data[dataInfo];
        });

        // 页面中input类型的用户信息
        $('input','#user-info-detail').val('').each(function() {
            var val = data[this.dataset.userInfo];
            if(val == 'null') val = '';
            if(!$(this).hasClass('user-info-password')){
                $(this).attr('placeholder',val );
            }
            this.dataset.init = val;
        });
        $('input:disabled','#user-info-detail').not('.user-info-password').each(function() {
            var val = data[this.dataset.userInfo];
            if(val == 'null') val = '';
            $(this).attr('placeholder', val);
        });

        // 用户头像
        var ava$tar = data.image ? configInfo.server_url + '/' + data.image : 'images/defaultAva$tar.jpg';
        $('.user-info-image').attr('src',ava$tar)

    }

    /*
    * 切换编辑状态
    * */
    function toggleEditable() {
        var $editableBtn = $('#user-info-editable-btn');
        var $cancelBtn = $('#user-info-cancel');

        if($editableBtn.html() == '编辑'){
            $editableBtn.html('保存');
            $cancelBtn.show();
            $('.user-info-show-input').each(function(ind, val){
                if(val.dataset.userInfo != 'password'){
                    $(val).val( val.dataset.init );
                }
            });
        }else{
            $editableBtn.html('编辑');
            $cancelBtn.hide();
        }

        $('#user-info-detail').toggleClass('user-info-editor');
    }



    /*  更换头像 */
    $('.user-image-box').click(function() {
        $('#userImage').trigger('click');
    });
    $('#userImage').change(function(ev) {

        fileUploader(ev.target.files,{
            success:function(file) {
                changeUserProfile(file.name);
            },
            allow:['image/*'],
            single: true,
            field:'avatar'
        });

    });

    /*
    * 修改用户头像
    * */
    function changeUserProfile(src) {

        $.ajax({
            url:'/api/user/' + loginUserId,
            type:'put',
            data:{
                image:src
            },
            success: function(data) {
                if(data.ok){
                    getUserInfo();
                }else{
                    console.log('更新用户头像失败');
                }
            },
            error: function() {
                console.log('更新用户头像失败');
            }
        });

    }

    $('#user-info-panel-mask').dblclick(function(ev) {
        ev.preventDefault();
    });


    // 输入验证
/*
    $('.user-info-show-input').each(function() {

        departmentObj.bindLegalCheck([$(this)],'0','-30',this.dataset.userInfo);

    });
*/


    verifyInputs({
        context: $('#user-info-detail')[0]
    },'userInfo');



    /*
    * input对象需要添加validation-type，例： data-validation-type = 'password',
    *
    * */
    function verifyInputs(option,id) {

        if(!option){
            id = option;
            option = {};
        }
        
        var context = option.context || document;   // 验证的执行环境
        var $inputs = $('input,textarea', context).filter(function(index) {
            return this.dataset.validationType != void 0;
        });
        if(!$inputs.length) return;

        var baseSet = {
            min:1,
            max:20,
            minTriggerType:'blur',
            minMsg:'长度太短',
            maxTriggerType:'keyup',
            maxMsg:'输入长度超过',
            illegalTriggerType:'keyup', // 什么事件触发非法验证
            illegalMsg:'字母、数字、下划线',
            illegalReg: /[^\d(A-Za-z)+$_']/g,   // 验证是否合乎规定的正则
            position:'auto',    // 暂时无用
            allowNull:true,         // 是否允许为空
            nullMsg:'不能为空',   // 为空时消息，且当allowNull为false
            autoClear:true,      // 是否自动清除非法字符       
            autoHide: true,     // 是否自动隐藏警告框
            toggleReg:false    // 是否转置illegal正则验证的结果
        };
        
        var initData = {
            'password':{
                min:6,
                max:16,
                minMsg:'密码太短',
                nullMsg:'密码不能为空'
            },
            'phone':{
                min:7,
                minMsg:'请输入正确的电话号码',
                max:14,
                maxTriggerType:'keydown',
                illegalMsg:'请输入正确的电话号码',
                illegalReg: /[^\d]/g,
                nullMsg:'电话号不能为空',
                autoClear:false,
                autoHide:false
            },
            'email':{
                min:3,
                max:18,
                minMsg:'请输入正确的邮箱',
                maxTriggerType:'keydown',
                illegalTriggerType:'blur',
                illegalMsg:'请输入正确的邮箱',
                illegalReg: /^[a-z\d]+(\.[a-z\d]+)*@([\da-z](-[\da-z])?)+(\.{1,2}[a-z]+)+$/g,
                nullMsg:'邮箱不能为空',
                autoClear:false,
                autoHide: false,
                toggleReg:true
            },
            'username':{
                min:1,
                max:20,
                minMsg:'用户名不能为空',
                illegalTriggerType:'keyup', //  keydown有bug,第一次输入非法字符不触发
                illegalMsg:'中文、英文、数字、下划线',
                illegalReg: /[^\u4e00-\u9fa5|a-zA-Z0-9_]/g,
                nullMsg:'用户名不能为空',
                comment:'只允许中文、英文、数字、下划线'
            },
            'title':{
                min:1,
                max:30,
                minMsg:'标题不能为空',
                illegalTriggerType:'keydown', //  keydown有bug,第一次输入非法字符不触发
                illegalMsg:'中文、英文、数字、下划线',
                illegalReg: /[^\u4e00-\u9fa5|a-zA-Z0-9_,]/g,
                allowNull: false,
                comment:'只允许中文、英文、数字、下划线'
            },
            'reason':{
                min:1,
                max:100,
                minMsg:'请输入添加原因',
                illegalTriggerType:'keydown', //  keydown有bug,第一次输入非法字符不触发
                illegalMsg:'中文、英文、数字、下划线',
                illegalReg: /[^\u4e00-\u9fa5|a-zA-Z0-9_]/g,
                allowNull: false,
                comment:'只允许中文、英文、数字、下划线'
            },
            'content':{
                min:1,
                max:200,
                minMsg:'请输入具体内容',
                illegalTriggerType:'input', //  keydown有bug,第一次输入非法字符不触发
                illegalMsg:'内容不被允许',
                illegalReg: /<script/g,
                allowNull: false,
                comment:'内容不被允许'
            },
            'money':{
                min:1,
                minMsg:'请输入正确金额',
                max:14,
                maxTriggerType:'keyup',
                illegalMsg:'请输入正确金额',
                illegalReg: /[^\d]/g,
                nullMsg:'请输入金额',
                autoClear:false,
                autoHide:false
            },
            'payType':{
                min:1,
                max:50,
                minMsg:'请输入正确的支付方式',
                illegalTriggerType:'keyup', //  keydown有bug,第一次输入非法字符不触发
                illegalMsg:'中文、英文、数字、下划线',
                illegalReg: /[^\u4e00-\u9fa5|a-zA-Z0-9_]/g,
                nullMsg:'请输入正确的支付方式',
                comment:'只允许中文、英文、数字、下划线'
            },
            'context': document
        };


        /*===================== 暴露全局validation对象 ==============================*/
        //  全局可用：
        //  validation[id].isLegalAll ==> Boolean 检验是否全部合法
        //  validation.clear() 调用该函数将隐藏所有验证消息框，并将所有validatiion[id]置为true
        if(window.validation == void 0){
            window.validation = {};
        }
        validation[id] = {};  // 默认所有符合

        /*
        * 隐藏所有的验证消息框
        * */
        validation.clearAll = function() {
            var keys = Object.keys(initData);
            keys.forEach(function(type) {
                $('#validation_' + id + '_' + type).hide();
            });
            // 重置所有验证状态
            var validationCur = validation[id];
            for(var v in validationCur){
                if(typeof validationCur[v] == 'function') {
                    continue;
                }
                validationCur[v] = true;
            }
        };

        /*
        *   检查是否全部验证通过
        * */
        validation[id].isLegalAll = function() {
            var validationCur = validation[id];
            for(var v in validationCur){
                if(validationCur[v] == false) return false;
            }
            return true;
        };
        /*--------------------------------------------------------------------------*/


        $.extend(true, initData, option);
        for(var key in initData){
            if(key != 'context'){
                initData[key] = $.extend(false,baseSet,initData[key]);
                //validation[id][key] = initData[key]['allowNull'] ? true : false; // 初始化所有验证状态
                validation[id][key] =  true; // 初始化所有验证状态
            }
        }



        var cssText = "top:0px;left:0px; z-index:1100;width:130px;display:inline-block; position: absolute; font:14px/1.2em '微软雅黑';" +
            "padding:5px;box-shadow: 0px 3px 6px #aaa;border-radius: 5px;max-width:300px;opacity: 0.8;transform:translateY(-100%);" +
            "margin-top:-3px; color: #eee;background:#FD0F0F;text-align:center;";
        var $box =$('<div style="' + cssText +'"><div>');

        //
        //  为context下的所有带有 data-validation-type的input绑定验证
        //
        $inputs.each(function(ind, input) {
            var type = input.dataset.validationType;
            var dataField = initData[type]
                , curField = validation[id];

            // 注入页面中

            $box.clone().attr('id','validation_' + id + '_' + type).css({
      /*          left: input.offsetLeft,
                top: input.offsetTop*/
            }).insertBefore(input).hide();


            // 长度不够
            $(input).on(dataField['minTriggerType'], function() {
                var trigger = $(this).val().length < dataField['min'] && (dataField['allowNull'] && $(this).val() != '') ;
                if(trigger){
                    $('#validation_' + id + '_' + type).html(dataField['minMsg'] + '(' + dataField['min'] + '~' + dataField['max'] + '位)').show();
                    curField[type] = false;
                }else{
                    curField[type] = true;
                }

            });

            // 长度超过
            $(input).on(dataField['maxTriggerType'], function() {
                var trigger = $(this).val().length > dataField['max'];
                if(trigger){
                    $('#validation_' + id + '_' + type).html(dataField['maxMsg'] + '(' + dataField['min'] + '~' + dataField['max'] + '位)').show();
                    curField[type] = false;
                }else{
                    curField[type] = true;
                }
            });

            // 非法
            $(input).on(dataField['illegalTriggerType'], function(ev) {
                var $tar = $('#validation_' + id + '_' + type);
                var trigger = false;
                if( $(this).val($(this).val().trim()) ){

                    //trigger = dataField['illegalReg'].test( );  // 是否符合正则
                    trigger = !!$(this).val().match(dataField['illegalReg']);

                    if(dataField['toggleReg']){
                        trigger = !trigger;
                    }
    
                    if(dataField['allowNull']){     // 是否允许为空
                        trigger = $(this).val() == '' ? false : trigger;
                    }
                    if(trigger){    // 触发处理
                        if(dataField['autoHide']){
                            $tar.html(dataField['illegalMsg']).show().delay(3000).fadeOut();
                        }else{
                            $tar.html(dataField['illegalMsg']).show();
                        }
                        if(dataField['autoClear']){     // 自动清除不符合的字符
                            $(this).val( $(this).val().replace(dataField['illegalReg'],''));
                        }
                        curField[type] = false;
                    }else if($(this).val().length > dataField['max']){  // 长度超出处理
                        $tar.html(dataField['maxMsg'] + '(' + dataField['min'] + '~' + dataField['max'] + '位)').show().delay(3000).fadeOut();
                        $(this).val($(this).val().slice(0,dataField['max']));
                        curField[type] = false;
                    }else{  
                        $tar.hide();
                        curField[type] = true;
                    }
                    
                }
            });

            // 处理autoHide为true的情况
            $(input).on('keydown',function() {
                if(dataField['autoHide']) return;

                $('#validation_' + id + '_' + type).hide();
            });

            // 不允许为空
            $(input).on('blur',function() {

                if(dataField['allowNull']) return;

                if($(this).val().trim() == ''){
                    $('#validation_' + id + '_' + type).html(dataField['mullMsg']).show();
                   curField[type] = false;
                }else{
                    $('#validation_' + id + '_' + type).hide();
                   curField[type] = true;
                }
            });
        });
        
        return id;
    }

    window.verifyInputs = verifyInputs;
});


