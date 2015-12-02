var request = require('request');
var decoder = require('./index');
var mocha = require('mocha');
var shuold = require('should');

describe('test', function () {
  this.timeout(5000); //设置超时时间5s
  
  it('should return a string with 15 numberic characters(准考证号)', function (cb) {
    var name = "刘晨凌",
        school = "重庆邮电大学",
        cetType = 2; //CET6
    request.post({
      url: 'http://find.cet.99sushe.com/search',
      encoding: null,
      body: decoder.getEncryptReqBody(cetType, school, name)
    }, function (err, req, bodyBuf) {
      if (err) {
        throw new Error(err);
      }
      var ticket = decoder.decryptResBody(bodyBuf);
      (parseInt(ticket) + '').length.should.equal(15);
      cb();
    });
  })
});