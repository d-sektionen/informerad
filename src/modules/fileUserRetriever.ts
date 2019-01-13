import * as fs from "fs-extra";

import * as path from "path";

async function fileUserRetriever(state, file) {
  return fs.readJson(path.resolve(file)).then(json => {
    const oldRecipients = Object.prototype.hasOwnProperty.call(
      state,
      "recipients"
    )
      ? state.recipients
      : [];
    return Promise.resolve({
      ...state,
      recipients: json.length ? [...oldRecipients, ...json] : [...oldRecipients]
    });
  });
}

export default fileUserRetriever;
