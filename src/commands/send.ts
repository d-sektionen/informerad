import { Command, flags } from "@oclif/command";
import cli from "cli-ux";
import { write as writeToClipboard } from "clipboardy";
import * as inquirer from "inquirer";
// @ts-ignore
import * as inquirerDatepickerPrompt from "inquirer-datepicker-prompt";

import textStrings from "../modules/textStrings";
// import wpUserRetriever from "../modules/wpUserRetriever";
import fileUserRetriever from "../modules/fileUserRetriever";
import getEventData from "../modules/getEventData";
import getContent from "../modules/getContent";
import htmlCreator from "../modules/htmlCreator";
import textCreator from "../modules/textCreator";
import writeToFiles from "../modules/writeToFiles";
import mailgunSender from "../modules/mailgunSender";
import recipientExporter from "../modules/recipientExporter";
import djangoBackendUserRetriever from "../modules/djangoBackendUserRetriever";
import Setting from "../utils/settings";
import State from "../utils/state";

inquirer.registerPrompt("datetime", inquirerDatepickerPrompt);

const previewLink = (type: string, link: string): void => {
  if (type === "open") {
    cli.open(link);
  } else if (type === "open-linux") {
    cli.open(link, { app: "xdg-open" });
  } else if (type === "copy") {
    writeToClipboard(link);
  }
};
const PREVIEW_TYPES = ["open", "open-linux", "copy", "none"];

export default class SendCommand extends Command {
  static description = "Generates and sends an email.";

  static flags = {
    help: flags.help({
      char: "h",
    }),
    recipients: flags.string({
      char: "r",
      description: "path to json file of recipients",
    }),
    django_backend: flags.boolean({
      description: "retrieve recipients from the D-sektionen Django backend",
    }),
    // wp: flags.boolean({
    //   description: "retrieve recipients from Wordpress",
    // }),
    schedule: flags.boolean({
      description: "get prompted to schedule sending",
    }),
    content: flags.string({
      description: "path to folder of mail content",
    }),
    preview: flags.string({
      char: "p",
      description: "type of preview, will prompt if omitted",
      options: PREVIEW_TYPES,
    }),
    title: flags.string({
      char: "t",
      description: "the email title, aka subject, will prompt if omitted",
    }),
    layout: flags.string({
      char: "l",
      description: "the email layout template",
      options: ["newsletter", "announcement"],
      default: "newsletter",
    }),
    test: flags.boolean({
      description: "enable mailgun test mode",
    }),
    export_recipients: flags.string({
      description: "path to json file which recipients are exported to.",
    }),
  };

  // the actual command, check oclif docs for more info.
  async run() {
    const { flags } = this.parse(SendCommand);
    const {
      django_backend,
      // wp,
      recipients,
      content,
      layout,
      schedule,
      test,
      export_recipients,
      preview,
      title,
    } = flags;

    // state variable that is passed through all the modules.
    const state = new State();

    // module to import
    textStrings(state);

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
            "ss",
          ],
        },
      ]);
      state.scheduled = new Date(datetime).toUTCString();
    }

    // set title if unset.
    let finalTitle = title;
    if (!title) {
      const { newTitle } = await inquirer.prompt([
        {
          name: "newTitle",
          message: "What title should your email have?",
        },
      ]);
      finalTitle = newTitle;
    }
    state.setTitle(finalTitle || "");

    // Get recipients from file if specified.
    if (recipients) {
      cli.action.start("Retrieving recipients from file");
      await fileUserRetriever(state, recipients);
      cli.action.stop();
    }
    // // Get recipients from Wordpress if flag present.
    // if (wp) {
    //   cli.action.start("Retrieving Wordpress users");
    //   await wpUserRetriever(state, {
    //     username: await Setting.WP_USER.getValue(this.config.configDir),
    //     password: await Setting.WP_KEY.getValue(this.config.configDir),
    //   });
    //   cli.action.stop();
    // }

    // Get recipients from the django backend if flag present.
    if (django_backend) {
      cli.action.start("Retrieving Django backend users");
      await djangoBackendUserRetriever(
        state,
        await Setting.DJANGO_TOKEN.getValue(this.config.configDir)
      );
      cli.action.stop();
    }

    if (export_recipients) {
      cli.action.start("Saving recipients to file.");
      await recipientExporter(state, export_recipients);
      cli.action.stop();
    }

    // retrieve event data.
    cli.action.start("Retrieving event data");
    await getEventData(state);
    cli.action.stop();

    // retrieve content from specified folder.
    if (content) {
      cli.action.start("Retrieving content");
      await getContent(state, content);
      cli.action.stop();
    }

    // generate text/html representations and create preview file.
    cli.action.start("Generating html");
    await htmlCreator(state, layout || "");
    cli.action.stop();
    cli.action.start("Generating text version");
    await textCreator(state, layout || "");
    cli.action.stop();
    cli.action.start("Saving files");
    await writeToFiles(state, this.config.cacheDir);
    cli.action.stop();

    // prompt user for how they want their preview if flag unset.
    let finalPreview = preview;
    if (!preview) {
      const { previewType } = await inquirer.prompt([
        {
          type: "list",
          name: "previewType",
          message: "What type of preview do you want?",
          choices: PREVIEW_TYPES,
        },
      ]);
      finalPreview = previewType;
    }

    // run preview action
    previewLink(finalPreview || "", state.preview);

    if (finalPreview != "none") {
      // Prompt so user has time to look at preview.
      const { reallySend } = await inquirer.prompt([
        {
          type: "confirm",
          name: "reallySend",
          message: `Are you happy with the preview and ready to send to ${state.recipients.length} recipients?`,
          default: false,
        },
      ]);
      if (!reallySend) this.exit();
    }

    // Send email
    cli.action.start("Sending email using mailgun");
    await mailgunSender(
      state,
      await Setting.MG_KEY.getValue(this.config.configDir)
    );
    cli.action.stop();
  }
}
