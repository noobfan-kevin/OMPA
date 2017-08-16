/**
 * Created by hk60 on 2016/4/18.
 */
!function($,shotManagement){
    var sceneTreeData = null;
    var superFather = null;
    var editNodeId = null;
    var CurShotId = null;
    var curNode = null;
    var curPage = 1;
    var totalPage = null;
    var Storage = window.localStorage;
    var ProId = null;
    var userId = null;
    var shotSuperFatherId = null;
    var moduleIdArray=[];
    var userCreateTaskFlag=null;
    var curUserPosition={};
    function init(){
        ProId = Storage.getItem('projectId');
        userId = Storage.getItem('userId');
        var $newShotPage = $('.newShot-contain');
        var $shotListPage = $('.shot-contain');
        var $checkShotPage = $('.checkShot-contain');
        var $editShotPage = $('.editShot-contain');
        var $shotChangJi = $('.shot-changJi-body');
        var $newTaskPage = $('.newTask-contain');
        localStorage.setItem("pageType",'shot');
        shotPageInit();
        setTableHeight($('#shot-table'));
        window.onresize=function(){
            setTableHeight($('#shot-table'));
        };
        getProjectInfo(ProId);
        /*~~~~~~~~~~~~~~~~~~~~~~~~~~~场集设置函数 start~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        var $editPage = $('.shot-changJi-edit');
        var $checkPage = $('.shot-changJi-check');
        var $newPage = $('.shot-changJi-new');
        var $tree = $('#shot-changJiTree');
        var $THead = $('#shot-table-head');
        var zTree = new ZTreeObj('');
        var $shotPosition = $('.newTask-contain .shot-header .shot-position');
        /**
         * 场集树初始化
         */
        zTree.initAll($tree,'/api/sceneInfo/getProjectList/'+ProId,function(){
            getSceneData();
            getNodeInfo(superFather.id,function(data){
                var html = getCheckHtml(data.data);
                $('#shot-changJi-check-detail').html(html);
            });
        });
        /**
         * 新建场集
         */
        $('#shot-changJi-add-btn').click(function(){
            $checkPage.hide();
            $newPage.show();
            var curId = zTree.getCheckedNode();
            var json = getSelectHtml(curId);
            //console.log(json);
            $('#shot-changJi-new-parentId').html(json.html);
            var optionDomObj= $('#shot-changJi-new-parentId').get(0);
                    optionDomObj.options[json.index].selected = true;
            //getSelectName(curId);

        });

        /**
         * 新建场集-保存
         */
        $('.shot-changJi-new-save').click(function(){
            var name =  $('#shot-changJi-new-name').val();
            var fatherId = $("#shot-changJi-new-parentId option:selected").attr('id');
            $.ajax({
                method:'post',
                url:'/api/sceneInfo/new',
                data:{"name":name,"fatherId":fatherId,"projectId":ProId},
                success:function(data){
                    console.log(data);
                    zTree.addNode(name,fatherId,'shot-changJiTree',data.id);
                    $newPage.hide();
                    $checkPage.show();
                    checkThisNode(data.id);
                    clearInputs();
                    getSceneData();
                },
                error:function(err){
                    console.log(err);
                }
            })
        });

        /**
         * 新建场集-取消
         */
        $('.shot-changJi-new-cancel').click(function(){
            $newPage.hide();
            $checkPage.show();
            clearInputs();
        });

        /**
         * 树的点击事件
         */
        $tree.click(function(){
            var nodeId = zTree.getCheckedNode();
            getNodeInfo(nodeId,function(data){
                var html = getCheckHtml(data.data);
                $('#shot-changJi-check-detail').html(html);
            });
        });

        /**
         * 场集-编辑
         */
        $('#shot-changJi-edit-btn').click(function(){
            var id = zTree.getCheckedNode();
            editNodeId = id;
            getNodeInfo(id,function(data){
                if(id==superFather.id){
                    var html = '<div class="shot-changJi-detail">\
                                    <span>节点名称：</span>\
                                    <input id="shot-changJi-edit-name" maxlength="20" type="text" onKeypress="javascript:if(event.keyCode == 32||event.keyCode == 39)event.returnValue = false;">\
                                </div>';
                    $('#shot-changJi-edit-detail').html(html);
                    $('#shot-changJi-edit-name').val(data.data.name);
                }else{
                    var json = getSelectHtmlforEdit(data.data.id,data.data.fatherId);
                    var html = '<div class="shot-changJi-detail">\
                                    <span>节点名称：</span>\
                                    <input id="shot-changJi-edit-name" maxlength="20" type="text" onKeypress="javascript:if(event.keyCode == 32||event.keyCode == 39)event.returnValue = false;">\
                                </div>\
                                <div class="shot-changJi-detail">\
                                    <span>上级节点：</span>\
                                    <select id="shot-changJi-edit-parentId">'+json.html+'</select>\
                                </div>';
                    $('#shot-changJi-edit-detail').html(html);
                    var optionDomObj= $('#shot-changJi-edit-parentId').get(0);
                    optionDomObj.options[json.index].selected = true;
                    $('#shot-changJi-edit-name').val(data.data.name);
                }
                departmentObj.bindLegalCheck([$('#shot-changJi-edit-name')],96,-28,'');
            });
            $checkPage.hide();
            $editPage.show();
        });

        /**
         * 场集-编辑-保存
         */
        $('.shot-changJi-edit-save').click(function(){
            var data = null;
            var new_name = $('#shot-changJi-edit-name').val();
            if(editNodeId==superFather.id){
                data={"name":new_name};
            }else{
                var new_fatherId = $("#shot-changJi-edit-parentId option:selected").attr('id');
                data={"name":new_name,"fatherId":new_fatherId};
            }
            $.ajax({
                method:'put',
                url:'/api/sceneInfo/Update/'+editNodeId,
                data:data,
                success:function(data){
                    zTree.UpdateNode('shot-changJiTree',new_fatherId,editNodeId,new_name);
                   getNodeInfo(editNodeId,function(data){
                    var html = getCheckHtml(data.data);
                    $('#shot-changJi-check-detail').html(html);
                   });
                    $editPage.hide();
                    $checkPage.show();
                    getSceneData();
                },
                error:function(err){
                    console.log(err);
                }
            })
        });

        /**
         * 编辑取消
         */
        $('.shot-changJi-edit-cancel').click(function(){
            $editPage.hide();
            $checkPage.show();
        });

        /**
         * 删除场集
         */
        $('#shot-changJi-del-btn').click(function(){
            departmentObj.showAskModel('确认否删除该节点？',true,function(flag){
                if(flag){
                    var curId = curNode.id;
                    var fatherId = curNode.fatherId;
                    deleteNode(curId,function(){
                        zTree.deleteNode('shot-changJiTree',curId,fatherId);
                        getNodeInfo(fatherId,function(data){
                            var html = getCheckHtml(data.data);
                            $('#shot-changJi-check-detail').html(html);
                        });
                        getSceneData();
                    });
                }
            })
        });

        /**
         * 场集设置按钮点击事件
         */
        $('#shot-partSet').click(function(){
            $shotListPage.hide();
            $shotChangJi.show();
        });

        /**
         * 场集设置界面，返回按钮点击事件
         */
        $('#shot-changJi-header-back').click(function(){
            $shotChangJi.hide();
            $shotListPage.show();
        });
        /*~~~~~~~~~~~~~~~~~~~~~~~~~场集设置函数 end~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        $('#shot-task-new').click(function(){
            setLocalStorage('','',$(this).attr('data-type'),'','');
            var  text = $('.shot-contain .shot-header .shot-position').text();
            $shotListPage.hide();
            $('.newTaskOfShot').loadPage('taskCard.new.html');
            $shotPosition.text(text+'/任务卡');
            $newTaskPage.show();
        });



        var $table_body = $('#shot-table-body');

        /**
         * 表格-翻页功能函数
         * @param e
         */
        $('#shot-table-foot').eq(0)[0].onclick = function(e){
            var $target = $(e.target);
            var $total_page = $('.total-page');
            var $cur_page = $('.cur-page');
            totalPage = Math.ceil(parseInt($total_page.text())/10);
            var page = parseInt($cur_page.attr('data-value'));
            if($target.hasClass('first-page')){
                SimpleTable.getShotData(0);
                $cur_page.text('1/'+totalPage).attr('data-value','1');
                curPage = 1;
            }else if($target.hasClass('last-page')){
                SimpleTable.getShotData(totalPage-1);
                $cur_page.text(totalPage+'/'+totalPage).attr('data-value',totalPage);
                curPage = totalPage;
            }else if($target.hasClass('prev-page')){
                console.log(page);
                if(page==1){
                }else{
                    SimpleTable.getShotData(parseInt(page-2));
                    $cur_page.text(parseInt(page-1)+'/'+totalPage).attr('data-value',parseInt(page-1));
                    curPage = page-1;
                }
            }else if($target.parent().hasClass('prev-page')){
                if(page==1){
                }else{
                    SimpleTable.getShotData(parseInt(page-2));
                    $cur_page.text(parseInt(page-1)+'/'+totalPage).attr('data-value',parseInt(page-1));
                    curPage = page-1;
                }
            } else if($target.hasClass('next-page')){
                if(page==totalPage){
                }else{
                    SimpleTable.getShotData(parseInt(page));
                    $cur_page.text(parseInt(page+1)+'/'+totalPage).attr('data-value',parseInt(page+1));
                    curPage = page+1;
                }
            }else if($target.parent().hasClass('next-page')){
                if(page==totalPage){
                }else{
                    SimpleTable.getShotData(parseInt(page));
                    $cur_page.text(parseInt(page+1)+'/'+totalPage).attr('data-value',parseInt(page+1));
                    curPage = page+1;
                }
            }else if($target.hasClass('cur-page')){
                $target.prev().css('display')=='none'?
                    ($target.prev().css({"display":"inline-block"})):
                    ($target.prev().css({"display":"none"}));

            }else if($target.parent().hasClass('cur-page-choose')){
                var choose = parseInt($target.index());
                SimpleTable.getShotData(choose);
                $target.parent().css({"display":"none"});
                $cur_page.text(choose+1+'/'+totalPage).attr('data-value',parseInt(choose+1));
                curPage = choose+1;
            }
        };

        /**
         * 表格-body-点击事件
         * @param e
         */
        $table_body.eq(0)[0].onclick = function(e){
            var $target = $(e.target);
            if($target.parent().hasClass('shots')){
                CurShotId = $target.parent().attr('data-id');
                getShotInfo(CurShotId,$shotListPage,$checkShotPage,checkShot);
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
                        $target.attr('data-shotId'),
                        $target.attr('data-type'),
                        $target.attr('data-shotName'),
                        $target.attr('data-stepName')
                    );
                    var  text = $('.shot-contain .shot-header .shot-position').text();
                    $shotListPage.hide();
                    $('.newTaskOfShot').loadPage('taskCard.new.html');
                    $shotPosition.text(text+'/任务卡');
                    $newTaskPage.show();
                }else{
                    if(flag==true){
                        setLocalStorage($target.attr('data-stepId'),
                            $target.attr('data-shotId'),
                            $target.attr('data-type'),
                            $target.attr('data-shotName'),
                            $target.attr('data-stepName')
                        );
                        var  text = $('.shot-contain .shot-header .shot-position').text();
                        $shotListPage.hide();
                        $('.newTaskOfShot').loadPage('taskCard.new.html');
                        $shotPosition.text(text+'/任务卡');
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
                        $target.parent().attr('data-shotId'),
                        $target.parent().attr('data-type'),
                        $target.parent().attr('data-shotName'),
                        $target.parent().attr('data-stepName')
                    );
                    var  text = $('.shot-contain .shot-header .shot-position').text();
                    $shotListPage.hide();
                    $('.newTaskOfShot').loadPage('taskCard.new.html');
                    $shotPosition.text(text+'/任务卡');
                    $newTaskPage.show();
                }else{
                    if(flag==true){
                        setLocalStorage($target.parent().attr('data-stepId'),
                            $target.parent().attr('data-shotId'),
                            $target.parent().attr('data-type'),
                            $target.parent().attr('data-shotName'),
                            $target.parent().attr('data-stepName')
                        );
                        var  text = $('.shot-contain .shot-header .shot-position').text();
                        $shotListPage.hide();
                        $('.newTaskOfShot').loadPage('taskCard.new.html');
                        $shotPosition.text(text+'/任务卡');
                        $newTaskPage.show();
                    }else{
                        departmentObj.showAskModel('您没有该步骤下创建任务卡的权限',false);
                    }
                }
            }else if($target.hasClass('shot-tasks')){
                localStorage.setItem("thisTaskId",$target.attr('data-taskId'));
                localStorage.setItem("pageType",'shot');
                var  text = $('.shot-contain .shot-header .shot-position').text();
                $shotListPage.hide();
                $('.newTaskOfShot').loadPage('taskCard.edit.html');
                $shotPosition.text(text+'/任务卡');
                $newTaskPage.show();
            }
        };

        /**
         * 表格-body-展开合并事件
         */
        $table_body.off('click').on('click','.iconfont.tr-icon',function(){
            var id = $(this).parent().parent().attr('id');
            if($(this).hasClass('tr-icon-open')){
                $(this).removeClass('tr-icon-open').addClass('tr-icon-close').html('&#xe681;');
                $('.'+id).hide();
            }else{
                $(this).removeClass('tr-icon-close').addClass('tr-icon-open').html('&#xe67b;');
                $('.'+id).show();
            }
            lockTrWidth($THead);
        });
        $THead.eq(0)[0].ondblclick = function(e){
            if($(e.target).attr('data-flag')=='true'){
                $(e.target).find('.iconfont.shot-icon').click();
            }
        };
        /**
         * 表格-head-展开合并事件
         */
        $THead.off('click').on('click','.iconfont.shot-icon',function(){
            var thisId = $(this).parent().attr('id');
            var $allTr = $('.shot-chang-tr  td');
            if($(this).hasClass('icon-open')){
                changeColSpan(thisId,'open');
                $(this).removeClass('icon-open').addClass('icon-close').html('&#xe684;');
                $('.info-detail.'+thisId).show();
                $allTr.attr('colspan',parseInt($allTr.attr('colspan'))+4);
            }else{
                changeColSpan(thisId,'close');
                $(this).removeClass('icon-close').addClass('icon-open').html('&#xe683;');
                $('.info-detail.'+thisId).hide();
                $allTr.attr('colspan',parseInt($allTr.attr('colspan'))-4);
            }
            lockTrWidth($THead);
        });
        /*=========================编辑镜头============================================*/
        /**
         * 镜头编辑页面函数
         * @param e
         */
        $editShotPage.eq(0)[0].onclick = function(e){
            var $target = $(e.target);
            if($target.hasClass('editShot-saveBtn')){
                var img = $('#editShot-file')[0].files;
                var new_data = {"name":$('#editShot-name').val(),
                                "shotCode":$('#editShot-code').val(),
                                "desc":$('#editShot-desc').val(),
                                "changId":$('#editShot-chang option:selected').attr('id'),
                                "jiId":$('#editShot-ji option:selected').attr('id')};
                updateShot(new_data,CurShotId,function(data){
                    if(img.length==0){
                        getShotInfo(CurShotId,$editShotPage,$checkShotPage,checkShot);
                        initTable(false);
                    }else{
                        UpLoadImg(img,CurShotId,false,function(){
                            getShotInfo(CurShotId,$editShotPage,$checkShotPage,checkShot)
                        });
                    }

                });
            }else if($target.hasClass('editShot-cancelBtn')){
                $editShotPage.hide();
                $checkShotPage.show();
            }
        };
        /*=========================查看镜头============================================*/
        /**
         * 镜头查看页面函数
         * @param e
         */
        $checkShotPage.eq(0)[0].onclick = function(e){
            var $target = $(e.target);
            if($target.hasClass('shot-check-close')){
                $checkShotPage.hide();
                $shotListPage.show();
            }else if($target.hasClass('shot-check-editBtn')){
                //console.log('bianji');
                getShotInfo(CurShotId,$checkShotPage,$editShotPage,editShot);
            }else if($target.hasClass('shot-check-delBtn')){
                departmentObj.showAskModel('确认删除该镜头？',true,function(flag){
                   if(flag){
                       deleteShot(CurShotId,function(){
                           $checkShotPage.hide();
                           $shotListPage.show();
                           initTable(false);
                       });
                   }
                });

            }else if($target.hasClass('shot-task')){
                localStorage.setItem("thisTaskId",$target.attr('data-id'));
                localStorage.setItem("pageType",'shotList');
                var  text = $('.shot-contain .shot-header .shot-position').text();
                $checkShotPage.hide();
                $('.newTaskOfShot').loadPage('taskCard.edit.html');
                $shotPosition.text(text+'/任务卡');
                $newTaskPage.show();
            }
        };
        /*=========================新建镜头============================================*/
        $('#shot-new').click(function(){
            $shotListPage.hide();
            $newShotPage.show();
            getChangJiList(superFather.id,function(data){
                var option = getChangJiSelectHtml(data);
                $('#newShot-ji').html(option);
                getChangJiList(data[0].id,function(data){
                    var option = getChangJiSelectHtml(data);
                    $('#newShot-chang').html(option);
                })
            });
        });
        $('#newShot-ji').on('change',function(){
            var id  = $("#newShot-ji option:selected").attr('id');
            getChangJiList(id,function(data){
                var option = getChangJiSelectHtml(data);
                $('#newShot-chang').html(option);
            });
        });
        $('#newShot-file').on('change',function(){
            var src = $(this)[0].value;
            $(this).prev().attr("src",src);
        });
        $('#editShot-file').on('change',function(){
            var src = $(this)[0].value;
            $(this).prev().attr("src",src);
        });
        $('#newShot-saveBtn').click(function(){
            var shot_name =  $('#newShot-name').val();
            var shot_code =  $('#newShot-code').val();
            var shot_desc =  $('#newShot-desc').val();
            var shot_chang = $("#newShot-chang option:selected").attr('id');
            var shot_ji = $("#newShot-ji option:selected").attr('id');
            var img_file = $('#newShot-file')[0].files;
            var info = {"name":shot_name,"shotCode":shot_code,"desc":shot_desc,"creatorId":userId,"projectId":ProId,"changId":shot_chang,"jiId":shot_ji};
            if(shot_name==''||shot_code==''||shot_chang==''){
                console.log('错误输入');
            }else{
                newScene(info,img_file,function(){
                    initTable(true);
                });
                $newShotPage.hide();
                $shotListPage.show();
            }
        });
        $('#newShot-cancelBtn').click(function(){
            $newShotPage.hide();
            $shotListPage.show();
            clearShotInput();
        });
        /*=========================镜头列表页面============================================*/
        $('#shot-partCheck').on('change',function(){
            var jiId = $('#shot-partCheck option:selected').attr('id');
            SimpleTable.getShotCount('shot',jiId);
        });
        $('body').on('click.ompa',function(e){
            var $target = $(e.target);
            if($target.hasClass('cur-page')){

            }else{
                $('.cur-page-choose').css({"display":"none"});
            }
        });
        $('#shot-manageTask').off('click').on('click',function(){
            localStorage.setItem('manageTaskUrl','/api/stepShot/getAllByProjectId/'+ProId);
            $('.taskUnderAsset').loadPage('./taskUnderAorS');
        });
        /*==========================全部页面输入框格式验证==================================*/
        departmentObj.bindLegalCheck([$('#shot-changJi-new-name')],96,-28,'');
        departmentObj.bindLegalCheck([$('#newShot-name'),$('#newShot-code'),$('#editShot-name'),$('#editShot-code')],90,-38,'');
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
        $('.shot-contain').show();
        $('.newTask-contain').hide();
        window.onresize=function(){
            setTableHeight($('#shot-table'));
        };
    }
    function cancelNewTaskFromList(){
        $('.checkShot-contain').show();
        $('.newTask-contain').hide();
    }
    function freshenList(){
        //var $curPage = $('.cur-page');
        //curPage = parseInt($('.cur-page').text());
        $('.iconfont.shot-icon.icon-close').click();
        SimpleTable.getShotData(parseInt(curPage)-1);
        $('.cur-page').text(curPage+'/'+Math.ceil(parseInt($('.total-page').text())/10)).attr('data-value',curPage);
        window.onresize=function(){
            setTableHeight($('#shot-table'));
        };
    }
    function afterSaveTask(){
        freshenList();
        $('.shot-contain').show();
        $('.newTask-contain').hide();
    }
    function afterSaveTaskFromList(){
        getShotInfo(CurShotId,$('.newTask-contain'),$('.checkShot-contain'),checkShot);
        freshenList();
    }
    /**
     * 固定折叠TR宽度
     * @param $THead
     */
    function lockTrWidth($THead){
        var width = $THead.find('tr').width();
        $('.shot-chang-tr td').css({"width":width});
    }

    /**
     * 临时函数！！！！
     * @param data
     */
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
    /*~~~~~~~~~~~~~~~~~~~~~~~~~场集设置函数 start~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    /**
     * 清空输入内容
     */
    function clearInputs(){
        $('#shot-changJi-new-name').val('');
    }

    /**
     *      获取点击节点的信息
     ** @param id 点击节点ID
     * @param callBack 回调函数
     */
    function getNodeInfo(id,callBack){
        $.ajax({
            method:'get',
            url:'/api/sceneInfo/sceneTree/'+id,
            success:function(data){
                curNode = data.data;
                callBack(data);
            },
            error:function(err){
                console.log(err);
            }
        })
    }

    /**
     * 选中该节点,调整选中状态
     * @param id
     */
    function checkThisNode(id){
        $('.department-tree-span').removeClass('department-tree-span-active');
        $('#'+id).addClass('department-tree-span-active');
    }

    /**
     * 获取当前项目下场集信息
     */
    function getSceneData(){
        $.ajax({
            method:'get',
            url:'/api/sceneInfo/getProjectList/'+ProId,
            success:function(data){
                sceneTreeData = data.list;
            },
            error:function(err){
                console.log(err);
            }
        })
    }

    /**
     * 获取超级节点(root)
     * @param callback
     */
    function getSuperFather(callback){
        $.ajax({
            method:'get',
            url:'/api/sceneInfo/getSuperFatherId',
            success:function(data){
               superFather = data[0];
                //console.log('superFather111111111:',superFather);
                callback();
            },
            error:function(err){
                console.log(err);
            }
        })
    }

    /**
     * 获取option数据
     * @param id
     * @returns {string}
     */
    function getSelectHtml(id){
        var option_index = 0;
        var index = 0;
        var html = '';
        var len = sceneTreeData.length;
        for(var i=0;i<len;i++){
                if(sceneTreeData[i].id==id){
                    index=option_index;
                }
                html+='<option id="'+sceneTreeData[i].id+'">'+sceneTreeData[i].name+'</option>'  ;
                option_index+=1;
        }
        return {"html":html,"index":index};
    }

    function getSelectHtmlforEdit(id,fatherId){
        var zTree = $.fn.zTree.getZTreeObj("shot-changJiTree"),
            treeNode = zTree.getNodeByParam('id',id,null);
        STR = [];
        getNodeChildId(treeNode);
        var option_index = 0;
        var index = 0;
        var html = '';
        var len = sceneTreeData.length;
        var s_len = STR.length;
        var flag = null;
        for(var i=0;i<len;i++){
            flag = true;
            for(var j=0;j<s_len;j++){
                if(STR[j]==sceneTreeData[i].id){
                    flag = false;
                }
            }
            if(flag){
                if(sceneTreeData[i].id==fatherId){
                    index=option_index;
                }
                html+='<option id="'+sceneTreeData[i].id+'">'+sceneTreeData[i].name+'</option>'  ;
                option_index+=1;
             }
        }
        return {"html":html,"index":index};
    }
    /**
     * 获取节点的全部子节点ID
     * 存放到全局变量STR
     * @type {Array}
     */
    var STR =[];
    function getNodeChildId(treeNode){
        if(treeNode.children){
            for(var i=0;i<treeNode.children.length;i++){
                STR.push(treeNode.id);
                getNodeChildId(treeNode.children[i]);
            }
        }else{
            STR.push(treeNode.id);
        }
    }
    /**
     * 获取节点的上级节点名称
     */
    function getSelectName(){
        var $select = $('#shot-changJi-new-parentId');
        curNode.fatherId==superFather.id?(
            $select.val(curNode.name)
        ):(curNode.id==superFather.id?(
            $select.val(curNode.name)
        ):(getNodeName(curNode.fatherId,function(data){
            $select.val(data.data.name)}
        )));
    }

    /**
     * 获取节点信息
     * @param id
     * @param callBack
     */
    function getNodeName(id,callBack){
        $.ajax({
            method:'get',
            url:'/api/sceneInfo/sceneTree/'+id,
            success:function(data){
                callBack(data);
            },
            error:function(err){
                console.log(err);
            }
        })
    }

    /**
     * 选中节点后，显示节点信息
     * @param data
     * @returns {string}
     */
    function getCheckHtml(data){
        var html = '';
        if(data.id==superFather.id){
            html = '<div class="shot-changJi-detail">\
                        <span>节点名称：</span>\
                        <label>'+data.name+'</label>\
                    </div>';
            $('#shot-changJi-del-btn').css({"display":"none"});
        }else{
            html = '<div class="shot-changJi-detail">\
                        <span>节点名称：</span>\
                        <label>'+data.name+'</label>\
                    </div>\
                    <div class="shot-changJi-detail">\
                        <span>上级节点：</span>\
                        <label>'+data.father.name+'</label>\
                    </div>';
            $('#shot-changJi-del-btn').css({"display":"inline-block"});
        }
        return html;
    }

    /**
     * 删除节点
     * @param id
     * @param callback
     */
    function deleteNode(id,callback){
        beforeDelNode(id,function(num){
            if(num!=0){
                departmentObj.showAskModel('当前场集下包含镜头，不可删除',false);
            }else{
                $.ajax({
                    method:'delete',
                    url:'/api/sceneInfo/Delete/'+id,
                    success:function(data){
                        callback();
                    },
                    error:function(err){
                        console.log(err);
                    }
                })
            }
        });

    }

    /**
     * 删除节点先判断节点下是否存在镜头
     * @param id
     * @param callback
     */
    function beforeDelNode(id,callback){
        $.ajax({
            method:'get',
            url:'/api/scene/checkUnderNode/'+id,
            success:function(data){
                callback(data.count);
            },
            error:function(err){
                console.log(err);
            }
        })
    }
    /**
     * 项目创建完成，创建默认第一集 和 第一场
     */
    function createDefaultJiAndChang(projectId){
        getSuperFather(function(){
            return new Promise(function(resolve, reject){
                $.ajax ({
                    method:'post',
                    url:'/api/sceneInfo/new',
                    data:{"fatherId":superFather.id,"name":"第一集","projectId":projectId},
                    success:function(data){
                        //console.log('data',data);
                        console.log('默认集创建成功');
                        resolve(data.id);
                    },
                    error:function(err){
                        reject(err);
                    }
                });
            }).then(function(fatherId){
                return new Promise(function(resolve, reject){
                    $.ajax({
                        method:'post',
                        url:'/api/sceneInfo/new',
                        data:{"fatherId":fatherId,"name":"第一场","projectId":projectId},
                        success:function(data){
                            resolve();
                            console.log('默认场创建成功');
                        },
                        error:function(err){
                            reject(err);
                        }
                    });
                });
            }, function(){
                //console.log(data);
                console.log('创建默认集失败');
            }).then(null, function(){
                console.log('创建默认场失败');
            }).catch(function(err){
                console.log('错误：'+ err);
            });
        });

    }
    /*~~~~~~~~~~~~~~~~~~~~~~~~~场集设置函数 end~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    /**
     * 清空新建镜头输入页面
     */
    function  clearShotInput(){
        $('#newShot-name').val('');
        $('#newShot-code').val('');
        $('#newShot-desc').val('');
        $('#newShot-file').val('');
        $("#newShot-img").attr('src','');
    }

    /**
     * 获取镜头信息
     * @param id  id
     * @param $hidePage  将要隐藏的页面
     * @param $showPage   将要显示的页面
     * @param callback
     */
    function getShotInfo(id,$hidePage,$showPage,callback){
        $.ajax({
            method:'get',
            url:'/api/scene/shot/'+id,
            success:function(data){
                callback(data.data,$hidePage,$showPage);
            },
            error:function(err){
                console.log(err);
            }
        })
    }

    /**
     * 选中镜头后查看信息
     * @param data
     * @param $hide
     * @param $show
     */
    function checkShot(data,$hide,$show){
        //console.log(data);
        var tasks = data.Tasks;
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
            spanHtml+='<span class="shot-task '+taskStatus+'" data-id="'+tasks[i].id+'">'+curVersion.name+'</span>'
        }
        $hide.hide();
        //$show.show();
        $show.find('span.shot-name')[0].innerText = data.name;
        $show.find('span.shot-code')[0].innerText = data.shotCode;
        $show.find('.shot-changJi')[0].innerText = data.chang.name+'>>'+data.ji.name;
        $show.find('.shot-desc')[0].innerText = data.desc;
        $show.find('.shot-img').attr("src",configInfo.server_url+'/'+data.assetImg);
        $('.shot-task-div').html(spanHtml);
        if(projectCommon.authority.manageAllProjects==true||projectCommon.authority.isProjectLeader==true) {//管理项目，项目负责人
            $show.show();
            $('.shot-check-editBtn').show();
            $('.shot-check-delBtn').show();
        }
        else if(projectCommon.authority.shot.isTaskLeader==true){
            $show.show();
            $('.shot-check-editBtn').show();
            $('.shot-check-delBtn').show();
        }
        else{
            $show.show();
            $('.shot-check-editBtn').hide();
            $('.shot-check-delBtn').hide();
        }
    }

    /**
     * 编辑镜头
     * @param data
     * @param $hide
     * @param $show
     */
    function editShot(data,$hide,$show){
        var _data = data;
        getChangJiList(superFather.id,function(data){
            var ji_json = getSelectedHtml(data,_data.jiId);
            getChangJiList(_data.jiId,function(data){
                var chang_json = getSelectedHtml(data,_data.changId);
                $('#editShot-name').val(_data.name);
                $('#editShot-code').val(_data.shotCode);
                $('#editShot-desc').val(_data.desc);
                $('#editShot-chang').html(chang_json.html);
                var optionDomObj= $('#editShot-chang').get(0);
                optionDomObj.options[chang_json.index].selected = true;
                $('#editShot-ji').html(ji_json.html);
                var optionDomObj= $('#editShot-ji').get(0);
                optionDomObj.options[ji_json.index].selected = true;
                $('#editShot-img').attr('src',configInfo.server_url+'/'+_data.assetImg);
                $hide.hide();
                $show.show();
            })
        });
    }

    /**
     * 更新镜头
     * @param data
     * @param id
     * @param callback
     */
    function updateShot(data,id,callback){
        $.ajax({
            method:'put',
            url:'/api/scene/Update/'+id,
            data:data,
            success:function(data){
                callback(data);
            },
            error:function(err){
                console.log(err);
            }
        })
    }

    /**
     * 删除镜头
     * @param id
     * @param callback
     */
    function deleteShot(id,callback){
        new Promise(function(resoluve,reject){
            $.ajax({
                method:'delete',
                url:'/api/scene/Delete/'+id,
                success:function(data){
                    resoluve(data);
                },
                error:function(err){
                    reject(err);
                }
            })
        }).then(function(success){
            callback();
            $.ajax({
                method:'delete',
                url:'/api/file/deleteBySourceKey/'+id,
                success:function(data){
                    console.log('删除镜头对应缩略图成功',data);
                },
                error:function(data){
                    console.log('删除镜头对应缩略图shibai',data);
                }
            });
        },function(error){
            console.log(error);
        }).catch(function(data){
            console.log('error',data);
        });

    }

    /**
     * 调整表格所占列数
     * @param thisId
     * @param type
     */
    function changeColSpan(thisId,type){
        var DOM = $('#'+thisId);
        var addSpan = parseInt(DOM.attr('colspan'))+4;
        var delSpan = parseInt(DOM.attr('colspan'))-4;
        var pId = DOM.attr('data-class');
        if(type=='open'){
            DOM.attr('colspan',addSpan);
        }else{
            DOM.attr('colspan',delSpan);
        }
        if(shotSuperFatherId!=pId){
            changeColSpan(pId,type);
        }
    }

    /**
     * 高度动态调整
     * @param ele
     */
    function setTableHeight(ele){
        var winHeight = window.innerHeight;
        ele.css({"height":winHeight-200});
    }

    /**
     * 页面初始化
     */
    function shotPageInit(){
        getSuperFather(function(){
            getChangJiList(superFather.id,function(data){
                var option = getChangJiSelectHtml(data);
                $('#shot-partCheck').html(option);
                initTable(true);
                })
            }
        );
    }

    function getShotSuperFatherId(callback){
        $.ajax({
            method:'get',
            url:'/api/stepShot/getRootByProjectId/'+ProId,
            success:function(data){
                console.log('getRootByProjectId',data);
                shotSuperFatherId = data.list.id;
                callback();
            },
            error:function(err){
                console.log(err);
            }
        })
    }

    /**
     * 表格初始化
     */
    function initTable(type){
        if(type){
            getShotSuperFatherId(function(){
                var jiId = $('#shot-partCheck option:selected').attr('id');
                SimpleTable.initTable('/api/stepShot/getAllByProjectId/'+ProId,
                    'shot',
                    shotSuperFatherId,
                    {"countUrl":'/api/scene/count',"dataUrl":'/api/scene/getList/',"jiId":jiId});
            });
        }else{
            SimpleTable.getShotData(parseInt(curPage)-1);
        }

    }

    /**
     * 获取当前项目下场集
     * @param id
     * @param callback
     */
    function getChangJiList(id,callback){
        $.ajax({
            method:'get',
            url:'/api/sceneInfo/getList/'+id,
            data:{"projectId":ProId},
            success:function(data){
                callback(data);
            },
            error:function(err){
                console.log(err);
            }
        });
    }

    /**
     * 获取option
     * @param data
     * @param id
     * @returns {string}
     */
    function getSelectedHtml(data,id){
        var option = '';
        var len = data.length;
        var index = 0;
        for(var c=0;c<len;c++){
            if(data[c].id==id){
                index = c;
            }
            option+='<option id="'+data[c].id+'">'+data[c].name+'</option>';
        }
        return {"html":option,"index":index};
    }

    /**
     * 获取option
     * @param data
     * @returns {string}
     */
    function getChangJiSelectHtml(data){
        var option = '';
        var len = data.length;
        for(var c=0;c<len;c++){
            option+='<option id="'+data[c].id+'">'+data[c].name+'</option>';
        }
        return option;
    }

    /**
     * 新建镜头
     * @param info
     * @param img_file
     * @param callback
     */
    function newScene(info,img_file,callback){
        $.ajax({
            method:"post",
            data:info,
            url:'/api/scene/new',
            success:function(data){
                console.log(data);
                if(!data.id||data.id.length===0)
                {
                    alert('err! '+data);
                }
                if(img_file.length!=0) {
                    UpLoadImg(img_file, data.id,true);
                }else{
                    clearShotInput();
                    callback();
                }
            },
            error:function(err){
                console.log(err);
            }
        })
    }

    /**
     * 上传图片
     * @param file
     * @param Id
     * @param callback
     * @constructor
     */
    function UpLoadImg(file,Id,type,callback){
        fileUploader(file,{
            success:function() {
                if(callback){
                    callback();
                }
                initTable(type);
                clearShotInput();
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
                "shotId":Id,
                "sourceKey":Id
            }
        });
    }

    function getProjectInfo(proId){
        $.ajax({
            method:'get',
            url:'/api/project/'+proId,
            success:function(data){
                $('.shot-position').text(data.list.name+'/镜头管理');  //当前位置显示
            },
            error:function(){

            }
        });
    }
    function getCurUserTaskAuth(){
        if(projectCommon.authority.manageAllTasks==true||projectCommon.authority.isProjectLeader==true||projectCommon.authority.manageAllProjects==true){
             $('#shot-manageTask').show();

        }
        if(projectCommon.authority.manageAllTasks==true||projectCommon.authority.isProjectLeader==true){
           // $('#shot-task-new').show();
            $('#shot-new').show();
            $('#shot-partSet').show();
            userCreateTaskFlag=true;
            curUserPosition.manageAllTasks='true';
        }else{
            if(projectCommon.authority.shot.isTaskLeader==true){
               // $('#shot-task-new').show();
                $('#shot-new').show();
                $('#shot-partSet').show();
                moduleIdArray = projectCommon.authority.shot.taskModuleId;
            }else{
                $('#shot-new').hide();
                $('#shot-partSet').hide();
                $('#shot-task-new').hide();
            }
        }
    }

    function freshDataAfterManageTask (){
        SimpleTable.getShotData(parseInt(curPage)-1);
    }

    shotManagement.ShotMangement = {
        init:init,
        createDefaultJiAndChang:createDefaultJiAndChang,
        cancelNewTask:cancelNewTask,
        backToShotList:cancelNewTaskFromList,
        afterSaveTask:afterSaveTask,
        curUserPosition:curUserPosition,
        backToShotListIfEdited:afterSaveTaskFromList,
        getCurUserTaskAuth:getCurUserTaskAuth,
        freshDataAfterManageTask:freshDataAfterManageTask
    }
}(jQuery,window);