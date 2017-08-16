/**
 * Created by hk61 on 2016/1/28.
 */

var sequelize = process.core.db.conn;
var StepInfo = process.core.db.models.StepInfo;
var Task = process.core.db.models.Task;
var TaskVersion = process.core.db.models.TaskVersion;
var Contract = process.core.db.models.Contract;
var ProjectMember = process.core.db.models.ProjectMember;
var _ = require('lodash');

/*var ns = require('continuation-local-storage').createNamespace('dbTree');
 sequelize.cls = ns;*/

var stepView = module.exports = {

    /*================================ 查询 ====================================*/

    /*
     * 根据id获取节点信息
     * @para [String] id 模块id
     * */
    getById: function(id) {
        return StepInfo.findOne({
            where: {
                id: id
            },
            include: {
                model: StepInfo,
                as: 'father'
            }
        })
    },

    /*
     * 根据id获取对应元素所在的层级
     * @para [String] id 模块id
     * */
    getLayerById: function (id, stepType) {


        return StepInfo.findById(id).then(function (list) {
            var _lft = list.lft;
            var _rgt = list.rgt;
            var projectId = list.projectId;

            return StepInfo.findAndCount({
                where: {
                    lft: {
                        lte: _lft
                    },
                    rgt: {
                        gte: _rgt
                    }
                }
            })

        }).then(function (list) {
            return list;
        });
    },

    /*
     * 获取所有节点
     * */
    getAllByProjectId: function (projectId, stepType) {
        return StepInfo.findAll({
            where: {
                projectId: projectId,
                belong: stepType
            },
            attributes: {
                exclude: [
                    'lft',
                    'rgt'
                ]
            },
            order: [
                ['lft']
            ]
        })
    },

    /*
     * 获取祖先节点
     * @para [String] id 模块id
     * */
    getAncestorById: function (id, stepType) {

        return StepInfo.findById(id).then(function (list) {
            var _lft = list.lft;
            var _rgt = list.rgt;
            var projectId = list.projectId;

            return StepInfo.findAll({
                where: {
                    lft: {
                        lte: _lft
                    },
                    rgt: {
                        gte: _rgt
                    },
                    belong: stepType,
                    projectId: projectId
                }
            })
        });
    },

    /*
     * 获取非父节点下分支的所有节点
     * @para [String] id 模块id
     * */
    getOtherStepInfoById: function (id, stepType) {

        if (!id) return;
        return StepInfo.findById(id).then(function (list) {
            var _lft = list.lft
                , _rgt = list.rgt,
                projectId = list.dataValues.projectId;

            return StepInfo.findAll({
                where: {
                    $not: {
                        lft: {
                            gte: _lft
                        },
                        rgt: {
                            lte: _rgt
                        }
                    },
                    belong: stepType,
                    projectId: projectId
                },
                attributes: {
                    include:['name','id','fatherId','projectId']
                },
                order: [
                    ['lft']
                ]
            })

        })
    },

    /*
     * 获取子孙节点（不包括自己）
     * @para [String] id 模块id
     * */
    getChildrenById: function (id) {
        return StepInfo.findById(id).then(function (list) {
            var _lft = list.lft;
            var _rgt = list.rgt;
            var belong = list.belong;
            var projectId = list.dataValues.projectId;
            return StepInfo.findAll({
                where: {
                    lft: {
                        gt: _lft
                    },
                    rgt: {
                        lt: _rgt
                    },
                    belong: belong,
                    projectId: projectId
                },
                attributes: {
                    exclude: [
                        'lft',
                        'rgt'
                    ]
                }
            })
        });
    },

    /*
     * 获取子孙节点（包括自己）
     * @para [String] id 模块id
     * */
    getChildrenIncludeById: function (id) {
        return StepInfo.findById(id).then(function (list) {
            var _lft = list.lft;
            var _rgt = list.rgt;
            var belong = list.belong;
            var projectId = list.dataValues.projectId;

            return StepInfo.findAll({
                where: {
                    lft: {
                        gt: _lft
                    },
                    rgt: {
                        lt: _rgt
                    },
                    belong: belong,
                    projectId: projectId
                },
                attributes: {
                    exclude: [
                        'lft',
                        'rgt'
                    ]
                }
            })
        });
    },

    /*
     * 获取子节点
     * @para [String] id 模块id
     * */
    getChildById: function (id) {

        return StepInfo.findAll({
            where: {
                fatherId: id
            }
        })

    },

    /*
     * 获取叶子节点
     * @para [String] id 模块id
     * */
    getLeafById: function (id) {

        return StepInfo.findById(id).then(function (list) {
            var query = 'SELECT * FROM T_ModuleInfo WHERE "f_si_left"="f_si_right"-1 AND "f_si_left" >= '
                + list.lft + ' AND "f_si_right" <= ' + list.rgt + ';';

            return sequelize.query(query).spread(function (results, metaData) {
                return results;
            });
        })

    },

    /*
     * 获取兄弟节点
     * @para [String] id 模块id
     * */
    getSiblingById: function (id) {

        return StepInfo.findById(id).then(function (list) {
            return StepInfo.findAll({
                where: {
                    fatherId: list.fatherId
                }
            })
        })

    },

    /*================================ 插入 ====================================*/

    /*
     * 插入子节点
     * @para [String] parentId 参考父节点Id
     * @para [JSON] data 节点属性集
     * @return [Promise] 返回异步对象
     * */
    insertChild: function (data, stepType) {
        var _rgt;
        var parentId = data.fatherId;
        var projectId = data.projectId;
        data.belong = stepType;

        return sequelize.transaction().then(function (t) {
            return StepInfo.findById(parentId)
                           .then(function (result) {
                               return _rgt = result.rgt;
                           })
                           .then(function () {
                               // 左值更新
                               return StepInfo.update({
                                   lft: sequelize.literal('"f_si_left" + 2')
                               }, {
                                   where: {
                                       lft: {
                                           $gt: _rgt
                                       },
                                       belong: stepType,
                                       projectId: projectId
                                   },
                                   transaction: t
                               });
                           })
                           .then(function () {
                               // 右值更新
                               return StepInfo.update({
                                   rgt: sequelize.literal('"f_si_right" + 2')
                               }, {
                                   where: {
                                       rgt: {
                                           $gte: _rgt
                                       },
                                       belong: stepType,
                                       projectId: projectId
                                   },
                                   transaction: t
                               });
                           })
                           .then(function () {
                               // 插入
                               data.lft = _rgt;
                               data.rgt = _rgt + 1;
                               return StepInfo.create(data, {
                                   transaction: t
                               })
                           })
                           .then(function(dbStepInfo) {
                               return t.commit().then(function(){
                                   return dbStepInfo;
                               });

                           })
                           .catch(function(err){
                               console.error(err);
                               t.rollback();
                           })
        })
    },

    /*================================ 删除 ====================================*/
    /*
     * 删除子节点
     * @para [String] id 要删除的节点【其子孙节点也将一并删除】
     * @return [Promise] 返回异步对象
     * */
    deleteById: function (id, stepType) {
        var _lft, _rgt, gap;
        var projectId;
        return sequelize.transaction().then(function (t) {
            return StepInfo.findById(id)
                           .then(function (result) {
                               _lft = result.lft;
                               _rgt = result.rgt;
                               projectId = result.projectId;
                               return StepInfo.all({
                                   where: {
                                       lft: {
                                           gte: _lft
                                       },
                                       rgt: {
                                           lte: _rgt
                                       },
                                       belong: stepType,
                                       projectId: projectId
                                   },
                                   transaction: t
                               }).then(function(sbSteps) {

                                   return StepInfo.destroy({
                                       where: {
                                           lft: {
                                               gte: _lft
                                           },
                                           rgt: {
                                               lte: _rgt
                                           },
                                           belong: stepType,
                                           projectId: projectId
                                       },
                                       transaction: t
                                   }).then(function() {
                                       return sbSteps;
                                   })
                               });
                           })
                           .then(function (dbSteps) {

                               gap = _rgt - _lft + 1;
                               // 更新左值
                               return StepInfo.update({
                                                  lft: sequelize.literal('"f_si_left" -' + gap)
                                              }, {
                                                  where: {
                                                      lft: {
                                                          $gt: _lft
                                                      },
                                                      belong: stepType,
                                                      projectId: projectId
                                                  },
                                                  transaction: t
                                              })
                                              .then(function () {
                                                  // 更新右值
                                                  return StepInfo.update({
                                                      rgt: sequelize.literal('"f_si_right" -' + gap)
                                                  }, {
                                                      where: {
                                                          rgt: {
                                                              $gt: _rgt
                                                          },
                                                          belong: stepType,
                                                          projectId: projectId
                                                      },
                                                      transaction: t
                                                  }).then(function() {
                                                      return dbSteps.map(function(dbStep){
                                                          return dbStep.getDataValue('id');
                                                      });
                                                  })
                                              });

                           })
                           .then(function(dbSteps) {
                               return t.commit().then(function() {
                                   return {'message':'删除成功！','list': dbSteps};
                               });
                           })
                           .catch(function(err) {
                               console.error(err);
                               t.rollback();
                           })
        })

    },

    /*================================ 修改 ==============================*/
    /*
     * 移动节点
     * @para [String] id 要移动的节点id
     * @para [String] desParentId 目标父节点id
     * @return [Promise] 返回异步对象
     * */
    moveTo: function (id, desParentId, projectId, stepType) {

        var
            pre_lft     // 所移节点左值
            , pre_rgt   // 所移节点右值
            , des_lft   // 目标父节点左值
            , des_rgt   // 目标父节点右值
            , gap   // 被移动的节点数*2 的值
            , changed;  // 移动后值的变化大小

        // 1.重置fatherId
        return sequelize.transaction().then(function (t) {
            return StepInfo.update({fatherId: desParentId}, {
                               where: {
                                   id: id
                               },
                               transaction: t
                           })
                           .then(function () {
                               return StepInfo.findById(id)
                           })
                           .then(function (result) {
                               pre_lft = result.lft;
                               pre_rgt = result.rgt;
                               gap = pre_rgt - pre_lft + 1;
                               return StepInfo.findById(desParentId)
                           })
                           // 2.更新子孙左值
                           .then(function (result) {
                               des_lft = result.lft;
                               des_rgt = result.rgt;
                               changed = pre_lft - des_rgt;
                               changed = changed < 0 ? changed + gap : changed;
                               return StepInfo.update({
                                   lft: sequelize.literal('"f_si_left" - ' + changed)
                               }, {
                                   where: {
                                       lft: {
                                           $between: [pre_lft, pre_rgt]
                                       },
                                       belong: stepType,
                                       projectId: projectId
                                   },
                                   transaction: t
                               })
                           })
                           // 3.更新被影响节点的左值
                           .then(function () {
                               if (changed > 0) {
                                   return StepInfo.update({
                                       lft: sequelize.literal('"f_si_left" + ' + gap)
                                   }, {
                                       where: {
                                           lft: {
                                               $and: [
                                                   {$gt: des_rgt},
                                                   {$lt: pre_lft}
                                               ]
                                           },
                                           rgt: {
                                               $or: [
                                                   {$gt: pre_rgt},
                                                   {$lt: pre_lft}
                                               ]
                                           },
                                           belong: stepType,
                                           projectId: projectId
                                       },
                                       transaction: t
                                   })
                               } else {
                                   return StepInfo.update({
                                       lft: sequelize.literal('"f_si_left" - ' + gap)
                                   }, {
                                       where: {
                                           lft: {
                                               $and: [
                                                   {$gt: pre_rgt},
                                                   {$lt: des_rgt}
                                               ]
                                           },
                                           rgt: {
                                               $notBetween: [pre_lft, pre_rgt]
                                           },
                                           belong: stepType,
                                           projectId: projectId
                                       },
                                       transaction: t
                                   })
                               }
                           })
                           // 4.更新子节点右值
                           .then(function () {
                               return changed > 0 ?
                                      StepInfo.update({
                                          rgt: sequelize.literal('"f_si_right" - ' + changed)
                                      }, {
                                          where: {
                                              lft: {
                                                  $between: [des_rgt, des_rgt + gap - 1]
                                              },
                                              belong: stepType,
                                              projectId: projectId
                                          },
                                          transaction: t
                                      })
                                   :
                                      StepInfo.update({
                                          rgt: sequelize.literal('"f_si_right" - ' + changed)
                                      }, {
                                          where: {
                                              lft: {
                                                  $between: [des_rgt - gap, des_rgt]
                                              },
                                              belong: stepType,
                                              projectId: projectId
                                          },
                                          transaction: t
                                      })
                           })
                           // 5.更新被影响节点的右值
                           .then(function () {
                               return changed > 0 ?
                                      StepInfo.update({
                                          rgt: sequelize.literal('"f_si_right" + ' + gap)
                                      }, {
                                          where: {
                                              rgt: {
                                                  $and: [
                                                      {$lt: pre_rgt},
                                                      {$gte: des_rgt}
                                                  ]
                                              },
                                              lft: {
                                                  $notBetween: [des_rgt, des_rgt + gap - 1]
                                              },
                                              belong: stepType,
                                              projectId: projectId
                                          },
                                          transaction: t
                                      })
                                   :
                                      StepInfo.update({
                                          rgt: sequelize.literal('"f_si_right" - ' + gap)
                                      }, {
                                          where: {
                                              rgt: {
                                                  $and: [
                                                      {$lt: des_rgt},
                                                      {$gt: pre_rgt}
                                                  ]
                                              },
                                              lft: {
                                                  $notBetween: [des_rgt - gap, des_rgt]
                                              },
                                              belong: stepType,
                                              projectId: projectId
                                          },
                                          transaction: t
                                      })
                           })
                           .then(function() {
                               return t.commit().then(function() {
                                   return StepInfo.findById(id);
                               });
                           })
                           .catch(function(err) {
                               t.rollback();
                               console.error(err);
                           });
        })

    },
    /*
     * 同层平移
     * @para [String] selfId 要移动的节点ID
     * @para [String] refId 参考节点ID
     * @para [Boolean] isForward true移动到参考节点前，false移动到参考节点之后
     * */
    translation: function (selfId, refId, isForward) {
        isForward = isForward == 'true';

        var selfGap
            , selfLft
            , selfRgt
            , refGap
            , refLft
            , refRgt
            , selfChanged
            , refChanged
            , gap;

        return sequelize.transaction().then(function (t) {
            return StepInfo.findById(selfId).then(function (self) {
                               selfLft = self.lft;
                               selfRgt = self.rgt;
                               selfGap = selfRgt - selfLft + 1;

                               return StepInfo.findById(refId)
                           })
                           .then(function (ref) {
                               refLft = ref.lft;
                               refRgt = ref.rgt;
                               refGap = refRgt - refLft + 1;

                               if (selfLft > refLft) {

                                   if(isForward){
                                       gap = selfLft - refRgt;
                                       selfChanged = selfLft - refLft;
                                       refChanged = -selfGap;
                                   }else{
                                       gap = selfLft - refRgt - 1;
                                       selfChanged = selfLft - refRgt - 1;
                                       refChanged = gap == 0 ? 0 : -selfGap;
                                   }

                               } else {

                                   if (isForward) {
                                       gap = refLft - selfRgt;
                                       selfChanged = refLft - selfRgt - 1;
                                       refChanged = 0;
                                   } else {
                                       gap = refLft - selfRgt - 1;
                                       selfChanged = refRgt +　1 - selfGap - selfLft;
                                       refChanged = -selfGap;
                                   }

                               }

                               if (selfLft > refLft) {
                                   // 更新self节点左值
                                   return isForward ?
                                       /*=========== 前插 ============*/
                                          StepInfo.update({
                                                      lft: sequelize.literal('"f_si_left" - ' + selfChanged)
                                                  }, {
                                                      where: {
                                                          rgt: {
                                                              $between: [selfLft, selfRgt]
                                                          }
                                                      },
                                                      transaction: t
                                                  })
                                                  // 更新ref和gap节点的左值
                                                  .then(function () {
                                                      return StepInfo.update({
                                                          lft: sequelize.literal('"f_si_left" - ' + refChanged)
                                                      }, {
                                                          where: {
                                                              rgt: {
                                                                  $between: [refLft, selfLft]
                                                              }
                                                          },
                                                          transaction: t
                                                      })
                                                  })
                                                  // 更新self节点的右值
                                                  .then(function () {
                                                      return StepInfo.update({
                                                          rgt: sequelize.literal('"f_si_right" - ' + selfChanged)
                                                      }, {
                                                          where: {
                                                              lft: {
                                                                  $between: [selfLft - selfChanged, selfRgt - selfChanged]
                                                              }
                                                          },
                                                          transaction: t
                                                      })
                                                  })
                                                  // 更新gap节点的右值
                                                  .then(function () {
                                                      return StepInfo.update({
                                                          rgt: sequelize.literal('"f_si_right" - ' + refChanged)
                                                      }, {
                                                          where: {
                                                              lft: {
                                                                  $between: [refLft - refChanged, refRgt - refChanged + gap - 1]
                                                              }
                                                          },
                                                          transaction: t
                                                      })
                                                  })
                                       :
                                       /*========== 后插 ==========*/
                                          StepInfo.update({
                                                      lft: sequelize.literal('"f_si_left" - ' + selfChanged)
                                                  }, {
                                                      where: {
                                                          rgt: {
                                                              $between: [selfLft, selfRgt]
                                                          }
                                                      },
                                                      transaction: t
                                                  })
                                                  // 更新gap节点的左值
                                                  .then(function () {
                                                      return StepInfo.update({
                                                          lft: sequelize.literal('"f_si_left" - ' + refChanged)
                                                      }, {
                                                          where: {
                                                              rgt: {
                                                                  $between: [refRgt + 1, selfLft]
                                                              }
                                                          },
                                                          transaction: t
                                                      })
                                                  })
                                                  // 更新self节点的右值
                                                  .then(function () {
                                                      return StepInfo.update({
                                                          rgt: sequelize.literal('"f_si_right" - ' + selfChanged)
                                                      }, {
                                                          where: {
                                                              lft: {
                                                                  $between: [selfLft - selfChanged, selfRgt - selfChanged - 1]
                                                              }
                                                          },
                                                          transaction: t
                                                      })
                                                  })
                                                  // 更新gap节点的右值
                                                  .then(function () {
                                                      return StepInfo.update({
                                                          rgt: sequelize.literal('"f_si_right" - ' + refChanged)
                                                      }, {
                                                          where: {
                                                              lft: {
                                                                  $between: [selfRgt - selfChanged, selfRgt - selfChanged + gap]
                                                              }
                                                          },
                                                          transaction: t
                                                      })
                                                  })

                               } else {
                                   /*=========== 前插 =============*/
                                   // 更新self节点左值
                                   return isForward ? StepInfo.update({
                                                                  lft: sequelize.literal('"f_si_left" + ' + selfChanged)
                                                              }, {
                                                                  where: {
                                                                      rgt: {
                                                                          $between: [selfLft, selfRgt]
                                                                      }
                                                                  },
                                                                  transaction: t
                                                              })
                                                              // 更新gap节点的左值
                                                              .then(function () {
                                                                  return StepInfo.update({
                                                                      lft: sequelize.literal('"f_si_left" - ' + selfGap)
                                                                  }, {
                                                                      where: {
                                                                          rgt: {
                                                                              $between: [selfRgt + 1, refLft]
                                                                          }
                                                                      },
                                                                      transaction: t
                                                                  })
                                                              })
                                                              // 更新self节点的右值
                                                              .then(function () {
                                                                  return StepInfo.update({
                                                                      rgt: sequelize.literal('"f_si_right" + ' + selfChanged)
                                                                  }, {
                                                                      where: {
                                                                          lft: {
                                                                              $between: [selfLft + selfChanged, selfRgt + selfChanged]
                                                                          }
                                                                      },
                                                                      transaction: t
                                                                  })
                                                              })
                                                              // 更新gap节点的右值
                                                              .then(function () {
                                                                  return StepInfo.update({
                                                                      rgt: sequelize.literal('"f_si_right" - ' + selfGap)
                                                                  }, {
                                                                      where: {
                                                                          lft: {
                                                                              $between: [selfLft, selfLft + selfChanged - 1]
                                                                          }
                                                                      },
                                                                      transaction: t
                                                                  })
                                                              })
                                       :
                                       /*================ 后插 ====================*/
                                          StepInfo.update({
                                                      lft: sequelize.literal('"f_si_left" + ' + selfChanged)
                                                  }, {
                                                      where: {
                                                          rgt: {
                                                              $between: [selfLft, selfRgt]
                                                          }
                                                      },
                                                      transaction: t
                                                  })
                                                  // 更新gap节点的左值
                                                  .then(function () {
                                                      return StepInfo.update({
                                                          lft: sequelize.literal('"f_si_left" - ' + selfGap)
                                                      }, {
                                                          where: {
                                                              rgt: {
                                                                  $between: [selfRgt + 1, refRgt]
                                                              }
                                                          },
                                                          transaction: t
                                                      })
                                                  })
                                                  // 更新self节点的右值
                                                  .then(function () {
                                                      return StepInfo.update({
                                                          rgt: sequelize.literal('"f_si_right" + ' + selfChanged)
                                                      }, {
                                                          where: {
                                                              lft: {
                                                                  $between: [selfLft + selfChanged, selfRgt + selfChanged]
                                                              }
                                                          },
                                                          transaction: t
                                                      })
                                                  })
                                                  // 更新gap节点的右值
                                                  .then(function () {
                                                      return StepInfo.update({
                                                          rgt: sequelize.literal('"f_si_right" - ' + selfGap)
                                                      }, {
                                                          where: {
                                                              lft: {
                                                                  $between: [selfLft, selfLft + selfChanged - 1]
                                                              }
                                                          },
                                                          transaction: t
                                                      })
                                                  })
                               }

                           })
                           .then(t.commit.bind(t))
                           .catch(t.rollback.bind(t))
        });

    },
    /*
     * 根据id变更节点信息
     * @para [JSON] data 节点属性集
     * @return [Promise] 返回异步对象
     * */
    updateNodeInfo: function (id, data, stepType) {
        data.belong = stepType;
        var projectId = data.projectId;
        var oldFatherId;
        
        return StepInfo.findById(id).then(function(oldStep) {
                oldFatherId = oldStep.dataValues.fatherId;
                return oldStep.update(data)
           }).then(function(dbs) {
                if(data.fatherId == oldFatherId){
                    return StepInfo.findById(id)
                }else{
                    return stepView.moveTo(id, data.fatherId, data.projectId, data.belong)
                }
            });
    },
    // 根据项目id，获取根节点
    getRootByProjectId: function(projectId, stepType) {
        return StepInfo.findOne({
            where: {
                projectId: projectId,
                belong: stepType,
                fatherId: null
            },
            attributes: {
                include: ['name','id']
            }
        })
    },

    // 仅项目创建，默认步骤可使用，其它地方请勿使用！！
    createStep: function (step, stepType) {

        step.belong = stepType;
        return StepInfo.create(step).then(function (dbStepInfo) {
            var member = combineMember(step, dbStepInfo.dataValues.id);
            return ProjectMember.bulkCreate(member).then(function (newDbs) {
                return dbStepInfo;
            })
        })
    },

    // 添加成员
    addNodeMember: function(dbStepInfo, data) {
        var stepId = dbStepInfo.dataValues.id;
        var member = combineMember(data, stepId);

        return ProjectMember.bulkCreate(member).then(function(dbs) {
            return  ProjectMember.all({
                where: {
                    moduleId: stepId
                },
                include:[
                    {
                        model:User,
                        attributes:['name', 'id', 'online', 'image', 'address', 'phone', 'email', 'position', 'companyName']
                    }
                ]
            }).then(function(dbs) {
                if(!dbs.length && dbs.length == 0) return dbStepInfo;
                var member = spreadMember(dbs);
                dbStepInfo.dataValues.member = member;
                return updateContract(stepId, {
                    paidManId: member.payLeader.id,
                    paidMan: member.payLeader.name,
                    contractLeaderId: member.contractLeader.id,
                    contractLeader: member.contractLeader.name
                }).then(function(result) {
                    console.log(result);
                    return dbStepInfo.dataValues;
                });
            });
        })
    },

    // 获取成员
    getNodeMember: function(id) {

        return  ProjectMember.all({
            where: {
                moduleId: id
            },
            include:[
                {
                    model:User,
                    attributes:['name', 'id', 'online', 'image', 'address', 'phone', 'email', 'position', 'companyName']
                }
            ]
        }).then(function(dbs) {
            if(!dbs.length && dbs.length == 0) return {};
            return spreadMember(dbs);
        });
    },

    // 更新成员
    updateNodeMember: function(dbStepInfo, data) {
        var id = dbStepInfo.dataValues.id;

        return ProjectMember.destroy({
            where:{
                moduleId:id
            }
        }).then(function(dbs){
            return stepView.addNodeMember(dbStepInfo, data)
        })

    },

    // 删除成员
    deleteNodeMember: function(id) {
        var query = Array.isArray(id) ? { $in:id } : id;
        return ProjectMember.destroy({
            where:{
                moduleId:query
            }
        })
    },

    //获取部门参与节点的人员
    getModelMembers: function(departmentId,nodeId){
        return   ProjectMember.findAll({include:[{model:User,where:{departmentId:departmentId}}],
            where:{moduleId:nodeId}}).then(function(dbs){
            return spreadMember(dbs);
        });
    },
    //获取部门参与项目的人员
    getProjectMembers: function(departmentId,projectId){
        return   ProjectMember.findAll({include:[{model:User,where:{departmentId:departmentId}}],
            where:{projectId:projectId}}).then(function(Memberdata){
            return Memberdata;
        });
    },

    // 获取项目人员
    getProjectMember: function(projectId){
        return ProjectMember.all({
            where:{
                projectId:projectId
            },
            include: {
                model:User,
                attributes:['name', 'id', 'online', 'image', 'address', 'phone', 'email', 'position', 'companyName']
            }
        }).then(function(dbUser) {
            return spreadMember(dbUser);
        })
    },

    getStepIdsByContractLeader: function(contractLeaderId, projectId, stepType) {
        return ProjectMember.all({
            where: {
                role: 3,
                userId: contractLeaderId
            },
            attributes: ['moduleId']
        }).then(function(dbSteps) {
            dbSteps = dbSteps || [];

            var stepIds = dbSteps.map(function(dbStep) {
                return dbStep.getDataValue('moduleId')
            });

            return StepInfo.all({
                where: {
                    id: {
                        $in: stepIds
                    },
                    projectId:projectId,
                    belong: stepType
                }
            })

        })
    },

    // 只返回合同负责人、支付负责人的角色的步骤
    getLeadersStepByUserId: function(userId, stepType, role) {
        return ProjectMember.all({
            where: {
                role: role,
                userId: userId
            },
            attributes: ['moduleId']
        }).then(function(dbSteps) {
            dbSteps = dbSteps || [];

            var stepIds = dbSteps.map(function(dbStep) {
                return dbStep.getDataValue('moduleId')
            });

            return StepInfo.all({
                where: {
                    id: {
                        $in: stepIds
                    }
                }
            })

        })
    }

};





/*
 * 将步骤相关的人员合并，以便创建
 * @Param {JSON} step 步骤数据
 * @Param {String} moduleId 模块ID
 * */
function combineMember(step, moduleId) {
    var member= JSON.parse(step.member) || [];

    member = member.map(function(id) {
        return {
            role: 0,
            userId: id,
            moduleId: moduleId
        };
    });

    // 任务卡负责人
    if(step.taskCardLeaderId){
        member.push({
            role: 2,
            userId: step.taskCardLeaderId,
            moduleId: moduleId
        });
    }

    // 合同负责人
    if(step.contractLeaderId){
        member.push({
            role: 3,
            userId: step.contractLeaderId,
            moduleId: moduleId
        });
    }

    // 支付负责人
    if(step.payLeaderId){
        member.push({
            role: 4,
            userId: step.payLeaderId,
            moduleId: moduleId
        });
    }

    return member;
}

/*
* 将项目成员按角色分开
* */
function spreadMember(dbs) {
    var role, member = {};
    member.member = [];

    dbs.forEach(function(dbUser,index){
        if(!dbUser.User) return;
        var user = dbUser.User.dataValues;
        member.member.push(user);
        role = dbUser.role;
        if(role != 0){
            switch(role){
                case 2:
                    member.taskCardLeader = user;break;
                case 3:
                    member.contractLeader = user;break;
                case 4:
                    member.payLeader = user;break;
                default:
                    break;
            }
        }
    });
    member.member = _.uniqBy(member.member, 'id');
    return member;
}

function updateContract(stepId, leaders) {

    return Task.all({
        where: {
            moduleId: stepId
        }
    }).then(function(dbTasks) {
        dbTasks = dbTasks || [];
        var taskIds = dbTasks.map(function(dbTask) {
            return dbTask.getDataValue('id')
        });

        return TaskVersion.all({
            where: {
                taskId: {
                    $in: taskIds
                }
            }
        }).then(function(dbTaskVersions) {
            dbTaskVersions = dbTaskVersions || [];
            return dbTaskVersions.map(function(dbTaskVersion) {
                return dbTaskVersion.getDataValue('id');
            });
        })
    }).then(function(taskVersionIds) {
        return Contract.all({
            where: {
                taskCardVersionId: {
                    $in: taskVersionIds
                }
            }
        })
    }).then(function(dbContracts) {
        if(dbContracts && dbContracts.length){
            dbContracts.forEach(function(dbContract) {
                 dbContract.update(leaders);
            });
            return {ok:true, message:dbContracts.length + '条合同信息更新！'}
        }else{
            return {ok:true, message:'没有合同更新！'}
        }
    })
}