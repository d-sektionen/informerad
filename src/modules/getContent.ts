import * as fs from "fs";
import * as path from "path";
import * as matter from "gray-matter";

const getNews = basePath =>
  new Promise(resolve => {
    const newsFolderPath = path.join(basePath, "news");
    const news = fs.readdirSync(newsFolderPath).map(file => {
      const data = matter(
        fs.readFileSync(path.join(newsFolderPath, file)).toString()
      );
      return {
        ...data.data,
        description: data.content
      };
    });

    resolve({ news });
  });

const getIntro = basePath =>
  new Promise(resolve => {
    try {
      const data = matter(
        fs.readFileSync(path.join(basePath, `intro.md`)).toString()
      );
      resolve({
        intro: {
          ...data.data,
          text: data.content
        }
      });
    } catch (err) {
      resolve({
        intro: null
      });
    }
  });

const getContent = (state, folder) =>
  new Promise((resolve, reject) => {
    const basePath = path.resolve(folder);

    const oldData = Object.prototype.hasOwnProperty.call(state, "data")
      ? { ...state.data }
      : {};

    // array of promises for async data fetching
    const promiseData = [getNews(basePath), getIntro(basePath)];

    Promise.all(promiseData)
      .then(values => {
        resolve({ ...state, data: Object.assign(oldData, ...values) });
      })
      .catch(reject);
  });

export default getContent;
