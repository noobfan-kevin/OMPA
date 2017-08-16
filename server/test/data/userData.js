/**
 * Created by YanJixian on 2015/11/19.
 */

var users = module.exports ;

users.superAdmin = {
    username: "admin",
    password: "123456",
    online: 0,
    label:'管理员是万能的',
    weChat: '123456',
    name: '超级管理员',
    address: '模式楼303',
    phone: '12345678901',
    email: '123@qq.com',
    position: '上帝',
    points: 0,
    roles:[]
};

users.user1 = {
    username: "yan",
    password: "123456",
    online: 0,
    label:'我只是测试',
    weChat: '123456',
    name: '佳佳',
    address: '模式楼303',
    phone: '12345678902',
    email: '123@qq.com',
    position: '总监',
    points: 0,
    roles:[]
};

users.user2 = {
    username: "王",
    password: "1234567",
    online: 1,
    label:'我也也只是测试',
    weChat: '12345688',
    name: '佳佳王',
    address: '模式楼303',
    phone: '12375678903',
    email: '1234@qq.com',
    position: '导演',
    points: 0,
    roles:[]
};