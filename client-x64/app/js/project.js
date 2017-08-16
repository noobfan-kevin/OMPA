/**
 * Created by hk053 on 2016/4/6.
 */
//000
var projectCommon={
authority:{  //项目&&任务卡权限
    manageAllProjects:false, //管理  所有项目的权限
    seeAllProjects:false,    //查看  所有项目的权限
    manageAllContracts:false,//管理所有  合同  的权限
    manageAllTasks:false,    //管理所有  任务  的权限
    isProjectLeader:false,  //项目负责人
    shot:{//(镜头)
        isTaskLeader:false,
        taskModuleId:[], //任务负责人节点数组
        isContractLeader:false,
        contractModuleId:[], //合同负责人节点数组
        isPayLeader:false,
        payModuleId:[], //支付负责人节点数组
        isMember:false
    },
    asset:{//资产
        isTaskLeader:false,
        taskModuleId:[], //任务负责人节点数组
        isContractLeader:false,
        contractModuleId:[], //合同负责人节点数组
        isPayLeader:false,
        payModuleId:[], //支付负责人节点数组
        isMember:false
    }
},
getProAuthoritysAndLoadProjectPage:function(projectId,fn){
    //请求项目权限
    $.ajax({
        url: '/api/taskCard/getCurUserProjectAuth',
        type: 'get',
        data:{
            projectId:projectId,
            userId:localStorage.getItem('userId')
        },
        success: function (data){
            console.log('项目--所有--权限',data);
            projectCommon.authority={
                manageAllProjects:false,
                seeAllProjects:false,
                manageAllTasks:false,
                manageAllContracts:false,
                isProjectLeader:false,
                shot:{
                    isTaskLeader:false,
                    taskModuleId:[], //任务负责人节点数组
                    isContractLeader:false,
                    contractModuleId:[], //合同负责人节点数组
                    isPayLeader:false,
                    payModuleId:[], //支付负责人节点数组
                    isMember:false
                },
                asset:{
                    isTaskLeader:false,
                    taskModuleId:[],//任务负责人节点数组
                    isContractLeader:false,
                    contractModuleId:[], //合同负责人节点数组
                    isPayLeader:false,
                    payModuleId:[], //支付负责人节点数组
                    isMember:false
                }

            };
            if(data.manageAllProject){
                projectCommon.authority.manageAllProjects=true;
            }
            if(data.seeAllProjects){
                projectCommon.authority.seeAllProjects=true;
            }
            if(data.manageAllTasks){
                projectCommon.authority.manageAllTasks=true;
            }
            if(data.manageAllContracts){
                projectCommon.authority.manageAllContracts=true;
            }
            if(data.manageProjectTasks){ //项目负责人
                projectCommon.authority.isProjectLeader=true;
            }else{
                if(data.shotAuth){
                    if(data.shotAuth.taskLeader){
                        projectCommon.authority.shot.isTaskLeader=true;
                        projectCommon.authority.shot.taskModuleId=data.shotAuth.taskModuleId;
                    }
                    if(data.shotAuth.contractLeader){
                        projectCommon.authority.shot.isContractLeader=true;
                        projectCommon.authority.shot.contractModuleId=data.shotAuth.contractModuleId;
                    }
                    if(data.shotAuth.payLeader){
                        projectCommon.authority.shot.isPayLeader=true;
                        projectCommon.authority.shot.payModuleId=data.shotAuth.payModuleId;
                    }
                    if(data.shotAuth.puTongChengYuan){
                        projectCommon.authority.shot.isMember=true;
                    }
                }
                if(data.assetAuth){
                    if(data.assetAuth.taskLeader){
                        projectCommon.authority.asset.isTaskLeader=true;
                        projectCommon.authority.asset.taskModuleId=data.assetAuth.taskModuleId;

                    }
                    if(data.assetAuth.contractLeader){
                        projectCommon.authority.asset.isContractLeader=true;
                        projectCommon.authority.asset.contractModuleId=data.assetAuth.contractModuleId;
                    }
                    if(data.assetAuth.payLeader){
                        projectCommon.authority.asset.isPayLeader=true;
                        projectCommon.authority.asset.payModuleId=data.assetAuth.payModuleId;
                    }
                    if(data.assetAuth.puTongChengYuan){
                        projectCommon.authority.asset.isMember=true;
                    }
                }
            }
            console.log('--项目权限变量--',projectCommon.authority);
            if(fn)
            {
                fn();//loadPage
            }
            if(projectCommon.authority.seeAllProjects||projectCommon.authority.isProjectLeader){
                //所有项目下列表信息
                $('#my-project-struct').show(); //组织结构
                $('#assetManagement').show();  //资产管理
                $('#shotManagement').show();//镜头管理
                $('#contractMg').show();//合同管理
                $('#statistics').show();//统计
                $('#projectDataBase').show();//项目数据
                $('#operationLog').show();//操作记录
                $('#fundManagment').show();//资金管理
            }else{
                if(projectCommon.authority.manageAllProjects){
                    //所有项目下列表信息(除了任务卡、合同)
                    $('#my-project-struct').show(); //组织结构
                    $('#statistics').show();//统计
                    $('#projectDataBase').show();//项目数据
                    $('#operationLog').show();//操作记录
                    $('#fundManagment').show();//资金管理
                }
                if(projectCommon.authority.manageAllTasks){
                    //资产，镜头显示
                    $('#assetManagement').show();  //资产管理
                    $('#shotManagement').show();//镜头管理
                }else{
                    if(projectCommon.authority.shot.isTaskLeader){
                        $('#shotManagement').show();//镜头管理
                    }
                    if(projectCommon.authority.asset.isTaskLeader){
                        $('#assetManagement').show();  //资产管理
                    }
                }
                if(projectCommon.authority.manageAllContracts||projectCommon.authority.shot.isContractLeader||projectCommon.authority.asset.isContractLeader){
                    //合同
                    $('#contractMg').show();//合同管理
                }
            }



        },
        error: function(data){
            //警告！
            //projectCommon.quoteUserWarning('#newTaskSave','449px','261px','获取权限失败！');
            console.log(data);
        }
    });

},

projectInfo:{},
projectleader:'',
showProjectInfo:'',
oldName:'',
createProject:function(){
       // projectCommon.projectInfo.projectImg='',
        projectCommon.projectInfo.name=$('#my-project-add-name').val(),
        projectCommon.projectInfo.schedule=$('#my-project-add-schedule').val(),
        projectCommon.projectInfo.startDate=$('#my-project-add-startTime').val(),
        projectCommon.projectInfo.endDate=$('#my-project-add-endTime').val(),
        projectCommon.projectInfo.creatorId=localStorage.getItem('userId'),
        projectCommon.projectInfo.unicode=$('#my-project-add-num').val(),
        projectCommon.projectInfo.desc=$('#my-project-add-des').val(),
        projectCommon.projectInfo.company=$('#my-project-add-investor').val(),
        projectCommon.projectInfo.invest=$('#my-project-add-allInvestor').val()||0,
        projectCommon.projectInfo.directorName=$('#my-project-add-direct').val(),
        projectCommon.projectInfo.writerName=$('#my-project-add-scriptwriter').val(),
        projectCommon.projectInfo.productorName=$('#my-project-add-production').val();

// projectCommon.projectInfo.id='666ecc90-fd70-11e5-b2bb-5b29666c30be';
       //console.log('================',projectCommon.imageFile);
    $.ajax({
            method:"post",
            data:'data='+JSON.stringify(projectCommon.projectInfo)+'&leader='+projectCommon.projectleader+'&users='+JSON.stringify(projectCommon.playerRecord),
            url:"/api/project/createProject",
            success:function(data){
                if(!data.ok){

                   var inChargeUsers =  data.inCharge.map(function(user) {
                        return user.name;
                    });

                    departmentObj.showAskModel(inChargeUsers + '为模块负责人，不可删除（请将其指定为项目负责人或项目成员）',false,function(data) {
                        console.log(data);
                    });
                    return ;
                }

                $('#myProject').attr('data-page','MyProjects');
                var projectID=data.data.id;
                var projectName = data.data.name;
                var invest = data.data.invest;
                if(data.message=='createSuccess'){
                    projectCommon.quoteUserInfo('#my-project-list','46%','40px','项目创建成功！');
                    projectDataBase.addFolder({
                        name:projectName,
                        fatherId:'projectRoot',
                        projectId:projectID
                    });
                    fundManagment.addFund({
                        name:projectName,
                        //fatherId:'root',
                        projectId:projectID,
                        amount : invest
                    });
                    //在服务器上创建项目根目录
                    ShotMangement.createDefaultJiAndChang(projectID);
                    //projectDataBase.addFolder({name:data.data.name,id:projectID});
                    // 当有图片需要的时候，这里不更新，移到图片上传成功后更新
                    if( !projectCommon.imageFile ) {
                        loadProjectList();
                        projectCommon.projectInfo={};
                        projectCommon.playerRecord=[];
                        projectCommon.projectleader='';
                    }else{
                        projectCommon.uploadProjectThumbnail(projectID);
                    }
                }else{
                    projectCommon.quoteUserInfo('#my-project-list','46%','40px','项目修改成功！');
                    if(projectName !== projectCommon.oldName) {
                        projectDataBase.changeFiles({
                            newName: projectName,
                            id: 'projectRoot',
                            projectId: projectID,
                            oldName: projectCommon.oldName
                        });
                        fundManagment.changeFund({
                            name:projectName,
                            id:projectID,
                            amount : invest
                        });
                        localStorage.setItem('projectName',projectName);
                    }
                    // 当有图片需要的时候，这里不更新，移到图片上传成功后更新
                    if( !projectCommon.imageFile ) {
                        $('#my-project-info').loadPage('projectView');
                        projectCommon.projectInfo={};
                        projectCommon.playerRecord=[];
                        projectCommon.projectleader='';
                    }else{
                        projectCommon.uploadProjectThumbnail(projectID);
                    }
                }
            },
            error:function(data) {
                projectCommon.quoteUserWarning('#my-project-add-save','-1px','-38px','项目创建失败！');
                console.log(data);
            }
        });
  },
  cancelCreateProject:function(){
      window.loadProjectList();
  },
    centerModals:function(e){
        var $clone = e.clone().css('display', 'block').appendTo('body');
        var top=Math.round(($clone.height() - $clone.find('.modal-content').height())/2);
        top = top > 0 ? top : 0;
        $clone.remove();
        e.find('.modal-content').css({"margin-left": '-3%',"margin-top":top});
    },
  projectInit:function(){
      $('.datetimepicker.datetimepicker-dropdown-bottom-right.dropdown-menu').remove();
                 $(".form_datetime").datetimepicker({
                     format: "yyyy-mm-dd",
                     minView: "month",
                     autoclose: true,
                     todayBtn: true,
                     language:'zh-CN'
                 });
      document.getElementById('container').onscroll = function(){
          $('.datetimepicker.datetimepicker-dropdown-bottom-right.dropdown-menu').css({'display':'none'});
          $('#my-project-add-startTime').blur();
          $('#my-project-add-endTime').blur();
      }
  },
  playerRecord:[], //记录项目成员（框里的）
  imageFile:null,
  findInArr:function(arr,item){
      for(var i=0; i<arr.length; i++){
          if(arr[i]==item){
              return i;
          }
      }
      return -1;
  },
    setLiCheckBox:function(item,b){
      if(b){
          item.find('i').html('&#xe64b;').attr('data-value','have').css('color','#999');//√
      }else{
          item.find('i').html('&#xe64c;').removeAttr('data-value').css('color','#ccc'); //×
      }
  },
  projectAdd:function(){
      /*新建项目 头*/
      /*$('#my-project-new').on('click',function(){
          //清空新建所有
          $('#myProject').attr('data-page','newProject');
          projectCommon.playerRecord.length=0;
          projectCommon.projectleader.length=0;
          projectCommon.projectInfo={};
          projectCommon.imageFile=null;
          $("input",'#my-project-add').val('');
          $('#my-project-add-people').attr('data-value','[]');
          $('#my-project-add-des').val('');
          $('#add-project-thumbnail').attr('src','images/project-add.png');

      });*/
      $('#my-project-add-save').on('click',function(){
         // var dataStartArr=$('#my-project-add-startTime').val().split('-');
          //保存时验证
          var dataNow=new Date();
          dataNow.setHours('0','0','0','0');
          var timeNow=dataNow.getTime();
          var dateVal=new Date($('#my-project-add-startTime').val()).getTime();
          if(!$('#my-project-add-name').val()||!$('#my-project-add-num').val()||!$('#my-project-add-schedule').val()||!$('#my-project-add-des').val()||!$('#my-project-add-proLeader').val()||!$('#my-project-add-people').val()||!$('#my-project-add-startTime').val()||!$('#my-project-add-endTime').val()){
              //若没有↓,不能进行创建~
              //名称，编号，进度 ，负责人，项目成员，开始时间，结束时间，项目描述
              projectCommon.quoteUserWarning('#my-project-add-save','-16px','-38px','有小红星标识的为必填项！');
              return false;
          }
          else if(($('#my-project-add-schedule').val()<0)||($('#my-project-add-schedule').val()>100)){
              projectCommon.quoteUserWarning('#my-project-add','558px','155px','项目进度为0-100%！');
              return false;
          }
          /*else if(dateVal<timeNow){
              projectCommon.quoteUserWarning('#my-project-add-startTime','78px','170px','开始时间已过期！');
              return false;
          }*/
          else if($('#my-project-add-startTime').val()>$('#my-project-add-endTime').val()){
              projectCommon.quoteUserWarning('#my-project-add-startTime','38%','26%','项目开始时间不能大于结束时间！');
              return false;
          }
          else if($('#my-project-add-des').val().length>500){
              projectCommon.quoteUserWarning('#my-project-add-des','4px','-29px','项目描述字符长度不能大于500！');
              return false;
          }
          else if($('#my-project-add-allInvestor').val()>999999999){
              projectCommon.quoteUserWarning('#my-project-add-allInvestor','60px','-29px','金额应在0-999999999之间！');
              return false;
          }
          else{
              projectCommon.createProject();
          }

      });
      //取消新建项目
      $('#my-project-add-cancel').on('click',function(){
          if(projectCommon.projectInfo.id){
              $('#my-project-info').loadPage('projectView');
          }else{
              projectCommon.cancelCreateProject();
          }
      });
      //新建项目 点图片选择
      $('#my-project-add-image-btn').change(function(ev){
          if(!$(this).val()){
               return false;
           }
          projectCommon.imageFile = this.files;
          $('#add-project-thumbnail').attr('src',$(this).val());
      });

      //项目负责人 树初始化
      var newProjectLeaderTree=new ZTreeObj('default');
      newProjectLeaderTree.initAll($("#my-project-add-departmentTree"),'/api/department/getDepList');
      $('#my-project-add-leader').off('click').on('click','#my-project-add-departmentTree li a',function(){
          var departmentId=newProjectLeaderTree.getCheckedNode();
          projectCommon.getprojectLeader(departmentId);
      });
      //点击input框获取被选负责人
      $('#my-project-add-proLeader').on('focus',function(){
          var departmentId=newProjectLeaderTree.getCheckedNode();
          projectCommon.getprojectLeader(departmentId);
      });
      //点选择 获取被选负责人
      $('#my-project-chooseLeader').on('click',function(){
          //项目负责人 树初始化
          newProjectLeaderTree.initAll($("#my-project-add-departmentTree"),'/api/department/getDepList',function(data){
              var thisDepart=newProjectLeaderTree.getCheckedNode();
              projectCommon.getprojectLeader(thisDepart);
              $('#my-project-add-leader').modal('show');
          });
      });
      $('#my-project-chooseList').on('click','li a',function(){
          projectCommon.projectleader=$(this).parent().data('value');

          //联系项目成员
          var has=projectCommon.findInArr(projectCommon.playerRecord,projectCommon.projectleader);
          if(has!=-1){
              var player=$('#my-project-add-people').val().split('， ');
              player.splice(has,1);
              var str=player.join('， ');
              projectCommon.playerRecord.splice(has,1);
              $('#my-project-add-people').val(str).attr('data-value',JSON.stringify(projectCommon.playerRecord));
          }

          $('#my-project-add-proLeader').val($(this).text());
          $('#my-project-close').click();
      });


      //项目成员 树初始化
      var newProjectMemberTree=new ZTreeObj('default');
      newProjectMemberTree.initAll($("#my-project-add-tree"),'/api/department/getDepList');
      $('#my-project-add-chooseBody').off('click').on('click','#my-project-add-tree li a',function(){
          var departmentId=newProjectMemberTree.getCheckedNode();
          projectCommon.findDepertmentPlayer(departmentId);
      });
      //项目人员点选择
      $('#my-project-add-chooseFlag').on('click',function(){
          //项目成员 树初始化
          newProjectMemberTree.initAll($("#my-project-add-tree"),'/api/department/getDepList',function(data){
              var thisDepart=newProjectMemberTree.getCheckedNode();
              projectCommon.findDepertmentPlayer(thisDepart);
              projectCommon.refreshPlayerHaveChoose();
              $('#my-project-add-chooseBody').modal('show');
          });
      });
      //点击input框获取被选成员
      $('#my-project-add-people').on('focus',function(){
          var thisDepart=newProjectMemberTree.getCheckedNode();
          projectCommon.findDepertmentPlayer(thisDepart);
          projectCommon.refreshPlayerHaveChoose();
      });
      //删除项目人员
      $('#my-project-add-haveChoose').on('click','li i',function(){
          var index=$(this).parent().index();
          projectCommon.playerRecord.splice(index,1);
          $(this).parent().remove();

          var thisDepart=newProjectMemberTree.getCheckedNode();
          projectCommon.findDepertmentPlayer(thisDepart);
      });

      //项目成员选择   保存  my-project-add-chooseSave
      $('#my-project-add-chooseSave').on('click',function(){
          projectCommon.savePlayerChoose();
      });
      //项目成员选择  关闭和取消  closeProCreate   my-project-add-chooseCancelSave
      $('#closeProCreate').on('click',function(){
          projectCommon.cancelPlayerChoose();
      });
      $('#my-project-add-chooseCancelSave').on('click',function(){
          projectCommon.cancelPlayerChoose();
      });

      //输入验证
      departmentObj.bindLegalCheck([$("#my-project-add-name")],'79','-28','');  //项目名称
      departmentObj.bindLegalCheck([$('#my-project-add-num')],'79','-28','username'); //项目编号  数字字母
      departmentObj.bindLegalCheck([$('#my-project-add-schedule')],'79','-28','number'); //项目进度
      departmentObj.bindLegalCheck([$('#my-project-add-production')],'78','-28','name'); //制片
      departmentObj.bindLegalCheck([$('#my-project-add-direct')],'44','-28','name'); //导演    汉字字母
      departmentObj.bindLegalCheck([$('#my-project-add-scriptwriter')],'78','-28','name');  //编剧
      departmentObj.bindLegalCheck([$('#my-project-add-investor')],'60','-28','name');  //投资方
      departmentObj.bindLegalCheck([$('#my-project-add-allInvestor')],'60','-28','number');  //总投资

        //全选 li    my-project-add-chooseAllPeople
        //选择  ul  my-project-add-chooseList
        //li
        //未选  <li class="my-project-add-choose-people"><i class="iconfont">&#xe64c;</i>张三</li>
        //已选  <li class="my-project-add-choose-people"><i class="iconfont active">&#xe64b;</i>张三三</li>
      //点 项目成员全选
      $('#my-project-add-chooseAllPeople').on('click',function(){
          var liList=$('#my-project-add-chooseList li');
          var str='';
          if(!$(this).find('i').attr('data-value')){  //×
              $(this).find('i').html('&#xe64b;').attr('data-value','have').css('color','#999');//√
              var str='';
              for(var i=0; i<liList.length; i++){
                  //liList.eq(i).find('i').html('&#xe64b;').attr('data-value', liList.eq(i).attr('data-value')).css('color','#999');//√
                  projectCommon.setLiCheckBox(liList.eq(i),true);     //√
                  has=projectCommon.findInArr(projectCommon.playerRecord,liList.eq(i).attr('data-value'));
                  if(has==-1){ //没有

                      //console.log('dd'+JSON.stringify(projectCommon.playerRecord));
                      projectCommon.playerRecord.push(liList.eq(i).attr('data-value'));
                      str+='<li data-value="'+liList.eq(i).attr('data-value')+'"><span>'+liList.eq(i).find('span').html()+'</span><i class="iconfont">&#xe63d;</i></li>';
                  }
              }
              $('#my-project-add-haveChoose').append(str);
          }else{
              $(this).find('i').html('&#xe64c;').removeAttr('data-value').css('color','#ccc'); //×
              for(var i=0; i<liList.length; i++){
                  //liList.eq(i).find('i').html('&#xe64c;').removeAttr('data-value').css('color','#ccc'); //×
                  projectCommon.setLiCheckBox(liList.eq(i),false);     //×
                  has=projectCommon.findInArr(projectCommon.playerRecord,liList.eq(i).attr('data-value'));
                  if(has!=-1){
                      //console.log('cc'+JSON.stringify(projectCommon.playerRecord));
                      projectCommon.playerRecord.splice(has,1);
                      $('#my-project-add-haveChoose li').eq(has).remove();
                  }
              }
          }
          $('.modal').on('show.bs.modal', projectCommon.centerModals($('#my-project-add-chooseBody')));
      });
      //点 项目成员单选
      $('#my-project-add-chooseList').on('click','li',function(){
          //console.log(projectCommon.playerRecord.thisDepart);
          var str='';
          var has=-1;
          //var id=$(this).attr('data-value');
          if(!$(this).find('i').attr('data-value')){ //×
              //$(this).find('i').html('&#xe64b;').attr('data-value',$(this).attr('data-value')).css('color','#999');//√
              projectCommon.setLiCheckBox($(this),true);     //√
              has=projectCommon.findInArr(projectCommon.playerRecord,$(this).attr('data-value'));
             // console.log(has);
              if(has==-1){  //不在已选里
                  //console.log($(this).attr('data-value'));
                  projectCommon.playerRecord.push($(this).attr('data-value'));
                  //console.log('bb'+JSON.stringify(projectCommon.playerRecord));
                  str='<li data-value="'+$(this).attr('data-value')+'"><span>'+$(this).find('span').html()+'</span><i class="iconfont">&#xe63d;</i></li>';
                  $('#my-project-add-haveChoose').append(str);
              }
          }else{//√
              //$(this).find('i').html('&#xe64c;').removeAttr('data-value').css('color','#ccc'); //×
              projectCommon.setLiCheckBox($(this),false);     //×
              has=projectCommon.findInArr(projectCommon.playerRecord,$(this).attr('data-value'));
              //console.log(has);
              if(has!=-1){
                  projectCommon.playerRecord.splice(has,1);
                  //console.log('aa'+JSON.stringify(projectCommon.playerRecord));
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
              projectCommon.setLiCheckBox($('#my-project-add-chooseAllPeople'),true);     //√
          }else{
              //$('#my-project-add-chooseAllPeople').find('i').html('&#xe64c;').removeAttr('data-value').css('color','#ccc'); //×
              projectCommon.setLiCheckBox($('#my-project-add-chooseAllPeople'),false);     //×
          }
          $('.modal').on('show.bs.modal', projectCommon.centerModals($('#my-project-add-chooseBody')));
      });

      /*新建项目 尾*/


  },
  quoteUserWarning:function(id,left,top,des){
      var box =$('<div id="m-tip" style="' + userCommon.warnMessage(top,left) +'">'+des+'<div>');
      $(id).before(box);
      userCommon.warnMessageRemove(box);
  },
  quoteUserWarning2:function(id,right,top,des){
    var box =$('<div id="m-tip" style="' + userCommon.warnMessage2(top,right) +'">'+des+'<div>');
    $(id).before(box);
    userCommon.warnMessageRemove(box);
 },
  quoteUserInfo:function(id,left,top,des){
      var box =$('<div id="m-tip" style="' + userCommon.infoMessage(top,left) +'">'+des+'<div>');
      $(id).before(box);
      userCommon.warnMessageRemove(box);
  },
  refreshPlayerHaveChoose:function(){
      //console.log('这是刷新已选项目成员的--↓');
      if($('#my-project-add-people').val()){
          var str='';
          var arrName=$('#my-project-add-people').val().split('， ');

          for(var i=0; i<arrName.length; i++){
              str+='<li data-value="'+projectCommon.playerRecord[i]+'"><span>'+arrName[i]+'</span><i class="iconfont">&#xe63d;</i></li>';
          }
          $('#my-project-add-haveChoose').html(str);
      }else{
          $('#my-project-add-haveChoose').html('');
      }
  },
  cancelPlayerChoose:function(){
      projectCommon.playerRecord=JSON.parse($('#my-project-add-people').attr('data-value'));
      //projectCommon.playerRecord=[];
  },
  savePlayerChoose:function(){
      var haveChooseLi=$('#my-project-add-haveChoose li');
      if(haveChooseLi.length){
          var names=[];
          $('#my-project-add-haveChoose li').each(function(i){
              names.push($(this).find('span').html());
          });
          var str=names.join('， ');
          //console.log('num'+$('#my-project-add-haveChoose li').length);
          $('#my-project-add-people').val(str).attr('data-value',JSON.stringify(projectCommon.playerRecord));
      }else{
          $('#my-project-add-people').val('').attr('data-value','[]');
      }
  },
  findDepertmentPlayer:function(id){
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
                      var has=projectCommon.findInArr(projectCommon.playerRecord,data.data[i].id);
                      //与负责人之间的联系
                      if((projectCommon.projectleader!='')&&(projectCommon.projectleader==data.data[i].id)){
                          continue;
                      }
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
                      projectCommon.setLiCheckBox($('#my-project-add-chooseAllPeople'),true);     //√

                  }else{
                      //$('#my-project-add-chooseAllPeople').find('i').html('&#xe64c;').removeAttr('data-value').css('color','#ccc'); //×
                      projectCommon.setLiCheckBox($('#my-project-add-chooseAllPeople'),false);     //×
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
  },
 getprojectLeader:function(id){
     $.ajax({
         type: 'post',
         async: true,
         dataType:'json',
         url: '/api/department/getDepartmentUser',
         data:{
         departmentId:id,
     },
     success:function(data){
         var str='';
         if(data.data.length!=0) {
             for(var i=0;i<data.data.length;i++){
                 str+= '<li data-value="'+data.data[i].id+'"><a style="text-decoration: none;cursor: pointer">'+data.data[i].name+'</a></li>';
             }
         $("#my-project-chooseList").html(str);
         }else{
             $("#my-project-chooseList").html('');
         }
         $('.modal').on('show.bs.modal', projectCommon.centerModals($('#my-project-add-leader')));
     },
     error:function(err){
         console.log(err);
     }
 });
 },
 uploadProjectThumbnail: function(projectId) {

     fileUploader(projectCommon.imageFile,{
         success:function(file) {
             console.log('图片上传成功--------↓');
             console.log(file);
             if(file){
                 $('#add-project-thumbnail').attr('data-id',file.id);
                 $('#my-project-add-image-btn').val('');
             }
             if(projectCommon.projectInfo.id){
                 $('#my-project-info').loadPage('projectView');
             }else{
                 loadProjectList();
             }
             projectCommon.imageFile='';
             projectCommon.projectInfo={};
             projectCommon.playerRecord=[];
             projectCommon.projectleader='';
         },
         error:function(err){
             projectCommon.quoteUserWarning('#my-project-list','46%','11px','缩略图上传失败！');
             loadProjectList();
         },
         allow:['image/jpeg','image/jpg','image/png'],
         single: true,
         field:'thumbnail',
         limit: '2m',
         data:{
             "projectId":projectId
         }
     });
    },
    updateProject: function () {
        var memberArray = '';
        $('#my-project-info').loadPage('updateProject');
        $('#my-project-add').show().siblings().hide();
        $('.my-project-add').css({'margin-left': '10px'});
        $('#createProject').text('编辑项目');
        var curProjectId = localStorage.getItem('projectId');
        $.ajax({
            url:'/api/project/' + curProjectId,
            method: "get",
            success: function(data) {
                if(data.ok){
                    var data=projectCommon.getProjectInfo(data);
                    $('#curPosition').html(data.name);
                    projectCommon.projectInfo.id=data.id;
                    projectCommon.oldName = data.name;
                    $('#create-project').find('input,img,textarea').each(function () {
                        if (this.nodeName.toLowerCase() == 'img') {
                            $(this).attr('src', configInfo.server_url+'/'+data[$(this).data('content')]);
                        } else if ($(this).data('content') == 'members') {
                            $(this).val(data.member);
                            $(this).attr('data-value',JSON.stringify(projectCommon.playerRecord));
                        } else if ($(this).data('content') == 'leader') {
                            $(this).val(data.leader);
                        } else {
                            $(this).val(data[$(this).data('content')]);
                        }
                    });
                }else{
                    console.error('获取项目信息失败！');
                }
            },
            fail: function(err) {
                console.error(err);
            }
        });
    },
    getProjectInfo: function (data) {
        var projectData = data.list;
        projectData['member'] = '';
        for (var i = 0; i < projectData['Users'].length; i++) {
            if (projectData['Users'][i]['ProjectMember']['role'] == 1) {
                projectData['leader'] = projectData['Users'][i].name;
                projectCommon.projectleader=projectData['Users'][i].id;
            } else {
                projectCommon.playerRecord.push(projectData['Users'][i].id);
                projectData['member']+=''+(projectData['Users'][i].name)+'， ';
            }
        }
        projectData['member']= projectData['member'].substring(0, projectData['member'].length-2);
        projectData.endDate=(projectData.endDate).substr(0,10);
        projectData.startDate=(projectData.startDate).substr(0,10);
        return projectData;
    }
};


