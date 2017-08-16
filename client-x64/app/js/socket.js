/**
 * Created by hk053 on 2016/6/27.
 */

var socketCommon=function(){
    var socket=null;
    var singleSocket=null;
    var countNotices=0;
    //获取socket
    function getSocket(socketUrl){
        if(!singleSocket){
            socket=singleSocket=socketConnect(socketUrl);
        }
        return singleSocket;
        function socketConnect(url){
            var socketConnect = io.connect(url,{'reconnection': true });
            return socketConnect;
        }
       }
    function socketEvent(){
        socket=getSocket(configInfo.server_url);
        //退回
        socket.on('createTaskFinish',function(data){
            console.log('66666',data);
            if(data.createUserId&&(data.createUserId==localStorage.getItem('userId'))){
                taskBasicInfo.countAllOfMyTaskUnread();
                //刷新 由我创建
                var datas={offset:0,userId:localStorage.getItem('userId')};
                if(localStorage.getItem('pageType')=='myCreateTask'){
                    datas.flag='create';
                    if((!$('#createTaskList_wrapper').css('display'))||($('#createTaskList_wrapper').css('display')=='none')){
                        myCreateTask.ajaxCommon('get','/api/taskCard/selectTasks',function(data){
                            myCreateTask.tabinit('#createTaskList',data.list);
                            myCreateTask.clickPageEvent(datas.flag);
                            myCreateTask.refreshPage(1,data.page,data.count);
                            myCreateTask.TabShowOrHide('#createTaskList_wrapper',1);
                        },datas);
                    }else{
                        myCreateTask.ajaxCommon('get','/api/taskCard/selectTasks',function(data){
                            //console.log('yyyyyyy',data);
                            myCreateTask.refreshTab('#createTaskList',data.list);
                            myCreateTask.refreshPage(1,data.page,data.count);
                        },datas);
                    }
                }
            }
        });
        //制卡
        socket.on('sendTaskFinish',function(data){
            if(data.sendUserId&&(data.sendUserId==localStorage.getItem('userId'))){
                taskBasicInfo.countAllOfMyTaskUnread();
                //刷新 由我发送
                var datas={offset:0,userId:localStorage.getItem('userId')};
                if(localStorage.getItem('pageType')=='mySendTask'){
                    datas.flag='send';
                    if((!$('#sendTaskList_wrapper').css('display'))||($('#sendTaskList_wrapper').css('display')=='none')){
                        myCreateTask.ajaxCommon('get','/api/taskCard/getSenderTasks',function(data){
                            myCreateTask.tabinit('#sendTaskList',data.list);
                            mySendTask.clickPageEvent(datas.flag);
                            mySendTask.refreshPage(1,data.page,data.count);
                            myCreateTask.TabShowOrHide('#sendTaskList_wrapper',1);
                        },datas);
                    }else{
                        myCreateTask.ajaxCommon('get','/api/taskCard/getSenderTasks',function(data){
                            //console.log('yyyyyyy',data);
                            myCreateTask.refreshTab('#sendTaskList',data.list);
                            mySendTask.refreshPage(1,data.page,data.count);
                        },datas);
                    }
                }
            }
        });
        //派发
        socket.on('productTaskFinish',function(data){
            if(data.productorUserId&&(data.productorUserId==localStorage.getItem('userId'))){
                taskBasicInfo.countAllOfMyTaskUnread();
                //刷新 由我制作
                var datas={offset:0,userId:localStorage.getItem('userId')};
                if(localStorage.getItem('pageType')=='myProductTask'){
                    datas.flag='product';
                    if((!$('#productTaskList_wrapper').css('display'))||($('#productTaskList_wrapper').css('display')=='none')){
                        myCreateTask.ajaxCommon('get','/api/taskCard/selectTasks',function(data){
                            myCreateTask.tabinit('#productTaskList',data.list);
                            myProductTask.clickPageEvent(datas.flag);
                            myProductTask.refreshPage(1,data.page,data.count);
                            myCreateTask.TabShowOrHide('#productTaskList_wrapper',1);
                        },datas);
                    }else{
                        myCreateTask.ajaxCommon('get','/api/taskCard/selectTasks',function(data){
                            //console.log('yyyyyyy',data);
                            myCreateTask.refreshTab('#productTaskList',data.list);
                            myProductTask.refreshPage(1,data.page,data.count);
                        },datas);
                    }
                }

            }
        });
        //提交&审核
        socket.on('checkTaskFinish',function(data){
            if(data.checkUserId&&(data.checkUserId==localStorage.getItem('userId'))){
                taskBasicInfo.countAllOfMyTaskUnread();
                //刷新 由我审核
                var datas={offset:0,userId:localStorage.getItem('userId')};
                if(localStorage.getItem('pageType')=='myCheckTask'){
                    datas.flag='check';
                    if((!$('#checkTaskList_wrapper').css('display'))||($('#checkTaskList_wrapper').css('display')=='none')){
                        myCreateTask.ajaxCommon('get','/api/taskCard/getCheckerTasks',function(data){
                            myCreateTask.tabinit('#checkTaskList',data.list);
                            myCheckTask.clickPageEvent(datas.flag);
                            myCheckTask.refreshPage(1,data.page,data.count);
                            myCreateTask.TabShowOrHide('#checkTaskList_wrapper',1);
                        },datas);
                    }else{
                        myCreateTask.ajaxCommon('get','/api/taskCard/getCheckerTasks',function(data){
                            console.log('yyyyyyy',data);
                            myCreateTask.refreshTab('#checkTaskList',data.list);
                            myCheckTask.refreshPage(1,data.page,data.count);
                        },datas);
                    }
                }
            }
            if(data.productorId&&(data.productorId==localStorage.getItem('userId'))){
                taskBasicInfo.countAllOfMyTaskUnread();
                //刷新 由我制作
                var datas={offset:0,userId:localStorage.getItem('userId')};
                if(localStorage.getItem('pageType')=='myProductTask'){
                    datas.flag='product';
                    if((!$('#productTaskList_wrapper').css('display'))||($('#productTaskList_wrapper').css('display')=='none')){
                        myCreateTask.ajaxCommon('get','/api/taskCard/selectTasks',function(data){
                            myCreateTask.tabinit('#productTaskList',data.list);
                            myProductTask.clickPageEvent(datas.flag);
                            myProductTask.refreshPage(1,data.page,data.count);
                            myCreateTask.TabShowOrHide('#productTaskList_wrapper',1);
                        },datas);
                    }else{
                        myCreateTask.ajaxCommon('get','/api/taskCard/selectTasks',function(data){
                            if(data.list!=null){
                                myCreateTask.refreshTab('#productTaskList',data.list);
                                myProductTask.refreshPage(1,data.page,data.count);
                            }
                        },datas);
                    }

                }
            }
            //console.log('dddd',localStorage.getItem('userId'));
            //console.log('88888888',data);
        });

        //接收通知
        socket.on('receiveNotice',function(dbs){
             var userId=localStorage.getItem('userId');
             var str=dbs.indexOf(userId);
             if(str!=-1){
                myCreateTask.ajaxCommon('get','/api/notice/getUnReadNotices/'+localStorage.getItem('userId'),function(data){
                    console.log('hhhhh',data);
                     countNotices=data.count;
                    if(countNotices!=0){
                        $('.noticeUnread').show();
                        $('.informEntryCount').html(countNotices);
                        $('.informEntryCount').show();
                    }else{
                        $('.noticeUnread').hide();
                        $('.informEntryCount').hide();
                    }
                });
             }
        });


        /* ===== 合同 ==== */
        socket.on('updateContractList', function() {
            var $rootEle = $('#myContractApp');
            var $listEle = $('#myContractList');

            if( $listEle.length){
                $rootEle.scope().filterData();
            }

            if( $rootEle.length ){
                var $scope = $rootEle.scope();
                
                FUNC.getCurUserUnreadInfo(function (num, showFlag) {
                    $scope.$apply(function () {
                        $scope.senderDot = num;
                    });
                    showFlag(num);
                }, function (num, showFlag) {
                    $scope.$apply(function () {
                        $scope.payDot = num;
                    });
                    showFlag(num);
                }, function (num, showFlag) {
                    $scope.$apply(function () {
                        $scope.signDot = num;
                    });
                    showFlag(num);
                })
            }else{
                FUNC.getCurUserUnreadInfo();
            }
            
        })
    }
    //向后台发送数据
    function socketEmit(){
        return {
            getCreateUnReadTask: function(versionId){//退回（versionID）
                socket.emit('createTask',{userId:localStorage.getItem('userId'),unRead:true,versionId:versionId});//任务卡制卡完成
            },
            getSendUnReadTask: function(versionId){//制卡完成
                socket.emit('sendTask',{userId:localStorage.getItem('userId'),unRead:true,versionId:versionId});//由我发送
            },
            getProductUnReadTask: function(versionId){//派发
                socket.emit('productTask',{userId:localStorage.getItem('userId'),unRead:true,versionId:versionId});//由我制作
            },
            getCheckUnReadTask: function(versionId,progressId,status){ //提交（versionID）、审核（progressID）
                socket.emit('checkTask',{userId:localStorage.getItem('userId'),unRead:true,versionId:versionId,progressId:progressId});//由我审核
            },
            sendNotice:function(depart){
                socket.emit('createNotice',{departId:depart});
            }
        }
    }
    return {
        init:socketEvent,
        getSocket:getSocket,
        emit:socketEmit,
        countNotices:countNotices
    }
}();

