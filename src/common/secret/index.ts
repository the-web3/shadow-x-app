// // import { AES, enc } from "crypto-js";
// import AES from 'crypto-js/aes';
// import enc from 'crypto-js/aes';
import * as cryptoJs from 'crypto-js';
const { AES, enc} = cryptoJs;

export function Encrypt(value: string, key: string){
    if (typeof value == 'string' && typeof key == 'string') {
        return AES.encrypt(value, key).toString();
    } else {
        throw new Error("do not support this type key and value");
    }
}

export function Decrypt(value: string, key: string){
    if (typeof value == 'string' && typeof key == 'string') {
        let bytes = AES.decrypt(value, key);
        return bytes.toString(enc.Utf8);
    } else {
        throw new Error("do not support this type key and value");
    }
}
