/**
 * Created by HeLiang on 2015/11/24.
 */
authority = module.exports;

authority.authority01 = {
    name:"查询用户",
    uri:"api/group",
    method:"get",
    operate:"查询",
    module:"group",
    desc:"查找群组成员"
};

authority.authority02 = {
    name:"添加用户",
    uri:"api/user",
    method:"post",
    operate:"添加",
    module:"user",
    desc:"增加新的用户"
};

authority.authority03 = {
    name:"删除文件",
    uri:"api/file",
    method:"delete",
    operate:"删除",
    module:"file",
    desc:"删除旧文件"
};


