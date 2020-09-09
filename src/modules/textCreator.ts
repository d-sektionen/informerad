import * as mustache from "mustache";
const Entities = require("html-entities").AllHtmlEntities;
import { templatesPath } from "./htmlCreator";
import * as path from "path";
import * as fs from "fs-extra";
import State from "../utils/state";

const entities = new Entities();

async function textCreator(state: State, type: string): Promise<void> {
  const template = await fs.readFile(
    path.join(templatesPath, "pages", `${type}.txt`)
  );
  const templateString = template.toString();

  const data = {
    subject: state.title,
    ...state.data,
    strings: state.strings,
  };
  const text = entities.decode(mustache.render(templateString, data));
  state.text = text;
}

export default textCreator;
