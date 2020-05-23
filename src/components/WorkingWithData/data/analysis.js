const fs = require("fs");
const { ArticleAnalyzer, Counter } = require("./helpers");

const articles = {};

const concatFiles = new Promise(function (resolve, reject) {
  fs.readdir("./transformed_articles", (err, files) => {
    if (err) {
      reject(err);
    }
    let i = 0;
    for (let file of files) {
      let rawData = fs.readFileSync(`./transformed_articles/${file}`);
      let json = JSON.parse(rawData);
      json.forEach((a) => (articles[a.url] = a));
    }
    resolve();
  });
}).then(() => {
  writeVerbFiles();
  //   writeTrumpIsFiles();
  //   posAnalysis();
});

function onlyVerbs(d) {
  return d.tag[0] === "V";
}

function onlyNouns(d) {
  return d.tag[0] === "N";
}

function onlyAdjectives(d) {
  return d.tag[0] === "J";
}

function getToken(d) {
  return d.token.toLowerCase();
}

function getTag(d) {
  return d.tag;
}

function posAnalysis() {
  const posOpinionCounter = new Counter();
  const posCounter = new Counter();

  for (let url of Object.keys(articles)) {
    const article = new ArticleAnalyzer(articles[url]);
    const posTags = article.getPosTags(onlyVerbs, getPosTags);
    if (article.section === "Opinion") {
      posOpinionCounter.addCounter(posTags);
    } else {
      posCounter.addCounter(posTags);
    }
  }
  const oTop500 = posOpinionCounter.getTopCountsObject(50000);
  const rTop500 = posCounter.getTopCountsObject(50000);

  fs.writeFileSync("./opinion_verbs.json", JSON.stringify(oTop500, null, 2));
  fs.writeFileSync("./reporting_verbs.json", JSON.stringify(rTop500, null, 2));
}

function sentimentAnalysis() {
  const reportingSentiments = [];
  const opinionSentiments = [];
  for (let url of Object.keys(articles)) {
    const article = new ArticleAnalyzer(articles[url]);
    if (article.section === "Opinion") {
      opinionSentiments.push(article.maxSentiment());
    } else {
      reportingSentiments.push(article.maxSentiment());
    }
  }

  fs.writeFileSync(
    "./opinion_sentiment.json",
    JSON.stringify(opinionSentiments, null, 2)
  );
  fs.writeFileSync(
    "./reporting_sentiment.json",
    JSON.stringify(reportingSentiments, null, 2)
  );
}

function verbsByType(verbType, size = 10) {
  const posOpinionCounter = new Counter();
  const posCounter = new Counter();

  for (let url of Object.keys(articles)) {
    const article = new ArticleAnalyzer(articles[url]);
    const verbs = article.getPosTags(
      (d) => d.tag === verbType || (verbType === "all" && d.tag[0] === "V"),
      getToken
    );
    if (article.section === "Opinion") {
      posOpinionCounter.addCounter(verbs);
    } else {
      posCounter.addCounter(verbs);
    }
  }
  const oTop = posOpinionCounter.getTopCountsObject(size);
  const rTop = posCounter.getTopCountsObject(size);

  return { opinion: oTop, reporting: rTop };
}

function writeVerbFiles() {
  const verbTenses = {
    VB: "Base form",
    VBD: "Past tense",
    VBG: "Gerund or present participle",
    VBN: "Past participle",
    VBZ: "Non-3rd person singular present",
    VBP: "3rd person singular present",
    all: "Any verb",
  };
  const verbLists = {};
  Object.keys(verbTenses).forEach((tense) => {
    verbLists[tense] = {
      tag: tense,
      label: verbTenses[tense],
      ...verbsByType(tense, tense === "all" ? 100 : 10),
    };
  });

  fs.writeFileSync(`./verbs.json`, JSON.stringify(verbLists, null, 2));
}

function trumpIs(noun, verb) {
  const str = `${noun} ${verb}`;
  const re = new RegExp(str);
  const opinionList = [];
  const reportingList = [];

  for (let url of Object.keys(articles)) {
    const { section, headline, url, sentences } = new ArticleAnalyzer(
      articles[url]
    );
    for (let s of sentences) {
      const matchStatement = s.sentence.match(re);
      if (!matchStatement) continue;
      if (section === "Opinion") {
        opinionList.push([s.sentence, url, headline]);
      } else {
        reportingList.push([s.sentence, url, headline]);
      }
    }
  }
  console.log(
    `Opinion has ${opinionList.length} "${noun} ${verb}" statements"`
  );
  console.log(
    `Reporting has ${reportingList.length} "${noun} ${verb}" statements"`
  );

  const returnObject = { opinion: opinionList, reporting: reportingList };

  return returnObject;
}

function writeTrumpIsFiles() {
  const nouns = ["Trump", "[Pp]resident", "[Aa]dministration"];
  const verbs = ["was", "is", "has", "said"];
  const composite = {};

  for (let noun of nouns) {
    composite[noun] = {};
    for (let verb of verbs) {
      composite[noun][verb] = trumpIs(noun, verb);
    }
  }

  //   composite["all"] = trumpIs(
  //     "(Trump|[Pp]resident|[Aa]dministration)",
  //     "(was|is|has|said)"
  //   );

  fs.writeFileSync(`./statements.json`, JSON.stringify(composite, null, 2));
}
