/**
 * Created by hk61 on 2016/6/16.
 */
(function () {
    'use strict';

    var ng = angular;

    ng.module('view', ['operationTaskLog','progressReview'])
      // 服务器请求
      .config(['$httpProvider', function ($httpProvider) {
          $httpProvider.defaults.headers.common['sid'] = localStorage.getItem('sid');
          $httpProvider.defaults.headers.common['userId'] = localStorage.getItem('userId');
      }])
      .factory('server', ['baseUrl', '$http', function (baseUrl, $http) {
          return {
              getContract: function () {
                  return $http({
                      method: 'get',
                      url: baseUrl + '/api/contract/getContractInfo/' + localStorage.getItem('curContractId')
                  }).then(function (result) {
                      result = result.data;
                      return $http({
                          method: 'get',
                          url: baseUrl + '/api/project/' + result.contract.projectId
                      }).then(function (dbProject) {
                          dbProject = dbProject.data;
                          result.contract.projectName = dbProject.list.name;
                          var contract = result.contract;
                          var taskInfo = result.task;
                          contract = rename(contract, {
                              contractName: 'name',
                              contractCode: 'code',
                              taskCardType: 'type',
                              contractStatus: 'status',
                              partBGatheringCountName: 'partBCountName',
                              partBGatheringCountNumber: 'partBCountNumber',
                              taskInfo: 'task',
                              taskCardStartTime: 'startTime',
                              taskCardEndTime: 'endTime'
                          });
                          $.extend(true, contract, {
                              projectName: dbProject.list.name,
                              connectTask: dbProject.list.name + '->' + taskInfo.associatedType + '->' + taskInfo.assetOrshot + '->'  + taskInfo.step + '->',
                              finishedPercent: parseFloat(taskInfo.percent),
                              taskCardCode: taskInfo.version,
                              paidPercent: getPayPercent(contract.paidStep - 1, contract.payType)

                          });

                          contract.totalStep = contract.payType.split('-').length;
                          return contract;
                      })
                  });

                  function getPayPercent(paidStep, payType) {
                      var allSteps = payType.split('-');
                      var done = 0,
                          total = 0;

                      allSteps.forEach(function (stepItem, index) {
                          stepItem = stepItem / 1;
                          if (index < paidStep) {
                              done += stepItem;
                          }
                          total += stepItem;
                      });
                      return done / total * 100;
                  }
              },
              changeContractState: function (params) {
                  return $http({
                      method: 'put',
                      url: baseUrl + '/api/contract/status/' + localStorage.getItem('curContractId'),
                      data: params
                  }).success(function (result) {
                      return result.data;
                  })
              },
              deleteContract: function () {
                  return $http({
                      method: 'delete',
                      url: baseUrl + '/api/contract/' + localStorage.getItem('curContractId')
                  }).success(function (result) {
                      return result.data;
                  })
              },
              getSupplementList: function () {
                  return $http({
                      method: 'get',
                      url: baseUrl + '/api/contractSupplement/all/' + localStorage.getItem('curContractId')
                  })
              },
              createSupplement: function (data) {
                  return $http({
                      method: 'post',
                      url: baseUrl + '/api/contractSupplement/',
                      data: data
                  })
              },
              getVoucher: function () {
                  return $http({
                      method: 'get',
                      url: baseUrl + '/api/voucher/' + localStorage.getItem('curContractId')
                  })
              },
              getVoucherImages: function (voucherId) {
                  return $http({
                      method: 'get',
                      url: baseUrl + '/api/voucher/image/' + voucherId
                  })
              },
              recallTask: function(params) {
                  return $http({
                      method: 'put',
                      url: baseUrl + '/api/taskCard/updateTaskStatus',
                      data: {
                          status:1,
                          versionId: params.taskCardVersionId,
                          readStatus:'true',
                          projectId: params.projectId,
                          flag:true
                      }
                  }).then(function(req) {
                      return req.data;
                  })
              },
              getContractOnePageLog:function(){
                  return $http({
                      type:'get',
                      url:baseUrl + '/api/log/logList?offset=0&contractId=' + localStorage.getItem('curContractId')
                  })
              },
              getContractCount:function(){
                  return $http({
                      type:'get',
                      url:baseUrl + '/api/log/count?contractId=' + localStorage.getItem('curContractId')
                  })
              }
          };

          function rename(obj, nameMap) {
              var oldName = [], newName = [];
              var temp = {};
              for (var k in nameMap) {
                  oldName.push(k);
                  newName.push(nameMap[k]);
              }
              newName.forEach(function (v, i) {
                  temp[v] = obj[oldName[i]];
              });
              temp = $.extend(true, {}, obj, temp);
              oldName.forEach(function (v) {
                  delete temp[v];
              });
              return temp;
          }

      }])
      // 模板路径
      .factory('template', function () {
          var basePath = './template/myContract/';
          return {
              setPath: function (path) {
                  return basePath + path;
              }
          }
      })
      // html to pdf转换
      .factory('pdf', function () {
          return {
              download: function (name) {
                  var doc = jsPDF()
                      , docHtml = $('.contract-tpl-wrap', '#contract-download-hidden').get(0);

                  // 保存原始视口大小
                  var defaultView = docHtml.ownerDocument.defaultView;
                  var viewH = defaultView.innerHeight
                      , viewW = defaultView.innerWidth
                      , docH = $(docHtml).height()
                      , docW = $(docHtml).width();

                  setView(docW, docH);
                  html2canvas(docHtml, {
                      height: docH,
                      width: docW
                  }).then(function (canvas) {
                      setView(viewW, viewH);
                      var png = canvas.toDataURL('image/png');
                      doc.addImage(png, 'JPEG', 8, 15, 194, 274);
                      doc.save(name, function () {
                          png = null;
                      });
                  });
                  // 设置视口大小
                  function setView(w, h) {
                      defaultView.innerWidth = w;
                      defaultView.innerHeight = h;
                  }
              }
          }
      })
      // 合同正文按钮状态控制
      .factory('button', function () {
          return {
              setAuthority: function (opts) {
                  var userId = localStorage.getItem('userId');
                  var isProjectLeader = projectCommon.authority.isProjectLeader;
                  var manageAllProjects = projectCommon.authority.manageAllProjects;
                  return {
                      'send': (userId == opts.contractLeaderId || isProjectLeader || manageAllProjects) && (opts.status == 1 || opts.status == 3),
                      'edit': (userId == opts.contractLeaderId || isProjectLeader || manageAllProjects) && (opts.status == 1 || opts.status == 3),
                      'delete': (userId == opts.contractLeaderId || isProjectLeader || manageAllProjects) && (opts.status == 1 || opts.status == 3 || opts.status== 6 ||  opts.status== 8),
                      'assign': (userId == opts.contractLeaderId || isProjectLeader || manageAllProjects) && (opts.status == 4),
                      'pay': (userId == opts.paidManId) && (opts.status == 5) && (opts.paidStep <= opts.totalStep),
                      'accept': (userId == opts.partBId) && (opts.status == 2),
                      'back': (userId == opts.partBId) && (opts.status == 2),
                      'invalidate': (userId == opts.contractLeaderId || isProjectLeader || manageAllProjects) && (opts.status == 4)
                  };
              }
          }
      })
      .directive('viewTab', ['$state', function ($state) {
          return {
              restrict: 'E',
              replace: true,
              template: '<ul><li class="active">合同正文</li><li>补充协议</li><li>支付凭证</li><li>操作记录</li></ul>',
              link: function (scope, element, attr) {
                  var $tabBtns = $('li', element)
                      , pages = ['contract', 'supplement', 'voucher','contractLog'];
                  $tabBtns.click(function () {
                      $tabBtns.removeClass('active');
                      $(this).addClass('active');
                      $state.go('view.' + pages[$(this).index()]);
                  });
              }
          }
      }])
      .directive('contractPreview', function () {
          return {
              restrict: 'E',
              replace: true,
              templateUrl: './template/myContract/TPL-1.html'
          }
      })
      .directive('supplementTpl', function () {
          return {
              restrict: 'E',
              replace: true,
              templateUrl: './template/supplementTpl/tpl1.html'
          }
      })
      .directive('voucherUpload', function () {
          return {
              restrict: 'E',
              replace: true,
              templateUrl: './template/myContract/certificatesUploader.html'
          }
      })
      // 文件上传
      .directive('voucherUploader', function () {
          return {
              restrict: 'A',
              link: function (scope, elements, attr) {
                  elements.on('change', function () {
                      var files = Array.prototype.slice.call(this.files);
                      var has = false;
                      files.forEach(function (file) {
                          scope.vouchers.forEach(function(voucher) {
                              if(isEqualFile(file, voucher.file)) {
                                  has = true;
                                  return;
                              }
                          });
                          if(!has){
                              scope.vouchers.push({
                                  src: file.path,
                                  file: file
                              });
                          }
                      });
                      scope.$apply();
                  });

                  // 根据文件路径、大小、修改时间判定是否相同
                  function isEqualFile(fa, fb){
                      var path = fa.path === fb.path;
                      var lastModified = fa.lastModified === fb.lastModified;
                      var size = fa.size === fb.size;
                      return path && lastModified && size;
                  }

              }
          }
      })
      // 时间选择器
      .directive('timePicker', function () {
          return {
              restrict: 'A',
              link: function (scope, elements, attr) {
                  elements.on('change', function () {
                      scope.newPay.paidTime = this.value;
                      scope.$apply();
                  });
              }
          }
      })
      // 搜狗输入法bug
      .directive('sougouDebug', function () {
          return {
              restrict: 'A',
              scope: {
                  ngModel: '='
              },
              priority: '10',
              link: function (scope, elements, attr) {
                  elements.eq(0).next('input').on('input', function() {
                      scope.ngModel = this.value;
                  });
                  elements.eq(0).next('textarea').on('input', function() {
                      scope.ngModel = this.value;
                  });
              }
          }
      })
      // 阿拉伯数字转大写人民币
      .filter('rmb', function () {
          return function (n) {
              var fraction = ['角', '分']
                  , digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
                  , unit = [['元', '万', '亿'], ['', '拾', '佰', '仟']]
                  , head = n < 0 ? '欠' : '';
              n = Math.abs(n);
              var s = '';
              for (var i = 0; i < fraction.length; i++) {
                  s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
              }
              s = s || '整';
              n = Math.floor(n);

              for (var i = 0; i < unit[0].length && n > 0; i++) {
                  var p = '';
                  for (var j = 0; j < unit[1].length && n > 0; j++) {
                      p = digit[n % 10] + unit[1][j] + p;
                      n = Math.floor(n / 10);
                  }
                  s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
              }
              return head + s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');
          }
      })
      // 获取分期金额
      .filter('installment', function () {
          return function (money, type, pos) {
              if (!money) return;
              var steps = type.split('-');
              var total = 0;
              if (pos >= steps) {
                  pos = steps.length - 1;
              }
              pos = pos || 0;

              steps.forEach(function (step) {
                  total += step / 1;
              });

              return money * steps[pos] / total;
          }
      })
      .filter('toBarStatus', function () {
          return function (status) {
              switch (status) {
                  case 1:
                  case 3:
                      return '编写';
                  case 2:
                      return '签约';
                  case 4:
                      return '执行';
                  case 5:
                  case 7:
                      return '支付';
                  case 6:
                  case 8:
                      return '完成';
              }
          }
      })
      .filter('payStepMap', function () {
          return function (curStep) {
              var digit = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
              curStep = curStep ? curStep * 1 : 0; // 强制转换为数字,设置默认
              return digit[curStep] + '期';
          }
      });

    ng.module('view')
      .controller('viewCtrl', ['$scope', '$location', 'backUrl', 'pdf', '$state', function ($scope, $location, backUrl, pdf, $state) {

          $scope.preview = false;
          $scope.showVoucherUpload = false;

          // 返回列表
          $scope.goBack = function () {
              $location.path(backUrl);
          };

          $scope.showPreview = function () {
              $scope.preview = true;
          };

          $scope.closePreview = function () {
              $scope.preview = false;
          };

          $scope.download = function () {
              pdf.download($scope.contract.name);
          };

          $scope.payVoucher = function () {
              $scope.showVoucherUpload = true;
          };

          $scope.closePayVoucher = function () {
              $scope.showVoucherUpload = false;
          };

          $scope.goTask = function(taskVersionId) {
              localStorage.setItem('thisTaskVersionId', taskVersionId);
              localStorage.setItem('pageType', 'myContract');
              $state.go('task');
          }

      }]);

    ng.module('view')
      .controller('contractCtrl', ['$scope', 'server', '$rootScope', 'button', '$filter', '$state',
          function ($scope, serverProvider, $rootScope, buttonProvider, $filter, $state) {
              serverProvider.getContract().then(function (result) {
                  $rootScope.contract = result;
                  $scope.doughnut = initCanvas();
                  $scope.contract = $rootScope.contract;
                  if ($scope.doughnut) {
                      $scope.doughnut.update();
                  }
              });

              $scope.$watchCollection('contract', function (contract) {
                  if (!contract) return;
                  $scope.btns = buttonProvider.setAuthority(contract);
                  $rootScope.barStatus = $filter('toBarStatus')(contract.status);
              });
              $scope.setStatus = function (status) {
                  serverProvider.changeContractState({
                      contractStatus: status,
                      projectId: $scope.contract.projectId
                  }).success(function (result) {
                      if (result.ok) {
                          $state.reload();
                      }
                      if(status == 4){
                          //给制作人刷新任务卡
                          socketCommon.emit().getProductUnReadTask($scope.contract.taskCardVersionId);
                          //给自己
                          //taskBasicInfo.countAllOfMyTaskUnread();//刷新任务小红点
                      }
                      // 撤回任务卡
                      //if(status == 8){
                          serverProvider.recallTask({
                              taskCardVersionId: $scope.contract.taskCardVersionId,
                              projectId: $scope.contract.projectId
                          });
                      //}
                  });
              };

              $scope.deleteContract = function () {
                  departmentObj.showAskModel('删除操作将会删除一切与合同相关的内容，确认删除？',true,function(ok) {
                      if(!ok) return;
                      serverProvider.deleteContract().success(function () {
                          $state.go('main');
                      })
                  });

              };

              var chartDefaultData = {
                  finish: [{
                          value: 0,
                          color: "#f1b940",
                          highlight: "#5AD3D1",
                          label: "已完成"
                      }, {
                          value: 100,
                          color: "#f1f1f1",
                          highlight: "#FF5A5E",
                          label: "未完成"
                      }],
                  paid: [{
                          value: 0,
                          color: "#7ebffd",
                          highlight: "#5AD3D1",
                          label: "已支付"
                      }, {
                          value: 100,
                          color: "#f1f1f1",
                          highlight: "#FF5A5E",
                          label: "未支付"
                      }]
              };

              var chartDefaultOption = {
                  finish: {
                      percentageInnerCutout: 65
                  },
                  paid: {
                      percentageInnerCutout: 65
                  }
              };

              function initCanvas() {
                  if (!$('#chart-finishedPercent').length) return;

                  var finishCanvas = document.getElementById("chart-finishedPercent").getContext("2d");
                  var paidCanvas = document.getElementById("chart-paidPercent").getContext("2d");
                  var chartFinished = new Chart(finishCanvas).Doughnut(chartDefaultData.finish, chartDefaultOption.finish);
                  var chartPaid = new Chart(paidCanvas).Doughnut(chartDefaultData.paid, chartDefaultOption.paid);

                  return {
                      // 调用update方法根据更新后的数据集重新绘制图表
                      update: function () {
                          chartFinished.segments[0].value = $scope.contract.finishedPercent;
                          chartFinished.segments[1].value = 100 - $scope.contract.finishedPercent;
                          chartPaid.segments[0].value = $scope.contract.paidPercent;
                          chartPaid.segments[1].value = 100 - $scope.contract.paidPercent;
                          chartFinished.update();
                          chartPaid.update();
                      }
                  };
              }

          }]);

    ng.module('view')
      .controller('supplementCtrl', ['$scope', 'server', '$state', function ($scope, serverProvider, $state) {
          $scope.showDialog = false;
          $scope.supplements = [];
          $scope.newSupplement = {
              title: '补充协议',
              code: $scope.contract.code,
              reason: '',
              content: '',
              partAName: $scope.contract.partAName,
              partBName: $scope.contract.partBName,
              dateATime: '',
              dateBTime: '',
              show: false,
              contractId: localStorage.getItem('curContractId')
          };

          verifyInputs({
              context: $('#supplementValidation')[0]
          }, 'supplement');

          serverProvider.getSupplementList().success(function (list) {
              $scope.supplements = list.map(function (supplement) {
                  return {
                      title: supplement.title,
                      code: supplement.Contract.contractCode,
                      reason: supplement.reason,
                      content: supplement.content,
                      contentList: supplement.content.split('\n'),
                      partAName: supplement.Contract.partAName,
                      partBName: supplement.Contract.partBName,
                      dateATime: supplement.partATime,
                      dateBTime: supplement.partBTime,
                      show: false
                  }
              })
          });

          $scope.addSupplement = function () {
              var allLegal = validation['supplement'].isLegalAll();
              if (!allLegal)   return;

              serverProvider.createSupplement(ng.copy($scope.newSupplement)).success(function () {
                  $scope.showDialog = false;
                  //$scope.supplements.push(ng.copy($scope.newSupplement))
                  $state.reload();
              });
          }

      }]);

    ng.module('view')
      .controller('payUploadCtrl', ['$scope', 'baseUrl', '$state', 'server', '$filter',
          function ($scope, baseUrl, $state, serverProvider, $filter) {
              $scope.isEnableSave = false;
              $scope.vouchers = [];
              $scope.newPay = {
                  contractId: localStorage.getItem('curContractId'),
                  step: '',
                  payType: '',
                  paidTime: '',
                  money: ''
              };
              $scope.$root.$watch('contract', function (ct) {
                  if (!ct) return;
                  $scope.newPay.money = $filter('installment')(ct.totalMoney, ct.payType, ct.paidStep - 1);
                  $scope.newPay.step = ct.paidStep;
              });

              (function initTimePicker() {
                  $('.datetimepicker').remove();
                  $("#payTimePicker").datetimepicker({
                      format: "yyyy-mm-dd",
                      minView: "month",
                      autoclose: true,
                      todayBtn: true,
                      language: 'zh-CN'
                  });
              })();

              verifyInputs({
                  context: $('#voucherValidation')[0]
              }, 'voucher');

              $scope.save = function () {
                  var files = $scope.vouchers.map(function (voucher) {
                      return voucher.file;
                  });
                  fileUploader(baseUrl + '/api/voucher/upload', files, {
                      success: function (result) {
                          if ($scope.contract.paidStep < $scope.contract.totalStep) {
                              serverProvider.changeContractState({
                                  contractStatus: 7,
                                  paidStep: $scope.contract.paidStep + 1
                              }).success(function (result) {
                                  $state.reload();
                              });
                          } else {
                              serverProvider.changeContractState({
                                  contractStatus: 6,
                                  paidStep: $scope.contract.paidStep + 1
                              }).success(function (result) {
                                  $state.reload();
                              });
                          }

                      },
                      allow: ['image/jpeg', 'image/png'],
                      field: 'voucher',
                      single: false,
                      data: $scope.newPay
                  });
              };

              $scope.delete = function () {
                  $scope.vouchers.splice(this.$index, 1);
              };

              $scope.$watch('vouchers', function (val) {
                  $scope.isEnableSave = val.length !== 0;
              }, true)

          }]);

    ng.module('view')
      .controller('voucherCtrl', ['$scope', 'server', 'baseUrl', function ($scope, serverProvider, baseUrl) {

          $scope.showViewer = false;
          $scope.curImage = '';
          $scope.payList = [];
          $scope.voucherList = [];

          serverProvider.getVoucher().success(function (result) {
              var stepName = ['第一期', '第二期', '第三期', '第四期', '第五期','第六期'];
              result.forEach(function (voucher, index) {
                  $scope.payList.push(voucher);
                  serverProvider.getVoucherImages(voucher.id).success(function (dbImages) {
                      var images = dbImages.map(function (img) {
                          return baseUrl + '/' + img.name;
                      });
                      $scope.voucherList.push({
                          name: stepName[index],
                          images: images
                      });
                  })
              });
          });

          $scope.zoomViewer = function () {
              $scope.curImage = this.image;
              $scope.showViewer = true;
          }

      }]);
    ng.module('view')
        .controller('contractLogCtrl',['$scope','server',function($scope,serverProvider){
            $scope.contractLogs = [];
            $scope.contractNum = 0;
            $scope.contractPages = 0;
            $scope.curPage = 1;
            $scope.choosePage = false;
            $scope.contractPageList = [];
            serverProvider.getContractCount().success(function(count){
                $scope.contractNum = count;
                $scope.contractPages = Math.ceil(count/10);
                var data;
                for(var i=0;i<$scope.contractPages;i++){
                    data = {};
                    data.offset = i;
                    data.page = i+1;
                    $scope.contractPageList.push(data);
                }
            });
            serverProvider.getContractOnePageLog().success(function(result){
                var len = result.length;
                var data =[];
                for(var i=0;i<len;i++){
                    data.push({
                        person:result[i].userName,
                        time:result[i].time.slice(0,10),
                        detail:$scope.newLine(result[i].description)
                    })
                }
                $scope.contractLogs = data;
            }).error(function(err){
                console.log(err);
            });

            $('body').off('click.ompa').on('click.ompa',function(e){
                var target = $(e.target);
                if(target.hasClass('curLog-page-choose')){
                }else if(target.parent().hasClass('curLog-page-choose')){
                }else if(target.hasClass('cur-page')){
                }else{
                    $scope.$apply($scope.choosePage = false);
                }
            });
            $scope.changeChoosePage =function(){
                $scope.choosePage = !$scope.choosePage;
            };
            $scope.goPage = function(info){
                switch (info){
                    case 'first':
                        if($scope.curPage != 1){
                            $scope.curPage = 1;
                            $scope.goToPage(0);
                        }
                        break;
                    case 'last':
                        if($scope.curPage != $scope.contractPages){
                            $scope.curPage = $scope.contractPages;
                            $scope.goToPage($scope.contractPages-1);
                        }
                        break;
                    case 'next':
                        if($scope.curPage != $scope.contractPages){
                            $scope.goToPage($scope.curPage);
                            $scope.curPage += 1;
                        }
                        break;
                    case 'prev':
                        if($scope.curPage != 1){
                            $scope.curPage -= 1;
                            $scope.goToPage($scope.curPage-1);
                        }
                        break;
                    default:
                        if($scope.curPage != info+1){
                            $scope.curPage = info+1;
                            $scope.goToPage(info);
                        }
                        break;
                }
            };
            $scope.goToPage = function(offset){
                $.ajax({
                    method:'get',
                    url:'/api/log/logList',
                    data:{offset:offset,where:{contractId:localStorage.getItem('curContractId')}},
                    success:function(success){
                        //console.log(success);
                        var len = success.length;
                        var data =[];
                        for(var i=0;i<len;i++){
                            data.push({
                                person:success[i].userName,
                                time:success[i].time.slice(0,10),
                                detail:$scope.newLine(success[i].description)
                            })
                        }
                        $scope.$apply($scope.contractLogs = data);
                    },
                    error:function(err){
                        console.log(err);
                    }
                })
            };
            $scope.newLine = function(str){
                return str.split('\r\n');
            };
        }])
})();