(function($,g){
    //当前进程的颜色  #E4FFE5
    g.taskProgressList={
        init:init,
        refreshProgressLists:refreshProgressLists,
        refreshThisVersionProgress:refreshThisVersionProgress,
        quoteUserWarning:quoteUserWarning,
        flag:false,
        thisProgressNotPass:'no',
        task_checkers:[],//任务审核人
    };
    var checkers_num= 0,
        task_checkers=[],
        producer='',
        thisProgressNotPass='no';
    function init(){
        //选日期 日期在 左上
        $(".progress_date_time").datetimepicker({
            format: "yyyy-mm-dd",
            minView: "month",
            autoclose: true,
            todayBtn: true,
            language:'zh-CN',
            pickerPosition: "top-left"
        });

        document.getElementById('task-progress').onscroll = function(){
            /*$('#task-progress-list-wrap').css('width',width);
            console.log('task-progress-list-wrap-width',width);*/
            //console.log(777777);
            $('.datetimepicker.datetimepicker-dropdown-top-left.dropdown-menu').css({'display':'none'});
            $('#task-progress-new-startTime').blur();
            $('#task-progress-new-planTime').blur();
            $('.task-progress-start-edit').blur();
            $('.task-progress-plan-edit').blur();
        }
        //获取审核人和它的个数
        refreshThisVersionProgress($('#taskVersionCheck').attr('data-value'),$('#taskVersionCheck').attr('data-status'));


        //console.log('oooo',$('.task-progress-table thead tr').children('th').eq(0).width());
        //点编辑
        $('.task-progress-table tbody').on('click','.task-progress-edit-btn',function(){
            var thisTr=$(this).parent().parent().parent();
            var strPercent=thisTr.find('.task-progress-percent-check').html();
            var editPercent=strPercent.substring(0,strPercent.length-1);
            thisTr.find('.task-progress-percent-edit').val(editPercent);
            thisTr.find('.task-progress-name-edit').val(thisTr.find('.task-progress-name-check').html());
            thisTr.find('.task-progress-step-edit').val(thisTr.find('.task-progress-step-check').html());
            thisTr.find('.task-progress-start-edit').val(thisTr.find('.task-progress-start-check').html());
            thisTr.find('.task-progress-plan-edit').val(thisTr.find('.task-progress-plan-check').html());



            thisTr.find('.task-progress-check').hide();
            thisTr.find('.task-progress-edit').show();

        });
        //编辑点保存
        $('.task-progress-table tbody').on('click','.task-progress-save-btn',function(){
            var thisTr=$(this).parent().parent().parent();
            var index=thisTr.index(); //第几个进程
            var that=$(this);
            var data={};
            data.id=thisTr.find('.task-progress-name-edit').attr('data-value'); //编辑有进程id
            data.creatorId=localStorage.getItem('userId');
            data.projectId=localStorage.getItem('projectId');
            data.taskVersionId=$('#taskVersionCheck').attr('data-value');
            data.name=thisTr.find('.task-progress-name-edit').val();
            data.step=thisTr.find('.task-progress-step-edit').val();
            data.percent=thisTr.find('.task-progress-percent-edit').val();
            data.startDate=thisTr.find('.task-progress-start-edit').val();
            data.predictDate=thisTr.find('.task-progress-plan-edit').val();
            var thisCheckPencent=$('.task-progress-table').find('.task-progress-percent-check').eq(index).html();//这个的百分比（带百分号）
            var pencent=parseFloat(thisCheckPencent.substring(0,thisCheckPencent.length)); //这个的百分比
            var allPercent=getAllPersent(index)-pencent+parseFloat(data.percent);
            console.log('总百分比',allPercent);
            if(!data.name||!data.step||!data.percent||!data.startDate||!data.predictDate){
                taskProgressList.quoteUserWarning(that,'-138px','-3px','输入框为必填项！');
                return false;
            }else if(data.startDate>data.predictDate){
                taskProgressList.quoteUserWarning(that,'-208px','-3px','开始时间不能大于预计时间！');
                return false;
            }else if((data.percent<=0)||(data.percent>100)){
                projectCommon.quoteUserWarning(that,'-224px','-3px','进程百分比应大于0，小于100%！');
                return false;
            }else if(allPercent>100){
                taskProgressList.quoteUserWarning(that,'-246px','-3px','所有进程百分比总数不能超过100%！');
                return false;
            }
            //编辑的请求
            updateProgress(data,thisTr);

            //tashProgressSetWidth();
        });
        //点取消
        $('.task-progress-table tbody').on('click','.task-progress-cancel-btn',function(){
            var thisTr=$(this).parent().parent().parent();

            thisTr.find('.task-progress-edit').hide();
            thisTr.find('.task-progress-check').show();
        });
        //点删除
        $('.task-progress-table tbody').on('click','.task-progress-delete-btn',function(){
            console.log('点一次删除');
            var thisTr=$(this).parent().parent().parent();
            var progressId=thisTr.find('.task-progress-name-check').attr('data-value');
            departmentObj.showAskModel('是否确定删除这个进程？', true, function(flag){
                if(flag){
                    console.log('开始删除了',progressId);
                    $.ajax({
                        url: '/api/progress/deleteProgress/'+progressId,
                        type: 'delete',
                        success: function (data){
                            console.log('---删除-进程--成功！---------',data);
                            thisTr.remove();
                            var childLength=$('.task-progress-table tr .task-progress-name-check-wrap').length;
                            if(childLength==0){
                                $('.task-progress-table').hide();
                            }
                        },
                        error: function(data){
                            //projectCommon.quoteUserWarning('#newTaskSave','449px','261px','切换版本失败！');
                            console.log(data);
                        }
                    });
                }
            });
        });

        //点新建
        $('.task-progress-add-btn').on('click',function(){
            //先清空
            if($('#task-progress-new').css('display')=='none'){
                $('#task-progress-new-name').val('');
                $('#task-progress-new-step').val('');
                $('#task-progress-new-percent').val('');
                $('#task-progress-new-startTime').val('');
                $('#task-progress-new-planTime').val('');

            }
            $('.task-progress-table ').show();
            $('.task-progress-new').show();
            $('#task-progress-new').show();

        });
        //新建点保存
        $('.task-progress-table tbody').on('click','.task-progress-new-save-btn',function(){
            var data={};
            data.creatorId=localStorage.getItem('userId');
            data.projectId=localStorage.getItem('projectId');
            data.taskVersionId=$('#taskVersionCheck').attr('data-value');
            data.name=$('#task-progress-new-name').val();
            data.step=$('#task-progress-new-step').val();
            data.percent=$('#task-progress-new-percent').val();
            data.startDate=$('#task-progress-new-startTime').val();
            data.predictDate=$('#task-progress-new-planTime').val();
            var allPercent=getAllPersent()+parseFloat(data.percent);
            console.log('总百分比',allPercent);
            if(!data.name||!data.step||!data.percent||!data.startDate||!data.predictDate){
                projectCommon.quoteUserWarning('.task-progress-new-save-btn','-133px','-3px','输入框为必填项！');
                return false;
            }else if(data.startDate>data.predictDate){
                projectCommon.quoteUserWarning('.task-progress-new-save-btn','-203px','-3px','开始时间不能大于预计时间！');
                return false;
            }else if((data.percent<=0)||(data.percent>100)){
                projectCommon.quoteUserWarning('.task-progress-new-save-btn','-224px','-3px','进程百分比应大于0，小于100%！');
                return false;
            }else if(allPercent>100){
                projectCommon.quoteUserWarning('.task-progress-new-save-btn','-246px','-3px','所有进程百分比总数不能超过100%！');
                return false;
            }
            createProgress(data);
        });
        //新建点取消
        $('.task-progress-table tbody').on('click','.task-progress-new-cancel-btn',function(){
            var childLength=$('.task-progress-table tr .task-progress-name-check-wrap').length;
            if(childLength==0){
                $('.task-progress-table').hide();
            }
            $('#task-progress-new').hide();
        });
        //点进程名称
        $('.task-progress-table tbody').on('click','tr .task-progress-name-check-wrap',function(){
            console.log('点击进程名一次！');
            if($(this).find('.task-progress-check').css('display')!=='none'){ /*如果处于查看状态*/
                var thisTr=$(this).parent();
                var userId=localStorage.getItem('userId');
                var thisProgressId=$(this).find('.task-progress-name-check').attr('data-value');
                localStorage.setItem('progressId',thisProgressId);
                $('#progress-review-page').loadPage('progressReview.html').show();
                //console.log('arr',taskProgressList.task_checkers);
                //console.log('thisId',userId);
                console.log('checkers',taskProgressList.task_checkers);
                var index=projectCommon.findInArr(taskProgressList.task_checkers,userId);
                console.log('index',index);
                var thisCheck=thisTr.find('.task-progress-check'+(index+1)+'-results').attr('data-check');
                var status=$('#taskVersionCheck').attr('data-status');
                var currentProgress=thisTr.attr('data-progress');
                //审核中状态(status==3)，当前进程(yes)
                if((status==3)&&(currentProgress=='yes')&&(index!=-1)){  //当前进程&&是审核人
                    if(index==0&&thisCheck==''){ //第1审核人&&自己没有加审核意见
                        $('#addCheckResult').show();
                    }
                    if(index!=0){  //第2或3审核人
                        var thisPrepCheck=thisTr.find('.task-progress-check'+index+'-results').attr('data-check');
                        if(thisPrepCheck=='yes'&&thisCheck==''){ //上个人已通过&&自己没有加审核意见
                            $('#addCheckResult').show();
                        }
                    }
                    console.log('thisHtml',thisCheck);
                }

                $('#task-progress-list-wrap').hide(); //隐藏进程列表

            }
            //跳转到进程文件页

        });

        //taskProgressSetWidth();
    }
    //获取审核人和它的个数
    function refreshThisVersionProgress(versionId,versionStatus){
        $('.datetimepicker.datetimepicker-dropdown-top-left.dropdown-menu').remove();
        console.log('进程render!!!     2');
        var taskVersionId=versionId||$('#taskVersionCheck').attr('data-value');
        refreshProgressLists(taskVersionId,versionStatus);
        /*$.ajax({
            url: '/api/taskCard/getCheckUsers/'+taskVersionId,
            type: 'get',
            success: function (data){
                console.log('----任务卡-data--审核人-------',data);
                //审核人  && 初始化表头
                var str='',str1='',str2='',str3='',checker1='',checker2='',checker3='';
                task_checkers.length=0;
                for(var i=0; i<data.length; i++){
                    if(data[i].checkFlag==1){
                        str1='<th data-value="'+data[i].User.id+'">'+data[i].User.name+'</th>';
                        checker1=data[i].User.id;
                    }
                    else if(data[i].checkFlag==2){
                        str2='<th data-value="'+data[i].User.id+'">'+data[i].User.name+'</th>';
                        checker2=data[i].User.id;
                    }
                    else if(data[i].checkFlag==3){
                        str3='<th data-value="'+data[i].User.id+'">'+data[i].User.name+'</th>';
                        checker3=data[i].User.id;
                    }
                }
                str=str1+str2+str3;
                if(checker1){
                    task_checkers.push(checker1);
                }
                if(checker2){
                    task_checkers.push(checker2);
                }
                if(checker3){
                    task_checkers.push(checker3);
                }
                taskProgressList.task_checkers=task_checkers;
                //console.log(data[i].User.name);
                //console.log('task_checkers---progress--list',task_checkers);
                $('#task-progress-checkers').html(str);
                $('.task-back-checkers').attr('colspan',data.length);
                checkers_num=data.length;

                refreshProgressLists(taskVersionId,versionStatus);
                addNewProgressText(versionStatus);

            },
            error: function(data){
                //???  失败提示
                console.log(data);
            }
        });*/
    }
    //更新进程
    function updateProgress(data,thisTr){
        var stored_data=data;
        $.ajax({
            url: '/api/progress/updateProgress',
            type: 'put',
            data:data,
            success: function (data){
                console.log('---编辑--进程成功！---------',data);
                thisTr.find('.task-progress-percent-check').html(stored_data.percent+'%');
                thisTr.find('.task-progress-name-check').html(stored_data.name);
                thisTr.find('.task-progress-step-check').html(stored_data.step);
                thisTr.find('.task-progress-start-check').html(stored_data.startDate);
                thisTr.find('.task-progress-plan-check').html(stored_data.predictDate);

                thisTr.find('.task-progress-edit').hide();
                thisTr.find('.task-progress-check').show();

            },
            error: function(data){
                //projectCommon.quoteUserWarning('#newTaskSave','449px','261px','切换版本失败！');
                console.log(data);
            }
        });
    }
    //获取百分比总数
    function getAllPersent(index){
        var index=-1;
        var persentList=$('.task-progress-table').find('.task-progress-percent-check');
        var allPersent=0;
        var onePersent=0;
        //console.log('length',persentList.length);
        for(var i=0; i<persentList.length; i++){
            onePersent=persentList.eq(i).html();
            //console.log(onePersent.substring(0,onePersent.length));
            allPersent+=parseFloat(onePersent.substring(0,onePersent.length));
        }
        return allPersent;
    }

    //获取已有进程列表
    function refreshProgressLists(versionId,status){
        $.ajax({
            url: '/api/progress/getProgress/'+versionId,
            type: 'get',
            success: function (data){
                console.log('---进程列表-----信息------\n',data);
                producer=data.producerName;     //暂时想用这个当制作人
                //console.log('producer--->',producer);
                var data1=data;
                if(data.length>0){ //有进程
                    var data=data[0].checkUser;
                    //console.log('----任务卡-data--审核人-------',data);
                    //审核人  && 初始化表头
                    var str='',str1='',str2='',str3='',checker1='',checker2='',checker3='';
                    task_checkers.length=0;
                    for(var i=0; i<data.length; i++){
                        if(data[i].checkFlag==1){
                            str1='<th data-value="'+data[i].userId+'">'+data[i].name+'</th>';
                            checker1=data[i].userId;
                        }
                        else if(data[i].checkFlag==2){
                            str2='<th data-value="'+data[i].userId+'">'+data[i].name+'</th>';
                            checker2=data[i].userId;
                        }
                        else if(data[i].checkFlag==3){
                            str3='<th data-value="'+data[i].userId+'">'+data[i].name+'</th>';
                            checker3=data[i].userId;
                        }
                    }
                    str=str1+str2+str3;
                    if(checker1){
                        task_checkers.push(checker1);
                    }
                    if(checker2){
                        task_checkers.push(checker2);
                    }
                    if(checker3){
                        task_checkers.push(checker3);
                    }
                    taskProgressList.task_checkers=task_checkers;
                    //console.log(data[i].User.name);
                    //console.log('task_checkers---progress--list',task_checkers);
                    $('#task-progress-checkers').html(str);
                    $('.task-back-checkers').attr('colspan',data.length);
                    checkers_num=data.length;
                    renderProgressLists(data1,status);


                    $('.task-progress-table').show();
                }else{ //没有进程
                    $.ajax({
                        url: '/api/taskCard/getCheckUsers/'+versionId,
                        type: 'get',
                        success: function (data){
                            console.log('----任务卡-data--审核人-------',data);
                            //审核人  $$ 初始化表头
                            var str='',str1='',str2='',str3='',checker1='',checker2='',checker3='';
                            task_checkers.length=0;
                            for(var i=0; i<data.length; i++){
                                if(data[i].checkFlag==1){
                                    str1='<th data-value="'+data[i].User.id+'">'+data[i].User.name+'</th>';
                                    checker1=data[i].User.id;
                                }
                                else if(data[i].checkFlag==2){
                                    str2='<th data-value="'+data[i].User.id+'">'+data[i].User.name+'</th>';
                                    checker2=data[i].User.id;
                                }
                                else if(data[i].checkFlag==3){
                                    str3='<th data-value="'+data[i].User.id+'">'+data[i].User.name+'</th>';
                                    checker3=data[i].User.id;
                                }
                            }
                            str=str1+str2+str3;
                            if(checker1){
                                task_checkers.push(checker1);
                            }
                            if(checker2){
                                task_checkers.push(checker2);
                            }
                            if(checker3){
                                task_checkers.push(checker3);
                            }
                            taskProgressList.task_checkers=task_checkers;
                            //console.log(data[i].User.name);
                            //console.log('task_checkers---progress--list',task_checkers);
                            $('#task-progress-checkers').html(str);
                            $('.task-back-checkers').attr('colspan',data.length);
                            checkers_num=data.length;
                            $('.task-progress-table tbody').html('');
                            addNewProgressText(status);
                        },
                        error: function(data){
                            //???  失败提示
                            console.log(data);
                        }
                    });
                    //控制可添加进程按钮
                    if((status<=0)&&(taskBasicInfo.authorityData.projectLeader||taskBasicInfo.authorityData.taskLeader||taskBasicInfo.authorityData.manageAllTasks)){
                        $('.task-progress-add-btn').show();
                    }else{
                        $('.task-progress-add-btn').hide();
                        $('.task-progress-noProgress').show();
                    }
                    $('.task-progress-table').hide();


                }

            },
            error: function(data){
                //projectCommon.quoteUserWarning('#newTaskSave','449px','261px','切换版本失败！');
                console.log(data);
            }
        });
    }
    //渲染已有进程列表
    function renderProgressLists(arr,versionStatus){
        //console.log('进程渲染  versionStatus ： ',versionStatus);
        $('.task-progress-table tbody').html('');
        //$('#task-progress-new').siblings().remove();
        var strArr='';
        var status=-1;
        for(var i=0; i<arr.length; i++){
            var currentProgress='';
            //判断是当前进程(属性)
            if((arr[i].curProgress=="true")&&(versionStatus>=2)){ //制作中后面的，当前进程
                currentProgress='style="background-color:#E4FFE5" data-progress="yes"';
                strArr+='<tr '+currentProgress+'>\
            <td  class="task-progress-name-check-wrap">\
                <div class="task-progress-name task-progress-check">\
                    <span class="task-progress-name-check" data-value="'+arr[i].id+'">'+arr[i].name+'</span>\
                </div>\
                <div class="task-progress-name task-progress-edit" style="display: none">\
                    <input class="task-progress-name-edit"  data-value="'+arr[i].id+'" type="text">\
                </div>\
            </td>\
            <td>\
                <div class="task-progress-step task-progress-check">\
                    <span  class="task-progress-step-check">'+arr[i].step+'</span>\
                </div>\
                <div class="task-progress-step task-progress-edit" style="display: none">\
                    <input  class="task-progress-step-edit" type="text">\
                </div>\
            </td>\
            <td>\
                <div class="task-progress-percent task-progress-check">\
                    <span class="task-progress-percent-check">'+arr[i].percent+'%</span>\
                </div>\
                <div class="task-progress-percent task-progress-edit" style="display: none">\
                    <input  class="task-progress-percent-edit" type="text">\
                </div>\
                </td>\
            <td>\
                <div class="task-progress-start task-progress-check">\
                    <span class="task-progress-start-check">'+arr[i].startDate+'</span>\
                </div>\
                <div class="form-group task-progress-start task-progress-edit" style="margin-bottom:0; display: none">\
                    <input  type="text" class="form-control progress_date_time task-progress-timeinput task-progress-start-edit" readonly>\
                </div>\
            </td>\
            <td>\
                <div class="task-progress-plan task-progress-check">\
                    <span class="task-progress-plan-check">'+arr[i].predictDate+'</span>\
                </div>\
                <div class="form-group task-progress-plan task-progress-edit" style="margin-bottom:0; display: none">\
                    <input type="text"  class="form-control progress_date_time task-progress-timeinput task-progress-plan-edit" readonly>\
                </div>\
            </td>\
            <td class="task-progress-end-check">'+arr[i].completeDate+'</td>\
            <td class="task-progress-producer-check">'+taskBasicInfo.productorName+'</td>\
            ';
            //console.log('taskBasicInfo.productorName: ',taskBasicInfo.productorName);
            }else{
                strArr+='<tr '+currentProgress+'>\
            <td  class="task-progress-name-check-wrap">\
                <div class="task-progress-name task-progress-check">\
                    <span class="task-progress-name-check" data-value="'+arr[i].id+'">'+arr[i].name+'</span>\
                </div>\
                <div class="task-progress-name task-progress-edit" style="display: none">\
                    <input class="task-progress-name-edit"  data-value="'+arr[i].id+'" type="text">\
                </div>\
            </td>\
            <td>\
                <div class="task-progress-step task-progress-check">\
                    <span  class="task-progress-step-check">'+arr[i].step+'</span>\
                </div>\
                <div class="task-progress-step task-progress-edit" style="display: none">\
                    <input  class="task-progress-step-edit" type="text">\
                </div>\
            </td>\
            <td>\
                <div class="task-progress-percent task-progress-check">\
                    <span class="task-progress-percent-check">'+arr[i].percent+'%</span>\
                </div>\
                <div class="task-progress-percent task-progress-edit" style="display: none">\
                    <input  class="task-progress-percent-edit" type="text">\
                </div>\
                </td>\
            <td>\
                <div class="task-progress-start task-progress-check">\
                    <span class="task-progress-start-check">'+arr[i].startDate+'</span>\
                </div>\
                <div class="form-group task-progress-start task-progress-edit" style="margin-bottom:0; display: none">\
                    <input  type="text" class="form-control progress_date_time task-progress-timeinput task-progress-start-edit" readonly>\
                </div>\
            </td>\
            <td>\
                <div class="task-progress-plan task-progress-check">\
                    <span class="task-progress-plan-check">'+arr[i].predictDate+'</span>\
                </div>\
                <div class="form-group task-progress-plan task-progress-edit" style="margin-bottom:0; display: none">\
                    <input type="text"  class="form-control progress_date_time task-progress-timeinput task-progress-plan-edit" readonly>\
                </div>\
            </td>\
            <td class="task-progress-end-check">'+arr[i].completeDate+'</td>\
            <td class="task-progress-producer-check">'+arr[i].producerName+'</td>\
            ';
            }



            var str1='',str2='',str3='';
            for(var j=0; j<checkers_num; j++){
                status=arr[i].checkUser[j].checkType; //0 （×）1（没审） 2（√）
                var checkStep=arr[i].checkUser[j].checkFlag; //1 2 3 审核顺序
                //console.log('status:'+status+'  checkStep：'+checkStep);
                if(checkStep==1){
                    if(status==0){
                        str1='<td data-check="no" class="task-progress-check1-results"><i class="iconfont" style="color:#ff5c5c">&#xe63d;</i></td>';
                    }else if(status==1){
                        str1='<td data-check="" class="task-progress-check1-results"></td>';
                    }else if(status==2){
                        str1='<td  data-check="yes"class="task-progress-check1-results"><i class="iconfont" style="color:#4ec467;">&#xe63e;</i></td>';
                    }
                }
                if(checkStep==2){
                    if(status==0){
                        str2='<td data-check="no" class="task-progress-check2-results"><i class="iconfont" style="color:#ff5c5c">&#xe63d;</i></td>';
                    }else if(status==1){
                        str2='<td data-check="" class="task-progress-check2-results"></td>';
                    }else if(status==2){
                        str2='<td  data-check="yes"class="task-progress-check2-results"><i class="iconfont" style="color:#4ec467;">&#xe63e;</i></td>';
                    }
                }
                if(checkStep==3){
                    if(status==0){
                        str3='<td data-check="no" class="task-progress-check3-results"><i class="iconfont" style="color:#ff5c5c">&#xe63d;</i></td>';
                    }else if(status==1){
                        str3='<td data-check="" class="task-progress-check3-results"></td>';
                    }else if(status==2){
                        str3='<td  data-check="yes"class="task-progress-check3-results"><i class="iconfont" style="color:#4ec467;">&#xe63e;</i></td>';
                    }
                }
            }
            strArr+=str1+str2+str3;
            /*console.log('versionStatus',versionStatus);
            console.log('authoritys',taskBasicInfo.authorityData);*/
            if((parseInt(versionStatus)<=0)&&(taskBasicInfo.authorityData.projectLeader||taskBasicInfo.authorityData.taskLeader||taskBasicInfo.authorityData.manageAllTasks)){
                if((versionStatus==-1)&&(arr[i].progressStatus==1)&&(taskBasicInfo.percent>0)){
                    strArr+='<td></td>';
                }else{
                    strArr+='<td>\
                    <div class="task-progress-check">\
                        <span class="task-progress-edit-btn">编辑</span>\
                        <span class="task-progress-delete-btn">删除</span>\
                    </div>\
                    <div class="task-progress-edit">\
                        <span class="task-progress-save-btn">保存</span>\
                        <span class="task-progress-cancel-btn">取消</span>\
                    </div>\
                </td>';
                }

            }
            strArr+='</tr>';
        }
        $('.task-progress-table tbody').html(strArr);
        //$('#task-progress-new').before(strArr);


        //addNewProgressText();
        //任务卡状态
        //console.log('versionStatus : ',versionStatus);
        if(versionStatus){
            //console.log('list-status---2------',status);
            //data2.projectLeader||data2.taskLeader||data2.manageAllTasks
            //(taskBasicInfo.authorityData.projectLeader||taskBasicInfo.authorityData.taskLeader||taskBasicInfo.authorityData.manageAllTasks)
            console.log('aaaaaaaaaa',taskBasicInfo.authorityData);
            if((versionStatus<=0)&&(taskBasicInfo.authorityData.projectLeader||taskBasicInfo.authorityData.taskLeader||taskBasicInfo.authorityData.manageAllTasks)){
                $('.task-progress-table').find('.task-progress-edit-btn').css('visibility','visible');
                $('.task-progress-table').find('.task-progress-delete-btn').css('visibility','visible');
                $('.task-progress-add-btn').show();
                $('#progressListsOperation').show();
            }else{
                $('.task-progress-table').find('.task-progress-edit-btn').css('visibility','hidden');
                $('.task-progress-table').find('.task-progress-delete-btn').css('visibility','hidden');
                $('.task-progress-add-btn').hide();
                $('#progressListsOperation').hide();
            }
        }
        //taskProgressSetWidth();
        setDateTimeAndInputCheck();
        addNewProgressText(versionStatus);

    }
    //渲染新建进程的文本
    function addNewProgressText(versionStatus){
        if($('#task-progress-new')){
            $('#task-progress-new').remove();
        }
        var newProgressHtml='';
        newProgressHtml+='<tr id="task-progress-new" style="display: none">\
        <td>\
            <div class="task-progress-name task-progress-new" style="display:none;">\
            <input id="task-progress-new-name" type="text">\
            </div>\
        </td>\
        <td>\
            <div class="task-progress-step task-progress-new" style="display:none;">\
            <input  id="task-progress-new-step" type="text">\
            </div>\
        </td>\
        <td>\
            <div class="task-progress-percent task-progress-new" style="display:none;">\
            <input  id="task-progress-new-percent" type="text">\
            </div>\
        </td>\
        <td>\
            <div class="form-group task-progress-plan task-progress-new" style="margin-bottom:0; display:none;">\
            <input id="task-progress-new-startTime" type="text" class="form-control progress_date_time task-progress-timeinput" readonly>\
            </div>\
        </td>\
        <td>\
            <div class="form-group task-progress-plan task-progress-new" style="margin-bottom:0; display:none;">\
                <input id="task-progress-new-planTime" type="text" class="form-control progress_date_time task-progress-timeinput" readonly>\
            </div>\
        </td>\
        <td></td>\
        <td></td>';
        //console.log('------审核人个数-----',checkers_num);
        for(var i=0; i<checkers_num; i++){
            newProgressHtml+='<td></td>';
        }

        newProgressHtml+='<td>\
        <div class="task-progress-new">\
            <span class="task-progress-new-save-btn">保存</span>\
            <span class="task-progress-new-cancel-btn">取消</span>\
            </div>\
        </td>\
        </tr>';

        $('.task-progress-table tbody').append(newProgressHtml);
        //新建
        departmentObj.bindLegalCheck([$("#task-progress-new-name")],'0','-27','');  //名称
        departmentObj.bindLegalCheck([$("#task-progress-new-step")],'0','-27','');  //步骤
        departmentObj.bindLegalCheck([$('#task-progress-new-percent')],'0','-27','number');  //比重
        //时间选择
        $(".progress_date_time").datetimepicker({
            format: "yyyy-mm-dd",
            minView: "month",
            autoclose: true,
            todayBtn: true,
            language:'zh-CN',
            pickerPosition: "top-left"
        });
    }
    //新建进程交互
    function createProgress(data){
        var stored_data=data;
        console.log(data,'1231231');
        $.ajax({
            url: '/api/progress/createProgress',
            type: 'post',
            data:data,
            success: function (data){
                console.log('---创建--进程成功！---------',data);
                stored_data.id=data.list.id;
                renderNewProgress(stored_data);
            },
            error: function(data){
                //projectCommon.quoteUserWarning('#newTaskSave','449px','261px','切换版本失败！');
                console.log(data);
            }
        });
    }
    //新建进程渲染
    function renderNewProgress(data){
        var trString='\
            <td class="task-progress-name-check-wrap">\
                <div class="task-progress-name task-progress-check">\
                    <span class="task-progress-name-check" data-value="'+data.id+'">'+data.name+'</span>\
                </div>\
                <div class="task-progress-name task-progress-edit" style="display: none">\
                    <input class="task-progress-name-edit" data-value="'+data.id+'" type="text">\
                </div>\
            </td>\
            <td>\
                <div class="task-progress-step task-progress-check">\
                    <span  class="task-progress-step-check">'+data.step+'</span>\
                </div>\
                <div class="task-progress-step task-progress-edit" style="display: none">\
                    <input  class="task-progress-step-edit" type="text">\
                </div>\
            </td>\
            <td>\
                <div class="task-progress-percent task-progress-check">\
                    <span class="task-progress-percent-check">'+data.percent+'%</span>\
                </div>\
                <div class="task-progress-percent task-progress-edit" style="display: none">\
                    <input  class="task-progress-percent-edit" type="text">\
                </div>\
            </td>\
            <td>\
                <div class="task-progress-start task-progress-check">\
                    <span class="task-progress-start-check">'+data.startDate+'</span>\
                </div>\
                <div class="form-group task-progress-start task-progress-edit" style="margin-bottom:0; display: none">\
                    <input  type="text" class="form-control progress_date_time task-progress-timeinput task-progress-start-edit" readonly>\
                </div>\
            </td>\
            <td>\
                <div class="task-progress-plan task-progress-check">\
                    <span class="task-progress-plan-check">'+data.predictDate+'</span>\
                </div>\
                <div class="form-group task-progress-plan task-progress-edit" style="margin-bottom:0; display: none">\
                    <input type="text" class="form-control progress_date_time task-progress-timeinput task-progress-plan-edit" readonly>\
                </div>\
            </td>\
            <td class="task-progress-end-check"></td>\
            <td class="task-progress-producer-check">'+(producer?producer:'')+'</td>';

            for(var i=0; i<checkers_num; i++){
                trString+='<td class="task-progress-check'+(i+1)+'-results"></td>';
            }
            trString+='<td>\
                <div class="task-progress-check">\
                    <span class="task-progress-edit-btn">编辑</span>\
                    <span class="task-progress-delete-btn">删除</span>\
                </div>\
                <div class="task-progress-edit">\
                    <span class="task-progress-save-btn">保存</span>\
                    <span class="task-progress-cancel-btn">取消</span>\
                </div>\
            </td>';
        var tr=$('<tr></tr>').html(trString);

        $('#task-progress-new').before(tr);
        $('#task-progress-new').hide();



        setDateTimeAndInputCheck();


    }
    //输入验证和可选日期
    function setDateTimeAndInputCheck(){
        //编辑  输入验证
        departmentObj.bindLegalCheck([$(".task-progress-name-edit")],'0','-27','');  //名称
        departmentObj.bindLegalCheck([$(".task-progress-step-edit")],'0','-27','');  //步骤
        departmentObj.bindLegalCheck([$('.task-progress-percent-edit')],'0','-27','number');  //比重
        //可选日期
        //$('.datetimepicker.datetimepicker-dropdown-top-left.dropdown-menu').remove();
        $(".progress_date_time").datetimepicker({
            format: "yyyy-mm-dd",
            minView: "month",
            autoclose: true,
            todayBtn: true,
            language:'zh-CN',
            pickerPosition: "top-left"
        });
    }
    //引用用户管理的提醒
    function quoteUserWarning(ele,left,top,des){
        var box =$('<div id="m-tip" style="' + userCommon.warnMessage(top,left) +'">'+des+'<div>');
        ele.before(box);
        //console.log(box);
        userCommon.warnMessageRemove(box);
    }


})(jQuery, window);