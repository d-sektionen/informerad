import * as fs from "fs-extra";
import * as path from "path";

async function recipientExporter(state, filePath) {
  await fs.outputFile(path.resolve(filePath), JSON.stringify(state.recipients));

  return { ...state };
}

export default recipientExporter;
