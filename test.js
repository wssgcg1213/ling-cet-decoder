var request = require('request');
var decoder = require('./index');
var mocha = require('mocha');
var should = require('should');

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
  });

  it('找不到准考证号应该返回空字符串', function (cb) {
    var name = "喂喂喂",
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
      ticket.should.be.equal('');
      cb();
    });
  });

  it("getProvinceCodeFromSchoolName should return 33(浙江)", function (done) {
    var code = decoder.getProvinceCodeFromSchoolName("浙江大学");
    code.should.be.equal(33);
    done();
  });

  it("getProvinceCodeFromSchoolName 对不存在的学校名应该返回undefined", function (done) {
    var code = decoder.getProvinceCodeFromSchoolName("家里蹲大学");
    should(code).not.be.ok();
    done();
  });

  it("getSchoolListFromProvinceName should return an array", function (done) {
    var arr = decoder.getSchoolListFromProvinceName("重庆");
    arr.should.be.a.Array();
    done();
  });

  it("getSchoolListFromProvinceName 对不存在的provinceName应该返回null", function (done) {
    var arr = decoder.getSchoolListFromProvinceName("尼玛");
    should(arr).not.be.ok();
    done();
  });

  it("getProvinceCodeFromProvinceName should return 50(重庆)", function (done) {
    var code = decoder.getProvinceCodeFromProvinceName("重庆");
    code.should.be.equal(50);
    done();
  });

  it("encryptReqBody 加密得到一个Buffer", function (done) {
    var end = decoder.encryptReqBody("test");
    end.length.should.be.equal(4);
    done();
  });

  it("decryptResBody 解码正确的准考证号", function (done) {
    var raw = new Buffer([ 1, 2, 37, 36, 228, 12, 5, 62, 199, 168, 28, 250, 165, 242, 56, 61, 107 ]);
    var end = decoder.decryptResBody.call(null, raw);
    end.length.should.be.equal(15);
    done();
  });
});