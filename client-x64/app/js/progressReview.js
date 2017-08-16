/**
 * Created by hk60 on 2016/5/16.
 */
var progressReview = angular.module('progressReview',[]);
progressReview.controller('progressReviewController',['$scope','$http',function($scope){
    var curUserId = localStorage.getItem('userId');
    var progressId = localStorage.getItem('progressId');
    var curUser = null;
    var TreeObj = null;
    $scope.moveFileName='';
    $scope.moveFilePath = '';
    $scope.moveFileSize = '';
    $scope.files = [];
    $scope.reviews = [];
    $scope.reviewModel='';
    $scope.checkReview=false;
    $scope.uploadFileObj =[];
    $scope.downloadName='';
    $scope.downloadPath='';
    $scope.defaultSrc = configInfo.server_url+'/fileFormat/default.gif';
    $scope.typeDictionary =['ac3','ai','aiff','ani','asf','au','avi','bat','bin','blb','bmp','bng','bup',
        'cab','cal','cat','cur','dat','dcr','der','dic','dll','doc','docx','dvd','dwg','dwt','fon','git','hlp',
        'hst','html','ico','ifo','inf','ini','java','jif','jpg','log','m4a','mmf','mmm','mov','mp2','mp2v',
        'mp3','mp4','mpeg','msp','pdf','png','ppt','pptx','psd','ra','rar','reg','rtf','theme','tiff','ttf',
        'txt','vob','wav','wma','wpl','wri','xls','xlsx','xml','xsl','zip'];

    $scope.showDownloadInput = function(path,name){
        $scope.downloadName=name;
        $scope.downloadPath=path;
        angular.element('#myDownloadInput').attr('nwsaveas',name).click();
    };
    angular.element('#myDownloadInput').on('change',function(){
        var file = $(this)[0].value;
        //console.log('1111',$scope.downloadPath, file, $scope.downloadName);
        fileDownloader.addItem($scope.downloadPath, file, $scope.downloadName);
        $(this).val('');
    });
    /**
         * 获取当前用户信息
         */
    $.ajax({
        method:'get',
        url:'/api/user/'+curUserId,
        success:function(data){
            //console.log('user',data);
            curUser = data;
        },
        error:function(err){
            console.log(err);
        }
    });

        /**
         * 加载评论列表和附件列表
         */
    new Promise(function(resolve,reject){
        $.ajax({
            method:'get',
            url:'/api/reviewComment/'+progressId,
            success:function(success){
                resolve(success);
            },
            error:function(error){
                reject(error);
            }
        });
    })
        .then(function(success){
        //console.log('all',success);
        var len = success.length;
        var flag = null;
            $scope.$apply(function(){
                for(var i=0;i<len;i++){
                    success[i].senderId==curUserId?flag=true:flag=false;
                    if(success[i].fileId==null||success[i].fileId==''){

                    }else{
                        $scope.files.push({
                            "fileName":success[i].belongFile.originalName,
                            "src": configInfo.server_url+'/'+$scope.getFileType(success[i].belongFile.name),
                            "filePath":configInfo.server_url+'/'+success[i].belongFile.name,
                            "senderId":success[i].senderId,
                            "fileId":success[i].belongFile.id,
                            "reviewId":success[i].id,
                            "size":success[i].belongFile.size,
                            "name":success[i].belongFile.name
                        });
                    }
                    $scope.reviews.push({
                        "senderName":success[i].sender.name,
                        "senderImg":configInfo.server_url+'/'+success[i].sender.image,
                        "content":success[i].content,
                        "time":$scope.getTime(success[i].createdAt),
                        "fileName":success[i].belongFile?success[i].belongFile.originalName:'',
                        "filePath":success[i].belongFile?configInfo.server_url+'/'+success[i].belongFile.name:'',
                        "reviewId":success[i].id,
                        "flag":flag
                    });
                }
            });

        //console.log('message',$scope.files,$scope.reviews);
    },function(error){
        console.log('error',error);
    }).
    then(function(){
        angular.element('.body-comment-view-contain').scrollTop(angular.element('.body-comment-view-contain')[0].scrollHeight);
    })
        .catch(function(data){
        console.log('errorMessage',data);
    });

        /**
         * 上传文件
         */
    angular.element('#progress-file-uploadFile').on('change',function(){
    //$('#progress-file-uploadFile').on('change',function(){
        var versionId = $('#taskVersionCheck').attr('data-value');
        var file = $(this)[0].files;
        var data = {
            "senderId":curUserId,
            "content":"上传了",
            "fileName":file[0].name,
            "progressId":progressId,
            "taskVersionId":versionId,
            "projectId":localStorage.getItem('projectId')
        };
        $scope.addReview(data,file[0]);
        $(this).val('');
    });

    //$('body').on('click.ompa',function(e){
    //    var $target = $(e.target);
    //    //console.log($target);
    //    if($target.hasClass('turnFileToBase')){
    //
    //    }else if($target.parent().hasClass('turnFileToBase')){
    //
    //    }else{
    //        $('.turnFileToBase').hide();
    //    }
    //});
    $('body').off('mousedown.ompa').on('mousedown.ompa',function(e){
        var $target = $(e.target);
        if($target.hasClass('progress-file')){
            if(e.button==0){
                $('.turnFileToBase').hide();
            }
        }else if($target.parent().hasClass('progress-file')){
            if(e.button==0){
                $('.turnFileToBase').hide();
            }
        }else if($target.hasClass('turnFileToBase')){
           if(e.button == 0){
              //TODO 显示全局移动页
               $scope.showManageDataBasePage();
           }
            $('.turnFileToBase').hide();
        }else if($target.parent().hasClass('turnFileToBase')){
            if(e.button == 0){
                //TODO 显示全局移动页
                $scope.showManageDataBasePage();
            }
            $('.turnFileToBase').hide();
        }else{
            $('.turnFileToBase').hide();
        }
    });
    $scope.showManageDataBasePage = function(){
        var projectId = localStorage.getItem('projectId');
        var projectName = localStorage.getItem('projectName');
        var list = JSON.parse(sessionStorage.getItem('parentsIdList'))||[];
        var len  = list.length;
        TreeObj = new ZTreeObj('default');
        TreeObj.initAll($('#turn-DataBase-tree'),'/api/projectDataBase/folderInfo/'+projectId+'/'+projectName,function(){
            var treeObj = $.fn.zTree.getZTreeObj("turn-DataBase-tree");
            var node = null;
            for(var i =0;i<len;i++){
                node = treeObj.getNodeByParam('id', list[i], null);
                treeObj.expandNode(node, true, false, true);
            }
                node = treeObj.getNodeByParam('id', sessionStorage.getItem('curNodeId'), null);
            treeObj.selectNode(node);
            TreeObj.selectCurNode(sessionStorage.getItem('curNodeId'));
        });

        $('.turn-DataBase-contain').show();
    };
    angular.element('#closeWindow').off('click').on('click',function(){
        $('.turn-DataBase-contain').hide();
    });
    angular.element('#TDC-btn-cancel').off('click').on('click',function(){
        $('.turn-DataBase-contain').hide();
    });
    angular.element('#TDC-btn-sure').off('click').on('click',function(){
        var nodeId = TreeObj.getCheckedNode();
        console.log(nodeId,localStorage.getItem('projectName'),$scope.moveFileName,$scope.moveFilePath,$scope.moveFileSize);
        $.ajax({
            type:"post",
            url:'/api/projectDataBase/transferFile',
            data:{oldPath:$scope.moveFilePath,
                originalName:$scope.moveFileName,
                fatherId:nodeId,
                projectName:localStorage.getItem('projectName'),
            size:$scope.moveFileSize},
            success:function(data){
                projectCommon.quoteUserWarning2('.turn-DataBase-check','420px','80px','操作成功！');
                setTimeout(function(){
                    $('.turn-DataBase-contain').hide();
                },1000);
                console.log(nodeId,'12312312');
                $.ajax({
                    type:'get',
                    url:'/api/projectDataBase/'+nodeId,
                    success:function(nodeInfo){
                        sessionStorage.setItem('parentsIdList',nodeInfo.parentIds);
                        sessionStorage.setItem('curNodeId',nodeId);
                    },
                    error:function(err){
                       console.log(err);
                    }
                })
            },
            error:function(err){
                console.log(err);
            }
        });
        //TODO 对接文件转移到项目数据库
    });
    $scope.backToProgressPage = function(){
        angular.element('#task-progress-list-wrap').show();
        taskProgressList.refreshProgressLists($('#taskVersionCheck').attr('data-value'),$('#taskVersionCheck').attr('data-status'));
        angular.element('#progress-review-page').hide();
    };
        /**
         * 删除文件，附带删除评论列表内对应消息（前台数据处理）
         * @param list
         * @param reviewId
         */
    $scope.removeListByReviewId = function(list,reviewId){
        var len = list.length;
        //console.log(len);
        for(var i=0;i<len;i++){
            //console.log(i,list[i]);
            if(list[i].reviewId==reviewId){
                list.splice(i,1);
                break;
            }
        }
    };

        /**
         * 判断上传文件的类型。
         * @param str 文件名
         * @returns {*}
         */
    $scope.getFileType =function(str){
        var final = str;
        var list = str.split('.');
        var len = $scope.typeDictionary.length;
        var flag = false;
        switch (list[1]){
            case 'jpg':
                break;
            case 'gif':
                break;
            case 'bmp':
                break;
            case 'png':
                break;
            case 'jpeg':
                break;
            case 'svg':
                break;
            default:
                for(var i=0;i<len;i++){
                    if($scope.typeDictionary[i]==list[1]){
                        flag=true;
                    }
                }
                if(flag){
                    final ='fileFormat/'+list[1]+'.gif';
                }else{
                    final ='fileFormat/default.gif';
                }

        }
        return final;
    };

    $scope.deleteReviews = function(reviewId,callback){
        new Promise(function(resolve,reject){
            $.ajax({
                method:'delete',
                url:'/api/reviewComment/'+reviewId,
                data:{projectId:localStorage.getItem('projectId')},
                success:function(success){
                    resolve(success);
                },
                error:function(err){
                    reject(err);
                }
            })
        }).then(function(success){
            console.log('delete review success',success);
            if(callback){
                callback();
            }
        },function(err){
            console.log('delete review fail',err);
        }).catch(function(info){
            console.log('promise err info',info);
        })
    };
    $scope.rightBtnClick = function(name,path,size){
        if(event.button==2){
            console.log(name,path,size);
            $scope.moveFileSize = size;
            $scope.moveFileName = name;
            $scope.moveFilePath = path;
            var x = event.pageX-158;
            var y = event.pageY-288;
            $('.turnFileToBase').show().css({"top":y,"left":x});
        }
    };

        /**
         * 删除上传文件，附带评论（后台数据）
         * @param fileId
         * @param senderId
         * @param reviewId
         */
    $scope.deleteReviewFile = function(fileId,senderId,reviewId){
        if(senderId==curUserId){
            departmentObj.showAskModel('确定删除该文件？',true,function(flag){
                if(flag){
                    new Promise(function(resolve,reject){
                        $scope.deleteReviews(reviewId,function(){
                            $scope.$apply(function(){
                                //console.log($scope.files,$scope.reviews);
                                $scope.removeListByReviewId($scope.files,reviewId);
                                $scope.removeListByReviewId($scope.reviews,reviewId);
                            });
                            resolve();
                        });
                    }).then(function(){
                        $.ajax({
                            method:'delete',
                            url:'/api/file/'+fileId,
                            success:function(success){
                            },
                            error:function(err){
                                console.log(err);
                            }
                        })
                    },function(error){
                        console.log(error);
                    }).catch(function(data){
                        console.log('删除文件catch信息',data);
                    })
                }
            })
        }else{
            departmentObj.showAskModel('您没有删除该文件权限',false);
        }

    };

        /**
         * 提交评论
         */
    $scope.submitReviews = function(){
        var reviews = $scope.reviewModel;
        if(reviews==''){
            console.log('没有内容输入');
        }else{
            var versionId = $('#taskVersionCheck').attr('data-value');
            console.log(versionId);
            var data={"senderId":curUserId,"senderName":curUser.name,"content":reviews,"progressId":progressId,"taskVersionId":versionId};
            $scope.addReview(data);
        }
    };

    $scope.addUserName = function(name){
            $scope.reviewModel='回复 '+name+':';
            $('#men-reviews').focus();
    };

        /**
         * 添加评论，文件上传
         * @param data
         * @param file
         */
    $scope.addReview = function(data,file){
        var _file = file;
        new Promise(function(resolve,reject){
            $.ajax({
                method:'post',
                data:data,
                url:'/api/reviewComment/',
                success:function(success){
                    resolve(success);
                },
                error:function(err){
                    reject(err);
                }
            })
        }).then(function(success){
            var _success = success;
            //console.log(_file);
                if(_file){
                    fileUploader(_file, {
                        success: function(success) {
                            console.log('dasss',_success);
                            console.log('sss',success);
                            $scope.$apply(function(){
                                $scope.reviews.push({
                                    "senderName":curUser.name,
                                    "senderImg":configInfo.server_url+'/'+curUser.image,
                                    "content":_success.content,
                                    "time":$scope.getTime(_success.createdAt),
                                    "fileName":success.originalName,
                                    "filePath":configInfo.server_url+'/'+success.name,
                                    "reviewId":_success.id,
                                    "flag":true
                                });
                                $scope.reviewModel='';
                                $scope.files.push({
                                    "fileName":success.originalName,
                                    "src": configInfo.server_url+'/'+$scope.getFileType(success.name),
                                    "filePath":configInfo.server_url+'/'+success.name,
                                    "senderId":_success.senderId,
                                    "fileId":success.id,
                                    "reviewId":_success.id,
                                    "size":success.size,
                                    "name":success.name
                                })

                            });

                        },fail:function(ev,xhr){
                            $scope.deleteReviews(_success.id);
                        },
                        field:'file',
                        data: {
                            reviewId: success.id
                        },
                        progress:function(event,xhr){
                            var percent =(event.loaded/event.total)*100;
                            //console.log(xhr);
                            $scope.$apply(function(){
                                var len = $scope.uploadFileObj.length;
                                for(var i=0;i<len;i++){
                                    if($scope.uploadFileObj[i].reviewId == _success.id){
                                        $scope.uploadFileObj[i]._width = "width:"+percent+'%;';
                                    }
                                }

                                if(percent==100){
                                    for(var j=0;j<len;j++){
                                        if($scope.uploadFileObj[j].reviewId == _success.id){
                                            $scope.uploadFileObj[j]._show = false;
                                        }
                                    }
                                }
                            });
                        },
                        start:function(ev, xhr) {
                            $scope.$apply(function(){
                                $scope.uploadFileObj.push(
                                    {"reviewId":_success.id,"_show":true,"_name":_file.name,"_width":"width:0;","_xhr":xhr}
                                );
                            });
                        },
                        abort:function(ev,xhr){
                            xhr.upload.onprogress = null;
                            $scope.deleteReviews(_success.id);
                            var len = $scope.uploadFileObj.length;
                            for(var i=0;i<len;i++){
                                if($scope.uploadFileObj[i].reviewId == _success.id){
                                    $scope.uploadFileObj[i]._show = false;
                                }
                            }
                            console.log('cancel upload file');
                        },
                        allow: ['*'],
                        showPanel: false
                    })
                }else{
                    $scope.$apply(function() {
                        $scope.reviews.push({
                            "senderName": curUser.name,
                            "senderImg": configInfo.server_url + '/' + curUser.image,
                            "content": _success.content,
                            "time": $scope.getTime(_success.createdAt),
                            "fileName": '',
                            "filePath": '',
                            "reviewId": _success.id,
                            "flag": true
                        });
                        $scope.reviewModel='';
                    });
                }
        },function(error){
            console.log('新增评论失败',error);
        }).then(function(){
            //console.log('dasjkaaaaa');
            angular.element('.body-comment-view-contain').scrollTop(angular.element('.body-comment-view-contain')[0].scrollHeight);
        }).catch(function(data){
            console.log('新增评论异常',data);
        })

    };

    $scope.cancelUploadFile =function(id,xhr){
        console.log(xhr);
        xhr.progress = null;
        xhr.abort();
    };

        /**
         * 对数据库获取时间进行转换
         * @param date
         * @returns {string}
         */
    $scope.getTime = function(date){
        //console.log(date);
        var time = new Date(date);
        var c_time = time.getTime();
        var d_time = new Date(c_time);
        //console.log(d_time);
        var Y = d_time.getFullYear() + '-',
        M = (d_time.getMonth()+1 < 10 ? '0'+(d_time.getMonth()+1) : d_time.getMonth()+1) + '-',
        D = d_time.getDate() + ' ',
        h = d_time.getHours() + ':',
        m = d_time.getMinutes() + ':',
        s = d_time.getSeconds();
        return (Y+M+D+h+m+s);
    };
  //  $scope.img='&#xe68d;';
    $scope.checkResult='';
    $scope.getPass=true;
    $scope.noPass=false;
    $scope.curNum=true;
    $scope.showCheckStatus=function(){//弹出审核框
        $scope.checkReview=!$scope.checkReview;
    };
    $scope.getCheckResult= function(num){//选择审核结果
       if(num==$scope.curNum){
           //NOTHING
       }else{
           $scope.getPass=!$scope.getPass;
           $scope.noPass=!$scope.noPass;
           $scope.curNum =!$scope.curNum;
       }
    };
  $scope.saveCheckResult=function(){
      var data={userId:localStorage.getItem('userId'),taskVersionId:$('#taskVersionCheck').data('value'),
          progressId:localStorage.getItem('progressId')};
      if($scope.curNum==true){
          data.status=2;
      }else{
          data.status=0;
      }
      new Promise(function(resolve,reject){
          $.ajax({
              method:'post',
              data:data,
              dataType:'json',
              async: true,
              url:'/api/progress/checkProgress',
              success:function(success){
                  resolve(success);
              },
              error:function(err){
                  reject(err);
              }
          });
      }).then(function(success){
             if(success==1){
                 //审核完成
                 socketCommon.emit().getCheckUnReadTask('',localStorage.getItem('progressId'));
                 $scope.commonShow('2%', '72%', '审核成功');
                 $('#addCheckResult').hide(); //添加审核意见按钮
                 var pageType=localStorage.getItem('pageType');
                 if(pageType=='shot'||pageType=='shotList'||pageType=='asset'||pageType=='assetList'){  //项目内
                     var thisTaskId=localStorage.getItem('thisTaskId');
                     taskBasicInfo.refreshTask('',thisTaskId);
                 }else{ //我的任务
                     var thisTaskVersionId=localStorage.getItem('thisTaskVersionId');
                     taskBasicInfo.refreshTask('check',thisTaskVersionId);
                 }
             }else if(success==3){
                 $scope.commonShow('2%', '68%', '没有审核权限');
             }else if(success==2){
                 $scope.commonShow('2%', '72%', '已审核过');
             }else {
                 $scope.commonShow('2%','72%','审核失败');
             }
      },function(err){
          console.log(err);
          $scope.commonShow('2%', '72%', '审核失败');
      }).catch(function(data){
          console.log(data);
      });
      $scope.showCheckStatus();
  };
    $scope.commonShow=function(top,left,text){
        var box =$('<div id="m-tip" style="' + userCommon.warnMessage(top,left) +'">'+ text+'<div>');
        $("#addCheckResult").before(box);
        window.TipTimer = setTimeout(function () {
            box.remove();
        }, 2000)
    }
}]);
