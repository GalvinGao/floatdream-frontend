import JSEncrypt from 'jsencrypt';
import encryptorConfig from "@/config/encryptor";

export default {
  encrypt(obj) {
    obj = JSON.stringify(obj);
    let encrypt = new JSEncrypt();
    encrypt.setPublicKey(encryptorConfig.publicKey);
    return encrypt.encrypt(obj);
  }
}

