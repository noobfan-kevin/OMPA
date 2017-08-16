/**
 * Created by hk61 on 2016/5/17.
 */
/*
 * nw保存（下载）文件
 * DOMInput的change事件绑定 fileDownloader.bind(DOMInput)
 *
 * @param {InputElement} DOMInput 需要有如下三个属性：
 *     type: file
 *     nwsaveas（可以不设值，但是建议给个默认值）
 *     fileSrc（文件地址）
 *     originName（原始文件名）属性并赋对应值
 *
 * @example:
 *
 * // 用法1 => 与input绑定（需要动态修改input的 fileSrc、originName两个属性）
 * ```html
 *  <input id="XXX" type="file" nwsaveas="未命名" fileSrc="http://xxx.xxx" originName="绑定示例.pdf" onchange="fileDownloader.bind(DOMInput)">
 * ```
 *
 *
 * // 用法2 => 全局调用addItem(fileSrc, savePath, originName)（手动传入参数,fileSrc文件下载链接; savePath:文件保存路径【通过DOMInput.value可获取】; originName: 原始文件名）
 *
 * ```html
 * <input id="XXX" type="file" nwsaveas="未命名" onchange="uploadFile(this)">
 * ```
 *
 * ```js
 *  function uploadFile(input){
 *     var link = "http://image.baidu.com/girl001.jpg";
 *     var savePath = input.value;
 *     var originName = 'girl.jpg';
 *
 *     fileDownloader.addItem(link, savePath, originName)
 *  }
 * ```
 *
 * @dependency: jQuery
 *
 * */

var fileDownloader = (function($, win, doc) {
    'use strict';

    var fs = require('fs')
        , http = require('http')
        , path = require('path')
        , prefix = 'downLoader';

    var itemTemplate ='<div class="list-item"><ul>' +
            '<li class="name"> <span class="fileIcon"></span></li>' +
            '<li class="size"></li> ' +
            '<li class="status"> ' +
                '<span class="status-warn iconfont" title="下载已取消">&#xe60a;</span> ' +
                '<span class="status-success iconfont" title="下载成功">&#xe63e;</span> ' +
                '<span class="status-error iconfont" title="下载出错">&#xe63d;</span> ' +
                '<span class="status-downloading">下载中…</span>' +
                '<span class="status-pending">等待…</span>'+
            '</li> ' +
            '<li class="option option-cancel"> ' +
                '<span class="option-cancel iconfont" title="取消">&#xe628;</span>' +
                ' <span class="option-resume iconfont" title="重新下载">&#xe68f;</span> ' +
                '<span class="option-folder iconfont" title="打开文件夹">&#xe672;</span>' +
            '</li>' +
            ' </ul>' +
            '<span class="progress-bar"></span>' +
            '</div>';


    function FileDownloader(config) {
        this.config = config || {
            useQueue: false
        };

        this.fileList = [];
        this.threads= config.threads || 1;  // 同步下载的线程数
        this.$wrap = $('#downloaderWrap');
        this.$container = $('#downloader-list', '#downloaderWrap');
        this.$header = $('#downloaderHeader', '#downloaderWrap');
        this.$title = $('#downloader-title', '#downloaderWrap');
    }

    extend(FileDownloader.prototype, {

        // 与input绑定
        bind: function(saveInput) {

            if(saveInput instanceof $){
                saveInput = saveInput.get(0);
            }
            var savePath = saveInput.value
                , link = $(saveInput).attr('fileSrc')
                , originName = $(saveInput).attr('originName');

            this.addItem(link ,savePath, originName);
        },

        // 添加一个连接项目到下载列表
        addItem: function(link, savePath, originName) {
            if(!savePath) return;
            var dwf = new DownloadFile(link ,savePath, originName)  // dwf : downloadFile
                , that = this;

            that.showPanel().fileList.push(dwf);
            if(that.config.useQueue){
                that.render().linkQueue(dwf).updateTitle();
            }else{
                that.render().createLink(dwf).updateTitle();
            }

            dwf.on('completed', function() {
                that.updateTitle();
                if(that.config.useQueue){
                    that.linkQueue();
                }
            });
        },

        // 根据id,获取下载文件实例
        getById: function(id) {
            var curDwf = null;
            this.fileList.map(function(dwf) {
                if(dwf.id == id)  curDwf = dwf;
            });
            return curDwf;
        },

        // 从列表删除一个项目
        removeById: function(id) {
            $('#' + id, this.$container).remove();
            return this.render();
        },
        
        showPanel: function() {
            this.$wrap.addClass('downLoader-show').animate({
                bottom: "0px"
            },450,'swing');
            return this;
        },

        minPanel: function() {
            this.$wrap.animate({
                bottom: -(this.$wrap.outerHeight() - this.$header.outerHeight())
            },450,'swing');
            return this;
        },

        togglePanel: function() {
            this.$wrap.animate({
                bottom: parseFloat(this.$wrap.css('bottom')) == 0 ? -(this.$wrap.outerHeight() - this.$header.outerHeight()):'0px'
            },450,'swing');
            return this;
        },

        closePanel: function() {
            this.$wrap.addClass('downLoader-close');
            this.closeAllLink().fileList = [];
            this.$wrap.css('bottom','-500px');
            return this;
        },

        updateTitle: function() {
            var total = this.fileList.length
                , doneNum = 0
                , msg;

            this.fileList.forEach(function(fileInstance) {
                if(fileInstance.status == 'success'){
                    ++doneNum;
                }
            });
            msg = total === doneNum ? '下载完成(' + total + ')' : '下载(' + doneNum + '/' + total + ')';
            this.$title.html(msg);
            return this;
        },

        render: function() {
            var tpl = '';

            this.fileList.map(function(dwf) {   // dwf : downloadFile
                tpl += dwf.render();
                dwf.added = true;
            });
            this.$container.html(tpl);
            return this;
        },

        createLink: function(dwf) {   // dwf : downloadFile
            var link = dwf.link
                , savePath = dwf.savePath
                , originName = dwf.originName
                , file
                , request
                , fileSize;

            // 没有扩展名,设置成与原文件扩展名一样
            if( !path.extname(savePath) ) {
                savePath = savePath + path.extname(originName);
                dwf.savePath = savePath;
            }

            file = fs.createWriteStream(savePath);
            request = http.get(link, function (res) {
                fileSize = res.headers['content-length'];
                res.on('data', function (data) {
                    file.write(data);
                    dwf.progress(file.bytesWritten, fileSize);
                }).on('close', function(e) {
                    dwf.abort();
                }).on('end', function () {
                    file.end();
                    dwf.success();
                });
            });

            request.on('error', function (e) {
                dwf.fail();
            });
            dwf.request = request;
            return this;
        },

        closeLinkById: function(id) {
            fileDownloader.getById(id).request.abort();
            return this;
        },

        closeAllLink: function() {
            this.fileList.forEach(function(dwf) {
                dwf.request.abort();
                if(dwf.status != 'success'){
                    fs.unlink(dwf.savePath, function(){})
                }
            });
            return this;
        },

        getPending: function() {
            var queue = []
                , that = this
                , count = 0
                , max = that.threads - this.getDownloading().length;

            this.fileList.forEach(function(dwf) {
                if( (dwf.status == 'pending') && count < max){
                    queue.push(dwf.id);
                    ++count;
                }
            });
            return queue;
        },

        getDownloading: function() {
            var aDownloading = [];
            this.fileList.forEach(function(dwf) {
                if(dwf.status == 'downloading'){
                    aDownloading.push(dwf);
                }
            });
            return aDownloading;
        },

        linkQueue: function(){
            var queue = this.getPending()
                , dwf
                , that = this;
            queue.forEach(function(id, index){
                dwf = that.getById(id);
                if(dwf.status == 'pending'){
                    that.createLink(dwf);
                }
            });
            return this;
        },

        resume: function(id) {
            var dwf = this.getById(id);
            dwf.set({
                status: 'pending',
                option: 'cancel'
            });
            if(this.config.useQueue){
                return this.linkQueue();
            }else{
                return fileDownloader.createLink(dwf);
            }
        },

        drag: function (obj, callbacks , limit) {
            var downX
                , downY
                , initX
                , initY
                , moveX
                , moveY
                , doc = document;

            bindEvent(obj, 'mousedown', function(ev) {

                downX = ev.screenX;
                downY = ev.screenY;
                initX = obj.offsetLeft;
                initY = obj.offsetTop;

                bindEvent(doc, "mousemove", move);
                bindEvent(doc, "mouseup", up);
                bindEvent(doc, "selectstart", preventDefault);
                // 阻止默认选取
                function preventDefault(ev) {
                    ev.preventDefault();
                }
                function move(ev) {
                    moveX = ev.screenX - downX;
                    moveY = ev.screenY - downY;

                    limit && limit.x || (obj.style.left = initX + moveX + 'px');
                    limit && limit.y || (obj.style.top = initY + moveY + 'px');
                    callbacks && callbacks.move && callbacks.move.bind(obj)(ev);
                }
                function up(ev) {
                    doc.removeEventListener('mousemove', move, false);
                    doc.removeEventListener('mouseup', up, false);
                    doc.removeEventListener('selectstart', preventDefault, false);
                    return false;
                }
                callbacks && callbacks.end && callbacks.end.bind(this)();
            });
            // 绑定事件函数
            function bindEvent(obj, event, callbacks) {
                obj.addEventListener(event, callbacks,false);
                return obj;
            }
        }
    });

    extend(FileDownloader.prototype, {
        getUserPath: process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME']
    });


    // dwf构造函数
    function DownloadFile(link ,savePath, originName) {
        extend(this, {
            link: link,
            savePath: savePath,
            originName: originName,
            name: path.basename( !path.extname(savePath) ? savePath + path.extname(originName) : savePath ),
            status: 'pending', // ['pending', 'downloading', 'warn', 'error', 'success]
            option: 'cancel',     // ['cancel', 'resume', 'folder']
            added: false,  // 是否已经添加到列表
            id: prefix + Date.now(),
            percent: 0,
            size: 0,
            ext: path.extname(originName).substr(1).toLowerCase(),
            _events: {},
            request: null
        });
    }

    extend(DownloadFile.prototype, {

        render: function() {
            var $item
                , that = this;

            if(this.added){
                $item = $('#'+this.id, '#downloader-list');
            }else{
                $item = $(itemTemplate).attr({'id': this.id});
            }
            $('.name', $item).html('<span class="fileIcon '+ utils.fileType(this.ext) +'"></span>'+this.name);
            $('.size', $item).html(utils.formatFileSize(this.size));
            $('.status', $item).attr('class','status status-' + this.status);
            $('.option', $item).attr('class','option option-' + this.option);
            $('.progress-bar', $item).css({
                width: that.percent
            });
            return $item.get(0).outerHTML;
        },

        progress: function(chunk, total) {
            this.set({
                percent: parseInt(100 - (((total - chunk) / total) * 100)) + '%',
                status: 'downloading',
                option: 'cancel',
                size: total
            });
        },
        success: function() {
            this.set({
                status: 'success',
                option: 'folder',
                percent: '100%'
            }).emit('completed');
        },

        fail: function() {
            this.set({
                status: 'error',
                option: 'resume'
            }).emit('completed');
            fs.unlinkSync(this.savePath);  // 删除未完成的
        },

        abort: function() {
            this.set({
                status: 'warn',
                option: 'resume',
                percent: 0
            }).emit('completed');
            fs.unlinkSync(this.savePath);  // 删除未完成的
        },

        on: function(name, listener) {
            if(this._events[name]){
                this._events[name].push(listener);
            }else{
                this._events[name] = [listener];
            }
        },

        emit: function(name) {
            var event = this._events[name];
            var len = event && event.length, i = 0;
            var param = Array.prototype.slice.call(arguments, 1);

            for(;i<len;i++){
                this._events[name][i].apply(null, param);
            }
            return this;
        },

        set: function(obj) {
            var k , that = this;

            for(k in obj){
                that[k] = obj[k];
            }
            that.render();
            return that;
        }
    });


    // 对象属性覆盖式扩展
    function extend(obj, props) {
        var prop, k;

        for(k in props){
            prop = props[k];
            obj[k] = prop;
        }
    }


    var utils = {
        // 格式化文件大小为合适的 Gb、Mb、Kb或Bytes
        formatFileSize:  function (total) {
            var format = parseInt(total).toString().length;

            switch(format){
                case 3:
                case 4:
                case 5:
                    return parseFloat(total/1024).toFixed(2) + 'Kb';
                case 6:
                case 7:
                case 8:
                    return parseFloat(total/1024/1024).toFixed(2) + 'Mb';
                case 9:
                case 10:
                case 11:
                    return parseFloat(total/1024/1024/1024).toFixed(2) + 'Gb';
                default:
                    return total + 'Byte';
            }
        },
        fileType: function(ext) {

            switch(ext){
                case 'bmp':
                case 'jpg':
                case 'jpeg':
                case 'png':
                case 'git':
                case 'tiff':
                    return 'image';
                case 'pdf':
                    return 'pdf';
                case 'doc':
                case 'docx':
                    return 'word';
                case 'xls':
                case 'xlsx':
                    return 'excel';
                case 'txt':
                    return 'txt';
                case 'ppt':
                case 'pptx':
                    return 'ppt';
                case 'mp3':
                case 'wav':
                case 'wma':
                case 'midi':
                case 'ogg':
                case 'flac':
                case 'aac':
                    return 'audio';
                case 'zip':
                case 'rar':
                case 'iso':
                case 'tar':
                    return 'zip';
                case 'bt':
                    return 'bt';
                case 'mind':
                    return 'mind';
                case 'xmind':
                    return 'xmind';
                case 'think':
                    return 'think';
                case 'default':
                    return 'tar';
            }
        }

    };


    return {
        init: function(config) {
            win.fileDownloader = new FileDownloader(config);
            fileDownloader.render();

            var downX;
            fileDownloader.$header.on('mousedown', function(ev) {
                downX = ev.screenX;
            }).on('mouseup',function(ev) {
                var $tar = $(ev.target);

                if(Math.abs(ev.screenX - downX) > 4){   // 敏感度为4,避免拖拽影响
                    return;
                }

                if( $tar.hasClass('downloader-min') ){
                    fileDownloader.minPanel();
                    return;
                }

                if( $tar.hasClass('downloader-close') ){
                    fileDownloader.closePanel();
                    return;
                }

                fileDownloader.togglePanel();
            });


            fileDownloader.$container.on('click',function(ev) {
                var $tar = $(ev.target)
                    , fileId = null
                    , dwf = null;

                // 打开文件夹
                if($tar.hasClass('option-folder') && $tar.get(0).nodeName.toLocaleLowerCase() == 'span'){
                    fileId = $tar.parents('.list-item').attr('id');
                    dwf = fileDownloader.getById(fileId);
                    GUIAPI.gui.Shell.showItemInFolder(dwf.savePath);
                }

                // 取消下载
                if($tar.hasClass('option-cancel') && $tar.get(0).nodeName.toLocaleLowerCase() == 'span') {
                    fileId = $tar.parents('.list-item').attr('id');
                    fileDownloader.closeLinkById(fileId);
                }

                // 重新下载
                if($tar.hasClass('option-resume') && $tar.get(0).nodeName.toLocaleLowerCase() == 'span') {
                    fileId = $tar.parents('.list-item').attr('id');
                    fileDownloader.resume(fileId);
                }
            });

            // 拖拽
            fileDownloader.drag($('#downloaderWrap').get(0),{
                move: function(ev) {
                    var selfWidth = $(this).width()
                        , winWidth = $(win).width()
                        , curPosition = parseFloat($(this).css('left'))
                        , exceedRight = curPosition > (winWidth - selfWidth)
                        , exceedLeft = curPosition < 0;

                    if(exceedRight){
                        $(this).css({right:0,left:'auto'})
                    }
                    
                    if(exceedLeft){
                        $(this).css({left:0})
                    }

                }
            }, {y: true} );

            // 窗口大小变化，下载面板位置调整
            $(win).on('resize', function() {
                var $obj = $('#downloaderWrap')
                    , selfWidth = $obj.width()
                    , winWidth = $('#container').width()
                    , curPosition = parseFloat($obj.css('left'))
                    , exceedRight = curPosition > (winWidth - selfWidth);

                if(exceedRight){
                    $obj.css({right:0,left:'auto'});
                }

            });

        }
    };

})(jQuery, window, document);