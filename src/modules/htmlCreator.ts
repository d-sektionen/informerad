const mustache = require("mustache");
const { Inky } = require("inky");
const cheerio = require("cheerio");
const sass = require("node-sass");
const uncss = require("uncss");
const siphon = require("siphon-media-query");
const inlineCss = require("inline-css");
const htmlMinifier = require("html-minifier").minify;
const md = require("markdown-it")({ linkify: true });
import * as path from "path";
import * as fs from "fs-extra";
import State from "../utils/state";

export const templatesPath = path.resolve(__dirname, "../templates");

const applyMustache = async (
  template: string,
  templateBody: string,
  data: object
): Promise<string> => {
  const view = {
    ...data,
    md: () => (text: string, r: (text: string) => string) => md.render(r(text)),
  };
  const html = template;
  const newHtml = mustache.render(html, view, { body: templateBody });
  return newHtml;
};

const applyInky = (htmlString: string): string => {
  const i = new Inky({});
  const newHtml = cheerio.load(htmlString, { decodeEntities: false });
  return i.releaseTheKraken(newHtml, { decodeEntities: true });
};

const getCssFromScss = (scssPath: string) => {
  const scss = sass.renderSync({
    file: scssPath,
    includePaths: ["node_modules/foundation-emails/scss"],
  });
  return scss.css.toString("utf8");
};

const applyUncss = async (
  htmlString: string,
  cssString: string
): Promise<{ htmlString: string; cssString: string }> =>
  new Promise((resolve, reject) => {
    uncss(htmlString, { raw: cssString }, (error: Error, output: string) => {
      if (error) reject(error);
      resolve({ htmlString, cssString: output });
    });
  });

const applyInliner = async (
  htmlString: string,
  cssString: string
): Promise<string> => {
  const mqCss = siphon(cssString);

  const html = await inlineCss(htmlString, {
    extraCss: cssString,
    url: " ",
    applyStyleTags: false,
    removeStyleTags: true,
    preserveMediaQueries: true,
    removeLinkTags: false,
  });

  const newHtml = html.replace("<!-- <style> -->", `<style>${mqCss}</style>`);
  return newHtml;
};

const applyMinifier = (htmlString: string): string =>
  htmlMinifier(htmlString, {
    collapseWhitespace: true,
    minifyCSS: true,
  });

async function htmlCreator(state: State, type: string): Promise<void> {
  const template = await fs.readFile(
    path.join(templatesPath, "pages", `${type}.html`)
  );
  const templateString = template.toString();
  const layout = await fs.readFile(path.join(templatesPath, "layout.html"));
  const layoutString = layout.toString();

  let htmlString = await applyMustache(layoutString, templateString, {
    subject: state.title,
    ...state.data,
    strings: state.strings,
  });
  htmlString = applyInky(htmlString);
  let cssString;
  ({ htmlString, cssString } = await applyUncss(
    htmlString,
    getCssFromScss(path.join(templatesPath, "scss", "app.scss"))
  ));
  htmlString = await applyInliner(htmlString, cssString);
  htmlString = applyMinifier(htmlString);
  state.html = htmlString;
  // return applyMustache(layoutString, templateString, {
  //   subject: state.title,
  //   ...state.data,
  //   strings: state.strings,
  // })
  //   .then((htmlString) => applyInky(htmlString))
  //   .then((htmlString) =>
  //     applyUncss(
  //       htmlString,
  //       getCssFromScss(path.join(templatesPath, "scss", "app.scss"))
  //     )
  //   )
  //   .then(({ htmlString, cssString }) => applyInliner(htmlString, cssString))
  //   .then((htmlString) => applyMinifier(htmlString))
  //   .then((htmlString) => Promise.resolve({ ...state, html: htmlString }));
}

export default htmlCreator;
