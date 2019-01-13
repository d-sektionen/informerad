import * as fs from "fs-extra";
import * as path from "path";
import slugify from "slugify";
import mustache = require("mustache");
import { templatesPath } from "./htmlCreator";

async function writeToFiles(state, folder) {
  const files = ["txt", "html", "preview.html"].reduce(
    (prev, curr) => ({
      ...prev,
      [curr]: path.join(
        folder,
        "output",
        `${slugify(state.title).toLowerCase()}-${state.lang}.${curr}`
      )
    }),
    {}
  );
  await fs.outputFile(files.html, state.html);
  await fs.outputFile(files.txt, state.text);

  const { size: htmlSize } = await fs.stat(files.html);
  const { size: textSize } = await fs.stat(files.txt);

  let template = await fs.readFile(path.join(templatesPath, `preview.html`));
  template = template.toString();

  const previewHtml = mustache.render(template, {
    textOutput: files.txt,
    htmlOutput: files.html,
    textSize,
    htmlSize
  });

  await fs.outputFile(files["preview.html"], previewHtml);

  return { ...state, preview: files["preview.html"] };
}

export default writeToFiles;
