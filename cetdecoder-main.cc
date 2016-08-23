/**
 * Author Ling.
 * ling@zeroling.com
 */

#include "openssl/des.h"
#include <nan.h>

unsigned char* DES_CFB64_Decrypt(unsigned char* key, unsigned char* msg, int size, int isEnc) {
  static unsigned char* result;
  int n = 0;
  DES_cblock password;
  DES_key_schedule schedule;
  result = (unsigned char *) malloc(size + 1);
  /* Prepare the key for use with DES_cfb64_encrypt */
  memcpy(password, key, 8);
  DES_set_odd_parity(&password);
  DES_set_key_checked(&password, &schedule);

  /* Decryption occurs here */
  DES_cfb64_encrypt((unsigned char*)msg, (unsigned char*)result, size, &schedule, &password, &n, isEnc);
  result[size] = '\0';
  return result;
}

void decodeTicket(const Nan::FunctionCallbackInfo<v8::Value>& info) {
  // if (info.Length() != 15) {
  //   Nan::ThrowTypeError("there must be 15 arguments");
  //   return;
  // }
  int len = info.Length();
  unsigned char ticketKey[] = "021yO6d<";
  unsigned char encrypted[len];
  for (int i = 0; i < len; i++) {
    encrypted[i] = info[i]->NumberValue();
  }
  unsigned char* decrypted = DES_CFB64_Decrypt(ticketKey, encrypted, sizeof(encrypted), DES_DECRYPT);
  info.GetReturnValue().Set((v8::Local<v8::String>)Nan::New((char*) decrypted).ToLocalChecked());
}

void encodeRequest(const Nan::FunctionCallbackInfo<v8::Value>& info) {
  int len = info.Length();
  unsigned char requestDataKey[] = "PgidW;O;";
  unsigned char raw[len];
  int i;
  for (i = 0; i < len; i++) {
    raw[i] = info[i]->NumberValue();
  }
  unsigned char* ret = DES_CFB64_Decrypt(requestDataKey, raw, sizeof(raw), DES_ENCRYPT);
  v8::Local<v8::Array> retArr = Nan::New<v8::Array>(len);
  for (i = 0; i < len; i++) {
    Nan::Set(retArr, i, Nan::New(ret[i]));
  }
  info.GetReturnValue().Set(retArr);
}

void Init(v8::Local<v8::Object> exports) {
  exports->Set(Nan::New("decodeTicket").ToLocalChecked(), Nan::New<v8::FunctionTemplate>(decodeTicket)->GetFunction());
  exports->Set(Nan::New("encodeRequest").ToLocalChecked(), Nan::New<v8::FunctionTemplate>(encodeRequest)->GetFunction());
}

NODE_MODULE(addon, Init);