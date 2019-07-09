import { encryptPublicLong } from '@lsqswl/rsaencrypt'
import encryptorConfig from "@/config/encryptor";

export default {
  encrypt(obj) {
    obj = JSON.stringify(obj);
    return encryptPublicLong(obj, encryptorConfig.publicKey)
  }
}

