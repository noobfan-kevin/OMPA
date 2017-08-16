/**
 * Created by hk60 on 2016/7/4.
 */
!function($,TaskUnderAorS){
    var NewModuleId = null;
    var CurModuleId = null;
    var projectId = localStorage.getItem('projectId');
    function getTasksFromStepId(id){
        $.ajax({
            method:'get',
            url:'/api/taskCard/getAllTasksUnderM/'+id,
            success:function(success){
                var len = success.length;
                var html = '';
                if(len>0){
                    for(var i=0;i<len;i++){
                        html+='<li>' +
                            '<label for="'+success[i].id+'"><i class="iconfont">&#xe64c;</i>'+success[i].TaskVersions[0].name+'</label>' +
                            '<input id="'+success[i].id+'" type="checkbox" />' +
                            '</li>';
                    }

                }else{
                    html='当前步骤下无任务卡';
                }
                $('#TAS-B-middle').html(html);
            },
            error:function(err){
                console.log(err);
            }
        });
    }

    function hasTasksUnderModule(id,cb){
        new Promise(function(resolve,reject){
            $.ajax({
                method:'get',
                url:'/api/taskCard/getAllTasksUnderM/'+id,
                success:function(success){
                    console.log(success,'kevinaaaaa');
                    resolve(success.length);
                },
                error:function(err){
                    console.log(err);
                }
            });
        }).then(function(success){
            cb(success);
        }).catch(function(errInfo){
            console.log(errInfo);
        });

    }
    function updateTaskBelongs(newModuleId,idList){
        $.ajax({
            method:'put',
            url:'/api/taskCard/updateTaskInfo/'+idList,
            data:{moduleId:newModuleId},
            success:function(success){
                console.log(success,'herrere');
            },
            error:function(err){
                console.log(err);
            }
        })
    }

    function initTree(left,LEFT,right,RIGHT){
        var URL = localStorage.getItem('manageTaskUrl');
        left.initAll(LEFT,URL,function(data){
            //console.log(data,'infofofofofofofo');
        });
        right.initAll(RIGHT,URL,function(data){
            //console.log(data,'infofofofofofofo');
        });
    }
    function closePage(){
        $('.taskUnderAorS').hide();
    }
    function init(){
        var LEFT = $('#TAS-B-left');
        var RIGHT = $('#TAS-B-right');
        var TREE_BODY = $('.taskUnderAorS-body');
        var left = new ZTreeObj('default');
        var right = new ZTreeObj('default');
        initTree(left,LEFT,right,RIGHT);

        TREE_BODY.off('click').on('click','div #TAS-B-left li a',function(){
            CurModuleId = left.getCheckedNode();
            //console.log(CurModuleId,'zuoceDAJKLHS');
            getTasksFromStepId(CurModuleId);
        }).on('click','div #TAS-B-right li a',function(){
            NewModuleId = right.getCheckedNode();
            //console.log(NewModuleId,'youceId');
        });

        $('#TAS-B-middle').on('click',' li label',function(){
            var id =  $(this).attr('for');
            var flag = document.getElementById(id).checked;
            if(flag){
                $(this).children().html('&#xe64c;');
            }else{
                $(this).children().html('&#xe64b;');
            }
        });

        $('.TAS-sure').click(function(){
            var idList = [];
            $('#TAS-B-middle li input').each(function(){
                if($(this)[0].checked){
                    idList.push($(this).attr('id'))
                }
            });
            if(idList.length!=0){
                if(NewModuleId!=null){
                    updateTaskBelongs(NewModuleId,idList);
                    initTree(left,LEFT,right,RIGHT);
                    $('#TAS-B-middle').html('请选择节点');
                    projectCommon.quoteUserWarning('.taskUnderAorS-div','400px','100px','移动完成');
                    //根据所在页刷新数据，在步骤页面不刷新
                    if(localStorage.getItem('pageType')=='asset'){
                        assetManagement.freshDataAfterManageTasks();
                    }else if(localStorage.getItem('pageType')=='shot'){
                        ShotMangement.freshDataAfterManageTask();
                    }else{
                    }
                }else{
                    projectCommon.quoteUserWarning('.taskUnderAorS-div','400px','100px','请选择目标节点');
                }
            }else{
                projectCommon.quoteUserWarning('.taskUnderAorS-div','400px','100px','请选择要移动任务卡');
            }


        });

        $('.TAS-cancel-X').click(function(){
            closePage();
        });
        $('.TAS-cancel').click(function(){
            closePage();
        });
    }

    TaskUnderAorS.TUAS = {
        init:init,
        hasTasksUnderModule:hasTasksUnderModule
    }
}(jQuery,window);