/**
 * @function 对ztree插件的二次封装
 * @param type 显示的树类型（default:ztree的默认类型，else:条形树）
 * @param checkbox 是否显示checkbox，默认不显示
 * @constructor
 */
function ZTreeObj(type,checkbox){
    this.type=type;
    this.checkbox = checkbox||false;
    this.zTreeCheckedNode = null;
}
ZTreeObj.prototype = {
    initAll: function (htmlElement, url,Callback) {
        var _this = this;
        var DOM = htmlElement.eq(0)[0];                             //内层zTree
        //css.remove();
        //树节点的HOVER事件
        DOM.onmouseover = function (ev) {
            ZTreeObj.prototype.treeOver($('.department-tree-span'), ev,_this.checkbox);
        };
        //树节点的点击事件
        DOM.onclick = function (ev) {
            ZTreeObj.prototype.TreeClick($('.department-tree-span'), ev,_this.checkbox);
        };
        ZTreeObj.prototype.InitTree(htmlElement, url,this.type,this.checkbox,Callback);

    },
    addNode: function (name, fatherId, TreeID, newNodeID, amount) {
        var zTree = $.fn.zTree.getZTreeObj(TreeID),
            treeNode = zTree.getNodeByParam('id', fatherId, null);
        zTree.addNodes(treeNode, {id: newNodeID, pId: fatherId, name: name, amount: (amount || '')  });
    },
    UpdateNode: function (TreeId, fatherId, curId, name, amount) {
        var zTreeObj = $.fn.zTree.getZTreeObj(TreeId);
        var treeNode = zTreeObj.getNodeByParam('id', curId, null);
        var fatherNode = zTreeObj.getNodeByParam('id', fatherId, null);
        zTreeObj.moveNode(fatherNode, treeNode, "inner");
        treeNode.name = name;
        if(amount){
            treeNode.amount = amount;
        }
        zTreeObj.updateNode(treeNode);

    },
    deleteNode:function(TreeId,nodeId,fatherId){
        var zTree = $.fn.zTree.getZTreeObj(TreeId),
            treeNode = zTree.getNodeByParam('id',nodeId,null);
        zTree.removeNode(treeNode);
        $('.department-tree-span').removeClass('department-tree-span-active');
        $('#'+fatherId).addClass('department-tree-span-active');
        this.zTreeCheckedNode = fatherId;
    },
    getCheckedNode: function () {
        return this.__proto__.zTreeCheckedNode;
    },
    getCheckedNodeList:function(TreeId){
        var zTree = $.fn.zTree.getZTreeObj(TreeId);
        var data =  zTree.getCheckedNodes(true);
        var _data = [];
        var len = data.length;
        for(var i=0;i<len;i++){
            _data.push({
                id:data[i].id,
                name:data[i].name
            })
        }
        return _data;
    },
    setNoChecked:function(treeId,id){
        var zTree = $.fn.zTree.getZTreeObj(treeId),
        treeNode = zTree.getNodeByParam('id',id,null);
        treeNode.checked = false;
        zTree.updateNode(treeNode,false);
    },
    setChecked:function(treeId,list){
        var checkNodeList = ZTreeObj.prototype.getCheckedNodeList(treeId);
        var zTree = $.fn.zTree.getZTreeObj(treeId);
        var len = list.length;
        var c_len = checkNodeList.length;
        var treeNode = null;
        var flag = null;
        for(var c=0;c<c_len;c++){
            flag=false;
            for(var i=0;i<len;i++){
              if(list[i]==checkNodeList[c].id){
                  flag = true;
                  break;
              }
            }
            if(!flag){
                treeNode = zTree.getNodeByParam('id',checkNodeList[c].id,null);
                treeNode.checked = false;
                zTree.updateNode(treeNode,false);
            }
        }
    },
    InitTree:function (htmlElement,url,type,checkbox,Callback){
        var Iconflag = type=='default';
        var _this= this;
        function nodeBeforeClick(treeId, treeNode, clickFlag){
            //console.log(treeNode);
            if(treeNode){
                _this.zTreeCheckedNode = treeNode.id;
            }
        }
        function nodeOnClick(event, treeId, treeNode){
            //TreeNode = treeNode;
            if(treeNode){
                _this.zTreeCheckedNode = treeNode.id;
            }
        }
        var setting = {
            view: {
                selectedMulti: false,
                showIcon:Iconflag,
                showLine:Iconflag
            },
            check:{
                enable:checkbox,
                chkStyle:"checkbox",
                autoCheckTrigger: false,
                chkboxType : { "Y": "s", "N": "s" }
            },
            edit:{
                enable:false
            },
            data: {
                simpleData: {
                    enable: true
                },
                key:{
                    checked:"checked"
                }
            },
            callback:{
                beforeClick:nodeBeforeClick,
                onClick:nodeOnClick
            }
        };
        $.ajax({
            method:"get",
            url:url,
            success:function(data){
                //console.log(data,'111111111111111');
                var zNodes=[];
                for(var i=0;i<data.list.length;i++){
                    zNodes.push({id:data.list[i].id,pId:data.list[i].fatherId?data.list[i].fatherId:0,name:data.list[i].name,open:checkbox});
                }
                _this.ztreeObj = $.fn.zTree.init(htmlElement, setting, zNodes);
                ZTreeObj.prototype.setInit(htmlElement);
                _this.zTreeCheckedNode = data.list[0].id;
                if(Callback){
                    Callback(data);
                }
            },
            error:function(data){
                console.log(data);
            }
        })
    },
    selectCurNode:function(nodeId){
        this.__proto__.zTreeCheckedNode = nodeId;
    },
    treeOver:function (spanObj,ev,checkbox){
        if(!checkbox){
            spanObj.css({"background":"rgba(0,0,0,0)"});
            if( $(ev.target).hasClass('button')){                           //判断鼠标hover在展开合并按钮上
                $(ev.target).prev().css({"background":"rgba(0,0,0,0.1)"});
            }else if( $(ev.target).hasClass('department-tree-span') ){     //判断鼠标hover在字体上
                $(ev.target).css({"background":"rgba(0,0,0,0.1)"});
            }else if($(ev.target).hasClass('department-icon')){             //判断鼠标在图标上
                $(ev.target).parent().css({"background":"rgba(0,0,0,0.1)"});
            }
        }
    },
    TreeClick:function (ele,ev,checkbox){
        if(!checkbox){
            ele.removeClass('department-tree-span-active');
            if( $(ev.target).hasClass('button')){
                $(ev.target).prev().css({"background":"rgba(241,163,37,0.2)"}).addClass('department-tree-span-active');
            }else if( $(ev.target).hasClass('department-tree-span') ){
                $(ev.target).css({"background":"rgba(241,163,37,0.2)"}).addClass('department-tree-span-active');
            }else if($(ev.target).hasClass('department-icon')){
                $(ev.target).parent().css({"background":"rgba(241,163,37,0.2)"}).addClass('department-tree-span-active');
            }
            var $active =$(".department-tree-span-active");
            if($active.attr('id')){
                this.zTreeCheckedNode = $active.attr('id');
            }
        }
    },
    setInit:function(DOM){
        DOM.children().eq(0).children().eq(0).addClass('department-tree-span-active');
    },
    selectNode : function (TreeID, id) {
        var zTree = $.fn.zTree.getZTreeObj(TreeID),
            treeNode = zTree.getNodeByParam('id', id, null);
        zTree.selectNode(treeNode);
    },
    cancelSelectedNode : function(TreeID){
        var treeObj = $.fn.zTree.getZTreeObj(TreeID);
        treeObj.cancelSelectedNode();
    },
    deleteFile:function(TreeId,nodeId){
        var zTree = $.fn.zTree.getZTreeObj(TreeId),
            treeNode = zTree.getNodeByParam('id',nodeId,null);
        zTree.removeNode(treeNode);
    }
};

