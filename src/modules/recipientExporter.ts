import * as fs from "fs-extra";
import * as path from "path";
import State from "../utils/state";

async function recipientExporter(
  state: State,
  filePath: string
): Promise<void> {
  await fs.outputFile(path.resolve(filePath), JSON.stringify(state.recipients));
}

export default recipientExporter;
