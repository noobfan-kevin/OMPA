/**
 * Created by Congzhou on 2016/5/25.
 */

var path = require('path');
var rf= require('fs');

var fileName= "./models/User.js";
var DbModelContent= rf.readFileSync(fileName, "utf-8");

var newDbModelContent= DbModelContent.replace(/['"][a-zA-Z]+[_][a-zA-Z]+[_a-zA-Z]*[a-z]['"]/g, function(word){
    return word.toLowerCase();
});

rf.writeFileSync(fileName, newDbModelContent, "utf-8");
console.log('ok!');