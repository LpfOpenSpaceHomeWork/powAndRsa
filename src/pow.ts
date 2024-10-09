import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { argv } from "node:process";

const ZERO = "0";

export const pow = (nickName: string, difficulty: number) => {
  let startTime = Date.now();
  while (true) {
    const nounce = crypto.randomBytes(32).toString("hex");
    const content = `${nickName}-${nounce}`;
    const hash = crypto.createHash("sha256").update(content).digest("hex");

    if (hash.slice(0, difficulty) === ZERO.repeat(difficulty)) {
      const costedTime = Date.now() - startTime;
      console.log(
        `when the difficulty is ${difficulty}, the content to hash is "${content}", the computed hash is "${hash}", and the time of proof of work costs is ${costedTime} ms, `
      );
      return {
        hash,
        nounce,
      };
    }
  }
};

const isEntryFile = () => fileURLToPath(import.meta.url) === argv[1];

if (isEntryFile()) {
  let difficulty = 4;
  while (difficulty <= 5) {
    pow("Runnan", difficulty);
    difficulty++;
  }
}
