var request = require('request');
var decoder = require('./index');
var reqBody = 'type=2&provice=50&school=重庆邮电大学&name=刘晨凌&examroom=&m=01-04-0D-0F-05-10';
request.post({
  url: 'http://find.cet.99sushe.com/search',
  encoding: null,
  body: decoder.encryptReqBody(reqBody)
}, function (err, req, bodyBuf) {
  if (err) {
    throw new Error(err);
  }
  console.log ("我的准考证号: 508160151209325");
  console.log('解密的准考证号:', decoder.decryptResBody(bodyBuf));
});