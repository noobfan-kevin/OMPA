/**
 * Created by hk053 on 2016/5/11.
 */

var myCreateTask= {
    offset:0,
     datas:{},
    listCount:'',
    taskTypeRecord:[],
    curPage:1,
   tabinit:function(tableId,paramdata) {
       $(tableId).dataTable({
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
               {"data": "name", "title": "任务名称"},
               {"data": "version", "title": "版本号"},
               {"data": "type", "title": "任务卡类型"},
               {"data": "startDate", "title": "开始时间"},
               {"data": "planDate", "title": "预计时间"},
               {"data": "percent", "title": "完成进度"},
               {"data": "status", "title": "状态"},
               {"data": "productor", "title": "制作人"}
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
   },
    init:function(flag){
        myCreateTask.initClickEvent(flag);
        localStorage.setItem('pageType','myCreateTask');
        if(localStorage.getItem('pageInit')=='true'){
            myCreateTask.curPage=1;
        }
        if(myCreateTask.curPage!=1){
            myCreateTask.offset=myCreateTask.curPage-1;
        }
        myCreateTask.datas={offset:myCreateTask.offset,userId:localStorage.getItem('userId'),flag:flag};
        myCreateTask.ajaxCommon('get','/api/taskCard/selectTasks',function(data){
            localStorage.removeItem('pageInit');
            if(data.list!=null){
                myCreateTask.TabShowOrHide('#createTaskList_wrapper',1);
                myCreateTask.listCount=data.count;
                myCreateTask.tabinit('#createTaskList',data.list);
                myCreateTask.clickPageEvent(flag);
                if(myCreateTask.curPage!=1){
                    myCreateTask.refreshPage(myCreateTask.curPage,data.page,data.count);
                }else{
                    myCreateTask.refreshPage(1,data.page,data.count);
                }
                if(localStorage.getItem('createFilter')){
                    homePage.filterTask('create');
                }
            }else{
                myCreateTask.TabShowOrHide('#createTaskList_wrapper',2);
            }
        },myCreateTask.datas);


        //myCreateTask.ajaxCommon('get','/api/log/getDynamics',function(data){
        //   console.log('888888888888',data);
        //},{userId:localStorage.getItem('userId'),offset:0});
    },
    TabShowOrHide:function(tableIdwrapper,showType){
        if(showType==1){
            $('#task-nosearch').hide();
            $('#task-notask').hide();
            $(tableIdwrapper).show();
        }else if(showType==0){
            $(tableIdwrapper).hide();
            $('#task-notask').hide();
            $('#task-nosearch').show();
        }else{
            //createTaskList_wrapper
            $(tableIdwrapper).hide();
            $('#task-nosearch').hide();
            $('#task-notask').show();
        }
    },
    initClickEvent:function(flag){
        /*点击body用户筛选消失*/
        $('body').on('click.ompa',function(){
            $('#taskType_filter').hide();
            $('#myCreateTask_filter').css({
                'border-radius':'4px',
                'border':'1px solid #ccc'
            })




        });
      $('#myCreateTask_filter_box').click(function(ev){
          ev.stopPropagation();
      });
        $('#myCreateTask_filter').on('click',function(){
            var _this=$(this);
            if($('#taskType_filter').css('display')=='none'){
                var _length=myCreateTask.taskTypeRecord.length;
                var _taskFilter=$('#myCreateTaskType_filter li');
                if(_length!=0){
                    for(var i=0;i<_length;i++){
                        for(var j=0;j<_taskFilter.length;j++){
                            if(myCreateTask.taskTypeRecord[i]==_taskFilter.eq(j).attr('data-value')){
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
                $('#myCreateTask_filter').css({
                    'border-radius':'4px 4px 0 0',
                    'border-bottom':'none'
                })

            }else{
                $('#taskType_filter').hide();
                $('#myCreateTask_filter').css({
                    'border-radius':'4px',
                    'border':'1px solid #ccc'
                })
            }
        });
        $('#myCreateTask_filter_sure').on('click',function(){
            $('#taskType_filter').hide();
            $('#myCreateTask_filter').css({
                'border-radius':'4px',
                'border':'1px solid #ccc'
            })
            myCreateTask.datas.offset=0;
            myCreateTask.taskTypeRecord=[];
               $('#myCreateTaskType_filter li').each(function(){
                   if($(this).attr('data-check')){
                       var typeId=$(this).data('value');
                       myCreateTask.taskTypeRecord.push(typeId);
                   }
               });
            if(myCreateTask.taskTypeRecord.length!=0){
                myCreateTask.datas.TaskStatus=JSON.stringify(myCreateTask.taskTypeRecord);
                $('#myCreateTask_filter').find('i').html('&#xe674;').css('color','#f4c600');
                $('#myCreateTask_filter').find('span').eq(0).html("已筛选");
            }else{
                myCreateTask.offset=0;
                myCreateTask.datas={offset:myCreateTask.offset,userId:localStorage.getItem('userId'),flag:flag};
                $('#myCreateTask_filter').find('i').html('&#xe669;').removeAttr('style');
                $('#myCreateTask_filter').find('span').eq(0).html("未筛选");
            }
            myCreateTask.ajaxCommon('get','/api/taskCard/selectTasks',function(data){
                localStorage.removeItem('createFilter');
                if(data.list!=null){
                    myCreateTask.listCount=data.count;
                    myCreateTask.TabShowOrHide('#createTaskList_wrapper',1);
                    myCreateTask.refreshTab('#createTaskList',data.list);
                    myCreateTask.refreshPage( myCreateTask.datas.offset+1,data.page,data.count);
                }else{
                    if(myCreateTask.taskTypeRecord.length!=0){
                        myCreateTask.TabShowOrHide('#createTaskList_wrapper',0);
                    }else{
                        myCreateTask.TabShowOrHide('#createTaskList_wrapper',2);
                    }
                }
            },myCreateTask.datas);
        });
        /*$('#myCreateTaskType_filter li').on('click','i',function(){
            var _thisParent=$(this).parent();
            var typeId=parseInt($(this).parent().attr('data-value'));
            if(!_thisParent.attr('data-check')){
                _thisParent.attr('data-check','true');
                $(this).html('&#xe64b;').css({color: '#6dc484'});
            }else {
                var str = $('#myCreateTask_filter').find('span').eq(0).html();
                _thisParent.removeAttr('data-check');
                $(this).html('&#xe64c;').removeAttr('style');
            }
        });*/
        $('#myCreateTaskType_filter li').on('click',function(){
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
    },
    refreshTab:function(tableId,arr){
        var table = $(tableId).DataTable();
        //清空数据
        table.clear().draw();
        //重新加载数据
        table.rows.add(arr).draw(true);
    },
    refreshPage:function(num,page,count){
        var str='';
        for(var i=0;i<page;i++){
            str +='<li ><a href="#" style="border: none;padding-left: 21px;padding-right: 21px;height: 20px;">'+(i+1)+'</a></li>';
        }
        var stpm='<div class="dropup" id="myCreateTask_pageCount">'+
            '<p class="dropdown-toggle"  id="myCreateTaskdropdownMenu" data-toggle="dropdown">'+
            num+'/'+page +
            '</p>'+
            '<ul  id="myCreateTask_dropmenu" class="dropdown-menu" style="padding: 0;margin-left: -4%;min-width: 0;max-height: 104px;height:auto;overflow-y: scroll">'+ str+'</ul>'+
            '</div>';
        $('#createTaskList_paginate span>a').html(stpm);
        $('#myCreateTaskdropdownMenu').html(num+'/'+page);
        $('#createTaskList_info').html('共'+count+'条');
        $(".dataTables_scrollHeadInner").css({'width':'100%','background':'#f2f2f2'});
        $(".dataTables_scrollHeadInner table").css({'width':'100%'});
    },
    clickPageCommon:function(flag){
        var dataLength=myCreateTask.taskTypeRecord.length;
        if(dataLength!=0){
            myCreateTask.datas.TaskStatus=JSON.stringify(myCreateTask.taskTypeRecord);
        }else{
            myCreateTask.datas={offset:myCreateTask.offset,userId:localStorage.getItem('userId'),flag:flag};
        }
    },
    clickPageEvent:function(flag){
        $('#createTaskList_paginate').on('click','#createTaskList_first',function(){
            myCreateTask.offset=0;
            myCreateTask.datas.offset=0;
            myCreateTask.curPage=1;
            myCreateTask.clickPageCommon(flag);
            myCreateTask.ajaxCommon('get','/api/taskCard/selectTasks',function(data){
                if(data.list!=null){
                    myCreateTask.refreshTab('#createTaskList',data.list);
                    myCreateTask.refreshPage( myCreateTask.offset+1,data.page,data.count);
                }
            },myCreateTask.datas);
        });
        $('#createTaskList_paginate').on('click','#createTaskList_previous',function(){
            var pageNum='';
            if(myCreateTask.curPage!=1){
                myCreateTask.curPage-=1;
            }else{
                myCreateTask.curPage=1;
            }
            if(myCreateTask.offset>1){
                myCreateTask.datas.offset=myCreateTask.offset-1;
                pageNum=myCreateTask.offset;
                myCreateTask.offset-=1;
            }else if(myCreateTask.offset==1){
                myCreateTask.offset=myCreateTask.offset-1;
                pageNum=1;
            }else{
                myCreateTask.offset=0;
                myCreateTask.datas.offset=0;
                pageNum=1;
            }
            myCreateTask.clickPageCommon(flag);
            myCreateTask.ajaxCommon('get','/api/taskCard/selectTasks',function(data){
                if(myCreateTask.offset!=0){
                    myCreateTask.offset-=1;
                }
                myCreateTask.refreshTab('#createTaskList',data.list);
                myCreateTask.refreshPage(pageNum,data.page,data.count);
            },myCreateTask.datas);
        });
        $('#createTaskList_paginate').on('click','#createTaskList_next',function(){
            myCreateTask.offset+=1;
            myCreateTask.curPage+=1;
            myCreateTask.datas.offset=myCreateTask.offset;
            myCreateTask.clickPageCommon(flag);
            myCreateTask.ajaxCommon('get','/api/taskCard/selectTasks',function(data){
                if(data.list!=null){
                    myCreateTask.refreshTab('#createTaskList',data.list);
                    myCreateTask.refreshPage( myCreateTask.offset+1,data.page,data.count);
                }else{
                    myCreateTask.offset-=1;
                }
            },myCreateTask.datas);
        });
        $('#createTaskList_paginate').on('click','#createTaskList_last',function(){
            myCreateTask.offset=Math.floor(myCreateTask.listCount/10);
            myCreateTask.curPage=myCreateTask.offset+1;
            myCreateTask.datas.offset=myCreateTask.offset;
            myCreateTask.clickPageCommon(flag);
            myCreateTask.ajaxCommon('get','/api/taskCard/selectTasks',function(data){
                myCreateTask.refreshTab('#createTaskList',data.list);
                myCreateTask.refreshPage( myCreateTask.offset+1,data.page,data.count);
            },myCreateTask.datas);
        });
        $('body').on('click.ompa','#myCreateTask_pageCount ul li',function(){
            myCreateTask.offset=$(this).index();
            myCreateTask.curPage=$(this).index();
            myCreateTask.datas.offset=myCreateTask.offset;
            myCreateTask.clickPageCommon(flag);
            myCreateTask.ajaxCommon('get','/api/taskCard/selectTasks',function(data){
                myCreateTask.refreshTab('#createTaskList',data.list);
                myCreateTask.refreshPage( myCreateTask.offset+1,data.page,data.count);
            },myCreateTask.datas);
        });

        $('#createTaskList tbody').on('click','tr td:first-child',function(){
           localStorage.setItem('thisTaskVersionId',$(this).parent().attr('id'));
           $('#myTask-content').loadPage('taskCard.edit.html');
        });
    },
    ajaxCommon:function(type,url,callback,data,errorback){
        $.ajax({
            type: type,
            async: true,
            dataType: 'json',
            data:data,
            url: url,
            success:callback,
            error: function(err){
                if(errorback!=''){
                    errorback;
                }else{
                    console.log(err);
                }
            }
        });
    }
}