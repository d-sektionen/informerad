export class CalendarEvent {
  title: string;
  dateTimeString: string;

  constructor(title: string, dateTimeString: string) {
    this.title = title;
    this.dateTimeString = dateTimeString;
  }
}

export class Post {
  title: string;
  description: string;
  img: string | null = null;
  imgLink: string | null = null;
  link: string | null = null;
  linkText: string | null = null;

  constructor(title: string, description: string) {
    this.title = title;
    this.description = description;
  }

  setImg(img: string) {
    this.img = img;
  }

  setImgLink(imgLink: string) {
    this.imgLink = imgLink;
  }
  setLink(link: string) {
    this.link = link;
  }

  setLinkText(linkText: string) {
    this.linkText = linkText;
  }
}

export class Intro {
  text: string;
  img: string | null = null;
  imgText: string | null = null;
  link: string | null = null;
  constructor(text: string) {
    this.text = text;
  }

  setImg(img: string) {
    this.img = img;
  }
  setImgText(imgText: string) {
    this.imgText = imgText;
  }
  setLink(link: string) {
    this.link = link;
  }
}

export class Recipient {
  email: string;
  name: string;

  constructor(email: string, name: string) {
    this.email = email;
    this.name = name;
  }
}
