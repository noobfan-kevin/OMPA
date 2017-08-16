/**
 * Created by hk053 on 2016/7/18.
 */

var noticeLists=function(){
    var offset= 0,datas={},listCount ='',taskTypeRecord=[],curPage=1;
    /*------通知列表-----*/
    function initTab(paramdata){
        $('#myNoticeList').dataTable({
            //延迟加载
            deferRender: true,
            processing: false,
            bRetrieve: true,
            pagingType: "full_numbers",
            pageLength: 10,
            bPaginate: true, //翻页功能
            bLengthChange: false, //改变每页显示数据数量
            bFilter: true, //过滤功能
            //bSort: true, //排序功能

            bInfo: true,//页脚信息
            bAutoWidth: false, //自动宽度
            sPaginationType: "bootstrap",//分页样式
            dom: 'TRlrtip',
            scrollY: true,
            "autoWidth": true,
            "ordering": false,
            "paging": true,
            "searching": false,
            "data": paramdata,
            "columns": [
                {"data": "title", "title": "标题"},
                {"data": "sendName", "title": "发送人"},
                {"data": "time", "title": "发送时间"},
            ],
            oLanguage: {
                //"sLengthMenu": "每页显示 _MENU_条",
                "sZeroRecords": "没有找到符合条件的数据",
                "sInfo": "共 _TOTAL_ 条",
                "sInfoEmpty": "没有记录",
                "sInfoFiltered": "(从 _MAX_ 条记录中过滤)",
                "oPaginate": {
                    "sFirst": '<i class="iconfont">&#xe6a1;</i>',
                    "sPrevious": '<i class="iconfont">&#xe682;</i>',
                    "sNext": '<i class="iconfont">&#xe681;</i>',
                    "sLast": '<i class="iconfont">&#xe6a0;</i>'
                }
            },
            sRowSelect: 'multi',
            "oAria": {
                "sSortAscending": ": 以升序排列此列",
                "sSortDescending": ": 以降序排列此列"
            }
        });
    }
    function init(){
        if(localStorage.getItem('noticeId')){
            $('#notice-content').loadPage('noticeInfo.html');
        }
        initClickEvent();
        offset=0;
        if(localStorage.getItem('noticePage')=='true'){
            curPage=1;
        }
        if(curPage!=1){
            offset=curPage-1;
        }
        datas={offset:offset,userId:localStorage.getItem('userId')};
        myCreateTask.ajaxCommon('get','/api/notice/getNotices',function(data){
            localStorage.removeItem('noticePage');
            if(data!=null){
                initTab(data.array);
                listCount=data.count;
                var page=Math.ceil(data.count/10);
                if(curPage!=1){
                    refreshPage(curPage,page,data.count);
                }else{
                    refreshPage(1,page,data.count);
                }
                clickPageEvent();
            }else{
                myCreateTask.TabShowOrHide('#myNoticeList_wrapper',2);
            }
        },datas);
    }
    function clickPageCommon(){
        var dataLength=taskTypeRecord.length;
        if(dataLength!=0){
            datas.TaskStatus=JSON.stringify(taskTypeRecord);
        }else{
            datas={offset:offset,userId:localStorage.getItem('userId')};
        }
    }
    function clickPageEvent(){
        $('#myNoticeList_paginate').on('click','#myNoticeList_first',function(){
            offset=0;
            datas.offset=0;
            curPage=1;
            clickPageCommon();
            myCreateTask.ajaxCommon('get','/api/notice/getNotices',function(data){
                if(data!=null){
                    myCreateTask.refreshTab('#myNoticeList',data.array);
                    var page=Math.ceil(data.count/10);
                    refreshPage(offset+1,page,data.count);
                }
            },datas);
        });
        $('#myNoticeList_paginate').on('click','#myNoticeList_previous',function(){
            if(curPage>1){
                curPage-=1;
            }else{
                curPage=1;
            }
            var pageNum='';
            if(offset>1){
                datas.offset=offset-1;
                pageNum=offset;
                offset-=1;
            }else if(offset==1){
                offset=offset-1;
                pageNum=1;
            }else{
                offset=0;
                datas.offset=0;
                pageNum=1;
            }
            clickPageCommon();
            myCreateTask.ajaxCommon('get','/api/notice/getNotices',function(data){
                if(offset!=0){
                    offset-=1;
                }
                myCreateTask.refreshTab('#myNoticeList',data.array);
                var page=Math.ceil(data.count/10);
                refreshPage(pageNum,page,data.count);
            },datas);
        });
        $('#myNoticeList_paginate').on('click','#myNoticeList_next',function(){
            curPage+=1;
            offset+=1;
            datas.offset=offset;
            clickPageCommon();
            myCreateTask.ajaxCommon('get','/api/notice/getNotices',function(data){
                if(data!=null){
                    myCreateTask.refreshTab('#myNoticeList',data.array);
                    var page=Math.ceil(data.count/10);
                    refreshPage(offset+1,page,data.count);
                }else{
                    offset-=1;
                }
            },datas);
        });
        $('#myNoticeList_paginate').on('click','#myNoticeList_last',function(){
            offset=Math.floor(listCount/10);
            curPage=offset+1;
            datas.offset=offset;
            clickPageCommon();
            myCreateTask.ajaxCommon('get','/api/notice/getNotices',function(data){
                myCreateTask.refreshTab('#myNoticeList',data.array);
                var page=Math.ceil(data.count/10);
                refreshPage(offset+1,page,data.count);
            },datas);
        });
        $('body').on('click.ompa','#myNotice_pageCount ul li',function(){
            offset=$(this).index();
            curPage=$(this).index();
            datas.offset=offset;
            clickPageCommon();
            myCreateTask.ajaxCommon('get','/api/notice/getNotices',function(data){
                myCreateTask.refreshTab('#myNoticeList',data.array);
                var page=Math.ceil(data.count/10);
                refreshPage(offset+1,page,data.count);
            },datas);
        });

        $('#myNoticeList tbody').on('click','tr td:first-child',function(){
            if(localStorage.getItem('noticeId')){
                $('#notice-content').loadPage('noticeInfo.html');
            }else{
                localStorage.setItem('noticeId',$(this).parent().attr('id'));
                $('#notice-content').loadPage('noticeInfo.html');
            }
        });
    }
    function initClickEvent(){
        $('#createNotice').on('click',function(){
            $('#notice-content').loadPage('notice.create.html');
        });
        $('#notice').on('click',function(){
            noticeCreate.deleteAllFilesForNoticeCreate();
            localStorage.setItem('noticePage','true');
            $('#container').loadPage('noticeList.html');
        });
        /*点击body用户筛选消失*/
        $('body').on('click.ompa',function(){
            $('#taskType_filter').hide();
        });
        $('#myNotice_filter_box').click(function(ev){
            ev.stopPropagation();
        });
        $('#myNotice_filter').on('click',function(){
            var _this=$(this);
            if($('#taskType_filter').css('display')=='none'){
                var _length=taskTypeRecord.length;
                var _taskFilter=$('#myNoticeType_filter li');
                if(_length!=0){
                    for(var i=0;i<_length;i++){
                        for(var j=0;j<_taskFilter.length;j++){
                            if(taskTypeRecord[i]==_taskFilter.eq(j).attr('data-value')){
                                _taskFilter.eq(j).attr('data-check','true');
                                _taskFilter.eq(j).find('i').html('&#xe64b;').css({color: '#6dc484'});
                            }
                        }
                    }
                    _this.find('i').html('&#xe674;').css('color','#f4c600');
                    _this.find('span').eq(0).html("已筛选");
                }else{
                    for(var j=0;j<_taskFilter.length;j++){
                        _taskFilter.eq(j).removeAttr('data-check');
                        _taskFilter.eq(j).find('i').html('&#xe64c;').removeAttr('style');
                    }
                }
                $('#taskType_filter').show();

            }else{
                $('#taskType_filter').hide();
            }
        });
        $('#myNotice_filter_sure').on('click',function(){
            $('#taskType_filter').hide();
            datas.offset=0;
            taskTypeRecord=[];
            $('#myNoticeType_filter li').each(function(){
                if($(this).attr('data-check')){
                    var typeId=$(this).data('value');
                    taskTypeRecord.push(typeId);
                }
            });
            clickPageCommon();
            if(taskTypeRecord.length!=0){
                // datas.TaskStatus=JSON.stringify(taskTypeRecord);
                $('#myCheckTask_filter').find('i').html('&#xe674;').css('color','#f4c600');
                $('#myCheckTask_filter').find('span').eq(0).html("已筛选");
            }else{
                offset=0;
                // datas={offset:offset,userId:localStorage.getItem('userId'),flag:flag};
                $('#myCheckTask_filter').find('i').html('&#xe669;').removeAttr('style');
                $('#myCheckTask_filter').find('span').eq(0).html("未筛选");
            }

            myCreateTask.ajaxCommon('get','/api/notice/getNotices',function(data){
               // localStorage.removeItem('checkFilter');
                if(data!=null){
                    listCount=data.count;
                    myCreateTask.TabShowOrHide('#myNoticeList_wrapper',1);
                    myCreateTask.refreshTab('#myNoticeList',data.array);
                    var page=Math.ceil(data.count/10);
                    refreshPage(datas.offset+1,page,data.count);
                }else{
                    if(taskTypeRecord.length!=0){
                        myCreateTask.TabShowOrHide('#myNoticeList_wrapper',0);
                    }else{
                        myCreateTask.TabShowOrHide('#myNoticeList_wrapper',2);
                    }
                }
            },datas);
        });
        $('#myNoticeType_filter li').on('click','i',function(){
            var _thisParent=$(this).parent();
            var typeId=parseInt($(this).parent().attr('data-value'));
            if(!_thisParent.attr('data-check')){
                _thisParent.attr('data-check','true');
                $(this).html('&#xe64b;').css({color: '#6dc484'});
            }else {
                //var str = $('#myCheckTask_filter').find('span').eq(0).html();
                _thisParent.removeAttr('data-check');
                $(this).html('&#xe64c;').removeAttr('style');
            }
        });
    }
    function refreshPage(num,page,count){
        var str='';
        for(var i=0;i<page;i++){
            str +='<li ><a href="#" style="border: none;padding-left: 21px;padding-right: 21px;height: 20px;">'+(i+1)+'</a></li>';
        }
        var stpm='<div class="dropup" id="myNotice_pageCount">'+
            '<p class="dropdown-toggle"  id="myNoticeListdropdownMenu" data-toggle="dropdown">'+
            num+'/'+page+
            '</p>'+
            '<ul id="myNotice_dropmenu" class="dropdown-menu" style="padding: 0;margin-left: -4%;min-width: 0;max-height: 104px;height:auto;overflow-y: scroll">'+ str+'</ul>'+
            '</div>';
        $('#myNoticeList_paginate span>a').html(stpm);
        $('#myNoticeListdropdownMenu').html(num+'/'+page);
        $('#myNoticeList_info').html('共'+count+'条');
        $(".dataTables_scrollHeadInner").css({'width':'100%','background':'#f2f2f2'});
        $(".dataTables_scrollHeadInner table").css({'width':'100%'});
    }
    /*-----通知列表end--------*/

    /*————通知详情————*/
    function noticeInfoInit(){
        $('#backToNoticeList').on('click',function(){
                $('#container').loadPage('noticeList.html');
        });
        $('body').on('click','.fujian p',function(){ //点击文件名触发下载弹出窗口
            var aDom=$(this);
                homePage.downloadFile.name=aDom.children('span').html().substr(8);
                homePage.downloadFile.path=aDom.attr('data-url');
                $('#downFileHide').attr('nwsaveas',homePage.downloadFile.name).click();
        });
        $('#downFileHide').on('change',function(){ //下载文件
            var file = $(this)[0].value;
            fileDownloader.addItem(homePage.downloadFile.path, file,homePage.downloadFile.name);
            $(this).val('');
        });
        $('.noticeFoot').on('click',function(e){
            var target= e.target;
            if(target.nodeName.toLowerCase()=='p'){
                localStorage.setItem('noticeId',$(target).attr('data-value'));
                $('#notice-content').loadPage('noticeInfo.html');
            }
        });
        myCreateTask.ajaxCommon('get','/api/notice/selectNotice',function(datas){
            myCreateTask.ajaxCommon('get','/api/notice/getUnReadNotices/'+localStorage.getItem('userId'),function(data){
                if(data.count!=0){
                    $('.noticeUnread').show();
                }else{
                    $('.noticeUnread').hide();
                }
            });
            getXiangLinNotice(datas.xianglin);
            noticeXiangXiXinXi(datas.noticeInfo);
            localStorage.removeItem('noticeId');
        },{id:localStorage.getItem('noticeId'),userId:localStorage.getItem('userId')});
    }
    function noticeXiangXiXinXi(data){
        $('#noticeTitle').html(data.noticetitle);
        $('#sendName').html(data.sendUserName).attr('id',data.sendUserId);
        $('#contents').html(data.noticeInfo);
        var DateRi=JSON.stringify(data.created_at).substr(9,2);
        var DateYear=JSON.stringify(data.created_at).substr(1,7);
        $('.notices div:nth-child(1) h4').html(DateRi);
        $('.notices div:nth-child(1) p').html(DateYear);
        var notices=data.NoticeLines;
        if(notices!=null){
            var _length=notices.length;
            var str='';
            for(var i=0;i<_length;i++){
                if(notices[i].File!=null){
                    str+=' <p data-url="'+configInfo.server_url+'/'+ notices[i].File.name+'" data-name="'+ notices[i].File.originalName+'"><span>'+ (i+1)+'.&nbsp;'+notices[i].File.originalName+'</span></p>'
                }
            }
            $('.fujian').append(str);
        }
        $('.noticeContent').show();
        //$(".fujian").is(":empty")==true
        if(str==''){
            $('#fujianWenZi').hide();
        }else{
            $('#fujianWenZi').show();
        }
    }
    function getXiangLinNotice(data){
        if(data.upNotice){
            $('.noticeFoot div:nth-child(1) p').html('上一条：'+data.upNotice.title).attr('data-value',data.upNotice.id);
            $('.noticeFoot div:nth-child(1)  span').html(data.upNotice.time);
        }
        if(data.downNotice){
            $('.noticeFoot div:nth-child(2) p').html('下一条：'+data.downNotice.title).attr('data-value',data.downNotice.id);
            $('.noticeFoot div:nth-child(2)  span').html(data.downNotice.time);
        }

    }

    /**------通知详情end-----*/
    return {
        init:init,
        noticeInit:noticeInfoInit,
        noticeXiangXiXinXi:noticeXiangXiXinXi
    }
}();