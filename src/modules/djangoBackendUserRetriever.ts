import axios from "axios";
import State from "../utils/state";
import { Recipient } from "../utils/models";

const ENDPOINT = "https://backend.d-sektionen.se/account/infomail-subscribers/";

const axiosOptions = (token: string) => ({
  headers: {
    Authorization: `Token ${token}`,
  },
});

const djangoBackendUserRetriever = async (
  state: State,
  token: string
): Promise<void> => {
  const res = await axios.get(ENDPOINT, axiosOptions(token));

  state.addRecipients(
    res.data.map(
      (user: { email: string; pretty_name: string }) =>
        new Recipient(user.email, user.pretty_name)
    )
  );
};

export default djangoBackendUserRetriever;
