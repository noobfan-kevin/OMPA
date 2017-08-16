/**
 * Created by hk054 on 2016/7/19.
 */
(function($,global){
    var chooseDep=[];
    var oldChoose=[];
    function getFileList(){
        var arr=[];
        $('.noticeNewAttachList li').each(function(){
            arr.push($(this).attr('data-value'));
        });
        return arr;
    }
    function refreshHaveChoose(){
        var data=mtree.getCheckedNodeList('noticeTree');  //获取所有
        chooseDep=data;
        if(data.length>0){
            var str='';
            for(var i=0; i<data.length; i++){
                str+='<li data-value="'+data[i].id+'"><span>'+data[i].name+'</span><i class="iconfont">&#xe63d;</i></li>';
            }
            $('#noticeNewDepHaveChoose').html(str);
        }else{
            $('#noticeNewDepHaveChoose').html('');
        }
    }
    function centerModals(e){
        var $clone = e.clone().css('display', 'block').appendTo('body');
        var top=Math.round(($clone.height() - $clone.find('.modal-content').height())/2);
        top = top > 0 ? top : 0;
        $clone.remove();
        var t=$('#noticeNewDepSelect').height()/2+'px';
        e.find('.modal-content').css({"margin-left": '11%',"margin-top":'-36%','top':t});
    }
    function init(){
        noticeCreate.files.length=0;
        /*初始化树*/
        var mtree = new ZTreeObj('default',true);
        mtree.initAll($('#noticeTree'),'/api/department/getDepList',function(data){});
        //mtree.getCheckedNodeList('noticeTree');  //获取所有选中节点名称i
        //mtree.setNoChecked('noticeTree','d6dfce10-4894-11e6-8b80-493b7fa153e1'); //删除
        //projectCommon.centerModals($('#noticeNewDepSelect'));
        //点input框
        $('#noticeNewDepartment').on('click',function(){
            $('.modal').on('show.bs.modal',centerModals($('#noticeNewDepSelect')));
            //数组   oldChoose 刷新已选的部门
            if(oldChoose.length>0){
                mtree.setChecked('noticeTree',oldChoose);
                refreshHaveChoose();
            }
        });
        //点击选择
        $('#noticeNewDepartmentS').on('click',function(){
            $('.modal').on('show.bs.modal',centerModals($('#noticeNewDepSelect')));
            //数组   oldChoose 刷新已选的部门
            if(oldChoose.length>0){
                mtree.setChecked('noticeTree',oldChoose);
                refreshHaveChoose();
            }
        });

        //点击树节点
        $('#noticeNewDepSelect').on('click','#noticeTree li',function(e){
            var data=mtree.getCheckedNodeList('noticeTree');  //获取所有
            chooseDep=data;
            if(data.length>0){
                var str='';
                for(var i=0; i<data.length; i++){
                    str+='<li data-value="'+data[i].id+'"><span>'+data[i].name+'</span><i class="iconfont">&#xe63d;</i></li>';
                }
                $('#noticeNewDepHaveChoose').html(str);
            }else{
                $('#noticeNewDepHaveChoose').html('');
            }
            //console.log('-------------tree--------------',data);
            //获取这个节点的id   点击镜头树
            /*var id=$('div',this).attr('id');
            var nodeId=shot.shotTree.getCheckedNode();
            shot.thisNodeID=nodeId;
            console.log('这个节点id===',nodeId);
            shot.refreshThisNode(nodeId);
            e.stopPropagation();*/
        });
        //已选点删除
        $('#noticeNewDepHaveChoose').on('click','li i',function(){
            var id=$(this).parent().attr('data-value');
            mtree.setNoChecked('noticeTree',id); //删除
            refreshHaveChoose();
        });
        //部门确认
        $('#noticeNewChooseSave').on('click',function(){
            var arr1=[];//名称
            var arr2=[];//id
            if(chooseDep.length>0){
                for(var i=0; i<chooseDep.length; i++){
                    arr1.push(chooseDep[i].name);
                    arr2.push(chooseDep[i].id);
                }
                var str=arr1.join('， ');
                var str2=JSON.stringify(arr2);
                $('#noticeNewDepartment').val(str).attr('data-value',str2);
            }else{
                $('#noticeNewDepartment').val('').attr('data-value','[]');
            }
            oldChoose=arr2;
            console.log('oldChoose',oldChoose);
        });
        //部门取消
        $('#noticeNewChooseCancelSave').on('click',function(){

        });
        //发送
        $('.noticeNewSend').on('click',function(){
            var data={
                title:$('#noticeNewName').val(),
                content:$('#noticeNewContent').val().trim(),
                senderId:localStorage.getItem('userId'),
                senderName:localStorage.getItem('userName'),
                department:JSON.stringify(JSON.parse($('#noticeNewDepartment').attr('data-value'))),
            };
            if(!data.title||!data.content||data.department.length==0){
                //名称,内容，部门
                projectCommon.quoteUserWarning('.noticeNewSend','387px','-40px','有小红星标识的为必填项！');
                return false;
            }
            if(noticeCreate.files.length!=0){
                data.fileId=JSON.stringify(noticeCreate.files)
            }
             myCreateTask.ajaxCommon('post','/api/notice/createNotice',function(data){
                 noticeCreate.files.length=0;
                 localStorage.setItem('noticeId',data.notice.id);
                 socketCommon.emit().sendNotice(data.depart);
                 $('#container').loadPage('noticeList.html');
             },data,function(err){
                 console.log('66666666666',err);
             });
        });
        //取消
        $('.noticeNewCancel').on('click',function(){
            var arr=noticeCreate.files;
            if(arr.length>0){//删除所有文件
                $.ajax({
                    url:'/api/file/deleteFilesInList/' + arr,
                    type:'post',
                    success: function(data) {
                        if(data.ok){
                            console.log('--files----删除成功!--------',data);
                            $('#container').loadPage('noticeList.html');
                        }

                    },
                    error:function(err){
                        console.log(err);
                    }
                });
            }else{
                $('#container').loadPage('noticeList.html');
            }




        });
        //上传文件
        $('#noticeNewAttach').on('change',function(){
            var file=$('#noticeNewAttach')[0].files;
            if(file[0]){
                //上传
                fileUploader(file,{
                    success:function(file) {
                        console.log('---文件上传成功--------↓',file);
                        noticeCreate.files.push(file.id);
                        var str='<li data-value="'+file.id+'"><div>'+file.originalName+'<i class="iconfont noticeAttachDelete">&#xe63d;</i></div></li>';
                        $('.noticeNewAttachList').append(str);
                    },
                    fail:function(err){
                        //projectCommon.quoteUserWarning('#my-project-list','46%','11px','缩略图上传失败！');
                        console.log(err);
                    },
                    allow:['*'],
                    single: true,
                    field:'file',
                    /*limit: '2m',*/
                });
            }


        });
        //删除文件
        $('.noticeNewAttachList').on('click','i',function(){
            console.log('files',noticeCreate.files);
            var li=$(this).parent().parent();
            var id=li.attr('data-value');
            var index=shot.findInArr(noticeCreate.files,id);
            $.ajax({
                url:'/api/file/' + id,
                type:'delete',
                success: function(data) {
                    if(data.ok){
                        console.log('------删除成功---',data);
                        if(index!=-1){
                            noticeCreate.files.splice(index,1);
                        }
                        li.remove();

                    }

                },
                error:function(err){
                    console.log(err);
                }
            });

        });


    }
    function deleteAllFilesForNoticeCreate(){
        var arr=noticeCreate.files;
        if(arr.length>0){
            $.ajax({
                url:'/api/file/deleteFilesInList/' + arr,
                type:'post',
                success: function(data) {
                    if(data.ok){
                        console.log('------新建通知---files----删除成功!--------',data);
                        noticeCreate.files.length=0;
                    }
                },
                error:function(err){
                    console.log(err);
                }
            });
        }
    }
    global.noticeCreate={
        init:init,
        files:[],
        deleteAllFilesForNoticeCreate:deleteAllFilesForNoticeCreate,

    }
})(jQuery,window);