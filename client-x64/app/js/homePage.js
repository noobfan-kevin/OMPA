/**
 * Created by hk054 on 2016/7/4.
 */
(function($,global){
global.homePage={
    init:init,
    downloadFile:{
        name:'',
        path:''
    },
    pageCount:-1,
    noticeCount:-1,
    pageNow:false,
    noticePageNow:false,
    filterTask:filterTask

}
//获取代办事项
function getNeedWorkNum(){
    var userId=localStorage.getItem('userId');
    $.ajax({
        type:'get',
        url:'/api/taskCard/getToDealtTaskCount/'+userId,
        success:function(data){
            console.log('--------待办---task+contract------',data);
            //刷新内容
            var createTask = data.createCount?data.createCount.count:0,
                sendTask = data.sendCount?data.sendCount.count:0,
                productTask = data.productCount?data.productCount.count:0,
                checkTask = data.checkCount?data.checkCount.count:0,

                sendContract =data.contractCount.sendContract,
                payContract = data.contractCount.payContract,
                signContract = data.contractCount.signContract,
                appointContract = data.contractCount.assignPayContract,
                sureContract = data.contractCount.sureContract;

            //console.log('productTask',productTask);
            //console.log('checkTask',checkTask);
            var taskAll= createTask+sendTask+productTask+checkTask,
                contractAll = sendContract+payContract+signContract+appointContract+sureContract,
                workAll=taskAll+contractAll;
            if(workAll==0){
                $('#homePageWorkToDo').hide();
                $('#homePageWorkNone').show();
            }else{
                $('#homePageWorkToDo').show();
                $('#homePageWorkNone').hide();
                if(taskAll==0){
                    $('#taskCount').hide();
                }else{
                    $('#taskCount').show();
                    if(createTask==0){
                        $('#taskCreateWork').hide();
                    }else{
                        $('#taskCreateWork').show().find('span').html(createTask);
                    }
                    if(sendTask==0){
                        $('#taskSendWork').hide();
                    }else{
                        $('#taskSendWork').show().find('span').html(sendTask);
                    }
                    if(productTask==0){
                        $('#taskProductWork').hide();
                    }else{
                        $('#taskProductWork').show().find('span').html(productTask);
                    }
                    if(checkTask==0){
                        $('#taskCheckWork').hide();
                    }else{
                        $('#taskCheckWork').show().find('span').html(checkTask);
                    }
                }
                if(contractAll==0){
                    $('#contractCount').hide();
                }else{
                    $('#contractCount').show();
                    if(sendContract==0){
                        $('#contractSendWork').hide();
                    }else{
                        $('#contractSendWork').show().find('span').html(sendContract);
                    }
                    if(payContract==0){
                        $('#contractPayWork').hide();
                    }else{
                        $('#contractPayWork').show().find('span').html(payContract);
                    }
                    if(signContract==0){
                        $('#contractSignWork').hide();
                    }else{
                        $('#contractSignWork').show().find('span').html(signContract);
                    }
                    if(appointContract==0){
                        $('#contractAppointWork').hide();
                    }else{
                        $('#contractAppointWork').show().find('span').html(appointContract);
                    }
                    if(sureContract==0){
                        $('#contractSureWork').hide();
                    }else{
                        $('#contractSureWork').show().find('span').html(sureContract);
                    }
                }
            }

        },
        error:function(err){
            console.log(err);
        }
    });
}
//获取第n页的动态
function getWorkByPage(){
    if(homePage.pageNow){//没有更多动态了
        return;
    }
    homePage.pageCount++;
    console.log('homePage.pageCount',homePage.pageCount);
    $.ajax({
        url: '/api/log/getDynamics',
        type: 'get',
        data:{
            userId:localStorage.getItem('userId'),
            offset:homePage.pageCount
        },
        success: function (data){
            console.log('--工作动态----第'+(homePage.pageCount+1)+'页数据为---------------------------',data);
            if(data&&data.logs.length<10){
                homePage.pageNow=true;
                $('.homePageWorkMore').hide();
            }
            if(data&&data.logs.length>0){
                var list=data.logs;
                var Allstr=''
                for(var i=0; i<list.length; i++){
                    var str='';
                    if(list[i].description.indexOf('\r\n')!=-1){
                        var arr=list[i].description.split('\r\n');
                        var des='';
                        for(var j=0; j<arr.length; j++){
                            des+='<p>'+arr[j]+'</p>'
                        }
                    }
                    str+='<li>\
                        <img src="'+configInfo.server_url+'/'+list[i].image+'" alt="" style="float:left;">\
                        <div class="homePageItemNew">\
                            <div class="homePageItemNewTitle">\
                                <span class="WorkNewSenderName">'+list[i].userName+'</span>\
                            </div>\
                            <div class="homePageItemNewContent">';
                    str+=(des&&(des!=''))?des:('<p>'+list[i].description+'</p>');
                    str+= '</div>\
                            <div class="homePageItemNewdate">\
                                <span class="WorkNewDayTime">'+list[i].time+'</span>\
                            </div>\
                            <div class="homePageItemNewTalk"></div>\
                        </div>\
                    </li>';
                    //console.log(i+'\r\n',str);
                    des='';
                    Allstr+=str;
                }
                $('.homePageWorkNewsLists').append(Allstr);
                //console.log('children',$('.homePageWorkNewsLists').children().length);
            }else{
                $('.homePageWorkMore').hide();
                if(homePage.pageCount==0){
                    $('.homePageWorkNoOne').show();
                }
                homePage.pageCount--;

            }


        },
        error: function(data){
            //警告！
            //projectCommon.quoteUserWarning('#taskProgressSubmitBtn','633px','280px','刷新失败！');
            console.log(data);
        }
    });
}
//获取第n页的通知
function getNoticeByPage(){
        if(homePage.noticePageNow){ //没有更多通知了
            return;
        }
        homePage.noticeCount++;
        console.log('homePage.noticeCount',homePage.noticeCount);
        var data={offset:homePage.noticeCount,userId:localStorage.getItem('userId')};
        myCreateTask.ajaxCommon('get','/api/notice/getNotices',function(data){
            if(data!=null){
                console.log('----通知--第'+homePage.noticeCount+'页----',data);
                if(data&&data.array.length<10){
                    homePage.noticePageNow=true;
                }
                if(data&&data.array.length>0){
                    var str='';
                    for(var i=0; i<data.array.length; i++){
                        var liClass='';
                        var index=data.array[i].title.indexOf('</i>');
                        console.log('index',index);
                        if(index!=-1){  //未读的
                            liClass='homePageInformUnread';
                        }else{//已读的
                            liClass='homePageInformRead';
                        }
                        str+='<li data-value="'+data.array[i].DT_RowId+'" class="'+liClass+'">\
                                <p><span>'+data.array[i].titleMain+'</span></p>';
                        var arrP=data.array[i].time.split('</p>');
                        var contentP=arrP[0]+'</p>&nbsp;'+arrP[1];
                        str+='<div>'+contentP+'</div>\
                            </li>';
                    }
                    $('.homePageInformLists').append(str);
                }

            }else{ //没有数据
                if(homePage.noticePageNow==0){
                    $('#homePageNoNotice').show();
                }
                homePage.noticePageNow--;
            }
        },data);
    }
/*跳到我的任务下  ->jumpToTask('myCreateTask');
 jumpToTask('mySendTask');
 jumpToTask('myProductTask');
 jumpToTask('myCheckTask');*/
function filterTask(flag){
    if(flag=='create'){
        $('#myCreateTask').addClass('current');
        //-1,0 已退回，待制卡
        var lists=$('#myCreateTaskType_filter li');
        lists.eq(0).attr('data-check',true).find('i').html('&#xe64b;').css({color: '#6dc484'});
        lists.eq(1).attr('data-check',true).find('i').html('&#xe64b;').css({color: '#6dc484'});
        myCreateTask.taskTypeRecord=[-1,0];
        $('#myCreateTask_filter_sure').click();

    }else if(flag=='send'){
        $('#mySendTask').addClass('current');
        //1 未派发
        var lists=$('#mySendTaskType_filter li');
        lists.eq(0).attr('data-check',true).find('i').html('&#xe64b;').css({color: '#6dc484'});
        mySendTask.taskTypeRecord=[1];
        $('#mySendTask_filter_sure').click();

    }else if(flag=='product'){
        $('#myProductTask').addClass('current');
        //2,4 制作中，审核完成
        var lists=$('#myProductTaskType_filter li');
        lists.eq(0).attr('data-check',true).find('i').html('&#xe64b;').css({color: '#6dc484'});
        lists.eq(2).attr('data-check',true).find('i').html('&#xe64b;').css({color: '#6dc484'});
        myProductTask.taskTypeRecord=[2,4];
        $('#myProductTask_filter_sure').click();

    }else if(flag=='check'){
        $('#myCheckTask').addClass('current');
        //3 审核中
        var lists=$('#myCheckTaskType_filter li');
        lists.eq(0).attr('data-check',true).find('i').html('&#xe64b;').css({color: '#6dc484'}); //
        myCheckTask.taskTypeRecord=[3];
        $('#myCheckTask_filter_sure').click();
    }
}
function jumpToTask(flag){
    if(flag=='myCreateTask'){
        localStorage.setItem('createFilter',true);
        $('#myTask').click();
        $('#myCreateTask').removeClass('current');
    }else{
        $('#myTask').click();
        $('#myCreateTask').removeClass('current');
        switch(flag){
            case 'mySendTask':
                localStorage.setItem('sendFilter',true);
                $('#myTask-content').loadPage('mySendTask.html');
                break;
            case 'myProductTask':
                localStorage.setItem('productFilter',true);
                $('#myTask-content').loadPage('myProductTask.html');
                break;
            case 'myCheckTask':
                localStorage.setItem('checkFilter',true);
                $('#myTask-content').loadPage('myCheckTask.html');
                break;
        }
    }


}
/*跳到我的合同下  -> jumpToContract('mySendContract');
 jumpToContract('myPayContract');
 jumpToContract('mySignContract');*/
function jumpToContract(flag,type){
    //1、跳到我的合同下
    var $contractApp = null;
    $('#homePage').removeClass('current');
    $('#myContract').addClass('current');
    $('#container').loadPage('myContract');
    $contractApp = $('#myContractApp');
    $contractApp.injector().get('$state').go('main');

    $('#mySendContract').removeClass('current');
    switch(flag){
        case 'mySendContract':
            //未发送、已退回（1,3）
            $contractApp.scope().filterType = 'send';
            if(type=='send'){ //待发送
                $contractApp.scope().statusCode = [1,3];
            }
            if(type=='appoint'){ //待指派
                //进行中(4)&&(支付进度为0 \\ 任务进度大于支付进度)
                $contractApp.scope().statusCode = [4];
            }
            $('#mySendContract').addClass('current');
            break;
        case 'myPayContract':
            //待支付（5）
            $contractApp.scope().statusCode = [5];
            $contractApp.scope().filterType = 'pay';
            $('#myPayContract').addClass('current');
            break;
        case 'mySignContract':
            $contractApp.scope().filterType = 'sign';
            if(type=='sign'){ //已发送（2）
                $contractApp.scope().statusCode = [2];
            }else if(type=='sure'){ //已支付（7）
                $contractApp.scope().statusCode = [7];
            }
            $('#mySignContract').addClass('current');
            break;
    }
    $contractApp.scope().$apply();
    $contractApp.scope().sureFilter();
}
function init(){
    homePage.pageNow=false;
    homePage.pageCount=-1;
    homePage.noticePageNow=false;
    homePage.noticeCount=-1;
    getNeedWorkNum();
    getWorkByPage();
    getNoticeByPage();
    //是否只显示未读（？）
    /*$('#WorkNewsFilterFlag').on('click',function(){
        var filter=$('#WorkNewsFilter');
        if(filter.hasClass('WorkNewOnlyUnread')){
            filter.attr('class','iconfont WorkNewOnlyAll').html('&#xe64b;');
            /!*只显示未读*!/
        }else{
            filter.attr('class','iconfont WorkNewOnlyUnread').html('&#xe64c;');
            /!*显示全部 默认*!/
        }
    });*/
    /*document.getElementById('homePageScroll').onscroll=function(){

    };*/
    myCreateTask.ajaxCommon('get','/api/notice/getUnReadNotices/'+localStorage.getItem('userId'),function(data){
        console.log('hhhhhh',data);
        if(data.count!=0){
            $('.informEntryCount').html(data.count);
            $('.informEntryCount').show();
            $('.noticeUnread').show();
        }
    });
    //点击进入通知列表
    $('#informPort').on('click',function(){
        $('#container').loadPage('noticeList.html');
    });
    //更多
    $('.homePageWorkMore').on('click',function(){
        getWorkByPage();
    });
    //动态滚动时
    $('#homePageScroll').on('scroll',function(){
        var that=$(this);
        var top=that.scrollTop();
        var height=that.innerHeight();
        var realHeight=$('#homePageScrollWrap').outerHeight()+10;
        //console.log('h-left: ',top+height,'h-right: ',realHeight);
        if((top+height)>realHeight-10){ //离底部10px
            var nowHeight=$('.homePageWorkNewsLists').outerHeight();
            //getWorkByPage()
            //高10px
            //$('.homePageWorkNewsLists').css('height',nowHeight+10+'px');
        }
    });
    $('.WorkNewDoc').each(function(i,e){ //点击文件名触发下载弹出窗口
        var aDom=$(this);
        aDom.on('click',function(){
            //jumpToContract('myPayContract')
            homePage.downloadFile.name=aDom.html();
            homePage.downloadFile.path=aDom.attr('data-src');
            $('#WorkNewsDownload').attr('nwsaveas',homePage.downloadFile.name).click();
        });
    });
    $('#WorkNewsDownload').on('change',function(){ //下载文件
        var file = $(this)[0].value;
        fileDownloader.addItem(homePage.downloadFile.path, file,homePage.downloadFile.name);
        $(this).val('');
    });
    //点击进入某个通知
    $('.homePageInformLists').on('click','li',function(){
        console.log($(this));
        localStorage.setItem('noticeId',$(this).attr('data-value'));
        $('#container').loadPage('noticeList.html');
    });
    //通知滚动时
    $('#homePageScroll').on('scroll',function(){
        var that=$(this);
        var top=that.scrollTop();
        var height=that.innerHeight();
        var realHeight=$('#homePageScrollWrap').outerHeight()+10;
        //console.log('h-left: ',top+height,'h-right: ',realHeight);
        if((top+height)>realHeight-10){ //离底部10px
            var nowHeight=$('.homePageWorkNewsLists').outerHeight();
            //高10px
            //$('.homePageWorkNewsLists').css('height',nowHeight+10+'px');
        }
    });
    //任务
    //制卡
    $('#taskCreateWork').on('click',function(){
        jumpToTask('myCreateTask');
    });
    //发送
    $('#taskSendWork').on('click',function(){
        jumpToTask('mySendTask');
    });
    //制作
    $('#taskProductWork').on('click',function(){
        jumpToTask('myProductTask');
    });
    //审核
    $('#taskCheckWork').on('click',function(){
        jumpToTask('myCheckTask');
    });
    //合同
    //发送
    $('#contractSendWork').on('click',function(){
        jumpToContract('mySendContract','send');
    });
    //指派
    $('#contractAppointWork').on('click',function(){
        jumpToContract('mySendContract','appoint');
    });
    //支付
    $('#contractPayWork').on('click',function(){
        jumpToContract('myPayContract');
    });
    //签约
    $('#contractSignWork').on('click',function(){
        jumpToContract('mySignContract','sign');
    });
    //确认
    $('#contractSureWork').on('click',function(){
        jumpToContract('mySignContract','sure');
    });

}

})(jQuery,window);
