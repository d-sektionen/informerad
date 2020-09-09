import { Command, flags } from "@oclif/command";
import Setting from "../utils/settings";

export default class SettingCommand extends Command {
  static description =
    "Command for configuring the different settings of InformeraD.";
  /*
  static examples = [
    `$ informerad hello
hello world from ./src/hello.ts!
`
  ];*/

  static flags = {
    help: flags.help({ char: "h" }),
  };

  static args = [
    {
      name: "setting",
      required: true,
      description: Setting.getSettingDescriptionList(),
    },
    {
      name: "value",
      required: true,
      description: "The string value of the setting",
    },
  ];

  async run() {
    const { args, flags } = this.parse(SettingCommand);

    const { setting, value } = args;

    const settingType = Setting.getFromKey(setting);
    if (!settingType) this.error("Unknown setting.");
    await settingType.setValue(this.config.configDir, value);

    this.log(`"${setting}" set to: "${value}"`);
  }
}
