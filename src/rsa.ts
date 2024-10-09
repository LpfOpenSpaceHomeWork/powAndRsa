import crypto from "node:crypto";
import { pow } from "./pow";
import chalk from "chalk";

const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: "spki",
    format: "pem",
  },
  privateKeyEncoding: {
    type: "pkcs8",
    format: "pem",
  },
});

// 哈希函数
const hash = (data: string) =>
  crypto.createHash("sha256").update(data).digest("hex");

// 公钥加密
const encrypt = (data: string) =>
  crypto.publicEncrypt(publicKey, Buffer.from(data)).toString("base64");

// 私钥解密
const decrypt = (encryptedData: string) =>
  crypto
    .privateDecrypt(privateKey, Buffer.from(encryptedData, "base64"))
    .toString("utf-8");

// 签名：公钥加密后进行hash
const sign = (rawData: string) => encrypt(hash(rawData));

// 验证：私钥解密后，与原始内容的哈希进行比对
const verify = (rawData: string, signature: string) => {
  if (hash(rawData) !== decrypt(signature)) {
    throw new Error(
      chalk.red(
        `the raw data "${rawData}" and its signature "${signature}" is matched`
      )
    );
  }
  console.log(
    `${chalk.green(
      "✔️"
    )} the raw data "${rawData}" and its signature "${signature}" is matched`
  );
};

const myNickName = "Runnan";
const { nounce } = pow(myNickName, 4);
const data = `${myNickName}-${nounce}`;

const signature = sign(data);
verify(data, signature);
