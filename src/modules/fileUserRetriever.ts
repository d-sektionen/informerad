import * as fs from "fs-extra";

import * as path from "path";
import State from "../utils/state";
import { Recipient } from "../utils/models";

async function fileUserRetriever(state: State, file: string): Promise<void> {
  const json = await fs.readJson(path.resolve(file));

  state.addRecipients(
    json.map(
      (user: { email: string; pretty_name: string }) =>
        new Recipient(user.email, user.pretty_name)
    )
  );
}

export default fileUserRetriever;
