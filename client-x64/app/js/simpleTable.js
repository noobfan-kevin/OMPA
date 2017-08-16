/**
 * Created by hk60 on 2016/4/1.
 */
!function($,simpleTable){
    var TYPE = null;
    var DateLen = null;
    var PageCount = null;
    var ProjectId = null;
    var position= null;
    var dataIdList=[];
    var dataNameList=[];
    var data =[];
    var maxKey=1;
    var NUM=0;
    var MaxGroup=0;
    var countUrl = null;
    var bodyDataUrl = null;
    var JiId = null;
    var newTaskBtnFlag = true;
    function initTable(headUrl,type,fatherId,urlData){
        ProjectId = window.localStorage.getItem('projectId');
        TYPE = type;
        getHeadData(headUrl,type,fatherId);
        if(type=='asset'){
            countUrl = urlData.cUrl;
            bodyDataUrl = urlData.bUrl;
            getDataCount(type);
        }else if(type =='shot'){
            countUrl = urlData.countUrl;
            bodyDataUrl = urlData.dataUrl;
            getShotCount(type,urlData.jiId);
        }else{
            console.log('错误类型');
        }

    }
    /*-----------------------------table head----------start--------------------------*/
    function getHeadData(headUrl,type,fatherId){
        $.ajax({
            method:"get",
            url:headUrl,
            success:function(data){
                initHead(data.list,fatherId,type);
            },
            error:function(data){
                console.log(data);
            }
        })
    }
    function initHead(tHeadData,fatherId,type){
        var key=1;
        data =[];
        getJson(tHeadData,fatherId,key,0);
        getHtml(data,type);
        data.length==0?(newTaskBtnFlag=false):(newTaskBtnFlag=true);
    }
    function getHtml(data,type,callback){
        var HTML='';
        var line = [];
        var tableLen=0;
        position=1;
        dataIdList = [];
        dataNameList=[];
        for(var m=0;m<maxKey;m++){
            line[m]='';
        }
        if(type=='asset'){
            line[0]+='<th colspan="1" rowspan="'+(parseInt(maxKey)+1)+'">资产</th><th colspan="1" rowspan="'+(parseInt(maxKey)+1)+'">类型</th>';
        }else if(type == 'shot'){
            line[0]+='<th colspan="1" rowspan="'+(parseInt(maxKey)+1)+'">镜头</th><th colspan="1" rowspan="'+(parseInt(maxKey)+1)+'">编码</th>';
        }
        var len = data.length;
        for(var i=0;i<len;i++){
            NUM=0;
            getColm(data,data[i].id,data[i].group);
            if(data[i+1]){
                if(data[i+1].group==data[i].group){
                    if(data[i+1].level>data[i].level){
                        if(data[i].level==1){
                            HTML= '<td id="'+data[i].id+'" data-class="'+data[i].fatherId+'" data-flag="false" rowspan="1" colspan="'+NUM+'">'+data[i].name+'</td>';
                        }else{
                            HTML='<td id="'+data[i].id+'" data-class="'+data[i].fatherId+'" data-flag="false" rowspan="1" colspan="'+NUM+'">'+data[i].name+'</td>';
                        }
                    }else /*if(data[i+1].level==data[i].level||data[i+1].level<data[i].level)*/{
                        HTML='<td id="'+data[i].id+'" class="table-head-hoverTd" data-class="'+data[i].fatherId+'" data-flag="true"  rowspan="'+(maxKey-data[i].level+1)+'" colspan="'+NUM+'">'+data[i].name+'<i class="iconfont '+TYPE+'-icon icon-open">&#xe683;</i></td>';
                        dataIdList.push(data[i].id);
                        dataNameList.push(data[i].name);
                        position+=1;
                    }
                }else{
                    /*if(data[i].level==1){
                        HTML='<td id="'+data[i].id+'" class="'+data[i].fatherId+'"  rowspan="'+(maxKey-data[i].level+1)+'" colspan="'+NUM+'">'+data[i].name+'<i class="iconfont '+TYPE+'-icon icon-open">&#xe683;</i></td>';
                        dataIdList.push(data[i].id);
                        dataNameList.push(data[i].name);
                        position+=1;
                    }else{*/
                        HTML='<td id="'+data[i].id+'" class="table-head-hoverTd" data-class="'+data[i].fatherId+'" data-flag="true"  rowspan="'+(maxKey-data[i].level+1)+'" colspan="'+NUM+'">'+data[i].name+'<i class="iconfont '+TYPE+'-icon icon-open">&#xe683;</i></td>';
                        dataIdList.push(data[i].id);
                        dataNameList.push(data[i].name);
                        position+=1;
                    //}
                }
            } /*else if(data[i-1]){
                if(data[i].group==data[i-1].group){
                    HTML='<td id="'+data[i].id+'" class="'+data[i].fatherId+'"  rowspan="'+(maxKey-data[i].level+1)+'" colspan="'+NUM+'">'+data[i].name+'<i class="iconfont '+TYPE+'-icon icon-open">&#xe683;</i></td>';
                    dataIdList.push(data[i].id);
                    dataNameList.push(data[i].name);
                    position+=1;
                }else{
                    HTML='<td id="'+data[i].id+'" class="'+data[i].fatherId+'"  rowspan="'+(maxKey-data[i].level+1)+'" colspan="'+NUM+'">'+data[i].name+'<i class="iconfont '+TYPE+'-icon icon-open">&#xe683;</i></td>';
                    dataIdList.push(data[i].id);
                    dataNameList.push(data[i].name);
                    position+=1;
                }
            }*/else{
                HTML='<td id="'+data[i].id+'" class="table-head-hoverTd" data-class="'+data[i].fatherId+'" data-flag="true"  rowspan="'+(maxKey-data[i].level+1)+'" colspan="'+NUM+'">'+data[i].name+'<i class="iconfont '+TYPE+'-icon icon-open">&#xe683;</i></td>';
                dataIdList.push(data[i].id);
                dataNameList.push(data[i].name);
                position+=1;
            }
            if(data[i].level==1){
                tableLen+=NUM;
            }
            line[data[i].level-1]+=HTML;
        }
        var finalHtml='';
        for(var key=0;key<maxKey;key++){
            finalHtml+='<tr>'+line[key]+'</tr>';
        }
        var end_html='';
        for(var j=0;j<tableLen;j++){
            end_html+='<td class="'+dataIdList[j]+'">任务卡名称</td>' +
                '<td class="'+dataIdList[j]+' info-detail">制作人</td>' +
                '<td class="'+dataIdList[j]+' info-detail">起止时间</td>' +
                '<td class="'+dataIdList[j]+' info-detail">版本号</td>' +
                '<td class="'+dataIdList[j]+' info-detail">创建人</td>';
        }
        finalHtml+='<tr>'+end_html+'</tr>';
        $('#'+type+'-table-head').html(finalHtml);
        if(callback)
        {
            callback();
        }
    }
    function getColm(data,fatherId,group){
        var len = data.length;
        var flag = true;
        for(var i=0;i<len;i++){
            if(data[i].group==group){
                if(data[i].fatherId==fatherId){
                    flag=false;
                    getColm(data,data[i].id,group);
                }else{
                }
            }
        }
        if(flag){
            NUM+=1;
        }
    }
    function getJson(tHeadDate,fatherId,key,group){
        var len = tHeadDate.length;
        for(var i=0;i<len;i++ ){
            if(tHeadDate[i].fatherId==fatherId){
                if(key==1){
                    group+=1;
                }
                var json = {"id":tHeadDate[i].id,"level":key,"fatherId":tHeadDate[i].fatherId,"name":tHeadDate[i].name,"group":group};
                data.push(json);
                key>maxKey?maxKey=key:maxKey=maxKey;
                group>MaxGroup?MaxGroup=group:MaxGroup=MaxGroup;
                getJson(tHeadDate,tHeadDate[i].id,key+1,group);
            }
        }
    }
    /*-----------------------------table head------------end-----------------------*/
    function freezeTable(type){
        setTimeout(function(){
            var $Table = $('#'+type+'-table');
            var $head = $('#'+type+'-table-head');
            var height = $head.height();
            var width = $head.find('tr').width();
            console.log($head,$Table,'DOM------------');
            console.log(height,width,"value-----------");
            $Table.css('padding-top',parseInt(height)-2);
            $('.shot-chang-tr td').css({"width": width});
            $Table.on('scroll', function (event) {
                if ($(this).scrollTop()) {
                    $head.css({
                        top: $(this).scrollTop()
                    });
                } else {
                    $head.css({
                        top: 0
                    });
                }
            });
        },10);
    }
    /*-----------------------------table body----------start--------------------------*/
    function getDataCount(type){
        //console.log('00000000000');
        $.ajax({
            method:'get',
            url:countUrl,
            data:{"projectId":ProjectId},
            success:function(data){
                //console.log('jjjjjj',data);
                DateLen = data.count;
                PageCount =Math.ceil(DateLen/10);
                if(PageCount==0){
                    $('#'+type+'-body').css({"display":"none"});
                    $("#asset-task-new").css({"display":"none"});
                    $('.no-data-page').css({"display":"block"});
                }else{
                    $('#'+type+'-body').css({"display":"block"});
                    if(newTaskBtnFlag){
                        $("#asset-task-new").css({"display":"block"});
                    }else{
                        $("#asset-task-new").css({"display":"none"});
                    }
                    $('.no-data-page').css({"display":"none"});
                    getBodyData(0);
                    initFootData(type);
                }
                assetManagement.getCurUserTaskAuth();
            },
            error:function(){
                console.log(data);
            }
        });
    }
    function getBodyData(offset){
        $.ajax({
            method:'get',
            url:bodyDataUrl,
            data:{"offset":offset,"projectId":ProjectId},
            success:function(data){
                console.log('asset-task',data);
                initBodyData(data.data);
            },
            error:function(){
                console.log(data);
            }
        });
    }
    function initBodyData(data){
        var x_len = dataIdList.length;
        var y_len = data.length;
        var html = '';
        var Tasks =null;
        var t_len = null;
        var _class = null;
        var _name = null;
        var headHtml = null;
        var makerHtml = null;
        var timeHtml = null;
        var codeHtml = null;
        var creatorHtml = null;
        var taskStatus=null;
        var taskVersion = null;
        var tv_len=null;
        var curVersion = null;
        var product=null;
        for(var y=0;y<y_len;y++){
            Tasks = data[y].Tasks;
            t_len = Tasks.length;
            html+='<tr><th  colspan="1" rowspan="1">' +
                '<div class="assets " data-id="'+data[y].id+'">' +
                '<img src="'+configInfo.server_url+'/'+data[y].assetImg+'" />' +
                '<span title="'+data[y].name+'">'+data[y].name+'</span>' +
                '</div>' +
                '</th>' +
                '<th>'+data[y].AssetsType.name+'</th>';
            for(var x=0;x<x_len;x++){
                _class = dataIdList[x];
                _name = dataNameList[x];
                headHtml = '';
                makerHtml = '';
                timeHtml = '';
                codeHtml = '';
                creatorHtml = '';
                taskStatus=null;
                for(var t=0;t<t_len;t++){
                    if(Tasks[t].moduleId==_class){
                        taskVersion = Tasks[t].TaskVersions;
                        tv_len=taskVersion.length;
                        curVersion=null;
                        for(var tv=0;tv<tv_len;tv++){
                            if(taskVersion[tv].currentStatus=='true'){
                                curVersion=taskVersion[tv];
                            }
                        }
                        curVersion.productor==null?product='':product=curVersion.productor.name;
                        switch(curVersion.status){
                            case -1:
                                taskStatus='task-beforeStart';
                                break;
                            case 0:
                                taskStatus='task-beforeStart';
                                break;
                            case 1:
                                taskStatus='task-beforeStart';
                                break;
                            case 2:
                                taskStatus='task-doing';
                                break;
                            case 3:
                                taskStatus='task-doing';
                                break;
                            case 4:
                                taskStatus='task-doing';
                                break;
                            case 5:
                                taskStatus='task-finished';
                                break;
                        }
                        headHtml+='<div class="asset-tasks '+taskStatus+'" title="'+curVersion.name+'" data-TaskId="'+Tasks[t].id+'">'+curVersion.name+'</div>';
                        makerHtml+='<div class="asset-tasks '+taskStatus+'">'+product+'</div>';
                        creatorHtml+='<div class="asset-tasks '+taskStatus+'">'+curVersion.creator.name+'</div>';
                        timeHtml+='<div class="asset-tasks '+taskStatus+'">'+curVersion.startDate.slice(0,10)+'/'+curVersion.planDate.slice(0,10)+'</div>';
                        codeHtml+='<div class="asset-tasks '+taskStatus+'" title="'+curVersion.version+'">'+curVersion.version+'</div>';
                    }
                }
                html+='<td class="'+_class+' asset-task-name">'+headHtml+
                    '<div class="onHover-showAddTaskBtn" data-assetName="'+data[y].name+'" data-stepName="'+_name+'"' +
                    ' data-assetId="'+data[y].id+'" data-stepId="'+_class+'" data-type="2">' +
                    '<span>+</span>' +
                    '</div>' +
                    '</td>' +
                    '<td class="'+_class+' info-detail">'+makerHtml+
                    '</td>' +
                    '<td class="'+_class+' info-detail">'+timeHtml+
                    '</td>' +
                    '<td class="'+_class+' info-detail">'+codeHtml+
                    '</td>' +
                    '<td class="'+_class+' info-detail">'+creatorHtml+
                    '</td>';
            }
            html+='</tr>';
        }
        $('#'+TYPE+'-table-body').html(html);
    }
    function getPageList(){
        var html='';
        for(var x=0;x<PageCount;x++){
            html+='<li>'+(x+1)+'</li>';
        }
        return html;
    }

    /*-----------------------------table body----------end----------------------------*/
    /*-----------------------------table foot----------start----------------------------*/
    function initFootData(){
        var $table = $('#'+TYPE+'-table-foot');
        //console.log(DateLen);
        $table.find('.total-page').text(DateLen);
        PageCount==0?PageCount=1:PageCount+=0;
        $table.find('.cur-page').text('1/'+PageCount).attr('data-value','1');
        $table.find('.cur-page-choose').html(getPageList());

        freezeTable(TYPE);
    }


    /*-----------------------------table foot----------end----------------------------*/
    /*-----------------------------shot----------start----------------------------*/
    function getShotCount(type,jiId){
        JiId = jiId;
        $.ajax({
            method:'get',
            url:countUrl,
            data:{"jiId":jiId},
            success:function(data){
                DateLen = data.count;
                PageCount =Math.ceil(DateLen/10);
                //console.log('PageCount---------------',PageCount);
                if(PageCount==0){
                    $('#'+type+'-body').css({"display":"none"});
                    $('#shot-task-new').css({"display":"none"});
                    $('.no-data-page').css({"display":"block"});
                }else{
                    $('#'+type+'-body').css({"display":"block"});
                    if(newTaskBtnFlag){
                        $("#shot-task-new").css({"display":"block"});
                    }else{
                        $("#shot-task-new").css({"display":"none"});
                    }
                    $('.no-data-page').css({"display":"none"});
                    getShotData(0);
                }
                ShotMangement.getCurUserTaskAuth();
                initFootData();
            },
            error:function(){
                console.log(data);
            }
        });
    }
    function getShotData(offset){
        $.ajax({
            method:'get',
            url:bodyDataUrl+JiId,
            data:{"offset":offset},
            success:function(data){
                var html = getShotBodyHtml(data.list);
                $('#'+TYPE+'-table-body').html(html);
            },
            error:function(err){
                console.log(err);
            }
        })
    }

    function getShotBodyHtml(data){
        //console.log('shotData',data);
        var changId = data[0].changId;
        var changName = data[0].chang.name;
        var len = data.length;
        var d_len = dataIdList.length;
        var Task ='';
        var t_len =0;
        var taskVersion = null;
        var tv_len = 0;
        var curVersion = null;
        var product = null;
        var headHtml = null;
        var makerHtml = null;
        var timeHtml = null;
        var codeHtml = null;
        var creatorHtml = null;
        var taskStatus=null;
        var _class = null;
        var _name = null;
        var html = '<tr id="'+changId+'" class="shot-chang-tr " ><td rowspan="1" colspan="'+parseInt(d_len+2)+'">'+changName+'<i class="iconfont tr-icon tr-icon-open">&#xe67b;</i></td></tr>';
        for(var i=0;i<len;i++){
            if(changId!=data[i].changId){
                changId=data[i].changId;
                changName=data[i].chang.name;
                //console.log(changName);
                html+='<tr id="'+changId+'" class="shot-chang-tr " ><td rowspan="1" colspan="'+parseInt(d_len+2)+'">'+changName+'<i class="iconfont tr-icon tr-icon-open">&#xe67b;</i></td></tr>';
            }
            html+='<tr class="'+changId+'"><th  colspan="1" rowspan="1">' +
                '<div class="shots " data-id="'+data[i].id+'">' +
                '<img src="'+configInfo.server_url+'/'+data[i].assetImg+'" />' +
                '<span title="'+data[i].name+'">'+data[i].name+'</span>' +
                '</div>' +
                '</th>' +
                '<th>'+data[i].shotCode+'</th>';
            Task = data[i].Tasks;
            t_len =Task.length;
            for(var d=0;d<d_len;d++){
                headHtml = '';
                makerHtml = '';
                timeHtml = '';
                codeHtml = '';
                creatorHtml = '';
                taskStatus=null;
                _class = dataIdList[d];
                _name = dataNameList[d];
                for(var t=0;t<t_len;t++){
                    if(Task[t].moduleId==_class){
                        taskVersion = Task[t].TaskVersions;
                        tv_len=taskVersion.length;
                        curVersion=null;
                        for(var tv=0;tv<tv_len;tv++){
                            if(taskVersion[tv].currentStatus=='true'){
                                curVersion=taskVersion[tv];
                            }
                        }
                       // console.log(curVersion);
                        curVersion.productor==null?product='':product=curVersion.productor.name;
                        switch(curVersion.status){
                            case -1:
                                taskStatus='task-beforeStart';
                                break;
                            case 0:
                                taskStatus='task-beforeStart';
                                break;
                            case 1:
                                taskStatus='task-beforeStart';
                                break;
                            case 2:
                                taskStatus='task-doing';
                                break;
                            case 3:
                                taskStatus='task-doing';
                                break;
                            case 4:
                                taskStatus='task-doing';
                                break;
                            case 5:
                                taskStatus='task-finished';
                                break;
                        }
                        headHtml+='<div class="shot-tasks '+taskStatus+'" title="'+curVersion.name+'" data-TaskId="'+Task[t].id+'">'+curVersion.name+'</div>';
                        makerHtml+='<div class="shot-tasks '+taskStatus+'">'+product+'</div>';
                        creatorHtml+='<div class="shot-tasks '+taskStatus+'">'+curVersion.creator.name+'</div>';
                        timeHtml+='<div class="shot-tasks '+taskStatus+'">'+curVersion.startDate.slice(0,10)+'/'+curVersion.planDate.slice(0,10)+'</div>';
                        codeHtml+='<div class="shot-tasks '+taskStatus+'" title="'+curVersion.version+'">'+curVersion.version+'</div>';
                    }
                }
                html+='<td class="'+_class+' shot-task-name">'+headHtml+
                    '<div class="onHover-showAddTaskBtn" data-shotName="'+data[i].name+'" data-stepName="'+_name+'"'+
                    'data-shotId="'+data[i].id+'" data-stepId="'+_class+'" data-type="1">' +
                    '<span>+</span>' +
                    '</div>' +
                    '</td>' +
                    '<td class="'+_class+' info-detail">'+makerHtml+
                    '</td>' +
                    '<td class="'+_class+' info-detail">'+timeHtml+
                    '</td>' +
                    '<td class="'+_class+' info-detail">'+codeHtml+
                    '</td>' +
                    '<td class="'+_class+' info-detail">'+creatorHtml+
                    '</td>';
            }
            html+='</tr>'
        }
        return html;
    }
    /*-----------------------------shot foot----------end----------------------------*/



    simpleTable.SimpleTable={
        initTable:initTable,
        getBodyData:getBodyData,
        getShotCount:getShotCount,
        getShotData:getShotData
    }
}(jQuery,window);