import React from 'react';
import './style.css';
import CryptoJS from 'crypto-js';
import JSEncrypt from 'jsencrypt';

export default function App() {
  const RSAPublicKey = `MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCjj1EG1F68SEUOEY/fi7AQlCd/
  51OJxs/dDrfvB71tUZt0qkCmCfUbQrETR9hVZp/1ZluSlhrVyc6i2lorr2yiNxv2
  sTdePBE2fVJYMO3kbjnEaSNVdnn/FEuVaHzjf9DgVc0E9cthAwMy+qJ6kYX15tbV
  tD9B92tTGk8myHTW8wIDAQAB`;

  const data = { name: 'Yashu', lastName: 'Verma' };

  //generate AES key
  var secretPhrase = CryptoJS.lib.WordArray.random(16);
  var salt = CryptoJS.lib.WordArray.random(128 / 8);
  //aes key 128 bits (16 bytes) long
  var aesKey = CryptoJS.PBKDF2(secretPhrase.toString(), salt, {
    keySize: 128 / 32,
  });

  //initialization vector - 1st 16 chars of userId
  var iv = CryptoJS.enc.Utf8.parse(secretPhrase);
  var aesOptions = {
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
    iv: iv,
  };
  var aesEncTrans = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    aesKey,
    aesOptions
  );

  //encrypt AES key with RSA public key
  var rsaEncrypt = new JSEncrypt();
  rsaEncrypt.setPublicKey(RSAPublicKey);
  var rsaEncryptedAesKey = rsaEncrypt.encrypt(aesEncTrans.key.toString());

  return (
    <div>
      <h1>Encryption/Decryption POC</h1>
      <span>Secret Phrase - {JSON.stringify(secretPhrase)}</span> <br /> <br />
      <span>Salt - {JSON.stringify(salt)}</span> <br /> <br />
      <span>AES Key - {JSON.stringify(aesKey)}</span> <br /> <br />
      <span>ENC DATA Key - {aesEncTrans.toString()}</span> <br /> <br />
      <span>AES key - {aesEncTrans.key.toString()}</span> <br /> <br />
      <span>RSA ENC AES key - {rsaEncryptedAesKey}</span>
    </div>
  );
}
