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

export const templatesPath = path.resolve(__dirname, "../templates");

const applyMustache = (template, templateBody, data) =>
  new Promise(resolve => {
    const view = { ...data, md: () => (text, r) => md.render(r(text)) };
    const html = template;
    const newHtml = mustache.render(html, view, { body: templateBody });
    resolve(newHtml);
  });

const applyInky = htmlString =>
  new Promise(resolve => {
    const i = new Inky({});
    const newHtml = cheerio.load(htmlString, { decodeEntities: false });
    resolve(i.releaseTheKraken(newHtml, { decodeEntities: true }));
  });

const getCssFromScss = scssPath => {
  const scss = sass.renderSync({
    file: scssPath,
    includePaths: ["node_modules/foundation-emails/scss"]
  });
  return scss.css.toString("utf8");
};

const applyUncss = (htmlString, cssString) =>
  new Promise((resolve, reject) => {
    uncss(htmlString, { raw: cssString }, (error, output) => {
      if (error) reject(error);
      resolve({ htmlString, cssString: output });
    });
  });

const applyInliner = (htmlString, cssString) =>
  new Promise((resolve, reject) => {
    const mqCss = siphon(cssString);

    inlineCss(htmlString, {
      extraCss: cssString,
      url: " ",
      applyStyleTags: false,
      removeStyleTags: true,
      preserveMediaQueries: true,
      removeLinkTags: false
    })
      .then(html => {
        const newHtml = html.replace(
          "<!-- <style> -->",
          `<style>${mqCss}</style>`
        );
        resolve(newHtml);
      })
      .catch(reject);
  });

const applyMinifier = htmlString =>
  new Promise(resolve => {
    resolve(
      htmlMinifier(htmlString, {
        collapseWhitespace: true,
        minifyCSS: true
      })
    );
  });

async function htmlCreator(state, type) {
  let template = await fs.readFile(
    path.join(templatesPath, "pages", `${type}.html`)
  );
  template = template.toString();
  let layout = await fs.readFile(path.join(templatesPath, "layout.html"));
  layout = layout.toString();

  return applyMustache(layout, template, {
    subject: state.title,
    ...state.data,
    strings: state.strings
  })
    .then(htmlString => applyInky(htmlString))
    .then(htmlString =>
      applyUncss(
        htmlString,
        getCssFromScss(path.join(templatesPath, "scss", "app.scss"))
      )
    )
    .then(({ htmlString, cssString }) => applyInliner(htmlString, cssString))
    .then(htmlString => applyMinifier(htmlString))
    .then(htmlString => Promise.resolve({ ...state, html: htmlString }));
}

export default htmlCreator;
