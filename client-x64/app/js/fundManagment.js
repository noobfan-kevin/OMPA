/*
var fundManagement = function() {
    var openModel = $('.asset-body');
    openModel.on('mouseover', '.fileControl', function () {
        openModel.find('#fileInfoBtn').css({'width': 20 + 'px'});
    }).on('mouseout', '.fileControl', function () {
        openModel.find('#fileInfoBtn').css({'width': 2 + 'px'});
    });
    openModel.on('click', '#fileInfoBtn', function (event) {
        event.stopPropagation();
        if ($(this).hasClass('fileInfoClose')) {
            $(this).removeClass('fileInfoClose').addClass('fileInfoOpen').css({'width': 20 + 'px'});
            openModel.find('.fund01').css('width', 58 + '%');
            openModel.find('.fund02').css({
                'width': 42 + '%',
                'display': 'block'
            });
        } else {
            $(this).removeClass('fileInfoOpen').addClass('fileInfoClose').css({'width': 20 + 'px'});
            openModel.find('.fund01').css('width', 100 + '%');
            openModel.find('.fund02').css({
                'width': 0,
                'display': 'none'
            });
        }
    });und
}();*/
var fundManagment = {
    curPage: 1,
    curNode: null,
    addFund: function (json) {
        json.left = json.left || (46 + '%');
        json.top = json.top || (11 + 'px');
        var that = this;
        $.ajax({
            url: '/api/fundDataBase/newFund',
            type: 'post',
            data: 'name=' + json.name + '&fatherId=' + json.fatherId + '&projectId=' + json.projectId +'&amount='+json.amount,
            success: function (data) {
                //console.log(data);
                json.callback && json.callback(data.info);
            },
            error: function () {
                that.warnMessage(json.left, json.top, '资金信息添加失败！');
            }
        });
    },
    addPay: function (json) {
        json.left = json.left || (46 + '%');
        json.top = json.top || (11 + 'px');
        var that = this;
        $.ajax({
            url: '/api/fundDataBase/newPay',
            type: 'post',
            data: 'type=' + json.type + '&username=' + json.username + '&money=' + json.money +'&remark='+json.remark,
            success: function (data) {
                //console.log(data);
                json.callback && json.callback(data.info);
            },
            error: function () {
                that.warnMessage(json.left, json.top, '支出信息添加失败！');
            }
        });
    },
    changeFund : function(json){
        json.left = json.left||(46+'%');
        json.top = json.top||(11+'px');
        var that = this;
        $.ajax({
            url:'/api/fundDataBase/update',
            type: 'post',
            data : 'name='+json.name+'&fundId='+json.id+'&amount='+json.amount,
            success: function(result){
                json.callback&&json.callback(result);
            },
            error: function(){
                that.warnMessage(json.left,json.top,'资金信息修改失败！');
            }
        });
    },
    delete : function(json){
        json.left = json.left||(46+'%');
        json.top = json.top||(11+'px');
        var that = this;
        $.ajax({
            url:'/api/fundDataBase/' + json.id,
            type: 'delete',
            success: function(result){
                if(result.ok){
                    json.callback&&json.callback(result);
                }else{
                    that.warnMessage(json.left,json.top,'资金信息删除失败！');
                }
            },
            error: function(){
                that.warnMessage(json.left,json.top,'资金信息删除失败！');
            }
        });
    },
    getFundInfo : function(json){
        json.left = json.left||(46+'%');
        json.top = json.top||(11+'px');
        var that = this;
        $.ajax({
            url:'/api/fundDataBase/'+json.fundId,
            type: 'get',
            success: function(data){
                json.callback&&json.callback(data);
            },
            error: function(){
                that.warnMessage(json.left,json.top,'获取信息失败！');
            }
        });
    },
    getFundAllClass : function(json){
        json.left = json.left||(46+'%');
        json.top = json.top||(11+'px');
        var that = this;
        var dataList = [];
        $.ajax({
            url:'/api/fundDataBase/project/'+json.projectId,
            type: 'get',
            async : false,
            success: function(data){
                for(var i=0;i<data.length;i++){
                    dataList.push({
                        id : data[i].id,
                        pId : data[i].parentId,
                        name : data[i].name,
                        amount : data[i].amount
                    });
                }
                json.callback&&json.callback(data);
            },
            error: function(){
                that.warnMessage(json.left,json.top,'资金信息修改失败！');
            }
        });
        dataList[0].open = true;
        return dataList;
    },
    getAllPay : function(json){
        json.left = json.left||(46+'%');
        json.top = json.top||(11+'px');
        var that = this;
        var dataList = [];
        $.ajax({
            url:'/api/fundDataBase/projectPay/'+json.projectId,
            type: 'get',
            async : false,
            success: function(data){
                for(var i=0;i<data.length;i++){
                    dataList.push({
                        id : data[i].id,
                        pId : data[i].parentId,
                        name : data[i].name
                    });
                }
                json.callback&&json.callback(data);
            },
            error: function(){
                that.warnMessage(json.left,json.top,'获取支出信息失败！');
            }
        });
        return dataList;
    },
    initDataTable:function(paramdata) {
        $("#dataList").dataTable({
            //延迟加载
            deferRender: true,
            processing: false,
            bRetrieve: true,
            pagingType: "full_numbers",
            pageLength: 6,
            bPaginate: true, //翻页功能
            bLengthChange: false, //改变每页显示数据数量
            bFilter: false, //过滤功能
            //bSort: true, //排序功能

            bInfo: true,//页脚信息
            bAutoWidth: false, //自动宽度
            sPaginationType: "bootstrap",//分页样式
            dom: 'TRlrtip',
            scrollY: true,
            "autoWidth": false,
            "ordering": false,
            "paging": true,
            "searching": false,
            "data": paramdata,
            "columns": [
                {"data": "category", "title": "类别"},
                {"data": "username", "title": "使用人/物"},
                {"data": "money", "title": "金额（万元）"},
                {"data": "createDay", "title": "创建日期"},
                {"data": "remark", "title": "备注"}
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
        $(".dataTables_scrollHeadInner").css({'width':'100%'});
        $(".dataTables_scrollHeadInner table").css({'width':'100%'});
        //fundManagment.DataTables(paramdata);

    },
    DataTables:function(num,page,count){
        var str='';
        for(var i=0;i<page;i++){
            str +='<li ><a href="#" style="border: none;padding-left: 21px;padding-right: 21px;height: 20px;">'+(i+1)+'</a></li>';
        }
        var stpm='<div class="dropup" id="myCreateTask_pageCount">'+
            '<p class="dropdown-toggle"  id="myCreateTaskdropdownMenu" data-toggle="dropdown" style="padding: 7px 14px;">'+
            num+'/'+page +
            '</p>'+
            '<ul  id="myCreateTask_dropmenu" class="dropdown-menu" style="padding: 0;margin-left: -4%;min-width: 0;max-height: 104px;height:auto;overflow-y: scroll">'+ str+'</ul>'+
            '</div>';
        $('#dataList_paginate span>a').html(stpm);
        $('#myCreateTaskdropdownMenu').html(num+'/'+page);
        $('#dataList_info').html('共'+count+'条');
        $(".dataTables_scrollHeadInner").css({'width':'100%','background':'#f2f2f2'});
        $(".dataTables_scrollHeadInner table").css({'width':'100%'});

        //$('#userdropdownMenu').dropdown('toggle');
    },
    //消息提示框
    infoMessage : function(left,top,des) {
        var box = $('<div style="' + userCommon.infoMessage(top, left) + '">' + des + '<div>');
        $('#container').append(box);
        userCommon.warnMessageRemove(box);
        $('.fundBox').css('z-index',1100);
    },
    //警告提示框
    warnMessage : function(left,top,des){
        var box =$('<div class="fundBox" style="' + userCommon.warnMessage(top,left) +'">'+des+'<div>');
        $('#container').append(box);
        userCommon.warnMessageRemove(box);
        $('.fundBox').css('z-index',1100);
    },
    createPay: function(json) {
        json.left = json.left||(46+'%');
        json.top = json.top||(11+'px');
        var that = this;
        $.ajax({
            url:'/api/payDataBase/',
            type: 'post',
            data: json,
            success: function(data){
                console.log(data, '创建支出成功');
                $('.modal').modal('hide');
            },
            error: function(){
                that.warnMessage(json.left,json.top,'创建支出失败！');
            }
        });
    },
    page: function(json) {
        var that = this;
        $.ajax({
            url:'/api/payDataBase/page',
            type: 'post',
            data: json,
            success: function(data){
                cb(data);
            },
            error: function(){
                that.warnMessage(json.left,json.top,'获取支出信息失败！');
            }
        });

        function cb(data) {
            var total = data.count;
            var rows = data.rows;

            var pages =Math.ceil(total/6);

            var pays = rows.map(function(pay) {
                return {
                    category: pay.FundDataBase.name,
                    username: pay.username,
                    money: pay.amount,
                    createDay: pay.createdAt.split('T')[0],
                    remark: pay.remark,
                }
            });

            var table = $('#dataList').DataTable();
            //重新加载数据
            table.clear().rows.add(pays).draw(true);
            fundManagment.DataTables(fundManagment.curPage , pages, total)

            $('#dataList_wrapper td').each(function() {
                var that = this;
                //console.log(that.scrollWidth,$(that).outerWidth());
                if(that.scrollWidth > $(that).outerWidth()){
                    $(this).attr('title', $(this).html());
                }
            });

            $('.paginate_button ','#dataList_paginate').off('click').on('click', function(ev) {

                var $this = $(this);
                var pageCount = $('.dropdown-toggle').html();
                console.log(pageCount);
                var currentPage = pageCount.substring(0,pageCount.indexOf('/'));
                var pageTotal =  pageCount.substring(pageCount.indexOf('/')+1);
                if(fundManagment.curPage == 0) return;
                if(fundManagment.curPage == pages && $this.hasClass('next')) return;
                if($this.hasClass('current')) return;

                if($this.hasClass('first')){
                    fundManagment.curPage = 1;
                }
                if($this.hasClass('previous')){
                    if(currentPage == 1) return;
                    fundManagment.curPage -= 1;
                }
                if($this.hasClass('next')){
                    if(currentPage === pageTotal) return;
                    fundManagment.curPage += 1;
                }
                if($this.hasClass('last')){
                    fundManagment.curPage = pages;
                }

                fundManagment.page({
                    projectId: localStorage.getItem('projectId'),
                    page: fundManagment.curPage - 1,
                    startTime: $('#detail-add-startTime').val(),
                    endTime: $('#detail-add-endTime').val()
                })
            })
            $('#myCreateTask_dropmenu').on('click','a', function() {
                fundManagment.curPage = $(this).html()/1;
                fundManagment.page({
                    projectId: localStorage.getItem('projectId'),
                    page: fundManagment.curPage - 1,
                    startTime: $('#detail-add-startTime').val(),
                    endTime: $('#detail-add-endTime').val()
                })

            })
        }

    },
    isBeyond: function($input, parentNode, node) {
        var maxMoney = fundManagment.getMaxCount(parentNode, node);
        return fundManagment.markRed($input, $input.val()/1 > maxMoney/1);
    },
    isLack: function($input, parentNode, node) {

        var minMoney = fundManagment.getMinCount(parentNode, node);console.log(minMoney);
        return fundManagment.markRed($input, $input.val()/1 < minMoney/1);
    },
    markRed: function($input, bMark) {
        if(bMark){
            $input.css({
                'color':'red',
                'borderColor': 'red'
            });
            return true;
        }else{
            $input.css({
                'color':'black',
                'borderColor': '#ccc'
            });
            return false;
        }
    },
    getNodeById: function(id) {
        return fundTree2.getNodesByFilter(function(node){
            return node.id == id;
        })[0];
    },
    getMaxCount: function(parentNode, node) {
        var hadMoney = 0;
        parentNode = parentNode || node.getParentNode();
        // 最高父级，设无穷
        if(!parentNode) return Infinity;

        if(fundManagment.isRoot(parentNode) && !parentNode.children) return parentNode.amount;
        hadMoney = fundManagment.getMinCount(parentNode, node);
        return parentNode.amount - hadMoney + (!!node ? node.amount : 0);
    },
    getMinCount: function(parentNode, node) {
        var total = 0;
        parentNode = parentNode || node.getParentNode();
        // 最高父级，设无穷
        if(!parentNode) return Infinity;

        // 不存在子节点，直接返回父级金额
        if(!parentNode.children) return 0;
        parentNode.children.forEach(function(nodeObj) {
            total += nodeObj.amount;
        });
        return total;
    },
    isRoot: function(node) {
        return !node.getParentNode()
    },
    redrawPie: function(pieData) {
        myChartPie.destroy();
        myChartPie = new Chart(document.getElementById("canvas").getContext("2d")).Pie(pieData);

    },
    redrawPieByZTreeNode: function(node) {
        var children = node.children;
        if(children){
            pieData = fundManagment.nodeToPieData(children);
            pieData.sort(function (n1, n2) {
                return n1.value - n2.value;
            });
            pieData.push({
                value: fundManagment.getMaxCount(node).toFixed(2),
                id: '',
                color: '#ccc',
                name: '未使用'
            });
        }else{
            pieData = [{
                value: (node.amount/1).toFixed(2),
                id: node.id,
                color: '#ccc',
                name: '未使用'
            }]
        }
        myChartPie.destroy();
        myChartPie = new Chart(document.getElementById("canvas").getContext("2d")).Pie(pieData);
        fundManagment.updatePayList(pieData, node);
    },
    nodeToPieData: function(nodeList) {
        nodeList = Array.isArray(nodeList) ? nodeList : [nodeList];
        return nodeList.map(function(nodeData) {
            console.log(nodeData);
            return {
                value: parseFloat(nodeData.amount).toFixed(2),
                id: nodeData.id,
                color: nodeData.color || '#' + (~~(Math.random() * (1 << 24))).toString(16),
                name: nodeData.name
            }
        })
    },
    updatePayList: function(dataList, node) {
        dataList = Array.isArray(dataList) ? dataList : [dataList];
        var html = '';
        dataList.forEach(function(data) {
            html += '<p>' +
                '<span class="fundName" style="display: inline-block;width: 85px;text-align: right"  fId="' + data.id + '">' + data.name + '</span> : ' +
                '<span class="fundAmount">' + data.value + '</span>' +
                '<span class="fundRatio" style="margin-left: 12px;">' + getRatio(data.value, node.amount)+ '</span>' +
                '</p>'
        });
        $('.fund0201').html(node.name + ' : ' +node.amount + "<sub style='float:right;bottom: -2.25em;right:5px;'>单位 : 万</sub>");
        $('.fund0202').html(html);

        function getRatio(money, total) {
            return parseInt(money / total * 100) + '%';
        }
    }

}