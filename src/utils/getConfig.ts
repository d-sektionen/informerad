import * as fs from "fs-extra";
import * as path from "path";

export const createPath = config => path.join(config.configDir, "config.json");

async function getConfig(config) {
  const configPath = createPath(config);
  let jsonConfig;
  try {
    jsonConfig = await fs.readJSON(configPath);
  } catch (err) {
    await fs.outputJson(configPath, {});
    jsonConfig = await fs.readJSON(configPath);
  }

  return jsonConfig;
}

export default getConfig;
