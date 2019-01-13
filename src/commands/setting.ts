import { Command, flags } from "@oclif/command";
import * as fs from "fs-extra";
import getConfig, { createPath } from "../utils/getConfig";

export default class Setting extends Command {
  static description = "describe the command here";
  /*
  static examples = [
    `$ informerad hello
hello world from ./src/hello.ts!
`
  ];*/

  static flags = {
    help: flags.help({ char: "h" })
  };

  static args = [
    { name: "setting", required: true },
    { name: "value", required: true }
  ];

  async run() {
    const { args, flags } = this.parse(Setting);

    const { setting, value } = args;

    const userConfig = await getConfig(this.config);

    const newConfig = { ...userConfig, [setting]: value };

    await fs.outputJson(createPath(this.config), newConfig);

    this.log(`"${setting}" set to: "${value}"`);

    // this.log(userConfig);
    // this.log(newConfig);
  }
}
