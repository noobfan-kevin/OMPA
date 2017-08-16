/**
 * Created by HK059 on 2016/6/14.
 */
var publicDataBase = function(){
    var userId;
    var nodeTree;
    var publicDB;
    var homePage;
    var catalogPage;
    var nodeManage;
    var fileManage;
    var nodeDetails;
    var fileDetails;
    var switchFlag;
    var flag;
    var zTree;
    var fatherId;
    var nodeId;
    var nodeName;
    var nodeIndexKey;
    var fileName;
    var fileTitle;
    var curIndexKey;
    var isChangeNodeInfo;
    var folderPath;
    var thumbnailPath;
    var curThumbnailPath;
    var targetNode;
    var oneKeyModel = $('<li class="nodeIndexInfo clearfix">'+
        '<input type="text" class="fl indexTitle" title="" value="" />'+
        '<i class="fl colon"> ：</i>'+
        '<ul class="fl indexOption">'+
            '<li class="fl addOption">'+
                '<i class="iconfont add">&#xe641;</i>'+
            '</li>'+
        '</ul>'+
        '<i class="iconfont deleteIndex">&#xe628;</i>'+
    '</li>');
    var oneOptionModel = $('<li class="fl nodeIndexKey">'+
        '<input type="text" title="索引值" class="inputInfo">'+
        '<i class="iconfont cancel">&#xe699;</i>'+
    '</li>');
    var nodeModel = $('<li class="fl oneFile">'+
        '<div class="marginBox">'+
            '<div class="fileContent">'+
                '<img src="" class="markedPicture">'+
                '<span class="filesCount"></span>'+
                '<div class="fileShadow">'+
                    '<span class="type"></span>'+
                    '<span class="size"></span>'+
                    '<span class="clearfix iconSpan">'+
                        '<i class="iconfont edit fl" title="详情">&#xe69b;</i>'+
                        '<i class="iconfont delete fl" title="删除">&#xe698;</i>'+
                        '<i class="iconfont download fl" title="下载">&#xe66c;</i>'+
                    '</span>'+
                '</div>'+
            '</div>'+
            '<span class="fileTitle"></span>'+
        '</div>'+
    '</li>');
    var indexModel = $('<li class="optionItem">'+
        '<span class="optionName"></span>'+
        '<ul class="oneIndexKey clearfix"></ul>'+
    '</li>');
    var oneIndexModel = $('<li class="oneIndex clearfix">'+
        '<span class="fl indexName"></span>'+
        '<div class="fl allIndexOption"></div>'+
    '</li>');
    var indexChecked = $('<li class="fl oneSelectedItem">'+
        '<span class="indexCheckedName"></span>'+
        '<span class="optionChecked"></span>'+
        '<i class="iconfont">&#xe628;</i>'+
    '</li>');
    var oneTitle = $('<li class="fl keyWordInfo">'+
        '<input type="text" class="inputInfo" title="" />'+
        '<i class="iconfont cancel">&#xe699;</i>'+
    '</li>');
    var uploadFileModel = $('<li class="uploadFile">'+
        '<span></span>'+
        '<div class="load-bar">'+
        '<div class="load-bar-inner" style="width:0"></div>'+
        '</div>'+
        '<i class="iconfont cancel">&#xe699;</i>'+
        '</li>');
    return {
        //初始化
        init: function () {
            userId = localStorage.getItem('userId');
            nodeTree = new ZTreeObj('');
            publicDB = $('.publicDB_main');
            homePage = $('.homePage');
            catalogPage = $('.catalogPage');
            nodeManage = $('.nodeManage');
            fileManage = $('.fileManage');
            nodeDetails = $('.nodeDetails');
            fileDetails = $('.fileDetails');
            zTree = $('#publicDBTree');
            switchFlag = [];
            this.initTree();
            this.bindEvent();
        },
        //绑定事件
        bindEvent: function () {
            var that = this;
            //首页搜索条
            homePage.on('scroll', function () {
                //console.log($(this).scrollTop());
                if ($(this).scrollTop() > 54) {
                    homePage.find('.searchArea').css({
                        'top': $(this).scrollTop() + 'px',
                        'bottom': 'auto'
                    });
                } else {
                    homePage.find('.searchArea').css({
                        'top': 0,
                        'bottom': 0
                    });
                }
            });
            //遮罩层
            homePage.on('mouseover', '.file', function () {
                $(this).find('.shadow').show();
                $(this).css('border-color', '#2dc3e8');
            }).on('mouseout', '.file', function () {
                $(this).find('.shadow').hide();
                $(this).css('border-color', '#d5d5d5');
            });
            catalogPage.on('mouseover', '.oneFile', function () {
                $(this).find('.fileShadow').show();
                $(this).find('.marginBox').css('border-color', '#2dc3e8');
            }).on('mouseout', '.oneFile', function () {
                $(this).find('.fileShadow').hide();
                $(this).find('.marginBox').css('border-color', '#d5d5d5');
            });
            /*切换页面开始*/
            //切换首页分类页
            publicDB.on('click', '#aside-nav li', function (){
                if ($(this).hasClass('homePageNav')) {
                    homePage.show().siblings().hide();
                    zTree.hide();
                    publicDB.find('.addRoot').hide();
                } else {
                    that.initNodeContent('root');
                    catalogPage.show().siblings().hide();
                    nodeTree.cancelSelectedNode('publicDBTree');
                    publicDB.find('.addRoot').show();
                    catalogPage.find('.uploadFileBtn').hide();
                    zTree.show();
                }
                switchFlag = [];
                $(this).addClass('current').siblings().removeClass('current');
            });
            //切换详情页
            homePage.on('click', '.edit', function (){
                targetNode = $(this).parent().parent().parent().parent().parent();
                switchFlag.unshift(homePage);
                fileDetails.show().siblings().hide();
            });
            catalogPage.on('click', '.edit', function (){
                targetNode = $(this).parent().parent().parent().parent().parent();
                nodeId = $(this).parent('.iconSpan').attr('nodeId');
                if ($(this).parent().hasClass('isFolder')) {
                    that.getOneNodeInfo({
                        nodeId : nodeId,
                        callback : function(data){
                            that.nodeInfoRender(data,true);
                        }
                    });
                    nodeDetails.show().siblings().hide();
                }else{
                    that.getOneNodeInfo({
                        nodeId : nodeId,
                        callback : function(data){
                            that.fileInfoRender(data,true);
                        }
                    });
                    fileDetails.show().siblings().hide();
                }
                switchFlag.unshift(catalogPage);
            });
            //返回按键
            publicDB.on('click', '.goBack', function () {
                switchFlag[0].show().siblings().hide();
                switchFlag.shift();
            });
            //切换管理页
            fileDetails.on('click', '.editBtn', function (){
                fileManage.find('.allIndex').html('');
                fileManage.find('.nodeFile').hide();
                isChangeNodeInfo = true;
                if(curThumbnailPath){
                    fileManage.find('.thumbnailPicture').attr('src', configInfo.server_url + '/' + curThumbnailPath).show().next().hide();
                }else{
                    fileManage.find('.thumbnailPicture').hide().next().show();
                }
                fileManage.find('.nodeNameInput').val(fileName);
                $.each(fileTitle,function(i,n){
                    var str = oneTitle.clone();
                    str.find('input').val(n);
                    fileManage.find('.addKeyWord').before(str);
                });
                var html = fileDetails.find('.allIndex').clone();
                fileManage.find('.allIndex').append(html);
                switchFlag.unshift(fileDetails);
                fileDetails.hide();
                fileManage.show();
            });
            nodeDetails.on('click', '.editBtn', function (){
                nodeManage.find('.nodeAllIndex').children().not('.addIndex').off().remove();
                isChangeNodeInfo = true;
                if(curThumbnailPath){
                    nodeManage.find('.thumbnailPicture').attr('src', configInfo.server_url + '/' + curThumbnailPath).show().next().hide();
                }else{
                    nodeManage.find('.thumbnailPicture').hide().next().show();
                }
                nodeManage.find('.nodeNameInput').val(nodeName);
                $.each(nodeIndexKey,function(i){
                    var html = oneKeyModel.clone();
                    html.find('.indexTitle').val(i);
                    $.each(nodeIndexKey[i],function(j,m){
                        var str = oneOptionModel.clone();
                        str.find('.inputInfo').val(m);
                        html.find('.addOption').before(str);
                    });
                    nodeManage.find('.addIndex').before(html);
                });
                switchFlag.unshift(nodeDetails);
                nodeDetails.hide();
                nodeManage.show();
            });
            publicDB.on('click', '.addRoot', function (event) {
                event.stopPropagation();
                switchFlag.unshift(that.getCurPage());
                nodeManage.show().siblings().hide();
                fatherId = 'root';
            });
            /*切换页面结束*/
            /*节点管理开始*/
            //上传缩略图
            nodeManage.on('click','.uploadThumbnail,.thumbnailPicture',function(){
                $(this).siblings('input').click();
            });
            nodeManage.on('change','.uploadThumbnailBtn',function(){
                that.uploadFileImg(this.files);
                $(this).val('');
            });
            //增加索引
            nodeManage.on('click','.addIndex',function(){
                var html = oneKeyModel.clone();
                $(this).before(html);
            });
            //增加索引项
            nodeManage.on('click','.add',function(){
                var html = oneOptionModel.clone();
                $(this).parent().before(html);
            });
            //删除索引
            nodeManage.on('click','.deleteIndex',function(){
                $(this).parent().off().remove();
            });
            //删除索引项
            nodeManage.on('mouseover','.nodeIndexKey',function(){
                $(this).find('.cancel').show();
            }).on('mouseout','.nodeIndexKey',function(){
                $(this).find('.cancel').hide();
            });
            nodeManage.on('click','.cancel',function(){
                $(this).parent().off().remove();
            });
            //新建修改节点
            nodeManage.on('click','.saveBtn',function(){
                var name = nodeManage.find('.nodeNameInput').val();
                var indexKey = {};
                var indexOption;
                var allIndex = nodeManage.find('.indexTitle');
                var allEffectiveIndex = [];
                var allEffectiveIndexKey = [];
                flag = false;
                for(var j=0;j<allIndex.length;j++){
                    if($.trim(allIndex[j])!==''){
                        allEffectiveIndex.push(allIndex[j]);
                        allEffectiveIndexKey.push(allIndex[j].value);
                    }
                }
                if($.trim(name) === ''){
                    that.warnMessage('节点名称不能为空！');
                    return;
                }
                if(that.isRepeat(allEffectiveIndexKey)){
                    that.warnMessage('索引名称不能重复！');
                    return;
                }
                for(var i=0;i<allEffectiveIndex.length;i++){
                    indexOption = [];
                    $(allEffectiveIndex[i]).siblings('.indexOption').find('.inputInfo').each(function(i,n){
                        if($.trim($(n).val())!==''){
                            indexOption.push($(n).val());
                        }
                    });
                    if(indexOption.length>0){
                        indexKey[$(allEffectiveIndex[i]).val()] = indexOption;
                        flag = true;
                    }
                }
                if(!isChangeNodeInfo){
                    if (!flag && fatherId === 'root') {
                        that.warnMessage('根目录索引不能为空！');
                        return;
                    }
                    that.addNode({
                        name: name,
                        fatherId: fatherId,
                        userId: userId,
                        indexKey: JSON.stringify(indexKey),
                        imgPath : thumbnailPath||'',
                        callback: function (data) {
                            if (data.ok) {
                                //that.initNodeContent(fatherId);
                                that.nodeContentRender(data.info);
                                catalogPage.show().siblings().hide();
                                switchFlag = [];
                                nodeTree.addNode(name, fatherId, 'publicDBTree', data.info.id);
                                nodeManage.find('.thumbnailPicture').hide().next().show();
                                nodeManage.find('.nodeNameInput').val('');
                                nodeManage.find('.nodeIndex ul').children('li').not('.addIndex').off().remove();
                            } else {
                                that.infoMessage(data.info);
                            }
                        }
                    })
                }else{
                    if (!flag) {
                        that.warnMessage('索引不能为空！');
                        return;
                    }
                    that.modifyNode({
                        name : name,
                        oldName : nodeName,
                        nodeId : nodeId,
                        indexKey : JSON.stringify(indexKey),
                        imgPath : thumbnailPath||'',
                        callback: function (data) {
                            //console.log(data);
                            that.nodeInfoRender(data,false);
                            nodeTree.UpdateNode('publicDBTree', fatherId, data.id, name);
                            if(data.imgPath){
                                targetNode.find('img').attr('src',configInfo.server_url + '/' + data.imgPath);
                            }
                            targetNode.find('.fileTitle').html(data.originalName);
                            switchFlag[0].show().siblings().hide();
                            switchFlag.shift();
                        }
                    });
                }
            });
            //取消新建
            nodeManage.on('click','.cancelBtn',function(){
                switchFlag[0].show().siblings().hide();
                switchFlag.shift();
                nodeManage.find('.thumbnailPicture').hide().next().show();
                nodeManage.find('.nodeNameInput').val('');
                nodeManage.find('.nodeIndex ul').children('li').not('.addIndex').off().remove();
            });
            /*节点管理结束*/
            /*文件管理开始*/
            //显示文件管理页面
            catalogPage.on('click','.uploadFileBtn',function(){
                thumbnailPath = null;
                isChangeNodeInfo = false;
                fileManage.find('.nodeFile').show();
                fatherId = zTree.find('.selectedNode').siblings('div').attr('id');
                that.getOneNodeInfo({
                    nodeId : fatherId,
                    callback : function(data){
                        folderPath = JSON.parse(data.originalNames).join('/');
                    }
                });
                fileManage.find('.allIndex').html('');
                $.each(curIndexKey,function(i){
                    var html = oneIndexModel.clone();
                    var str = [];
                    html.find('.indexName').html(i+' ：');
                    $.each(curIndexKey[i],function(j,m){
                        str.push('<span class="oneIndexOption">' + m + '</span>');
                    });
                    html.find('.allIndexOption').html(str.join(''));
                    fileManage.find('.allIndex').append(html);
                });
                switchFlag.unshift(that.getCurPage());
                fileManage.show().siblings().hide();
            });
            //上传缩略图
            fileManage.on('click','.uploadThumbnail,.thumbnailPicture',function(){
                $(this).siblings('input').click();
            });
            fileManage.on('change','.uploadThumbnailBtn',function(){
                that.uploadFileImg(this.files);
                $(this).val('');
            });
            //上传文件
            fileManage.on('click','.addFileBtn',function(){
                fileManage.find('#uploadFileBtn').click();
            });
            fileManage.on('change','#uploadFileBtn',function(){
                that.uploadFile(this.files);
                $(this).val('');
            });
            //添加关键字
            fileManage.on('click','.addTitle',function(){
                var html = oneTitle.clone();
                $(this).parent().before(html);
            });
            //删除按钮
            fileManage.on('mouseover','.keyWordInfo',function(){
                $(this).find('.cancel').show();
            }).on('mouseout','.keyWordInfo',function(){
                $(this).find('.cancel').hide();
            });
            fileManage.on('mouseover','.uploadFile',function(){
                $(this).find('.cancel').show();
            }).on('mouseout','.uploadFile',function(){
                $(this).find('.cancel').hide();
            });
            fileManage.on('click','.cancel',function(){
                $(this).parent().off().remove();
            });
            //选择索引项
            fileManage.on('click','.oneIndexOption',function(){
                if(!$(this).hasClass('checked')){
                    $(this).addClass('checked').siblings().removeClass('checked');
                }else{
                    $(this).removeClass('checked');
                }
            });
            //保存文件
            fileManage.on('click','.saveBtn',function(){
                var name = fileManage.find('.nodeNameInput').val();
                if($.trim(name) === ''){
                    that.warnMessage('节点名称不能为空！');
                    return;
                }
                var indexKeyChecked = [];
                $.each(fileManage.find('.checked'),function(i,n){
                    var keyValue = {};
                    keyValue[$(n).parent().prev().html().replace(' ：','')] = $(n).html();
                    indexKeyChecked.push(keyValue);
                });
                var keyWord = [];
                $.each(fileManage.find('.inputInfo'),function(i,n){
                    keyWord.push($(n).val());
                });
                var subordinateNode = [];
                var attachmentName = [];
                $.each(fileManage.find('.uploadFile span'),function(i,n){
                    subordinateNode.push($(n).html());
                    attachmentName.push($(n).attr('fileName'));
                });
                if(!isChangeNodeInfo) {
                    if (subordinateNode.length === 0) {
                        that.warnMessage('上传文件不能为空！');
                        return;
                    }
                    that.addFile({
                        name: name,
                        fatherId: fatherId,
                        userId: userId,
                        indexKey: JSON.stringify(indexKeyChecked),
                        title: JSON.stringify(keyWord),
                        subordinateNode: JSON.stringify(subordinateNode),
                        imgPath: thumbnailPath || '',
                        attachmentName : JSON.stringify(attachmentName),
                        callback: function (data) {
                            if (data.ok) {
                                //that.initNodeContent(fatherId);
                                that.nodeContentRender(data.info);
                                catalogPage.show().siblings().hide();
                                switchFlag = [];
                                fileManage.find('.thumbnailPicture').hide().next().show();
                                fileManage.find('.nodeNameInput').val('');
                                fileManage.find('.uploadFile').not('.addFile').off().remove();
                                fileManage.find('.keyWord ul').children('li').not('.addKeyWord').off().remove();
                            } else {
                                that.infoMessage(data.info);
                            }
                        }
                    });
                }else{
                    that.modifyNode({
                        name : name,
                        oldName : fileName,
                        nodeId : nodeId,
                        indexKey : JSON.stringify(indexKeyChecked),
                        title: JSON.stringify(keyWord),
                        imgPath : thumbnailPath||'',
                        callback: function (data) {
                            //console.log(data);
                            that.fileInfoRender(data,false);
                            if(data.imgPath){
                                targetNode.find('img').attr('src',configInfo.server_url + '/' + data.imgPath);
                            }
                            targetNode.find('.fileTitle').html(data.originalName);
                            switchFlag[0].show().siblings().hide();
                            switchFlag.shift();
                        }
                    });
                }
            });
            //取消保存文件
            fileManage.on('click','.cancelBtn',function(){
                switchFlag[0].show().siblings().hide();
                switchFlag.shift();
                fileManage.find('.thumbnailPicture').hide().next().show();
                fileManage.find('.nodeNameInput').val('');
                fileManage.find('.keyWord ul').children('li').not('.addKeyWord').off().remove();
            });
            //下载文件
            fileManage.on('click','.downLoadFile',function(){
                fileManage.find('.contextMenu').css('display','none');
                checkedArr = [];
                fileManage.find('.checked.isFile').each(function(i,n){
                    checkedArr.push({
                        'id' : $(n).attr('fileId'),
                        'originName' : $(n).find('p').html()
                    });
                });
                if(checkedArr.length !== 0){
                    if(checkedArr.length === 1){
                        fileManage.find('#downLoadFile').attr('nwsaveas',checkedArr[0].originName).removeAttr('nwdirectory');
                    }else{
                        fileManage.find('#downLoadFile').attr('nwdirectory','nwdirectory');
                    }
                    fileManage.find('#downLoadFile').click();
                }else{
                    that.warnMessage(11+'%',44+'px','请选择文件下载!');
                }
                //console.log(checkedArr);
            });
            fileManage.on('change','#downLoadFile',function(){
                var filePath = configInfo.server_url + '/api/projectDataBase/download/';
                var that = this;
                if(checkedArr.length === 1){
                    fileDownloader.addItem(filePath + checkedArr[0].id,this.value,checkedArr[0].originName);
                }else {
                    $.each(checkedArr, function (i, n) {
                        fileDownloader.addItem(filePath + n.id, that.value+'\\'+n.originName, n.originName);
                    });
                }
                $(this).val('');
            });
            /*文件管理结束*/
            //删除节点
            publicDB.on('click', '.delete', function(){
                nodeId = $(this).parent('.iconSpan').attr('nodeId');
                fatherId = zTree.find('.selectedNode').siblings('div').attr('id');
                targetNode = $(this).parent().parent().parent().parent().parent();
                that.deleteNode({
                    id : nodeId,
                    fatherId : fatherId,
                    callback : function(){
                        targetNode.off().remove();
                    }
                });
                if($(this).parent('.iconSpan').hasClass('isFolder')){
                    nodeTree.deleteFile('publicDBTree', nodeId);
                }
            });
            publicDB.on('click', '.deleteBtn', function(){
                fatherId = zTree.find('.selectedNode').siblings('div').attr('id');
                that.deleteNode({
                    id : nodeId,
                    fatherId : fatherId,
                    callback : function(){
                        targetNode.off().remove();
                    }
                });
                if(publicDB.find('.current').hasClass('catalogPageNav')){
                    catalogPage.show().siblings().hide();
                }else{
                    homePage.show().siblings().hide();
                }
                switchFlag = [];
                if(fileDetails.is(':visible')) return;
                nodeTree.deleteFile('publicDBTree', nodeId);
            });
            //切换节点
            catalogPage.on('dblclick','.isFolder',function(){
                nodeId = $(this).attr('folderId');
                catalogPage.find('.uploadFileBtn').show();
                that.initNodeContent(nodeId);
                nodeTree.selectNode('publicDBTree',nodeId);
            });
            //文件名称输入限制
            publicDB.on('input','.nodeNameInput',function(){
                //var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
                var reg = /[`~!@#$%\^\+\*&\\\/<>\?\|:{}()';="]/;
                if(reg.test($(this).val())){
                    $(this).val($(this).val().replace(reg, function () {
                        that.warnMessage('非法字符输入！');
                        return '';
                    }));
                }
                $(this).attr('title',$(this).val());
            });
            /*文件筛选开始*/
            //选中取消条件
            catalogPage.on('click','.oneOption',function(){
                if(!$(this).hasClass('checked')){
                    $(this).addClass('checked');
                    if(!$(this).siblings().hasClass('checked')){
                        that.loadSelectedCondition($(this).parent().prev().html(),$(this).html());
                    }else{
                        that.addSelectedCondition($(this).parent().prev().html(),$(this).html());
                    }
                }else{
                    $(this).removeClass('checked');
                    if(!$(this).siblings().hasClass('checked')){
                        that.removeOneIndex($(this).parent().prev().html());
                    }else{
                        that.removeOneOption($(this).parent().prev().html(),$(this).html());
                    }
                }
            });
            //取消所有条件
            catalogPage.on('click','.oneSelectedItem i',function(){
                var _this = this;
                catalogPage.find('.optionItem').each(function(i,n){
                    if($(_this).siblings('.indexCheckedName').html() === $(n).find('.optionName').html()){
                        $(n).find('.checked').removeClass('checked');
                        return false;
                    }
                });
                $(this).parent().off().remove();
            });
            /*文件筛选结束*/
        },
        //初始化左侧树结构
        initTree: function () {
            var that = this;
            var setting = {
                view: {
                    selectedMulti: false,
                    showIcon: false,
                    showLine: false,
                    addHoverDom: function(treeId, treeNode) {
                        var aObj = $('#' + treeNode.tId + '_a');
                        if ($('#diyBtn_'+treeNode.id).length>0) return;
                        var editStr = '<span id="diyBtn_space_' +treeNode.id+ '" > </span>'
                            + '<i class="iconfont addFolder diyBtn1" id="diyBtn_' + treeNode.id
                            + '" title="新建子节点">&#xe641;</i>';
                        aObj.append(editStr);
                        var btn = aObj.find('#diyBtn_'+treeNode.id);
                        if (btn) btn.on('click', function(event){
                            event.stopPropagation();
                            isChangeNodeInfo = false;
                            thumbnailPath = null;
                            nodeManage.find('.nodeAllIndex').children().not('.addIndex').off().remove();
                            nodeManage.find('.nodeNameInput').val('');
                            if(!$(this).parent().hasClass('selectedNode')) {
                                $(this).parent().click();
                            }
                            switchFlag.unshift(that.getCurPage());
                            nodeManage.show().siblings().hide();
                            fatherId = $(this).parent().siblings('div').attr('id');
                        });
                    },
                    removeHoverDom: function(treeId, treeNode) {
                        $('#diyBtn_'+treeNode.id).off().remove();
                        $('#diyBtn_space_' +treeNode.id).off().remove();
                    }
                },
                edit: {
                    enable: false
                },
                data: {
                    simpleData: {
                        enable: true
                    }
                },
                callback: {
                    onClick: function (event, treeId, treeNode) {
                        publicDB.find('.addRoot').hide();
                        catalogPage.find('.uploadFileBtn').show();
                        that.initNodeContent(treeNode.id);
                    }
                }
            };
            var zNodes = this.getAllNodes();
            $.fn.zTree.init(zTree, setting, zNodes);
        },
        //新建节点
        addNode : function(json) {
            json.left = json.left||(46+'%');
            json.top = json.top||(11+'px');
            var that = this;
            $.ajax({
                url : '/api/publicDataBase/newFolder',
                type: 'post',
                data : 'name='+json.name+'&fatherId='+json.fatherId+'&creatorId='+json.userId+'&indexKey='+json.indexKey,
                success: function (data) {
                    json.callback&&json.callback(data);
                },
                error: function(){
                    that.warnMessage('节点添加失败！',json.left,json.top);
                }
            });
        },
        //删除节点
        deleteNode : function(json) {
            json.left = json.left||(46+'%');
            json.top = json.top||(11+'px');
            var that = this;
            $.ajax({
                url : '/api/publicDataBase/file/'+json.id,
                type: 'delete',
                data: 'fatherId='+json.fatherId,
                success: function(){
                    json.callback&&json.callback();
                },
                error: function(){
                    that.warnMessage('文件删除失败！',json.left,json.top);
                }
            });
        },
        //修改节点
        modifyNode : function(json){
            json.left = json.left||(46+'%');
            json.top = json.top||(11+'px');
            var that = this;
            $.ajax({
                url:'/api/publicDataBase/update',
                type: 'post',
                data : 'name='+json.name+'&oldName='+json.oldName+'&nodeId='+json.nodeId+'&indexKey='+json.indexKey+
                '&imgPath='+json.imgPath+'&title='+json.title,
                success: function(result){
                    json.callback&&json.callback(result);
                },
                error: function(){
                    that.warnMessage('节点修改失败！',json.left,json.top);
                }
            });
        },
        //上传文件
        uploadFile : function(files){
            var that = this;
            var processOneAttachment= function(file){
                var formData= new FormData();
                formData.append('fatherId', fatherId);
                formData.append('folderPath', folderPath);
                formData.append('publicFiles', file);
                var oneUploadFile = uploadFileModel.clone();
                var xhr= new XMLHttpRequest();
                oneUploadFile.find('span').html(file.name);
                fileManage.find('.addFile').before(oneUploadFile);
                oneUploadFile.find('i').on('click',function(){
                    xhr.abort();
                    var filePath = $(this).parent().attr('filePath');
                    if(filePath){
                        that.deleteAttachment({
                            path : filePath
                        });
                    }
                });
                //catalogPage.find('.filesList').prepend(oneUploadFile);

                xhr.onreadystatechange= function(){
                    if(this.readyState==4){
                        if(this.status==200){
                            oneUploadFile.attr('filePath',JSON.parse(xhr.responseText).path);
                            oneUploadFile.find('span').attr('fileName',JSON.parse(xhr.responseText).filename);
                        }else{
                            that.warnMessage('文件'+ file.name+ '上传失败');
                            oneUploadFile.remove();
                        }

                    }
                };

                xhr.upload.onprogress= function(event){
                    if(event.lengthComputable){
                        var percentage = parseInt((event.loaded/ event.total)* 100);
                        oneUploadFile.find('.load-bar-inner').css('width',percentage+'%').addClass('proceed');
                        if(percentage == 100){
                            oneUploadFile.find(".load-bar-inner").removeClass('proceed').addClass('complete');
                        }
                    }
                };
                xhr.upload.onabort=function(){
                    xhr.upload.onprogress = null;
                    oneUploadFile.remove();
                    that.infoMessage('文件'+ file.name+ '取消上传！');
                };
                xhr.upload.onerror=function(){
                    xhr.upload.onprogress = null;
                };
                xhr.open('post', configInfo.server_url+ '/api/publicDataBase/upload');
                xhr.send(formData);
            };

            for(var i=0;i< files.length;i++){
                processOneAttachment(files[i]);
            }
        },
        //上传缩略图
        uploadFileImg : function(file){
            var imgLocalPath = file[0].path;
            var that = this;
            var flag = true;
            var imgExt = ['png','jpg','jpeg','gif','bmp'];
            var ext = file[0].name.substring(file[0].name.lastIndexOf('.')+1);
            for (var i = 0; i < imgExt.length; i++) {
                if (ext.toLowerCase() === imgExt[i]) {
                    flag = false;
                    break;
                }
            }
            if(flag) {
                that.infoMessage('请选择图片上传！');
                return;
            }
            var formData = new FormData();
            formData.append('publicThumbnail', file[0]);
            var xhr= new XMLHttpRequest();
            xhr.onreadystatechange= function(){
                if(this.readyState==4){
                    if(this.status==200){
                        //console.log(xhr.responseText);
                        thumbnailPath = 'publicThumbnail/'+JSON.parse(xhr.responseText).filename;
                        if(fileManage.is(':visible')){
                            fileManage.find('.thumbnailPicture').attr('src', imgLocalPath).show().next().hide();
                        }else{
                            nodeManage.find('.thumbnailPicture').attr('src', imgLocalPath).show().next().hide();
                        }
                    }else{
                        that.warnMessage('图片上传失败');
                    }
                }
            };
            xhr.open('post', configInfo.server_url+ '/api/publicDataBase/upload');
            xhr.send(formData);
        },
        //新建节点
        addFile : function(json) {
            json.left = json.left||(46+'%');
            json.top = json.top||(11+'px');
            var that = this;
            $.ajax({
                url : '/api/publicDataBase/newFile',
                type: 'post',
                data : 'name='+json.name+'&fatherId='+json.fatherId+'&creatorId='+json.userId+'&imgPath='+json.imgPath+
                '&indexKey='+json.indexKey+'&title='+json.title+'&subordinateNode='+json.subordinateNode+
                '&attachmentName='+json.attachmentName,
                success: function (data) {
                    json.callback&&json.callback(data);
                },
                error: function(){
                    that.warnMessage('节点添加失败！',json.left,json.top);
                }
            });
        },
        //获取所有节点
        getAllNodes : function(){
            var that = this;
            var dataList = [];
            $.ajax({
                url : '/api/publicDataBase/allNodes',
                type: 'get',
                async: false,
                success : function(data){
                    for(var i=0;i<data.length;i++){
                        dataList.push({
                            id : data[i].id,
                            pId : data[i].parentId,
                            name : data[i].originalName
                        });
                    }
                },
                error: function(err){
                    console.log(err);
                    that.warnMessage('获取信息失败！');
                }
            });
            return dataList;
        },
        //获取单个节点内容
        getOneNodeContent : function(json){
            json.left = json.left||(46+'%');
            json.top = json.top||(11+'px');
            var that = this;
            $.ajax({
                url : '/api/publicDataBase/father/'+json.fatherId,
                type: 'get',
                success : function(data){
                    //console.log(data);
                    json.callback&&json.callback(data);
                },
                error: function(err){
                    console.log(err);
                    that.warnMessage('获取节点信息失败！',json.left,json.top);
                }
            });
        },
        //初始化节点内容
        initNodeContent : function(fatherId){
            var that = this;
            catalogPage.find('.allSelectedItem').html('');
            catalogPage.find('.allOptions').html('');
            catalogPage.find('.filesList').html('');
            catalogPage.show().siblings().hide();
            switchFlag = [];
            this.getOneNodeContent({
                fatherId : fatherId,
                callback : function(list){
                    for(var i=0;i<list.childNodes.length;i++){
                        that.nodeContentRender(list.childNodes[i]);
                    }
                    if(list.indexKey){
                        curIndexKey = JSON.parse(list.indexKey);
                        that.nodeIndexRender(curIndexKey);
                        $(catalogPage.find('.optionItem')[0]).addClass('removeLine');
                        catalogPage.find('.allOptions').show();
                    }else{
                        catalogPage.find('.allOptions').hide();
                    }
                }
            });
        },
        //节点内容加载
        nodeContentRender : function(file){
            //console.log(file);
            var html = nodeModel.clone();
            html.find('.fileTitle').html(file.originalName);
            if(file.imgPath/*&&file.imgPath !== 'undefined'*/){
                html.find('img').attr('src',configInfo.server_url + '/' + file.imgPath);
            }else{
                html.find('img').attr('src','images/default.jpg');
            }
            if(file.isFolder){
                html.attr('folderId',file.id).addClass('isFolder');
                html.find('.iconSpan').attr('nodeId',file.id).addClass('isFolder');
                html.find('.filesCount').html(file.fileCount);
                html.find('.type,.size,.download').addClass('selectHidden');
            }else{
                html.attr('fileId',file.id).addClass('isFile');
                html.find('.iconSpan').attr('nodeId',file.id).addClass('isFile');
                html.find('.filesCount').hide();
                if(file.extension){
                    html.find('.type').html(file.extension);
                }else{
                    html.find('.type').addClass('selectHidden');
                }
                if(file.size){
                    html.find('.size').html(this.getFileSize(file.size));
                }
            }
            catalogPage.find('.filesList').append(html);
        },
        //节点索引加载
        nodeIndexRender : function(indexKey){
            $.each(indexKey,function(i){
                var html = indexModel.clone();
                var str = [];
                html.find('.optionName').html(i+' ：').attr('title',i);
                $.each(indexKey[i],function(j,m){
                    str.push('<li class="oneOption fl">'+m+'</li>');
                });
                html.find('.oneIndexKey').html(str.join(''));
                catalogPage.find('.allOptions').append(html);
            });
        },
        //获取单个节点信息
        getOneNodeInfo : function(json){
            json.left = json.left||(46+'%');
            json.top = json.top||(11+'px');
            var that = this;
            $.ajax({
                url : '/api/publicDataBase/nodeInfo/'+json.nodeId,
                type: 'get',
                success : function(data){
                    //console.log(data);
                    json.callback&&json.callback(data);
                },
                error: function(err){
                    console.log(err);
                    that.warnMessage('获取节点信息失败！',json.left,json.top);
                }
            });
        },
        //节点信息加载
        nodeInfoRender : function(file,allRender){
            nodeName = file.originalName;
            curThumbnailPath = file.imgPath;
            thumbnailPath = file.imgPath;
            nodeIndexKey = JSON.parse(file.indexKey);
            nodeDetails.find('.allIndex').html('');
            nodeDetails.find('.nodeName').children().last().html(nodeName);
            if(curThumbnailPath){
                nodeDetails.find('.thumbnailPicture').attr('src', configInfo.server_url + '/' + curThumbnailPath).show().next().hide();
            }else{
                nodeDetails.find('.thumbnailPicture').hide().next().show();
            }
            if(allRender){
                if (file.superiorNode) {
                    nodeDetails.find('.superiorName').children().last().html(file.superiorNode);
                }
                if (file.subordinateNode) {
                    nodeDetails.find('.subordinateName').children().last().html(JSON.parse(file.subordinateNode).join(','));
                }
                nodeDetails.find('.nodeCreator').children().last().html(file.creator.name);
                nodeDetails.find('.nodeCreateTime').children().last().html(file.createdAt.substring(0, file.createdAt.indexOf('T')));
            }
            $.each(nodeIndexKey,function(i){
                var html = oneIndexModel.clone();
                var str = [];
                html.find('.indexName').html(i+' ：');
                $.each(nodeIndexKey[i],function(j,m){
                    str.push('<span class="oneIndexOption">'+m+'</span>');
                });
                html.find('.allIndexOption').html(str.join(''));
                nodeDetails.find('.allIndex').append(html);
            });
        },
        //文件信息加载
        fileInfoRender : function(file,allRender){
            fileName = file.originalName;
            fileTitle = JSON.parse(file.title);
            curThumbnailPath = file.imgPath;
            thumbnailPath = file.imgPath;
            nodeName = JSON.parse(file.originalNames);
            nodeName.pop();
            var category = nodeName.join('/');
            var checkFlag;
            var isFind;
            nodeIndexKey = JSON.parse(file.indexKey);
            fileDetails.find('.allIndex').html('');
            fileDetails.find('.fileName').children().last().html(file.originalName);
            if(curThumbnailPath){
                fileDetails.find('.filePictureShow').attr('src', configInfo.server_url + '/' + curThumbnailPath).show().next().hide();
            }else{
                fileDetails.find('.filePictureShow').hide().next().show();
            }
            if(allRender){
                if(file.size){
                    fileDetails.find('.fileSize').children().last().html(file.size);
                }
                if(file.extension){
                    fileDetails.find('.fileType').children().last().html(file.extension);
                }
                fileDetails.find('.category').children().last().html(category);
                fileDetails.find('.nodeCreator').children().last().html(file.creator.name);
                fileDetails.find('.nodeCreateTime').children().last().html(file.createdAt.substring(0, file.createdAt.indexOf('T')));
            }
            if(fileTitle){
                fileDetails.find('.fileKeyWord').children().last().html(fileTitle.join(','));
            }else{
                fileDetails.find('.fileKeyWord').children().last().html('');
            }
            $.each(curIndexKey,function(i){
                var html = oneIndexModel.clone();
                var str = [];
                checkFlag = false;
                isFind = false;
                html.find('.indexName').html(i+' ：');
                $.each(curIndexKey[i],function(j,m){
                    if(!isFind){
                        $.each(nodeIndexKey, function (ii, nn) {
                            if (nn[i] === m) {
                                checkFlag = true;
                                isFind = true;
                                return false;
                            }
                        });
                    }
                    if(checkFlag){
                        str.push('<span class="oneIndexOption checked">' + m + '</span>');
                        checkFlag = false;
                    }else{
                        str.push('<span class="oneIndexOption">' + m + '</span>');
                    }
                });
                html.find('.allIndexOption').html(str.join(''));
                fileDetails.find('.allIndex').append(html);
            });
        },
        //加载已选条件
        loadSelectedCondition : function(name,item){
            var html = indexChecked.clone();
            html.find('.indexCheckedName').html(name);
            html.find('.optionChecked').html(item);
            catalogPage.find('.allSelectedItem').append(html);
        },
        //增加已选条件
        addSelectedCondition : function(name,item){
            var html = $('<span class="optionChecked"></span>');
            html.html(item);
            catalogPage.find('.oneSelectedItem').each(function(i,n){
                if($(n).find('.indexCheckedName').html() === name){
                    $(n).find('i').before(html);
                    return false;
                }
            });
        },
        //删除一条已选索引
        removeOneIndex : function(name){
            catalogPage.find('.oneSelectedItem').each(function(i,n){
                if($(n).find('.indexCheckedName').html() === name){
                    $(n).off().remove();
                    return false;
                }
            });
        },
        //删除一条已选索引项
        removeOneOption : function(name,item){
            catalogPage.find('.oneSelectedItem').each(function(i,n){
                if($(n).find('.indexCheckedName').html() === name){
                    $(n).find('.optionChecked').each(function(j,m){
                        if($(m).html() === item){
                            $(m).remove();
                            return false;
                        }
                    });
                    return false;
                }
            });
        },
        //删除附件
        deleteAttachment : function(json){
            json.left = json.left||(46+'%');
            json.top = json.top||(11+'px');
            var that = this;
            $.ajax({
                url : '/api/publicDataBase/deleteAttachment',
                type: 'delete',
                data: 'filePath='+json.path,
                success : function(data){
                    //console.log(data);
                    json.callback&&json.callback(data);
                },
                error: function(err){
                    //console.log(err);
                    //that.warnMessage('获取节点信息失败！',json.left,json.top);
                }
            });
        },
        //获取当前页面
        getCurPage: function () {
            var allPage = publicDB.find('.rContent').children();
            for (var i=0;i<allPage.length;i++){
                if($(allPage[i]).is(':visible')){
                    return $(allPage[i]);
                }
            }
        },
        //检测数组的值是否有重复
        isRepeat : function (arr){
            var hash = {};
            for(var i=0;i<arr.length;i++) {
                if(hash[arr[i]]) {
                    return true;
                }
                hash[arr[i]] = true;
            }
            return false;
        },
        //文件大小进位
        getFileSize : function(number){
            number = (number/1024).toFixed(2);
            if(number>1000){
                number = (number/1024).toFixed(2);
                if(number>1000){
                    number = (number/1024).toFixed(2);
                    return number+'GB'
                }else{
                    return number+'MB'
                }
            }else{
                return number+'KB'
            }
        },
        //消息提示框
        infoMessage : function(des,left,top) {
            left = left||(11+'%');
            top = top||(44+'px');
            var box = $('<div style="' + userCommon.infoMessage(top, left) + '">' + des + '<div>');
            $('#container').append(box);
            userCommon.warnMessageRemove(box);
        },
        //警告提示框
        warnMessage : function(des,left,top){
            left = left||(11+'%');
            top = top||(44+'px');
            var box =$('<div style="' + userCommon.warnMessage(top,left) +'">'+des+'<div>');
            $('#container').append(box);
            userCommon.warnMessageRemove(box);
        }
    }
}();