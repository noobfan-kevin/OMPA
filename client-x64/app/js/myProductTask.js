/**
 * Created by hk053 on 2016/6/6.
 */
var myProductTask=function(){
    var offset= 0,datas={},listCount ='',taskTypeRecord=[],curPage=1;
    function  initTab(data){
        myCreateTask.tabinit('#productTaskList',data);
    }
    function init(flag){
        offset=0; taskTypeRecord=[];
        initClickEvent();
        if(localStorage.getItem('pageInit')=='true'){
            curPage=1;
        }
        if(curPage!=1){
            offset=curPage-1;
        }
        localStorage.setItem('pageType','myProductTask');
        datas={offset:offset,userId:localStorage.getItem('userId'),flag:flag};
        myCreateTask.ajaxCommon('get','/api/taskCard/selectTasks',function(data){
            localStorage.removeItem('pageInit');
            if(data.list!=null){
                initTab(data.list);
                clickPageEvent(flag);
                if(curPage!=1){
                    refreshPage(curPage,data.page,data.count);
                }else{
                    refreshPage(1,data.page,data.count);
                }
                if(localStorage.getItem('productFilter')){
                    homePage.filterTask('product');
                }
            }else{
                myCreateTask.TabShowOrHide('#productTaskList_wrapper',2);
            }
        },datas);
    }
    function clickPageCommon(flag){
        var dataLength=taskTypeRecord.length;
        if(dataLength!=0){
            datas.TaskStatus=JSON.stringify(taskTypeRecord);
        }else{
            datas={offset:offset,userId:localStorage.getItem('userId'),flag:flag};
        }
    }
    function clickPageEvent(flag){
        $('#productTaskList_paginate').on('click','#productTaskList_first',function(){
            offset=0;
            datas.offset=0;
            curPage=1;
            clickPageCommon(flag);
            myCreateTask.ajaxCommon('get','/api/taskCard/selectTasks',function(data){
                if(data.list!=null){
                    myCreateTask.refreshTab('#productTaskList',data.list);
                    refreshPage( offset+1,data.page,data.count);
                }
            },datas);
        });
        $('#productTaskList_paginate').on('click','##productTaskList_previous',function(){
            var pageNum='';
            if(curPage>1){
                curPage-=1;
            }else{
                curPage=1;
            }
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
            clickPageCommon(flag);
            myCreateTask.ajaxCommon('get','/api/taskCard/selectTasks',function(data){
                if(offset!=0){
                    offset-=1;
                }
                myCreateTask.refreshTab('#productTaskList',data.list);
                refreshPage(pageNum,data.page,data.count);
            },datas);
        });
        $('#productTaskList_paginate').on('click','#productTaskList_next',function(){
            offset+=1;
            curPage+=1;
            datas.offset=offset;
            clickPageCommon(flag);
            myCreateTask.ajaxCommon('get','/api/taskCard/selectTasks',function(data){
                if(data.list!=null){
                    myCreateTask.refreshTab('#productTaskList',data.list);
                    refreshPage(offset+1,data.page,data.count);
                }else{
                    offset-=1;
                }
            },datas);
        });
        $('#productTaskList_paginate').on('click','#productTaskList_last',function(){
            offset=Math.floor(listCount/10);
            curPage=offset+1;
            datas.offset=offset;
            clickPageCommon(flag);
            myCreateTask.ajaxCommon('get','/api/taskCard/selectTasks',function(data){
                myCreateTask.refreshTab('#productTaskList',data.list);
                refreshPage( offset+1,data.page,data.count);
            },datas);
        });
        $('body').on('click.ompa','#myProductTask_pageCount ul li',function(){
            offset=$(this).index();
            curPage=$(this).index();
            datas.offset=offset;
            clickPageCommon(flag);
            myCreateTask.ajaxCommon('get','/api/taskCard/selectTasks',function(data){
                myCreateTask.refreshTab('#productTaskList',data.list);
                refreshPage( offset+1,data.page,data.count);
            },datas);
        });

        $('#productTaskList tbody').on('click','tr td:first-child',function(){
            localStorage.setItem('thisTaskVersionId',$(this).parent().attr('id'));
            $('#myTask-content').loadPage('taskCard.edit.html');
        });
    }
    function refreshPage(num,page,count){
        var str='';
        for(var i=0;i<page;i++){
            str +='<li ><a href="#" style="border: none;padding-left: 21px;padding-right: 21px;height: 20px;">'+(i+1)+'</a></li>';
        }
        var stpm='<div class="dropup" id="myProductTask_pageCount">'+
            '<p class="dropdown-toggle"  id="myProductTaskdropdownMenu" data-toggle="dropdown">'+
            num+'/'+page +
            '</p>'+
            '<ul  id="myProductTask_dropmenu" class="dropdown-menu" style="padding: 0;margin-left: -4%;min-width: 0;max-height: 104px;height:auto;overflow-y: scroll">'+ str+'</ul>'+
            '</div>';
        $('#productTaskList_paginate span>a').html(stpm);
        $('#myProductTaskdropdownMenu').html(num+'/'+page);
        $('#productTaskList_info').html('共'+count+'条');
        $(".dataTables_scrollHeadInner").css({'width':'100%','background':'#f2f2f2'});
        $(".dataTables_scrollHeadInner table").css({'width':'100%'});
    }
    function initClickEvent(flag){
        /*点击body用户筛选消失*/
        $('body').on('click.ompa',function(){
            $('#taskType_filter').hide();
            $('#myProductTask_filter').css({
                'border-radius':'4px',
                'border':'1px solid #ccc'
            })
        });
        $('#myProductTask_filter_box').click(function(ev){
            ev.stopPropagation();
        });
        $('#myProductTask_filter').on('click',function(){
            var _this=$(this);
            if($('#taskType_filter').css('display')=='none'){
                var _length=taskTypeRecord.length;
                var _taskFilter=$('#myProductTaskType_filter li');
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
                $('#myProductTask_filter').css({
                    'border-radius':'4px 4px 0 0',
                    'border-bottom':'none'
                })
            }else{
                $('#taskType_filter').hide();
                $('#myProductTask_filter').css({
                    'border-radius':'4px',
                    'border':'1px solid #ccc'
                })
            }
        });
        $('#myProductTask_filter_sure').on('click',function(){
            $('#taskType_filter').hide();
            $('#myProductTask_filter').css({
                'border-radius':'4px',
                'border':'1px solid #ccc'
            })
            datas.offset=0;
            taskTypeRecord=[];
            $('#myProductTaskType_filter li').each(function(){
                if($(this).attr('data-check')){
                    var typeId=$(this).data('value');
                    taskTypeRecord.push(typeId);
                }
            });
            clickPageCommon('product');
            if(taskTypeRecord.length!=0){
               // datas.TaskStatus=JSON.stringify(taskTypeRecord);
                $('#myProductTask_filter').find('i').html('&#xe674;').css('color','#f4c600');
                $('#myProductTask_filter').find('span').eq(0).html("已筛选");
            }else{
                offset=0;
               // datas={offset:offset,userId:localStorage.getItem('userId'),flag:'product'};
                $('#myProductTask_filter').find('i').html('&#xe669;').removeAttr('style');
                $('#myProductTask_filter').find('span').eq(0).html("未筛选");
            }
            myCreateTask.ajaxCommon('get','/api/taskCard/selectTasks',function(data){
                localStorage.removeItem('productFilter');
                if(data.list!=null){
                    listCount=data.count;
                    myCreateTask.TabShowOrHide('#productTaskList_wrapper',1);
                    myCreateTask.refreshTab('#productTaskList',data.list);
                    refreshPage( datas.offset+1,data.page,data.count);
                }else{
                    if(taskTypeRecord.length!=0){
                        myCreateTask.TabShowOrHide('#productTaskList_wrapper',0);
                    }else{
                        myCreateTask.TabShowOrHide('#productTaskList_wrapper',2);
                    }
                }
            },datas);
        });
        /*$('#myProductTaskType_filter li').on('click','i',function(){
            var _thisParent=$(this).parent();
            var typeId=parseInt($(this).parent().attr('data-value'));
            if(!_thisParent.attr('data-check')){
                _thisParent.attr('data-check','true');
                $(this).html('&#xe64b;').css({color: '#6dc484'});
            }else {
                var str = $('#myProductTask_filter').find('span').eq(0).html();
                _thisParent.removeAttr('data-check');
                $(this).html('&#xe64c;').removeAttr('style');
            }
        });*/
        $('#myProductTaskType_filter li').on('click',function(){
            var li=$(this);
            var typeId=parseInt(li.attr('data-value'));
            if(!li.attr('data-check')){
                li.attr('data-check','true');
                li.find('i').html('&#xe64b;').css({color: '#6dc484'});
            }else {
                var str = $('#myCreateTask_filter').find('span').eq(0).html();
                li.removeAttr('data-check');
                li.find('i').html('&#xe64c;').removeAttr('style');
            }
        });
    }
    return {
        init:init,
        offset:offset,
        taskTypeRecord:taskTypeRecord,
        refreshPage:refreshPage,
        clickPageEvent:clickPageEvent
    }
}();
