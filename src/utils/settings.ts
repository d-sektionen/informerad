import * as fs from "fs-extra";
import * as path from "path";

const createPath = (configDir: string) => path.join(configDir, "config.json");

async function getConfig(configDir: string) {
  const configPath = createPath(configDir);
  let jsonConfig;
  try {
    jsonConfig = await fs.readJSON(configPath);
  } catch (err) {
    await fs.outputJson(configPath, {});
    jsonConfig = await fs.readJSON(configPath);
  }

  return jsonConfig;
}

class Setting {
  static readonly WP_KEY = new Setting(
    "wpkey",
    "(Outdated) Wordpress access token."
  );
  static readonly WP_USER = new Setting(
    "wpuser",
    "(Outdated) Wordpress username for the sender."
  );
  static readonly MG_KEY = new Setting("mgkey", "Mailgun private key.");
  static readonly DJANGO_TOKEN = new Setting(
    "djangotoken",
    "Django backend access token."
  );

  private static readonly settings = [
    Setting.MG_KEY,
    Setting.DJANGO_TOKEN,
    Setting.WP_KEY,
    Setting.WP_USER,
  ];

  static getFromKey(key: string): Setting | null {
    return (
      Setting.settings.find((setting: Setting) => setting.key === key) || null
    );
  }

  static getSettingDescriptionList(): string {
    return Setting.settings
      .map((setting: Setting) => `${setting.key}: ${setting.description}`)
      .join("\n");
  }

  key: string;
  description: string;

  private constructor(key: string, description: string = "") {
    this.key = key;
    this.description = description;
  }

  async getValue(configDir: string) {
    const c = await getConfig(configDir);
    return c[this.key];
  }

  async setValue(configDir: string, value: string) {
    const userConfig = await getConfig(configDir);

    const newConfig = { ...userConfig, [this.key]: value };

    await fs.outputJson(createPath(configDir), newConfig);
  }
}

export default Setting;
