/**
 * Created by hk053 on 2016/3/11.
 */

var userCommon={
    centerModals:function(e){
       //// $('.modal').each(function(i){
       //     var $clone = $('#userLook').clone().css('display', 'block').appendTo('body');
       //     var top=Math.round(($clone.height() - $clone.find('.modal-content').height())/2);
       //     top = top > 0 ? top : 0;
       //     console.log('$clone.find(.height()'+$clone.find('.modal-content').height());
       //     console.log('clone++'+$clone.height());
       //     $clone.remove();
       //
       //     console.log('top++'+top);
       //     $('#userLook').find('.modal-content').css({"margin-left": '10%',"margin-top":top});
       //// });
        var $clone = e.clone().css('display', 'block').appendTo('body');
        var top=Math.round(($clone.height() - $clone.find('.modal-content').height())/2);
        top = top > 0 ? top : 0;
        $clone.remove();
        e.find('.modal-content').css({"margin-left": '10%',"margin-top":top});
    },
    array:[],
    user_flag:true,
    user_array:[],
    Pointer:'',
    dataCode:function(){
        return {dapartmentCode:'',roleCode:'',userType:'',param:'',department:'',role:'',userNum:'',userInfo:'',pageNum:'1',pageCount:'',user_drop:'',pageAll:'',userBelongType:''}
    },
    showCompany:function(th){
       // if(userCommon.dataCode.userInfo==''){
            $("#userRole").val($(th).data("name"));
            $("#userRole").attr('data-value',$(th).data("value"));
            userCommon.dataCode.roleCode=$(th).data("value");
            userCommon.dataCode.role=$(th).data('name');
            userCommon.array=$(th).data("content").split(',');
            if($.inArray('Receive_Pro_Contracts',userCommon.array)!=-1){
                $(".userHas").hide();
                $('#companyInfo').css({display:"block"});
                if(userCommon.dataCode.userType==1||userCommon.dataCode.userType==0){
                    $('#userOuter').hide();
                    $('#userSingle').show();
                }else if (userCommon.dataCode.userType == 2) {
                    $('#userSingle').hide();
                    $('#userOuter').show();
                }
                $('.modal').on('show.bs.modal', userCommon.centerModals($('#createUserInfo')));
            }else {
                $(".userHas").show();
                $('#companyInfo').css({display:"none"});
                $('.modal').on('show.bs.modal', userCommon.centerModals($('#createUserInfo')));
            }
    },
    getUserType:function(th){
        var userType=$(th).data('value');
        $('#userBelongType').val($(th).text());
        userCommon.dataCode.userType=userType;
            if (userType == 1||userType==0) {
                $('#userOuter').hide();
                $('#userSingle').show();
            } else if (userType == 2) {
                $('#userSingle').hide();
                $('#userOuter').show();
            }
    },
    selectDepartment:function(th){
        $("#userDepartment").val($(th).data("name"));
        userCommon.dataCode.dapartmentCode=$(th).data('value');
        userCommon.dataCode.department=$(th).data('name');
    },
    warnMessage:function(top,left){
        var cssText ="top:"+top + ";left:"+ left+";display:inline-block; position: absolute; font:14px/1.2em '微软雅黑';padding:5px;" +
            "z-index:50; box-shadow: 0px 3px 6px #aaa;border-radius: 5px;max-width:400px;opacity: 1; color: #eee;background:#FD0F0F" ;
        return cssText;
    },
    warnMessage2:function(top,right){
        var cssText ="top:"+top + ";right:"+ right+";display:inline-block; position: absolute; font:14px/1.2em '微软雅黑';padding:5px;" +
            "z-index:50; box-shadow: 0px 3px 6px #aaa;border-radius: 5px;max-width:400px;opacity: 1; color: #eee;background:#FD0F0F" ;
        return cssText;
    },
    infoMessage:function(top,left){
        var cssText ="top:"+top + ";left:"+ left+";display:inline-block; position: absolute; font:14px/1.2em '微软雅黑';padding:5px;" +
            "z-index:50; box-shadow: 0px 3px 6px #aaa;border-radius: 5px;max-width:400px;opacity: 1; color: #eee;background:#000000" ;
        return cssText;
    },
    warnMessageRemove:function(box){
        //clearTimeout(window.TipTimer);
        window.TipTimer = setTimeout(function () {
            box.remove();
        }, 2000)
    },
    updateFormVolitor:function(){
        var regu = "^(([0-9a-zA-Z]+)|([0-9a-zA-Z]+[_.0-9a-zA-Z-]*[0-9a-zA-Z]+))@([a-zA-Z0-9-]+[.])+([a-zA-Z]{2}|net|NET|com|COM|gov|GOV|mil|MIL|org|ORG|edu|EDU|int|INT)$"
        var re = new RegExp(regu);
        if($("#userName").val()==""||$('#userDepartment').val()==""||$('#userRole').val()==""||$('#userBelongType').val()==""){
            var box =$('<div id="m-tip" style="' + userCommon.warnMessage('4%','30%') +'">有小红星标示的选项为必填<div>');
            $("#userCreateBody").before(box);
            userCommon.warnMessageRemove(box);
            return false;
        }
        else if($.inArray('Receive_Pro_Contracts',userCommon.array)!=-1) {
            if (userCommon.dataCode.userType == undefined || userCommon.dataCode.userType == 2) {
                if ($('#companyName').val() == "" || $('#companyAccount').val() == "" || $('#companyAccountName').val() == "" || $('#companyAddress').val() == ""||$('#companyEmail').val()==""||$('#companyPhone').val()=="") {
                    var box = $('<div id="m-tip" style="' + userCommon.warnMessage('4%', '30%') + '">有小红星标示的选项为必填<div>');
                    $("#userCreateBody").before(box);
                    userCommon.warnMessageRemove(box);
                    return false;
                }
            }
             if (userCommon.dataCode.userType == 0 || userCommon.dataCode.userType == 1) {
                if ($('#companyName').val() == "" || $('#companyAccount').val() == "" || $('#companyAccountName').val() == "" || $('#userCardId').val() == ""||$('#companyEmail').val()==""||$('#companyPhone').val()=="") {
                    var box = $('<div id="m-tip" style="' + userCommon.warnMessage('4%', '30%') + '">有小红星标示的选项为必填<div>');
                    $("#userCreateBody").before(box);
                    userCommon.warnMessageRemove(box);
                    return false;
                }
            }
             if ($('#companyEmail').val()!="") {
                var cssText = "top:52%;left:28%;width:130px;display:inline-block; position: absolute; font:14px/1.2em '微软雅黑';padding:5px;" +
                    "box-shadow: 0px 3px 6px #aaa;border-radius: 5px;max-width:300px;opacity: 1; color: #eee;background:#FD0F0F";
                var box = $('<div id="m-tip" style="' + cssText + '">请输入正确邮箱<div>');
                if (re.test($("#companyEmail").val())) {
                    return true;
                } else {
                    $('#companyEmail').before(box);
                    userCommon.warnMessageRemove(box);
                    return false;
                }
            }else{
                return true;
            }
        }
        else if($("#email").val()!=""){
            var box =$('<div id="m-tip" style="' +  userCommon.warnMessage('-32px','15px') +'">请输入正确邮箱<div>');
            if (re.test($("#email").val())) {
                return true;
            } else {
                $('#email').before(box);
                userCommon.warnMessageRemove(box);
                return false;
            }
        } else{
            return true;
        }
    },
    formVolitor:function(){
        var regu = "^(([0-9a-zA-Z]+)|([0-9a-zA-Z]+[_.0-9a-zA-Z-]*[0-9a-zA-Z]+))@([a-zA-Z0-9-]+[.])+([a-zA-Z]{2}|net|NET|com|COM|gov|GOV|mil|MIL|org|ORG|edu|EDU|int|INT)$"
        var re = new RegExp(regu);
        if($('#userAccount').val()==""||userCommon.userParams.password==""||$("#userName").val()==""||$('#userDepartment').val()==""||$('#userRole').val()==""||$('#userBelongType').val()==""){
            var box =$('<div id="m-tip" style="' + userCommon.warnMessage('4%','30%') +'">有小红星标示的选项为必填<div>');
            $("#userCreateBody").before(box);
             userCommon.warnMessageRemove(box);
           return false;
        }
        else if($.inArray('Receive_Pro_Contracts',userCommon.array)!=-1){
             if(userCommon.dataCode.userType==undefined||userCommon.dataCode.userType==2){
                 if($('#companyName').val()==""||$('#companyAccount').val()==""||$('#companyAccountName').val()==""||$('#companyAddress').val()==""||$('#companyEmail').val()==""||$('#companyPhone').val()==""){
                     var box =$('<div id="m-tip" style="' + userCommon.warnMessage('4%','30%') +'">有小红星标示的选项为必填<div>');
                     $("#userCreateBody").before(box);
                     userCommon.warnMessageRemove(box);
                     return false;
                 }
             } if(userCommon.dataCode.userType==0||userCommon.dataCode.userType==1) {
                 if($('#companyName').val()==""||$('#companyAccount').val()==""||$('#companyAccountName').val()==""||$('#userCardId').val()==""||$('#companyEmail').val()==""||$('#companyPhone').val()==""){
                     var box =$('<div id="m-tip" style="' + userCommon.warnMessage('4%','30%') +'">有小红星标示的选项为必填<div>');
                     $("#userCreateBody").before(box);
                     userCommon.warnMessageRemove(box);
                     return false;
                 }
             }
             if($('#companyEmail').val()!=""){
                 var cssText ="top:52%;left:28%;width:130px;display:inline-block; position: absolute; font:14px/1.2em '微软雅黑';padding:5px;" +
                     "box-shadow: 0px 3px 6px #aaa;border-radius: 5px;max-width:300px;opacity: 1; color: #eee;background:#FD0F0F" ;
                 var box =$('<div id="m-tip" style="' + cssText +'">请输入正确邮箱<div>');
                 if (re.test($("#companyEmail").val())) {
                     return true;
                 } else {
                     $('#companyEmail').before(box);
                     userCommon.warnMessageRemove(box);
                     return false;
                 }
             }
             else {
                 return true;
             }
        }
        else if($("#email").val()!=""){
            var box =$('<div id="m-tip" style="' +  userCommon.warnMessage('-32px','15px') +'">请输入正确邮箱<div>');
                if (re.test($("#email").val())) {
                    return true;
                } else {
                    $('#email').before(box);
                    userCommon.warnMessageRemove(box);
                    return false;
                }
        } else{
            return true;
        }
    },
    passwordOringinShow:function(){
        $('#updateShowInfo').html('');
        $("#userAccount").show()
        $('#password').hide();
        $('#passwordQuit').hide();
        $('#user_defaultpassword').text('123456').show();
        $('#user_passwordUpdate').show();
    },
    allCommon:function(){
        $("#userUpdate").on('click',function(){
            $("#userUpdate").attr("data-toggle","modal");
           $("#userUpdate").attr("data-target","#createUserInfo");
            $("#userUpdate").attr('data-backdrop','static');
            $("#createUserModal").html("编辑用户");
           userCommon.centerModals($('#createUserInfo'));
        });
        $('#save').on('click',function(){
            userCommon.createUser();
        });
        $("#dapart_filter li input").on('click',function(){
            if($(this).prop('checked')){
               // console.log($(this).val());
            }
        });
        departmentObj.bindLegalCheck([$("#username-search")],'122','-1');
        departmentObj.bindLegalCheck([$('#userAccount')],'14','-33','username'); //字母数字
        departmentObj.bindLegalCheck([$('#userName')],'14','-33','name'); //汉字字母
        departmentObj.bindLegalCheck([$('#phone')],'14','-33','number');
        departmentObj.bindLegalCheck([$('#companyClass')],'74','-28',''); //字母，数字，汉字
        departmentObj.bindLegalCheck([$('#companyType')],'50','-28','');
        departmentObj.bindLegalCheck([$('#companyName')],'74','-28','');
        departmentObj.bindLegalCheck([$('#companyCode')],'50','-28','');
        departmentObj.bindLegalCheck([$('#companyPhone')],'50','-28','number');
        departmentObj.bindLegalCheck([$('#companyAddress')],'30','-33','');
        departmentObj.bindLegalCheck([$('#userCardId')],'30','-33','username');
      //  departmentObj.bindLegalCheck([$('#companyBankAddress')],'72','-28','');
       // departmentObj.bindLegalCheck([$('#companyBank')],'50','-28','');
        departmentObj.bindLegalCheck([$('#companyAccount')],'20','-33','number'); //数字
        $('#createUserAllInfo').on('click',function(){
            userCommon.dataCode.userInfo='';
            $("#save").removeAttr("data-dismiss");
            $("#save").removeAttr("aria-label");
            $('#password').parent().parent().css({display:'block'});
            $('.modal').on('show.bs.modal', userCommon.centerModals($('#createUserInfo')));
            userCommon.getDepartment();
           // userCommon.getALLRoleAuth();
        });
        $("#quitSave").on('click',function () {
            userCommon.dataCode.userType='';
            userCommon.array=[];
            userCommon.passwordOringinShow();
            $('#quitSave').removeAttr("data-toggle");
            $('#quitSave').removeAttr("data-target");
            $('#quitSave').removeAttr("data-backdrop");
            if(userCommon.dataCode.userInfo!=''){
                $('.userImg').css({visibility:'	visible'});
                $('#quitSave').attr("data-toggle","modal");
                $('#quitSave').attr("data-target","#userLook");
                $('#quitSave').attr("data-backdrop","static");
                userCommon.selectUser('',userCommon.dataCode.userInfo.id);
            }
                $("#createUserModal").html("新建用户");
                $("#quitSave").attr("data-dismiss", "modal");
                $("#quitSave").attr("aria-label", "Close");
                $(".form-group input").val("");
                $(".userHas").show();
                $('#companyInfo').css({display: "none"});

        });
        $('#updatesDelete').on('click',function(){
            userCommon.dataCode.userInfo='';
           $("#save").removeAttr("data-dismiss");
            $("#save").removeAttr("aria-label");
            //$('.userImg').css({visibility:'	visible'});
            //$('#password').parent().parent().css({display:'block'});
            $('.modal').on('show.bs.modal', userCommon.centerModals($('#createUserInfo')));
        });
        $('#closeCreate').on('click',function(){
            userCommon.dataCode.userType='';
            userCommon.array=[];
            userCommon.passwordOringinShow();
            userCommon.dataCode.userInfo='';
            $("#closeCreate").attr("data-dismiss","modal");
            $("#closeCreate").attr("aria-label","Close");
            $(".form-group input").val("");
            $(".userHas").show();
            $('#companyInfo').css({display:"none"});
        });
        $('#user_passwordUpdate').on('click',function(){
            $("#user_defaultpassword").hide();
            $('#user_passwordUpdate').hide();
            $('#password').css({'display':'block'});
            $('#passwordQuit').css({'display':'block'});
        });
        $('#passwordQuit').on('click',function(){
            userCommon.passwordOringinShow();
        });
        $("#hasChild a").hover(function (){
            $("#department").css({display:"block"});
        });
        /*点击body用户筛选消失*/
        $('body').on('click.ompa',function(){
            userCommon.DRFilter.hide();
        });//取消 隐藏
        $('#user_filter_box').on('click',function(ev){
            ev.stopPropagation();
        });
        $('#user_filter').on('click',function(){
            if($('#dapart_filter').css('display')=='none'){
                userCommon.DRFilter.show();
                userCommon.DRFilter.recored();
            }else{
                userCommon.DRFilter.hide();
            }

        });//显示
        $('#dapart_filter_sure').on('click',function(){
            userCommon.DRFilter.init();
        });
        $('#username-search').on('input propertychange',function(){
            var username = $(this).val();
            if(username==''){
                //userCommon.flag=true;
                userCommon.Pointer='';
                userCommon.user_array=[];
                userCommon.dataCode.pageNum=1;
                userCommon.dataCode.pageCount='';
                userCommon.getCount();
                $.ajax({
                    type: 'post',
                    async: true,
                    dataType: 'json',
                    data: {offset: 0},
                    url: '/api/user/getTenUsers',
                    success: function (data) {
                        if(data.data.length!=0){
                            $('#tablefather').show();
                            $("#user-nouser").hide();
                            $('#user-nosearch').hide();
                            userCommon.refresh(data);
                            $('#userList_paginate span>a').html(userCommon.dataCode.user_drop);
                            $('#userdropdownMenu').html(userCommon.dataCode.pageNum+'/'+userCommon.dataCode.pageCount);
                        }else{
                            $('#tablefather').hide();
                            $('#user-nosearch').hide();
                            $("#user-nouser").show();
                        }
                    },
                    error: function () {

                    }
                });
            }else {
                //userCommon.flag=false;
                $.ajax({
                    method: 'get',
                    url: '/api/user/search',
                    data: {'name': username},
                    success: function (data) {
                        if(data.list.length==0){
                            $('#tablefather').hide();
                            $("#user-nouser").hide();
                            $('#user-nosearch').show();
                        }else {
                            userCommon.userCommonsearch(data.list);
                        }
                    },
                    error: function (data) {
                        console.log(data);
                    }

                });
            }

        });

    },
    getCount:function(){
        $.ajax({
            type: 'post',
            async: true,
            dataType:'json',
            url: '/api/user/getCount',
            success: function (data) {
              userCommon.dataCode.pageCount=data.count;
                if(data.count>=1){
                    var str='';
                   for(var i=0;i<data.count;i++){
                       str +='<li ><a href="#" style="border: none;padding-left: 21px;padding-right: 21px;height: 20px;">'+(i+1)+'</a></li>';
                   }
                   var stpm='<div class="dropup" id="user_pageCount">'+
                       '<p class="dropdown-toggle"  id="userdropdownMenu" data-toggle="dropdown" >'+
                       userCommon.dataCode.pageNum+'/'+userCommon.dataCode.pageCount +
                        '</p>'+
                        '<ul  id="user_dropmenu" class="dropdown-menu" style="padding: 0;min-width: 0;margin-left:-4%;max-height: 104px;height:auto;overflow-y: auto ">'+ str+'</ul>'+
                       '</div>';
                    userCommon.dataCode.user_drop=stpm;
                    userCommon.dataCode.pageAll=data.all;
                }
                $('#userList_paginate span>a').html(stpm);
                $('#userList_info').html('共'+data.all+'条');
            },
            error: function (err) {
                console.log(JSON.stringify(err));
            }
        });

    },
    userCommonsearch:function(data){
        $('#tablefather').show();
        $("#user-nouser").hide();
        $('#user-nosearch').hide();
        var arr = userCommon.showSearchData(data);
        console.log('arr'+arr);
        userCommon.user_array=arr;
        userCommon.Pointer=0;
        userCommon.dataCode.pageNum=1;
        var les=(userCommon.user_array.length)%10;
        if(les!=0){
            userCommon.dataCode.pageCount=parseInt(userCommon.user_array.length/10)+1;
        }else{
            userCommon.dataCode.pageCount=parseInt(userCommon.user_array.length/10);
        }
        var table = $('#userList').DataTable();
        //清空数据
        table.clear().draw();
        //重新加载数据
        table.rows.add(userCommon.user_array.slice(0,10)).draw(true);
        if(userCommon.user_array.length>10){
            console.log('aaa'+userCommon.dataCode.user_drop);
           userCommon.showPage(userCommon.user_array.length);
        }else{
            $('#userList_paginate span>a').html(userCommon.dataCode.user_drop);
            $('#userdropdownMenu').html('1/1');
            $('#userList_info').html('共'+userCommon.user_array.length+'条');
        }
       userCommon.searchResClick(userCommon.dataCode.pageCount);
    },
    searchResClick:function(data){
        var str='';
        for(var i=0;i<data;i++){
            str +='<li ><a href="#" style="border: none;padding-left: 21px;padding-right: 21px;height: 20px;">'+(i+1)+'</a></li>';
        }
        var stpm='<div class="dropup" id="user_pageCount">'+
            '<p class="dropdown-toggle"  id="userdropdownMenu" data-toggle="dropdown">'+
            userCommon.dataCode.pageNum+'/'+userCommon.dataCode.pageCount +
            '</p>'+
            '<ul  id="user_dropmenu" class="dropdown-menu" style="padding: 0;margin-left: -4%;min-width: 0;max-height: 104px;height:auto;overflow-y: auto">'+ str+'</ul>'+
            '</div>';
        $('#userList_paginate span>a').html(stpm);
        $('#userdropdownMenu').html(userCommon.dataCode.pageNum+'/'+userCommon.dataCode.pageCount);
        $('#userList_info').html('共'+userCommon.user_array.length+'条');
        $(".dataTables_scrollHeadInner").css({'width':'100%','background':'#f2f2f2'});
        $(".dataTables_scrollHeadInner table").css({'width':'100%'});
    },
    initDataTable:function(paramdata){
        $("#userList").dataTable({
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
            "data":paramdata,
            "columns": [
                {"data": "name", "title": "姓名"},
                {"data": "username", "title": "登录账号"},
                {"data": "role", "title": "角色"},
                {"data": "department", "title": "部门"},
                {"data": "phone", "title": "电话"},
                {"data": "newTime", "title": "更新时间"},
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

        $('#userList tbody').on('click','tr td:first-child',function(){
            /*  if ( $(this).hasClass('selected') ) {
             $(this).removeClass('selected');
             }*/
            // table.$('tr.selected').removeClass('selected');
            // $(this).addClass('selected');
            userCommon.selectUser(this,'');
            $('.userImg').css({visibility:'	visible'});
            $(this).attr("data-toggle","modal");
            $(this).attr("data-target","#userLook");
            $(this).attr("data-backdrop","static");
        });
        $(".dataTables_scrollHeadInner").css({'width':'100%','background':'#f2f2f2'});
        $(".dataTables_scrollHeadInner table").css({'width':'100%'});
        $("#userList_paginate a").removeClass('disabled');
        userCommon.dataCode.pageNum= $('#userList_paginate span>a').text();
        $("#userList_paginate").on('click','#userList_next',function() {
           // console.log('11'+userCommon.Pointer);
           // console.log('22'+userCommon.dataCode.pageCount);
            if(userCommon.user_array.length==0){
                console.log('iii');
               // userCommon.user_flag=true;
                userCommon.offset=userCommon.offset+1;
                $.ajax({
                    type: 'post',
                    async: true,
                    dataType: 'json',
                    data:{offset:userCommon.offset},
                    url: '/api/user/getTenUsers',
                    success: function (data) {
                        if(data.data.length!=0){
                            //console.log("hhhh"+JSON.stringify(data));
                            userCommon.refresh(data);
                            userCommon.dataCode.pageNum++;
                            userCommon.showPage(userCommon.dataCode.pageAll);
                        }else{
                            userCommon.offset=userCommon.offset-1;
                        }
                    },
                    error:function(err){
                        console.log(err);
                    }
                });
            }else if(userCommon.user_array.length>10&&userCommon.dataCode.pageNum<userCommon.dataCode.pageCount){
                userCommon.Pointer+=10;
                console.log('hhhh'+userCommon.Pointer);
                var table = $('#userList').DataTable();
                //清空数据
                table.clear().draw();
                //重新加载数据
                table.rows.add(userCommon.user_array.slice(userCommon.Pointer,userCommon.Pointer+10)).draw(true);
                userCommon.dataCode.pageNum++;
                userCommon.showPage(userCommon.user_array.length);
            }
        });
        $("#userList_paginate").on('click','#userList_previous',function() {
            if(userCommon.user_array.length==0){
               // userCommon.user_flag=true;
                if(userCommon.offset>'0'){
                    userCommon.offset=userCommon.offset-1;
                }
                $.ajax({
                    type: 'post',
                    async: true,
                    dataType: 'json',
                    data:{offset:userCommon.offset},
                    url: '/api/user/getTenUsers',
                    success: function (data) {
                        userCommon.refresh(data);
                        if(userCommon.dataCode.pageNum>1){
                            userCommon.dataCode.pageNum--;
                            userCommon.showPage(userCommon.dataCode.pageAll);
                        }else{
                            $('#userList_paginate span>a').html(userCommon.dataCode.user_drop);
                            $('#userList_info').html('共'+userCommon.dataCode.pageAll+'条');
                        }
                    },
                    error:function(err){
                        console.log(err);
                    }
                });
            }else if(userCommon.user_array.length>10&&userCommon.Pointer>=1){
                var table = $('#userList').DataTable();
                //清空数据
                table.clear().draw();
                //重新加载数据
                table.rows.add(userCommon.user_array.slice(userCommon.Pointer-10,userCommon.Pointer)).draw(true);
                userCommon.Pointer-=10;
                userCommon.dataCode.pageNum--;
                userCommon.showPage(userCommon.user_array.length);
            }
        });
        $("#userList_paginate").on('click','#userList_first',function() {
            if(userCommon.user_array.length==0){
              //  userCommon.user_flag=true;
                userCommon.offset=0;
                $.ajax({
                    type: 'post',
                    async: true,
                    dataType: 'json',
                    data:{offset:0},
                    url: '/api/user/getTenUsers',
                    success: function (data) {
                        userCommon.refresh(data);
                        userCommon.dataCode.pageNum=1;
                        userCommon.showPage(userCommon.dataCode.pageAll);
                    },
                    error:function(err){
                        console.log(err);
                    }});
            }else{
                var table = $('#userList').DataTable();
                //清空数据
                table.clear().draw();
                //重新加载数据
                table.rows.add(userCommon.user_array.slice(0,10)).draw(true);
                userCommon.Pointer=0;
                userCommon.dataCode.pageNum=1;
                userCommon.showPage(userCommon.user_array.length);
            }
        });
        $("#userList_paginate").on('click','#userList_last',function() {
            if(userCommon.user_array.length==0){
              //  userCommon.user_flag=true;
                $.ajax({
                    type: 'post',
                    async: true,
                    dataType: 'json',
                    url: '/api/user/getLastUser',
                    success: function (data) {
                        userCommon.offset=data.offset;
                        userCommon.dataCode.pageNum=data.offset+1;
                        userCommon.refresh(data);
                        userCommon.showPage(userCommon.dataCode.pageAll);
                    },
                    error:function(err){
                        console.log(err);
                    }});
            }else{
                var les=(userCommon.user_array.length)%10;
                console.log('les'+les);
                var pageBefore='';
                if(les!=0){
                    pageBefore=userCommon.user_array.length%10;
                }else{
                    pageBefore=userCommon.user_array.length-10;
                }

                var table = $('#userList').DataTable();
                //清空数据
                table.clear().draw();
                //重新加载数据
                table.rows.add(userCommon.user_array.slice(userCommon.user_array.length-pageBefore,userCommon.user_array.length)).draw(true);
                userCommon.dataCode.pageNum=userCommon.dataCode.pageCount;
                userCommon.Pointer=userCommon.user_array.length-pageBefore;
                userCommon.showPage(userCommon.user_array.length);
            }
        });
        $('#userdropdownMenu').dropdown('toggle');
        //$('body').off('click').on('click','.paginate_button.current',function(e){
        //    console.log($('#user_dropmenu').css('display'));
        //    if($('#user_dropmenu').css('display') == 'none'){
        //        $('#user_dropmenu').show();
        //        e.stopPropagation();
        //    }else{
        //        $('#user_dropmenu').hide();
        //
        //        e.stopPropagation();
        //    }
        //
        //});
        //$(document).off('click').on('click', function(e){
        //    if($('#user_dropmenu').css('display') == 'none'){
        //        e.stopPropagation();
        //    }else{
        //        $('#user_dropmenu').hide();
        //        e.stopPropagation();
        //    }
        //});
       $('body').on('click.ompa','#user_pageCount ul li',function(){
           if(userCommon.user_array.length==0){
               userCommon.dataCode.pageNum=1;
               userCommon.Pointer=0;
               userCommon.offset=0;
               var _this=$(this);
               userCommon.offset=$(this).index();
               $('#user_dropmenu').hide();
               //userCommon.user_flag=true;
               $.ajax({
                   type: 'post',
                   async: true,
                   dataType: 'json',
                   data:{offset:userCommon.offset},
                   url: '/api/user/getTenUsers',
                   success: function (data) {
                       userCommon.refresh(data);
                       userCommon.dataCode.pageNum=_this.children().text();
                       userCommon.showPage(userCommon.dataCode.pageAll);
                   },
                   error:function(err){
                       console.log(err);
                   }
               });
           }else{
               userCommon.dataCode.pageNum=$(this).children().text();
               var table = $('#userList').DataTable();
               //清空数据
               table.clear().draw();
               //重新加载数据
               table.rows.add(userCommon.user_array.slice(userCommon.dataCode.pageNum*10-10,userCommon.dataCode.pageNum*10)).draw(true);
               userCommon.Pointer=userCommon.dataCode.pageNum*10-10;
               userCommon.searchResClick(userCommon.dataCode.pageCount);
           }
       });
    },
    showPage:function(data){
        $('#userList_paginate span>a').html(userCommon.dataCode.user_drop);
        $('#userdropdownMenu').html(userCommon.dataCode.pageNum+'/'+userCommon.dataCode.pageCount);
        $('#userList_info').html('共'+data+'条');
    },
    getDepartment:function(){
        $.ajax({
            type: 'get',
            async: true,
            dataType:'json',
            url: '/api/department/getDepList',
            success: function (data) {
                userCommon.DRFilter.departmentList=data.list;
                userCommon.DRFilter.createDepartmentFilter();
                var str='';
                if(data.list){
                    for(var i=0;i<data.list.length;i++) {
                        str += ' <li ><a href="#" onclick="userCommon.selectDepartment(this)" data-value="' + data.list[i].id + '" data-name="'+data.list[i].name+'">'+ data.list[i].name+'</a></li>';
                    }
                    $("#dropDeparment").html(str);
                }
            },
            error: function (err) {
                console.log(JSON.stringify(err));
            }
        });
    },
    getRole:function(){
        $.ajax({
            type: 'get',
            async: true,
            dataType:'json',
            url: '/api/role/',
            success: function (data) {
                userCommon.DRFilter.roleList=data.list;
                userCommon.DRFilter.createRoleFilter();
            },
            error: function (err) {
                console.log(JSON.stringify(err));
            }
        });
    },
    DRFilter:{
        roleList:[],
        departmentList:[],
        userTypeList:[],
        depIdLists:[],
        roleIdLists:[],
        createDepartmentFilter:function(){
            var str='';
            for(var i=0; i<userCommon.DRFilter.departmentList.length; i++){
                str+='<li onclick="userCommon.DRFilter.DRFilterChange(this)" data-checked=""   data-value='+ userCommon.DRFilter.departmentList[i].id+'><i class="iconfont">&#xe64c;</i>'+userCommon.DRFilter.departmentList[i].name+'</li>';
            }
            $("#department_filter").html(str);
        },
        createRoleFilter:function(){
            var str='';
            for(var i=0; i<userCommon.DRFilter.roleList.length; i++){
                str+='<li onclick="userCommon.DRFilter.DRFilterChange(this)" data-checked=""   data-value='+ userCommon.DRFilter.roleList[i].id+'><i class="iconfont">&#xe64c;</i>'+userCommon.DRFilter.roleList[i].name+'</li>';
            }
            $("#role_filter").html(str);
        },
        DRFilterChange:function(e){
            var that=$(e);
            if(that.attr("data-checked")){//有
                that.removeAttr('data-checked').find('i').html('&#xe64c;').css('color','#8b8b8b'); //undifined
            }else{
                that.attr('data-checked','data-checked').find('i').html('&#xe64b;').css('color','#6dc484');; //checked
            }
        },
        historyRecord:{
            D:[],
            R:[],
            U:[]
        },
        init:function(){
            userCommon.DRFilter.depIdLists=[];
            userCommon.DRFilter.roleIdLists=[];
            userCommon.DRFilter.userTypeList=[];
           // var depIdLists=[],roleIdLists=[];
            for(var i=0; i<$('#department_filter li').length; i++){
                if($('#department_filter li').eq(i).attr('data-checked')){
                    userCommon.DRFilter.depIdLists.push($('#department_filter li').eq(i).attr('data-value'));
                }
            }
            for(var i=0; i<$('#role_filter li').length; i++){
                if($('#role_filter li').eq(i).attr('data-checked')){
                    userCommon.DRFilter.roleIdLists.push($('#role_filter li').eq(i).attr('data-value'));
                }
            }
            for(var i=0; i<$('#userType_filter li').length; i++){
                if($('#userType_filter li').eq(i).attr('data-checked')){
                    userCommon.DRFilter.userTypeList.push(parseInt($('#userType_filter li').eq(i).attr('data-value')));
                }
            }
            userCommon.DRFilter.historyRecord.D=userCommon.DRFilter.depIdLists;
            userCommon.DRFilter.historyRecord.R=userCommon.DRFilter.roleIdLists;
            userCommon.DRFilter.historyRecord.U=userCommon.DRFilter.userTypeList;
            if((userCommon.DRFilter.depIdLists.length!=0)||(userCommon.DRFilter.roleIdLists.length!=0||userCommon.DRFilter.userTypeList.length!=0)){
               // userCommon.flag=false;
                console.log('userCommon.DRFilter.userTypeList',userCommon.DRFilter.userTypeList);
                $.ajax({
                    type: 'post',
                    async: true,
                    dataType:'json',
                    url: '/api/user/getUsersByDR',
                    data:{
                        departmentId:JSON.stringify(userCommon.DRFilter.depIdLists),
                        roleId:JSON.stringify(userCommon.DRFilter.roleIdLists),
                        userType:JSON.stringify(userCommon.DRFilter.userTypeList),
                        offset:userCommon.offset
                    },
                    success:function(data){
                        console.log(data,'dasjdgasdjasgdasjg')
                        if(data.message=="getSuccess"){
                            if(data.data.length!=0){
                                userCommon.user_array=[];
                                //console.log('searchuser'+JSON.stringify(data.data));
                                userCommon.userCommonsearch(data.data);
                            }else{
                                $('#tablefather').hide();
                                $('#user-nosearch').show();
                                $("#user-nouser").hide();
                            }
                        }
                    },
                    error:function(err){
                        console.log(err);
                    }
                });
                $('#user_filter').find('i').html('&#xe674;').css('color','#f4c600');
                $('#user_filter').find('span').eq(0).html('已筛选');
            }else{
                /*重新刷新数据*/
                //userCommon.flag=true;
                userCommon.Pointer='';
                userCommon.user_array=[];
                userCommon.dataCode.pageNum=1;
                userCommon.dataCode.pageCount='';
                userCommon.getCount();
                $.ajax({
                    type: 'post',
                    async: true,
                    dataType: 'json',
                    data: {offset: 0},
                    url: '/api/user/getTenUsers',
                    success: function (data) {
                         if(data.data.length!=0){
                             $('#tablefather').show();
                             $("#user-nouser").hide();
                             $('#user-nosearch').hide();
                             userCommon.refresh(data);
                             $('#userList_paginate span>a').html(userCommon.dataCode.user_drop);
                             $('#userdropdownMenu').html(userCommon.dataCode.pageNum+'/'+userCommon.dataCode.pageCount);
                         }else{
                             $('#tablefather').hide();
                             $('#user-nosearch').hide();
                             $("#user-nouser").show();
                         }
                    },
                    error: function () {
                    }
                });
                /*重新刷新数据*/
                $('#user_filter').find('i').html('&#xe669;').css('color','#666');
                $('#user_filter').find('span').eq(0).html('未筛选');
            }
            //筛选成功
            $('#dapart_filter').hide();
            $('#user_filter').css({
                'border-bottom':'1px solid #ccc',
                'border-bottom-left-radius':'4px',
                'border-bottom-right-radius':'4px'
            });
        },
        show:function(){
            $('#user_filter').css({
                'border-bottom':'1px solid #fff',
                'border-bottom-left-radius':'0',
                'border-bottom-right-radius':'0'
            });
            $('#dapart_filter').show().css({
                'border-top-left-radius':'0',
            });
        },
        hide:function(){
            $('#dapart_filter').hide();
            $('#user_filter').css({
                'border-bottom':'1px solid #ccc',
                'border-bottom-left-radius':'4px',
                'border-bottom-right-radius':'4px'
            });
        },
        recored:function(){
            //取消 记录上次的选择
            for(var i=0; i<$('#department_filter li').length; i++){
                if(roleManage.findInArr($('#department_filter li').eq(i).attr('data-value'),userCommon.DRFilter.historyRecord.D)){
                    $('#department_filter li').eq(i).attr('data-checked','data-checked').find('i').html('&#xe64b;').css('color','#6dc484');; //checked
                }else{
                    $('#department_filter li').eq(i).find('i').html('&#xe64c;').css('color','#8b8b8b'); //undifined
                    if($('#department_filter li').eq(i).attr('data-checked')){
                        $('#department_filter li').eq(i).removeAttr('data-checked');
                    }
                }
            }
            for(var j=0; j<$('#role_filter li').length; j++){
                if(roleManage.findInArr($('#role_filter li').eq(j).attr('data-value'),userCommon.DRFilter.historyRecord.R)){
                    $('#role_filter li').eq(j).attr('data-checked','data-checked').find('i').html('&#xe64b;').css('color','#6dc484');; //checked
                }else{
                    $('#role_filter li').eq(j).find('i').html('&#xe64c;').css('color','#8b8b8b'); //undifined
                    if($('#role_filter li').eq(j).attr('data-checked')){
                        $('#role_filter li').eq(j).removeAttr('data-checked');
                    }
                }
            }
            for(var j=0; j<$('#userType_filter li').length; j++){
                if(roleManage.findInArr($('#userType_filter li').eq(j).attr('data-value'),userCommon.DRFilter.historyRecord.U)){
                    $('#userType_filter li').eq(j).attr('data-checked','data-checked').find('i').html('&#xe64b;').css('color','#6dc484');; //checked
                }else{
                    $('#userType_filter li').eq(j).find('i').html('&#xe64c;').css('color','#8b8b8b'); //undifined
                    if($('#userType_filter li').eq(j).attr('data-checked')){
                        $('#userType_filter li').eq(j).removeAttr('data-checked');
                    }
                }
            }
        }


    },
    userParams:{},
    offset:0,
    createUser:function(){
            $('#username-search').val('');
            userCommon.user_array=[];
            userCommon.DRFilter.depIdLists=[];
            userCommon.DRFilter.roleIdLists=[];
            userCommon.DRFilter.historyRecord.D=[];
            userCommon.DRFilter.historyRecord.R=[];
            $('#user_filter').find('i').html('&#xe669;').css('color','#666');
            $('#user_filter').find('span').eq(0).html('未筛选');
            if(userCommon.dataCode.userInfo!=''){
                userCommon.updateUserajax();
            }else {
                userCommon.userParams.username = $("#userAccount").val(),
                    //image:'',
                    userCommon.userParams.name = $("#userName").val(),
                    userCommon.userParams.address = $("#companyAddress").val(),
                    userCommon.userParams.account = $("#companyAccount").val(),
                    userCommon.userParams.userType = userCommon.dataCode.userType,
                    userCommon.userParams.departmentId = userCommon.dataCode.dapartmentCode,
                    userCommon.userParams.roleId = userCommon.dataCode.roleCode,
                    userCommon.userParams.companyName = $("#companyName").val(),
                    userCommon.userParams.companyCode = $("#companyCode").val(),
                    userCommon.userParams.companyBank = $("#companyBank").val(),
                    userCommon.userParams.userCardId=$('#userCardId').val(),
                    userCommon.userParams.companyBankAddress = $("#companyBankAddress").val(),
                    userCommon.userParams.companyClass = $("#companyClass").val(),
                    userCommon.userParams.companyType = $("#companyType").val(),
                    userCommon.userParams.accountName=$('#companyAccountName').val();
                if($("#companyAddress").val()!=''){
                    userCommon.userParams.userCardId='';
                }
                if ($('#password').val() != '') {
                    userCommon.userParams.password = $("#password").val();
                } else {
                    userCommon.userParams.password = $('#user_defaultpassword').text();
                }
                if ($.inArray('Receive_Pro_Contracts', userCommon.array) != -1) {
                    userCommon.userParams.phone = $("#companyPhone").val();
                    userCommon.userParams.email = $("#companyEmail").val();
                } else {
                    userCommon.userParams.phone = $("#phone").val();
                    userCommon.userParams.email = $("#email").val();
                }
                var flag = userCommon.formVolitor();
                var message='';
                if (flag == true) {
                    $.ajax({
                        type: 'post',
                        async: true,
                        data: 'data=' + JSON.stringify(userCommon.userParams) + '&offset=' + userCommon.offset,
                        url: '/api/user/createUser',
                        success: function (data) {
                            //depIdLists.length!=roleIdLists.length
                          //  socketCommon.emit().sendNotice([userCommon.userParams.departmentId]);
                            $("#user_defaultpassword").css({'display': 'block'}).text('123456');
                            $('#user_passwordUpdate').css({'display': 'block'});
                            $('#password').css({'display': 'none'});
                            $('#passwordQuit').css({'display': 'none'});
                            if (data.message == "createsuccess") {
                                userCommon.dataCode.userType='';
                                userCommon.array=[];
                                message=data.message;
                                userCommon.refresh(data);
                                userCommon.dataCode.pageCount=data.pagecount;
                                userCommon.dataCode.pageNum=1;
                                userCommon.offset=0;
                                $("#closeCreate").click();
                                $(".form-group input").val("");
                                $(".userHas").show();
                                $('#companyInfo').css({display: "none"});
                                userCommon.getCount();
                                $('#userList_paginate span>a').html(userCommon.dataCode.user_drop);
                                $('#userdropdownMenu').html(userCommon.dataCode.pageNum+'/'+userCommon.dataCode.pageCount);
                                var box =$('<div id="m-tip" style="' + userCommon.infoMessage('0','30%') +'">创建用户成功<div>');
                                $("#userList thead").before(box);
                                userCommon.warnMessageRemove(box);
                            } else {
                                var box =$('<div id="m-tip" style="' + userCommon.warnMessage('4%','30%') +'">用户已存在<div>');
                                $("#userCreateBody").before(box);
                                userCommon.warnMessageRemove(box);
                            }
                            userCommon.userParams = {};
                        },
                        error: function (err) {
                            console.log(err);
                        }
                    });

                }
            }
    },
     updateUserajax:function(){
         $('#username-search').val('');
         userCommon.user_array=[];
         userCommon.DRFilter.depIdLists=[];
         userCommon.DRFilter.roleIdLists=[];
         userCommon.DRFilter.historyRecord.D=[];
         userCommon.DRFilter.historyRecord.R=[];
         $('#user_filter').find('i').html('&#xe669;').css('color','#666');
         $('#user_filter').find('span').eq(0).html('未筛选');
         userCommon.userParams.name=$("#userName").val(),
         userCommon.userParams.address=$("#companyAddress").val(),
         userCommon.userParams.account=$("#companyAccount").val(),
         userCommon.userParams.userType=userCommon.dataCode.userType,
         userCommon.userParams.departmentId=userCommon.dataCode.dapartmentCode,
         userCommon.userParams.roleId=userCommon.dataCode.roleCode,
         userCommon.userParams.companyName=$("#companyName").val(),
         userCommon.userParams.companyCode=$("#companyCode").val(),
         userCommon.userParams.companyBank = $("#companyBank").val(),
         userCommon.userParams.userCardId=$('#userCardId').val(),
         userCommon.userParams.companyBankAddress=$("#companyBankAddress").val(),
         userCommon.userParams.companyClass=$("#companyClass").val(),
         userCommon.userParams.companyType=$("#companyType").val();
         userCommon.userParams.accountName=$('#companyAccountName').val();
         if($("#companyAddress").val()!=''){
             userCommon.userParams.userCardId='';
         }
        if($.inArray('Receive_Pro_Contracts',userCommon.array)!=-1){
            userCommon.userParams.phone=$("#companyPhone").val();
            userCommon.userParams.email=$("#companyEmail").val();
        }else{
            userCommon.userParams.phone=$("#phone").val();
            userCommon.userParams.email=$("#email").val();
        }
        var flag=userCommon.updateFormVolitor();
        if(flag==true){
            $.ajax({
                type: 'post',
                async: true,
                data: 'data=' + JSON.stringify(userCommon.userParams) + '&offset=' + userCommon.offset,
                url: '/api/user/createUser',
                success: function (data) {
                    console.log('hhhhhhh',data);
                   // socketCommon.emit().sendNotice([userCommon.userParams.departmentId]);
                    $("#user_defaultpassword").css({'display': 'block'}).text('123456');
                    $('#user_passwordUpdate').css({'display': 'block'});
                    $('#password').css({'display': 'none'});
                    $('#passwordQuit').css({'display': 'none'});
                    if (data.message == "updatesuccess") {
                        userCommon.dataCode.userType='';
                        userCommon.array=[];
                        var box =$('<div id="m-tip" style="' + userCommon.warnMessage('0','30%') +'">用户修改成功<div>');
                        $("#userList thead").before(box);
                        userCommon.warnMessageRemove(box);
                        userCommon.refresh(data);
                        userCommon.getCount();
                        $('#userList_paginate span>a').html(userCommon.dataCode.user_drop);
                        $('#userdropdownMenu').html(userCommon.dataCode.pageNum+'/'+userCommon.dataCode.pageCount);
                    }
                    userCommon.dataCode.userInfo='';
                    userCommon.userParams = {};
                },
                error: function (err) {
                    console.log(err);
                }
            });
            $("#userAccount").show();
            $('#updateShowInfo').html('');
            $('#createUserModal').html("新建用户");
            $("#save").attr("data-dismiss", "modal");
            $("#save").attr("aria-label", "Close");
            $(".form-group input").val("");
            $(".userHas").show();
            $('#companyInfo').css({display: "none"});
        }
    },
    refresh:function(data){
        $('#tablefather').show();
        $("#user-nouser").hide();
        var usertype = '';
        if (data.data.userType == '0') {
            usertype = '内部用户';
        } else {
            usertype = '外部用户';
        }
        var arr=[];
        var time='';
        for(var i=0;i<data.data.length;i++) {
           // if (data.data[i].userType == '0') {
                time=(data.data[i].createdAt).substr(0,10);
                arr.push({
                    "DT_RowId":data.data[i].id,
                    "name": data.data[i].name,
                    "username": data.data[i].username,
                    "department": data.data[i].Department.name,
                    "role": data.data[i].Role.name,
                    "phone": data.data[i].phone,
                    "newTime":time
                });
            //} else {
            //    arr.push({
            //        "DT_RowId":data.data[i].id,
            //        "name": data.data[i].name,
            //        "username": data.data[i].username,
            //        "department": data.data[i].Department.name,
            //        "role": data.data[i].Role.name,
            //        "phone": data.data[i].phone,
            //        "newTime":time
            //    });
            //}
        }
        var table = $('#userList').DataTable();
        //清空数据
        table.clear().draw();
        //重新加载数据
        table.rows.add(arr).draw(true);
        $(".dataTables_scrollHeadInner").css({'width':'100%','background':'#f2f2f2'});
        $(".dataTables_scrollHeadInner table").css({'width':'100%'});
    },
    userCallback:function(data){
        if(data){
            //$('#userLook').hide();
            //$('.modal-backdrop').hide();
            userCommon.deleteUser();
            $("#updatesDelete").click();
        }
    },
    deleteUser:function(){
        $('#username-search').val('');
        userCommon.user_array=[];
        userCommon.DRFilter.depIdLists=[];
        userCommon.DRFilter.roleIdLists=[];
        userCommon.DRFilter.historyRecord.D=[];
        userCommon.DRFilter.historyRecord.R=[];
        $('#user_filter').find('i').html('&#xe669;').css('color','#666');
        $('#user_filter').find('span').eq(0).html('未筛选');
        //$('.userImg').css({visibility:'	visible'});
        //$('#password').parent().parent().css({display:'block'});
        userCommon.userParams.id=userCommon.dataCode.userInfo.id;
        console.log('ppp'+userCommon.offset);
        $.ajax({
            type: 'post',
            async: true,
            dataType:'json',
            data:'id='+JSON.stringify(userCommon.userParams.id)+'&offset='+userCommon.offset,
            url: '/api/user/deleteUser',
            success:function(data) {
                console.log('aaaa'+JSON.stringify(data));
                if (data.message) {
                    if(data.data!=0){
                        $('#tablefather').show();
                        $("#user-nouser").hide();
                        var box =$('<div id="m-tip" style="' + userCommon.warnMessage('0','30%') +'">用户删除成功<div>');
                        $("#userList thead").before(box);
                        userCommon.warnMessageRemove(box);
                        //userCommon.dataCode.pageNum=data.page;
                        userCommon.dataCode.pageCount=data.count;
                        userCommon.refresh(data);
                        userCommon.getCount();
                        $('#userList_paginate span>a').html(userCommon.dataCode.user_drop);
                        $('#userdropdownMenu').html(userCommon.dataCode.pageNum+'/'+userCommon.dataCode.pageCount);
                    }else{
                        $('#tablefather').hide();
                        $("#user-nouser").show();
                    }
                }
                userCommon.userParams = {};
            },
            error:function(err){
                console.log(err);
            }
        });
    },
    initGetUsers:function(){
        var arr=[];
        $.ajax({
            type: 'post',
            async: true,
            dataType:'json',
            url: '/api/user/getAllusers',
            success:function(data){
                if(data.message=="getSuccess"){
                        for(var i=0;i<data.data.length;i++) {
                            if (data.data[i].username == "admin"){
                                 //data.data.pop(data.data[i]);
                                continue;
                            }
                            if (data.data[i].userType == '0') {
                                arr.push({
                                    "DT_RowId":data.data[i].id,
                                    "name": data.data[i].name,
                                    "username": data.data[i].username,
                                    "role": data.data[i].Role.name,
                                    "department": data.data[i].Department.name,
                                    "fenlei": "内部用户"
                                });
                            } else {
                                arr.push({
                                    "DT_RowId":data.data[i].id,
                                    "name": data.data[i].name,
                                    "username": data.data[i].username,
                                    "role": data.data[i].Role.name,
                                    "department": data.data[i].Department.name,
                                    "fenlei": "外部用户"
                                });
                            }
                        }
                        userCommon.initDataTable(arr);
                    if(data.data.length==1&&data.data[0].username=='admin'){
                        $('#tablefather').hide();
                        $("#user-nouser").show();
                    }else {
                        $('#tablefather').show();
                        $("#user-nouser").hide();
                    }
                    }

            },
            error:function(err){
                console.log(err);
            }
        });

    },
    initTenUsers:function(){
        var arr=[];
        $.ajax({
            type: 'post',
            async: true,
            dataType:'json',
            data:{offset:userCommon.offset},
            url: '/api/user/getTenUsers',
            success:function(data){
                if(data.message=="getTenSuccess"){
                    var time='';
                    for(var i=0;i<data.data.length;i++) {
                        time=(data.data[i].createdAt).substr(0,10);
                        //time=time.replace('Z',' UTC');
                        //console.log('date'+time.substr(0,10));
                        if (data.data[i].username == "admin"){
                            //data.data.pop(data.data[i]);
                            continue;
                        }
                       // if (data.data[i].userType == '0') {
                            arr.push({
                                "DT_RowId":data.data[i].id,
                                "name": data.data[i].name,
                                "username": data.data[i].username,
                                "department": data.data[i].Department.name,
                                "role": data.data[i].Role.name,
                                "phone": data.data[i].phone,
                                "newTime":time
                            });
                        //} else {
                        //    arr.push({
                        //        "DT_RowId":data.data[i].id,
                        //        "name": data.data[i].name,
                        //        "username": data.data[i].username,
                        //        "department": data.data[i].Department.name,
                        //        "role": data.data[i].Role.name,
                        //        "phone": data.data[i].phone,
                        //        "newTime":time
                        //    });
                        //}
                    }
                    userCommon.initDataTable(arr);
                    if(data.data.length==0){
                        $('#tablefather').hide();
                        $("#user-nouser").show();
                    }else {
                        $('#tablefather').show();
                        $("#user-nouser").hide();
                    }
                }

            },
            error:function(err){
                console.log(err);
            }
        });

    },
    selectUser:function(th,userId) {
        var id='';
        if(th){
            id= $(th).parent().attr('id');
        }else{
            id=userId;
        }
        $.ajax({
            type: 'post',
            async: true,
            dataType:'json',
            data:{id:id},
            url: '/api/user/getuser',
            success:function(data){
                var str='';
                userCommon.dataCode.dapartmentCode=data.data.departmentId;
                userCommon.dataCode.roleCode=data.data.roleId;
                userCommon.dataCode.userInfo=data.data;
                userCommon.dataCode.userType=data.data.userType;
                userCommon.array=[];
                for(var i=0;i<data.roleAuth.length;i++) {
                    for (var j = 0; j < data.roleAuth[i].Authorities.length; j++) {
                        userCommon.array.push(data.roleAuth[i].Authorities[j].name);
                    }
                }
                if(data.message){
                    var userSingleType='';
                    switch (data.data.userType){
                        case 0:userSingleType='内部个人';break;
                        case 1:userSingleType='外部个人';break;
                        case 2:userSingleType='外部企业'; break;
                    }
                    $('.userImg img').attr('src',configInfo.server_url+'/'+data.data.image);
                    $('#updateUserModal').html(data.data.name);
                   if($.inArray('Receive_Pro_Contracts',userCommon.array)==-1){
                       $("#innerList").show();
                       $(".companyLook").css({display:"none"});
                       if(!data.data.phone) data.data.phone=''; //不显示null
                       if(!data.data.email) data.data.email=''; //不显示null
                       str=' <li><b>登录账号&nbsp;&nbsp;:</b>'+ data.data.username+'</li>\
                          <li><b>姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名&nbsp;&nbsp;:</b>'+data.data.name+'</li>\
                       <li><b>所属部门&nbsp;&nbsp;:</b>'+((data.data.Department)?(data.data.Department.name):(''))+'</li>\
                       <li><b>用户类型&nbsp;&nbsp;:</b>'+userSingleType +'</li>\
                       <li><b>分配角色&nbsp;&nbsp;:</b>'+data.data.Role.name+'</li>\
                       <li><b>电<span style="visibility: hidden">占位</span>话&nbsp;&nbsp;:</b>'+data.data.phone+'</li>\
                       <li><b>邮<span style="visibility: hidden">占位</span>箱&nbsp;&nbsp;:</b>'+data.data.email+'</li>';
                       $("#innerList").html(str);
                       $("#innerList").css({display:"block"});
                       $('#userLook').on('show.bs.modal', userCommon.centerModals( $('#userLook')));
                   }else{
                       var srr='<b>公司地址&nbsp;&nbsp;:</b>'+ data.data.address;
                       if(data.data.userType!=2){
                           srr='<b>身份证号&nbsp;&nbsp;:</b>'+ data.data.userCardId;
                       }
                       str=' <ul class="list-unstyled" id="outerUserList">\
                           <li><b>登录账号&nbsp;&nbsp;:</b>'+data.data.username+'</li>\
                       <li><b>姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名&nbsp;&nbsp;:</b>'+data.data.name +'</li>\
                       <li><b>用户类型&nbsp;&nbsp;:</b>'+userSingleType+'</li>\
                       <li><b>所属部门&nbsp;&nbsp;:</b>'+data.data.Department.name +'</li>\
                       <li><b>分配角色&nbsp;&nbsp;:</b>'+data.data.Role.name +'</li>\
                       </ul>\
                       <ul class="list-inline" id="outerList">\
                       <li style="width: 50%;"><b >等级&nbsp;:</b>'+ data.data.companyClass+'</li>\
                       <li style="width: 40%"><b>类型&nbsp;&nbsp;:</b>'+ data.data.companyType+'</li>\
                       <li style="width: 50%;margin-left: -13%"><b>签约方名称&nbsp;&nbsp;:</b>'+ data.data.companyName+'</li>\
                       <li style="width: 40%;margin-left: 13%"><b>编码&nbsp;&nbsp;:</b>'+ data.data.companyCode+'</li>\
                       <li style="width: 50%"><b>邮箱&nbsp;:</b>'+ data.data.email+'</li>\
                       <li style="width: 40%"><b>电话&nbsp;&nbsp;:</b>'+data.data.phone+'</li>\
                       <li style="width: 100%;margin-left: -9%">'+srr +'</li>\
                       <li style="width: 50%;margin-left: -13%"><b>开户人名称&nbsp;&nbsp;:</b>'+ data.data.accountName+'</li>\
                       <li style="width: 40%;margin-left: 9%"><b>开户行&nbsp;&nbsp;:</b>'+data.data.companyBank+'</li>\
                       <li style="width: 100%;margin-left: -13%"><b>开户行地址&nbsp;&nbsp;:</b>'+ data.data.companyBankAddress+'</li>\
                       <li style="width: 100%"><b>账号&nbsp;:</b>'+data.data.account+'</li>\
                       </ul>';

                       $(".companyLook").html(str);
                       $("#innerList").hide();
                       $(".companyLook").css({display:"block"});
                       $('#userLook').on('show.bs.modal', userCommon.centerModals( $('#userLook')));
                   }
                }
            },
            error:function(err){
                console.log(err);
            }
        });
    } ,
    updateUser:function(){
        $("#save").removeAttr("data-dismiss");
        $("#save").removeAttr("aria-label");
        $("#userAccount").hide();
        $('#updateShowInfo').html(userCommon.dataCode.userInfo.username);
        userCommon.userParams.id=userCommon.dataCode.userInfo.id;
        $('.userImg').css({visibility:'hidden'});
        $('#password').parent().parent().css({display:'none'});
        var userBelongType='';
        userCommon.dataCode.userType=userCommon.dataCode.userInfo.userType;
        switch (userCommon.dataCode.userInfo.userType){
            case 0:userBelongType='内部个人';break;
            case 1:userBelongType='外部个人';break;
            case 2:userBelongType='外部企业'; break;
        }
      if($.inArray('Receive_Pro_Contracts',userCommon.array)==-1){
          $('#userName').val(userCommon.dataCode.userInfo.name);
          $('#userDepartment').val(userCommon.dataCode.userInfo.Department.name);
          $('#userBelongType').val(userBelongType);
          $('#userRole').val(userCommon.dataCode.userInfo.Role.name);
          $('#phone').val(userCommon.dataCode.userInfo.phone);
          $('#email').val(userCommon.dataCode.userInfo.email);
      }else{
          $('#userName').val(userCommon.dataCode.userInfo.name);
          $('#userDepartment').val(userCommon.dataCode.userInfo.Department.name);
          $('#userBelongType').val(userBelongType);
          $('#userRole').val(userCommon.dataCode.userInfo.Role.name);
          $('#companyClass').val(userCommon.dataCode.userInfo.companyClass);
          $('#companyType').val(userCommon.dataCode.userInfo.companyType);
          $('#companyName').val(userCommon.dataCode.userInfo.companyName);
          $('#companyCode').val(userCommon.dataCode.userInfo.companyCode);
          $('#companyEmail').val(userCommon.dataCode.userInfo.email);
          $('#companyPhone').val(userCommon.dataCode.userInfo.phone);
          if(userCommon.dataCode.userInfo.userType==2){
              $('#userSingle').hide();
              $('#userOuter').show();
              $('#companyAddress').val(userCommon.dataCode.userInfo.address);
          }else if(userCommon.dataCode.userInfo.userType==1||userCommon.dataCode.userInfo.userType==0){
              $('#userOuter').hide();
              $('#userSingle').show();
              $('#userCardId').val(userCommon.dataCode.userInfo.userCardId);
          }
          $('#companyBankAddress').val(userCommon.dataCode.userInfo.companyBankAddress);
          $('#companyBank').val(userCommon.dataCode.userInfo.companyBank);
          $('#companyAccount').val(userCommon.dataCode.userInfo.account);
          $('#companyAccountName').val(userCommon.dataCode.userInfo.accountName);
          $(".userHas").hide();
          $('#companyInfo').css({display:"block"});
           }
    },
    showSearchData:function(data){
        console.log('timetine44444++'+data.length);
        var arr=[];
        var time='';
        for(var i=0;i<data.length;i++) {
            $('#userList tbody tr td:first-child ').attr("data-value",data[i].id);
            time=(data[i].createdAt).substr(0,10);
            console.log('timetine++'+time);
          //  if (data[i].userType == '0') {
                arr.push({
                    "DT_RowId":data[i].id,
                    "name": data[i].name,
                    "username": data[i].username,
                    "department": (data[i].Department)?data[i].Department.name:'',
                    "role": data[i].Role.name,
                    "phone": data[i].phone,
                    "newTime":time
                });
            //} else {
            //    arr.push({
            //        "DT_RowId":data[i].id,
            //        "name": data[i].name,
            //        "username": data[i].username,
            //        "department":data[i].Department.name,
            //        "role": data[i].Role.name,
            //        "phone": data[i].phone,
            //        "newTime":time
            //    });
            //}
        }
        if(data.length==0){
            $('#tablefather').hide();
            $("#user-nouser").show();
        }else {
            $('#tablefather').show();
            $("#user-nouser").hide();
        }
        return arr;
    },
    getALLRoleAuth:function(){
      $.ajax({
          type: 'post',
          async: true,
          dataType:'json',
          url: '/api/user/getAllRoles',
          success:function(data){
              userCommon.DRFilter.roleList=data.list;
              userCommon.DRFilter.createRoleFilter();
              var str='';//过滤
             // console.log("rolerole+"+JSON.stringify(data));
              if(data.list){
                  for(var i=0;i<data.list.length;i++) {
                      var srr=[];
                      for(var j=0;j<data.list[i].Authorities.length;j++){
                          srr.push(data.list[i].Authorities[j].name);
                      }
                      str += ' <li ><a href="#" onclick="userCommon.showCompany(this)" data-value="' + data.list[i].id + '" data-content="'+
                          srr+'" data-name="'+data.list[i].name+'">'+ data.list[i].name+'</a></li>';
                  }
                  $("#dropRole").html(str);
              }
          },
          error:function(err){
              console.log(err);
          }
      });
  },
    selectEmpty:function(){
        userCommon.DRFilter.historyRecord.D=[];
        userCommon.DRFilter.historyRecord.R=[];
    },
    init:function(){
        userCommon.offset=0;
        userCommon.selectEmpty();
        userCommon.allCommon();
        userCommon.getALLRoleAuth();
        userCommon.initTenUsers();
        userCommon.getDepartment();
        userCommon.getRole();
        userCommon.getCount();

        //userCommon.DRFilter.init();/*
    }
};


