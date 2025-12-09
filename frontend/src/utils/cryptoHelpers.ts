// src/utils/cryptoHelpers.ts
import * as CryptoJS from "crypto-js";

const SCRAMBLE = `MIICXwIBAAKBgQDWReycV2f+rxWxrPmntHANpWfd2ikB0x8YWFB+thIzomhtSrXn
o6vlTFXn5NENDl1AxlU1vAHVkQnPjUZHQEPtzfKeoUBCiZ0WLvkDDeL7EfREpDyO
nhegKCjNPEpycf9rhR2bN1U7JV4H2YBYZOlRAXthgmQgLtaBJdoHf7YHVQIDAQAB
AoGBAL+qIHHghXd9KYyay15Fuo2aTQRXZqLpNEFUjfwp5LInLf3E/F3NO6+JzrX1
KUHifWu5fPLpz0I30GzFU/3b8GWd9L52w65j40w0eC+n51ORPm7T6o5f804HJdig
UkrvpbdwFGkF91a8zEObQAe2pPAQDkzO+pDKbR4YuMOfQmtpAkEA7DkUasCqm9Fu
JQ9fkj3lzaXfJy9pAO8ghQFmeH6q7DIUUIXhjIEsRRLofa9vOlyb59CDFfNm5KF9
tyyey00Q0wJBAOg2ZfFr0tUUdAd7oCVvzvcJh3ZAFPb/KTjParh2z2+UhZDkt/0e
J1Sdvl7dpAIQqAwlUI2LbKU3B1ZMGBlorjcCQQCDHUuP1VDdG+me+GF7so+TDbZG
8bG+qvvJ13Ug/G2ynDlaWHVQn4IK9OvGl1GNe0mt6bZYwLkjvd8hhMq+3Q+xAkEA
tJAYFPHSrv2Ie4kVrgaS2GUAgGKz6pveYd5nDajVA95pPZGbv6aCzrkaHooZzcFF
6qvZRzby9EUl32SsGJXdYQJBAIDBgXEJ9eZ4gUrVSR+ZsKz1g5HePEag3sTcrS9v
mrACiIfyn+eXbFwi8UtzB1HRlvBpoBCoqV7Jlr9MzThaDqI=`;

export function encryptPassword(
  value: string,
  key: string = SCRAMBLE
): string {
  // MD5 hash of UTF-8(key) – same bytes as ASCII for your characters
  const keyBytes = CryptoJS.enc.Utf8.parse(key);
  const keyHash = CryptoJS.MD5(keyBytes); // 16-byte key like MD5CryptoServiceProvider

  // Encrypt UTF-8(value) with TripleDES / ECB / PKCS7
  const plaintext = CryptoJS.enc.Utf8.parse(value);
  const encrypted = CryptoJS.TripleDES.encrypt(plaintext, keyHash, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });

  // Base64 ciphertext (equivalent to Convert.ToBase64String in C#)
  return encrypted.toString();
}
