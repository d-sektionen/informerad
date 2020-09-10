// import axios from "axios";
// import State from "../utils/state";

// const ENDPOINT = "https://d-sektionen.se/wp-json/wp/v2/users";

// const axiosOptions = (token: string, page: number) => ({
//   params: {
//     context: "edit",
//     per_page: "100",
//     page,
//   },
//   headers: {
//     Authorization: `Basic ${token}`,
//   },
// });

// const splitLangs = (array) =>
//   array.reduce((result, user) => {
//     const lang = user.infomail;
//     if (lang === "") return result;
//     return {
//       ...result,
//       [lang]: [
//         ...(Object.prototype.hasOwnProperty.call(result, lang)
//           ? result[lang]
//           : []),
//         { email: user.email, name: user.name },
//       ],
//     };
//   }, {});

// const getToken = (credentials: { username: string; password: string }) => {
//   const { password, username } = credentials;
//   const token = Buffer.from(`${username}:${password}`).toString("base64");
//   return token;
// };

// const wpUserRetriever = (
//   state: State,
//   credentials: { username: string; password: string }
// ): Promise<void> => {
//   const token = getToken(credentials);

//   return axios.get(ENDPOINT, axiosOptions(token, 1)).then((res) => {
//     const totalPageCount = res.headers["x-wp-totalpages"];
//     // page numbers of the upcoming pages
//     const upcomingPages = [...Array(totalPageCount - 1).keys()].map(
//       (num) => num + 2
//     );

//     // retrieve all the upcoming pages
//     return axios
//       .all(
//         upcomingPages.map((page) =>
//           axios.get(ENDPOINT, axiosOptions(token, page))
//         )
//       )
//       .then(
//         axios.spread((...results) => {
//           const dataFromResults = results.map((r) => r.data);

//           // merge all users from all requests.
//           const allUsers = [
//             ...dataFromResults.reduce((a, b) => [...a, ...b], []),
//             ...res.data,
//           ];

//           // recipients already in the state before this module was run.
//           const oldRecipients = Object.prototype.hasOwnProperty.call(
//             state,
//             "recipients"
//           )
//             ? state.recipients
//             : [];

//           const langs = splitLangs(allUsers);
//           return Promise.resolve({
//             ...state,
//             recipients: Object.prototype.hasOwnProperty.call(langs, state.lang)
//               ? [...oldRecipients, ...new Set(langs[state.lang])]
//               : [...oldRecipients], // the set + spread removes duplicates
//           });
//         })
//       );
//   });
// };

// export default wpUserRetriever;
