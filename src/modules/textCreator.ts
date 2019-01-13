const mustache = require("mustache");
const Entities = require("html-entities").AllHtmlEntities;
import { templatesPath } from "./htmlCreator";
import * as path from "path";
import * as fs from "fs-extra";

const entities = new Entities();

async function textCreator(state, type) {
  let template = await fs.readFile(
    path.join(templatesPath, "pages", `${type}.txt`)
  );
  template = template.toString();

  return new Promise(resolve => {
    const data = {
      subject: state.title,
      ...state.data,
      strings: state.strings
    };
    const text = entities.decode(mustache.render(template, data));
    resolve({ ...state, text });
  });
}

export default textCreator;
