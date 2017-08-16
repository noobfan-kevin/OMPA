/**
 * Created by hk61 on 2016/5/4.
 */

var schema = (function() {

    function init() {
        var ue = UE.getEditor('hkEditor');
        window.uEditor = ue;    // 用于全局检测，是否已经有编辑器实例

        ue.ready(function() {
            localStorage.removeItem('schemaId');
            ue.setHeight($('#editor-area').height());
            _registerOurPlugInToUE();
            _listenEditorInnerFileClick();
            _bugTab();
        });
        
        ue.addListener('contentChange', function () {
            _adjustNode();
            _updateTitleList();
            _setSaveBtnStatus();
        });

        _onTitleHoverShowTips();
        _onTitleClickRollContent();
        _listenOperationBtnClick();
        $(window).on('resize', function() {
            var curStatus = $('#taskVersionCheck').attr('data-status');
            var editable = curStatus/1 <= 0;
            adjustEditorHeight(editable);
        });
        
    }



    //  点击设置标题、正文
    function _listenOperationBtnClick() {

        $('#editor-operation a').click(function () {
            var style = {
                    'firstHeader': 'font-size:20px;font-weight:bold;color:#000',
                    'secondHeader': 'font-size:18px;font-weight:bold;color:#000',
                    'thirdHeader': 'font-size:16px;font-weight:bold;color:#000',
                    'textBody': '',  // 调用内部方法，不需要设置参数
                    'textColor': '#ff0000'   // 颜色需要直接设置值
                }
                , level = $(this).data('role') ;

            switch (level) {
                case 'firstHeader':
                case 'secondHeader':
                case 'thirdHeader':
                    uEditor.execCommand('hkeditor', style[level], true);
                    break;

                case 'textColor':
                    uEditor.execCommand('hkeditor', style[level], false);
                    break;

                case 'textBody':

                    if (!uEditor.selection.getRange().collapsed) {
                        uEditor.execCommand('removeformat');
                    }
                    break;

                default :
                    break;
            }
        });

        // 上传图片
        $('#insertImage,#insertVideo,#insertAttachment').on('change', function(ev) {
            var files = ev.target.files;
            var i = 0, len = files.length;
            var globalTime = null;

            for(;i<len;i++){
                (function(file) {
                    fileUploader(file, {
                        start: function(){
                            globalTime = Date.now();
                        },
                        success: function(dbFile) {
                            _insertFile(dbFile);
                            // 插入图片的 ctrl+z的bug
                            uEditor.undoManger && uEditor.undoManger.save();
                            // 首次插入图片不触发contentChange的bug
                            uEditor.fireEvent('contentChange');
                            $(".fileProgressInfo").hide();
                        },
                        progress: function(ev, xhr) {
                            if( (ev.timeStamp - globalTime) < 600 ) return;    // 上传时间太短，不显示状态面板

                            var percentage = ~~(ev.loaded / ev.total * 100) + '%';
                            $(".fileProgressInfo").show().find(".upload-fileName").html(file.name);
                            $('.close',".fileProgressInfo").off('click').on('click', function() {
                                xhr.abort();
                                $(".fileProgressInfo").hide();
                            });
                            $("div.fileProgressInfo_top").children("span").text(percentage);
                            $("div.progressbar_forward").css('width', percentage);
                        },
                        field:'file',
                        data: {
                            sourceTable:'t_planinfo',
                            sourceKey: localStorage.getItem('schemaId')
                        },
                        allow: ['*']
                    })
                })(files[i]);
            }
        });
    }

    // 注册我们自己改写的Ueditor插件
    function _registerOurPlugInToUE() {
        uEditor.registerCommand('hkeditor', function () {

            // 导入需要调用到的UE组件
            var domUtils = UE.dom.domUtils,
                utils = UE.utils;

            function mergeWithParent(node) {
                var parent = node.parentNode;

                while (parent) {

                    if (parent.tagName == 'SPAN' && domUtils.getChildCount(parent, function (child) {

                            return !domUtils.isBookmarkNode(child) && !domUtils.isBr(child)

                        }) == 1) {
                        parent.style.cssText += node.style.cssText;
                        domUtils.remove(node, true);
                        node = parent;

                    } else {
                        break;
                    }

                }

            }

            function childrenAnchors(rng) {

                rng.adjustmentBoundary();

                if (!rng.collapsed && rng.startContainer.nodeType == 1) {
                    var start = rng.startContainer.childNodes[rng.startOffset];

                    if (start && domUtils.isTagNode(start, 'span')) {
                        var bk = rng.createBookmark();

                        utils.each(domUtils.getElementsByTagName(start, 'span'), function (span) {
                            if (!span.parentNode || domUtils.isBookmarkNode(span)) return;
                            domUtils.remove(span, true)
                        });

                        rng.moveToBookmark(bk)

                    }
                }

            }

            function mergesibling(rng, cmdName) {

                var collapsed = rng.collapsed
                    , bk = rng.createBookmark()
                    , common;

                if (!collapsed) {
                    common = domUtils.getCommonAncestor(bk.start, bk.end);
                }

                utils.each(domUtils.getElementsByTagName(common, 'span'), function (span) {
                    if (!span.parentNode || domUtils.isBookmarkNode(span)) return;
                    //                    mergeWithParent(span);
                });

                rng.moveToBookmark(bk);
                childrenAnchors(rng, cmdName)

            }

            // 返回元素的第一个祖先元素
            function getElementNode(node) {
                return node.nodeType !== 1 ? getElementNode(node.parentNode) : node;
            }


            function wrapWithColorSpan(node, color,isStyle) {
                var newNode = document.createElement('span');

                if(isStyle){
                    newNode.style = color;
                }else{
                    newNode.style.color = color;
                }
                try {
                    newNode.appendChild(node);
                } catch (err) {
                    console.log(err);
                }
                return newNode;
            }

            function markColor(rng, style) {
                var endNode = rng.endContainer;

                rng.traversal(function (node) {
                    if(node.nodeType === 1){
                        if( hasNode(node, endNode) && endNode.nodeType === 3){
                            if(endNode.textContent.length === rng.endOffset){
                                endNode.parentNode.style.color = style;
                            }else{
                                preNodesAddColor(node.childNodes, endNode, rng, style);
                            }
                            return;
                        }
                        node.style.color = style;
                        $(node).children().css({'color':'#f00'});

                    }else{
                        node.parentNode.replaceChild(wrapWithColorSpan(node.cloneNode(true), style), node);
                    }
                });

            }

            /*
             * 为参考节点前的节点设置样式
             *
             * @para [NodeList] nodeList 节点列表
             * @para [Node] refNode 计算位置的参考节点
             * @para [String] style 十六进制颜色值，例：'#ff0000'
             * */
            function preNodesAddColor(nodeList, refNode, rng, style) {
                var node, cloneAnchors = null;

                for(var i= 0, len= nodeList.length; i<len; i++){
                    node = nodeList[i];
                    // 选取结束之前的之后或不在同一文档片段的直接跳出
                    if( UE.dom.domUtils.getPosition(node, refNode) == UE.dom.domUtils.POSITION_FOLLOWING ||
                        UE.dom.domUtils.getPosition(node, refNode) == UE.dom.domUtils.POSITION_DISCONNECTED ) continue;

                    if(node.nodeType === 1 && !hasNode(node, refNode)){
                        node.style.color = style;
                        $('.anchor', node).css({'color':style});
                    }else if(node.nodeType === 3 ){
                        if(UE.dom.domUtils.getPosition(node, refNode) == UE.dom.domUtils.POSITION_IDENTICAL){
                            node = refNode;
                        }
                        node.parentNode.replaceChild(wrapWithColorSpan(node.cloneNode(true), style), node);
                    }else{
                        node = refNode;
                        node.parentNode.replaceChild(wrapWithColorSpan(node.cloneNode(true), style), node);
                    }
                }

            }

            /*
             * 检测节点是否包含指定子节点
             *
             * @para [Node] parent 需要检测的节点
             * @para [Node] node 需要检测的包含节点
             * */
            function hasNode(parent, node) {
                if(node.nodeType === 3){
                    node = node.parentNode;
                }
                return parent.outerHTML.indexOf(node.outerHTML) != -1;
            }

            return {
                execCommand: function (cmdName, style, isAnchor) {
                    var range = this.selection.getRange();

                    if (!range.collapsed) {
                        if (isAnchor) {
                            range.applyInlineStyle('span', {
                                'style': style,
                                class: 'anchor'
                            });
                        } else {
                            markColor(range, style);
                        }
                        range.select();
                        mergesibling(range);
                    }

                    return true;

                },
                queryCommandValue: function () {
                    return '';
                },
                queryCommandState: function () {
                    return false;
                }
            }

        }());
    }

    // 标题太长省略，鼠标移入显示所有
    function _onTitleHoverShowTips() {
        $('#schema-title-list').on('mouseover','span', function(ev) {
            var tar = ev.target;
            var parent = $(tar).parents('li').eq(0);
            if(tar.scrollWidth > parent.outerWidth()){
                tar.title = tar.title || parent.text();
            }
        });
    }

    // 点击大纲标题，文档滚动
    function _onTitleClickRollContent() {
        $('#schema-title-list').on('click', function (ev) {
            var target = ev.target || window.event;

            if (target.nodeName.toLowerCase() === 'li' || target.nodeName.toLowerCase() === 'ul') return;
            target = _getAnchorAncestor(target);

            // 获取编辑器内的元素
            var iFrame = $('iframe','#editor-area').get(0)
                , iDocument = iFrame.contentWindow.document
                , iBody = iDocument.body
                , iThat = iDocument.getElementById(target.id);

            $(iBody).stop().animate({scrollTop: iThat.offsetTop}, 300, "swing");

        });

        /**
         * 返回最近的元素祖先节点
         *
         * @param {Node} tar 元素节点、或文本节点
         * @returns {Node} nodeType = 1
         */
        function _getAnchorAncestor(tar) {
            return $(tar).hasClass('anchor') && $(tar).attr('id')? tar : _getAnchorAncestor(tar.parentNode);
        }
    }

    // #bug 基本信息、方案、进程之间切换，编辑器高度不对
    function _bugTab() {
        $('li','.task-item-tab').click(function() {
            var curStatus = $('#taskVersionCheck').attr('data-status');
            var editable = curStatus/1 <= 0;
            if( $(this).index() === 1 ){
                adjustEditorHeight(editable);
            }
        });
    }

    /**
     * 在页面按钮附近显示状态消息
     *
     * @param {String} msg 消息内容
     * @param {Number} time 延时消失时间，ms
     * @returns {Number} 消息框消失的时间，默认2000ms
     */
    function _showAjaxStatus(msg, time, color) {
        color = color || '#1DD272';
        var html = $('<span class="schema-alertDiv" style="color:'+ color +';width:100px">' + msg + '</span>');
        var $alertDiv = $(".schema-alertDiv");
        if ($alertDiv.length > 0) {
            $alertDiv.remove();
        }
        $('#schema-save-btn').after(html);
        if (time < 0) {
            html.on('click', function () {
                $(this).remove();
            });
        } else {
            setTimeout(function () {
                html.remove();
            }, time || 2000);
        }
    }

    // 调整编辑器内标签节点
    function _adjustNode() {
        var iFrame = $('iframe', '#editor-area').get(0)
            , iDocument = iFrame.contentWindow.document
            , anchors = iDocument.getElementsByClassName('anchor') ;
        var beginTime = new Date().getTime();
        var container = uEditor.selection.getRange().endContainer;

        // 返回元素的第一个祖先元素
        function getElementNode(node) {
            return node.nodeType !== 1 ? getElementNode(node.parentNode) : node;
        }

        // 与下一个标题合并
        function mergeSibling(node) {
            if (!node.nextSibling || node.nextSibling.nodeType == 3) return;

            if (node.nextSibling.style.fontSize == '16px' || node.nextSibling.style.fontSize == '18px' || node.nextSibling.style.fontSize == '20px') {
                node.nextSibling.style.fontSize = node.style.fontSize;
                node.nextSibling.style.fontWeight = node.style.Weight;
                $(node.nextSibling).removeClass('anchor');
                node.appendChild(node.nextSibling);
                mergeSibling(node);
            }
        }

        // 删除合并
        /*        if (ue.selection.getRange().collapsed) {
         var cur = getElementNode(container);
         if (cur.nodeName.toLowerCase() == 'span' && ( cur.style.fontSize == '16px' || cur.style.fontSize == '18px' || cur.style.fontSize == '20px')) {
         $(cur).addClass('anchor');
         mergeSibling(cur);
         }
         }*/

        //mergeSiblingSame();
        /*
         * 依据style样式是否相同，合并相邻标题
         * */
        function mergeSiblingSame() {

            var iDocument = document.getElementById('ueditor_0').contentWindow.document;
            var rng = uEditor.selection.getRange();
            for (var i = 0; i < $('.anchor', iDocument).length - 1; i++) {
                var oCur = $('.anchor', iDocument).eq(i)[0];
                var oNext = getNotBookMark(oCur);
                if (oNext && oNext.nodeType == 1 && isStyleSame(oCur, oNext, ['fontSize', "fontWeight"])) {
                    oCur.innerHTML += oNext.innerHTML;
                    $(oNext).remove();
                    i--;
                }
            }
            /*
             * 获取下一个非ueditor创建的选区标记标签
             * */
            function getNotBookMark(obj) {

                var next = obj.nextSibling;
                var IsBookmark = next && next.nodeType == 1 && next.style.display == 'none';

                if (IsBookmark) {
                    return getNotBookMark(next);
                }
                return next;

            }

            function isStyleSame(obj, obj2, attrs) {

                if (!obj || !obj2) return false;
                for (var i = 0, len = attrs.length; i < len; i++) {
                    if (obj.style[attrs[i]] != obj2.style[attrs[i]]) {
                        return false;
                    }
                }

                return true;
            }

        }

        for (var i = 0; i < anchors.length; i++) {
            // 去除多层重复anchor
            var childrenAnchors = $('.anchor', anchors[i]);
            if (childrenAnchors.length > 0) {
                for (var j = 0; j < childrenAnchors.length; j++) {
                    var node = childrenAnchors[j];
                    try {
                        if (node.style.fontSize == anchors[i].style.fontSize && node.style.color != anchors[i].style.color) {
                            $(node).removeClass('anchor');
                        }
                    } catch (e) {
                        console.log(e);
                    }
                }
            }
        }
    }
    
    // 更新标题列表
    function _updateTitleList() {
        var iFrame = $('iframe', '#editor-area').get(0)
            , iDocument = iFrame.contentWindow.document
            , anchors = iDocument.getElementsByClassName('anchor')
            , tempStr = ''
            , $titleList = $('#schema-title-list')
            , beginTime = Date.now();

        $(anchors).each(function (index, anchor) {
            var that = this;
            var childrenAnchors = $('.anchor', this);

            childrenAnchors.each(function () {
                try {
                    if (this.style.fontSize == that.style.fontSize && this.style.color != that.style.color) {
                        $(this).removeClass('anchor');
                    }
                } catch (e) {
                    console.log(e);
                }
            });

            // 添加id,处理多标题嵌套
            if (!$(this).attr('id')) {
                $(this).attr('id', ++beginTime);
                $(this).children('.anchor').attr('id', ++beginTime);
            }

            var cloneAnchor = $(this).clone();
            cloneAnchor.find('img').remove();   // 标题中不允许图片
            tempStr += ('<li>' + cloneAnchor.get(0).outerHTML + '</li>');
        });

        tempStr = tempStr.replace(/<br>/ig, '');
        $titleList.html(tempStr);

    }

    // 向编辑器插入文件
    function _insertFile(file) {
        var img = document.createElement('img')
            , exName = file.extension.toUpperCase()
            , source
            , fileType;

        if(exName === "JPG" || exName === "JPEG" || exName === "BMP" || exName === "PNG" || exName === "GIF"){     // 图片格式
            source = configInfo.server_url + '/' + file.name;
            fileType = 'image';
        }else if(exName == "MP4" ){     // 视频格式
            source = 'images/video.png';
            fileType = 'video';
        }else if(exName === "ZIP" || exName === "RAR"){     // 压缩格式
            source = 'images/zip.gif';
            fileType = 'zip';
        }else{  // 不识别的格式
            source = 'images/video1.png';
            fileType = '';
        }

        $(img).addClass('isFile').attr({
            'fileId': file.id,
            'src': source,
            'fileType': fileType,
            'fileSrc': configInfo.server_url + '/' + file.name,
            'originalName': file.originalName
        });
        uEditor.selection.getRange().insertNode(img);
    }

    // 为编辑器内文件绑定click
    function _listenEditorInnerFileClick() {
        var iDocument = $('iframe', '#editor-area').get(0).contentWindow.document;

        $(iDocument).click(function (ev) {
            var target = ev.target;
            if ($(target).hasClass('isFile')) {
                var $files = getAllFiles();
                _showFilesViewer($files, ev.target);
            }
        });

        iDocument.oncontextmenu = function (ev) {
            var target = ev.target;
            if(! (target.nodeName.toLowerCase() == 'img')) return;

            _addContextMenu(iDocument, $(target).attr('fileSrc'), $(target).attr('originalName'));
            $('#contextMenu', iDocument).css({ left: ev.clientX + 'px', top: ev.clientY + 'px' });
            return false;
        };
        $(iDocument).click(function (ev) {
            if (ev.target.id != 'fileDownloadBtn')
                $('#contextMenu', iDocument).remove();
        });
    }

    // 下载上下文菜单
    function _addContextMenu(context, link, originName) {
        link = link || '';

        var doc = (typeof context.createElement) == 'function' ? context : document;
        var menu = doc.getElementById('contextMenu');
        if (!menu) {
            var ul = doc.createElement('ul');
            ul.id = 'contextMenu';
            ul.style.cssText = "width: 80px; position: fixed; top: 0;left: 0;background: #ffffff; z-index: 999; cursor: pointer;" +
                " opacity: .8; box-shadow: 1px 1px 3px #666; color: #333; padding: 0; text-align: center;";
            ul.contentEditable = false;
            ul.innerHTML = '<li id="fileDownloadBtn">下载…<input title="下载" id="fileDownload" style="width: 0;height: 0;' +
                'visibility: hidden;" onchange="window.top.schema.saveFile(this)" type="file" nwsaveas="默认名称"/></li>';
            !!context.body ? doc.body.appendChild(ul) : context.appendChild(ul);
        }

        // 点击下载
        context.onclick = function (ev) {
            var target = ev.target;
            if (target.id == 'fileDownloadBtn') {
                //下载前设置下名称
                $('#fileDownload', context).attr({
                    nwsaveas: originName,
                    fileSrc: link,
                    originName: originName
                }).trigger('click');
            }
        };
    }

    /*
    * nw保存（下载）文件
    * @param {InputElement} saveInput 需要为其添加 nwsaveas（可以不设值，但是建议给个默认值）、fileSrc（文件地址）、originName（原始文件名）属性并赋对应值
    * */
    function saveFile(saveInput) {

        var saveLink = saveInput.value
            , link = $(saveInput).attr('fileSrc')
            , originName = $(saveInput).attr('originName')
            , fileName = originName || /[^\/].*\.\w{3,4}/.exec(link);

        $(saveInput).val('');
        fileDownloader.addItem(link, saveLink, originName);

    }


    // 文件全屏预览
    function _showFilesViewer($images, activeFile) {

        var jqFileViewer = $('#schema-files-viewer');

        if(jqFileViewer.length == 0){
            $('#schema-files-viewer-loadBox').loadPage('schema.filesViewer.html');
            jqFileViewer = $('#schema-files-viewer');
        }
        // 显示图片查看框
        jqFileViewer.show();

        // 点击关闭
        $('#schema-files-viewer-close').click(function() {
            $('#schema-files-viewer').hide()
        });

        // 加入预览图片
        var tempStr = '';
        $images.map(function(index, val) {
            if($(this).attr('fileid') == $(activeFile).attr('fileid')){
                tempStr += '<li class="selected">' + this.outerHTML + '</li>';
            }else{
                tempStr += '<li>' + this.outerHTML + '</li>';
            }
        });
        $('.schema-thumb-list','#schema-files-viewer').html(tempStr);

        var $thumbFiles = $('.schema-thumb-list img','#schema-files-viewer');
        var filesLength = $thumbFiles.length;

        showCur(getActiveThumbFile());
        function getActiveThumbFile() {
            return $('.schema-thumb-list .selected img','#schema-files-viewer');
        }

        // 把当前激活的图片显示到主区域
        function showCur($active) {
            var viewer;

            switch( $active.attr('filetype') ) {
                case 'image':
                    viewer = $active.clone().css({opacity:0.1});
                    break;
                case 'video':
                    /*                    viewer = $($('<video controls="controls" autoplay="autoplay" class="isFile" style="opacity:.1">' +
                     '<source src="'+ $active.attr('filesrc') +'"/>' +
                     '</video>'));*/
                    viewer = $('<p  class="isFile" style="font-size:24px">暂不支持视频播放</p>');
                    break;
                case 'zip':
                    viewer = $('<p  class="isFile" style="font-size:24px">压缩格式，请下载后查看</p>');
                    break;
                default:
                    viewer = $('<p  class="isFile" style="font-size:24px">不能识别的格式</p>');


            }
            $('.schema-files-viewer-show .isFile','#schema-viewer-box').replaceWith(viewer);
            $('.schema-files-viewer-show .isFile','#schema-viewer-box').animate({opacity:1}, 300, 'linear');
            $('.viewer-title','#schema-viewer-box').html($active.attr('originalname'));
            $('#schema-viewer-file-input').attr({
                nwsaveas: $active.attr('originalname'),
                fileSrc: $active.attr('filesrc'),
                originName: $active.attr('originalname')
            })

        }

        // 下一个
        $('#schema-files-viewer-next').click(function() {
            var cur = getActiveThumbFile().parent().index();
            var next = (cur + 1) >= filesLength ? 0 : cur + 1;
            $thumbFiles.eq(cur).parent().removeClass('selected');
            var $next = $thumbFiles.eq(next);
            $next.parent().addClass('selected');
            showCur($next)
        });

        // 上一个
        $('#schema-files-viewer-prev').click(function() {
            var cur = getActiveThumbFile().parent().index();
            var next = cur - 1 < 0 ? filesLength - 1 : cur - 1;
            $thumbFiles.eq(cur).parent().removeClass('selected');
            var $next = $thumbFiles.eq(next);
            $next.parent().addClass('selected');
            showCur($next)
        });

        // 点击焦点切换
        $thumbFiles.click(function() {
            $('.schema-thumb-list li','#schema-files-viewer').removeClass('selected');
            $(this).parent().addClass('selected');
            showCur($(this));
        });
    }

    // 重置方案内容为初始内容
    function _resetContent() {
        var content = localStorage.getItem('schemaContent');
        uEditor.setContent(content);
    }

    // 设置编辑器是否可编辑
    function setEditable(boolean) {
        if(boolean){
            uEditor.setEnabled();
            $('a','#editor-operation').show();
            $('#schema-btn-wrap').show();
        }else{
            uEditor.setDisabled();
            $('a','#editor-operation').hide();
            $('#schema-btn-wrap').hide();
        }
    }

    // 获取编辑器内的所有图片
    function getAllFiles() {
        var  iDocument = $('iframe', '#editor-area').get(0).contentWindow.document;
        return $('.isFile', iDocument);
    }
    
    // 取消保存
    function cancelSave() {
        _resetContent();
    }
    
    // 保存方案
    function saveSchema(cbSuccess) {

        if( $('#schema-save-btn').get(0).className == 'schema-save-btn-disable' ){
            return;
        }

        cbSuccess = cbSuccess || function() {};

        var dataStr = ''
            , taskVersionId = getTaskVersionId()
            , schemaId = localStorage.getItem('schemaId');

        var schemaIdStr =  !!schemaId ? '&id=' + schemaId : '';
        dataStr = 'content=' + encodeURIComponent(uEditor.getContent()) + '&taskVersionId=' + taskVersionId + schemaIdStr + '&projectId=' + localStorage.getItem('projectId');

        $.ajax({
            url: '/api/plan/save',
            method: 'post',
            data: dataStr,
            success: function(result) {
                _showAjaxStatus('方案保存成功');
                localStorage.setItem('schemaId', result.target );
                localStorage.setItem('schemaContent', uEditor.getContent() );
                _setSaveBtnStatus();
                cbSuccess();
            },
            error: function(e) {
                _showAjaxStatus('方案保存失败！',-1, '#f00');
                console.log(e);
            }
        });
    }

    // 获取任务版本
    function getTaskVersionId() {
        var taskVersionId = $('#taskVersionCheck').get(0).dataset.value;
        return taskVersionId == '' ? void 0 : taskVersionId;
    }

    // 根据任务版本id设置方案内容
    function setByTaskVersionId( taskVersionId ) {
        $.ajax({
            method: 'get',
            url: '/api/plan/' + taskVersionId,
            success: function (data) {
                if (data.list && data.list.id) {
                    var schemaId = data.list.id;
                    var content = data.list.content;
                    localStorage.setItem('schemaId', schemaId ? schemaId : void 0);
                    localStorage.setItem('schemaContent', content);
                    uEditor.setContent( decodeURIComponent(data.list.content));
                    deleteRubbishFiles();
                } else {
                    uEditor.setContent('');
                    localStorage.setItem('schemaContent', '');
                }
            },
            error: function () { }
        })
    }

    // 调整编辑器的高度
    function adjustEditorHeight(editable) {
        var btnWrapHeight = editable ? $('#schema-btn-wrap').outerHeight() : 0;
        var h = $('.task-item-content').outerHeight() - btnWrapHeight - 33;
        $('#schema-area').height(h);
        uEditor.setHeight($('#editor-area').height());
    }

    function deleteRubbishFiles() {
        var $files = getAllFiles(), fileIds = [];
        $files.each(function() {
            fileIds.push($(this).attr('fileid'))
        });
        $.ajax({
            method: 'post',
            url:'/api/plan/delRubbishFiles',
            data: {
                taskVersionId: localStorage.getItem('thisTaskVersionId'),
                remainFiles: JSON.stringify(fileIds)
            },
            success: function(result) {
                //console.log('成功删除个数：' +　result.list);
            },
            fail: function(e) {console.error('删除冗余文件失败!',e);}
        })
    }

    function _setSaveBtnStatus() {
        var classStr = _isSchemaChange() ? 'schema-save-btn-enable' : 'schema-save-btn-disable';
        $('#schema-save-btn').get(0).className = classStr;
    }

    function _isSchemaChange() {
        var oldContent = localStorage.getItem('schemaContent');
        var newContent = uEditor.getContent();
        return newContent != oldContent;
    }



    return {
        init: init,
        save: saveSchema,
        cancel: cancelSave,
        setByTaskVersionId: setByTaskVersionId,
        adjustEditorHeight: adjustEditorHeight,
        getAllFiles: getAllFiles,
        setEditable: setEditable,
        saveFile: saveFile
    }

})();

