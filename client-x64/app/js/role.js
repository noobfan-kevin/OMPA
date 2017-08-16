/**
 * Created by hk054 on 2016/3/15.
 */
var roleManage = {
    authorities_n:0,
    authorityIdList:[],
    limitHeight:0,
    setRoleScroll:function(){
        roleManage.limitHeight=$(window).height()-120-$('.role_table1').height();
        $('.role_table2_box').css('height',roleManage.limitHeight-5+'px');
        $('.role_table2_box').css('width',$('.role_table1').outerWidth()+9+'px');
        $('.role_table2').css('width',$('.role_table1').outerWidth()+'px');
    },
    init: function () {
        //console.log('开始初始化！');
        $.ajax({
            method: 'get',
            url: configInfo.server_url + '/api/role/getAllAuthorities',
            success: function (data) {
                //console.log(data.ok);
                if(data.ok){
                    //theadHtml
                    roleManage.authorities_n=(data.list).length;
                    //console.log('权限个数： '+roleManage.authorities_n);
                    //console.log("权限有"+roleManage.authorities_n+"个");
                    var theadHtml='<tr class="role_authority">'+
                        '<th rowspan="2">角色名称</th>'+
                        '<th colspan='+roleManage.authorities_n+'>权限</th>'+
                        '<th  rowspan="2">操作</th>'+
                        '</tr>'+
                        '<tr>';
                    for(var i=0; i<roleManage.authorities_n; i++){
                        theadHtml+='<th>'+data.list[i].desc+'</th>';
                        roleManage.authorityIdList.push(data.list[i]['id']);
                        /*<th>增删改查所有项目（包括项目中的项目节点）</tr>;*/
                    }
                    //console.log(roleManage.authorityIdList); //查看所有权限
                    theadHtml+='</tr>';
                    $('.role_table thead').html(theadHtml);
                    $('.role_list th').css('width', 100 / (roleManage.authorities_n + 2).toFixed(4) + '%');//每列所占百分数

                    roleManage.setRoleScroll();
                    $(window).resize(function(){
                        roleManage.setRoleScroll();
                    });


                }else{
                    //获取权限失败
                }
            },
            fail: function (err) {
                console.log(err); //获取权限失败
            }
        });
        //???...得到所有角色,循环
        $.ajax({
            method: 'get',
            url: configInfo.server_url + '/api/role/',
            success: function (data) {
                if(data.ok) {
                    var roleListHtml = '';
                    for (var i = 0; i < data.list.length; i++) {
                        roleListHtml += '<tr id=' + data.list[i].id + '>' + roleManage.getRoleItemHtml(data.list[i],data.list[i].type);
                        +'</tr>';//每个tr
                    }
                    //role_add_html
                    var roleAddHtml = '<tr class="role_add">' +
                        '<td>' +
                        '<div class="role_add_edit">' +
                        '<input class="role_add_text" maxlength="6" type="text" placeholder="新建角色名:" />' +
                        '</div>' +
                        '</td>';
                    for (var i = 0; i < roleManage.authorities_n; i++) {  //几个权限 新建角色也有几项
                        roleAddHtml += '<td>' +
                            '<div class="role_add_edit">' +
                            '<input type="checkbox" value=' + roleManage.authorityIdList[i] + ' />' +
                            '</div>' +
                            '</td>';
                    }
                    roleAddHtml += '<td>' +
                        '<div class="role_add_edit">' +
                        '<b>确定</b>' +
                        '<strong>取消</strong>' +
                        '</div>' +
                        '</td>' +
                        '</tr>';

                    $('.role_table tbody').html(roleAddHtml);
                    $('.role_add').before(roleListHtml);
                    $('.role_table2 td').css('width', 100 / (roleManage.authorities_n + 2).toFixed(4) + '%');//每列所占百分数

                    departmentObj.bindLegalCheck([$('.role_edit_text'),$('.role_add_text')],'5','-30');

                }else{
                    //获取角色失败
                }

            },
            fail: function (err) {
                console.log(err);//获取角色失败
            }
        });
        roleManage.td_input_onchange();//checkbox改变
        roleManage.add_operate();//新建操作
        roleManage.exists_operates();//存在的角色-操作
    },
    add_operate: function () {  //新建 操作
        $('.role_add_icon').click(function () {//点击新建角色
            $('.role_empty').hide();
            if ($('.role_add').css('display') !== 'none') {

            } else {
                $('.role_add').show();
            }
            $('.role_table2_box').scrollTop( $('.role_table2_box')[0].scrollHeight ); //滚到下面
        });
        $('.role_table').on('click','.role_add_edit b',function () {//点击新建-确定
            var this_tr =$(this).parent().parent().parent();
            var role_add_name = $('.role_add_text').val();
            var reg=new RegExp(/^[\u4e00-\u9fa50-9a-zA-Z_]{1,6}$/); //1-6 1-6个数字/字母/下划线/中文
            var reg2=new RegExp(/^[^\d]/);  //非数字开头
            //console.log(role_add_text);
            if (!role_add_name) {//没有value
                departmentObj.showAskModel('角色名不能为空!',false);
            }/*else if(!(reg.test(role_add_name)&&reg2.test(role_add_name))){
                departmentObj.showAskModel('角色名只能由1-6个数字/字母/下划线/中文字符组成，且首字符不为数字!',false);
            }*/
            else {
                //添加一个角色
                //console.log(JSON.stringify({name:role_add_item.name}));
                var role_add_item = {};
                role_add_item.name = role_add_name;
                role_add_item.Authorities = [];
                role_add_item.idList=[];
                for (var i = 0; i< roleManage.authorities_n; i++) {
                    if (this_tr.find('[type=checkbox]').eq(i).attr('checked')) { //记录6个权限(√)
                        var json={};
                        json.id=this_tr.find('[type=checkbox]').eq(i).attr('value');
                        role_add_item.Authorities.push(json);//前端统一
                        role_add_item.idList.push(json.id);//后台
                    }
                }
                //console.log('权限list：'+role_add_item.idList);
                $.ajax({
                    method:'post',
                    url:configInfo.server_url + '/api/role/',
                    data:{
                        role:JSON.stringify({
                            name:role_add_item.name
                        }),
                        Authorities:JSON.stringify(role_add_item.idList)
                    },
                    success: function(data) {
                        if(data.ok){
                            //添加数据成功
                            var roleAddItem = '<tr id='+data.list.id+'>' + roleManage.getRoleItemHtml(role_add_item,data.list.type) + '</tr>';
                            this_tr.before(roleAddItem);
                            departmentObj.bindLegalCheck([$('.role_edit_text')],'5','-30');
                            //清空添加项
                            $('.role_add_text').val('');
                            $('.role_add input[type="checkbox"]').each(function(){
                                $(this).removeAttr('checked');
                            });
                            $('.role_add').hide();
                            //console.log(this_tr);
                        }else{
                            //添加角色失败
                        }
                    },
                    fail: function(err) {
                        console.log(err);  //添加角色失败
                    }
                });
            }
        });
        $('.role_table').on('click','.role_add_edit strong',function () {//点击新建-取消
            $('.role_add').hide();
        });

    },
    exists_operates: function () {
        //点 编辑
        $('.role_table tbody').not($('.role_add')).on('click','.role_sure b',function(){
            var this_tr=$(this).parent().parent().parent();
            this_tr.find('.role_edit').show();
            this_tr.find('.role_sure').hide();
        });

        //点 删除
        $('.role_table tbody ').not($('.role_add')).on('click','.role_sure strong',function(){
            var this_tr = $(this).parent().parent().parent();
            //ajax请求是否有用户属于这个角色，有就不可以删除，没有就可以删除！
            console.log(this_tr.attr('id'));
            $.ajax({
                method: 'post',
                url: configInfo.server_url + '/api/role/FindById',
                data: {
                    "roleId": this_tr.attr('id')
                },
                success: function (data) {
                    console.log(data);
                    if(data.ok){//可以删！
                        if(!data.list){
                            departmentObj.showAskModel('是否确定删除该角色？', true, function(data){
                                    if(data){
                                        $.ajax({
                                            method: 'delete',
                                            url: configInfo.server_url + '/api/role/',
                                            data: {
                                                roleId: this_tr.attr('id')/*,
                                                 Authorities: JSON.stringify([
                                                 "1ef65e51-e69b-11e5-b762-03e75ddc49e1",
                                                 "1ef65e54-e69b-11e5-b762-03e75ddc49e1",
                                                 '1ef65e55-e69b-11e5-b762-03e75ddc49e1'
                                                 ])*/
                                            },
                                            success: function (data) {
                                                //console.log(data.ok);
                                                if(data.ok){//删除成功！
                                                    console.log('删除成功！');
                                                    $('.role_table tbody tr').eq(this_tr.index()).remove();
                                                }else{
                                                    //删除失败
                                                    console.log('删除失败！');
                                                }
                                            },
                                            fail: function (err) {
                                                console.log(err);   //删除失败
                                            }
                                        });   //删除这个角色
                                    }
                            });
                        }
                        else{
                            departmentObj.showAskModel('有用户属于这个角色，不能删除！', false);
                        }
                    }else{
                        console.log('后台错误！');//不能删
                    }
                },
                fail: function (err) {
                    console.log(err);   //不能删
                }
            });

        });

        //点 编辑-确定
        $('.role_table tbody').not($('.role_add')).on('click','.role_edit b',function(){
            var this_tr=$(this).parent().parent().parent();
            var name=this_tr.children().eq(0).find( '.role_edit_text').val();
            var reg=new RegExp(/^[\u4e00-\u9fa50-9a-zA-Z_]{1,6}$/); //1-6 1-6个数字/字母/下划线/中文
            var reg2=new RegExp(/^[^\d]/);
            if (!name) {//没有value
                departmentObj.showAskModel('角色名不能为空！',false);
            }/*else if(!(reg.test(name)&&reg2.test(name))){
                departmentObj.showAskModel('角色名只能由1-6个数字/字母/下划线/中文字符组成，且首字符不为数字!',false);
            }*/
            else {
                var role_edit_item = {};
                role_edit_item.name = name;
                role_edit_item.Authorities = [];
                role_edit_item.idList = [];
                for (var i = 0; i < roleManage.authorities_n; i++) {
                    if (this_tr.find('[type=checkbox]').eq(i).attr('checked')) { //记录6个权限(√)
                        var json = {};
                        json.id = this_tr.find('[type=checkbox]').eq(i).attr('value');
                        role_edit_item.Authorities.push(json);//前端统一

                        role_edit_item.idList.push(json.id);//后台
                    }
                }
                var json={};
                json.id=this_tr.attr('id');
                json.name=name;
                $.ajax({
                    method: 'put',
                    url: configInfo.server_url + '/api/role/',
                    data: {
                        role: JSON.stringify(json),
                        Authorities: JSON.stringify(role_edit_item.idList)
                    },
                    success: function (data) {
                        //console.log(data.ok);
                        //替换成功！
                        if(data.ok){
                            this_tr.html(roleManage.getRoleItemHtml(role_edit_item,false));
                            departmentObj.bindLegalCheck([$('.role_edit_text')],'5','-30');
                        }else{
                            //编辑失败
                        }

                    },
                    fail: function (err) {
                        console.log(err);
                        //编辑失败
                    }
                });
            }
        });
        //点 编辑-取消
        $('.role_table tbody ').not($('.role_add')). on('click','.role_edit strong',function(){
            var this_tr = $(this).parent(). parent().parent();
            this_tr.find('.role_edit').hide();
            this_tr.find('.role_sure').show();
            this_tr.find('.role_edit_text').val(this_tr.find('.role_sure').html());
            //点 编辑-取消 checkbox的显示隐藏问题
            for(var i=0; i<roleManage.authorities_n; i++){
                if(this_tr.find('.role_sure i').eq(i).html()){
                    this_tr.find('input[type=checkbox]').eq(i).prop('outerHTML','<input type="checkbox" checked="checked" value="'+roleManage.authorityIdList[i]+'">');
                }else{
                    this_tr.find('input[type=checkbox]').eq(i).prop('outerHTML','<input type="checkbox" value="'+roleManage.authorityIdList[i]+'">');
                }
            }
        });

    },
    td_input_onchange:function(){
        $('.role_table').on('click','input[type="checkbox"]',function(){
            if($(this).attr('checked')){
                $(this).removeAttr('checked'); //undifined
            }else{
                $(this).attr('checked','checked'); //checked
            }
        });
    },
    findInArr:function(item, arr){
        for(var i=0; i<arr.length; i++){
            if(item==arr[i]){
                return true;
            }
        }
        return false;
    },
    getRoleItemHtml: function (roleItemData,type) {
        var arrId=[];
        for(var i=0; i<roleItemData.Authorities.length; i++){
            arrId.push(roleItemData.Authorities[i].id);
        }
        var roleItemHtml = '<td title="'+roleItemData['name']+'">' +
            '<div class="role_edit">' +
            '<input class="role_edit_text" maxlength="6" type="text" value=' + roleItemData['name'] + ' />' +
            '</div>' +
            '<div class="role_sure">' + roleItemData['name'] +
            '</div>' +
            '</td>';
        //中间6个权限的处理
        for (var i = 0; i < roleManage.authorities_n; i++) {
            if (roleManage.findInArr(roleManage.authorityIdList[i],arrId)) {
                roleItemHtml += '<td><div class="role_edit">' +
                    '<input type="checkbox" checked="checked" value='+roleManage.authorityIdList[i]+' />' +
                    '</div>' +
                    '<div class="role_sure">' +
                    '<i class="iconfont role_save">&#xe640;</i>' +
                    '</div>' +
                    '</td>';
            } else {
                roleItemHtml += '<td><div class="role_edit">' +
                    '<input type="checkbox" value='+roleManage.authorityIdList[i]+' />' +
                    '</div>' +
                    '<div class="role_sure">' +
                    '<i class="iconfont role_save"></i>' +
                    '</div>' +
                    '</td>';
            }
        }
        if(type){   //true 为不能修改的角色（固定）
            roleItemHtml += '<td></td>' ;
        }else{
            roleItemHtml += '<td>' +
                '<div class="role_edit">' +
                '<b>确定</b>' +
                '<strong>取消</strong>' +
                '</div>' +
                '<div class="role_sure">' +
                '<b>编辑</b>' +
                '<strong>删除</strong>' +
                '</div>' +
                '</td>';
        }
        return roleItemHtml;
    }

};
