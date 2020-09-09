import { Recipient, CalendarEvent, Intro, Post } from "./models";

export default class State {
  lang: string = "sv";
  recipients: Recipient[] = [];
  title: string = "";
  from: { address: string; text: string } = {
    // TODO: move these badboys to flags
    address: "infomail@d-sektionen.se",
    text: "D-sektionens infomail",
  };
  scheduled: string = "";
  testing: boolean = false;
  strings: object = {};

  data: {
    events: CalendarEvent[];
    news: Post[];
    intro: Intro | null;
  } = { events: [], news: [], intro: null };
  html: string = "";
  text: string = "";
  preview: string = "";

  setLang(lang: string) {
    this.lang = lang;
  }
  setTitle(title: string) {
    this.title = title;
  }

  addRecipients(recipients: Recipient[]) {
    this.recipients = [...this.recipients, ...recipients];
  }
  addNews(posts: Post[]) {
    this.data.news = [...this.data.news, ...posts];
  }
  addEvents(events: CalendarEvent[]) {
    this.data.events = [...this.data.events, ...events];
  }
  setIntro(intro: Intro) {
    this.data.intro = intro;
  }
}
