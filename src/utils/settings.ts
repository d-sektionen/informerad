import * as fs from "fs-extra";
import * as path from "path";

const createPath = (config) => path.join(config.configDir, "config.json");

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
      Setting.settings.find((setting: Setting) => (setting.key = key)) || null
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

  async getValue(config) {
    const c = await getConfig(config);
    return c[this.key];
  }

  async setValue(config, value: string) {
    const userConfig = await getConfig(config);

    const newConfig = { ...userConfig, [this.key]: value };

    await fs.outputJson(createPath(config), newConfig);
  }
}

export default Setting;
