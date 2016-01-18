/**
 * Author Ling.
 * ling@zeroling.com
 */
var c_decoder = require('./build/Release/cetdecoder-main');
var iconv = require('iconv-lite');

var province = require('./province');
var schoolMapProvinceCode = {}, _provinceName, _provinceCode; 
for (_provinceName in province) {
  if (province.hasOwnProperty(_provinceName) && '[object Array]' === Object.prototype.toString.call(province[_provinceName])) {
    _provinceCode = province[_provinceName][0];
    province[_provinceName][1].forEach(function (_schoolName) {
      schoolMapProvinceCode[_schoolName] = _provinceCode;
    });
  }
}

function getProvinceCodeFromSchoolName (schoolName) {
  return schoolMapProvinceCode[schoolName];
}

function getSchoolListFromProvinceName (provinceName) {
  var data = province[provinceName];
  if (data) {
    return data[1];
  } else {
    return null;
  }
}

function getProvinceCodeFromProvinceName(provinceName) {
  var data = province[provinceName];
  if (data) {
    return data[0];
  } else {
    return null;
  }
}

function randomMacAddr() {
  var ret = '';
  for(var i = 0; i < 12; i++) {
    ret += Math.floor(Math.random()*16).toString(16);
    ret += i % 2 && i !== 11 ? "-" : ''; 
  }
  return ret.toUpperCase();
}

function encryptReqBody(body) {
  return new Buffer(c_decoder.encodeRequest.apply(null, iconv.encode(body, 'gb2312')));
}

function decryptResBody(body) {
  var encryptedTicketArr;
  if (Buffer.isBuffer(body)) {
    encryptedTicketArr = Array.prototype.slice.call(body);
  } else if (Array.isArray(body)) {
    encryptedTicketArr = body;
  } else {
    console.log("tip: request options encoding should be null");
    throw new TypeError("the first argument must be a buffer or an array");
  }
  encryptedTicketArr = encryptedTicketArr.slice(2, encryptedTicketArr.length);
  return c_decoder.decodeTicket.apply(null, encryptedTicketArr);
}

/**
 * [getEncryptReqBody description]
 * 获取准考证
 * @param  {Number} cetType      [enum: {CET4: 1, CET6: 2}]
 * @param  {String} schoolName   [学校全称]
 * @param  {String} name         [姓名]
 * @return {Buffer}              [req body buffer]
 */
function getEncryptReqBody(cetType, schoolName, name) {
  var provinceCode = getProvinceCodeFromSchoolName(schoolName);
  var query = 'type=' + cetType 
  + '&provice=' + provinceCode 
  + '&school=' + schoolName 
  + '&name=' + name 
  + '&examroom=&m=' + randomMacAddr();
  return encryptReqBody(query);
}

module.exports = {
  RAW_DECODER: c_decoder,
  getEncryptReqBody: getEncryptReqBody,
  getProvinceCodeFromSchoolName: getProvinceCodeFromSchoolName,
  getSchoolListFromProvinceName: getSchoolListFromProvinceName,
  getProvinceCodeFromProvinceName: getProvinceCodeFromProvinceName,
  encryptReqBody: encryptReqBody,
  decryptResBody: decryptResBody,
  province: province
};