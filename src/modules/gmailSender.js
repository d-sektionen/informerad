// /*
//  * This module is outdated and most probably needs some rework to function properly.
//  */

// const fs = require("fs");
// const readline = require("readline");
// const { google } = require("googleapis");
// const { Base64 } = require("js-base64");

// // If modifying these scopes, delete googleToken.json.
// const SCOPES = ["https://www.googleapis.com/auth/gmail.send"];
// const TOKEN_PATH = "googleToken.json";
// const CREDENTIALS_PATH = "googleCredentials.json";

// // Gets credentials from the file provided in CREDENTIALS_PATH.
// // The file should be downloaded from the Google API dashboard.
// const getCredentials = () =>
//   new Promise((resolve, reject) => {
//     // Load client secrets from a local file.
//     fs.readFile(CREDENTIALS_PATH, (err, content) => {
//       if (err) reject(err);
//       else resolve(JSON.parse(content));
//     });
//   });

// // Gets and saves a new token to the file system.
// // Returns the oAuth2Client with the token.
// const getNewToken = oAuth2Client =>
//   new Promise((resolve, reject) => {
//     const authUrl = oAuth2Client.generateAuthUrl({
//       access_type: "offline",
//       scope: SCOPES
//     });

//     console.log("Authorize this app by visiting this url:", authUrl);
//     const rl = readline.createInterface({
//       input: process.stdin,
//       output: process.stdout
//     });
//     rl.question("Enter the code from that page here: ", code => {
//       rl.close();
//       oAuth2Client.getToken(code, (err, token) => {
//         if (err) reject(err);
//         else {
//           oAuth2Client.setCredentials(token);
//           // Store the token to disk for later program executions
//           fs.writeFile(TOKEN_PATH, JSON.stringify(token), writeErr => {
//             console.log(
//               writeErr
//                 ? `Failed to save token to disk:\n${writeErr}`
//                 : `Token stored to ${TOKEN_PATH}`
//             );
//           });
//           resolve(oAuth2Client);
//         }
//       });
//     });
//   });

// // Authorizes the user from the given credentials
// const authorize = credentials =>
//   new Promise(resolve => {
//     // eslint-disable-next-line camelcase
//     const { client_secret, client_id, redirect_uris } = credentials.installed;
//     const oAuth2Client = new google.auth.OAuth2(
//       client_id,
//       client_secret,
//       redirect_uris[0]
//     );

//     // Check if we have previously stored a token.
//     fs.readFile(TOKEN_PATH, (err, token) => {
//       if (err) getNewToken(oAuth2Client).then(resolve);
//       else {
//         oAuth2Client.setCredentials(JSON.parse(token));
//         resolve(oAuth2Client);
//       }
//     });
//   });

// const makeBody = options =>
//   [
//     'Content-Type: text/html; charset="UTF-8"\n',
//     "MIME-Version: 1.0\n",
//     "Content-Transfer-Encoding: 7bit\n",
//     "bcc: ",
//     options.to.join(),
//     "\n",
//     "from: ",
//     `${options.from.text} <${options.from.address}>`,
//     "\n",
//     "subject: ",
//     options.subject,
//     "\n\n",
//     options.html
//   ].join("");

// const sendEmail = (auth, options) =>
//   new Promise((resolve, reject) => {
//     const gmail = google.gmail({ version: "v1", auth });

//     const email = makeBody(options);

//     const base64EncodedEmail = Base64.encodeURI(email);

//     gmail.users.messages.send(
//       {
//         userId: "me",
//         resource: {
//           raw: base64EncodedEmail
//         }
//       },
//       (err, res) => {
//         if (err) reject(err);
//         else resolve(res.data);
//       }
//     );
//   });

// module.exports = options =>
//   getCredentials()
//     .then(authorize)
//     .then(auth => sendEmail(auth, options))
//     .then(() => Promise.resolve({ ...options }));
