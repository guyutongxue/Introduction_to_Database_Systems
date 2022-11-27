import * as dotenv from "dotenv";
import { fileURLToPath } from "node:url";

const dotenvUrl = new URL("../../../.env", import.meta.url);
dotenv.config({
  path: fileURLToPath(dotenvUrl),
});
