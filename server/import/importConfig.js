/**
 * Created by hk61 on 2016/3/28.
 */

var importConfig = module.exports = {};

importConfig.source_server = {

    dialect   : 'postgres',
    host     : '192.168.100.183',
    user     : 'postgres',
    password : '123456',
    database : 'ompa',
    charset  : 'utf8',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
    logging: console.log

};