# CET DECODER

[![Build Status](https://travis-ci.org/wssgcg1213/ling-cet-decoder.svg?branch=master)](https://travis-ci.org/wssgcg1213/ling-cet-decoder)  

这是一个某网站API的decoder

可以提供四六级查询服务

`tested on Nodejs 0.12.7, 4.2.2, 5.1.0`



### NPM Package

[ling-cet-decoder](https://www.npmjs.com/package/ling-cet-decoder)



### Install

``` shell
npm install ling-cet-decoder --save
```



### API

  RAW_DECODER: C++模块的接口, 主要负责openssl加解密, 可忽略

  getEncryptReqBody: 参数(cetType, schoolName, name), cetType: {CET4: 1, CET6: 2}, 学校全称, 姓名; 返回Buffer, 加密的请求体

  getProvinceCodeFromSchoolName: 从学校名得到省份代码

  getSchoolListFromProvinceName: 从省份名得到学校列表

  getProvinceCodeFromProvinceName: 从省份名得到省份代码

  encryptReqBody: 输入string, 返回Buffer, 加密的请求体

  decryptResBody: 输入返回的http body, 返回String, 解密的http body



### Usage

``` javascript
//无准考证查询
var decoder = require('ling-cet-decoder');
var request = require('request');

var name = "刘晨凌",
  school = "重庆邮电大学",
 cetType = 2; //1 for CET4, 2 for CET6

request.post({
  url: 'http://find.cet.99sushe.com/search',
  encoding: null,
  body: decoder.getEncryptReqBody(cetType, school, name)
}, function (err, req, bodyBuf) {
  if (err) {
    throw new Error(err);
  }
  var ticket = decoder.decryptResBody(bodyBuf);
  console.log("我的准考证号是:", ticket);
});
```



### Test

``` shell
> mocha
```



`注:nodejs >= 4.0环境 需要gcc4.8以上版本才能编译本C++模块`

By Ling. At 2015年12月02日