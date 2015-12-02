var request = require('request');
var addon = require('./build/Release/cetdecoder-main');
var iconv = require('iconv-lite');
var encryptedRequertArr = new Buffer(addon.encodeRequest.apply(null, iconv.encode("type=2&provice=50&school=重庆邮电大学&name=刘晨凌&examroom=&m=01-04-0D-0F-05-10", 'gb2312')));
request.post({
  url: 'http://find.cet.99sushe.com/search',
  encoding: null,
  body: encryptedRequertArr
}, (err, req, bodyBuf) => {
  var encryptedTicketArr = Array.prototype.slice.call(bodyBuf);
  encryptedTicketArr = encryptedTicketArr.slice(2, encryptedTicketArr.length);
  console.log ("我的准考证号: 508160151209325");
  console.log('解密的准考证号:', addon.decodeTicket.apply(null, encryptedTicketArr));
});


