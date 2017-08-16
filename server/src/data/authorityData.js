/**
 * Created by YanJixian on 2015/11/19.
 */

authorities = module.exports;

authorities.superAdmin =  {
    name: 'Manage_All_Project',
    desc: '管理所有项目及项目内结构类信息'
};

authorities.admin   =  {
    name: 'Manage_All_Pro_Tasks',
    desc: '管理所有项目的任务卡'
};

authorities.projectAdmin = {
    name: 'Manage_All_Pro_Contracts',
    desc: '管理所有项目的合同'
};

authorities.moduleAdmin = {
    name: 'See_All_Project',
    desc: '查看所有项目的内容'
};

authorities.filmAdmin = {
    name: 'Manage_department&user&role',
    desc: '管理部门、用户、角色'
};

authorities.innerWorker = {
    name: 'Manage_Contractor',
    desc: '管理签约方'
};

authorities.user = {
    name: 'Receive_Pro_Contracts',
    desc: '项目内接收合同 '
};

authorities.outerAdmin = {
    name: 'Receive_Pro_Taskcard',
    desc: '项目内接收任务卡'
};