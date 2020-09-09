import * as fs from "fs-extra";
import * as path from "path";
import * as matter from "gray-matter";
import State from "../utils/state";
import { Post, Intro } from "../utils/models";

const getNews = async (basePath: string) => {
  const newsFolderPath = path.join(basePath, "news");
  const newsFiles = await fs.readdir(newsFolderPath);

  const news = await Promise.all(
    newsFiles.map(async (file) => {
      const fileBuffer = await fs.readFile(path.join(newsFolderPath, file));

      const data = matter(fileBuffer.toString());

      const post = new Post(data.data.title, data.content);
      if (data.data.img) post.setImg(data.data.img);
      if (data.data.imgLink) post.setImgLink(data.data.imgLink);
      if (data.data.link) post.setLink(data.data.link);
      if (data.data.linkText) post.setLinkText(data.data.linkText);
      return post;
    })
  );

  return news;
};

const getIntro = async (basePath: string): Promise<Intro | null> => {
  try {
    const fileBuffer = await fs.readFile(path.join(basePath, `intro.md`));
    const data = matter(fileBuffer.toString());

    const intro = new Intro(data.content);
    if (data.data.img) intro.setImg(data.data.img);
    if (data.data.imgText) intro.setImgText(data.data.imgText);
    if (data.data.link) intro.setLink(data.data.link);
    return intro;
  } catch (err) {
    return null;
  }
};

const getContent = async (state: State, folder: string): Promise<void> => {
  const basePath = path.resolve(folder);

  const intro = await getIntro(basePath);
  if (intro) state.setIntro(intro);
  state.addNews(await getNews(basePath));
};
export default getContent;
