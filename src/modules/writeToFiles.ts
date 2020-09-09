import * as fs from "fs-extra";
import * as path from "path";
import slugify from "slugify";
import * as mustache from "mustache";
import { templatesPath } from "./htmlCreator";
import State from "../utils/state";

async function writeToFiles(state: State, folder: string): Promise<void> {
  const [txtFile, htmlFile, previewFile] = [
    "txt",
    "html",
    "preview.html",
  ].map((extension) =>
    path.join(
      folder,
      "output",
      `${slugify(state.title).toLowerCase()}.${extension}`
    )
  );
  await fs.outputFile(htmlFile, state.html);
  await fs.outputFile(txtFile, state.text);

  const { size: htmlSize } = await fs.stat(htmlFile);
  const { size: textSize } = await fs.stat(txtFile);

  const templateFile = await fs.readFile(
    path.join(templatesPath, `preview.html`)
  );
  const template = templateFile.toString();

  const previewHtml = mustache.render(template, {
    textOutput: txtFile,
    htmlOutput: htmlFile,
    textSize,
    htmlSize,
  });

  await fs.outputFile(previewFile, previewHtml);

  state.preview = previewFile;
}

export default writeToFiles;
