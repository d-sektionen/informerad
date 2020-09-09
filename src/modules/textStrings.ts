import State from "../utils/state";

const sv = {
  looksWierd: "Ser mailet konstigt ut? Läs på d-sektionen.se",
  readMore: "Läs mer",
  upcomingEvents: "Kommande evenemang",
  viewCalendar: "Visa kalender",
  featuredJobs: "Veckans jobb",
  showAllJobs: "Visa alla jobb",
  socialMedia: "Sociala medier",
  facebook: "Facebook",
  facebookGroup: "Facebook-grupp",
  twitter: "Twitter",
  instagram: "Instagram",
  moreSocialMedia: "Fler sociala medier",
  address:
    "Datateknologsektionen, Kårallen, Universitetet, 581&nbsp;83&nbsp;Linköping",
  questions: "Några frågor, tankar eller inlägg? Skicka iväg ett mail till",
  privacyPolicy: "Personuppgiftshantering",
  unsubscribe: "Avsluta Prenumeration",

  months: [
    "januari",
    "februari",
    "mars",
    "april",
    "maj",
    "juni",
    "juli",
    "augusti",
    "september",
    "oktober",
    "november",
    "december",
  ],
};

// const en = {
//   ...sv,
//   looksWierd: "Does this email look strange? Read at d-sektionen.se",
//   readMore: "Read more",
//   upcomingEvents: "Upcoming events",
//   viewCalendar: "View calendar",
//   featuredJobs: "Featured jobs",
//   showAllJobs: "Show all jobs",
//   socialMedia: "Social media",
//   facebookGroup: "Facebook group",
//   moreSocialMedia: "More social media",
//   address:
//     "Datateknologsektionen, Kårallen, Universitetet, 581&nbsp;83&nbsp;Linköping, Sweden",
//   questions: "Any questions, thoughts or entries? Send an email to",
//   privacyPolicy: "Privacy policy",
//   unsubscribe: "Unsubscribe",

//   months: [
//     "January",
//     "February",
//     "March",
//     "April",
//     "May",
//     "June",
//     "July",
//     "August",
//     "September",
//     "October",
//     "November",
//     "December",
//   ],
// };

const textStrings = (state: State): void => {
  state.strings = sv;
};

export default textStrings;
