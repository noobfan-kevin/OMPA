/**
 * Created by hk60 on 2016/4/7.
 * 针对资产管理页面
 */
!function($,assetManagement){
    var Storage = window.localStorage;
    var CurAssetId = null;
    var curPage = 1;
    var superFather = null;
    var AssetSuperFatherId = null;
    var moduleIdArray=[];
    var userCreateTaskFlag=null;
    var curUserPosition={};
    /**
     * 调整列表格函数
     * @param thisId
     * @param type
     */
    function changeColSpan(thisId,type){
        //console.log('thsiid',thisId);
        var DOM = $('#'+thisId);
        var addSpan = parseInt(DOM.attr('colspan'))+4;
        var delSpan = parseInt(DOM.attr('colspan'))-4;
        var pId = DOM.attr('data-class');
        if(type=='open'){
            //console.log('open',addSpan);
            DOM.attr('colspan',addSpan);
        }else{
            //console.log('close',addSpan);
            DOM.attr('colspan',delSpan);
        }
        if(AssetSuperFatherId!=pId){
            changeColSpan(pId,type);
        }
    }

    /**
     * 高度调整函数
     * @param ele
     */
    function setTableHeight(ele){
        var winHeight = window.innerHeight;
        ele.css({"height":winHeight-200});
    }

    /**
     * 固定表头函数
     */
    //function freezeTable(){
    //    var $Table = $('#asset-table');
    //    var height=0;
    //    setTimeout(function(){
    //        console.log('dasdasdasdaaaa');
    //        height = $('#asset-table-head').height();
    //        console.log(height);
    //        $Table.css('padding-top',parseInt(height)-2);
    //    },100);
    //    $Table.on('scroll', function (event) {
    //        if ($(this).scrollTop()) {
    //            $('#asset-table-head').css({
    //                top: $(this).scrollTop()
    //            });
    //        } else {
    //            $('#asset-table-head').css({
    //                top: 0
    //            });
    //        }
    //
    //        //if ($(this).scrollLeft()) {
    //        //    $('#asset-table-head').css({
    //        //        left: $(this).scrollLeft(),
    //        //        position: 'relative'
    //        //    });
    //        //} else {
    //        //    $('#asset-table-head').css({
    //        //        left: 0,
    //        //        position: 'relative'
    //        //    });
    //        //}
    //    });
    //}

    /*-----------------------------资产类型管理页面函数  start---------------------------------*/
    /**
     * 新建资产类型函数
     * @param name 新名
     */
    function newAssetType(name){
        $.ajax({
            method:'post',
            url:'/api/assetType/newType',
            data:{"name":name,"projectId":Storage.getItem('projectId')},
            success:function(data){
              var html='<div class="asset-list" id="'+data.id+'">\
                    <span>'+name+'</span>\
                    <i class="iconfont asset-del">&#xe626;</i><i class="iconfont asset-edit">&#xe623;</i>\
                    </div>';
                $('#asset-type-list').append(html);
            },
            error:function(data){
                console.log(data);
            }
        });
    }

    /**
     * 初始化资产类型列表
     */
    function initAssetType(){
        $.ajax({
            method:'get',
            url:'/api/assetType/getTypeList',
            success:function(data){
                var dataInfo = data.list;
                var len = dataInfo.length;
                var html='';
                for(var i=0;i<len;i++){
                    html+='<div id="'+dataInfo[i].id+'" class="asset-list">\
                    <span>'+dataInfo[i].name+'</span>\
                    <i class="iconfont asset-del">&#xe626;</i><i class="iconfont asset-edit">&#xe623;</i>\
                    </div>'
                }
                $('#asset-type-list').html(html);
            },
            error:function(){
                console.log(data);
            }
        });
    }

    /**
     * 删除资产类型
     * @param id
     * @param ele 页面上资产对应的元素
     */
    function delAssetType(id,ele){
        beforeDelType(id,function(num){
            //console.log(num);
            if(num!=0){
            departmentObj.showAskModel('当前类型下包含资产，不可删除',false);
            }else{
                $.ajax({
                    method:'delete',
                    url:'/api/assetType/'+id,
                    data:{projectId:Storage.getItem('projectId')},
                    success:function(data){
                        ele.remove();
                    },
                    error:function(data){
                        console.log(data);
                    }
                });
            }
        });
    }

    function beforeDelType(id,callback){
        $.ajax({
            method:'get',
            url:'/api/assetInfo/checkAsset/'+id,
            success:function(data){
                //console.log(data);
                callback(data.count);
            },
            error:function(data){
                console.log(data);
            }
        });
    }
    /**
     * 更新资产
     * @param new_name
     * @param id
     */
    function updateType(new_name,id){
        var old_name = $('#'+id).children().eq(0).text();
        if(new_name!=old_name){
            $.ajax({
                method:'put',
                url:'/api/assetType/'+id,
                data:{"name":new_name,"projectId":Storage.getItem('projectId')},
                success:function(data){
                    $('.asset-type-edit').next().children().eq(0).text(new_name);
                    hideEditInput();
                },
                error:function(data){
                    console.log(data);
                }
            });
        }else{
            hideEditInput();
        }
    }

    /**
     * 显示编辑框
     * @param id 要编辑资产ID
     * @param ele 要编辑资产页面元素
     * @param name 资产名称
     */
    function showEditInput(id,ele,name){
        var html = '<div class="asset-type-edit">\
            <input id="asset-type-edit" autofocus="autofocus"  maxlength="12" data-value="'+id+'">\
            <i class="iconfont edit-icon-save">&#xe640;</i><i class="iconfont edit-icon-cancel">&#xe628;</i>\
            </div>';
        ele.before(html);
        $('#asset-type-edit').val(name);
        departmentObj.bindLegalCheck([$('#asset-type-edit')],0,28,'');
        ele.hide();
    }

    /**
     * 隐藏编辑框
     */
    function hideEditInput(){
        var dom = $('.asset-type-edit');
        var element = dom.next();
        dom.remove();
        element.show();
    }

    /*-----------------------------资产管理页面函数  end---------------------------------*/

    /**
     * 获取项目信息
     * @param proId
     */
    function getProjectInfo(proId){
        $.ajax({
           method:'get',
            url:'/api/project/'+proId,
            success:function(data){
                $('.asset-position').text(data.list.name+'/资产管理');  //当前位置显示
            },
            error:function(){

            }
        });
    }
    /*==================================资产新建   start=================================================*/
    /**
     * 加载资产类型函数
     */
    function loadAssetType(){
        $.ajax({
            method:'get',
            url:'/api/assetType/getTypeList',
            success:function(data){
                var html = '';
                var option = data.list;
                var len = option.length;
                for(var i=0;i<len;i++){
                    html+='<option id="'+option[i].id+'">'+option[i].name+'</option>'
                }
                $('#newAsset-type').html(html);
            },
            error:function(){
                console.log(data);
            }
        });
    }

    /**
     * 新建资产
     * @param proId
     * @param userId
     * @param assetName
     * @param assetType
     * @param assetDesc
     * @param imgFile
     */
    function newAssetFunction(proId,userId,assetName,assetType,assetDesc,imgFile){
        $.ajax({
           method:'post',
            url:'/api/assetInfo/newAsset',
            data:{"name":assetName,"type":assetType,"creatorId":userId,"projectId":proId,"desc":assetDesc},
            success:function(data){
                //console.log(data);
                if(imgFile.length!=0){
                    UpLoadImg(imgFile,data.id,true);
                }else{
                    initTable(true);
                }
                clearInputs();
            },
            error:function(data){
                console.log(data);
            }
        });
    }

    /**
     * 清空输入框
     */
    function clearInputs(){
        $('#newAsset-name').val('');
        $("#newAsset-file").val('');
        $("#newAsset-img").attr('src','');
        $('#newAsset-desc').val('');
    }

    /**
     * 上传图片
     * @param file
     * @param assetId
     * @param callback
     * @constructor
     */
    function UpLoadImg(file,assetId,type,callback){
        fileUploader(file,{
            success:function(file) {
                if(callback){
                    callback();
                }
                initTable(type);
            },
            error:function(err){
                console.log('图片上传失败--------↓');
                console.log(err);
            },
            allow:['image/jpeg','image/jpg','image/png'],
            single: true,
            field:'thumbnail',
            limit: '2m',
            data:{
                "assetId":assetId,
                "sourceKey":assetId
            }
        });
    }
    /*----------------------------------资产新建    end -------------------------------------------*/

    /*==================================资产查看    start======================================================*/
    /**
     * 获取资产信息
     * @param id
     * @param $hidePage
     * @param $showPage
     * @param callback
     */
    function getAssetInfo(id,$hidePage,$showPage,callback){
        $.ajax({
            method:'get',
            url:'/api/assetInfo/assetInfo/'+id,
            success:function(data){
                //console.log('assetData',data);
                callback(data,$hidePage,$showPage);
            },
            error:function(err){
                console.log(err);
            }
        })
    }

    /**
     * 选中资产
     * @param data
     * @param $hidePage
     * @param $showPage
     */
    function checkAsset(data,$hidePage,$showPage){
        var tasks = data.data.Tasks;
        var len = tasks.length;
        var spanHtml ='';
        var taskStatus=null;
        var taskVersion = null;
        var tv_len = 0;
        var curVersion = null;
        for(var i=0;i<len;i++){
            taskVersion = tasks[i].TaskVersions;
            tv_len = taskVersion.length;
            for(var tv=0;tv<tv_len;tv++){
                if(taskVersion[tv].currentStatus=='true'){
                    curVersion=taskVersion[tv];
                }
            }
            switch(curVersion.status){
            case -1:
                taskStatus='task-beforeStart';
                break;
            case 0:
                taskStatus='task-beforeStart';
                break;
            case 1:
                taskStatus='task-beforeStart';
                break;
            case 2:
                taskStatus='task-doing';
                break;
            case 3:
                taskStatus='task-doing';
                break;
            case 4:
                taskStatus='task-doing';
                break;
            case 5:
                taskStatus='task-finished';
                break;
        }
            spanHtml+='<span class="asset-task '+taskStatus+'" data-id="'+tasks[i].id+'">'+curVersion.name+'</span>'
        }
        $hidePage.hide();
        $showPage.find('.asset-name')[0].innerText = data.data.name;
        $showPage.find('.asset-type')[0].innerText = data.data.AssetsType.name;
        $showPage.find('.asset-img').attr("src",configInfo.server_url+'/'+data.data.assetImg);
        $showPage.find('.asset-desc')[0].innerText = data.data.desc;
        $('.asset-task-div').html(spanHtml);
      //  $showPage.show();
        console.log('kkkk',projectCommon.authority);
        if(projectCommon.authority.manageAllProjects==true||projectCommon.authority.isProjectLeader==true) {//管理项目，项目负责人
            $showPage.show();
            $('.asset-check-editBtn').show();
            $('.asset-check-delBtn').show();
        }
        else if(projectCommon.authority.asset.isTaskLeader==true){
            $showPage.show();
            $('.asset-check-editBtn').show();
            $('.asset-check-delBtn').show();
        }
        else{
            $showPage.show();
            $('.asset-check-editBtn').hide();
            $('.asset-check-delBtn').hide();
        }
    }
    /**
     * 编辑资产
     * @param data
     * @param $hidePage
     * @param $showPage
     */
    function editAsset(data,$hidePage,$showPage){
        var _data = data.data;
        var _name = _data.name;
        var _type = _data.AssetsType.name;
        var _type_id = _data.AssetsType.id;
        var _img = _data.assetImg;
        var _desc = _data.desc;
        $.ajax({
            method:'get',
            url:'/api/assetType/getTypeList',
            success:function(data){
                var html = '';
                var option = data.list;
                var len = option.length;
                var selected = null;
                for(var i=0;i<len;i++){
                    _type_id==option[i].id?selected='selected':selected='';
                    html+='<option id="'+option[i].id+'" selected="'+selected+'">'+option[i].name+'</option>'
                }
                $('#editAsset-name').val(_name);
                $('#editAsset-type').html(html).val(_type);
                $('#editAsset-img').attr('src',configInfo.server_url+'/'+_img);
                $('#editAsset-desc').val(_desc);
                $hidePage.hide();
                $showPage.show();
            },
            error:function(){
                console.log(data);
            }
        });
    }

    /**
     * 更新资产
     * @param name
     * @param type
     * @param desc
     * @param imgFile
     * @param $hide
     * @param $show
     */
    function updateAsset(name,type,desc,imgFile,$hide,$show){
        $.ajax({
            method:'put',
            url:'/api/assetInfo/updateAsset/'+CurAssetId,
            data:{"name":name,"desc":desc,"type":type,"projectId":Storage.getItem('projectId')},
            success:function(data){
                if(imgFile.length!=0){
                    UpLoadImg(imgFile,CurAssetId,false,function(){
                        getAssetInfo(CurAssetId,$hide,$show,checkAsset);
                    });
                }else{
                    getAssetInfo(CurAssetId,$hide,$show,checkAsset);
                    initTable(false);
                }

            },
            error:function(data){
                console.log(data);
            }
        });
    }

    /**
     * 删除资产
     * @param $hide
     * @param $show
     */
    function removeAsset($hide,$show){
        new Promise(function(resoluve,reject){
            $.ajax({
                method:'delete',
                url:'/api/assetInfo/deleteAsset/'+CurAssetId,
                data:{projectId:Storage.getItem('projectId')},
                success:function(data){
                    resoluve(data);
                },
                error:function(data){
                    reject(data);
                }
            });
        }).then(function(success){
            initTable(false);
            $hide.hide();
            $show.show();
            $.ajax({
                method:'delete',
                url:'/api/file/deleteBySourceKey/'+CurAssetId,
                success:function(data){
                    console.log('删除资产对应缩略图成功',data);
                },
                error:function(data){
                    console.log('删除资产对应缩略图shibai',data);
                }
            });
        },function(error){
            console.log(error);
        }).catch(function(data){
            console.log('error',data);
        });

    }

    /**
     * 初始化表格
     */
    function initTable(type){
        if(type){
            getAssetSuperFatherId(function(){
                SimpleTable.initTable('/api/stepAsset/getAllByProjectId/'+Storage.getItem('projectId'),
                    'asset',
                    AssetSuperFatherId,
                    {"cUrl":'/api/assetInfo/count',"bUrl":'/api/assetInfo/OnePageAssets'});
            });
        }else{
            SimpleTable.getBodyData(parseInt(curPage)-1);
        }

    }

    function freshDataAfterManageTasks(){
        SimpleTable.getBodyData(parseInt(curPage)-1);
    }
    function getAssetSuperFatherId(callback){
        $.ajax({
            method:'get',
            url:'/api/stepAsset/getRootByProjectId/'+Storage.getItem('projectId'),
            success:function(data){
                //console.log('getRootByProjectId',data);
                AssetSuperFatherId = data.list.id;
                callback();
            },
            error:function(err){
                console.log(err);
            }
        })
    }

    /*==============================任务卡 部门 start==========================================*/
    function createTask(data){
        $.ajax({
            type: 'post',
            async: true,
            dataType: 'json',
            data:data ,
            url: '/api/taskCard/createTask',
            success: function (data) {
                console.log('wangwangawng',data);
            },
            error:function(err){
                console.log(err);
            }
        });
    }
    function setLocalStorage(moduleId,AssetId,type,AssetName,stepName){
        localStorage.setItem("stepId",moduleId);
        localStorage.setItem("resourceId",AssetId);
        localStorage.setItem("taskType",type);
        localStorage.setItem("resourceName",AssetName);
        localStorage.setItem("stepName",stepName);
        //curPage = parseInt($('.cur-page').text());
    }
    function cancelNewTask(){
        $('.asset-contain').show();
        $('.newTask-contain').hide();
        window.onresize=function(){
            setTableHeight($('#asset-table'));
        };
    }
    function cancelNewTaskFromList(){
        $('.checkAsset-contain').show();
        $('.newTask-contain').hide();
    }
    function freshenList(){
        //curPage = parseInt($('.cur-page').text());
        $('.iconfont.asset-icon.icon-close').click();
        SimpleTable.getBodyData(parseInt(curPage)-1);
        $('.cur-page').text(curPage+'/'+Math.ceil(parseInt($('.total-page').text())/10)).attr('data-value',curPage);
        window.onresize=function(){
            setTableHeight($('#asset-table'));
        };
    }
    function afterSaveTask(){
        freshenList();
        $('.asset-contain').show();
        $('.newTask-contain').hide();
        }
    function afterSaveTaskFromList(){
        getAssetInfo(CurAssetId,$('.newTask-contain'),$('.checkAsset-contain'),checkAsset);
        freshenList();
        }

    function getCurUserTaskAuth(){
        if(projectCommon.authority.manageAllTasks==true||projectCommon.authority.isProjectLeader==true||projectCommon.authority.manageAllProjects==true){
            $('#asset-manageTask').show();
        }
        if(projectCommon.authority.manageAllTasks==true||projectCommon.authority.isProjectLeader==true){
                   // $('#asset-task-new').show();
                    $('#asset-new').show();
                    $('#asset-setType').show();
                    userCreateTaskFlag=true;
                    curUserPosition.manageAllTasks='true';
        }
        else{
                if(projectCommon.authority.asset.isTaskLeader==true){
                  //  $('#asset-task-new').show();
                    $('#asset-new').show();
                    $('#asset-setType').show();
                    moduleIdArray = projectCommon.authority.asset.taskModuleId;
                }else{
                    $('#asset-new').hide();
                    $('#asset-setType').hide();
                    $('#asset-task-new').hide();
                }
            }
    }
    /*==============================任务卡 部门 end==========================================*/
    function init(){
        var proId = Storage.getItem('projectId');
        var userId = Storage.getItem('userId');
        var $THead = $('#asset-table-head');
        var $assetTypePage = $('.assetType-contain');
        var $assetPage = $('.asset-contain');
        var $newAssetPage = $('.newAsset-contain');
        var $assetCheckPage = $('.checkAsset-contain');
        var $editAssetPage = $('.editAsset-contain');
        var $newTaskPage = $('.newTask-contain');
        var $newAsset = $('.asset-type-new');
        var $newAssetInput = $('#asset-type-new');
        var $assetPosition = $('.newTask-contain .asset-header .asset-position');
        function getSuperFatherId(){
            $.ajax({
                method:'get',
                url:'',
                success:function(data){
                    //superFather = data[0];
                    //console.log(superFather);
                },
                error:function(err){
                    console.log(err);
                }
            })
        }
        localStorage.setItem("pageType",'asset');
        getProjectInfo(proId);
        setTableHeight($('#asset-table'));
        initTable(true);
        //加载表头
        window.onresize=function(){
            setTableHeight($('#asset-table'));
        };
        $('#asset-setType').click(function(){
            $assetTypePage.show();
            initAssetType();
        });
        $('#asset-new').click(function(){
            $assetPage.hide();
            $newAssetPage.show();
            loadAssetType();
        });
        $('#asset-task-new').click(function(){
            setLocalStorage('','',$(this).attr('data-type'),'','');
            var text = $('.asset-contain .asset-header .asset-position').text();
            $assetPage.hide();
            $('.newTaskOfAsset').loadPage('taskCard.new.html');
            $assetPosition.text(text+'/任务卡');
            $newTaskPage.show();
        });
        $('#newAsset-file').on('change',function(){
            var src = $(this)[0].value;
            $(this).prev().attr("src",src);
        });
        $('#editAsset-file').on('change',function(){
            var src = $(this)[0].value;
            $(this).prev().attr("src",src);
        });
        $('#newAsset-saveBtn').click(function(){
            var assetName = $('#newAsset-name').val();
            var assetType = $("#newAsset-type option:selected").attr('id');
            var imgFile = $('#newAsset-file')[0].files;
            var assetDesc = $('#newAsset-desc').val();
            if(assetName!=''){
                newAssetFunction(proId,userId,assetName,assetType,assetDesc,imgFile);
            }else{
                console.log('空名称');
            }
            $assetPage.show();
            $newAssetPage.hide();
        });
        $('#newAsset-cancelBtn').click(function(){
            $newAssetPage.hide();
            $assetPage.show();
            clearInputs();
        });
        $THead.off('click').on('click','.iconfont.asset-icon',function(){
            var thisId = $(this).parent().attr('id');
            if($(this).hasClass('icon-open')){
                //console.log(thisId);
                changeColSpan(thisId,'open');
                $(this).removeClass('icon-open').addClass('icon-close').html('&#xe684;');
                $('.info-detail.'+thisId).show();
            }else{
                changeColSpan(thisId,'close');
                $(this).removeClass('icon-close').addClass('icon-open').html('&#xe683;');
                $('.info-detail.'+thisId).hide();
            }

        });
        $THead.eq(0)[0].ondblclick = function(e){
          if($(e.target).attr('data-flag')=='true'){
              $(e.target).find('.iconfont.asset-icon').click();
          }
        };
        //类型设置页面点击事件
        $assetTypePage.eq(0)[0].onclick = function(e){
            var typeId = null;
            var ele = null;
            var targetDOM = $(e.target);
            if(targetDOM.hasClass('icon-close')){
                $assetTypePage.hide();
            }else if(targetDOM.hasClass('asset-type-new-btn')){
                hideEditInput();
                $newAsset.show();
            }else if(targetDOM.hasClass('m-icon-cancel')){
                $newAssetInput.val('');
                $newAsset.hide();
            }else if(targetDOM.hasClass('m-icon-save')){
                var value = $newAssetInput.val();
                newAssetType(value);
                $newAssetInput.val('');
                $newAsset.hide();
            }else if(targetDOM.hasClass('asset-del')){
                ele = targetDOM.parent();
                typeId = ele.attr('id');
                delAssetType(typeId,ele);
            }else if(targetDOM.hasClass('asset-edit')){
                $newAssetInput.val('');
                $newAsset.hide();
                ele = targetDOM.parent();
                 typeId = ele.attr('id');
                var name = ele.children().eq(0).text();
                hideEditInput();
                showEditInput(typeId,ele,name);
            }else if(targetDOM.hasClass('edit-icon-cancel')){
                hideEditInput();
            }else if(targetDOM.hasClass('edit-icon-save')){
                var $editInput = $('#asset-type-edit');
                //var new_name = $editInput.val();
                //var _id = $editInput.attr('data-value');
                updateType($editInput.val(),$editInput.attr('data-value'));
            }
        };
        //类型设置页面hover事件
        $assetTypePage.eq(0)[0].onmouseover = function(e){
            var targetDOM = $(e.target);
            if(!targetDOM.hasClass('iconfont')){
                $('.asset-type-list').find('.asset-list').find('i').css({'display':'none'});
            }
            if(targetDOM.hasClass('asset-list')){
                var targetChildren = targetDOM.children();
                targetChildren.eq(1).css({'display':'inline-block'});
                targetChildren.eq(2).css({'display':'inline-block'});
            }else if($(e.target).parent().hasClass('asset-list')){
                var targetParentChildren = targetDOM.parent().children();
                targetParentChildren.eq(1).css({'display':'inline-block'});
                targetParentChildren.eq(2).css({'display':'inline-block'});
            }
        };

        $('#asset-table-foot').eq(0)[0].onclick = function(e){
            var $target = $(e.target);
            var $total_page = $('.total-page');
            var $cur_page = $('.cur-page');
            var totalPage = Math.ceil(parseInt($total_page.text())/10);
            var page = parseInt($cur_page.attr('data-value'));
            if($target.hasClass('first-page')){
                SimpleTable.getBodyData(0);
                $cur_page.text('1/'+totalPage).attr('data-value','1');
                curPage=1;
            }else if($target.hasClass('last-page')){
                SimpleTable.getBodyData(totalPage-1);
                $cur_page.text(totalPage+'/'+totalPage).attr('data-value',totalPage);
                curPage = totalPage;
            }else if($target.hasClass('prev-page')){
                if(page==1){
                }else{
                   SimpleTable.getBodyData(parseInt(page-2));
                    $cur_page.text(parseInt(page-1)+'/'+totalPage).attr('data-value',parseInt(page-1));
                    curPage = page-1;
                }
            }else if($target.parent().hasClass('prev-page')){
                if(page==1){
                }else{
                    SimpleTable.getBodyData(parseInt(page-2));
                    $cur_page.text(parseInt(page-1)+'/'+totalPage).attr('data-value',parseInt(page-1));
                    curPage = page-1;
                }
            } else if($target.hasClass('next-page')){
                if(page==totalPage){
                }else{
                    SimpleTable.getBodyData(parseInt(page));
                    $cur_page.text(parseInt(page+1)+'/'+totalPage).attr('data-value',parseInt(page+1));
                    curPage = page+1;
                }
            }else if($target.parent().hasClass('next-page')){
                if(page==totalPage){
                }else{
                    SimpleTable.getBodyData(parseInt(page));
                    $cur_page.text(parseInt(page+1)+'/'+totalPage).attr('data-value',parseInt(page+1));
                    curPage = page+1;
                }
            }else if($target.hasClass('cur-page')){
                $target.prev().css('display')=='none'?
                    ($target.prev().css({"display":"inline-block"})):
                    ($target.prev().css({"display":"none"}));

            }else if($target.parent().hasClass('cur-page-choose')){
                var choose = parseInt($target.index());
                SimpleTable.getBodyData(choose);
                $target.parent().css({"display":"none"});
                $cur_page.text(choose+1+'/'+totalPage).attr('data-value',parseInt(choose+1));
                curPage = choose+1;
            }
        };
        $('#asset-table-body').eq(0)[0].onclick = function(e){
            var $target = $(e.target);
            if($target.parent().hasClass('assets')){
                CurAssetId = $target.parent().attr('data-id');
                getAssetInfo(CurAssetId,$assetPage,$assetCheckPage,checkAsset);
            }else if($target.hasClass('onHover-showAddTaskBtn')){
                var len = moduleIdArray.length;
                var flag=false;
                for(var i=0;i<len;i++){
                    if(moduleIdArray[i]==$target.attr('data-stepId')){
                        flag=true;
                    }
                }
                if(userCreateTaskFlag==true){
                        setLocalStorage($target.attr('data-stepId'),
                            $target.attr('data-assetId'),
                            $target.attr('data-type'),
                            $target.attr('data-assetName'),
                            $target.attr('data-stepName')
                        );
                        var text = $('.asset-contain .asset-header .asset-position').text();
                        $assetPage.hide();
                        $('.newTaskOfAsset').loadPage('taskCard.new.html');
                        $assetPosition.text(text+'/任务卡');
                        $newTaskPage.show();
                }else{
                        if(flag==true){
                            setLocalStorage($target.attr('data-stepId'),
                                $target.attr('data-assetId'),
                                $target.attr('data-type'),
                                $target.attr('data-assetName'),
                                $target.attr('data-stepName')
                            );
                            var text = $('.asset-contain .asset-header .asset-position').text();
                            $assetPage.hide();
                            $('.newTaskOfAsset').loadPage('taskCard.new.html');
                            $assetPosition.text(text+'/任务卡');
                            $newTaskPage.show();
                        }else{
                            departmentObj.showAskModel('您没有该步骤下创建任务卡的权限',false);
                        }
                }
            }else if($target.parent().hasClass('onHover-showAddTaskBtn')){
                var len = moduleIdArray.length;
                var flag=false;
                for(var i=0;i<len;i++){
                    if(moduleIdArray[i]==$target.parent().attr('data-stepId')){
                        flag=true;
                    }
                }
                if(userCreateTaskFlag==true){
                        setLocalStorage($target.parent().attr('data-stepId'),
                            $target.parent().attr('data-assetId'),
                            $target.parent().attr('data-type'),
                            $target.parent().attr('data-assetName'),
                            $target.parent().attr('data-stepName')
                        );
                        var text = $('.asset-contain .asset-header .asset-position').text();
                        $assetPage.hide();
                        $('.newTaskOfAsset').loadPage('taskCard.new.html');
                        $assetPosition.text(text+'/任务卡');
                        $newTaskPage.show();
                }else{
                        if(flag==true){
                            setLocalStorage($target.parent().attr('data-stepId'),
                                $target.parent().attr('data-assetId'),
                                $target.parent().attr('data-type'),
                                $target.parent().attr('data-assetName'),
                                $target.parent().attr('data-stepName')
                            );
                            var text = $('.asset-contain .asset-header .asset-position').text();
                            $assetPage.hide();
                            $('.newTaskOfAsset').loadPage('taskCard.new.html');
                            $assetPosition.text(text+'/任务卡');
                            $newTaskPage.show();
                        }else{
                            departmentObj.showAskModel('您没有该步骤下创建任务卡的权限',false);
                        }
                }
            }else if($target.hasClass('asset-tasks')){
                localStorage.setItem("thisTaskId",$target.attr('data-taskId'));
                localStorage.setItem("pageType",'asset');
                var text = $('.asset-contain .asset-header .asset-position').text();
                $assetPage.hide();
                $('.newTaskOfAsset').loadPage('taskCard.edit.html');
                $assetPosition.text(text+'/任务卡');
                $newTaskPage.show();
            }
        };
        $assetCheckPage.eq(0)[0].onclick = function(e){
            var $target = $(e.target);
            if($target.hasClass('asset-check-close')){
                $assetCheckPage.hide();
                $assetPage.show();
            }else if($target.hasClass('asset-check-editBtn')){
                getAssetInfo(CurAssetId,$assetCheckPage,$editAssetPage,editAsset);
            }else if($target.hasClass('asset-check-delBtn')){
                var callback= function(data){
                    if(data){
                        removeAsset($assetCheckPage,$assetPage);
                    }
                };
                departmentObj.showAskModel("确认删除该资产？",true,callback);
            }else if($target.hasClass('asset-task')){
                localStorage.setItem("thisTaskId",$target.attr('data-id'));
                localStorage.setItem("pageType",'assetList');
                var text = $('.asset-contain .asset-header .asset-position').text();
                $assetCheckPage.hide();
                $('.newTaskOfAsset').loadPage('taskCard.edit.html');
                $assetPosition.text(text+'/任务卡');
                $newTaskPage.show();
            }
        };
        $editAssetPage.eq(0)[0].onclick = function(e){
            var $target = $(e.target);
            if($target.hasClass('asset-edit-close')){
                $editAssetPage.hide();
                $assetCheckPage.show();
            }else if($target.hasClass('editAsset-saveBtn')){
                var _name = $('#editAsset-name').val();
                var _type = $("#editAsset-type option:selected").attr('id');
                var _imgFile = $('#editAsset-file')[0].files;
                var _desc = $('#editAsset-desc').val();
                updateAsset(_name,_type,_desc,_imgFile,$editAssetPage,$assetCheckPage);
            }else if($target.hasClass('editAsset-cancelBtn')){
                $assetCheckPage.show();
                $editAssetPage.hide();
            }
        };
        $('body').on('click.ompa',function(e){
            var $target = $(e.target);
            if($target.hasClass('cur-page')){

            }else{
                $('.cur-page-choose').css({"display":"none"});
            }
        });
        $('#asset-manageTask').off('click').on('click',function(){
            localStorage.setItem('manageTaskUrl','/api/stepAsset/getAllByProjectId/'+proId);
            $('.taskUnderAsset').loadPage('./taskUnderAorS');
        });
        /*===============================输入验证=============================================*/
        departmentObj.bindLegalCheck([$('#asset-type-new')],0,28,'');
        departmentObj.bindLegalCheck([$('#newAsset-name'),$('#editAsset-name')],90,-38,'');
    }
    assetManagement.assetManagement = {
        init:init,
        cancelNewTask:cancelNewTask,
        backToAssetList:cancelNewTaskFromList,
        afterSaveTask:afterSaveTask,
        backToAssetListIfEdited:afterSaveTaskFromList,
        getCurUserTaskAuth:getCurUserTaskAuth,
        freshDataAfterManageTasks:freshDataAfterManageTasks,
        curUserPosition:curUserPosition
    }
}(jQuery,window);


