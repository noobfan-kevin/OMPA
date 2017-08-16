var shot={
memberRecord:[],
leaders:{
    id:[],
    name:[]
},
shotId:'',  //镜头节点的id
shotMemberTree:null,
fatherId:'',
shotTree:null,
thisNodeID:null, //这个节点的id
edit:false,
thisProjectMember:[],
refreshThisNode:function(nodeId){

    if(projectCommon.authority.manageAllProjects||projectCommon.authority.isProjectLeader){
        $('#asset-add-btn').show();
        $('#asset-edit-btn').show();
        $('#asset-del-btn').show();
        if(shot.thisNodeID==shot.shotId){
            $('.fatherNode').hide();
            $('#asset-del-btn').hide();
        }else{
            $('.fatherNode').show();
            $('#asset-del-btn').show();
        }
    }else{
        $('#asset-add-btn').hide();
        $('#asset-edit-btn').hide();
        $('#asset-del-btn').hide();
        if(shot.thisNodeID==shot.shotId){
            $('.fatherNode').hide();
            $('#asset-del-btn').hide();
        }else{
            $('.fatherNode').show();
            $('#asset-del-btn').hide();
        }
    }



    $.ajax({
        type: 'get',
        url: '/api/stepShot/'+nodeId, //节点ID
        success:function(data){
            console.log('当前节点信息========',data);
            if(data.ok){
                data = data.list;
                shot.renderCheckPage(data);
            }
        },
        error:function(err){
            console.log(err);
        }
    });

},
renderCheckPage:function(data){
    //父级
    $('#asset-info').attr('data-value',data.id?data.id:'');
    //节点名称        #node-name
    $('#node-name').html(data.name?data.name:'');
    //节点进度        #node-schedule
    $('#node-schedule').html(data.progress?data.progress:'0');

    //上级节点        #father-node
    $('#father-node').html(data.father?data.father.name:'').attr('data-value',data.father?data.father.id:'');

    //任务卡负责人    #task-leader
    $('#task-leader').html(data.member.taskCardLeader ?data.member.taskCardLeader.name:'').attr('data-value',data.member.taskCardLeader ?data.member.taskCardLeader.id:'');
    //合同负责人      #contract-leader
    $('#contract-leader').html(data.member.contractLeader ?data.member.contractLeader.name:'').attr('data-value',data.member.contractLeader ?data.member.contractLeader.id:'');
    //支付负责人      #pay-leader
    $('#pay-leader').html(data.member.payLeader ?data.member.payLeader.name:'').attr('data-value',data.member.payLeader ?data.member.payLeader.id:'');
    //项目成员        #node-member
    var str='';
    console.log('节点成员-----------',data.member.member);
    var arr=data.member.member;
    /*//arr=shot.arrUnique(arr); //去重
    console.log('-------去重数组--',arr);*/
    if(arr){
        for(var i=0; i<arr.length;i++){
            str+='<li data-value="'+arr[i].id+'">'+arr[i].name+'</li>';
        }
        $('#node-member').html(str);
    }else{
        $('#node-member').html('');
    }

    if(projectCommon.authority.manageAllProjects||projectCommon.authority.isProjectLeader){
        $('#asset-add-btn').show();
        $('#asset-edit-btn').show();
        $('#asset-del-btn').show();
        if(shot.thisNodeID==shot.shotId){
            $('.fatherNode').hide();
            $('#asset-del-btn').hide();
        }else{
            $('.fatherNode').show();
            $('#asset-del-btn').show();
        }
    }else{
        $('#asset-add-btn').hide();
        $('#asset-edit-btn').hide();
        $('#asset-del-btn').hide();
        if(shot.thisNodeID==shot.shotId){
            $('.fatherNode').hide();
            $('#asset-del-btn').hide();
        }else{
            $('.fatherNode').show();
            $('#asset-del-btn').hide();
        }
    }
   /* if(shot.thisNodeID==shot.shotId){
        $('.fatherNode').hide();
        $('#asset-del-btn').hide();
    }else{
        $('.fatherNode').show();
        $('#asset-del-btn').show();
    }*/




    $('.asset-check').show().siblings().hide();
},
renderEditPage:function(){
    //父级box
    $('#asset-new-detail').attr('data-value',$('#asset-info').attr('data-value'));
    //节点名称        #node-name
    $('#asset-new-name').val($('#node-name').html());
    //节点进度        #node-schedule
    $('#asset-new-schedule').val($('#node-schedule').html());

    //上级节点        #father-node
    var id=$('#father-node').attr('data-value');
    $('#asset-new-parent').val($('#father-node').html()).attr('data-value',id);
    if(shot.shotId!==shot.thisNodeID){
        shot.fatherId=id;
    }else{
        shot.fatherId='';
    }

    //任务卡负责人    #task-leader
    $('#asset-new-taskLeader').val($('#task-leader').html()).attr('data-value',$('#task-leader').attr('data-value'));
    //合同负责人      #contract-leader
    $('#asset-new-contractLeader').val($('#contract-leader').html()).attr('data-value',$('#contract-leader').attr('data-value'));
    //支付负责人      #pay-leader
    $('#asset-new-payLeader').val($('#pay-leader').html()).attr('data-value',$('#pay-leader').attr('data-value'));
    //项目成员        #node-member
    var liLists=$('#node-member li');
    var listsId=[];
    var str='';
    for(var i=0; i<liLists.length;i++){
        str+='<label data-value="'+liLists.eq(i).attr('data-value')+'">'+liLists.eq(i).html()+'</label>';
        listsId.push(liLists.eq(i).attr('data-value'));
    }
    $('#shot-havaChoose').html(str).attr('data-value',JSON.stringify(listsId));

    shot.reSetLeaders('#asset-new-taskLeader','#asset-new-contractLeader','#asset-new-payLeader');
    shot.filterHaveChoose('#shot-havaChoose');


},
clearNewInput:function(){
    //节点名称        #node-name
    $('#asset-new-name').val('');
    //节点进度        #node-schedule
    //$('#asset-new-schedule').val('');
    //上级节点        #father-node
    //$('#asset-new-parent').val('').attr('data-value','');
    var id=$('#asset-info').attr('data-value');
    shot.fatherId=id;
    $('#asset-new-parent').val($('#node-name').html()).attr('data-value',id);


    //任务卡负责人    #task-leader
    $('#asset-new-taskLeader').val($('#task-leader').html()).attr('data-value',$('#task-leader').attr('data-value'));
    //合同负责人      #contract-leader
    $('#asset-new-contractLeader').val($('#contract-leader').html()).attr('data-value',$('#contract-leader').attr('data-value'));
    //支付负责人      #pay-leader
    $('#asset-new-payLeader').val($('#pay-leader').html()).attr('data-value',$('#pay-leader').attr('data-value'));
    //项目成员        #node-member
    var liLists=$('#node-member li');
    var listsId=[];
    var str='';
    for(var i=0; i<liLists.length;i++){
        str+='<label data-value="'+liLists.eq(i).attr('data-value')+'">'+liLists.eq(i).html()+'</label>';
        listsId.push(liLists.eq(i).attr('data-value'));
    }
    $('#shot-havaChoose').html(str).attr('data-value',JSON.stringify(listsId));
    //刷新责任人和已选成员
    shot.reSetLeaders('#asset-new-taskLeader','#asset-new-contractLeader','#asset-new-payLeader');
    shot.filterHaveChoose('#shot-havaChoose');

},
addShot:function(data){
    //新增镜头
    $.ajax({
        url:'/api/stepShot/',
        type:'post',
        data:data,
        success: function(data) {
            console.log('新增镜头======================',data);
            if(data.ok){
                shot.shotTree.addNode(data.list.name,data.list.fatherId,'shotTree',data.list.id);
                $('.asset-check').show().siblings().hide();
                TUAS.hasTasksUnderModule(data.list.fatherId,function(len){
                    if(len>0){
                        //if(projectCommon.authority.manageAllProjects||projectCommon.authority.isProjectLeader||projectCommon.authority.manageAllTasks){
                            departmentObj.showAskModel("新建步骤造成任务卡覆盖，是否处理被覆盖任务卡？",true,function(flag){
                                if(flag){
                                    localStorage.setItem("pageType",'');
                                    localStorage.setItem('manageTaskUrl','/api/stepShot/getAllByProjectId/'+localStorage.getItem('projectId'));
                                    $('.manageTasks').loadPage('./taskUnderAorS');
                                }
                            });
                        //}else{
                        //    departmentObj.showAskModel("新建步骤造成任务卡覆盖,但您不具备调整任务卡位置权限，请联系项目负责人调整。",false);
                        //}
                    }
                });
            }
        },
        error:function(data){
            console.log(data);
            projectCommon.quoteUserWarning('.asset-new-save','311px','99px','节点创建失败！'); //????
        }
    });
},
editNode:function(data){
    //修改镜头几点
    $.ajax({
        url:'/api/stepShot/'+data.id,
        type:'put',
        data:data,
        success: function(data) {
            console.log('修改镜头======返回的数据================',data);
            if(data.ok){
                //修改成功
                shot.shotTree.UpdateNode('shotTree',data.list.fatherId,data.list.id,data.list.name);
                shot.refreshThisNode(data.list.id);
            }else{
                var inCharges = data.inCharge.map(function(user){
                    return user.name;
                });
                departmentObj.showAskModel(inCharges + '被子孙模块负责人占用，不可删除(请将其指定为负责人或普通成员)',false,function(){});
            }
        },
        error:function(data){
            console.log(data);
            projectCommon.quoteUserWarning('.asset-new-save','293px','141px','节点编辑失败！');
        }
    });
},

init:function(){
    //镜头-树 初始化
    var projectId = localStorage.getItem('projectId');
    shot.shotTree=new ZTreeObj('');
    shot.shotTree.initAll($("#shotTree"),'/api/stepShot/getAllByProjectId/' + projectId);
    //获取项目成员
    //assetObj.assetGetMember();
    //获取项目信息
    $.ajax({
        url:'/api/stepShot/getAllByProjectId/' + projectId,
        success: function(data) {
            if(data.ok){
                console.log('项目所有节点======================',data);
                shot.shotId=data['list'][0]['id'];
                shot.thisNodeID=shot.shotId;
                //console.log('当前节点信息========================',data.list[0]);

                shot.refreshThisNode(data.list[0].id);
                shot.initChoose();  //刷新成员选择


            }
        },
    });
    $('#curPositionName').html(localStorage.getItem('projectName'));
    //输入验证
    departmentObj.bindLegalCheck([$("#asset-new-name")],'0','-28','');  //节点名称

    $('.asset-body').on('click','#shotTree li',function(e){
        //获取这个节点的id   点击镜头树
        var id=$('div',this).attr('id');
        var nodeId=shot.shotTree.getCheckedNode();
        shot.thisNodeID=nodeId;

        console.log('这个节点id===',nodeId);
        shot.refreshThisNode(nodeId);
        e.stopPropagation();
    });


    //点新建
    $('#asset-add-btn').on('click',function(){
        shot.edit=false;
        //shot.memberRecord.length=0; /*???*/
        $('#my-project-add-haveChoose').html('').attr('data-value','[]');
        $('.fatherNode').show();
        $('#asset-del-btn').show();

        shot.clearNewInput();
        shot.refreshAllSelect();

        //新建 刷新上级节点可选
        $.ajax({
            url:'/api/stepShot/getAllByProjectId/' + projectId,
            success: function(data) {
                if(data.ok){
                    console.log('--上级可选的节点（所有）---------',data);
                    if(data.list.length){
                        //console.log('项目成员的个数==========》',data.member.length);
                        var str='';
                        for(var i=0; i<data.list.length; i++){
                            str+='<li data-value="'+data.list[i].id+'"><a href="#">'+data.list[i].name+'</a></li>';
                        }
                        $('#dropDeparment').html(str);
                    }

                }
            },
        });
        $('.asset-new').show().siblings().hide();

    });
    //点编辑
    $('#asset-edit-btn').on('click',function(){
        shot.edit=true;
        //shot.refreshEditInput();
        shot.renderEditPage(); //渲染可见的

        console.log('-------已选成员-------',shot.memberRecord);
        console.log('镜头节点',shot.shotId);
        console.log('当前节点',shot.thisNodeID);
        if(shot.thisNodeID!==shot.shotId){  //镜头节点
        //刷新可选上级节点
            $.ajax({
                url:'/api/stepShot/getNotChildrenNodes/'+shot.thisNodeID ,
                type:'get',
                success: function(data) {
                    console.log('--可选上级节点----------',data);
                    if(data.list.length){
                        var str='';
                        for(var i=0; i<data.list.length; i++){
                            str+='<li data-value="'+data.list[i].id+'"><a href="#">'+data.list[i].name+'</a></li>';
                        }
                        $('#dropDeparment').html(str);
                    }
                }
            });
        }

        shot.refreshAllSelect();

        $('.asset-new').show().siblings().hide();
    });
    //点删除（新建）
    $('#asset-del-btn').on('click',function(){
        //$('.asset-check').show().siblings().hide();
        departmentObj.showAskModel('是否确定删除该节点？', true, function(flag){
            //删除镜头节点
            if(flag){
                $.ajax({
                    url:'/api/stepShot/'+shot.thisNodeID,
                    type:'delete',
                    success: function(data) {
                        console.log('删除镜头======================',data);
                        if(data.message=='删除成功！'){
                            //删除成功  树的
                            shot.shotTree.deleteNode('shotTree',shot.thisNodeID,$('#father-node').attr('data-value'));
                            shot.thisNodeID=$('#father-node').attr('data-value');
                            shot.refreshThisNode(shot.thisNodeID);
                        }
                    }
                });
            }

        });
    });
    //点保存（编辑）
    $('.asset-new-save').on('click',function(){
        var data={};
        data.projectId=localStorage.getItem('projectId');
        data.name=$('#asset-new-name').val();
        data.progress='0';             //$('#asset-new-schedule').val();    //不用节点进度了
        if($('#asset-new-parent').attr('data-value')){
            data.fatherId=$('#asset-new-parent').attr('data-value'); //11
        }
        data.taskCardLeaderId=$('#asset-new-taskLeader').attr('data-value');
        data.contractLeaderId=$('#asset-new-contractLeader').attr('data-value');
        data.payLeaderId=$('#asset-new-payLeader').attr('data-value');
        data.member=$('#shot-havaChoose').attr('data-value');
        if(!data.name){ //保存验证
            projectCommon.quoteUserWarning('#asset-new-name','0','-32px','节点名称不能为空！'); //????
            return false;
        }
        //新建镜头
        if(!shot.edit){  //新建
            shot.addShot(data);
        }else{//编辑
            data.id=$('#asset-new-detail').attr('data-value');
            shot.editNode(data);
        }

        if(shot.thisNodeID==shot.shotId){
            $('.fatherNode').hide();
            $('#asset-del-btn').hide();
        }else{
            $('.fatherNode').show();
            $('#asset-del-btn').show();
        }
        //$('.asset-check').show().siblings().hide();


    });
    //点取消（编辑）
    $('.asset-new-cancel').on('click',function(){
        if(shot.thisNodeID==shot.shotId){
            $('.fatherNode').hide();
            $('#asset-del-btn').hide();
        }else{
            $('.fatherNode').show();
            $('#asset-del-btn').show();
        }
        $('.asset-check').show().siblings().hide();
    });
    //当选项改变时
    $('#dropDeparment').on('click','li',function(){
        var li=$(this);
        var nodeId=li.attr('data-value');
        shot.fatherId=nodeId;
        $('#asset-new-parent').val(li.find('a').html()).attr('data-value',nodeId);
        shot.refreshAllSelect(nodeId);
    });
    $('#dropTaskLeader').on('click','li',function(){
        var li=$(this);
        $('#asset-new-taskLeader').val(li.find('a').html()).attr('data-value',li.attr('data-value'));

        //刷新责任人和已选成员
        shot.reSetLeaders('#asset-new-taskLeader','#asset-new-contractLeader','#asset-new-payLeader');
        shot.filterHaveChoose('#shot-havaChoose');

    });
    $('#dropContractLeader').on('click','li',function(){
        var li=$(this);
        $('#asset-new-contractLeader').val(li.find('a').html()).attr('data-value',li.attr('data-value'));

        //刷新责任人和已选成员
        shot.reSetLeaders('#asset-new-taskLeader','#asset-new-contractLeader','#asset-new-payLeader');
        shot.filterHaveChoose('#shot-havaChoose');

    });
    $('#dropPayLeader').on('click','li',function(){
        var li=$(this);
        $('#asset-new-payLeader').val(li.find('a').html()).attr('data-value',li.attr('data-value'));

        //刷新责任人和已选成员
        shot.reSetLeaders('#asset-new-taskLeader','#asset-new-contractLeader','#asset-new-payLeader');
        shot.filterHaveChoose('#shot-havaChoose');
    });
},
renderCouldChooseLeader:function(arr){
    //负责人可选
    if(arr.length!=0){
        var str='';
        for(var i=0;i<arr.length;i++){
            str+='<li data-value="'+ arr[i].id+'"><a>'+ arr[i].name+'</a></li>'
        }
        //可选负责人
        $('.asset-leader').html(str);

    }
    $('.modal').on('show.bs.modal', projectCommon.centerModals($('#my-project-add-chooseBody')));

},
initChoose:function(){
    //choose树初始化,获取所有项目成员，默认显示根节点部门的参与项目人员
    shot.shotMemberTree=new ZTreeObj('default');
    //shot.shotMemberTree.initAll($("#my-project-add-tree"),'/api/department/getDepList');
    //点 +   edit
    $('#shotMember-editBtn').on('click',function(){
        //shot.shotMemberTree.initAll($("#my-project-add-tree"),'/api/department/getDepList');
        shot.memberRecord=JSON.parse($('#shot-havaChoose').attr('data-value'));
        console.log('haveChoose',$('#shot-havaChoose').attr('data-value'));
        shot.shotMemberTree.initAll($("#my-project-add-tree"),'/api/department/getDepList',function(data){
            //刷新可选成员（部门&&节点id）
            var departmentId=shot.shotMemberTree.getCheckedNode();
            var params={};
            if(shot.fatherId){
                params={departmentId:departmentId,nodeId:shot.fatherId};
            }else{
                params={departmentId:departmentId,projectId:localStorage.getItem('projectId')};
            }
            if(shot.thisNodeID==shot.shotId && shot.edit){
                assetObj.assetGetMember(params);
            }else{
                assetObj.getdepartmentMember(params);
            }

        });



        shot.refreshHaveChoose();
    });
    $('#my-project-add-chooseBody').off('click').on('click','#my-project-add-tree li a',function(){
        //√或×

        //刷新可选成员（部门&&节点id）
        var departmentId=shot.shotMemberTree.getCheckedNode();
        var params={};
        if(shot.fatherId){
            params={departmentId:departmentId,nodeId:shot.fatherId};
        }else{
            params={departmentId:departmentId,projectId:localStorage.getItem('projectId')};
        }
        if(shot.thisNodeID==shot.shotId && shot.edit){
            assetObj.assetGetMember(params);
        }else{
            assetObj.getdepartmentMember(params);
        }
    });
    //删除项目人员
    $('#my-project-add-haveChoose').on('click','li i',function(){
        var index=$(this).parent().index();
        shot.memberRecord.splice(index,1);
        $(this).parent().remove();

       // 刷新可选成员（部门&&节点id）
        var departmentId=shot.shotMemberTree.getCheckedNode();
        var params={};
        if(shot.fatherId){
            params={departmentId:departmentId,nodeId:shot.fatherId};
        }else{
            params={departmentId:departmentId,projectId:localStorage.getItem('projectId')};
        }
        if(shot.thisNodeID==shot.shotId && shot.edit){
            assetObj.assetGetMember(params);
        }else{
            assetObj.getdepartmentMember(params);
        }
    });

    //项目成员选择   保存  my-project-add-chooseSave
    $('#my-project-add-chooseSave').on('click',function(){
        shot.savePlayerChoose();
    });
    //项目成员选择  关闭和取消  closeProCreate   my-project-add-chooseCancelSave
    $('#closeProCreate').on('click',function(){
        shot.cancelPlayerChoose();
    });
    $('#my-project-add-chooseCancelSave').on('click',function(){
        shot.cancelPlayerChoose();
    });
    //点 项目成员全选
    $('#my-project-add-chooseAllPeople').on('click',function(){
        var liList=$('#my-project-add-chooseList li');
        var str='';
        if(!$(this).find('i').attr('data-value')){  //×
            $(this).find('i').html('&#xe64b;').attr('data-value','have').css('color','#999');//√
            var str='';
            for(var i=0; i<liList.length; i++){
                //liList.eq(i).find('i').html('&#xe64b;').attr('data-value', liList.eq(i).attr('data-value')).css('color','#999');//√
                shot.setLiCheckBox(liList.eq(i),true);     //√
                has=shot.findInArr(shot.memberRecord,liList.eq(i).attr('data-value'));
                if(has==-1){ //没有
                    //console.log('dd'+JSON.stringify(shot.memberRecord));
                    shot.memberRecord.push(liList.eq(i).attr('data-value'));
                    str+='<li data-value="'+liList.eq(i).attr('data-value')+'"><span>'+liList.eq(i).find('span').html()+'</span><i class="iconfont">&#xe63d;</i></li>';
                }
            }
            $('#my-project-add-haveChoose').append(str);
        }else{
            $(this).find('i').html('&#xe64c;').removeAttr('data-value').css('color','#ccc'); //×
            for(var i=0; i<liList.length; i++){
                //liList.eq(i).find('i').html('&#xe64c;').removeAttr('data-value').css('color','#ccc'); //×
                shot.setLiCheckBox(liList.eq(i),false);     //×
                has=shot.findInArr(shot.memberRecord,liList.eq(i).attr('data-value'));
                if(has!=-1){
                    //console.log('cc'+JSON.stringify(shot.memberRecord));
                    shot.memberRecord.splice(has,1);
                    $('#my-project-add-haveChoose li').eq(has).remove();
                }
            }
        }
        $('.modal').on('show.bs.modal', projectCommon.centerModals($('#my-project-add-chooseBody')));
    });
    //点 项目成员单选
    $('#my-project-add-chooseList').on('click','li',function(){
        //console.log(shot.memberRecord.thisDepart);
        var str='';
        var has=-1;
        //var id=$(this).attr('data-value');
        if(!$(this).find('i').attr('data-value')){ //×
            //$(this).find('i').html('&#xe64b;').attr('data-value',$(this).attr('data-value')).css('color','#999');//√
            shot.setLiCheckBox($(this),true);     //√
            has=shot.findInArr(shot.memberRecord,$(this).attr('data-value'));
            // console.log(has);
            if(has==-1){  //不在已选里
                //console.log($(this).attr('data-value'));
                shot.memberRecord.push($(this).attr('data-value'));
                //console.log('bb'+JSON.stringify(shot.memberRecord));
                str='<li data-value="'+$(this).attr('data-value')+'"><span>'+$(this).find('span').html()+'</span><i class="iconfont">&#xe63d;</i></li>';
                $('#my-project-add-haveChoose').append(str);
            }
        }else{//√
            //$(this).find('i').html('&#xe64c;').removeAttr('data-value').css('color','#ccc'); //×
            shot.setLiCheckBox($(this),false);     //×
            has=shot.findInArr(shot.memberRecord,$(this).attr('data-value'));
            //console.log(has);
            if(has!=-1){
                shot.memberRecord.splice(has,1);
                //console.log('aa'+JSON.stringify(shot.memberRecord));
                $('#my-project-add-haveChoose li').eq(has).remove();
            }
        }
        var flag=0;
        var liList=$('#my-project-add-chooseList li i');
        for(var i=0; i<liList.length; i++){
            if(liList.eq(i).attr('data-value')){
                flag++;
            }
        }
        if(flag==liList.length){
            //$('#my-project-add-chooseAllPeople').find('i').html('&#xe64b;').attr('data-value','have').css('color','#999');//√
            shot.setLiCheckBox($('#my-project-add-chooseAllPeople'),true);     //√
        }else{
            //$('#my-project-add-chooseAllPeople').find('i').html('&#xe64c;').removeAttr('data-value').css('color','#ccc'); //×
            shot.setLiCheckBox($('#my-project-add-chooseAllPeople'),false);     //×
        }
        $('.modal').on('show.bs.modal', projectCommon.centerModals($('#my-project-add-chooseBody')));
    });
    //shotMember-editBtn    shotMember-newBtn

},
cancelPlayerChoose:function(){
    shot.memberRecord=JSON.parse($('#shot-havaChoose').attr('data-value'));
},
savePlayerChoose:function(){
    $('#shot-havaChoose').attr('data-value','[]').html('');
    var str='';
    var list=$('#my-project-add-haveChoose li span');
    console.log('list.length',list[0],shot.memberRecord);
    if(list.length){
        for(var i=0; i<list.length; i++){
            str+='<label data-value="'+shot.memberRecord[i]+'">'+list.eq(i).html()+'</label>';
        }
        $('#shot-havaChoose').attr('data-value',JSON.stringify(shot.memberRecord)).html(str);
    }
},
setLiCheckBox:function(item,b){
    if (b) {
        item.find('i').html('&#xe64b;').attr('data-value', 'have').css('color', '#999');//√
    } else {
        item.find('i').html('&#xe64c;').removeAttr('data-value').css('color', '#ccc'); //×
    }
},
refreshAllSelect:function(id){
    //新建&编辑
    //获取单前的 上级节点，任务负责人，合同负责人，支付负责人的可选项，分别加入
    //$('#asset-new-parent').val('').attr('data-value','');
    var fatherId='',
        fatherName='';
    if(id){   //当 上级节点 选项改变时
        fatherId=id;
    }else{
        if(shot.edit){ //编辑后的信息
            if(shot.shotId!=shot.thisNodeID){
                fatherId=$('#father-node').attr('data-value');
                fatherName=$('#father-node').html();
            }else{
                //和没有fatherId一样
            }

        }else{      //新建后的信息
            fatherId=$('#asset-info').attr('data-value');
            fatherName=$('#node-name').html();
            //$('#asset-new-name').val(''); //名字为空
        }
        //$('#asset-new-parent').val(fatherName).attr('data-value',fatherId);
        /*console.log('fatherNAme',fatherName);
        console.log('fatherID',id);*/
    }
    //获取上级节点的成员并显示在 新建$编辑页
    if(fatherId){
        console.log('fatherId',fatherId);
        $.ajax({
            url:'/api/stepShot/'+fatherId,
            type:'get',
            success: function(data) {
                console.log('----------获取上级节点的成员------------',data);
                var memberObj=data.list.member;
                if(data.ok){
                    //如果上级节点改变 \\ 新建， 相应的已选成员跟着变
                    if(id) {
                        //新建或change
                        //任务卡负责人    #task-leader
                        var members = memberObj.member;
                        console.log('mmm',members);
                        shot.memberRecord.length = 0; //无成员
                        if (members.length) { //有成员
                            //刷新已选成员
                            //members=shot.arrUnique(members);
                            console.log('---------------new change成员-------', members);
                            var str = '';
                            for (var i = 0; i < members.length; i++) {
                                var index=shot.findInArr(shot.leaders.id,members[i].id);
                                if(index==-1){
                                    //console.log('shot.memberRecord',shot.memberRecord);
                                    shot.memberRecord.push(members[i].id);
                                    str += '<label data-value="'+members[i].id+'">' + members[i].name + '</label>';
                                }
                            }
                            $('#shot-havaChoose').html(str).attr('data-value', JSON.stringify(shot.memberRecord));

                        }else{
                            $('#shot-havaChoose').html('').attr('data-value', '[]');
                        }

                        if (memberObj.taskCardLeader) {
                            $('#asset-new-taskLeader').val(memberObj.taskCardLeader.name).attr('data-value', memberObj.taskCardLeader.id);
                        }else{
                            $('#asset-new-taskLeader').val('').attr('data-value', '');
                        }
                        //合同负责人      #contract-leader
                        if (memberObj.contractLeader) {
                            $('#asset-new-contractLeader').val(memberObj.contractLeader.name).attr('data-value', memberObj.contractLeader.id);
                        }else{
                            $('#asset-new-contractLeader').val('').attr('data-value', '');
                        }
                        //支付负责人      #pay-leader
                        if (memberObj.payLeader) {
                            $('#asset-new-payLeader').val(memberObj.payLeader.name).attr('data-value', memberObj.payLeader.id);
                        }else{
                            $('#asset-new-payLeader').val('').attr('data-value', '');
                        }

                        //刷新责任人和已选成员
                        shot.reSetLeaders('#asset-new-taskLeader','#asset-new-contractLeader','#asset-new-payLeader');
                        shot.filterHaveChoose('#shot-havaChoose');

                    }
                    shot.renderCouldChooseLeader(data.list.member.member);
                }
            },
            error:function(err){
                console.log(err);
            }
        });
    }
    else{
        $.ajax({
            url:'/api/stepShot/getMemberForSelectById/'+shot.shotId,
            type:'get',
            success: function(data) {
                console.log('----------获取项目的所有成员------------',data);
                if(data.ok){
                    //如果上级节点改变 \\ 新建， 相应的已选成员跟着变
                    shot.renderCouldChooseLeader(data.list.member);

                }
            }
        });
    }
    //刷新责任人和已选成员
    //shot.reSetLeaders('#asset-new-taskLeader','#asset-new-contractLeader','#asset-new-payLeader');
    //shot.filterHaveChoose('#shot-havaChoose');


},
reSetLeaders:function(key1,key2,key3){
    shot.leaders.id.length=0;
    shot.leaders.name.length=0;
    if(shot.findInArr(shot.leaders.id,$(key1).attr('data-value'))==-1){
        shot.leaders.id.push($(key1).attr('data-value'));
        shot.leaders.name.push($(key1).val());
    }
    if(shot.findInArr(shot.leaders.id,$(key2).attr('data-value'))==-1){
        shot.leaders.id.push($(key2).attr('data-value'));
        shot.leaders.name.push($(key2).val());
    }
    if(shot.findInArr(shot.leaders.id,$(key3).attr('data-value'))==-1){
        shot.leaders.id.push($(key3).attr('data-value'));
        shot.leaders.name.push($(key3).val());
    }
    //console.log('重置负责人',shot.leaders.name,shot.leaders.id);
},
filterHaveChoose:function(key){
    var lists=$(key).find('label');
    var list2=null;
    var arr=[];
    //去责任人
    for(var i=0; i<lists.length; i++){
        var index=shot.findInArr(shot.leaders.name, lists.eq(i).html());
        //console.log('index',index);
        if(index!=-1){
            lists.eq(i).remove();
        }
    }
    list2=$(key).find('label');
    for(var i=0; i<list2.length; i++){
        arr.push(list2.eq(i).attr('data-value'));
    }
    $(key).attr('data-value',JSON.stringify(arr));
},
refreshHaveChoose:function(){
    var list=$('#shot-havaChoose').find('label');
    var str='';
    //console.log('这是刷新已选项目成员的--↓');
    if(list.length){
        console.log('shot.memberRecord-----------------',shot.memberRecord);
        for(var i=0; i<list.length; i++){
            str+='<li data-value="'+shot.memberRecord[i]+'"><span>'+list.eq(i).html()+'</span><i class="iconfont">&#xe63d;</i></li>';
        }
        $('#my-project-add-haveChoose').html(str);
    }else{
        $('#my-project-add-haveChoose').html('');
    }
},
findInArr:function(arr,item){
    if(arr.length){
        for(var i=0; i<arr.length; i++){
            if(arr[i]==item){
                return i;
            }
        }
    }
    return -1;
},
/*arrUnique:function(arr){
        if(arr.length){
            var arr2=[],arr3=[],arr4=[];
            var index=-1;
            for (var i = 0; i < arr.length - 1; i++) {
                index=shot.findInArr(arr2,arr[i].id);
                //console.log(index,'\n',arr2,arr[i].id);
                if(index==-1){
                    arr2.push(arr[i].id);
                    arr3.push(i);
                }
            }
            for (var i = 0; i < arr.length - 1; i++) {
                index=shot.findInArr(arr3,i);
                if(index!==-1){
                    arr4.push(arr[i]);
                }
            }
            return arr4;
        }else{
            return arr;
        }

},
arrUniqueChoose:function(arr){
    if(arr.length){
        var arr2=[],arr3=[],arr4=[];
        var index=-1;
        for (var i = 0; i < arr.length - 1; i++) {
            index=shot.findInArr(arr2,arr[i].User.id);

            //console.log(index,'\n',arr2,arr[i].id);
            if(index==-1){
                console.log('~~~~~~~~',i);
                arr2.push(arr[i].User.id);
                arr3.push(i);
            }
        }
        for (var i = 0; i < arr.length - 1; i++) {
            index=shot.findInArr(arr3,i);
            if(index!==-1){
                //console.log('~~~~',i);
                arr4.push(arr[i]);
            }
        }
        return arr4;
    }else{
        return arr;
    }

},*/
/*refreshEditInput:function(nodeId){
        //根据shot.thisNodeID 从数据库中获取这个节点的所有信息，此处为假数据

        var member=['杨栋','吴晓明','连金金'];
        var listId=['6c5e0710-c66b-11e5-baf3-2fe5cd1b9a4e','0f0c8ff0-c66b-11e5-baf3-2fe5cd1b9a4e','9efa8780-c66a-11e5-baf3-2fe5cd1b9a4e'];
        $('#node-name-edit').attr('value','预演创作');
        $('#shot-schedule-edit').attr('value','82%');
        var str='';
        for(var i=0; i<member.length; i++){
            str+='<label >'+member[i]+'</label>';
        }
        $('#shot-havaChoose').html(str).attr('data-value',JSON.stringify(listId));
    },*/
/*findDepertmentPlayer:function(id){
        $.ajax({
            type: 'post',
            async: true,
            dataType:'json',
            url: '/api/department/getDepartmentUser',
            data:{
                departmentId:id,
            },
            success:function(data){
                if(data.data.length!=0){
                    $('#my-project-add-chooseAllPeople').show();
                    //console.log('111'+JSON.stringify(data.data));
                    var str='';
                    var chooseNum=0;
                    for(var i=0; i<data.data.length; i++){
                            var has=shot.findInArr(shot.memberRecord,data.data[i].id);
                            //console.log('click----------+'+JSON.stringify(projectCommon.playerRecord));
                            if(has!=-1){
                                chooseNum++;    //√
                                str+= '<li data-value="'+data.data[i].id+'" class="my-project-add-choose-people"><i style="color:#999;" data-value="'+data.data[i].id+'"  class="iconfont">&#xe64b;</i><span>'+data.data[i].name+'</span></li>';
                            }else{        //×
                                str+= '<li data-value="'+data.data[i].id+'" class="my-project-add-choose-people"><i class="iconfont">&#xe64c;</i><span>'+data.data[i].name+'</span></li>';
                            }

                    }
                    $('#my-project-add-chooseList').html(str);
                    if(chooseNum==data.data.length){
                        //$('#my-project-add-chooseAllPeople').find('i').html('&#xe64b;').attr('data-value',$(this).attr('data-value')).css('color','#999');//√
                        shot.setLiCheckBox($('#my-project-add-chooseAllPeople'),true);     //√

                    }else{
                        //$('#my-project-add-chooseAllPeople').find('i').html('&#xe64c;').removeAttr('data-value').css('color','#ccc'); //×
                        shot.setLiCheckBox($('#my-project-add-chooseAllPeople'),false);     //×
                    }
                }else{
                    $('#my-project-add-chooseAllPeople').hide();
                    $('#my-project-add-chooseList').html('')
                }
                $('.modal').on('show.bs.modal', projectCommon.centerModals($('#my-project-add-chooseBody')));
            },
            error:function(err){
                console.log(err);
            }
        });
},*/
/*renderShotMembers:function(){
     $.ajax({
     type: 'get',
     async: true,
     dataType: 'json',
     url: '/api/project/'+localStorage.getItem('projectId'),
     success:function(data){
     console.log('========这是项目成员=======',data);
     var members=data.list.Users;
     shot.renderCouldChooseLeader(members);
     },
     error:function(err){
     console.log(err);
     }
     });
     },*/


};













