var c_decoder = require('./build/Release/cetdecoder-main');
var iconv = require('iconv-lite');

module.exports = {
  RAW_DECODER: c_decoder,
  encryptReqBody: function (body) {
    return new Buffer(c_decoder.encodeRequest.apply(null, iconv.encode(body, 'gb2312')));
  },
  decryptResBody: function (body) {
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
}