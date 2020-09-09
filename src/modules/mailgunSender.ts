import axios from "axios";
import * as FormData from "form-data";
import State from "../utils/state";
import { Recipient } from "../utils/models";

const apiBase = (key: string) =>
  `https://api:${key}@api.mailgun.net/v3/mailgun.d-sektionen.se/`;

const getRecipientVariables = (users: Recipient[]): string =>
  JSON.stringify(
    users.reduce(
      (result, user, i) => ({
        ...result,
        [user.email]: { id: i },
      }),
      {}
    )
  );

const sendEmail = async (state: State, key: string): Promise<void> => {
  const sender = `${state.from.text} <${state.from.address}>`;

  const formData = new FormData();
  formData.append("from", sender);
  state.recipients.forEach((recipient) => {
    formData.append("to", `${recipient.name} <${recipient.email}>`);
  });
  formData.append("subject", state.title);
  formData.append("html", state.html);
  formData.append("text", state.text);
  formData.append("h:sender", sender);
  formData.append(
    "recipient-variables",
    getRecipientVariables(state.recipients)
  );
  if (state.scheduled) formData.append("o:deliverytime", state.scheduled);
  if (state.testing) formData.append("o:testmode", "true");

  const res = await axios.post(`${apiBase(key)}messages`, formData, {
    headers: formData.getHeaders(),
  });
  // TODO: Add response status to state??
};

export default sendEmail;
