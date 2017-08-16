/**
 * Created by hk61 on 2016/3/21.
 */
/**
 * 文件上传
 * @Dependencies [jQuery]
 *
 * @示例：
 *         fileUploader(ev.target.files,{
 *           success:function(file) {
 *               changeUserProfile(file.name);
 *           },
 *           allow:['image/*'],
 *           single: true,
 *           field:'avatar'
 *       });
 */

$(function() {

    var regImageType = /image\/\S+/i
        , regVideoType = /video\/\S+/i
        , regAudioType = /audio\/\S+/i
        , regApplicationType = /application\/\S+/i
        , regRadix = /gb?|mb?|kb?|bytes/i   // 可读性转换
        , radixMap = {  // 文件大小转换
            g: 1000 * 1000 * 1000 ,
            m: 1000 * 1000 ,
            k: 1000 ,
            b: 1
        };
    
    var globalTime = 0;

    var flr = fileUploader = function(url, files, option) {
        return new flr.fn.init(url, files, option);
    };

    flr.fn = flr.prototype;


    flr.restoreDefault= function(){
        // 默认配置选项
        flr.option = {
            url:configInfo.server_url + '/api/file/upload',
            allow: ['*'],
            field: 'file',
            single: false,
            limit: 0,
            showPanel: false,
            data:{},
            success: function(res, xhr) {
                //console.log('文件上传成功！');
            },
            fail: function(ev, xhr) {
                //console.log('文件上传失败！');
            },
            progress: function(ev, xhr) {
                //console.log('文件上传中……');
            },
            abort: function(ev, xhr){
                //console.log('文件上传终止。');
            },
            start: function(ev, xhr){
                //console.log('文件上传开始……');
            },
            end: function(ev, xhr) {
                //console.log('文件上传结束');
            },
            notAllowed: function(file) {    // 格式错误触发
                console.log(file, '文件格式不被允许');
            }
        };
        flr.option.error = flr.option.fail;
    };

    flr.restoreDefault();

    var init = flr.fn.init = function(url, files, option) {

        // 恢复为默认配置选项
        flr.restoreDefault();

        if(typeof url != 'string'){
            option = files;
            files = url;
            url = void 0;
        }

        // 文件列表兼容处理
        files = Array.isArray(files) ? files : ( files.length != void 0
            ? Array.prototype.slice.call(files) : [files] );

        // 选项参数扩充
        this.option = $.extend(true, flr.option, option ,{
            url: url,
            files: files,
            fileLength: files.length
        });

        this.uploader( this.option.single ? files.slice(0,1) : files, this.option);

    };

    init.prototype = flr.prototype;


    /*
     * 检测是否与为允许的图片格式
     * @Param {String} type 文件格式，例如'image/png'
     * @return {Boolean}
     * */
    flr.fn.isAllow = function(type) {
        var allow = this.option.allow;

        if(allow.indexOf('*') != -1){
            return true;  // 是否允许所有格式
        }

        if(allow.indexOf('image/*') != -1){   // 是否允许所有图片格式
            return regImageType.test(type);
        }

        if(allow.indexOf('video/*') != -1){   // 是否允许所有视频格式
            return regVideoType.test(type);
        }

        if(allow.indexOf('audio/*') != -1){   // 是否允许所有音频格式
            return regAudioType.test(type);
        }

        if(allow.indexOf('application/*') != -1){   // 是否允许所有应用格式
            return regApplicationType.test(type);
        }

        return allow.indexOf(type) != -1;

    };

    // 文件上传
    flr.fn.uploader = function(files, config) {
        var that = this;

        if( !config.url ){
            throw new Error('Param url is must!');
        }

        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function(ev) {
            if (this.readyState == 4) {

                if (this.status == 200) {    // 成功上传

                    var res = JSON.parse(xhr.responseText);
                    config.success.call(that, res, xhr);

                    /* 默认上传状态面板  -- 速度重置 */
                    var index = 1;
                    setTitleStatus(index);
                    $('.file-list','#dialog-uploader').eq(index).find('.speed').html('(0B/s)');

                    // 上传终止
                }else if (this.status == 0) {
                    config.abort.call(that, ev, xhr);
                } else {
                    config.error.call(that, ev, xhr);
                }

            }
        };

        // 上传开始
        xhr.upload.onloadstart = function(ev) {
            config.start.call(this, ev, xhr);

            /* 默认上传状态面板 -- 渲染面板 */
            addItems(flr.option.files.length);
            globalTime = Date.now();

        };

        // 上传中
        xhr.upload.onprogress = function(ev) {
            var index = 1;
            config.progress.call(this, ev, xhr);

            if( (ev.timeStamp - globalTime) < 600 ) return;    // 上传时间太短，不显示状态面板
            /* 默认上传状态面板  -- 渲染数据 */
            renderListItemInfo(ev,index);
        };

        // 出错
        xhr.upload.onerror = function(ev) {
            config.error.call(this, ev, xhr);
        };

        // 结束
        xhr.upload.onloadend = function(ev) {
            var index = 1;

            config.end.call(this, ev, xhr);

            /* 默认上传状态面板  -- 速度重置 */
            $('.file-list','#dialog-uploader').eq(index).find('.speed').html('(0B/s)');
        };

        var formData = new FormData();

        // 附加数据通过data扩充
        var data = config.data
            , val;
        for(var k in data){
            val = data[k];
            if(val){
                formData.append(k, val);
            }
        }

        var legalLength = files.length;
        files.forEach(function(file) {


            var fileExt = file.type!= '' ?
                          file.type : file.path.substring(file.path.lastIndexOf('.') + 1);

            if(!that.isAllow(fileExt) ){

                config.notAllowed && config.notAllowed(file);
                legalLength--;
                config.error.call(file, '不被允许的文件格式', xhr);
                console.error('This file\'type be not allowed!');
            }else{

                // limit大小限制
                var matchRadix = config.limit.toString().match(regRadix);
                matchRadix = matchRadix ? matchRadix[0].charAt(0).toLowerCase(): 1;
                config.limit = parseFloat(config.limit) * radixMap[matchRadix];

                if(that.limit != 0 && file.size > config.limit){
                    legalLength--;
                    config.error.call(file, '文件 '+ file.name +'大小超限:' + config.limit, xhr);
                    console.error('文件 '+ file.name +'大小超限:',config.limit);
                }else{
                    formData.append(config.field, file);
                }

            }

        });

        xhr.open('post', config.url, true);
        xhr.setRequestHeader('sid', localStorage.getItem('sid') || 0);
        if( legalLength > 0 ){
            xhr.send(formData);
        }else{
            xhr = null;
        }

    };
    window.fileUploader = fileUploader;

    // 上传面板
    addUploadPanel();

    /* 全局上传控制 */
    $('.dialog-uploader-header').click(function(ev) {

        if( $(ev.target).hasClass('dialog-close') ){
            $('#dialog-uploader').hide();
        }else{
            toggleShow()
        }

    });

    /*
    * 上传面板收缩状态toggle
    * */
    function toggleShow() {

        var $uploader = $('#dialog-uploader');

        $uploader.animate({
            bottom: parseFloat($uploader.css('bottom')) == 0 ? -$('.dialog-uploader-body').outerHeight():'0px'
        },450,'swing')
    }

    /*
    * 向上传进度列表添加一项
    * */
    function addItems(num) {

        if(!flr.option.showPanel) return;

        num = num || 1;

        var listTemp =
            '<li class="file-list">' +
            '<div class="process" style="width: 0%;"></div> ' +
            '<div class="info">' +
            '<div class="file-name" title="navicat111_premium_cs_x64.rar"> ' +
            '   <div class="file-icon fileicon-small-zip"></div> ' +
            '<span class="name-text">navicat111_premium_cs_x64.rar</span>' +
            '</div> ' +
            '<div class="file-size">31.1M</div> ' +
            '<div class="file-status status-success"> ' +
            '<span class="waiting">排队中…</span> ' +
            '<span class="prepare">准备上传…</span>' +
            '<span class="uploading">' +
            '<em class="precent">0.00%</em>' +
            '<em class="speed">(0B/s)</em>' +
            '</span>' +
            '<span class="error"><em></em><i>服务器错误</i></span>' +
            '<span class="pause"><em></em><i>已暂停</i></span>' +
            '<span class="cancel"><em></em><i>已取消</i></span>' +
            '<span class="success"><em></em><i></i></span>' +
            '</div>' +
            '<div class="file-operate">' +
            '<em class="operate-pause"></em>' +
            '<em class="operate-continue"></em>' +
            '<em class="operate-remove"></em>' +
            '</div>' +
            '</div>' +
            '</li>';

        while(--num){
            listTemp += listTemp;
        }

        $('#uploaderList').html('');
        $(listTemp).appendTo('#uploaderList');
    }

    /*
    * 将上传列表面板添加到页面中
    * */
    function addUploadPanel() {

        if(!flr.option.showPanel) return;

        var uploadPanelTemp =
            '<div id="dialog-uploader">' +
            '<div class="dialog-uploader-header">' +
            ' <h3> ' +
            '<span class="dialog-header-title"><em class="select-text">正在上传（1/2）</em> </span>' +
            ' </h3> ' +
            '<div class="dialog-control">' +
            '<span class="dialog-icon dialog-close">X</span> ' +
            '<span class="dialog-icon dialog-min">-</span> ' +
            '</div> ' +
            '</div> ' +
            '<div class="dialog-uploader-body">' +
            '<div class="uploader-list-wrapper"> ' +
            '<div class="uploader-list-header"> ' +
            '<div class="file-name">文件(夹)名</div> ' +
            '<div class="file-size">大小</div>' +
            '<div class="file-status">状态</div>' +
            '<div class="file-operate">操作</div>' +
            '</div> ' +
            '<div class="uploader-list"> ' +
            '<ul class="uploader-container" id="uploaderList"> ' +
            '</ul>' +
            '</div></div></div></div>';

        if( !$('#dialog-uploader').length ){
            $('head').append('<link rel="stylesheet" href="css/fileUploader.pannel.css"/>');
            $(uploadPanelTemp).appendTo('body');
        }

    }

    /*
    * 上传列表项数据渲染
    * */
    function renderListItemInfo(ev, index) {

        if(!flr.option.showPanel) return;

        var curFile = flr.option.files[index];
        var percent = ~~(ev.loaded / ev.total) * 100;
        var speed = ev.loaded / ( (ev.timeStamp - globalTime)/1000000 );
        var $listItem = $('.file-list','#dialog-uploader').eq(index);

        $('#dialog-uploader').show().css({'bottom':-$('.dialog-uploader-body').outerHeight()}).animate({'bottom':0},450,'swing');
        $listItem.find('.process').css({width:percent + '%'});
        $listItem.find('.file-status')[index].className = 'file-status status-uploading';
        $listItem.find('.file-size').html(formatFileSize(ev.total));
        $listItem.find('.file-name').attr({title:curFile.name});
        $listItem.find('.precent').html(percent + '%');
        $listItem.find('.speed').html('('+ formatFileSize(speed) +'/s)');
        $listItem.find('.name-text').html(curFile.name);
        setTitleStatus(index);

    }

    /*
     * 格式化文件大小为合适的 Gb、Mb、Kb或Bytes
     * */
    function formatFileSize(total) {
        var format = parseInt(total).toString().length;

        switch(format){
            case 3:
            case 4:
            case 5:
                return parseFloat(total/1000).toFixed(2) + 'Kb';
            case 6:
            case 7:
            case 8:
                return parseFloat(total/1000/1000).toFixed(2) + 'Mb';
            case 9:
            case 10:
            case 11:
                return parseFloat(total/1000/1000/1000).toFixed(2) + 'Gb';
            default:
                return total + 'Bytes';

        }
    }

    function setTitleStatus(index) {

        if(!flr.option.showPanel) return;

        var total = flr.option.files.length;
        if( index != total ){
            $('.select-text','#dialog-uploader').html('正在上传（'+ index +'/'+ total +'）');
        }else{
            $('.select-text','#dialog-uploader').html('上传完成（'+ index +'/'+ total +'）');
        }

    }


});
