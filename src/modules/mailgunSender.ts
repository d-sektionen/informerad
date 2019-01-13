import axios = require("axios");
import FormData = require("form-data");

const apiBase = key =>
  `https://api:${key}@api.mailgun.net/v3/mailgun.d-sektionen.se/`;

const getRecipientVariables = users =>
  JSON.stringify(
    users.reduce(
      (result, user, i) => ({
        ...result,
        [user.email]: { id: i }
      }),
      {}
    )
  );

const sendEmail = (state, key) =>
  new Promise((resolve, reject) => {
    const sender = `${state.from.text} <${state.from.address}>`;

    const formData = new FormData();
    formData.append("from", sender);
    state.recipients.forEach(recipient => {
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

    axios
      .post(`${apiBase(key)}messages`, formData, {
        headers: formData.getHeaders()
      })
      .then(response => {
        resolve({ ...state, response });
      })
      .catch(reject);
  });

export default sendEmail;
