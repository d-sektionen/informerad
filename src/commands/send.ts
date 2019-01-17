import { Command, flags } from "@oclif/command";
import cli from "cli-ux";
import * as inquirer from "inquirer";
import * as clipboardy from "clipboardy";
import * as inquirerDatepickerPrompt from "inquirer-datepicker-prompt";

import textStrings from "../modules/textStrings";
import wpUserRetriever from "../modules/wpUserRetriever";
import fileUserRetriever from "../modules/fileUserRetriever";
import getEventData from "../modules/getEventData";
import getContent from "../modules/getContent";
import getConfig from "../utils/getConfig";
import htmlCreator from "../modules/htmlCreator";
import textCreator from "../modules/textCreator";
import writeToFiles from "../modules/writeToFiles";
import mailgunSender from "../modules/mailgunSender";

inquirer.registerPrompt("datetime", inquirerDatepickerPrompt);

const PREVIEW_TYPES = {
  open: link => cli.open(link),
  "open-linux": link => cli.open(link, { app: "xdg-open" }),
  copy: link => clipboardy.write(link),
  none: () => Promise.resolve()
};

export default class Send extends Command {
  static description = "Generates and sends an email.";

  static flags = {
    help: flags.help({
      char: "h"
    }),
    recipients: flags.string({
      char: "r",
      description: "path to json file of recipients"
    }),
    wp: flags.boolean({
      description: "retrieve recipients from Wordpress"
    }),
    schedule: flags.boolean({
      description: "get prompted to schedule sending"
    }),
    content: flags.string({
      description: "path to folder of mail content"
    }),
    preview: flags.string({
      char: "p",
      description: "type of preview, will prompt if omitted",
      options: Object.keys(PREVIEW_TYPES)
    }),
    title: flags.string({
      char: "t",
      description: "the email title, aka subject, will prompt if omitted"
    }),
    layout: flags.string({
      char: "l",
      description: "the email layout template",
      options: ["newsletter", "announcement"],
      default: "newsletter"
    }),
    test: flags.boolean({
      description: "enable mailgun test mode"
    })
  };

  // the actual command, check oclif docs for more info.
  async run() {
    const { flags } = this.parse(Send);
    const { wp, recipients, content, layout, schedule, test } = flags;
    let { preview, title } = flags;

    // state variable that is passed through all the modules.
    let state = {
      lang: "sv",
      recipients: [],
      title: undefined,
      // TODO: move these badboys to flags
      from: {
        address: "infomail@d-sektionen.se",
        text: "D-sektionens infomail"
      },

      scheduled: "",
      testing: false
    };

    // loads config user has set using the "setting" command
    const userConfig = await getConfig(this.config);

    // module to import
    state = await textStrings(state);

    state.testing = test;

    if (schedule) {
      const { datetime } = await inquirer.prompt([
        {
          type: "datetime",
          name: "datetime",
          message:
            "When should the email be sent? (max 3 days into the future)",
          format: [
            "yyyy",
            "-",
            "mm",
            "-",
            "dd",
            " ",
            "HH",
            ":",
            "MM",
            ":",
            "ss"
          ]
        }
      ]);
      state.scheduled = new Date(datetime).toUTCString();
    }

    // set title if unset.
    if (!title) {
      const { newTitle } = await inquirer.prompt([
        {
          name: "newTitle",
          message: "What title should your email have?"
        }
      ]);
      title = newTitle;
    }
    state.title = title;

    // Get recipients from file if specified.
    if (recipients) {
      cli.action.start("Retrieving recipients from file");
      state = await fileUserRetriever(state, recipients);
      cli.action.stop();
    }
    // Get recipients from Wordpress if flag present.
    if (wp) {
      cli.action.start("Retrieving Wordpress users");
      state = await wpUserRetriever(state, {
        username: userConfig.wpuser,
        password: userConfig.wpkey
      });
      cli.action.stop();
    }

    // retrieve event data.
    cli.action.start("Retrieving event data");
    state = await getEventData(state);
    cli.action.stop();

    // retrieve content from specified folder.
    if (content) {
      cli.action.start("Retrieving content");
      state = await getContent(state, content);
      cli.action.stop();
    }

    // generate text/html representations and create preview file.
    cli.action.start("Generating html");
    state = await htmlCreator(state, layout);
    cli.action.stop();
    cli.action.start("Generating text version");
    state = await textCreator(state, layout);
    cli.action.stop();
    cli.action.start("Saving files");
    state = await writeToFiles(state, this.config.cacheDir);
    cli.action.stop();

    // prompt user for how they want their preview if flag unset.
    if (!preview) {
      const { previewType } = await inquirer.prompt([
        {
          type: "list",
          name: "previewType",
          message: "What type of preview do you want?",
          choices: Object.keys(PREVIEW_TYPES)
        }
      ]);
      preview = previewType;
    }

    // run preview action
    await PREVIEW_TYPES[preview](state.preview);

    if (preview != "none") {
      // Prompt so user has time to look at preview.
      const { reallySend } = await inquirer.prompt([
        {
          type: "confirm",
          name: "reallySend",
          message: `Are you happy with the preview and ready to send to ${
            state.recipients.length
          } recipients?`,
          default: false
        }
      ]);
      if (!reallySend) this.exit();
    }

    // Send email
    cli.action.start("Sending email using mailgun");
    state = await mailgunSender(state, userConfig.mgkey);
    cli.action.stop();
  }
}
