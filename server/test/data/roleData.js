/**
 * Created by YanJixian on 2015/11/19.
 */

roles = module.exports;

roles.superAdmin =  {
    name: '超级管理员',
    desc: '系统管理员，脱离于项目存在',
    level: 0
};

roles.admin   =  {
    name: '部门负责人',
    desc: '独立或特定于项目，创建解散项目',
    level: 1
};

roles.projectAdmin = {
    name: '项目负责人',
    desc: '特定于项目，创建管理表单，表头',
    level: 2
};

roles.moduleAdmin = {
    name: '模块负责人',
    desc: '特定于项目，编辑任务卡，指派任务制作人',
    level: 3
};
roles.innerWorker = {
    name: '内部成员',
    desc: '特定于项目，查看任务',
    level: 4.1
};
roles.outerAdmin = {
    name: '外部负责人',
    desc: '特定于项目，查看模块',
    level: 4.2
};

roles.user = {
    name: '普通用户',
    desc: '啥也干不了',
    level: 5
};