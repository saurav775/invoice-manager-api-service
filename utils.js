import dotenv from "dotenv";
import { DEV, DEV_ENV_PATH } from "./constants.js";

export const initDotEnv = () => {
  dotenv.config();

  if (process.env.NODE_ENV === DEV) {
    const result = dotenv.config({ path: DEV_ENV_PATH });

    process.env = {
      ...process.env,
      ...result.parsed,
    };
  }
};

export const generateRandomId = () => {
  const characters = "abcdefghijklmnopqrstuvwxyz1234567890";
  let randomId = "";
  for (let i = 0; i < 10; i++) {
    randomId += characters[parseInt(Math.random() * characters.length)];
  }
  return randomId;
};
