const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const fs = require("fs");
const siteUrl =
  "https://search-proquest-com.i.ezproxy.nypl.org/docview/432977331/fulltext/10B82668E449462EPQ/403?accountid=35635";
const loginUrl =
  "https://login.i.ezproxy.nypl.org/login?qurl=https://search.proquest.com%2fadvanced";

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function captureArticle(page) {
  await page.waitForSelector("#fullTextZone");
  await page.waitForSelector("#copyRightDiv");

  await page.hover("#copyRightDiv");
  const dateFromText = await page.$eval("#copyRightDiv", el => {
    return el.innerText.replace("Copyright New York Times Company ", "");
  });

  const date = new Date(dateFromText);
  const dateString = `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date
    .getDate()
    .toString()
    .padStart(2, "0")}`;
  console.log(dateString);

  var currentMonth = dateString.split(" ")[0];

  const smushedStrings = await page.$$eval("#fullTextZone", els => {
    return els
      .map(el => {
        return (el.innerText || "")
          .replace(
            new RegExp(
              "(Jan|Feb|March|April|May|June|July|Aug|Sept|Oct|Nov|Dec).{0,1}",
              "g"
            ),
            match => `\n${match.replace(".", "").slice(0, 3)} `
          )
          .replace("\n\nPhotograph\n", "")
          .replace(new RegExp("Word count: [0-9]*"), "");
      })
      .join("");
  });

  const titleString = await page.$eval("#documentTitle", el => {
    return el.innerText.replace("EVENING HOURS; ", "");
  });

  fs.writeFile(
    `articles/${dateString}`,
    `${dateString}\n${titleString}\n${smushedStrings}`,
    () => {}
  );

  const nextLink = await page.$("#nextLink");
  if (nextLink) await page.click("#nextLink");
  return nextLink;
}

async function logIn() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null
    // devtools: true
  });
  let page = await browser.newPage();
  //   await page.setViewport({ width: 1200, height: 720 });
  await page.goto(loginUrl, { waitUntil: "networkidle0" }); // wait until page load
  console.log("in page");
  await page.type("[name=user]", "23333093886149");
  console.log("found input");
  await page.type("[name=pass]", "1742");
  // click and wait for navigation
  await Promise.all([
    page.click("[type=submit]"),
    page.waitForNavigation({ waitUntil: "networkidle0" })
  ]);
  await page.$eval(
    "[name=queryTermField]",
    el => (el.value = "Bill Cunningham")
  );
  await page.$eval(
    "[name=fieldsSelect] > [value=au]",
    el => (el.selected = "true")
  );
  await page.$eval(
    "[name=queryTermField_0]",
    el => (el.value = '"Evening Hours"')
  );
  await page.$eval(
    "[name=fieldsSelect_0] > [value=noft]",
    el => (el.selected = "true")
  );
  await page.$eval("[value=RANGE]", el => (el.selected = "true"));
  await page.$eval("#year2", el => (el.value = "2014"));
  await page.$eval(`[value=AUGUST]`, el => (el.selected = "true"));

  await Promise.all([
    page.click("#searchToResultPage"),
    page.waitForNavigation({ waitUntil: "networkidle0" })
  ]);

  await page.click("#filter");
  await page.waitForSelector("#addFlashPageParameterformat_fulltext");
  await page.click("#addFlashPageParameterformat_fulltext");

  let currentArticle = await captureArticle(page);

  while (currentArticle) {
    await timeout(Math.random() * 5000 + 10000);
    currentArticle = await captureArticle(page);
  }
}

logIn();

// \n[A-Za-z]{3} [A-Za-z]+
// \n[^Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|\n]
// \n+[^A-Z\n]
