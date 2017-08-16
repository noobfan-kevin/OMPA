/**
 * Created by HK059 on 2016/4/18.
 */
var projectDataBase = function(){
    var curProjectId;
    var curProjectName;
    var userId;
    var folderTree;
    var projectDB;
    var folderContent;
    var fileDetails;
    var folderModel;
    var curName;
    var fatherId;
    var checkedIds;
    var checkedId;
    var checkedArr;
    var curFileMarked;
    var allFolderId;
    var searchState;
    var uploadImg;
    var changePath;
    var typeData;
    var socket;
    var fileCount;
    var completeFile;
    var completeCount;
    var allFilesCount;
    var target;
    var targetArr;
    var openClass;
    return{
        //初始化
        init : function(){
            curProjectId = localStorage.getItem('projectId');
            curProjectName = localStorage.getItem('projectName');
            userId = localStorage.getItem('userId');
            folderTree = new ZTreeObj('');
            projectDB = $('.projectDB_main');
            folderContent = $('.fileList');
            fileDetails = $('.file_details');
            curFileMarked = {};
            searchState = false;
            typeData = [];
            socket = io.connect(configInfo.server_url);
            completeFile = 0;
            this.initTree();
            this.bindEvent();
            projectDB.find('#projectDBTree').find('a.level0').click();
        },
        //绑定事件
        bindEvent : function(){
            var that = this;
            //新建文件夹
            projectDB.on('click','.addFolder',function(){
                projectDB.find('.contextMenu').css('display','none');
                if(searchState){
                    projectDB.find('.selectedNode').click();
                    searchState = false;
                }
                fatherId = projectDB.find('.selectedNode').siblings('div').attr('id');
                var name = that.setDefaultFolderName({
                    fatherId : fatherId
                });
                that.addFolder({
                    name : name,
                    fatherId : fatherId,
                    projectId : curProjectId,
                    projectName : curProjectName,
                    userId : userId,
                    callback : function(data){
                        //console.log(data);
                        that.folderContentRender(data,true,name.length);
                        folderTree.addNode(name,fatherId,'projectDBTree',data.id);
                        curName = name;
                    }
                });
                projectDB.find('.folder').removeClass('checked startFile endFile');
                projectDB.find('#paste').removeAttr('fileMethod').css('color','#999').addClass('disClick');
            });
            //点击上传文件
            projectDB.on('click','.upLoadFile',function(){
                projectDB.find('.contextMenu').css('display','none');
                if(searchState){
                    projectDB.find('.selectedNode').click();
                    searchState = false;
                }
                var folderPath;
                fatherId = projectDB.find('.selectedNode').siblings('div').attr('id');
                if(fatherId !== curProjectId){
                    that.getFileInfo({
                        fileId : fatherId,
                        callback : function(data){
                            folderPath = JSON.parse(data.originalNames).join('/');
                            projectDB.find('.upLoadFile').attr('folderPath',folderPath);
                            projectDB.find('#upLoadFile').click();
                        }
                    });
                }else{
                    folderPath = curProjectName + '_' + curProjectId;
                    projectDB.find('.upLoadFile').attr('folderPath',folderPath);
                    projectDB.find('#upLoadFile').click();
                }
            });
            projectDB.on('change','#upLoadFile',function(){
                that.uploadFile(this.files);
                $(this).val('');
            });
            //点击下载文件
            projectDB.on('click','.downLoadFile',function(){
                projectDB.find('.contextMenu').css('display','none');
                checkedArr = [];
                projectDB.find('.checked.isFile').each(function(i,n){
                    checkedArr.push({
                        'id' : $(n).attr('fileId'),
                        'originName' : $(n).find('p').html()
                    });
                });
                if(checkedArr.length !== 0){
                    if(checkedArr.length === 1){
                        projectDB.find('#downLoadFile').attr('nwsaveas',checkedArr[0].originName).removeAttr('nwdirectory');
                    }else{
                        projectDB.find('#downLoadFile').attr('nwdirectory','nwdirectory');
                    }
                    projectDB.find('#downLoadFile').click();
                }else{
                    that.warnMessage(11+'%',44+'px','请选择文件下载!');
                }
                //console.log(checkedArr);
            });
            projectDB.on('change','#downLoadFile',function(){
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
            //选择文件事件/获取文件信息
            projectDB.on('click','.folder',function(){
                $('.endFile').removeClass('endFile');
                if(window.keyCode === null){
                    $(this).addClass('checked startFile').siblings().removeClass('checked startFile');
                }else if(window.keyCode === 16){ //shift
                    $(this).addClass('checked');
                    that.checkStartFile.call(this);

                }else if(window.keyCode === 17){ //ctrl
                    if(!$(this).hasClass('checked')){
                        $(this).addClass('checked');
                    }else{
                        $(this).removeClass('checked');
                    }
                    $(this).addClass('startFile').siblings().removeClass('startFile');
                }
                var fileId = $(this).attr('fileId');
                if(fileId&&fileId !== curFileMarked.id){
                    curFileMarked.id =  fileId;
                    that.getFileInfo({
                        fileId : fileId,
                        callback : function(data){
                            if(data.imgPath) {
                                fileDetails.find('#fileMarked').attr('src', configInfo.server_url + '/' + data.imgPath).show().next().hide();
                            }else{
                                fileDetails.find('#fileMarked').hide().next().show();
                            }
                            fileDetails.attr('fileCheckedId',fileId);
                            fileDetails.find('.file_name').html(data.originalName);
                            if(data.FileType){
                                fileDetails.find('.file_type').html(data.FileType.name).attr('typeId',data.FileType.id);
                            }else{
                                fileDetails.find('.file_type').html('');
                            }
                            fileDetails.find('.file_size').html(that.getFileSize(data.size));
                            fileDetails.find('.file_title').html(data.title);
                            fileDetails.find('.file_title_input').val(data.title).attr('title',data.title);
                            fileDetails.find('.file_creator').html(data.creator.name);
                            fileDetails.find('.file_createTime').html(data.createdAt.substring(0,data.createdAt.indexOf('T')));
                            fileDetails.find('.file_describe').html(data.description);
                            fileDetails.find('.file_describe_textarea').val(data.description);
                            fileDetails.children('div').show().next().hide();
                            fileDetails.find('.file_show').show().next().hide();
                            curFileMarked.path = data.imgPath;
                            uploadImg = false;
                            changePath = '';
                        }
                    });
                }
            });
            //右击选择文件
            projectDB.on('contextmenu','.folder',function(){
                if(!$(this).hasClass('checked')){
                    $('.endFile').removeClass('endFile');
                    $(this).addClass('checked startFile').siblings().removeClass('checked startFile');
                }
            });
            //文件名称输入限制
            projectDB.on('input','.edit',function(){
                //var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
                var reg = /[`~!@#$%\^\+\*&\\\/<>\?\|:{}()';="]/;
                if(reg.test($(this).val())){
                    $(this).val($(this).val().replace(reg, function () {
                        that.warnMessage(11 + '%', 44 + 'px', '非法字符输入！');
                        return '';
                    }));
                }
                $(this).attr('title',$(this).val());
            });
            //确定文件名（新建文件夹和重命名时使用）
            projectDB.on('click',function(){
                checkedId = folderContent.find('.edit').parent('.folder').attr('folderId')||folderContent.find('.edit').parent('.folder').attr('fileId');
                if($('.fileList').find('.edit').length>0){
                    var newName = folderContent.find('.edit').val();
                    if(!$.trim(newName)){
                        folderContent.find('.edit').prev('p').html(curName).css('display','block');
                        folderContent.find('.edit').val(curName).css('display','none').removeClass('edit');
                        return;
                    }
                    if(curName !== newName) {
                        that.changeFiles({
                            newName: newName,
                            oldName: curName,
                            id: checkedId,
                            callback : function(result){
                                if(!result.ok){
                                    that.infoMessage(11+'%',44+'px',result.info);
                                }
                                if(result.isFolder){
                                    fatherId = projectDB.find('.selectedNode').siblings('div').attr('id');
                                    folderTree.UpdateNode('projectDBTree',fatherId,result.id,result.name);
                                }else {
                                    fileDetails.find('.file_name').html(result.name);
                                }
                                folderContent.find('.edit').prev('p').html(result.name).css('display','block').attr('title',result.name);
                                folderContent.find('.edit').val(result.name).css('display','none').attr('title',result.name).removeClass('edit');
                            }
                        });
                    }else{
                        folderContent.find('.edit').prev('p').css('display','block');
                        folderContent.find('.edit').css('display','none').removeClass('edit');
                    }
                }
            });
            //双击进入文件夹
            projectDB.on('dblclick','.isFolder',function(){
                var folderId = $(this).attr('folderId');
                that.initFolderContent(folderId);
                folderTree.selectNode('projectDBTree',folderId);
            });
            //展开闭合文件信息
            projectDB.on('mouseover','.fileControl',function(){
                projectDB.find('#fileInfoBtn').css({'width':20+'px'});
            }).on('mouseout','.fileControl',function(){
                projectDB.find('#fileInfoBtn').css({'width':2+'px'});
            });
            projectDB.on('click','#fileInfoBtn',function(event){
                event.stopPropagation();
                if($(this).hasClass('fileInfoClose')){
                    $(this).removeClass('fileInfoClose').addClass('fileInfoOpen').css({'width':20+'px'});
                    projectDB.find('.folder_content').css('width',projectDB.width()*78/100 - 314);
                    fileDetails.css({
                        'width' : 312+'px',
                        'display' : 'block'
                    });
                }else{
                    $(this).removeClass('fileInfoOpen').addClass('fileInfoClose').css({'width':20+'px'});
                    projectDB.find('.folder_content').css('width',100+'%');
                    fileDetails.css({
                        'width' : 0,
                        'display' : 'none'
                    });
                }
                projectDB.find('.contextMenu').css('display','none');
            });
            projectDB.on('dblclick','.isFile',function(){
                projectDB.find('#fileInfoBtn').click().css({'width':2+'px'});
            });
            //点击编辑文件
            projectDB.on('click','.editBtn',function(){
                fileDetails.find('.file_show').hide().next().show();
                that.updateFileType();
                uploadImg = true;
            });
            //上传文件标识图片
            projectDB.on('mouseenter','.imgBox',function(){
                if(uploadImg) {
                    $(this).children('span').css('top', 0);
                }
            }).on('mouseleave','.imgBox',function(){
                if(uploadImg) {
                    $(this).children('span').css('top', 196+'px');
                }
            });
            projectDB.on('click','.imgBox span',function(){
                projectDB.find('#upLoadFileImg').click();
            });
            projectDB.on('change','#upLoadFileImg',function(){
                that.uploadFileImg(this.files);
                $(this).siblings('span').css('top', 196+'px');
                $(this).val('');
            });
            //显示文件类型管理对话框
            projectDB.on('click','.manageBtn',function(){
                projectDB.find('#asset-type-list').html('');
                for(var i=0;i<typeData.length;i++){
                    var typeLi = $('<li class="asset-list">'+
                        '<span></span>'+
                        '<i class="iconfont asset-del">&#xe626;</i>'+
                        '<i class="iconfont asset-edit">&#xe623;</i>'+
                    '</li>');
                    typeLi.attr({
                        'typeId' : typeData[i].id
                    });
                    typeLi.find('span').html(typeData[i].name);
                    typeLi.hover(function(){
                        $(this).find('i').show();
                    },function(){
                        $(this).find('i').hide();
                    });
                    projectDB.find('#asset-type-list').append(typeLi);
                }
                projectDB.find('.assetType-contain').show();
            });
            //隐藏文件类型管理对话框
            projectDB.on('click','.icon-close',function(){
                projectDB.find('.assetType-contain').hide();
                that.updateFileType();
            });
            //显示添加文件类型对话框
            projectDB.on('click','#asset-type-new-btn',function(){
                projectDB.find('.asset-type-new').show();
            });
            //添加文件类型
            projectDB.on('click','.m-icon-save',function(){
                if(!$.trim(projectDB.find('#asset-type-new').val())){
                    that.warnMessage(11+'%',44+'px','类型名称不可为空！');
                    return;
                }
                that.addFileType({
                    name : projectDB.find('#asset-type-new').val(),
                    callback : function(data){
                        var typeLi = $('<li class="asset-list">'+
                            '<span></span>'+
                            '<i class="iconfont asset-del">&#xe626;</i>'+
                            '<i class="iconfont asset-edit">&#xe623;</i>'+
                            '</li>');
                        typeLi.attr({
                            'typeId' : data.id
                        });
                        typeLi.find('span').html(data.name);
                        typeLi.hover(function(){
                            $(this).find('i').show();
                        },function(){
                            $(this).find('i').hide();
                        });
                        projectDB.find('#asset-type-new').val('');
                        projectDB.find('#asset-type-list').append(typeLi);
                    }
                });
                projectDB.find('.asset-type-new').hide();
            });
            //取消添加文件类型
            projectDB.on('click','.m-icon-cancel',function(){
                projectDB.find('.asset-type-new').hide();
            });
            //修改文件类型
            projectDB.on('click','.asset-edit',function(){
                var typeLi = $('<li class="asset-type-edit">'+
                    '<input id="asset-type-edit"  maxlength="6">'+
                    '<i class="iconfont edit-icon-save">&#xe640;</i>'+
                    '<i class="iconfont edit-icon-cancel">&#xe628;</i>'+
                '</li>');
                typeLi.find('input').val($(this).siblings('span').html());
                $(this).parent('li').before(typeLi);
                $(this).parent('li').hide();
            });
            //保存文件类型
            projectDB.on('click','.edit-icon-save',function(){
                var _this = this;
                if($.trim($(this).prev('input').val())){
                    if($(this).prev('input').val()!==$(this).parent().next().find('span').html()) {
                        that.changeFileType({
                            typeId: $(this).parent().next().attr('typeId'),
                            name: $(this).prev('input').val(),
                            callback: function (data) {
                                //console.log(data);
                                $(_this).parent().next().find('span').html(data.name);
                                if (projectDB.find('.file_type').attr('typeId') === data.id) {
                                    projectDB.find('.file_type').html(data.name);
                                }
                                $(_this).parent().next().show();
                                $(_this).parent().remove();
                            }
                        });
                    }else{
                        $(this).parent().next().show();
                        $(this).parent().remove();
                    }
                }else{
                    that.warnMessage(11+'%',44+'px','类型名称不可为空！');
                    $(this).parent().next().show();
                    $(this).parent().remove();
                }
            });
            //取消保存文件类型
            projectDB.on('click','.edit-icon-cancel',function(){
                $(this).parent().next().show();
                $(this).parent().remove();
            });
            //删除文件类型
            projectDB.on('click','.asset-del',function(){
                var _this = this;
                var typeId = $(this).parent().attr('typeId');
                that.checkFileType({
                    typeId :  typeId,
                    callback : function(data){
                        if(data.result){
                            that.deleteFileType({
                                typeId :  typeId,
                                callback : function(){
                                    $(_this).parent().remove();
                                }
                            });
                        }else{
                            that.warnMessage(11+'%',44+'px',data.info);
                        }
                    }
                });
            });
            //保存文件信息
            projectDB.on('click','#saveBtn',function(){
                var imgPath;
                //console.log(curFileMarked.path);
                //console.log(changePath);
                changePath?imgPath = ('fileInfo/' + changePath):imgPath = curFileMarked.path;
                var typeId = $(fileDetails.find('.file_type_select').children()[fileDetails.find('.file_type_select').get(0).selectedIndex]).attr('typeId');
                that.changeFiles({
                    id : fileDetails.attr('fileCheckedId'),
                    type : typeId,
                    title : fileDetails.find('.file_title_input').val(),
                    description :  fileDetails.find('.file_describe_textarea').val(),
                    imgPath : imgPath,
                    callback : function(data){
                        fileDetails.find('.file_type').html(fileDetails.find('.file_type_select').val()).attr('typeId',typeId);
                        fileDetails.find('.file_title').html(data.title);
                        fileDetails.find('.file_title_input').attr('title',data.title);
                        fileDetails.find('.file_describe').html(data.description);
                        fileDetails.find('.file_show').show().next().hide();
                        uploadImg = false;
                        changePath = '';
                        curFileMarked.path = imgPath;
                    }
                });
            });
            //取消保存文件信息
            projectDB.on('click','#cancelBtn',function(){
                fileDetails.find('.file_type_select').val(fileDetails.find('.file_type').html());
                fileDetails.find('.file_title_input').val(fileDetails.find('.file_title').html());
                fileDetails.find('.file_describe_textarea').val(fileDetails.find('.file_describe').html());
                fileDetails.find('.file_show').show().next().hide();
                uploadImg = false;
                if(changePath) {
                    if (curFileMarked.path) {
                        fileDetails.find('#fileMarked').attr('src', configInfo.server_url + '/' + curFileMarked.path).show().next().hide();
                    } else {
                        fileDetails.find('#fileMarked').hide().next().show();
                    }
                    changePath = '';
                }
            });
            //搜索文件
            projectDB.on('click','#searchBtn',function(){
                var keyword = $(this).prev().val();
                if(!$.trim(keyword)){
                    that.infoMessage(11+'%',44+'px','请输入关键字！');
                    return;
                }
                fileDetails.children('div').hide().next().show();
                curFileMarked = {};
                fatherId = projectDB.find('.selectedNode').siblings('div').attr('id');
                that.searchFile({
                    fatherId : fatherId,
                    keyword : keyword,
                    projectId : curProjectId,
                    callback : function(data){
                        folderContent.html('');
                        for(var i=0;i<data.length;i++) {
                            that.folderContentRender(data[i],false)
                        }
                        searchState = true;
                    }
                });
            });
            projectDB.on('keyup','#searchInput',function(event){
                if (event.keyCode==13){
                    $(this).next().click();
                }
            });
            //右键菜单
            projectDB.on('contextmenu','.folder_content',function(event){
                if(!($(event.target).hasClass('folder'))&&!($(event.target).parent().hasClass('folder'))){
                    projectDB.find('.folder').removeClass('checked startFile endFile');
                }
                if(projectDB.find('.checked').length === 0){
                    projectDB.find('.contextMenu').children('li').not('#paste').css('color','#999').addClass('disClick');
                }else{
                    projectDB.find('.contextMenu').children('li').not('#paste').css('color','#000').removeClass('disClick');
                }
                var leftWidth = $('.my-project-nav').width();
                var topHeight = $('.header').height();
                if(event.clientY<(document.documentElement.clientHeight-projectDB.find('.contextMenu').height())){
                    projectDB.find('.contextMenu').css({
                        'display' : 'block',
                        'left' : event.clientX-leftWidth+'px',
                        'top' : event.clientY-topHeight+'px'
                    });
                }else{
                    projectDB.find('.contextMenu').css({
                        'display' : 'block',
                        'left' : event.clientX-leftWidth+'px',
                        'top' : document.documentElement.clientHeight-projectDB.find('.contextMenu').height()-topHeight-15+'px'
                    });
                }
                //console.log(event.clientY);
                //console.log(document.documentElement.clientHeight-projectDB.find('.contextMenu').height());
            });
            //右键功能选择
            projectDB.on('click','.contextMenu',function(event){
                event.stopPropagation();
                projectDB.click();
                if($(event.target).hasClass('disClick')) return;
                var checkLevel;
                fatherId = projectDB.find('.selectedNode').siblings('div').attr('id');
                projectDB.children('.contextMenu').hide();
                switch (event.target.id){
                    case 'copy':
                        var completeIndex = 0;
                        checkedIds = [];
                        checkedArr = [];
                        projectDB.find('.checked').each(function(i,n){
                            checkedId = $(n).attr('folderId')||$(n).attr('fileId');
                            checkedIds.unshift(checkedId);
                            if($(n).hasClass('isFolder')){
                                checkedArr.unshift(n);
                            }
                        });
                        fileCount = checkedIds.length - checkedArr.length;
                        if(checkedArr.length>0) {
                            $.each(checkedArr, function (i, n) {
                                that.getFileCount({
                                    folderId: $(n).attr('folderId'),
                                    callback: function (count) {
                                        fileCount += count;
                                        completeIndex++;
                                        if (completeIndex === checkedArr.length) {
                                            //console.log(fileCount);
                                            projectDB.find('#paste').attr('fileMethod', 'copy').css('color', '#000').removeClass('disClick');
                                        }
                                    }
                                });
                            });
                        }else{
                            projectDB.find('#paste').attr('fileMethod', 'copy').css('color', '#000').removeClass('disClick');
                        }
                        break;
                    case 'cut':
                        projectDB.find('#paste').attr('fileMethod','cut').css('color','#000').removeClass('disClick');
                        checkedIds = [];
                        checkedArr = [];
                        allFolderId = [];
                        projectDB.find('.checked').each(function(i,n){
                            checkedId = $(n).attr('folderId')||$(n).attr('fileId');
                            checkedIds.unshift(checkedId);
                            if($(n).hasClass('isFolder')){
                                checkedArr.unshift(projectDB.find('.isFolder').length-1-$(n).index('.isFolder'));
                            }
                        });
                        if(checkedArr.length>0) {
                            projectDB.find('.isFolder').each(function (i, n) {
                                allFolderId.push($(n).attr('folderId'));
                            });
                            checkLevel = projectDB.find('.selectedNode').attr('class');
                            checkLevel = $.trim(checkLevel.replace('selectedNode', ''));
                            checkLevel = checkLevel.replace(/\d+/, function (num) {
                                return parseInt(num) + 1;
                            });
                        }
                        break;
                    case 'paste':
                        completeCount = 0;
                        allFilesCount = checkedIds.length;
                        target = projectDB.find('.selectedNode').parent().index();//TODO
                        targetArr = that.getAllLevel(projectDB.find('.selectedNode').parent(),[]);
                        openClass = projectDB.find('.selectedNode').parent().attr('class');
                        var flag = false;
                        //console.log(target);
                        //console.log(targetArr);
                        //console.log(checkLevel);
                        //console.log(openClass);
                        //console.log(checkedArr);
                        if(projectDB.find('#paste').attr('fileMethod') === 'cut'){
                            if(checkedArr.length>0) {
                                $.each(allFolderId, function (i, n) {
                                    if (n === fatherId) {
                                        flag = true;
                                        return false;
                                    }
                                });
                                if (flag && (checkLevel === openClass)&&targetArr.length>0) {
                                    for (var i = 0; i < checkedArr.length; i++) {
                                        if (checkedArr[i] < targetArr[targetArr.length - 1]) {
                                            target--;
                                            //console.log(target);
                                        }
                                    }
                                    targetArr[targetArr.length - 1] = target;
                                }
                            }
                            $.each(checkedIds,function(i,n){
                                that.cutFiles({
                                    fatherId : fatherId,
                                    fileId : n,
                                    userId : userId,
                                    callback : function(data){
                                        completeCount++;
                                        that.folderContentRender(data,false);
                                        folderTree.deleteFile('projectDBTree', n);
                                        if(completeCount===allFilesCount&&targetArr.length === 0){
                                            that.initTree();
                                            projectDB.find('#projectDBTree').find('a.level0').click();
                                        }else if(completeCount===allFilesCount){
                                            that.initTree();
                                            var level = projectDB.find('li.level1');
                                            for(var i=0;i<targetArr.length;i++){
                                                $(level[targetArr[i]]).children('span').click();
                                                level = $(level[targetArr[i]]).children('ul').children('li')
                                            }
                                            $(projectDB.find($('li.'+openClass))[target]).children('a').click();
                                        }
                                    }
                                });
                            });
                        }else{
                            projectDB.find('.copyInfo span').html('');
                            if(fileCount > 0){
                                projectDB.children('.copyShadow').show();
                            }
                            that.copyFiles({
                                fatherId: fatherId,
                                fileIds: checkedIds,
                                userId: userId
                            });
                        }
                        projectDB.find('#paste').removeAttr('fileMethod').css('color','#999').addClass('disClick');
                        break;
                    case 'reNaming':
                        if(projectDB.find('.endFile').length>0){
                            projectDB.find('.endFile').children('input').css('display','block').addClass('edit');
                            projectDB.find('.endFile').children('p').css('display','none');
                        }else{
                            projectDB.find('.startFile').children('input').css('display','block').addClass('edit');
                            projectDB.find('.startFile').children('p').css('display','none');
                        }
                        curName = projectDB.find('.edit').val();
                        projectDB.find('.edit').get(0).setSelectionRange(0,curName.length);
                        projectDB.find('.edit').focus();
                        break;
                    case 'delete':
                        projectDB.find('.checked').each(function(i,n){
                            checkedId = $(n).attr('folderId')||$(n).attr('fileId');
                            that.removeFolder({
                                id : checkedId,
                                projectId : curProjectId,
                                callback : function(){
                                    $(n).remove();
                                }
                            });
                            folderTree.deleteFile('projectDBTree', checkedId);
                            projectDB.find('#paste').removeAttr('fileMethod').css('color','#999').addClass('disClick');
                        });
                        break;
                    default:
                        break;
                }
            });
            //左键单击去掉菜单,选中文件，文件信息
            projectDB.on('click','.folder_content',function(){
                projectDB.find('.contextMenu').css('display','none');
                if(!($(event.target).hasClass('folder'))&&!($(event.target).parent().hasClass('folder'))&&window.keyCode !== 16&&window.keyCode !== 17){
                    projectDB.find('.folder').removeClass('checked startFile endFile');
                }
                if(!($(event.target).hasClass('isFile'))&&!($(event.target).parent().hasClass('isFile'))){
                    curFileMarked = {};
                    fileDetails.children('div').hide().next().show();
                }
            });
            projectDB.on('click','.projectDB_aside_l',function(){
                projectDB.find('.contextMenu').css('display','none');
                projectDB.find('.folder').removeClass('checked startFile endFile');
                curFileMarked = {};
                fileDetails.children('div').hide().next().show();
            });
            projectDB.on('click','.file_details',function(){
                projectDB.find('.contextMenu').css('display','none');
            });
            //阻止冒泡
            projectDB.on('click','.edit',function(event){
                event.stopPropagation();
            });
            //socket
            socket.on('receive',function(data){
                completeFile++;
                console.log(data);
                projectDB.find('.copyInfo span').html(completeFile+'/'+fileCount);
            });
        },
        //初始化左侧树结构
        initTree : function(){
            var that = this;
            var setting = {
                view: {
                    selectedMulti: false,
                    showIcon: true,
                    showLine: false,
                    fontCss: function(treeId, treeNode) {
                        return treeNode.level == 0 ? {color:'red','font-weight':'bold'} : {};
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
                    onClick: function(event,treeId,treeNode){
                        that.initFolderContent(treeNode.id);

                    }
                }
            };
            var zNodes =[];
            zNodes.push({ id:curProjectId, pId:'root', name:curProjectName, open:true });
            var dataList = this.getAllFolder();
            zNodes = zNodes.concat(dataList);
            $.fn.zTree.init($('#projectDBTree'), setting, zNodes);
        },
        //初始化文件夹内容
        initFolderContent : function(fatherId){
            var that = this;
            folderContent.html('');
            this.getOneFolder({
                fatherId : fatherId,
                callback : function(list){
                    for(var i=0;i<list.length;i++){
                        that.folderContentRender(list[i],false);
                    }
                }
            });
        },
        //文件内容加载
        folderContentRender : function(file,flag,length){
            folderModel = $('<li class="newFolder folder">'+
                '<img src="" />'+
                '<p></p>'+
                '<input class="edit" type="text" />'+
                '</li>');
            if(file.isFolder){
                folderModel.find('img').attr('src','images/file.png');
                folderModel.attr('folderId',file.id).addClass('isFolder');
            }else{
                folderModel.find('img').attr('src','images/fileFormat/'+file.extension+'.gif');
                folderModel.attr('fileId',file.id).addClass('isFile');
            }
            folderModel.find('p').html(file.originalName).attr('title',file.originalName);
            folderModel.find('input').val(file.originalName).attr('title',file.originalName);
            folderContent.prepend(folderModel);
            if(flag){
                folderModel.find('p').css('display','none');
                folderModel.find('input').get(0).setSelectionRange(0,length);
                folderModel.find('input').focus();
            }else{
                folderModel.removeClass('newFolder');
                folderModel.find('input').removeClass('edit').css('display','none');
            }
        },
        //获取所有文件夹
        getAllFolder : function(){
            var json = {};
            json.left = json.left||(46+'%');
            json.top = json.top||(11+'px');
            var that = this;
            var dataList = [];
            $.ajax({
                url : '/api/projectDataBase/project/'+curProjectId,
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
                    that.warnMessage(json.left,json.top,'获取信息失败！');
                }
            });
            return dataList;
        },
        //获取文件信息
        getFileInfo : function(json){
            json.left = json.left||(46+'%');
            json.top = json.top||(11+'px');
            var that = this;
            $.ajax({
                url : '/api/projectDataBase/'+json.fileId,
                type: 'get',
                success : function(data){
                    //console.log(data);
                    json.callback&&json.callback(data);
                },
                error: function(err){
                    console.log(err);
                    that.warnMessage(json.left,json.top,'获取信息失败！');
                }
            });
        },
        //获取文件类型列表
        getFileTypeList : function(json){
            json.left = json.left||(46+'%');
            json.top = json.top||(11+'px');
            var that = this;
            $.ajax({
                url : '/api/fileType/getTypeList',
                type: 'get',
                success : function(data){
                    json.callback && json.callback(data);
                },
                error: function(err){
                    console.log(err);
                    that.warnMessage(json.left,json.top,'获取文件类型失败！');
                }
            });
        },
        //更新文件类型选择列表
        updateFileType : function(){
            this.getFileTypeList({
                callback : function(data){
                    //console.log(data);
                    typeData = data;
                    projectDB.find('.file_type_select').children().remove();
                    for(var i=0;i<data.length;i++){
                        var typeOption = $('<option>'+data[i].name+'</option>');
                        typeOption.attr({
                            'typeId' : data[i].id,
                            'value' : data[i].name
                        });
                        if(projectDB.find('.file_type').attr('typeId') === data[i].id){
                            typeOption.attr('selected','selected');
                        }
                        projectDB.find('.file_type_select').append(typeOption);
                    }
                }
            });
        },
        //获取文件夹内容
        getOneFolder : function(json){
            json.left = json.left||(46+'%');
            json.top = json.top||(11+'px');
            var that = this;
            $.ajax({
                url : '/api/projectDataBase/father/'+json.fatherId,
                type: 'get',
                async: false,
                success : function(data){
                    json.callback&&json.callback(data);
                },
                error: function(err){
                    console.log(err);
                    that.warnMessage(json.left,json.top,'获取信息失败！');
                }
            });
        },
        //新建文件夹
        addFolder : function(json) {
            json.left = json.left||(46+'%');
            json.top = json.top||(11+'px');
            var that = this;
            $.ajax({
                url : '/api/projectDataBase/newFolder',
                type: 'post',
                data : 'name='+json.name+'&fatherId='+json.fatherId+'&projectId='+json.projectId+'&projectName='+json.projectName+'&creatorId='+json.userId,
                success: function (data) {
                    //console.log(data);
                    json.callback&&json.callback(data.info);
                },
                error: function(){
                    that.warnMessage(json.left,json.top,'文件夹添加失败！');
                }
            });
        },
        //删除文件夹或文件
        removeFolder : function(json) {
            json.left = json.left||(46+'%');
            json.top = json.top||(11+'px');
            var that = this;
            $.ajax({
                url : '/api/projectDataBase/'+json.id,
                type: 'delete',
                data: {name:json.name,projectId:json.projectId},
                success: function(result){
                    json.callback&&json.callback(result);
                },
                error: function(){
                    that.warnMessage(json.left,json.top,'文件删除失败！');
                }
            });
        },
        //文件夹或文件修改
        changeFiles : function(json){
            json.left = json.left||(46+'%');
            json.top = json.top||(11+'px');
            var that = this;
            $.ajax({
                url:'/api/projectDataBase/update',
                type: 'post',
                async: false,
                data : 'newName='+json.newName+'&fileId='+json.id+'&projectId='+json.projectId+'&oldName='+
                json.oldName+'&type='+json.type+'&title='+json.title+'&description='+json.description+
                '&imgPath='+json.imgPath,
                success: function(result){
                    json.callback&&json.callback(result);
                },
                error: function(){
                    that.warnMessage(json.left,json.top,'文件修改失败！');
                }
            });
        },
        //文件夹或文件复制
        copyFiles : function(json){
            json.left = json.left||(46+'%');
            json.top = json.top||(11+'px');
            var that = this;
            $.ajax({
                url : '/api/projectDataBase/copyFile',
                type: 'post',
                data : 'fatherid='+json.fatherId+'&fileid='+json.fileIds[completeCount]+'&creatorId='+json.userId,
                success: function(result){
                    if(result.ok){
                        that.copyFilesCallBack(result.info,json);
                    }
                    else{
                        that.warnMessage(json.left,json.top,result.info);
                    }
                },
                error: function(){
                    that.warnMessage(json.left,json.top,'文件夹复制失败！');
                }
            });
        },
        //文件夹复制相关函数
        copyFilesCallBack : function(data,json){
            completeCount++;
            //console.log(data);
            this.folderContentRender(data, false);
            if (completeCount < allFilesCount) {
                this.copyFiles(json);
            } else if (checkedArr.length === 0) {
                completeFile = 0;
                projectDB.children('.copyShadow').hide();
            } else if (targetArr.length === 0) {
                this.initTree();
                projectDB.find('#projectDBTree').find('a.level0').click();
                completeFile = 0;
                projectDB.children('.copyShadow').hide();
            } else {
                this.initTree();
                var level = projectDB.find('li.level1');
                for (var i = 0; i < targetArr.length; i++) {
                    $(level[targetArr[i]]).children('span').click();
                    level = $(level[targetArr[i]]).children('ul').children('li')
                }
                $(projectDB.find($('li.' + openClass))[target]).children('a').click();
                completeFile = 0;
                projectDB.children('.copyShadow').hide();
            }
        },
        //文件夹或文件剪切
        cutFiles : function(json){
            json.left = json.left||(46+'%');
            json.top = json.top||(11+'px');
            var that = this;
            $.ajax({
                url : '/api/projectDataBase/cutFile',
                type: 'post',
                data : 'fatherid='+json.fatherId+'&fileid='+json.fileId+'&creatorId='+json.userId,
                async :　false,
                success: function(result){
                    if(result.ok){
                        json.callback&&json.callback(result.info);
                    }
                    else{
                        that.warnMessage(json.left,json.top,result.info);
                    }
                },
                error: function(){
                    that.warnMessage(json.left,json.top,'文件夹剪切失败！');
                }
            });
        },
        //上传文件
        uploadFile : function(files){
            var that = this;
            var folderPath = projectDB.find('.upLoadFile').attr('folderPath');
            var processOneAttachment= function(file){
                var formData= new FormData();
                formData.append('fatherId', fatherId);
                formData.append('creatorId', userId);
                formData.append('projectId', curProjectId);
                formData.append('projectName', curProjectName);
                formData.append('folderPath', folderPath);
                formData.append('projectFiles', file);

                var xhr= new XMLHttpRequest();

                var upLoadModel = $('<li class="upload_file">'+
                    '<i class="iconfont cancel_upload">&#xe63d;</i>'+
                    '<img src="">'+
                    '<div class="file_uploading">'+
                    '<div class="file_uploading_line"></div>'+
                    '</div>'+
                    '<p></p>'+
                    '</li>');
                upLoadModel.find('p').html(file.name);
                upLoadModel.find('img').attr('src','images/fileFormat/default.gif');
                upLoadModel.find('.cancel_upload').on('click',function(){
                    xhr.abort();
                });
                folderContent.prepend(upLoadModel);

                xhr.onreadystatechange= function(){
                    if(this.readyState==4){
                        if(this.status==200){
                            upLoadModel.remove();
                            that.folderContentRender(JSON.parse(xhr.responseText),false);
                        }else{
                            that.warnMessage(11+'%',44+'px','文件'+ file.name+ '上传失败');
                        }

                    }
                };

                xhr.upload.onprogress= function(event){
                    if(event.lengthComputable){
                        var percentage = parseInt((event.loaded/ event.total)* 100);
                        upLoadModel.find('.file_uploading_line').css('width',percentage+'%');

                    }
                };
                xhr.upload.onabort=function(){
                    xhr.upload.onprogress = null;
                    upLoadModel.remove();
                    console.log('文件'+ file.name+ '取消上传！');
                    that.infoMessage(11+'%',44+'px','文件'+ file.name+ '取消上传！');
                };
                xhr.upload.onerror=function(){
                    xhr.upload.onprogress = null;
                };
                xhr.open('post', configInfo.server_url+ '/api/projectDataBase/upload');
                xhr.send(formData);
            };

            for(var i=0;i< files.length;i++){
                processOneAttachment(files[i]);
            }
        },
        //上传文件标识图片
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
                that.infoMessage(11+'%',44+'px','请选择图片上传！');
                return;
            }
            var formData = new FormData();
            formData.append('fileId', curFileMarked.id);
            formData.append('fileInfo', file[0]);
            var xhr= new XMLHttpRequest();
            xhr.onreadystatechange= function(){
                if(this.readyState==4){
                    if(this.status==200){
                        //console.log(xhr.responseText);
                        changePath = JSON.parse(xhr.responseText).filename;
                        fileDetails.find('#fileMarked').attr('src', imgLocalPath).show().next().hide();
                    }else{
                        that.warnMessage(11+'%',44+'px','图片上传失败');
                    }

                }
            };
            xhr.open('post', configInfo.server_url+ '/api/projectDataBase/upload');
            xhr.send(formData);
        },
        //新建文件类型
        addFileType : function(json) {
            json.left = json.left||(46+'%');
            json.top = json.top||(11+'px');
            var that = this;
            $.ajax({
                url : '/api/fileType/newType',
                type: 'post',
                data : 'name='+json.name,
                success: function (data) {
                    //console.log(data);
                    json.callback&&json.callback(data);
                },
                error: function(){
                    that.warnMessage(json.left,json.top,'文件类型添加失败！');
                }
            });
        },
        //检测文件类型是否被使用
        checkFileType :　function(json){
            json.left = json.left||(46+'%');
            json.top = json.top||(11+'px');
            var that = this;
            $.ajax({
                url : '/api/projectDataBase/checkFileType/'+json.typeId,
                type: 'get',
                success: function (data) {
                    json.callback&&json.callback(data);
                },
                error: function(){
                    that.warnMessage(json.left,json.top,'文件类型查找失败！');
                }
            });
        },
        //删除文件类型
        deleteFileType :　function(json){
            json.left = json.left||(46+'%');
            json.top = json.top||(11+'px');
            var that = this;
            $.ajax({
                url : '/api/fileType/'+json.typeId,
                type: 'delete',
                success: function () {
                    json.callback&&json.callback();
                },
                error: function(){
                    that.warnMessage(json.left,json.top,'文件类型删除失败！');
                }
            });
        },
        //修改文件类型
        changeFileType :　function(json){
            json.left = json.left||(46+'%');
            json.top = json.top||(11+'px');
            var that = this;
            $.ajax({
                url : '/api/fileType/'+json.typeId,
                type: 'put',
                data : 'name='+json.name,
                success: function (data) {
                    //console.log(data);
                    json.callback&&json.callback(data);
                },
                error: function(){
                    that.warnMessage(json.left,json.top,'文件类型修改失败！');
                }
            });
        },
        //搜索文件
        searchFile : function(json){
            json.left = json.left||(46+'%');
            json.top = json.top||(11+'px');
            var that = this;
            $.ajax({
                url : '/api/projectDataBase/searchFile/'+json.fatherId+'?keyword='+json.keyword+'&projectId='+json.projectId,
                type: 'get',
                success: function(result){
                    if(result.ok){
                        json.callback&&json.callback(result.info);
                    }
                },
                error: function(){
                    that.warnMessage(json.left,json.top,'搜索文件失败！');
                }
            });
        },
        //获取文件夹下文件个数
        getFileCount : function(json){
            json.left = json.left||(46+'%');
            json.top = json.top||(11+'px');
            var that = this;
            $.ajax({
                url : '/api/projectDataBase/getFileCount/'+json.folderId,
                type: 'get',
                success: function(result){
                    json.callback&&json.callback(result);
                },
                error: function(){
                    that.warnMessage(json.left,json.top,'获取文件个数失败！');
                }
            });
        },
        //设置默认文件夹名称（新建文件夹时使用）
        setDefaultFolderName : function(json){
            var folderNames = [];
            json.callback = function(result){
                folderNames = result;
            };
            this.getOneFolder(json);
            var result;
            var count = 0;
            for(var i=0;i<folderNames.length;i++){
                if(folderNames[i].isFolder){
                    var reg = /^新建文件夹[(][\d]+[)]$/;
                    if(reg.test(folderNames[i].originalName)){
                        var name = folderNames[i].originalName;
                        name = name.substring(name.indexOf('(')+1,name.indexOf(')'));
                        if(parseInt(name)>count){
                            count = parseInt(name);
                        }
                    }
                }
            }
            count = count+1;
            result = '新建文件夹('+count+')';
            return result;
        },
        //检测起始文件(选择文件时用到)
        checkStartFile : function(){
            var flag = false;
            for(var i=0;i<projectDB.find('.folder').length;i++){
                if($(projectDB.find('.folder').get(i)).hasClass('startFile')){
                    flag = true;
                    $(this).addClass('endFile');
                    projectDB.find('.folder').not('.startFile,.endFile').removeClass('checked');
                    var startFile = $('.startFile').index();
                    var endFile = $('.endFile').index();
                    if(startFile>endFile){
                        var temp = startFile;
                        startFile = endFile;
                        endFile = temp;
                    }
                    for(var j=startFile;j<=endFile;j++){
                        $(projectDB.find('.folder').get(j)).addClass('checked');
                    }
                    break;
                }
            }
            if(!flag){
                $(this).addClass('startFile');
            }
        },
        //获取层级
        getAllLevel : function(obj,arr){
            var that = this;
            (function(){
                if(!obj.hasClass('level0')){
                    arr.unshift(obj.index());
                    that.getAllLevel(obj.parent().parent(),arr);
                }else{
                    //console.log(arr);
                }
            })();
            return arr;
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
        infoMessage : function(left,top,des) {
            var box = $('<div style="' + userCommon.infoMessage(top, left) + '">' + des + '<div>');
            $('#container').append(box);
            userCommon.warnMessageRemove(box);
        },
        //警告提示框
        warnMessage : function(left,top,des){
            var box =$('<div style="' + userCommon.warnMessage(top,left) +'">'+des+'<div>');
            $('#container').append(box);
            userCommon.warnMessageRemove(box);
        }
    }
}();