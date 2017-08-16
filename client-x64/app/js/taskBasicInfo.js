/**
 * Created by hk054 on 2016/5/5.
 */
(function($,g){
    //跳转有4个地方   （点返回，+，新建的保存，取消，   审核）
    var projectId='',
        taskCheckers=[],
        type=2, //默认资产;
        resourceId='',
        resourceName='',
        stepId='',
        stepName='',
        creatorId=localStorage.getItem('userId'),
        newTask=false,//false 为edit， true为新建
        thisTaskId='', //这个任务卡的Id
       taskVersionId='',//任务卡版本id
        newVersion='', //新建任务或版本
        timer=null, //倒计时定时器
        $InfosTemplate=null, //任务基本信息显示模板
        authorityData=null;



    //编辑/查看/新建任务/新建任务版本 标题的切换
    function tabTitle(titleType) {
        $(titleType,'#taskStatus').show().siblings().hide();
    }
    //获取和刷新可选审核人（项目成员）
    function getAllProjectMembers(id){
        $.ajax({
            url:'/api/project/'+ localStorage.getItem('projectId'),
            type: 'get',
            async: true,
            dataType: 'json',
            success: function(data) {
                console.log('----------获取项目的所有成员------------',data);
                if(data.ok){
                    console.log(data.list.Users);
                    var arr=data.list.Users;
                    if(arr.length!=0){
                        $('#my-project-add-chooseAllPeople').show();
                        //console.log('111'+JSON.stringify(data.data));
                        var str='';
                        var chooseNum=0;
                        for(var i=0; i<arr.length; i++){
                            var has=shot.findInArr(taskCheckers,arr[i].id);
                            //console.log('click----------+'+JSON.stringify(projectCommon.playerRecord));
                            if(has!=-1){
                                chooseNum++;    //√
                                str+= '<li data-value="'+arr[i].id+'" class="my-project-add-choose-people"><i style="color:#999;" data-value="'+arr[i].id+'"  class="iconfont">&#xe64b;</i><span>'+arr[i].name+'</span></li>';
                            }else{        //×
                                str+= '<li data-value="'+arr[i].id+'" class="my-project-add-choose-people"><i class="iconfont">&#xe64c;</i><span>'+arr[i].name+'</span></li>';
                            }
                        }
                        $('#my-project-add-chooseList').html(str);

                    }else{
                        $('#my-project-add-chooseAllPeople').hide();
                        $('#my-project-add-chooseList').html('')
                    }
                    $('.modal').on('show.bs.modal', centerModals($('#my-project-add-chooseBody')));
                }
            },
            error:function(err){
                console.log(err);
            }
        });
    };
    //居中
    function centerModals(e){
        var $clone = e.clone().css('display', 'block').appendTo('body');
        var top=Math.round(($clone.height() - $clone.find('.modal-content').height())/2);
        top = top > 0 ? top : 0;
        $clone.remove();
        e.find('.modal-content').css({"margin-left": '22%',"margin-top":top});
    }
    //编辑显示
    function editShow(){
        tabTitle('.title-edit-task');
        renderEditPage();
        $('.addTask').show();
        $('.checkTask').hide();
        $('.task-area-version').removeClass('task-area-version-view').addClass('task-area-version-edit');
    }
    //渲染编辑页
    function renderEditPage(){
        $('#newTaskName').val($('#checkTaskName').html()).attr('data-value',$('#checkTaskName').attr('data-value'));  //名称
        $('#newTaskStartTime').val($('#checkTaskStartTime').html()); //开始时间
        $('#newTaskEndTime').val($('#checkTaskEndtTime').html()); //预计时间
        var workStr=$('#checkTaskNeedDay').html();
        $('#newTaskNeedDay').val(workStr.substring(0,workStr.length-1)); //工作日
        $('#taskVersionSelected').val($('#taskVersionCheck').val()).attr('data-value',$('#taskVersionCheck').attr('data-value'));
        //type
        var typeArr=$('#checkTaskType span');
        $('#newTaskType').val(typeArr.eq(0).html()).attr('data-value',typeArr.eq(0).attr('data-value')); //type
        $('#newTaskResource').val(typeArr.eq(1).html()).attr('data-value',typeArr.eq(1).attr('data-value')); //resource
        $('#newTaskStep').val(typeArr.eq(2).html()).attr('data-value',typeArr.eq(2).attr('data-value')); //step

        //审核人
        var lists=$('#checkTaskChecker span');
        var checkerNameArr=[],
            checkerIdArr=[];
        for(var i=0; i<lists.length; i++){
            checkerNameArr.push(lists.eq(i).html());
            checkerIdArr.push(lists.eq(i).attr('data-value'));
        }
        var str=checkerNameArr.join('， ');
        var status=$('#taskVersionCheck').attr('data-status');
        //console.log('status: ',status,'percent: ',taskBasicInfo.percent);
        if(status==-1&&(taskBasicInfo.percent>0)){
            $('#newTaskChecker').val(str).attr({
                'data-value':JSON.stringify(checkerIdArr),
                'disabled':'disabled',
                'title':'您的任务进程已开始，审核人不能更改！'
            }).css('cursor','not-allowed').removeAttr('data-target');

        }else{
            $('#newTaskChecker').val(str).attr({
                'data-value':JSON.stringify(checkerIdArr),
            });
        }

        refreshResource(typeArr.eq(0).attr('data-value')); //渲染资源或步骤可选

    }
    //查看显示
    function checkShow(){
        tabTitle('.title-view-task');
        $('.checkTask').show();
        $('.addTask').hide();
        $('.task-area-version').removeClass('task-area-version-edit').addClass('task-area-version-view');
    }

    /**
     * @editor: kevin(hk60)
     * @name:
     * @for: delete all files when delete taskCards or taskCardVersion
     * @param data the source of files idInfo
     */
    function delFilesWhenReviewCommentDel(data){
        //console.log('data',data);
        var len = data.length;
        var list =[];
        for(var i=0;i<len;i++){
            list.push(data[i].fileId);
        }
        delById(list);
    }


    /**
     * @editor :kevin(hk60)
     * @for :delete files
     * @param list
     */
    function delById(list){
        $.ajax({
            method:'post',
            url:'/api/file/deleteFilesInList/'+list,
            success:function(success){
                console.log('关联文件删除成功',success);
            },
            error:function(err){
                console.log('关联文件删除失败',err);
            }
        });
    }
    //function delById(id){
    //    $.ajax({
    //        method:'delete',
    //        url:'/api/file/'+id,
    //        success:function(success){
    //            console.log('关联文件删除成功');
    //        },
    //        error:function(err){
    //            console.log('关联文件删除失败',err);
    //        }
    //    })
    //}
    //改变状态   审核完成-->---制作中---   暂时不用
    function checkFinishChangeStatus(versionId){
        console.log('--审核完成-->---制作中-----');
        $.ajax({
            url: '/api/taskCard/selectOneTask/'+versionId,
            type: 'get',
            success: function (data) {
                console.log('----任务卡-data---------', data);
                if(data.isHasContract){
                    taskBasicInfo.isHaveRelatedContract=true;
                }else{
                    taskBasicInfo.isHaveRelatedContract=false;
                }
                //console.log('taskBasicInfo.isHaveRelatedContract',taskBasicInfo.isHaveRelatedContract);
                if(data.status==4){
                    if(data.productor.userId==localStorage.getItem('userId')){ //制作人==当前用户id
                        //改变状态为2（制作中）
                        var changeData={
                            status:2,
                            versionId:data.versionId,
                            readStatus:'true',
                            projectId:localStorage.getItem('projectId')
                        };
                        //console.log('uuuuu',_data);
                        $.ajax({
                            url: '/api/taskCard/updateTaskStatus',
                            type: 'put',
                            data:changeData,
                            success: function (data){
                                console.log('---审核完成---changeTo---制作中---',data);
                                $('.task-status').removeClass('progress-status-1').addClass('progress-status-3');
                                $InfosTemplate.find('#checkTaskStatus').html('制作中');
                                $('#taskProgressSubmitBtn').show(); //提交按钮
                                $('#taskProgressSubmitBtn').parent().css('height','55px');
                                //版本
                                $('#taskVersionCheck').attr('data-status',2);


                            },
                            error: function(data){
                                //警告！
                                projectCommon.quoteUserWarning('#taskProgressSubmitBtn','633px','280px','刷新失败！');
                                console.log(data);
                            }
                        });
                    }
                }

            },
            error: function(data){
            //???  失败提示
            console.log(data);
        }
    });
    }


    //获取这张任务卡的所有信息
    function refreshTask(flag,Id){
        //console.log('任务信息render!!!   1');
        var select='';
        if(flag!=''){
            select='selectOneTask';//查看版本信息
            $('.task-area-version-add').hide();
            $('#taskVersionCheck').removeAttr('data-toggle');
            $('#taskVersionCheck').css({'background':'none','box-shadow':'none'});

        }else{
            select='selectOneCurTask';//查看当前版本
        }
        //console.log('----taskId-------',Id);
        //console.log('----select-------',select);
        $.ajax({
             url: '/api/taskCard/'+ select+'/'+Id,
             type: 'get',
             success: function (data){
                 console.log('----任务卡---所有信息-------data-------',data);
                 //方案相关移至633行
                 /*/!* ==================== 方案初始化 ========== START ========== *!/
                 // 根据任务卡状态，方案是否可编辑
                 uEditor.ready(function() {
                     var isEditable = data.status/1 <= 0;
                     schema.setByTaskVersionId(data.versionId);
                     schema.setEditable(isEditable);
                 });
                 /!* ----------------- 方案初始化 ----------- END ---------- *!/*/

                 if(data.isHasContract){ //任务卡是否关联任务卡
                     taskBasicInfo.isHaveRelatedContract=true;
                 }else{
                     taskBasicInfo.isHaveRelatedContract=false;
                 }

                 //基本信息模板（创建人信息）
                 $InfosTemplate=$('\
                     <div style="display:flex;" class="task-check-box">\
                         <div style=" flex:1;">\
                             <span  style="width:30%; text-align:right;">&#12288;&#12288;&#12288;&#12288;名称：</span>\
                             <span id="checkTaskName"></span>\
                         </div>\
                         <div style="flex:1; position:relative;">\
                             <span  style="width:30%; text-align:right;">&#12288;&#12288;状态：</span>\
                             <span id="checkTaskStatus"></span>\
                             <div id="taskSendBackCheck" style="display:none;">\
                                <span class="iconfont taskSendBackCheckBtn">&#xe63c;</span>\
                                <div class="taskSendBackCheckBox" style="display:none;">\
                                    <p style="margin-left:10px; margin-top:4px;">退回原因：</p>\
                                    <div id="taskSendBackReasonBox">dddddddddpppppppppd</div>\
                                </div>\
                             </div>\
                         </div>\
                     </div>\
                     <div style="display:flex;  margin-bottom:0;" class="task-check-box">\
                         <div class="clearFix" style="flex:1;">\
                             <span style="text-align:right; float:left;">&#12288;&#12288;&#12288;审核人：</span>\
                             <div style="float:right; width:73%;">\
                                 <ul id="checkTaskChecker"  style="width:100%;"></ul>\
                             </div>\
                         </div>\
                         <div style="flex:1;">\
                             <span  style="width:30%; text-align:right;">&#12288;&#12288;进度：</span>\
                             <span id="checkTaskCompleteProgress"></span>\
                         </div>\
                     </div>\
                    <div style="display:flex;" class="task-check-box">\
                        <div style=" flex:1;">\
                            <span  style="width:30%; text-align:right;">&#12288;&#12288;开始时间：</span>\
                            <span id="checkTaskStartTime"></span>\
                        </div>\
                        <div style="flex:1;">\
                            <span  style="width:30%; text-align:right;">预计时间：</span>\
                            <span id="checkTaskEndtTime"></span>\
                        </div>\
                    </div>\
                    <div style="display:flex;" class="task-check-box">\
                        <div style=" flex:1;">\
                            <span  style="width:30%; text-align:right;">&#12288;&#12288;&#12288;倒计时：</span>\
                            <span id="checkTaskCountDownTime"></span>\
                        </div>\
                        <div style="flex:1; display:none;" id="checkTaskTrueTimeBox">\
                            <span  style="width:30%; text-align:right;">完成时间：</span>\
                            <span id="checkTaskTrueTime"></span>\
                        </div>\
                    </div>\
                    <div class="clearFix task-check-box">\
                        <span>&#12288;&#12288;&#12288;工作日：</span>\
                        <span id="checkTaskNeedDay"></span>\
                    </div>\
                    <div class="task-check-box">\
                        <span>&#12288;&#12288;&#12288;&#12288;类别：</span>\
                        <span id="checkTaskType"></span>\
                    </div>\
                    <div style="display:flex;" class="task-check-box">\
                         <div style="flex:1;">\
                             <span  style="width:30%; text-align:right;">&#12288;&#12288;&#12288;创建人：</span>\
                             <span id="taskCreator"></span>\
                         </div>\
                         <div style=" flex:1;" id="taskSenderBox">\
                             <span  style="width:30%; text-align:right;">&#12288;发送人：</span>\
                             <span id="taskSender"></span>\
                         </div>\
                     </div>\
                     <div id="taskCreatorBtnBox" style="display:none">\
                    <span class="newTaskBtn" id="checkTaskEdit" style="bottom:10px;">编辑</span>\
                    <span class="newTaskBtn" id="checkTaskDelete" style="bottom:10px;">删除</span>\
                    <span class="newTaskBtn" id="checkTaskComplete" style="bottom:10px;">制卡完成</span></div>');
                 //渲染
                 reqAuthority(data);  //请求权限信息,  再渲染任务卡

                 //点退回标志
                 $InfosTemplate.find('.taskSendBackCheckBtn').click(function(){
                     if($InfosTemplate.find('.taskSendBackCheckBox').css('display')=='none'){
                         $InfosTemplate.find('.taskSendBackCheckBox').show();
                     }else{
                         $InfosTemplate.find('.taskSendBackCheckBox').hide();
                     }
                     return false;

                 });
                 $('body').on('click.ompa',function(){
                     $InfosTemplate.find('.taskSendBackCheckBox').hide();
                 });
                 //点编辑
                 $InfosTemplate.find('#checkTaskEdit').click(function(){
                     //console.log('offsetParent',$(this).offsetParent());
                     $('.task-area-version').removeClass('task-area-version-view').addClass('task-area-version-edit');
                     editShow();
                 });
                 //点制卡完成
                 console.log($InfosTemplate.find("#checkTaskComplete"),'dfdfccccccd');
                 $InfosTemplate.find('#checkTaskComplete').on('click',function(){
                     var versionId=$('#taskVersionCheck').attr('data-value');
                     $.ajax({
                         url: '/api/progress/getProgress/'+versionId,
                         type: 'get',
                         success: function (data){
                             console.log('---制卡-----进程信息------\n',data);
                             var allPencent=0;
                             if(data.length==0){
                                 //还没添加进程
                                 departmentObj.showAskModel('您还没添加进程，添加了进程才能完成制卡！', false);
                                 return false;
                             }else{
                                 for(var i=0; i<data.length; i++){
                                     allPencent+=parseFloat(data[i].percent);
                                 }
                                 if(allPencent!=100){
                                     departmentObj.showAskModel('进程总百分比不为100%，请修改或增加进程，使进程总百分比为100%！以便任务卡进度的计算。', false);
                                     return false;
                                 }
                             }
                             //操作
                             departmentObj.showAskModel('您确认基本信息、方案、进程等信息都已填写正确? 制卡完成后不能修改这些信息!', true, function(flag){
                                 if(flag){
                                     //改变状态为1（未派发）
                                     $.ajax({
                                         url: '/api/taskCard/updateTaskStatus',
                                         type: 'put',
                                         data:{
                                             status:1,
                                             versionId:$('#taskVersionCheck').attr('data-value'),
                                             readStatus:'false',
                                             projectId:localStorage.getItem('projectId')
                                         },
                                         success: function (data){
                                             console.log('---制卡完成---------',data);
                                             var versionId=$('#taskVersionCheck').attr('data-value');
                                             socketCommon.emit().getSendUnReadTask(versionId);
                                             var pageType=localStorage.getItem('pageType');
                                             if(pageType=='shot'||pageType=='shotList'||pageType=='asset'||pageType=='assetList'){
                                                 var thisTaskId=localStorage.getItem('thisTaskId');
                                                 refreshTask('',thisTaskId);
                                             }else{
                                                 var thisTaskVersionId=localStorage.getItem('thisTaskVersionId');
                                                 refreshTask('create',thisTaskVersionId);
                                             }
                                             //taskBasicInfo.countAllOfMyTaskUnread();
                                             //console.log('pageType',pageType);


                                         },
                                         error: function(data){
                                             //警告！
                                             projectCommon.quoteUserWarning('#newTaskSave','449px','261px','制卡完成失败！');
                                             console.log(data);
                                         }
                                     });
                                 }
                             });

                         },
                         error: function(data){
                             //projectCommon.quoteUserWarning('#newTaskSave','449px','261px','切换版本失败！');
                             console.log(data);
                         }
                     });




                 });
                 //点提交
                 $('#taskProgressSubmitBtn').click(function(){
                     //改变状态为3（审核中）
                     console.log('status',$('#taskVersionCheck').attr('data-status'));
                     var data={
                         status:3,
                         versionId:$('#taskVersionCheck').attr('data-value'),
                         readStatus:'false',
                         projectId:localStorage.getItem('projectId')
                     };
                     //console.log('fffffff',taskProgressList.thisProgressNotPass);
                     if(taskProgressList.thisProgressNotPass=='yes'){
                         console.log('clear~~check data');
                         data.checkType=1;
                     }
                     $.ajax({
                         url: '/api/taskCard/updateTaskStatus',
                         type: 'put',
                         data:data,
                         success: function (data){
                             console.log('---提交完成---------',data);
                             //提交的
                             socketCommon.emit().getCheckUnReadTask($('#taskVersionCheck').attr('data-value'),'');
                             var pageType=localStorage.getItem('pageType');
                             if(pageType=='shot'||pageType=='shotList'||pageType=='asset'||pageType=='assetList'){
                                 var thisTaskId=localStorage.getItem('thisTaskId');
                                 refreshTask('',thisTaskId);
                             }else{
                                 var thisTaskVersionId=localStorage.getItem('thisTaskVersionId');
                                 refreshTask('create',thisTaskVersionId);
                             }


                             //console.log('pageType',pageType);
                             taskProgressList.refreshProgressLists($('#taskVersionCheck').attr('data-value'),3);
                             projectCommon.quoteUserWarning('#taskProgressSubmitBtn','555px','9px','提交成功！');
                             $('#taskProgressSubmitBtn').hide();
                             $('#taskProgressSubmitBtn').parent().css('height','0');

                         },
                         error: function(data){
                             //警告！
                             projectCommon.quoteUserWarning('#taskProgressSubmitBtn','555px','9px','提交失败！');
                             console.log(data);
                         }
                     });

                 });
                 //点删除
                 $InfosTemplate.find('#checkTaskDelete').click(function(){
                     departmentObj.showAskModel('是否确定删除这个版本的任务卡？', true, function(flag){
                         if(flag){
                             console.log('删除任务版本----');
                             var versionCount=$('#taskVersion li').length;
                             console.log('----n----',versionCount);
                             var data={};
                             data.taskId=$('#checkTaskName').attr('data-value');
                             data.versionId=$('#taskVersionCheck').attr('data-value');
                             data.projectId=localStorage.getItem('projectId');
                             $.ajax({
                                 url: '/api/taskCard/deleteTask/'+JSON.stringify(data),
                                 type: 'delete',
                                 success: function (data){
                                     console.log('----版本删除成功---------',data);
                                     delFilesWhenReviewCommentDel(data);
                                     var pageType=localStorage.getItem('pageType');
                                     if(versionCount==1){ //返回到列表
                                         if(pageType=='shot'){ //镜头列表
                                             console.log('镜头----列表-----');
                                             ShotMangement.afterSaveTask();
                                         }
                                         else if(pageType=='asset'){//资产列表
                                             console.log('资产----列表-----');
                                             assetManagement.afterSaveTask();
                                         }else if(pageType=='shotList'){
                                             ShotMangement.backToShotListIfEdited();
                                         }else if(pageType=='assetList'){
                                             assetManagement.backToAssetListIfEdited();
                                         }
                                         else if(pageType=='myCreateTask'){//由我创建列表
                                             console.log('由我创建----列表-----'); //刷新
                                             $('#myTask-content').loadPage('myCreateTask.html');

                                         }
                                     }else{//刷新当前任务卡
                                         if(pageType=='shot'){ //镜头查看
                                             $('.newTaskOfShot').loadPage('taskCard.edit.html');
                                         }
                                         else if(pageType=='asset'){//资产查看
                                             $('.newTaskOfAsset').loadPage('taskCard.edit.html');
                                         }else if(pageType=='assetList'){
                                             $('.newTaskOfAsset').loadPage('taskCard.edit.html');
                                         }
                                         else if(pageType=='shotList'){
                                             $('.newTaskOfShot').loadPage('taskCard.edit.html');
                                         }
                                         else if(pageType=='myCreateTask'){ //由我创建
                                             console.log('删除，刷新');
                                             $('#myTask-content').loadPage('myCreateTask.html');
                                         }
                                     }

                                 },
                                 error: function(data){
                                     //警告！
                                     projectCommon.quoteUserWarning('#checkTaskDelete','495px','251px','任务卡删除失败！');
                                     console.log(data);
                                 }
                             });


                         }
                     });
                 });

             },
             error: function(data){
             //???  失败提示
                console.log(data);
             }
         });

    }
    //请求权限信息
    function reqAuthority(data){
        //请求任务权限
        var _data=data;
        var thisModuleId=_data.stepId;
        $.ajax({
            url: '/api/taskCard/getCurUserProjectAuth',
            type: 'get',
            data:{
                projectId:_data.projectId,
                userId:localStorage.getItem('userId'),
            },
            success: function (data){
                console.log('任务---权限data',data);
                authorityData={
                    manageAllTasks:false,
                    manageAllContracts:false,
                    projectLeader:false,
                    taskLeader:false,
                    contractLeader:false
                };
                if(data.manageAllTasks){ //task权限
                    authorityData.manageAllTasks=true;
                }
                if(data.manageAllContracts){ //contract权限
                    authorityData.manageAllContracts=true;
                }
                if(data.manageProjectTasks){ //项目负责人
                    authorityData.projectLeader=true;
                    authorityData.taskLeader=true;
                    authorityData.contractLeader=true;
                }else{
                    //任务负责人
                    if(data.shotAuth){
                        if(data.shotAuth.taskModuleId&&(data.shotAuth.taskModuleId.length>0)){
                            for(var i=0; i<data.shotAuth.taskModuleId.length; i++){
                                if(data.shotAuth.taskModuleId[i]==thisModuleId){
                                    authorityData.taskLeader=true;
                                }
                            }
                        }
                        if(data.assetAuth.taskModuleId&&(data.assetAuth.taskModuleId.length>0)){
                            for(var i=0; i<data.assetAuth.taskModuleId.length; i++){
                                if(data.assetAuth.taskModuleId[i]==thisModuleId){
                                    authorityData.taskLeader=true;
                                }
                            }
                        }
                    }
                    //合同负责人
                    if(data.shotAuth){
                        if(data.shotAuth.contractModuleId&&(data.shotAuth.contractModuleId.length>0)){
                            for(var i=0; i<data.shotAuth.contractModuleId.length; i++){
                                if(data.shotAuth.contractModuleId[i]==thisModuleId){
                                    authorityData.contractLeader=true;
                                }
                            }
                        }
                        if(data.assetAuth.contractModuleId&&(data.assetAuth.contractModuleId.length>0)){
                            for(var i=0; i<data.assetAuth.contractModuleId.length; i++){
                                if(data.assetAuth.contractModuleId[i]==thisModuleId){
                                    authorityData.contractLeader=true;
                                }
                            }
                        }
                    }


                }
                taskBasicInfo.authorityData=authorityData; //全局
                //console.log('yyyyyy',taskBasicInfo.authorityData);
                renderTaskInfo(_data,authorityData); //渲染任务卡
            },
            error: function(data){
                //警告！
                //projectCommon.quoteUserWarning('#newTaskSave','449px','261px','获取权限失败！');
                console.log(data);
            }
        });
    }
    //渲染任务卡
    function renderTaskInfo(data1,data2){ //data1任务信息  data2 任务权限
        //console.log('--------------set----------------');
        /* ==================== 方案初始化 ========== START ========== */
        // 根据任务卡状态，方案是否可编辑
        uEditor.ready(function() {
            var isEditable = (data1.status/1 <= 0)&&(data2.projectLeader||data2.taskLeader||data2.manageAllTasks);
            schema.setByTaskVersionId(data1.versionId);
            schema.setEditable(isEditable);
        });
        /* ----------------- 方案初始化 ----------- END ---------- */
        var _data=data1;
        //taskBasicInfo.productorId=_data.productor.userId; //制作人id
        if(_data.productor&&_data.productor.name){//任务卡当前进程 制作人名称
            taskBasicInfo.productorName=_data.productor.name;
        }
        taskBasicInfo.percent=Number(_data.percent.replace('%',''));
        //设置当前项目id.. 用于跳转（如添加到合同）
        if(_data.projectId){
            localStorage.setItem('projectId',_data.projectId);
            localStorage.setItem('projectName',_data.projectName);
        }
        localStorage.setItem('thisTaskVersionId',_data.versionId);
        //根据任务卡状态，权限，任务卡显示不同的内容（按钮）
        //console.log('task.status',_data.status);
        if(_data.status==-1){//已退回
            $('.task-status').addClass('progress-status-1');
            $InfosTemplate.find('#checkTaskStatus').html('已退回');
            $('.taskSenderEditAndCheck').hide();  //派发人填写的信息
            $InfosTemplate.find('#taskSenderBox').hide();   //发送人
            $InfosTemplate.find('#taskSendBackCheck').show();   //退回原因查看

            //如果是项目负责人，任务负责人或有管理任务的权限
            if(data2.projectLeader||data2.taskLeader||data2.manageAllTasks){
                $InfosTemplate.filter('#taskCreatorBtnBox').show(); //创建人按钮
            }
            //显示退回原因???
        }
        else if(_data.status==0){//待制卡
            $('.task-status').addClass('progress-status-1');
            $InfosTemplate.find('#checkTaskStatus').html('待制卡');
            $('.taskSenderEditAndCheck').hide();  //派发人填写的信息
            $InfosTemplate.find('#taskSenderBox').hide();   //发送人

            //如果是项目负责人，任务负责人或有管理任务的权限
            if(data2.projectLeader||data2.taskLeader||data2.manageAllTasks){
                $InfosTemplate.filter('#taskCreatorBtnBox').show(); //创建人按钮
            }
        }
        else if(_data.status==1){//未派发
            $('.task-status').removeClass('progress-status-1').addClass('progress-status-2');
            $InfosTemplate.find('#checkTaskStatus').html('未派发');
            $InfosTemplate.find('#taskSenderBox').hide(); //发送人
            //如果是项目负责人，合同负责人或有管理合同的权限
            //console.log('data2',data2);
            if(data2.projectLeader||data2.contractLeader||data2.manageAllContracts){
                $('#taskSenderBtnBox').show();   //派发人按钮
                $('.taskSenderEditAndCheck').show();  //派发人填写的信息
            }else{
                $('.taskSenderEditAndCheck').hide();  //派发人填写的信息
            }

        }
        else if(_data.status==2){//制作中
            $('.task-status').removeClass('progress-status-1').addClass('progress-status-3');
            $InfosTemplate.find('#checkTaskStatus').html('制作中');

            if(_data.productor.userId==localStorage.getItem('userId')){ //制作人==当前用户id
                $('#taskProgressSubmitBtn').show(); //提交按钮
                $('#taskProgressSubmitBtn').parent().css('height','55px');
            }
            //console.log(_data.type,'eeee',data2.projectLeader||data2.contractLeader||data2.manageAllContracts);
            if(_data.type==0){ //内部任务卡
                if(data2.projectLeader||data2.contractLeader||data2.manageAllContracts){ //项目负责人、合同权限、合同负责人
                    $('#taskSendBackToNotSend').show();   //撤回按钮
                }
            }
        }
        else if(_data.status==3){//审核中
            $('.task-status').removeClass('progress-status-1').addClass('progress-status-4');
            $InfosTemplate.find('#checkTaskStatus').html('审核中');
        }
        else if(_data.status==4){//审核完成
            if(_data.type==0){ //内部任务卡
                if(data2.projectLeader||data2.contractLeader||data2.manageAllContracts){ //项目负责人、合同权限、合同负责人
                    $('#taskSendBackToNotSend').show();   //撤回按钮
                }
            }
            if(_data.productor.userId==localStorage.getItem('userId')){ //制作人==当前用户id
                //改变状态为2（制作中）
                var changeData={
                    status:2,
                    versionId:_data.versionId,
                    projectId:localStorage.getItem('projectId')
                };
                var pageType=localStorage.getItem('pageType');
                if(pageType=='myProductTask'){ //制作中（由我制作）
                    changeData.readStatus='true';
                }else{  //其他（项目内）
                    changeData.readStatus='false';
                }
                //console.log('uuuuu',_data);
                $.ajax({
                    url: '/api/taskCard/updateTaskStatus',
                    type: 'put',
                    data:changeData,
                    success: function (data){
                        console.log('---审核完成---changeTo---制作中---',data);
                        _data.status=2;
                        $('.task-status').removeClass('progress-status-4').addClass('progress-status-3');
                        $InfosTemplate.find('#checkTaskStatus').html('制作中');
                        //console.log('taskProduct',_data.productor.userId);
                        //console.log('currentUser',localStorage.getItem('userId'));
                        if(_data.productor.userId==localStorage.getItem('userId')){ //制作人==当前用户id
                            $('#taskProgressSubmitBtn').show(); //提交按钮
                            $('#taskProgressSubmitBtn').parent().css('height','55px');
                        }
                        taskBasicInfo.countAllOfMyTaskUnread();//刷新任务小红点

                    },
                    error: function(data){
                        //警告！
                        projectCommon.quoteUserWarning('#taskProgressSubmitBtn','633px','280px','刷新失败！');
                        console.log(data);
                    }
                });
            }else{
                $('.task-status').removeClass('progress-status-1').addClass('progress-status-4');
                $InfosTemplate.find('#checkTaskStatus').html('审核完成');
            }


        }
        else if(_data.status==5){//已完成
            $InfosTemplate.find('#checkTaskTrueTimeBox').show();  //完成时间
            $('.task-status').removeClass('progress-status-1').addClass('progress-status-5');
            $InfosTemplate.find('#checkTaskStatus').html('已完成');
        }
        //数据渲染
        //版本
        $('#taskVersionCheck').val(_data.version).attr({
            'data-value':_data.versionId,
            'data-status':_data.status
        });
        $InfosTemplate.find('#checkTaskCompleteProgress').html(_data.percent); //进度
        $InfosTemplate.find('#checkTaskName').html(_data.name).attr('data-value',_data.taskId); //名称
        $InfosTemplate.find('#checkTaskStartTime').html(_data.startDate); //开始时间
        $InfosTemplate.find('#checkTaskEndtTime').html(_data.planDate); //预计时间
        $InfosTemplate.find('#checkTaskNeedDay').html(_data.workDays+'天'); //工作日
        $InfosTemplate.find('#checkTaskTrueTime').html(_data.endDate); //完成时间
        $InfosTemplate.find('#taskCreator').html(_data.creator?_data.creator.name:''); //创建人
        $InfosTemplate.find('#taskSender').html(_data.sender?_data.sender.name:''); //发送人
        $InfosTemplate.find('#taskSendBackReasonBox').html(_data.reason?_data.reason:''); //退回原因
        //console.log('data.sender',data.sender);
        //类型
        if(_data.type==0){
            $('#taskSenderCheckType').html('内部任务').attr('data-value',0);
            $('#taskAddToContract').hide();

        }else if(_data.type==1){
            $('#taskSenderCheckType').html('外部任务').attr('data-value',1);
            $('#taskSend').hide();
        }else{
            $('#taskAddToContract').hide();
            $('#taskSend').hide();
        }

        if(_data.productor){ //制作人
            $('#taskSenderCheckProductor').html(_data.productor.name).attr('data-value',_data.productor.userId);
        }
        if(_data.priority){ //等级
            switch(_data.priority){
                case 'C-':
                    $('#taskLevelCheckSelect li').eq(0).html(_data.priority);
                    break;
                case 'C':
                    $('#taskLevelCheckSelect li').eq(1).html(_data.priority);
                    break;
                case 'C+':
                    $('#taskLevelCheckSelect li').eq(2).html(_data.priority);
                    break;
                case 'B-':
                    $('#taskLevelCheckSelect li').eq(3).html(_data.priority);
                    break;
                case 'B':
                    $('#taskLevelCheckSelect li').eq(4).html(_data.priority);
                    break;
                case 'B+':
                    $('#taskLevelCheckSelect li').eq(5).html(_data.priority);
                    break;
                case 'A-':
                    $('#taskLevelCheckSelect li').eq(6).html(_data.priority);
                    break;
                case 'A':
                    $('#taskLevelCheckSelect li').eq(7).html(_data.priority);
                    break;
                case 'A+':
                    $('#taskLevelCheckSelect li').eq(8).html(_data.priority);
                    break;
            }
        }
        if(_data.points){ //积分
            $('#taskSenderCheckScore').html(_data.points);
        }



        //处理审核人
        var arr=_data.check;
        var str='',str1='',str2='',str3='';
        for(var i=0; i<arr.length; i++){
            if(arr[i].checkSequence==1){
                str1='<li>'+
                    '<img src="'+configInfo.server_url+'/'+arr[i].checkUserImg+'" alt="">'+
                    '<strong>'+arr[i].checkSequence+'. <span data-value="'+arr[i].checkUserId+'">'+arr[i].checkUserName+'</span>&nbsp;; </strong>'+
                    '</li>';
            }else if(arr[i].checkSequence==2){
                str2='<li>'+
                    '<img src="'+configInfo.server_url+'/'+arr[i].checkUserImg+'" alt="">'+
                    '<strong>'+arr[i].checkSequence+'. <span data-value="'+arr[i].checkUserId+'">'+arr[i].checkUserName+'</span>&nbsp;; </strong>'+
                    '</li>';
            }else if(arr[i].checkSequence==3){
                str3='<li>'+
                    '<img src="'+configInfo.server_url+'/'+arr[i].checkUserImg+'" alt="">'+
                    '<strong>'+arr[i].checkSequence+'. <span data-value="'+arr[i].checkUserId+'">'+arr[i].checkUserName+'</span>&nbsp;; </strong>'+
                    '</li>';
            }
        }
        str=str1+str2+str3;
        $InfosTemplate.find('#checkTaskChecker').html(str);

        //处理类型
        var str2='';
        if(_data.associatedType=='资产'){
            type=2;
        }else{
            type=1;
        }
        str2='<span data-value="'+type+'">'+_data.associatedType+'</span>><span data-value="'+_data.assetOrshotId+'">'+_data.assetOrshot+'</span>><span data-value="'+_data.stepId+'">'+_data.step+'</span>';
        $InfosTemplate.find('#checkTaskType').html(str2);

        var $checkTaskObj= $('#taskCard-edit-wrap').find('.checkTask');
        $checkTaskObj.children().remove();
        $checkTaskObj.prepend($InfosTemplate);
        //<span data-value='xxx'>资产</span>><span data-value='xxx'>小猴子</span>><span data-value='xxx'>模型></span>

        //处理倒计时
        var date=new Date(_data.planDate+' 23:59:59'); //到这个日期的23:59:59
        var oTime=date.getTime();
        clearInterval(timer);
        //console.log('timer',oTime);
        timer=setInterval(function(){
            taskCountdown(oTime);
        },60000);
        taskCountdown(oTime);
        renderChooseVersion(_data.taskId);
        /*if(data.status==1){  //可派发
         $('.taskBasicInfoBox').scrollTop( $('.taskBasicInfoBox')[0].scrollHeight ); //滚到下面
         }*/




        if(taskBasicInfo.isHaveRelatedContract){
            $('#taskAddToContract').html('已添加至合同').css('background-color','#ddd');
            $('#taskAddToContract').on('mouseover',function(){
                $(this).css('background-color','#ddd');
            });
            $('#taskSendBack').hide(); //退回按钮
        }else{
            $('#taskSendBack').show(); //退回按钮
        }
        console.log('projectAuthOrity',projectCommon.authority);

        //处理可添加版本
        if(!((status<=0)&&(taskBasicInfo.authorityData.projectLeader||taskBasicInfo.authorityData.taskLeader||taskBasicInfo.authorityData.manageAllTasks))){
            $('.task-area-version-add').hide();
            $('#taskVersionCheck').removeAttr('data-toggle');
            $('#taskVersionCheck').css({'background':'none','box-shadow':'none'});
        }
        taskBasicInfo.countAllOfMyTaskUnread();//刷新任务小红点


    }
    //计算未读并渲染
    function countAllOfMyTaskUnread(){
        $.ajax({
            url: '/api/taskCard/getUnReadTaskCount/'+localStorage.getItem('userId'),
            type: 'get',
            success: function (data){
                //console.log('---all--unread--Data---',data);
                var createData=data.createCount?data.createCount.count:0,
                    sendData=data.sendCount?data.sendCount.count:0,
                    productData=data.productCount?data.productCount.count:0,
                    checkData=data.checkCount?data.checkCount.count:0;
                var allData=createData+sendData+productData+checkData;
                //console.log('allData',allData);
                if(allData==0){ //总的
                    $('.myTaskUnreadFlag').hide();
                }else{
                    $('.myTaskUnreadFlag').show();
                }

                if(createData==0){//创建
                    $('#myCreateTaskUnRead').hide();
                }else{
                    $('#myCreateTaskUnRead').html(createData).show();
                }

                if(sendData==0){//发送
                    $('#mySendTaskUnRead').hide();
                }else{
                    $('#mySendTaskUnRead').html(sendData).show();
                }

                if(productData==0){//制作
                    $('#myProductTaskUnRead').hide();
                }else{
                    $('#myProductTaskUnRead').html(productData).show();
                }

                if(checkData==0){//审核
                    $('#myCheckTaskUnRead').hide();
                }else{
                    $('#myCheckTaskUnRead').html(checkData).show();
                }

            },
            error: function(data){
                //警告！
                //projectCommon.quoteUserWarning('#taskProgressSubmitBtn','633px','280px','刷新失败！');
                console.log(data);
            }
        });




    }
    //刷新版本可选信息
    function renderChooseVersion(taskId){
        $.ajax({
            url: '/api/taskCard/getOneTaskVersion/'+taskId,
            type: 'get',
            success: function (data){
                //console.log('----所有版本信息--------',data);
                var versionArr=data[0].TaskVersions,
                    str='';
                for(var i=0; i<versionArr.length; i++){
                    str+='<li style="width:100%;" data-status="'+versionArr[i].status+'" data-value="'+versionArr[i].id+'">'+versionArr[i].version+'</li>';
                }
                $('#taskVersion').html(str);

                //可选版本的宽度
                var realWidth=$('.task-area-version').width()-$('.task-area-version-add').width()-$('#taskVersionTitle').width();
                var left=$('.task-area-version-add').width()+$('#taskVersionTitle').width();
                $('#taskVersion').css({'width':realWidth+'px', 'margin-left':left+'px'});
            },
            error: function(data){
                //???  失败提示
                console.log(data);
            }
        });
    }
    //一次倒计时（oTime为目标时间戳）
    function taskCountdown (oTime){
        var timeNow=new Date().getTime();
        var time=parseInt((oTime-timeNow)/1000);
        if(time<=0){
           //时间已超期
            $('#checkTaskCountDownTime').html('时间超期！');
            //console.log('时间超期！');
        }else{
            // 转换
            var d=parseInt(time/86400); //天
            time%=86400;
            var h=parseInt(time/3600);  //小时
            time%=3600;
            var m=parseInt(time/60);   //分钟
            var str=toDou(d)+'天'+toDou(h)+'小时'+toDou(m)+'分钟';
            $('#checkTaskCountDownTime').html(str);
        }

    }
    //填充0
    function toDou(n){
        return n<10?'0'+n:n;
    }
    //保存审核人
    function saveCheckers(){
        $('#newTaskChecker').val('').attr('data-value','[]');
        var haveChooseLi=$('#my-project-add-haveChoose li');
        if(haveChooseLi.length){
            console.log('已选审核人的个数',haveChooseLi.length);
            var names=[];
            $('#my-project-add-haveChoose li').each(function(i){
                names.push($(this).find('span').html());
            });
            var str=names.join('， ');
            //console.log('num'+$('#my-project-add-haveChoose li').length);
            $('#newTaskChecker').val(str).attr('data-value',JSON.stringify(taskCheckers));
        }
    }
    //刷新已选审核人
    function refreshChechersHavechoose(){
        $('#my-project-add-haveChoose').html('');
        taskCheckers=[];
        if($('#newTaskChecker').val()){
            var str='';
            var listId=JSON.parse($('#newTaskChecker').attr('data-value'));
            var arrName=$('#newTaskChecker').val().split('， ');

            for(var i=0; i<arrName.length; i++){
                str+='<li data-value="'+listId[i]+'"><span>'+arrName[i]+'</span><i class="iconfont">&#xe63d;</i></li>';
            }
            $('#my-project-add-haveChoose').html(str);
            taskCheckers=listId;
        }

    };
    //根据类型（资产2或镜头1） 刷新 资产或镜头可选,步骤可选
    function refreshResource(type){
        var data={
            userId:localStorage.getItem('userId'),
            projectId: localStorage.getItem('projectId'),
            type:Number(type)
        };
        if(assetManagement.curUserPosition.manageAllTasks=='true'||ShotMangement.curUserPosition.manageAllTasks=='true'){
           data.manageAllTasks='true';
        }
        $.ajax({
            url: '/api/taskCard/getStepChildren',
            type: 'post',
            data:data,
            success: function (data) {
                console.log('-----步骤可选-------data--------',data);
                var resource=data.data, //资源列表
                    step=data.step.list,  //步骤列表
                    str1='',
                    str2='';
                if(resource.length>0){
                    for(var i=0; i<resource.length; i++){
                        str1+='<li data-value="'+resource[i].id+'">'+resource[i].name+'</li>'
                    }
                    $('#newTaskResourceSelect').html('');
                    $('#newTaskResourceSelect').html(str1);
                }else{
                    $('#newTaskResourceSelect').html('');
                }

                if(step.length>0){
                    for(var i=0; i<step.length; i++){
                        str2+='<li data-value="'+step[i].id+'">'+step[i].name+'</li>'
                    }
                    $('#newTaskStepSelect').html(str2);
                }else{
                    $('#newTaskStepSelect').html('');
                }
            },
            error: function (data) {
                console.log(data);
            }
        });
    }
    function addNewTaskText(){
        var str='<form class="form-inline newVersionShow">\
            <div class="form-horizontal newVersionShow" style="display:none;">\
            <div class="form-group checkTaskRow">\
            <label  class="col-sm-2 task-name">名称：</label>\
        <label id="checkTaskName" class="col-sm-2 task-name task-name-value2">HK0101001</label>\
            </div>\
            </div>\
            <div class="form-horizontal newVersionHidden" >\
            <div class="form-group">\
            <label for="newTaskName" class="col-sm-2 task-name"><span style="color:red;">*</span>名称：</label>\
        <div class="col-sm-6" style="padding:0">\
            <input id="newTaskName"  type="text"  class="form-control task-input-one">\
            </div>\
            </div>\
            </div>\
            <div class="form-horizontal">\
            <div class="form-group" style="position: relative">\
            <label for="newTaskChecker" class="col-sm-2 task-name"><span style="color:red;">*</span>审核人：</label>\
        <div class="col-sm-6" style="padding:0">\
            <input id="newTaskChecker" data-content="members" data-toggle="modal" data-target="#my-project-add-chooseBody" data-backdrop="static" data-value="[]" type="text"  class="form-control task-input-one"  readonly >\
        </div>\
        <span id="task-checker-choose"   style="cursor:default;position: absolute; top:7px; left:614px; color:#5699c3; font-size:12px;">选择</span>\
            </div>\
            </div>\
            <div class="form-group" style="position: relative">\
            <label for="newTaskStartTime" class="task-name-two"><span style="color:red;">*</span>开始时间：</label>\
        <input id="newTaskStartTime" type="text" class="form-control task-input-two form_datetime" readonly>\
        <span><i class="glyphicon glyphicon-calendar"style="right:27px; top:-4px; color:#666;"></i></span>\
            </div>\
            <div class="form-group" style="position: relative">\
            <label for="newTaskEndTime" class="task-name-two"><span style="color:red;">*</span>预计时间：</label>\
        <input id="newTaskEndTime" type="text" class="form-control task-input-two form_datetime" readonly>\
        <span><i class="glyphicon glyphicon-calendar"style="right:27px; top:-4px; color:#666;" ></i></span>\
            </div>\
            <div class="form-horizontal">\
            <div class="form-group">\
            <label for="newTaskNeedDay" class="col-sm-2 task-name"><span style="color:red;">*</span>工作日：</label>\
        <div class="col-sm-6" style="padding:0">\
            <input id="newTaskNeedDay" class="form-control task-input-four">\
            </div>\
            <label style="font-weight:normal; line-height:30px;">天</label>\
            </div>\
            </div>\
            <div class="form-horizontal newVersionShow" style="display:none;">\
            <div class="form-group checkTaskRow">\
            <label  class="col-sm-2 task-name">类别：</label>\
        <label id="checkTaskType" class="col-sm-2 task-name-value2"><span>资产</span>><span>猴子</span>><span>模型</span></label>\
            </div>\
            </div>\
            <div class="form-group has-feedback newVersionHidden" >\
            <label for="newTaskType" class="task-name-two"><span style="color:red;">*</span>类别：</label>\
        <input id="newTaskType" data-value="2" value="资产" type="text" class="form-control task-input-three" data-toggle="dropdown" readonly>\
        <span class="glyphicon glyphicon-triangle-bottom form-control-feedback" style="right:15px; top:-1px;"></span>\
            <ul  id="newTaskTypeSelect" class="dropdown-menu newTaskSelect" style="margin-left: 96px;">\
            <li data-value="2">资产</li>\
            <li data-value="1">镜头</li>\
            </ul>\
            </div>\
            <div class="form-group has-feedback newVersionHidden">\
            <input id="newTaskResource" type="text" class="form-control task-input-three" data-toggle="dropdown" readonly>\
        <span class="glyphicon glyphicon-triangle-bottom form-control-feedback" style="right:15px; top:-1px;"></span>\
            <ul  id="newTaskResourceSelect" class="dropdown-menu newTaskSelect" >\
            <!--<li data-value="xxx">孙悟空（角色）</li>-->\
        </ul>\
        </div>\
        <div class="form-group has-feedback newVersionHidden">\
            <input id="newTaskStep" type="text" class="form-control task-input-three" data-toggle="dropdown" readonly>\
        <span class="glyphicon glyphicon-triangle-bottom form-control-feedback" style="right:15px; top:-1px;"></span>\
            <ul  id="newTaskStepSelect" class="dropdown-menu newTaskSelect">\
            <!--<li data-value="xxx">基础效果设计</li>-->\
            </ul>\
            </div>\
            <span class="newTaskBtn" id="newTaskSave">保存</span>\
            <span class="newTaskBtn" id="newTaskCancel">取消</span>\
            </form>';
        $('#new-task-wrap').html(str);
    }
    //初始化
    function init(){
        //console.log('init-----------');
        /*//输入验证
        departmentObj.bindLegalCheck([$("#newTaskName")],'0','-27','');  //任务名称
        departmentObj.bindLegalCheck([$('#newTaskNeedDay')],'0','-27','number');  //工作量*/
        //版本验证 ????
        //departmentObj.bindLegalCheck([$('#taskVersionSelected')],'0','-27','number');


        //判断是新建还是查看页
        if($('#taskStatus').attr('data-value')=='check'){
            //edit页( 查看页)
            //console.log('new task page');
            newTask=false;
            thisTaskId=localStorage.getItem('thisTaskId');
            console.log('```````taskId··',thisTaskId);
            //??????
            var pageType=localStorage.getItem('pageType');
            taskVersionId=localStorage.getItem('thisTaskVersionId');
            unreadToRead(pageType,taskVersionId);
            function unreadToRead(pageType,taskVersionId){
                $.ajax({
                    url: '/api/taskCard/selectOneTask/'+taskVersionId,
                    type: 'get',
                    success: function (data) {
                        //console.log('----任务卡-data----读--未读-----', data);
                        var create=false,send=false,product=false,check=false;
                        if((data.status==-1)&&(data.readStatus=='false')){ //已退回，未读
                            create=true;
                        }else if((data.status==1)&&(data.readStatus=='false')){//未派发，未读
                            send=true;
                        }else if((data.status==(2||4))&&(data.readStatus=='false')){//制作中和审核完成，未读
                            product=true;
                        }else if((data.status==3)&&(data.readStatus=='false')){//审核中，未读
                            check=true;
                        }
                        //改变已读未读状态
                        if((pageType=="myCreateTask"&&create)||(pageType=="mySendTask"&&send)||(pageType=="myProductTask"&&product)||(pageType=="myCheckTask"&&check)){
                            //把任务卡变成已读
                            var changeHaveReadData={
                                versionId:taskVersionId, //这个版本
                                readStatus:'true'
                            };
                            console.log('changeHaveReadData',changeHaveReadData);
                            $.ajax({
                                url: '/api/taskCard/updateTaskStatus',
                                type: 'put',
                                data:changeHaveReadData,
                                success: function (data){
                                    console.log('---task--已读-√--',data);
                                    countAllOfMyTaskUnread();
                                },
                                error: function(data){
                                    //警告！
                                    //projectCommon.quoteUserWarning('#taskProgressSubmitBtn','633px','280px','刷新失败！');
                                    console.log(data);
                                }
                            });


                        }


                    },
                    error: function(data){
                        //???  失败提示
                        console.log(data);
                    }
                });

            }



            if(pageType=="myCreateTask"){
                refreshTask('create',taskVersionId);
            }else if(pageType=="mySendTask"){
                refreshTask('send',taskVersionId);
            }
            else if(pageType=="myProductTask"){
                refreshTask('product',taskVersionId);
            }
            else if(pageType=="myCheckTask"){  //？？？
                refreshTask('check',taskVersionId);
            }
            else if(pageType=="myContract"){  //？？？
                refreshTask('check',taskVersionId);
            }
            else{
                //console.log('kkk',thisTaskId);
                refreshTask('',thisTaskId);
            }
            tabTitle('.title-view-task');
            //判断任务卡的状态

            //点击新建任务版本
            $('.task-area-version-add').click(function(){
                var typeArr=$('#checkTaskType span');
                localStorage.setItem('thisTaskId',$('#checkTaskName').attr('data-value')); //任务卡id
                localStorage.setItem('thisTaskName',$('#checkTaskName').html()); //任务名称
                localStorage.setItem('taskType',typeArr.eq(0).attr('data-value')); //type
                localStorage.setItem('taskTypeName',typeArr.eq(0).html()); //typeName
                localStorage.setItem('resourceId',typeArr.eq(1).attr('data-value')); //resourceId
                localStorage.setItem('resourceName',typeArr.eq(1).html()); //resourceName
                localStorage.setItem('stepId',typeArr.eq(2).attr('data-value')); //stepNaId
                localStorage.setItem('stepName',typeArr.eq(2).html()); //stepName

                var pageType=localStorage.getItem('pageType');
                //加载新建版本
                console.log('pageType',pageType);
                if(pageType=='asset' || pageType=='assetList'){
                    $('.newTaskOfAsset').loadPage('taskCard.new.html').show();
                }
                else if(pageType=='shot'|| pageType=='shotList'){
                    $('.newTaskOfShot').loadPage('taskCard.new.html').show();
                }
                /*else if(pageType=='myCreateTask'){ //pageType==由我创建
                    $('#myTask-content').loadPage('taskCard.new.html').show();
                }*/
                //显示&隐藏 任务名称 和 type相关
                $('.newVersionShow').show();

                tabTitle('.title-new-task-version');
                //任务 name和id
                $('#checkTaskName').html(localStorage.getItem('thisTaskName')).attr('data-value',localStorage.getItem('thisTaskId'));
                $('#checkTaskType span').eq(0).attr('data-value',localStorage.getItem('taskType')).html(localStorage.getItem('taskTypeName')); //类型
                $('#checkTaskType span').eq(1).attr('data-value',localStorage.getItem('resourceId')).html(localStorage.getItem('resourceName')); //资源
                $('#checkTaskType span').eq(2).attr('data-value',localStorage.getItem('stepId')).html(localStorage.getItem('stepName'));//步骤
                $('.newVersionHidden').hide();
            });
            //点击切换版本
            $('#taskVersion').on('click','li',function(){
                var data={};
                var thisVersionId=$(this).attr('data-value');
                var thisVersionStatus=$(this).attr('data-status');
                data.versionId=thisVersionId;
                data.taskId=$('#checkTaskName').attr('data-value');
                thisTaskId=data.taskId;
                schema.setByTaskVersionId(thisVersionId,thisVersionStatus);
                localStorage.setItem('thisTaskVersionId',thisVersionId);

                /*-----刷新进程信息---start------*/
                $('.datetimepicker.datetimepicker-dropdown-top-left.dropdown-menu').remove();
                taskProgressList.refreshThisVersionProgress(thisVersionId,thisVersionStatus);
                /*-----刷新进程信息---end----*/

                //设置 这个为当前版本
                $.ajax({
                    url: '/api/taskCard/turnVersion',
                    type: 'put',
                    data:data,
                    success: function (data){
                        console.log('---切换版本成功---------',data);
                        refreshTask('',thisTaskId); //刷新基本信息
                        if($('#operationTask_log').scope()){
                            $('#operationTask_log').scope().initData(0,thisVersionId);
                        }
                    },
                    error: function(data){
                        //警告！
                        projectCommon.quoteUserWarning('#newTaskSave','449px','261px','切换版本失败！');
                        console.log(data);
                    }
                });

            });

            //点返回
            $('.task-back-btn').on('click',function(){
                var type=localStorage.getItem('pageType');
                //console.log('pppp',type);
                if(type=='shot'){ //镜头列表
                    console.log('镜头----列表-----');
                    ShotMangement.afterSaveTask();
                }
                else if(type=='asset'){//资产列表
                    console.log('资产----列表-----');
                    assetManagement.afterSaveTask();
                }else if(type=='shotList'){
                    ShotMangement.backToShotListIfEdited();
                }else if(type=='assetList'){
                    assetManagement.backToAssetListIfEdited();
                }
                else if(type=='myCreateTask'){//由我创建列表
                    localStorage.removeItem('thisTaskVersionId');
                    $('#myTask-content').loadPage('myCreateTask.html');
                    console.log('由我创建----列表-----'); //刷新
                }
                else if(type=='mySendTask'){//由我发送   列表
                    localStorage.removeItem('thisTaskVersionId');
                    $('#myTask-content').loadPage('mySendTask.html');
                    console.log('由我发送----列表-----'); //刷新
                }
                else if(type=='myProductTask'){//由我制作      列表
                    localStorage.removeItem('thisTaskVersionId');
                    $('#myTask-content').loadPage('myProductTask.html');
                    console.log('由我制作----列表-----'); //刷新
                }
                else if(type=='myCheckTask'){//由我审核      列表
                    localStorage.removeItem('thisTaskVersionId');
                    //location.href = '#/myCheckTask';  //
                    $('#myTask-content').loadPage('myCheckTask.html');
                    console.log('由我审核----列表-----'); //刷新
                }
                else if(type == 'myContract'){
                    // ng => ui-router 我的合同、合同管理
                    ($('#myContractApp').injector() || $('.contractManagement-contain').injector())
                        .get('$state').go('view.contract');
                }
                else{ //...

                }
            });
        }
        else{
            //new页 初始化 新建任务
            addNewTaskText();
            newTask=true;
            projectId=localStorage.getItem('projectId');
            type=localStorage.getItem('taskType');
            resourceId=localStorage.getItem('resourceId');
            resourceName=localStorage.getItem('resourceName');
            stepId=localStorage.getItem('stepId');
            stepName=localStorage.getItem('stepName');
            console.log('hhh',type);
            if(type==1){
                $('#newTaskType').val('镜头').attr('data-value',1);
            }else{
                $('#newTaskType').val('资产').attr('data-value',2);
            }
            refreshResource(type);
            $('#newTaskResource').val(resourceName).attr('data-value',resourceId);
            $('#newTaskStep').val(stepName).attr('data-value',stepId);
            tabTitle('.title-new-task');

        }

        //输入验证
        departmentObj.bindLegalCheck([$("#newTaskName")],'0','-27','');  //任务名称
        departmentObj.bindLegalCheck([$('#newTaskNeedDay')],'0','-27','number');  //工作量
        departmentObj.bindLegalCheck([$('#taskSenderEditScore')],'96','-27','number');  //积分

        //一加载   选择日期
        $('.datetimepicker.datetimepicker-dropdown-bottom-right.dropdown-menu').remove();
        $(".form_datetime").datetimepicker({
            format: "yyyy-mm-dd",
            minView: "month",
            autoclose: true,
            todayBtn: true,
            language:'zh-CN'
        });

        //渲染可选审核人
        //getAllProjectMembers();

        /*这些是查看页面的*/




        //点击选择
        $('#newTaskChecker').on('click',function(){
            refreshChechersHavechoose();
            getAllProjectMembers();
            //console.log(taskCheckers);
        });
        //点审核人保存
        $('#my-project-add-chooseSave').on('click',function(){
            saveCheckers();
        });
        //点 项目成员单选
        $('#my-project-add-chooseList').on('click','li',function(){
            //console.log(projectCommon.playerRecord.thisDepart);
            var str='';
            var has=-1;
            //var id=$(this).attr('data-value');
            if(!$(this).find('i').attr('data-value')){ //×
                //$(this).find('i').html('&#xe64b;').attr('data-value',$(this).attr('data-value')).css('color','#999');//√
                if(taskCheckers.length==3){
                   //警告！
                   projectCommon.quoteUserWarning('.my-project-add-choose-title','128px','-28px','审核人不能超过3个！');
                   return false;
                }else{
                    shot.setLiCheckBox($(this),true);     //√
                    has=shot.findInArr(taskCheckers,$(this).attr('data-value'));
                    // console.log(has);
                    if(has==-1){  //不在已选里
                        //console.log($(this).attr('data-value'));
                        taskCheckers.push($(this).attr('data-value'));
                        //console.log('bb'+JSON.stringify(projectCommon.playerRecord));
                        str='<li data-value="'+$(this).attr('data-value')+'"><span>'+$(this).find('span').html()+'</span><i class="iconfont">&#xe63d;</i></li>';
                        $('#my-project-add-haveChoose').append(str);
                    }
                    console.log('id',taskCheckers);
                }

            }else{//√
                //$(this).find('i').html('&#xe64c;').removeAttr('data-value').css('color','#ccc'); //×
                shot.setLiCheckBox($(this),false);     //×
                has=shot.findInArr(taskCheckers,$(this).attr('data-value'));
                //console.log(has);
                if(has!=-1){
                    taskCheckers.splice(has,1);
                    //console.log('aa'+JSON.stringify(projectCommon.playerRecord));
                    $('#my-project-add-haveChoose li').eq(has).remove();
                }
                console.log(taskCheckers);
            }
            $('.modal').on('show.bs.modal',centerModals($('#my-project-add-chooseBody')));
        });
        //点叉叉 删除项目人员
        $('#my-project-add-haveChoose').on('click','li i',function(){
            var thisId=$(this).parent().attr('data-value');
            console.log('thisId-delete',thisId);
            var index=$(this).parent().index();
            taskCheckers.splice(index,1);
            $(this).parent().remove();
            $('#my-project-add-chooseList li').each(function(){
                if($(this).attr('data-value')==thisId){
                    shot.setLiCheckBox($(this),false);     //×
                }
            });
            console.log('id',taskCheckers);
        });
        //选择资产或镜头
        $('#newTaskTypeSelect').on('click','li',function(){
            var that=$(this);
            console.log('type-1111---',that.attr('data-value'),that.html());
            $('#newTaskType').attr('data-value',that.attr('data-value')).val(that.html());
            type=that.attr('data-value');
            //跟换 资源和步骤
            //先清空 所选资源和步骤
            $('#newTaskResource').attr('data-value','').val('');
            $('#newTaskStep').attr('data-value','').val('');
            refreshResource(type);
        });
        //选择资源
        $('#newTaskResourceSelect').on('click','li',function(){
            var that=$(this);
            $('#newTaskResource').val(that.html()).attr('data-value',that.attr('data-value'));
        });
        //选择步骤
        $('#newTaskStepSelect').on('click','li',function(){
            var that=$(this);
            $('#newTaskStep').val(that.html()).attr('data-value',that.attr('data-value'));
        });
        //选择类别
        $('#taskSenderEditTypeSelect').on('click','li',function(){
            var that=$(this);
            $('#taskSenderEditType').val(that.html()).attr('data-value',that.attr('data-value'));
        });
        //选择制作人
        $('#taskSenderEditProductorSelect').on('click','li',function(){
            var that=$(this);
            $('#taskSenderEditProductor').val(that.html()).attr('data-value',that.attr('data-value'));
        });


        //点保存
        $('.addTask').on('click','#newTaskSave',function(){
            var data={
                name:$('#newTaskName').val(), //名称
                projectId:localStorage.getItem('projectId'),  //项目id
                associatedType:Number($('#newTaskType').attr('data-value')), //类型
                associatedTypeName:$('#newTaskType').val(),
                associatedId:$('#newTaskResource').attr('data-value'), //资源
                associatedName:$('#newTaskResource').val(),
                moduleId:$('#newTaskStep').attr('data-value'),//步骤
                moduleName:$('#newTaskStep').val(),
                creatorId:creatorId,   //当前用户id
                version:$('#taskVersionSelected').val(),  //版本
                startDate:$('#newTaskStartTime').val(), //开始时间
                planDate:$('#newTaskEndTime').val(),   //结束时间
                workDays:$('#newTaskNeedDay').val(),    //工作日
                checkId:$('#newTaskChecker').attr('data-value'),  //审核人
                checkName:$('#newTaskChecker').val()
            };

            //判断和警告   ???
            if(newTask){ //新建任务
                //console.log($('.title-new-task','#taskStatus').css('display'),'sdasdad');
                newVersion=$('.title-new-task','#taskStatus').css('display') == 'none' ? true: false;
                console.log('newVerion',newVersion);
                if(newVersion){ //新建版本
                    data.taskId=$('#checkTaskName').attr('data-value'); //taskId
                    data.name=$('#checkTaskName').html(), //taskName
                    data.associatedType=Number($('#checkTaskType span').eq(0).attr('data-value')), //类型
                    data.associatedId=$('#checkTaskType span').eq(1).attr('data-value'), //资源
                    data.moduleId=$('#checkTaskType span').eq(2).attr('data-value');//步骤

                    if(!data.name||!JSON.parse(data.checkId)[0]||!data.startDate||!data.planDate||!data.workDays||!data.associatedType||!data.associatedId||!data.moduleId){
                        //名称,审核人，开始时间，预计时间，工作日，类型，资源，步骤
                        projectCommon.quoteUserWarning('#newTaskSave','509px','269px','有小红星标识的为必填项！');
                        return false;
                    }else if(!data.version){
                        projectCommon.quoteUserWarning('#newTaskSave','509px','269px','请输入版本号！');
                        return false;
                    }
                    else if(data.startDate>data.planDate){
                        projectCommon.quoteUserWarning('#newTaskEndTime','-63px','-30px','开始时间不能大于结束时间！');
                        return false;
                    }
                    $.ajax({
                        url: '/api/taskCard/createVersion',
                        type: 'post',
                        data:data,
                        success: function (data){
                            console.log('----版本--创建成功---------',data); //版本 只能在（资产，镜头，由我创建中新建）
                            localStorage.setItem("thisTaskId",data.list.taskId);
                            var pageType=localStorage.getItem('pageType');
                            if(pageType=='shot'||pageType=='shotList'){ //镜头查看
                                $('.newTaskOfShot').loadPage('taskCard.edit.html');
                            }
                            else if(pageType=='asset'|| pageType=='assetList'){//资产查看
                                $('.newTaskOfAsset').loadPage('taskCard.edit.html');
                            }
                            else if(pageType=='myCreateTask'){ //由我创建
                                $('#myTask-content').loadPage('taskCard.edit.html');
                            }


                        },
                        error: function(data){
                            //警告！
                            projectCommon.quoteUserWarning('#newTaskSave','509px','270px','新建任务版本失败！');
                            console.log(data);
                        }
                    });
                }else{ //新建任务
                    if(!data.name||!JSON.parse(data.checkId)[0]||!data.startDate||!data.planDate||!data.workDays||!data.associatedType||!data.associatedId||!data.moduleId){
                        //名称,审核人，开始时间，预计时间，工作日，类型，资源，步骤
                        projectCommon.quoteUserWarning('#newTaskSave','509px','269px','有小红星标识的为必填项！');
                        return false;
                    }else if(!data.version){
                        projectCommon.quoteUserWarning('#newTaskSave','509px','269px','请输入版本号！');
                        return false;
                    }else if(data.startDate>data.planDate){
                        projectCommon.quoteUserWarning('#newTaskEndTime','-63px','-30px','开始时间不能大于结束时间！');
                        return false;
                    }
                    $.ajax({
                        url: '/api/taskCard/createTask',
                        type: 'post',
                        data:data,
                        success: function (data){
                            console.log('--任务-- 创建成功---------',data);  //任务只能在项目里面创建（资产和镜头）！
                            localStorage.setItem("thisTaskId",data.list.id);
                            if(type==1){ //镜头查看
                                $('.newTaskOfShot').loadPage('taskCard.edit.html');
                            }else{//资产查看
                                $('.newTaskOfAsset').loadPage('taskCard.edit.html');
                            }

                        },
                        error: function(data){
                            //警告！
                            projectCommon.quoteUserWarning('#newTaskSave','509px','261px','新建任务卡失败！');
                            console.log(data);
                        }
                    });
                }


            }else{//编辑
                data.taskId=$('#newTaskName').attr('data-value');
                thisTaskId=data.taskId;
                data.versionId=$('#taskVersionCheck').attr('data-value');
                console.log('任务编辑data',data);
                if(!data.name||!JSON.parse(data.checkId)[0]||!data.startDate||!data.planDate||!data.workDays||!data.associatedType||!data.associatedId||!data.moduleId){
                    //名称,审核人，开始时间，预计时间，工作日，类型，资源，步骤
                    projectCommon.quoteUserWarning('#newTaskSave','509px','269px','有小红星标识的为必填项！');
                    return false;
                }else if(!data.version){
                    projectCommon.quoteUserWarning('#newTaskSave','509px','269px','请输入版本号！');
                    return false;
                }else if(data.startDate>data.planDate){
                    projectCommon.quoteUserWarning('#newTaskEndTime','-63px','-30px','开始时间不能大于结束时间！');
                    return false;
                }
                var update;
                console.log('-------点保存-----',taskVersionId);
                var pageType=localStorage.getItem('pageType');
                if(pageType=='shot'||pageType=='shotList'||pageType=='asset'||pageType=='assetList'){
                    update='updateCurTask'; //当前版本
                }else{
                    update='updateTask';  //版本
                }
                console.log('update',update,data);
                $.ajax({
                    url: '/api/taskCard/'+update +'',
                    type: 'put',
                    data:data,
                    success: function (data){
                        console.log('---编辑成功---------',data);
                        checkShow();
                        if(pageType=='shot'||pageType=='shotList'||pageType=='asset'||pageType=='assetList'){
                            refreshTask('', thisTaskId); //当前版本
                        }else{
                            refreshTask('create',taskVersionId); //版本
                        }
                        $('.task-area-version').removeClass('task-area-version-edit').addClass('task-area-version-view');
                        /*localStorage.setItem("thisTaskId",data.list.id);
                        if(type==1){ //镜头查看
                            $('.newTaskOfShot').loadPage('taskCard.edit.html');
                        }else{//资产查看
                            $('.newTaskOfAsset').loadPage('taskCard.edit.html');
                        }*/

                    },
                    error: function(data){
                        //警告！
                        projectCommon.quoteUserWarning('#newTaskSave','509px','261px','编辑任务卡失败！');
                        console.log(data);
                    }
                });
            }

        });
        //点保存2
        $('.taskBasicInfoBox').on('click','#taskSenderSave',function(){
            var data={};
            data.versionId=$('#taskVersionCheck').attr('data-value');
            data.type=$('#taskSenderEditType').attr('data-value'); //类型 （内部）
            data.productorId=$('#taskSenderEditProductor').attr('data-value'); //制作人id
            data.priority=$('#taskLevelEditSelect .active').text(); //等级（..A A+）
            data.points=$('#taskSenderEditScore').val(); //积分
            data.projectId=localStorage.getItem('projectId');
            //填写验证
            if(data.type==''||!data.productorId||!data.priority||data.points==''){
                console.log('data',data);
                projectCommon.quoteUserWarning('#taskSenderSave','300px','-30px','有小红星标识的为必填项！');
                return false;
            }
            if(data.points<=0|| data.points>100000){
                projectCommon.quoteUserWarning('#taskSenderEditScore','96px','-30px','积分应在(0,100000]之间！');
                return false;
            }
            data.type=parseInt(data.type);
            data.points=parseFloat(data.points);
            //请求
            $.ajax({
                url:'/api/taskCard/saveTaskType',
                type:'post',
                data:data,
                success: function(data) {
                    console.log('---sender-edit---save----------',data);
                    //填写完成后
                    tabTitle('.title-view-task');
                    //$('.task-area-version').removeClass('task-area-version-edit').addClass('task-area-version-check');

                    //刷新编辑完的数据
                    if(data.list.type==0){ //内部任务
                        $('#taskAddToContract').hide();
                        $('#taskSend').show();
                    }else{ //外部任务
                        $('#taskAddToContract').show();
                        $('#taskSend').hide();
                    }
                    $('#taskSenderCheckType').html($('#taskSenderEditType').val()).attr('data-value',$('#taskSenderEditType').attr('data-value')); //类型
                    $('#taskSenderCheckProductor').html($('#taskSenderEditProductor').val()).attr('data-value',$('#taskSenderEditProductor').attr('data-value')); //制作人
                    $('#taskSenderCheckScore').html($('#taskSenderEditScore').val()); //积分
                    var index=-1;
                    var level='';
                    $('#taskLevelEditSelect li').each(function(i){
                        if($(this).hasClass('active')){
                            index=i;
                            level=$(this).html();
                        }
                    });
                    $('#taskLevelCheckSelect li').html('').eq(index).html(level);
                    $('.taskSenderCheck').show();
                    $('.taskSenderEdit').hide();


                },
                error:function(err){
                    console.log(err);
                }
            });





        });
        //点取消
        $('.addTask').on('click','#newTaskCancel',function(){
            if(newTask){ //新建
                newVersion=$('.title-new-task','#taskStatus').css('display') == 'none' ? true: false;
                if(newVersion){ //new version
                    tabTitle('.title-new-task-version');
                    var pageType=localStorage.getItem('pageType');
                    if(pageType=='asset' || pageType=='assetList'){
                        $('.newTaskOfAsset').loadPage('taskCard.edit.html');
                    }
                    else if(pageType=='shot' || pageType=='shotList'){
                        $('.newTaskOfShot').loadPage('taskCard.edit.html');
                    }else if(pageType=='myCreateTask'){ //由我创建
                        $('#myTask-content').loadPage('taskCard.edit.html');
                    }
                }else{ //new task
                    tabTitle('.title-new-task');
                    if(type==1){
                        ShotMangement.cancelNewTask();
                    }else{
                        assetManagement.cancelNewTask();
                    }
                }

            }else{//查看
                checkShow();
            }

        });
        //点取消2
        $('.taskBasicInfoBox').on('click','#taskSenderCancel',function(){
            tabTitle('.title-view-task');
            //$('.task-area-version').removeClass('task-area-version-edit').addClass('task-area-version-check');
            $('.taskSenderCheck').show();
            $('.taskSenderEdit').hide();  //
        });
        //点退回
        $('.taskBasicInfoBox').on('click','#taskSendBack',function(){
            $('.taskSendBackReason').val('');
            $('#taskSendBackBox').show();
            $('.taskSendBackReason').focus();
        });
        //退回点确定
        $('.taskBasicInfoBox').on('click','#taskSendBackSave',function(){
            //退回的交互？？？
            var data={};
            data.reason=$('.taskSendBackReason').val().replace(/^\s+/, "").replace(/\s+$/, "");
            data.versionId=$("#taskVersionCheck").attr('data-value');
            data.projectId=localStorage.getItem('projectId');
            //console.log('$(".taskSendBackReason").val() : ',data);
            if(data.reason==''){
                projectCommon.quoteUserWarning('#taskSendBackSave','80px','12px','退回原因不能为空！');
                return false;
            }
            //console.log('data.reason',data);
            $.ajax({
                url: '/api/taskCard/backToTask',
                type: 'post',
                data:data,
                success: function (data){
                    console.log('---sendBack---data------',data);
                    if(data=='backSuccess'){
                        var versionId=$('#taskVersionCheck').attr('data-value');
                        console.log('kkkkkk',$('#taskVersionCheck').attr('data-value'));
                        socketCommon.emit().getCreateUnReadTask(versionId);
                        $('#taskSendBackBox').hide();
                        var pageType=localStorage.getItem('pageType');
                        console.log('pageType',pageType);
                        if(pageType=='shot'||pageType=='shotList'||pageType=='asset'||pageType=='assetList'){
                            var thisTaskId=localStorage.getItem('thisTaskId');
                            refreshTask('',thisTaskId);
                        }else{
                            console.log('0000000000000000');
                            localStorage.removeItem('thisTaskVersionId');
                            $('#myTask-content').loadPage('mySendTask.html');
                            taskBasicInfo.countAllOfMyTaskUnread();
                        }

                        $('.task-status').removeClass('progress-status-2');
                    }


                },
                error: function(data){
                    //警告！
                    //projectCommon.quoteUserWarning('#newTaskSave','449px','261px','获取权限失败！');
                    console.log(data);
                }
            });




        });

        //退回点取消3
        $('.taskBasicInfoBox').on('click','#taskSendBackCancel',function(){
            $('#taskSendBackBox').hide();
        });
        //点编辑2
        $('.taskBasicInfoBox').on('click','#taskSenderEdit',function(){
            var percent=$('#checkTaskCompleteProgress').html().replace('%','');
            if(percent!=='0'){
                $('#taskSenderEditScore').attr({'disabled':'disabled','title':'您的任务进程已开始，积分不能更改！'}).css('cursor','not-allowed');
            }
            tabTitle('.title-edit-task');
            //$('.task-area-version').removeClass('task-area-version-view').addClass('task-area-version-edit');
            //刷新编辑的数据
            $('#taskSenderEditType').val($('#taskSenderCheckType').html()).attr('data-value',$('#taskSenderCheckType').attr('data-value')); //类型 （内部,0）
            $('#taskSenderEditProductor').val($('#taskSenderCheckProductor').html()).attr('data-value',$('#taskSenderCheckProductor').attr('data-value')); //制作人id
            $('#taskSenderEditScore').val($('#taskSenderCheckScore').html()); //积分
            var level='';
            $('#taskLevelCheckSelect li').each(function(i){
                if($(this).html()!==''){
                    level=$(this).html();
                }
            })
            //等级（..A A+）
            switch(level){
                case 'C-':
                    $('#taskLevelEditSelect li').removeClass('active');
                    $('#taskLevelEditSelect li').eq(0).addClass('active');
                    break;
                case 'C':
                    $('#taskLevelEditSelect li').removeClass('active');
                    $('#taskLevelEditSelect li').eq(1).addClass('active');
                    break;
                case 'C+':
                    $('#taskLevelEditSelect li').removeClass('active');
                    $('#taskLevelEditSelect li').eq(2).addClass('active');
                    break;
                case 'B-':
                    $('#taskLevelEditSelect li').removeClass('active');
                    $('#taskLevelEditSelect li').eq(3).addClass('active');
                    break;
                case 'B':
                    $('#taskLevelEditSelect li').removeClass('active');
                    $('#taskLevelEditSelect li').eq(4).addClass('active');
                    break;
                case 'B+':
                    $('#taskLevelEditSelect li').removeClass('active');
                    $('#taskLevelEditSelect li').eq(5).addClass('active');
                    break;
                case 'A-':
                    $('#taskLevelEditSelect li').removeClass('active');
                    $('#taskLevelEditSelect li').eq(6).addClass('active');
                    break;
                case 'A':
                    $('#taskLevelEditSelect li').removeClass('active');
                    $('#taskLevelEditSelect li').eq(7).addClass('active');
                    break;
                case 'A+':
                    $('#taskLevelEditSelect li').removeClass('active');
                    $('#taskLevelEditSelect li').eq(8).addClass('active');
                    break;
            }


            var shotOrAsset=$('#checkTaskType span').eq(0).html();
            if(shotOrAsset=='镜头'){ //镜头节点
                $.ajax({
                    url:'/api/stepShot/'+$('#checkTaskType span').eq(2).attr('data-value'),
                    type:'get',
                    success: function(data) {
                        //console.log('---shot-------节点的成员------------',data.list.member.member);
                        var arr=data.list.member.member;
                        if(arr.length!=0){
                            var str='';
                            for(var i=0; i<arr.length; i++){
                                str+='<li data-value="'+arr[i].id+'">'+arr[i].name+'</li>';
                            }
                            $('#taskSenderEditProductorSelect').html(str);
                        }

                    },
                    error:function(err){
                        console.log(err);
                    }
                });
            }else{//资产节点
                $.ajax({
                    url:'/api/stepAsset/'+$('#checkTaskType span').eq(2).attr('data-value'),
                    type:'get',
                    success: function(data) {
                        console.log('----asset------节点的成员------------',data.list.member.member);
                        var arr=data.list.member.member;
                        if(arr.length!=0){
                            var str='';
                            for(var i=0; i<arr.length; i++){
                                str+='<li data-value="'+arr[i].id+'">'+arr[i].name+'</li>';
                            }
                            $('#taskSenderEditProductorSelect').html(str);
                        }

                    },
                    error:function(err){
                        console.log(err);
                    }
                });
            }

            if(taskBasicInfo.isHaveRelatedContract){ //已添加至合同
                $('#taskSenderEditTypeSelect').children().eq(0).hide();
            }



            $('.taskSenderEdit').show();
            $('.taskSenderCheck').hide();
            $('.taskBasicInfoBox').scrollTop( $('.taskBasicInfoBox')[0].scrollHeight ); //滚到下面

        });
        //点派发
        $('.taskBasicInfoBox').on('click','#taskSend',function(){
            //改变状态为2（制作中）
            departmentObj.showAskModel('您确认派发此任务卡吗!', true, function(flag){
                if(flag){
                    $.ajax({
                        url: '/api/taskCard/updateTaskStatus',
                        type: 'put',
                        data:{
                            status:2,
                            versionId:$('#taskVersionCheck').attr('data-value'),
                            userId:localStorage.getItem('userId'),
                            readStatus:'false',
                            projectId:localStorage.getItem('projectId')
                        },
                        success: function (data){
                            console.log('---派发完成---------',data);
                            //只有由我发送里面有派发按钮
                            var thisTaskVersionId=localStorage.getItem('thisTaskVersionId');
                            refreshTask('create',thisTaskVersionId);
                            socketCommon.emit().getProductUnReadTask($('#taskVersionCheck').attr('data-value'));
                            $('#taskSenderBtnBox').hide(); //派发人按钮
                        },
                        error: function(data){
                            //警告！
                            projectCommon.quoteUserWarning('#taskSend','449px','261px','派发失败！');
                            console.log(data);
                        }
                    });
                }
            });
        });
        //点 选择等级
        $('.taskBasicInfoBox').on('click','#taskLevelEditSelect li',function(){
            $(this).siblings().removeClass('active');
            $(this).addClass('active');
        });
        //点添加到合同
        $('.taskBasicInfoBox').on('click','#taskAddToContract',function(){
            //console.log('-------------------constract---------------');
            if(taskBasicInfo.isHaveRelatedContract){
                return false;
            }
            //跳到项目下
            localStorage.setItem('newContractFrom','task');
            //localStorage.setItem('projectId',this.dataset.projectId);
            $('#myTask').removeClass('current');
            $('#myProject').addClass('current');
            $('#container').loadPage('MyProjects');
            $('#my-project-details').loadPage('myProjectDetails').show().siblings('div').text('').hide();
            //获取权限后跳到合同下
            projectCommon.getProAuthoritysAndLoadProjectPage(localStorage.getItem('projectId'),function(){
                //跳到   新建合同下
                //console.log('aaaaaddddddddddddddd');
                $('#contractMg').addClass('my-project-nav-active').siblings().removeClass('my-project-nav-active');
                $('#my-project-info').loadPage('contractMg'); //加载 合同查看页
                location.href='#/contractNew';
            });


        });

        //点撤回
        $('#taskSendBackToNotSend').on('click',function(){
            departmentObj.showAskModel('您确认撤回此任务卡吗!', true, function(flag){
                if(flag){
                    $.ajax({
                        url: '/api/taskCard/updateTaskStatus',
                        type: 'put',
                        data:{
                            status:1,
                            versionId:$('#taskVersionCheck').attr('data-value'),
                            readStatus:'true',
                            projectId:localStorage.getItem('projectId'),
                            flag:true    //制卡完成没有，撤回有
                        },
                        success: function (data){
                            console.log('---撤回完成---------',data);
                            //localStorage.setItem('sendBack','haveSend');
                            $('#taskSendBackToNotSend').hide(); //撤回按钮

                            $('#taskProgressSubmitBtn').hide(); //提交按钮
                            $('#taskProgressSubmitBtn').parent().css('height','0');

                            var pageType=localStorage.getItem('pageType');
                            if(pageType=='shot'||pageType=='shotList'||pageType=='asset'||pageType=='assetList'){
                                var thisTaskId=localStorage.getItem('thisTaskId');
                                refreshTask('',thisTaskId);
                            }else{
                                var thisTaskVersionId=localStorage.getItem('thisTaskVersionId');
                                refreshTask('create',thisTaskVersionId);
                            }
                        },
                        error: function(data){
                            //警告！
                            projectCommon.quoteUserWarning('#newTaskSave','449px','261px','制卡完成失败！');
                            console.log(data);
                        }
                    });
                }
            });

        });
        //onchange
        //自动填写工作日
        /*$('#newTaskStartTime').on('change',function(){
            var n=calcWorkday();
            $('#newTaskNeedDay').val(n);
        });

        $('#newTaskEndTime').on('change',function(){
            var n=calcWorkday();
            $('#newTaskNeedDay').val(n);
        });*/
        function calcWorkday(){
            var tS=$('#newTaskStartTime').val();
            var tE=$('#newTaskEndTime').val();
            if((tS!='')&&(tE!='')){
                var tStart=new Date(tS);
                //console.log('type', typeof tStart.getTime());
                var tEnd=new Date(tE);
                var dAll=0;
                if(tEnd-tStart>=0){
                    dAll=(tEnd-tStart)/86400000+1;
                    var dTem=null;
                    var dWeekday=0;
                    for(var i=0; i<dAll; i++){
                        dTem=new Date(tStart.getTime()+i*86400000);
                        var day=dTem.getDay();
                        //console.log('i: '+i+'day: ',day);
                        if(day==6||day==0){
                            dWeekday++;
                        }
                    }
                    //console.log('工作日有:'+(dAll-dWeekday)+'天！');
                    return dAll-dWeekday;
                }else{
                    return '';
                }

            }else{
                return '';
            }

        }


    }

    g.taskBasicInfo={
        init:init,
        productorId:'',
        productorName:'',
        percent:'',
        isHaveRelatedContract:false,
        refreshTask:refreshTask,
        countAllOfMyTaskUnread:countAllOfMyTaskUnread,
        authorityData:{}  //权限（是否是项目负责人，任务负责人，任务卡管理权限，合同负责人，合同管理权限）
                                        //(projectLeader，taskLeader，manageAllTasks，contractLeader，manageAllContracts)
    };
})(jQuery,window);
