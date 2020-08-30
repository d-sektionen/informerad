import axios from "axios";

const ENDPOINT =
  "https://backend.d-sektionen.se/account/infomail-subscribers/";

const axiosOptions = token => ({
  headers: {
    Authorization: `Token ${token}`
  }
});

const djangoBackendUserRetriever = (state, token) => {
  return axios.get(ENDPOINT, axiosOptions(token)).then(res => {
    // recipients already in the state before this module was run.
    const oldRecipients = Object.prototype.hasOwnProperty.call(
      state,
      "recipients"
    )
      ? state.recipients
      : [];

    return Promise.resolve({
      ...state,
      recipients: [
        ...oldRecipients,
        ...res.data.map(user => ({ email: user.email, name: user.pretty_name }))
      ]
    });
  });
};

export default djangoBackendUserRetriever;
