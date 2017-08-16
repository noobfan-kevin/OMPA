(function ($,asset){
    var memberRecord=[];
    var assetInfo={};
    var assetId={};
    var assetNodeInfo='';
    var leftTree=new ZTreeObj('');
    var rightTree=new ZTreeObj('default');
    var assetUpdate={};
    var flag='';
    var updateId='';
    function initChoose(){
        //choose树初始化,获取所有项目成员，默认显示根节点部门的参与项目人员
        shot.shotMemberTree=new ZTreeObj('default');
        //点 +   edit
        $('#shotMember-newBtn').on('click',function(){
            rightTree.initAll($("#my-asset-add-tree"),'/api/department/getDepList',function(data){
                var departmentId=rightTree.getCheckedNode();
                //assetId.id=leftTree.getCheckedNode();
                assetNodeInfo.choose='true';
                shot.memberRecord=JSON.parse($('#shot-havaChoose').attr('data-value'));
                console.log('ghh',shot.memberRecord);
                refreshHaveChoose('#shot-havaChoose');
                updateId=$('#asset-new-parent').attr('data-value');
                var params={departmentId:departmentId,nodeId:updateId};
                console.log('jjjj', shot.memberRecord);
                getdepartmentMember(params);
                //getAssetParentMember(assetId.id);
            });

        });
        //编辑状态的下的节点成员
        $('#shotMember-editBtn').on('click',function(){
            rightTree.initAll($("#my-asset-add-tree"),'/api/department/getDepList',function(data){
                var params={};
                var departmentId=rightTree.getCheckedNode();
                if(assetNodeInfo.father){
                    $('#asset-edit-parent').parent().parent().show();
                    shot.memberRecord=JSON.parse($('#shot-havaChoose-edit').attr('data-value'));
                    refreshHaveChoose('#shot-havaChoose-edit');
                    updateId=$('#asset-edit-parent').attr('data-value');
                     params={departmentId:departmentId,nodeId:updateId};
                    getdepartmentMember(params);
                }else{
                    $('#asset-edit-parent').parent().parent().hide();
                    shot.memberRecord=JSON.parse($('#shot-havaChoose-edit').attr('data-value'));
                    var params={departmentId:departmentId,projectId:localStorage.getItem('projectId')};
                    updateId=assetNodeInfo.id;
                    assetGetMember(params);
                    refreshHaveChoose('#shot-havaChoose-edit');
                }
                console.log('yuyu',params);
            });
        });
        //$('#my-project-add-chooseBody').off('click').on('click','#my-project-add-tree li a',function(){
        //    var departmentId=shot.shotMemberTree.getCheckedNode();
        //    var params={departmentId:departmentId,nodeId:assetId.id};
        //    getdepartmentMember(params);
        //});
        //删除项目人员
        $('#my-project-add-haveChoose').on('click','li i',function(){
            var index=$(this).parent().index();
            shot.memberRecord.splice(index,1);
            $(this).parent().remove();
            var departmentId=shot.shotMemberTree.getCheckedNode();
            var params={departmentId:departmentId,nodeId:assetId.id};
            getdepartmentMember(params);
        });

        //项目成员选择   保存  my-project-add-chooseSave
        $('#my-project-add-chooseSave').on('click',function(){
            console.log('1111',assetNodeInfo);
            if( assetNodeInfo.choose!='true'){
                savePlayerChoose('#shot-havaChoose-edit');
            }else{
                savePlayerChoose('#shot-havaChoose');
            }
        });
        //项目成员选择  关闭和取消  closeProCreate   my-project-add-chooseCancelSave
        $('#closeProCreate').on('click',function(){
            if(assetNodeInfo.choose!='true'){
                shot.memberRecord=JSON.parse($('#shot-havaChoose-edit').attr('data-value'));
            }else{
                shot.memberRecord=JSON.parse($('#shot-havaChoose').attr('data-value'));
            }
        });
        $('#my-project-add-chooseCancelSave').on('click',function(){
            if(assetNodeInfo.choose!='true'){
                shot.memberRecord=JSON.parse($('#shot-havaChoose-edit').attr('data-value'));
            }else{
                shot.memberRecord=JSON.parse($('#shot-havaChoose').attr('data-value'));
            }
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

    }
    function savePlayerChoose(ev){
        var str='';
            var list=$('#my-project-add-haveChoose li span');
            if(list.length){
                for(var i=0; i<list.length; i++){
                    str+='<label data-value='+shot.memberRecord[i] +'>'+list.eq(i).html()+'</label>';
                }
                $(ev).attr('data-value','[]').html('');
                $(ev).attr('data-value',JSON.stringify(shot.memberRecord)).html(str);
            }else{
                $(ev).attr('data-value','[]').html('');
            }
    }
    function refreshHaveChoose(ev){
        var list=$(ev).find('label');
        var str='';
        //console.log('这是刷新已选项目成员的--↓');
        if(list.length){
            for(var i=0; i<list.length; i++){
                str+='<li data-value="'+shot.memberRecord[i]+'"><span>'+list.eq(i).html()+'</span><i class="iconfont">&#xe63d;</i></li>';
            }
            $('#my-project-add-haveChoose').html('');
            $('#my-project-add-haveChoose').html(str);
        }else{
            $('#my-project-add-haveChoose').html('');
        }

    }
    function  assetInit() {
        departmentObj.bindLegalCheck([$('#asset-edit-name')],'170','0','');
        departmentObj.bindLegalCheck([$('#asset-new-name')],'170','0','');
        $('#assetcurPositionName').html(localStorage.getItem('projectName'));
        //初始化列出所有节点
        leftTree.initAll($("#assetTree"),'/api/stepAsset/getAllByProjectId/'+localStorage.getItem('projectId'),function(data){
            console.log(data);
            assetId.id=leftTree.getCheckedNode();
            getAssetInfo(assetId.id);
            var str='';
            for(var i=0;i<data.list.length;i++) {
                if (data.list[i].fatherId == null || data.list[i].fatherId == "") {
                    str += '<li data-value="' + data.list[i].id + '"><a>' + data.list[i].name + '</a></li>'
                } else {
                    str += '<li data-value="' + data.list[i].id + '" data-fatherId="' + data.list[i].fatherId + '"><a>' + data.list[i].name + '</a></li>'
                }
            }
            //   console.log('bbb',str);
            $('#dropNodeParent').html(str);
        });
        // assetGetMember();
        //点击左侧树，获取节点Id
        $('.asset-body').on('click','#assetTree li',function(e){
            assetId.id=leftTree.getCheckedNode();
            console.log('hh',assetId);
            //获取节点信息
            getAssetInfo(assetId.id);
            e.stopPropagation();
        });
        //点击部门，获取参与项目人员
        $('body').on('click.ompa','#my-asset-add-tree li',function(){
            var departmentId=rightTree.getCheckedNode();
            var params='';
            if(assetNodeInfo!=''&&assetNodeInfo.father==null){
                params={departmentId:departmentId,projectId:localStorage.getItem('projectId')};
                assetGetMember(params);
            }
            else{
                params={departmentId:departmentId,nodeId:updateId};
                getdepartmentMember(params);
            }
        });
        //新建
        $('#asset-add-btn').on('click',function(){
            // shot.thisNode='';//这个节点无

            flag='true';
            memberRecord=[];
            $('.asset-new').show().siblings().hide();
            $('.asset-new').find('input').val('');
            $('.asset-new').find('strong').html('');
            // shot.memberRecord.length=0;
            console.log('=======',assetNodeInfo);
            $('#asset-new-parent').val(assetNodeInfo.name).attr('data-value',assetNodeInfo.id);
            $('#asset-new-taskLeader').val(assetNodeInfo.member.taskCardLeader.name).attr('data-value',assetNodeInfo.member.taskCardLeader.id);
            $('#asset-new-contractLeader').val(assetNodeInfo.member.contractLeader.name).attr('data-value',assetNodeInfo.member.contractLeader.id);
            $('#asset-new-payLeader').val(assetNodeInfo.member.payLeader.name).attr('data-value',assetNodeInfo.member.payLeader.id);
            var array=[];
            var stmp='';
            for(var i=0;i<assetNodeInfo.member.member.length;i++){
                stmp+='<label data-value='+assetNodeInfo.member.member[i].id+'>'+assetNodeInfo.member.member[i].name+'</label>';
                array.push(assetNodeInfo.member.member[i].id);
            }
            $('#shot-havaChoose').html(stmp).attr('data-value',JSON.stringify(array));
            shot.reSetLeaders('#asset-new-taskLeader','#asset-new-contractLeader','#asset-new-payLeader');
            shot.filterHaveChoose('#shot-havaChoose');
            updateId=$('#asset-new-parent').attr('data-value');
            //assetNodeInfo={};
            //getAssetParentMember(assetId.id);//当前节点的节点成员
            getDropMember(assetId.id);
            getAllAssets();//所有节点

        });
        //点编辑
        $('#asset-edit-btn').on('click',function(){

            flag='flase';
            console.log('rrrr',assetNodeInfo);
            memberRecord=[];
            $('.asset-edit').find('input').val('');
            $('#shot-havaChoose-edit').html('');
            $('.asset-edit').show().siblings().hide();
            $('#asset-edit-name').val(assetNodeInfo.name);
            $('#asset-edit-taskLeader').val(assetNodeInfo.member.taskCardLeader.name).attr('data-value',assetNodeInfo.member.taskCardLeader.id);
            $('#asset-edit-contractLeader').val(assetNodeInfo.member.contractLeader.name).attr('data-value',assetNodeInfo.member.contractLeader.id);
            $('#asset-edit-payLeader').val(assetNodeInfo.member.payLeader.name).attr('data-value',assetNodeInfo.member.payLeader.id);
            var member=[];
            $('.aeeset-member').find('li').each(function(){
                member.push({name:$(this).text(),id:JSON.parse($(this).parent().attr('data-value'))[$(this).index()]});
            });
            var str='';
            for(var i=0; i<member.length; i++){
                str+='<label data-value='+member[i].id+' >'+member[i].name+'</label>';
            }
            $('#shot-havaChoose-edit').html(str);
            $('#shot-havaChoose-edit').attr('data-value',JSON.stringify($('.aeeset-member').attr('data-value')));
            shot.reSetLeaders('#asset-edit-taskLeader','#asset-edit-contractLeader','#asset-edit-payLeader');
            shot.filterHaveChoose('#shot-havaChoose-edit');
            updateId=$('#asset-edit-parent').attr('data-value');
            if(assetNodeInfo.father){
                // $('#asset-edit-schedule').parent().parent().show();
                $('#asset-edit-parent').parent().parent().show();
                // $('#asset-edit-name').val(assetNodeInfo.name);
                //   $('#asset-edit-schedule').val(assetNodeInfo.progress);
                $('#asset-edit-parent').val(assetNodeInfo.father.name).attr('data-value',assetNodeInfo.father.id);
               // getAssetParentMember(assetNodeInfo.father.id);
                getDropMember(assetNodeInfo.father.id);
            }else{
                $('#asset-edit-schedule').parent().parent().hide();
                $('#asset-edit-parent').parent().parent().hide();
                $('#asset-edit-name').val(assetNodeInfo.name);
                assetGetAllSelect();
            }
            getAssetNodeParent(assetId.id);
            shot.memberRecord=JSON.parse($('#shot-havaChoose-edit').attr('data-value'));
        });
        //点删除（）
        $('#asset-del-btn').on('click',function(){
            //$('.asset-check').show().siblings().hide();
            var fatherId=$('#asset-parentId').attr('data-value');
            console.log('fa',fatherId);
            departmentObj.showAskModel('是否确定删除该节点？', true, function(falg){
                if(falg){
                    $.ajax({
                        type: 'delete',
                        async: true,
                        dataType: 'json',
                        url: '/api/stepAsset/'+assetId.id,
                        success:function(data){
                            // console.log('567',data);
                            if(data){
                                getAssetInfo(fatherId);
                                leftTree.deleteNode('assetTree',assetId.id,fatherId);
                                getAllAssets();
                                // getAssetNodeParent(fatherId);
                                // getAssetParentMember(fatherId);
                            }
                        },
                        error:function(err){
                            console.log(err);
                        }
                    });
                }
            });
        });
        //点保存（新建）
        $('#asset-new-save').on('click',function(){
            assetSave();
        });

        //点取消（编辑）
        $('.asset-new-cancel').on('click',function(){
            $('.asset-check').show().siblings().hide();
        });

        //新建负责人选择
        $('#asset-create').on('click','.asset-leader li',function(){
            $(this).parent().siblings('input').attr('data-value',$(this).attr('data-value'));
            $(this).parent().siblings('input').val($(this).children().text());
            shot.reSetLeaders('#asset-new-taskLeader','#asset-new-contractLeader','#asset-new-payLeader');
            shot.filterHaveChoose('#shot-havaChoose');
        });
        //新建上级节点
        $('#asset-create').on('click','#dropNodeParent li',function(){
            $(this).parent().siblings('input').attr('data-value',$(this).attr('data-value'));
            $(this).parent().siblings('input').val($(this).children().text());
            updateId=$(this).attr('data-value');
            getAssetParentMember($(this).attr('data-value'));
            //shot.reSetLeaders('#asset-new-taskLeader','#asset-new-contractLeader','#asset-new-payLeader');
            //shot.filterHaveChoose('#shot-havaChoose');
            // assetId.id=$(this).data('value');
        });
        //编辑负责人选择
        $('#asset-edit').on('click','.asset-leader li',function(){
            $(this).parent().siblings('input').attr('data-value',$(this).attr('data-value'));
            $(this).parent().siblings('input').val($(this).children().text());
            shot.reSetLeaders('#asset-edit-taskLeader','#asset-edit-contractLeader','#asset-edit-payLeader');
            shot.filterHaveChoose('#shot-havaChoose-edit');
        });
        //编辑上级节点选择
        $('#asset-edit').on('click','#editdropNodeParent li',function(){
            $(this).parent().siblings('input').attr('data-value',$(this).attr('data-value'));
            $(this).parent().siblings('input').val($(this).children().text());
            updateId=$(this).attr('data-value');
            // getAssetInfo($(this).data('value'));
          //  getEveryAssetLeaders($(this).data('value'));
            getAssetParentMember($(this).attr('data-value'));
        });
        $('#asset-edit-save').on('click',function(){
            assetUpdateInfo();
        });
    }
    //获取下拉项目成员
    function assetGetAllSelect(){
        $.ajax({
            type: 'get',
            async: true,
            dataType: 'json',
            url: '/api/project/' + localStorage.getItem('projectId'),
            success: function (data) {
                var str='';
                if(data.list){
                    for(var i=0;i<data.list.Users.length;i++){
                        str += '<li data-value="' + data.list.Users[i].id + '"><a>' + data.list.Users[i].name + '</a></li>'
                    }
                    $('.asset-leader').html(str);
                }
            },
            error: function (err) {
                console.log(err);
            }
        });
    }
    //获取所有节点信息
    function  getAllAssets(){
        $.ajax({
            type: 'get',
            async: true,
            dataType: 'json',
            url: '/api/stepAsset/getAllByProjectId/'+localStorage.getItem('projectId'),
            success:function(data){
                console.log('tyyty',data);
              //  allAssetInfo=data.list;
                var str='';
                for(var i=0;i<data.list.length;i++) {
                    if (data.list[i].fatherId == null || data.list[i].fatherId == "") {
                        str += '<li data-value="' + data.list[i].id + '"><a>' + data.list[i].name + '</a></li>'
                    } else {
                        str += '<li data-value="' + data.list[i].id + '" data-fatherId="' + data.list[i].fatherId + '"><a>' + data.list[i].name + '</a></li>'
                    }
                }
                $('#dropNodeParent').html(str);
            },
            error:function(err){
                console.log(err);
            }
        });
    }
     //获取当前节点的上级的节点成员
    function getAssetParentMember(stepId){
        $.ajax({
            type: 'get',
            async: true,
            dataType: 'json',
            url: '/api/stepAsset/getMemberById/'+stepId,
            success:function(data){
                console.log('ppp',data);
                var srr='';
                var str='';
                var stmp='';
                var array=[];
                for(var i=0;i< data.list.member.length;i++){
                    array.push(data.list.member[i].id);
                    stmp+='<label >'+data.list.member[i].name+'</label>';
                    srr+='<li data-value="'+ data.list.member[i].id+'"><a>'+ data.list.member[i].name+'</a></li>'
                    str+= '<li data-value="'+data.list.member[i].id+'" class="my-project-add-choose-people"><i class="iconfont">&#xe64c;</i><span>'+data.list.member[i].name+'</span></li>';
                }
                $('.asset-leader').html(srr);
                if(flag=='true'){
                    $('#asset-new-taskLeader').val(data.list.taskCardLeader.name).attr('data-value',data.list.taskCardLeader.id);
                    $('#asset-new-contractLeader').val(data.list.contractLeader.name).attr('data-value',data.list.contractLeader.id);
                    $('#asset-new-payLeader').val(data.list.payLeader.name).attr('data-value',data.list.payLeader.id);
                    $('#shot-havaChoose').html('');
                    $('#shot-havaChoose').html(stmp).attr('data-value',JSON.stringify(array));
                    shot.reSetLeaders('#asset-new-taskLeader','#asset-new-contractLeader','#asset-new-payLeader');
                    shot.filterHaveChoose('#shot-havaChoose');
                }else{
                    $('#asset-edit-taskLeader').val(data.list.taskCardLeader.name).attr('data-value',data.list.taskCardLeader.id);
                    $('#asset-edit-contractLeader').val(data.list.contractLeader.name).attr('data-value',data.list.contractLeader.id);
                    $('#asset-edit-payLeader').val(data.list.payLeader.name).attr('data-value',data.list.payLeader.id);
                    shot.reSetLeaders('#asset-edit-taskLeader','#asset-edit-contractLeader','#asset-edit-payLeader');
                    shot.filterHaveChoose('#shot-havaChoose-edit');
                   // $('#shot-havaChoose-edit').html(stmp).attr('data-value',JSON.stringify(array));
                }
                $('#my-project-add-chooseList').html(str);

            },
            error:function(err){
                console.log(err);
            }
        });
    }
    //获取当前节点下拉列表显示的可选成员
    function  getDropMember(stepId){
        $.ajax({
            type: 'get',
            async: true,
            dataType: 'json',
            url: '/api/stepAsset/getMemberById/'+stepId,
            success:function(data) {
                var srr = '';
                var str = '';
                for (var i = 0; i < data.list.member.length; i++) {

                    srr += '<li data-value="' + data.list.member[i].id + '"><a>' + data.list.member[i].name + '</a></li>'
                    str += '<li data-value="' + data.list.member[i].id + '" class="my-project-add-choose-people"><i class="iconfont">&#xe64c;</i><span>' + data.list.member[i].name + '</span></li>';
                }
                $('.asset-leader').html(srr);
            },
            error:function(err){
                console.log(err);
            }
        });
    }
    //获取当前节点的所有上级节点
    function getAssetNodeParent(NodeId){
        $.ajax({
            type: 'get',
            async: true,
            dataType: 'json',
            url: '/api/stepAsset/getNotChildrenNodes/'+NodeId,
            success:function(data){
              console.log('huhuhu',data);
                var str='';
                for(var i=0;i<data.list.length;i++) {
                    if (data.list[i].fatherId == null || data.list[i].fatherId == "") {
                        str += '<li data-value="' + data.list[i].id + '"><a>' + data.list[i].name + '</a></li>'
                    } else {
                        str += '<li data-value="' + data.list[i].id + '" data-fatherId="' + data.list[i].fatherId + '"><a>' + data.list[i].name + '</a></li>'
                    }
                }
                $('#dropNodeParent').html(str);
                $('#editdropNodeParent').html(str);
            },
            error:function(err){
                console.log(err);
            }
        });
    }
    //获取资产步骤的详细信息
    function getAssetInfo(Id){
        $.ajax({
            type: 'get',
            async: true,
            dataType: 'json',
            url: '/api/stepAsset/'+Id,
            success:function(data){
              console.log('ttttt',data);
                assetNodeInfo=data.list;
                if(data.list.father==""||data.list.father==null){
                    $('#asset-parentId').parent().parent().hide();
                    //$('#asset-del-btn').hide();
                    if(projectCommon.authority.manageAllProjects||projectCommon.authority.isProjectLeader) {
                        $('#asset-add-btn').show();
                        $('#asset-edit-btn').show();
                        $('#asset-del-btn').hide();
                    }else{
                        $('#asset-add-btn').hide();
                        $('#asset-edit-btn').hide();
                        $('#asset-del-btn').hide();
                    }
                    $('#asset-name').text(data.list.name);
                    $('#asset-taskCardLeader').text(data.list.member.taskCardLeader.name);
                    $('#asset-contractLeader').text(data.list.member.contractLeader.name);
                    $('#asset-payLeader').text(data.list.member.payLeader.name);
                   // $('#asset-process').parent().parent().hide();
                    var str='';
                    var array=[];
                    if(data.list.member.member.length!=0){
                        for(var i=0;i<data.list.member.member.length;i++){
                            str+=' <li>'+ data.list.member.member[i].name+'</li>';
                            array.push(data.list.member.member[i].id);
                        }
                        $('#asset-member').attr('data-value',JSON.stringify(array));
                    }else{
                        $('#asset-member').attr('data-value',[]);
                    }
                    $('#asset-member').html(str);
                }else{
                   // $('#asset-process').parent().parent().show();
                    $('#asset-parentId').parent().parent().show();
                    //$('#asset-del-btn').show();
                    if(projectCommon.authority.manageAllProjects||projectCommon.authority.isProjectLeader) {
                        $('#asset-add-btn').show();
                        $('#asset-edit-btn').show();
                        $('#asset-del-btn').show();
                    }else{
                        $('#asset-add-btn').hide();
                        $('#asset-edit-btn').hide();
                        $('#asset-del-btn').hide();
                    }
                    $('.asset-check').find('p,ul').each(function(){
                        if($(this).attr('data-content')=="father"){
                            $(this).html(data.list.father.name);
                           // console.log('yuanx',data.list.father.name);
                            $(this).attr('data-value',data.list['father'].id);
                        }else if($(this).attr('data-content')=="name"||$(this).attr('data-content')=="progress") {
                            $(this).html(data.list[$(this).attr('data-content')]);
                        }else if($(this).attr('data-content')!='member'){
                            $(this).html(data.list.member[$(this).attr('data-content')].name);
                        }else if($(this).attr('data-content')=='member'){
                            var str='';
                            var array=[];
                            if(data.list.member.member.length!=0){
                                for(var i=0;i<data.list.member.member.length;i++){
                                    str+=' <li data-value='+data.list.member.member[i].id+'>'+ data.list.member.member[i].name+'</li>';
                                    array.push(data.list.member.member[i].id);
                                }
                                $(this).attr('data-value',JSON.stringify(array));
                            }else{
                                $(this).attr('data-value',[]);
                            }
                            $(this).html(str);
                        }
                    });
                }
                $('.asset-check').show().siblings().hide();

            },
            error:function(err){
                console.log(err);
            }
        });
    }
    //获取项目成员
    function assetGetMember(data){
        var arr=shot.leaders.id;
        $.ajax({
            type: 'post',
            async: true,
            data:data,
            dataType: 'json',
            url: '/api/stepAsset/getProjectMember',
            success:function(data){
                console.log('aeetst',data);
                var str='';
                if(data.data){
                    $('#my-project-add-chooseAllPeople').show();
                    var str='';
                    //var srr='';
                    var n=0;
                    var chooseNum=0;
                    for(var i=0; i<data.data.length; i++){
                        var index=shot.findInArr(arr,data.data[i].User.id);
                        if(index==-1){
                            var has=shot.findInArr(shot.memberRecord,data.data[i].User.id);
                            //console.log('click----------+'+JSON.stringify(shot.memberRecord));
                            if(has!=-1){
                                chooseNum++;    //√
                                str+= '<li data-value="'+data.data[i].User.id+'" class="my-project-add-choose-people"><i style="color:#999;" data-value="'+data.data[i].User.id+'"  class="iconfont">&#xe64b;</i><span>'+data.data[i].User.name+'</span></li>';
                            }else{        //×
                                str+= '<li data-value="'+data.data[i].User.id+'" class="my-project-add-choose-people"><i class="iconfont">&#xe64c;</i><span>'+data.data[i].User.name+'</span></li>';
                            }
                            n++;
                        }
                        //srr+='<li data-value="'+data.data[i].User.id+'"><a>'+data.data[i].User.name+'</a></li>'

                    }
                    $('#my-project-add-chooseList').html(str);
                    //$('.edit-leader').html(srr);
                    if(chooseNum==n){  //没有为0,0  也是√
                        //$('#my-project-add-chooseAllPeople').find('i').html('&#xe64b;').attr('data-value',$(this).attr('data-value')).css('color','#999');//√
                        shot.setLiCheckBox($('#my-project-add-chooseAllPeople'),true);     //√
                    }else{
                        //$('#my-project-add-chooseAllPeople').find('i').html('&#xe64c;').removeAttr('data-value').css('color','#ccc'); //×
                        shot.setLiCheckBox($('#my-project-add-chooseAllPeople'),false);     //×
                    }
                }
                if(n==0){
                    $('#my-project-add-chooseAllPeople').hide();
                    $('#my-project-add-chooseList').html('')
                }
                $('#my-project-add-chooseBody').modal('show');
                $('.modal').on('show.bs.modal', projectCommon.centerModals($('#my-project-add-chooseBody')));
            },
            error:function(err){
                console.log(err);
            }
        });
    }
    //新建资产步骤
    function assetSave(){
     assetInfo.name=$('#asset-new-name').val();
   //  assetInfo.progress=$('#asset-new-schedule').val();
     assetInfo.fatherId=$('#asset-new-parent').attr('data-value');
     assetInfo.taskCardLeaderId=$('#asset-new-taskLeader').attr('data-value');
     assetInfo.contractLeaderId=$('#asset-new-contractLeader').attr('data-value');
     assetInfo.payLeaderId=$('#asset-new-payLeader').attr('data-value');
     assetInfo.projectId=localStorage.getItem('projectId');
     assetInfo.member=$('#shot-havaChoose').attr('data-value');
        console.log('9999',assetInfo);
        if(assetInfo.name==''){
            projectCommon.quoteUserWarning('#asset-new-save','30%','5%','节点名称不能为空');
        }else {
            $.ajax({
                type: 'post',
                async: true,
                dataType: 'json',
                data: assetInfo,
                url: '/api/stepAsset',
                success: function (data) {
                    console.log(data,'new asset');
                    if (data.ok) {
                        leftTree.addNode(data.list.name, updateId, 'assetTree', data.list.id);
                        assetId.id = data.list.id;
                        getAssetInfo(leftTree.getCheckedNode());
                        getAllAssets();
                        shot.memberRecord = [];
                        TUAS.hasTasksUnderModule(assetInfo.fatherId,function(len){
                            if(len>0){
                                //if(projectCommon.authority.manageAllProjects||projectCommon.authority.isProjectLeader||projectCommon.authority.manageAllTasks){
                                    departmentObj.showAskModel("新建步骤造成任务卡覆盖，是否处理被覆盖任务卡？",true,function(flag){
                                        if(flag){
                                            localStorage.setItem("pageType",'');
                                            localStorage.setItem('manageTaskUrl','/api/stepAsset/getAllByProjectId/'+localStorage.getItem('projectId'));
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
                error: function (err) {
                    projectCommon.quoteUserWarning('#asset-new-save','30%','5%','节点创建失败');
                    console.log(err);
                }
            });
        }
 }
    //资产步骤编辑
    function assetUpdateInfo(){
        assetUpdate.name=$('#asset-edit-name').val();
        //assetUpdate.progress=$('#asset-edit-schedule').val();
        if($('#asset-edit-parent').attr('data-value')!=''){
            assetUpdate.fatherId=$('#asset-edit-parent').attr('data-value');
        }
        assetUpdate.taskCardLeaderId=$('#asset-edit-taskLeader').attr('data-value');
        assetUpdate.contractLeaderId=$('#asset-edit-contractLeader').attr('data-value');
        assetUpdate.payLeaderId=$('#asset-edit-payLeader').attr('data-value');
        assetUpdate.projectId=localStorage.getItem('projectId');
        assetUpdate.member=$('#shot-havaChoose-edit').attr('data-value');
        assetUpdate.id=assetId.id;
        if(assetUpdate.name==''){
            projectCommon.quoteUserWarning('#asset-edit-save','30%','5%','节点名称不能为空');
        }else {
            $.ajax({
                type: 'put',
                async: true,
                dataType: 'json',
                data: assetUpdate,
                url: '/api/stepAsset/' + assetUpdate.id,
                success: function (data) {
                    if (data.ok) {
                        assetId.id = data.list.id;
                        leftTree.UpdateNode('assetTree', data.list.fatherId, data.list.id, data.list.name);
                        getAssetInfo(assetId.id);
                        assetNodeInfo = '';

                        projectCommon.getProAuthoritysAndLoadProjectPage(localStorage.getItem('projectId'));
                    }else{
                        var inCharges = data.inCharge.map(function(user){
                            return user.name;
                        });
                        departmentObj.showAskModel(inCharges + '被子孙模块负责人占用，不可删除(请将其指定为负责人或普通成员)',false,function(){});
                    }
                },
                error: function (err) {
                    projectCommon.quoteUserWarning('#asset-new-save','30%','5%','节点更新失败');
                    console.log(err);
                }
            });
        }
    }


    //获取每个部门参与项目的人员
    function getdepartmentMember(data){
        var arr=shot.leaders.id;
        $.ajax({
            type: 'post',
            async: true,
            dataType:'json',
            data:data,
            url:'/api/stepAsset/getModelMember',
            success:function(data){
                console.log('data',data);
                if(data.data.length!=0){

                  //  console.log('111'+JSON.stringify(data.data));
                    var str='';
                    var chooseNum=0;
                    var n=0;
                    for(var i=0; i<data.data.member.length; i++){
                        var index=shot.findInArr(arr,data.data.member[i].id);
                        if(index==-1){
                            var has=shot.findInArr(shot.memberRecord,data.data.member[i].id);
                            console.log('click----------+'+JSON.stringify(shot.memberRecord));
                            if(has!=-1){
                                chooseNum++;    //√
                                str+= '<li data-value="'+data.data.member[i].id+'" class="my-project-add-choose-people"><i style="color:#999;" data-value="'+data.data.member[i].id+'"  class="iconfont">&#xe64b;</i><span>'+data.data.member[i].name+'</span></li>';
                            }else{        //×
                                str+= '<li data-value="'+data.data.member[i].id+'" class="my-project-add-choose-people"><i class="iconfont">&#xe64c;</i><span>'+data.data.member[i].name+'</span></li>';
                            }
                            n++;
                        }

                    }
                    $('#my-project-add-chooseList').html(str);
                    $('#my-project-add-chooseAllPeople').show();
                    if(chooseNum==n){ //没有为0,0  也是√
                        //$('#my-project-add-chooseAllPeople').find('i').html('&#xe64b;').attr('data-value',$(this).attr('data-value')).css('color','#999');//√
                        shot.setLiCheckBox($('#my-project-add-chooseAllPeople'),true);     //√
                    }else{
                        //$('#my-project-add-chooseAllPeople').find('i').html('&#xe64c;').removeAttr('data-value').css('color','#ccc'); //×
                        shot.setLiCheckBox($('#my-project-add-chooseAllPeople'),false);     //×
                    }
                    console.log('n, chooseNum',n,chooseNum);
                }
                if(n==0){
                    $('#my-project-add-chooseAllPeople').hide();
                    $('#my-project-add-chooseList').html('')
                }

                $('#my-project-add-chooseBody').modal('show');
                $('.modal').on('show.bs.modal', projectCommon.centerModals($('#my-project-add-chooseBody')));
            },
            error:function(err){
                console.log(err);
            }
        });
    }
    asset.assetObj={
        init:assetInit,
        initChoose:initChoose,
        assetGetMember:assetGetMember,
        getdepartmentMember:getdepartmentMember,
    };
})(jQuery,window);
