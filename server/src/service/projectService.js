/**
 * Created by wangziwei on 2015/8/4.
 */
var Project = process.core.db.models.Project;
var User = process.core.db.models.User;
var userService = require('./userService');
var roleService= require('./roleService');
var informService = require('./informService');
var taskVersionService = require('./taskVersionService');
var messageStatusService = require('./messageStatusService');
var progressService = require('./progressService');
var Role = process.core.db.models.Role;
var Authority = process.core.db.models.Authority;
var chatService=require('./chatService');
var log = process.core.log;
var ProjectMember=process.core.db.models.ProjectMember;
var GroupMember=process.core.db.models.GroupMember;
var StepInfo = process.core.db.models.StepInfo;

var projectService = module.exports;
var stepMemberUtils = require('../dbUtils/stepMemberUtils');
var SceneInfo = process.core.db.models.SceneInfo;
var Scene = process.core.db.models.Scene;
var AssetInfo = process.core.db.models.AssetsInfo;
// 新建项目
projectService.getCurUserProjectAuthority=function(userId){
    var message= {};
    return hasCreateAuthority(userId).then(function(result){
        message.manageAllProjects= result;
        return roleService.userWheatherHasAuthority(userId, 'See_All_Project');

    }).then(function(result){
        message.seeAllProjects= result;
        return roleService.userWheatherHasAuthority(userId, 'Manage_department&user&role');

    }).then(function(result){
        message.manageSystem= result;
        return roleService.userWheatherHasAuthority(userId, 'Receive_Pro_Contracts');

    }).then(function(result){
        message.receiveContract= result;
        return message;

    });

};
projectService.create = function(project){
    return Project.create(project);
};

// 根据主键ID获取项目信息
projectService.getById = function (id) {

    return Project.findById(id,{include: [{
        model : User,
        as: 'creator',
       attributes: ['name', 'id', 'online', 'image', 'address', 'phone', 'email', 'position', 'companyName']
    },{
        model: User,
        attributes: ['name', 'id', 'online', 'image', 'address', 'phone', 'email', 'position', 'companyName']
    }]});
};

projectService.hasNewTaskOrInform = function (prjId, userId,type) {
    return informService.query({
        where: {
            projectId: prjId
        }
    }).then(function (dbInforms) {
        var informTotal = 0;
        dbInforms.forEach(function (inform) {
            inform.receivers.forEach(function (rec) {
                if (rec.id === userId && !rec.isRead) {
                    informTotal++;
                }
            });

        });
        return informTotal;
    }).then(function (informTotal) {
        if ( informTotal > 0 ) {
            return informTotal;
        } else {
            return taskVersionService.queryVersionsByAuditor(userId).then(function (tvDbs) {
                var tvTotal = 0;
                tvDbs.forEach(function (tv) {

                    if (tv && tv.projectId === prjId) {
                        tvTotal++;
                    }
                });
                return tvTotal;
            });
        }
    }).then(function (tvTotal) {
        if (tvTotal > 0) {
            return tvTotal;
        } else {
            return taskVersionService.count({
                where: {
                    receiverId: userId,
                    projectId: prjId,
                    status: 1
                }
            });
        }
    }).then(function (tasktotal) {
        if(!type) {
            if (tasktotal > 0) {
                return tasktotal;
            }
            else{
                //console.log(prjId);
                return chatService.queryNoReadInfo(userId,prjId).then(function(chats){
                    var chattotal=0;
                    // console.log(chats);
                    for(var i=0;i<chats.length;i++)
                    {
                        if(chats[i].length>0)
                        {
                            chattotal=1;
                            break;
                        }
                    }
                    return chattotal;
                });
            }
        }
        else{
            return tasktotal;
        }
    }).then(function(total){
        return {prjId:prjId,result: !!total};
    });
};

projectService.hasNewTaskOrInformAll = function (projs, userId,type) {
    //console.log(projs);
    var promises=projs.map(function (dbProj) {
        return projectService.hasNewTaskOrInform(dbProj, userId,type);
    });
    /*var promises = projectService.query({
        include: null,
        where:{
            id: {
                $in : projs
            }
    }}).then(function (dbProjects) {
        console.log(dbProjects.length)
       return  dbProjects.map(function (dbProj) {
           return projectService.hasNewTaskOrInform(dbProj.id, userId);
       });
    });
    //console.dir(Promise);*/
    return Promise.all(promises);
};

//根据项目取出信息
projectService.getByProjNameById = function (id) {
    return Project.findById(id,{include: User}).then(function(projinfo) {
        return Project.all({where: {parentId: id},include: User}).then(function(module){
            for(var i=0;i<module.length;i++){
                var users=module[i].dataValues.Users;
                for(var ii=0;ii<users.length;ii++)
                {
                    if(checkUser(projinfo.dataValues.Users,users[ii].dataValues.id))
                    {
                        projinfo.dataValues.Users.push(users[ii]);
                    }
                }
            }

             return projinfo;
        });
    });
    function checkUser(users,id){
        var flag=true;
        for(var i=0;i<users.length;i++){
            if(users[i].dataValues.id===id)
            {
                flag=false;
                break;
            }
        }
        return flag;
    }
};
// 根据项目编号查询管理用户（分类）
projectService.queryRoleByPrjId = function (id) {
    return projectService.getById(id).then(function(dbProject){
        dbProject.setDataValue('admin',[]);
        dbProject.setDataValue('prjLeader',[]);
        dbProject.setDataValue('modLeader',[]);
        dbProject.setDataValue('outLeader',[]);
        var users = dbProject.Users;
        for(var i = 0;i<users.length;i++){
            if(users[i].ProjectMember.job === 0){
                dbProject.getDataValue('admin').push(users[i].toJSON());
            }
            else if(users[i].ProjectMember.job === 1){
                dbProject.getDataValue('prjLeader').push(users[i].toJSON());
            }
            else if(users[i].ProjectMember.job === 2){
                dbProject.getDataValue('modLeader').push(users[i].toJSON());
            }
            else if(users[i].ProjectMember.job === 3){
                dbProject.getDataValue('outLeader').push(users[i].toJSON());
            }
            else{
                dbProject.getDataValue('ordinaryUser').push(users[i].toJSON());
            }
        }
        return dbProject;
    });
};

// 根据项目名称查询
projectService.getByProjectName = function (name,parentId) {
    if(!parentId) {
        return Project.findOne({
            where: {name: name},
            include: User
        });
    }
    else{
        return Project.findOne({
            where: {name: name,parentId:parentId},
            include: User
        });
    }
};

//根据项目id查模块
projectService.getByModule = function (proid) {
    return Project.all({
        where: {parentId: proid}
    });
};

// 根据主键ID删除项目信息
projectService.deleteById = function (id) {

    return projectService.getById(id).then(function(dbProject){
        return dbProject.setUsers([]).then(function () {
            return dbProject.destroy({cascade: true});
        });

    });
};
//根据项目Id删除关联信息
projectService.delStep = function(projectId){

    var stepIds = [];

    return StepInfo.all({
        where: {
            projectId: projectId
        },
        raw: true
    }).then(function(dbs) {

        stepIds = dbs.map(function(val) {
            return val.id;
        });
        return ProjectMember.destroy({
            where: {
                moduleId: {
                    $in: stepIds
                }
            }
        })

    }).then(function() {
       return  StepInfo.destroy({
           where:{
               projectId: projectId
           }
        })
    })
};

// 修改
projectService.updateById = function (id, project) {
    return projectService.getById(id).then(function (dbProject) {
        return dbProject.update(project);
    });
};

/**
 *
 * @param args attributes:查询字段,where:查询条件,offset:跳过数据条数,limit:查询数据条数,order:排序,include:关联
 * 参考：http://note.youdao.c
 * om/groupshare/?token=1851646F75074E9C88180593AD747223&gid=11001280
 * @returns promise
 */
projectService.query = function (args) {
    if (!args) {
        args = {};
    }
    var attributes = args.attributes;
    var where = args.where || {};
    var offset = args.offset || 0;
    var limit = args.limit;
    var order = args.order || [["createdAt","desc"]];
    var include = args.include || User;

    var authority={};
    return projectService.getCurUserProjectAuthority(args.userId).then(function(data){
        if(data.manageAllProjects){
            authority.manageAllProjects=data.manageAllProjects;
        }
        if(data.seeAllProjects){
            authority.seeAllProjects=data.seeAllProjects;
        }
        //console.log('authority',authority);
        if(authority.manageAllProjects||authority.seeAllProjects){ //返回所有项目
            //console.log('------------------------all------------------------');
            return Project.all(
                {
                    attributes: attributes,
                    where: toObject(where),
                    offset: offset,
                    limit: limit,
                    order: order,
                    include: [{
                        model: User,
                        as: 'creator',
                        attributes: ['name', 'id', 'online', 'image', 'address', 'phone', 'email', 'position', 'companyName']
                    },
                        {
                            model: User,
                            attributes: ['name', 'id', 'online', 'image', 'address', 'phone', 'email', 'position', 'companyName']
                        }]
                }
            );
        }else{ //返回当前用户为项目成员的项目
            //console.log('------------------------my--project------------------------');
            return Project.all(
                {
                    attributes: attributes,
                    where: toObject(where),
                    offset: offset,
                    limit: limit,
                    order: order,
                    include: [{
                        model: User,
                        as: 'creator',
                        attributes: ['name', 'id', 'online', 'image', 'address', 'phone', 'email', 'position', 'companyName']
                    },
                        {
                            model: User,
                            attributes: ['name', 'id', 'online', 'image', 'address', 'phone', 'email', 'position', 'companyName']
                        },
                        {
                            model:ProjectMember,
                            where:{userId:args.userId}
                        }]
                }
            );
        }
    });



    console.log('-------------------',authority);



    function toObject(obj) {
        if (typeof obj === 'string') {
            return JSON.parse(obj);
        } else {
            return obj;
        }
    }
};

projectService.queryByUser = function (userId, args) {
    if (!args) {
        args = {};
    }
    var attributes = args.attributes;
    var where = args.where || {};
    var offset = args.offset || 0;
    var limit = args.limit;
    var order = args.order || [["createdAt","desc"]];
    var include = args.include || [{
            model: User,
            where: {
                id: userId
            }
        }];
    return Project.all(
        {
            attributes: attributes,
            where: toObject(where),
            offset: offset,
            limit: limit,
            order: order,
            include: include
        }
    );

    function toObject(obj) {
        if (typeof obj === 'string') {
            return JSON.parse(obj);
        } else {
            return obj;
        }
    }
};

// 数量
projectService.projectCount = function (conditions) {
    return Project.count(conditions);
};

projectService.addMembers = function(id,members,job,moduleId){
    if(!moduleId)
    {
        var promise1 = projectService.getById(id);
        var promise2 = userService.query({where: {id: {$in: members}}});
        return Promise.all([promise1, promise2]).then((dbs) => dbs[0].addUsers(dbs[1],{job:job,moduleId:moduleId,projectId2:id}));
    }
    else
    {
        var promise1 = projectService.getById(moduleId);
        var promise2 = userService.query({where: {id: {$in: members}}});
        return Promise.all([promise1, promise2]).then((dbs) => dbs[0].addUsers(dbs[1],{job:job,moduleId:moduleId,projectId2:id}));
    }
};

// 删除项目成员
projectService.removeMember = function(id,member,moduleId){
    var promise1;
    if(moduleId){
        promise1 = projectService.getById(moduleId);
    }
    else {
        promise1 = projectService.getById(id);
    }
    var promise2 = userService.getById(member);
    if(!moduleId)
    {
        var num;
        return ProjectMember.all({
            where:{projectId2:id,userId:member}
        }).then(function(ProjectMemberResults){
            num = ProjectMemberResults.length;
            return Promise.all([promise1, promise2]).then((dbs) => dbs[0].removeUser(dbs[1]));
        }).then(function(){
            if(1 == num){
                return messageStatusService.delUserByMessageStauts(member).then(function(){
                    return GroupMember.destroy({
                        where:{
                            projectId : id,
                            userId : member
                        }
                    });
                });
            }
        });
    }
    else
    {
        return ProjectMember.destroy({
            where:{
                moduleId: moduleId,
                userId:member
            }
        }).then(function(){
            return messageStatusService.delUserByMessageStauts(member);
        });
    }
};


/*
* 新建/修改项目
* */
projectService.createProject=function(params,leader,members){
    var beforeUsers =[], afterUsers= members.slice(0);
    afterUsers.push(leader);

    if (params.id == '' || params.id == null) {
        return Project.create(params).then(function (Newproject) {
            return projectCommon(Newproject.id, leader, members).then(function () {
                return { ok: true, project: Newproject, messages: 'createSuccess' };
            });
        });
    } else {
        return Project.find({where: {id: params.id}}).then(function (oldProject) {

            return oldProject.getUsers({
                attributes: ['name', 'id'],
                raw: true
            }).then(function (dbUsers) {
                // 存储修改之前成员
                beforeUsers = dbUsers.map(function (user) {
                    return user.id
                });
                return stepMemberUtils.without(beforeUsers, afterUsers);
            }).then(function (delUsers) {
                return stepMemberUtils.queryInCharge(oldProject.id, delUsers)
            }).then(function (result) {
                if (result.ok) {
                    return oldProject.update(params).then(function (upProject) {
                        return ProjectMember.destroy({where: {projectId: params.id}}).then(function () {
                            return projectCommon(upProject.id, leader, members).then(function (data) {
                                stepMemberUtils.updateRootModuleMember(upProject.id, afterUsers );
                                return { ok:true, project: upProject, messages: 'updateSuccess' };
                            });
                        });
                    });
                } else {
                    return result;
                }

            });

        });
    }
    function  projectCommon(projectId,leader,members){
        var promise1 = projectService.getById(projectId);
        var promise2 = userService.query({where: {id: {$in: members}}});
        return Promise.all([promise1, promise2]).then(function(dbs){
            return dbs[0].addUsers(dbs[1],{role:0}).then(function(){
                var promise3=userService.query({where:{id:leader}});
                return Promise.all([promise1,promise3]).then(function(db){
                    return db[0].addUsers(db[1],{role:1});
                });
            });
        });
    }

};


/**
 * 删除项目
 * */
projectService.deleteProject=function(projectId){
    return   Project.destroy({where:{id:projectId}}).then(function(project){
        return   ProjectMember.destroy({where:{projectId:projectId}}).then(function(projectUser){
              return {meaasge:'deleteSuccess'};
          });
      });
};
/*
* 查询一个项目的详细信息
*projectId：项目Id
*
* */
projectService.selectProjectInfo=function(projectId){
    var array=[];
    var leader='';
   return  Project.findAll({where:{id:projectId},include:[{model:User}]}).then(function(projectInfo){
       return   ProjectMember.findAll({where:{projectId:projectId},include:[{model:User,attributes:['id','name','image']}]}).then(function(members){
           //for(var i=0;i<members.length;i++){
           //    if(members[i].role==1){
           //        leader=members[i].User.name;
           //        members.splice(i,1);
           //    }
           //}
           //return {projectinfo:projectInfo,member:members,leader:leader,creator:projectInfo[0].User.name};
         });
      });
};
/**
 * 初始化获取所有项目的基本信息
 * */
projectService.getAllProject=function(){
    var array=[];
  return   Project.findAll({attributes:['id','name','schedule','status','projectImg']}).then(function(AllProject){
              for(var i=0;i<AllProject.length;i++){
                  array.push(AllProject[i].id);
              }
             return   ProjectMember.findAll({where:{projectId:{$in:array},role:1},include:[{model:User,attributes:['id','name']}]}).then(function(leaderInfo){
                 return {projectinfo:AllProject,leader:leaderInfo};
               });
   });
};


function hasCreateAuthority(userId)
{
    return roleService.userWheatherHasAuthority(userId, 'Manage_All_Project');
}

