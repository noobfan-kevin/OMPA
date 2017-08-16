/**
 * Created by 黄晓萌 on 2016/3/11.
 * 针对部门管理页面
 */
!function($,department){
    var DepartmentNodes = null;
    var NodeInfo = null;
    var zTreeObj = null;
    /**
     *初始化zTree树
     * @param htmlElement zTree初始化的位置元素
     * @constructor
     */
    function InitTree(htmlElement){
        var setting = {
            view: {
                selectedMulti: false,
                showIcon:false,
                showLine:false
            },
            edit:{
                enable:false
            },
            data: {
                simpleData: {
                    enable: true
                }
            }
        };

        $.ajax({
            method:"get",
            url:configInfo.server_url+"/api/department/getDepList",
            success:function(data){
                DepartmentNodes = data.list;
                NodeInfo = data.list[0];
                var zNodes=[];
                for(var i=0;i<data.list.length;i++){
                    zNodes.push({id:data.list[i].id,pId:data.list[i].fatherId?data.list[i].fatherId:0,name:data.list[i].name});
                }
                $.fn.Type.setType();
                zTreeObj = $.fn.zTree.init(htmlElement, setting, zNodes);
                //var Nodes = zTreeObj.getNodes();
                // var isOpen = Nodes[0].open;
                //zTreeObj.updateNode(Nodes[0]);
                ////console.log(Nodes);
                initData(data);
                checkActiveSpan();
            },
            error:function(data){
                console.log(data);
            }
        })
    }

    /**
     * 初始化默认显示部门页面
     * @param data
     */
    function initData(data){
        $(' #departmentTree ').children('li').eq(0).children('div').addClass('department-tree-span-active');
        var html = '<div class="department-detail">\
                    <span>部门名称：</span>\
                <label>'+data.list[0].name+'</label>\
                </div>\
                <div class="department-detail">\
                    <span>部门描述：</span>\
                <div class="department-textarea">\
                    <label>'+data.list[0].desc+'</label>\
                </div>\
                </div>';
        $('#department-check-detail').html(html);
    }
    /**
     * 计算zTree的实时高度，覆盖默认高度计算方法。
     * 防止高度超出默认高度。
     * @param ele zTree对象
     */
    function setTreeHeight(ele){
        var winheight = window.innerHeight;
        ele.css({"height":winheight-132});
    }

    function inputLegalCheck(inputStr,type){
            var results='';
            var flag = false;
            //var Focus =false;
            switch (type){
                case 'username':
                    results =inputStr.replace(/[^\d(A-Za-z)+$_']/g,'');   //字母数字
                    if(inputStr!=results){
                        flag =true;
                    }
                    break;
                case 'name':
                    results =inputStr.replace(/[^(\u4E00-\u9FA5)(A-Za-z)+$']/g,'');//汉字字母
                    if(inputStr!=results){
                        flag =true;
                    }
                    break;
                //case 'email':
                //    var regu = "^(([0-9a-zA-Z]+)|([0-9a-zA-Z]+[_.0-9a-zA-Z-]*[0-9a-zA-Z]+))@([a-zA-Z0-9-]+[.])+([a-zA-Z]{2}|net|NET|com|COM|gov|GOV|mil|MIL|org|ORG|edu|EDU|int|INT)$"
                //    var re = new RegExp(regu);
                //
                //    if (re.test(inputStr)) {
                //        results = inputStr;
                //    } else {
                //        results = inputStr;
                //        flag =true;
                //        Focus =true;
                //    }
                //    break;
                case 'number':
                    results =inputStr.replace(/[^\d]/g,''); //数字
                    if(inputStr!=results){
                        flag =true;
                    }
                    break;
                default:
                    var standard = new RegExp("[`~!@#$^&*()=|{}:;,\\[\\].《》<>/?~！@#￥……&*（）%_+\\-——|{}【】‘’；：”“。，、？]");
                    for (var i = 0; i < inputStr.length; i++) {
                        results = results+inputStr.substr(i, 1).replace(standard, '');
                    }
                    if(type!='ng-model'){
                        results=results.replace(" ","");
                    }
                    flag = standard.test(inputStr);
                    break;
            }
            return {"flag":flag,"str":results};

    }
    /**
     * 删除节点
     *
     */
    function removerNode(){
        var zTree = $.fn.zTree.getZTreeObj("departmentTree"),
            treeNode = zTree.getNodeByParam('id',NodeInfo.id,null);
        $.ajax({
            method:'post',
            url:'/api/department/delById',
            data:{"id":treeNode.id},
            success:function(data){
                zTree.removeNode(treeNode);
                checkActiveSpan();
                console.log(data);
            },
            error:function(data){
                console.log(data);
            }
        })
        //zTree.removeNode(treeNode);
    }

    /**
     * 更新部门树
     */
    function getDepartmentNodes(){
        $.ajax({
            method:"get",
            url:configInfo.server_url+"/api/department/getDepList",
            success:function(data){
                DepartmentNodes = data.list;
            },
            error:function(data){
                console.log(data);
            }
        });
    }

    /**
     * 新增节点
     * @param tId 新增节点的父节点的 tId
     */
    function addNode(){
        var zTree = $.fn.zTree.getZTreeObj("departmentTree"),
            treeNode = zTree.getNodeByParam('id',NodeInfo.id,null);
        $('#department-new-name').val('');
        $('#department-new-desc').val('');
        var option = '';

        for(var i=0;i<DepartmentNodes.length;i++){
            option+='<option data-value="'+DepartmentNodes[i].id+'">'+DepartmentNodes[i].name+'</option>'
        }
        $('#department-new-parentId').html(option);
        var optionDomObj= $('#department-new-parentId').get(0);
        for(var c=0; c<optionDomObj.options.length; c++){
            if(optionDomObj.options[c].getAttribute('data-value') == (NodeInfo.id+'')){
                optionDomObj.options[c].selected = true;
                break;
            }
        }
        $('.department-new').show();
        $('.department-edit').hide();
        $('.department-check').hide();
    }

    /**
     * 针对树的鼠标Hover事件
     * @param spanObj 背景颜色变化的div的对象
     * @param iconObj hover显示的按钮对象 (目前去掉该按钮的显示)
     * @param ev        hover对象
     * @constructor
     */
    function TreeOver(spanObj/*,iconObj*/,ev){
        spanObj.css({"background":"rgba(0,0,0,0)"});
        //if(!$(ev.target).hasClass('department-icon')){                  //判断鼠标在增加删除图标上的事件不清除图标状态
        //    iconObj.css({"display":"none"});
        //}
        if( $(ev.target).hasClass('button')){                           //判断鼠标hover在展开合并按钮上
            $(ev.target).prev().css({"background":"rgba(0,0,0,0.1)"});
            //$(ev.target).prev().children().eq(1).css({"display":"inline-block"});
        }else if( $(ev.target).hasClass('department-tree-span') ){     //判断鼠标hover在字体上
            $(ev.target).css({"background":"rgba(0,0,0,0.1)"});
            //var obj =$(ev.target).next();
            //if(obj.hasClass('noline_close')||obj.hasClass('noline_open')){
            //    $(ev.target).children().eq(1).css({"display":"inline-block"});
            //}else{
            //    if($(ev.target).parent().attr('id')== 'departmentTree_1'){
            //        $(ev.target).children().eq(1).css({"display":"inline-block"});
            //    }else {
            //        $(ev.target).children().css({"display":"inline-block"});
            //    }
            //}
        }else if($(ev.target).hasClass('department-icon')){             //判断鼠标在图标上
            $(ev.target).parent().css({"background":"rgba(0,0,0,0.1)"});
            //var obj = $(ev.target).parent().next();
            //if(obj.hasClass('noline_close')||obj.hasClass('noline_open')){
            //    $(ev.target).children().eq(1).css({"display":"inline-block"});
            //}else{
            //    $(ev.target).children().css({"display":"inline-block"});
            //}
        }
    }

    /**
     * 树的点击事件
     * @param ele
     * @param ev
     * @constructor
     */
    function TreeClick(ele,ev){
        ele.removeClass('department-tree-span-active');
        if( $(ev.target).hasClass('button')){
            $(ev.target).prev().css({"background":"rgba(241,163,37,0.2)"}).addClass('department-tree-span-active');
        }else if( $(ev.target).hasClass('department-tree-span') ){
            $(ev.target).css({"background":"rgba(241,163,37,0.2)"}).addClass('department-tree-span-active');
        }else if($(ev.target).hasClass('department-icon')){
            $(ev.target).parent().css({"background":"rgba(241,163,37,0.2)"}).addClass('department-tree-span-active');
        }
        var $active =$(".department-tree-span-active");
        checkActiveSpan();
        var nodeId = $active.attr('id');
        checkNode(nodeId);

    }

    function checkActiveSpan(){
        var $active =$(".department-tree-span-active");
        //console.log($active.parent().attr('id'));
        if($active.next().hasClass('noline_close')||$active.next().hasClass('noline_open')||$active.parent().attr('id')=='departmentTree_1'){
            $("#department-del-btn").hide();
        }else{
            $("#department-del-btn").show();
        }
    }

    /**
     * 点击查看部门信息
     * @param nodeId
     */
    function checkNode(nodeId){
        //console.log(nodeId);
        $.ajax({
            method:'post',
            url:configInfo.server_url+"/api/department/getDepById",
            data:{"departmentId":nodeId},
            success:function(data){
                NodeInfo = data;
                //console.log(NodeInfo);
                if(data.father){
                    var html = '<div class="department-detail">\
                    <span>部门名称：</span>\
                <label>'+data.name+'</label>\
                </div>\
                <div class="department-detail">\
                    <span>父级部门：</span>\
                <label>'+data.father.name+'</label>\
                </div>\
                <div class="department-detail">\
                    <span>部门描述：</span>\
                <div class="department-textarea">\
                    <label>'+data.desc+'</label>\
                </div>\
                </div>';
                }else{
                    var html = '<div class="department-detail">\
                    <span>部门名称：</span>\
                <label>'+data.name+'</label>\
                </div>\
                <div class="department-detail">\
                    <span>部门描述：</span>\
                <div class="department-textarea">\
                    <label>'+data.desc+'</label>\
                </div>\
                </div>';
                }
                $('#department-check-detail').html(html);
            },
            error:function(data){
                console.log(data);
            }
        })
    }
    /**
     * 节点操作控制函数
     * @param type  操作类型
     * @param
     */
    function nodeHandle(type){
        switch (type){
            case 'add' :
                addNode();//去掉参数
                break;
            case 'remove' :
                var callback= function(data){
                        if(data){
                            new Promise(function(reslove,reject){
                                $.ajax({
                                    method:'get',
                                    url:'/api/user/departmentMembers/'+NodeInfo.id,
                                    success:function(data){
                                        reslove(data.count);
                                    },
                                    error:function(err){
                                        reject(err);
                                    }
                                })
                            }).then(function(count){
                                if(count!=0){
                                    showAskModel("部门下存在成员，不能删除",false);
                                }else{
                                    checkNode(NodeInfo.fatherId);
                                    $('#'+NodeInfo.fatherId).css({"background":"rgba(241,163,37,0.2)"}).addClass('department-tree-span-active');
                                    removerNode();
                                }
                            },function(err){
                                console.log('获取项目成员失败：',err);
                            }).catch(function(data){
                                console.log(data);
                            });
                        }
                    };
                showAskModel("确认删除该部门？",true,callback);
                break;
            default:
                break;
        }
    }
    /**
     * 获取节点的全部子节点ID
     * 存放到全局变量STR
     * @type {Array}
     */
    var STR =[];
    function getNodeChildId(treeNode){
        if(treeNode.children){
            for(var i=0;i<treeNode.children.length;i++){
                STR.push(treeNode.id);
                getNodeChildId(treeNode.children[i]);
            }
        }else{
            STR.push(treeNode.id);
        }
    }

    /**
     * 编辑部门信息
     * @param $check 查看页面DOM
     * @param $edit  编辑页面DOM
     */
    function editDepartment($check,$edit){
        var zTree = $.fn.zTree.getZTreeObj("departmentTree");
        var treeNode = zTree.getNodeByParam('id',NodeInfo.id,null);
        if(NodeInfo.fatherId){
            getNodeChildId(treeNode);
            var option = '';
            for(var i=0;i<DepartmentNodes.length;i++){
                var times = true;
                for(var j=0;j<STR.length;j++){
                    if(DepartmentNodes[i].id == STR[j]){
                        times=false;
                    }
                }
                if(times){
                    option+='<option data-value="'+DepartmentNodes[i].id+'">'+DepartmentNodes[i].name+'</option>'
                }
            }
            STR=[];

            var html ='<div class="department-detail">\
                <span>部门名称：</span>\
            <input id="department-name" maxlength="20" type="text" onKeypress="javascript:if(event.keyCode == 32||event.keyCode == 39)event.returnValue = false;">\
                </div>\
                <div class="department-detail">\
                <span>父级部门：</span>\
            <select id="department-parentId">\
                </select>\
                </div>\
                <div class="department-detail">\
                <span>部门描述：</span>\
            <div class="department-textarea">\
                <textarea id="department-desc" rows="10" ></textarea>\
                </div>\
                </div>'
            $("#department-edit-detail").html(html);
            $('#department-name').val(NodeInfo.name).attr("data-value",NodeInfo.id);
            $('#department-parentId').html(option);
            var optionDomObj= $('#department-parentId').get(0);
            for(var c=0; c<optionDomObj.options.length; c++){
                if(optionDomObj.options[c].getAttribute('data-value') == (NodeInfo.fatherId+'')){
                    optionDomObj.options[c].selected = true;
                    break;
                }
            }
            $('#department-desc').val(NodeInfo.desc);
            $check.hide();
            $edit.show();
        }else {
            var html ='<div class="department-detail">\
                <span>部门名称：</span>\
            <input id="department-name" type="text" maxlength="20" onKeypress="javascript:if(event.keyCode == 32||event.keyCode == 39)event.returnValue = false;">\
                </div>\
                <div class="department-detail">\
                <span>部门描述：</span>\
            <div class="department-textarea">\
                <textarea id="department-desc" rows="10" ></textarea>\
                </div>\
                </div>'
            $("#department-edit-detail").html(html);
            $('#department-name').val(NodeInfo.name).attr("data-value",NodeInfo.id);
            $('#department-desc').val(NodeInfo.desc);
            $check.hide();
            $edit.show();
        }
        departmentObj.bindLegalCheck([$('#department-name')],'94','36');
    }

    /**
     * 节点移动
     * @param zTreeObj 树对象
     * @param fatherId 新父节点ID
     * @param curId    操作节点ID
     * @param name      新名称
     * @constructor
     */
    function MoveNode(zTreeObj,fatherId,curId,name){
        var treeNode = zTreeObj.getNodeByParam('id',curId,null);
        var fatherNode = zTreeObj.getNodeByParam('id',fatherId,null);
        zTreeObj.moveNode(fatherNode,treeNode,"inner");
        treeNode.name = name;
        zTreeObj.updateNode(treeNode);
        getDepartmentNodes();
    }


    function showAskModel(message,cancelStyle,callback){
        var display=null;
        cancelStyle?display='inline-block':display='none';
        var html =
            $('<div id="message-ask" style="z-index:1100; height: 100%;width: 100%; position: absolute;top: 0;left: 0;right: 0;background: rgba(100,100,100,0.2);">\
                <div style="width:262px;  position: absolute;top: 39%;left: 36%; background: white;border-radius: 4px;\
                -webkit-box-shadow: 2px 4px 8px 1px #aaa;-moz-box-shadow:2px 4px 8px 1px #aaa;box-shadow:2px 4px 8px 1px #aaa;\
                 padding: 40px 10px 14px 10px;border: 1px solid #aaa;">\
                    <div style="text-align: left;font-size: 16px;margin-bottom: 20px;">\
                        <span >'+message+'</span>\
                    </div>\
                    <div style="border: none;text-align: right;">\
                        <button type="button" id="m-sure" style=" width:70px;height: 32px; color: white; background: #2ec3e9;border: none; " class="btn btn-default">确认</button>\
                        <button type="button" id="m-cancel" style=" display:'+display+';margin-left: 8px; width:70px;height: 32px; color: white; background: #f0d14d;border: none; " class="btn btn-default" data-dismiss="modal">取消</button>\
                    </div>\
                </div>\
            </div>');
        $('body').append(html);
        html.on('click','#m-sure',function(){
            html.remove();
            callback && callback(true);
        });
        html.on('click','#m-cancel',function(){
            html.remove();
            callback && callback(false);
        });
        //$('#m-sure').on('click',function(){
        //    $('#m-sure').off('click');
        //    $('#m-cancel').off('click');
        //    if(callback){
        //        callback();
        //    }
        //    document.body.removeChild($('#message-ask')[0]);
        //});
        //$('#m-cancel').on('click',function(){
        //    $('#m-sure').off('click');
        //    $('#m-cancel').off('click');
        //    document.body.removeChild($('#message-ask')[0]);
        //});
    }


    function bindLegalCheck(inputObj,left,top,type){
        var log='';
        switch (type){
            case 'username':
                    log = '请输入字母数字！';
                break;
            case 'name':
                log = '请输入汉字字母！';
                break;
            //case 'email':
            //    log = '请输正确邮箱！';
            //    break;
            case 'number':
                log = '请输入数字！';
                break;
            default:
                log = '非法字符输入！';
                break;
        }
            var str = 'top:'+top+'px;left:'+left+'px;';
            var cssText = str+" z-index=1100;width:130px;display:inline-block; position: absolute; font:14px/1.2em '微软雅黑';padding:5px;" +
                "box-shadow: 0px 3px 6px #aaa;border-radius: 5px;max-width:300px;height:26px;opacity: 0.8; color: #eee;background:#FD0F0F;text-align:center;" ;
            var box =$('<div id="m-tip" style="' + cssText +'">'+log+'<div>');
            box.remove();

        for(var i=0;i<inputObj.length;i++){
            inputObj[i].on('input propertychange',function(e) {
                var str = $(this).val();
                    var result = inputLegalCheck(str,type);
                    if (str != result.str) {
                        $(this).val(result.str);
                    }
                        $(this).before(box);
                        $(this).parent().css({"position": "relative"});
                    if (!result.flag) {
                            box.hide();
                    } else {
                            box.show();
                    }

                //if(result.focus){
                //    $(this).blur(function () {
                //        var that = this;
                //        console.log(Focus);
                //
                //        setTimeout(function () {
                //            $(that).focus();
                //        },100);
                //    });
                //}

                    if (box) {
                        box.on('click', function () {
                            box.remove();
                        });
                        //clearTimeout(window.TipTimer);
                        window.TipTimer = setTimeout(function () {
                            box.remove();
                        }, 3000)
                    }
            } );
        }

    }

    /**
     * 初始化
     * @constructor
     */
    function InitAll(){
        departmentObj.InitTree($("#departmentTree"));
        var DepartmentTree = $('#departmentTree').eq(0)[0];                             //内层zTree
        //输入合法性验证
        departmentObj.bindLegalCheck([$('#department-new-name')],'94','36','email');
        //树节点的HOVER事件
        DepartmentTree.onmouseover=function(ev){
            departmentObj.treeOver($('.department-tree-span'),/*$('.department-icon'),*/ev);
        };

        //树节点的点击事件
        DepartmentTree.onclick=function(ev){
            departmentObj.treeClick($('.department-tree-span'),ev);
        };

        //树节点上按钮点击事件   /*外层div*/
        //$('.department-tree').on('click','.department-icon',function(){
        //    if($(this).index() == 0){
        //        departmentObj.nodeHandle('remove',$(this).parent().attr('data-tid'),$(this).parent().attr('data-value'));
        //    }else {
        //        departmentObj.nodeHandle('add',$(this).parent().attr('data-tid'));
        //    }
        //});

        window.onresize=function(){
            departmentObj.setTreeHeight($('.department-tree'));
        };
        //树滚动事件
        document.getElementById('department-tree').onscroll = function(){
            var scrollLeft = document.getElementById('department-tree').scrollLeft;                 //scrollLeft
            $('.department-tree-span').css({'left':scrollLeft});
        };
        departmentObj.setTreeHeight($('.department-tree'));

        $('#department-edit-btn').click(function(){
            departmentObj.editDepartment($('.department-check'),$('.department-edit'));
        })
        $('#department-del-btn').click(function(){
            departmentObj.nodeHandle('remove');
        });
        $('#department-add-btn').click(function(){
            departmentObj.nodeHandle('add');
        });

        /**
         * 编辑部门之后的取消和保存函数
         */
        $('.department-edit-cancel').click(function(){
            $('.department-edit').hide();
            $('.department-check').show();
        });
        $('.department-edit-save').click(function(){
            var new_departmentName = $('#department-name').val();
            var ID = $('#department-name').attr('data-value');
            var new_fatherId = $("#department-parentId option:selected").attr('data-value');
            var new_desc = $("#department-desc").val();
            var zTree = $.fn.zTree.getZTreeObj("departmentTree");

            $.ajax({
                method:'post',
                url:'/api/department/updateDep',
                data:{"id":ID,"name":new_departmentName,"fatherId":new_fatherId,"desc":new_desc},
                success:function(data){
                    MoveNode(zTree,new_fatherId,ID,new_departmentName);
                    checkNode(ID);
                },
                error:function(data){
                    console.log(data);
                }
            });
            $('.department-edit').hide();
            $('.department-new').hide();
            $('.department-check').show();
        });
        $('.department-new-cancel').click(function(){
            $('.department-edit').hide();
            $('.department-new').hide();
            $('.department-check').show();
        });

        $('.department-new-save').click(function(){
            //var tId = $('#department-new-name').attr('data-tid');
            var new_name = $('#department-new-name').val();
            var new_desc = $('#department-new-desc').val();
            var new_fatherId = $("#department-new-parentId option:selected").attr('data-value');
            var zTree = $.fn.zTree.getZTreeObj("departmentTree"),
                treeNode = zTree.getNodeByParam('id',new_fatherId,null);
            $.ajax({
                method:'post',
                url:'/api/department/newDep',
                data:{"name":new_name,"fatherId":new_fatherId,"desc":new_desc},
                success:function(data){
                    //console.log(data);
                    zTree.addNodes(treeNode, {id:data.id, pId:new_fatherId,  name:new_name });
                    checkActiveSpan();
                    getDepartmentNodes();
                    $('.department-edit').hide();
                    $('.department-new').hide();
                    $('.department-check').show();
                },
                error:function(data){
                    console.log(data);
                }
            })
        });
    }

    department.departmentObj ={
            InitAll:InitAll,
        InitTree:InitTree,
        setTreeHeight:setTreeHeight,
        nodeHandle:nodeHandle,
        treeClick:TreeClick,
        treeOver:TreeOver,
        editDepartment:editDepartment,
        showAskModel:showAskModel,
        bindLegalCheck:bindLegalCheck
    }
}(jQuery,window);
