const https = require("https");
const fs = require("fs");
const zl = require("zlib");
const { fullQuery, headers } = require("./queries.js");
const { Article } = require("./helpers");

const data = {};
const BATCH_SIZE = 25;

for (let i = 1; i <= 12; i++) {
  data[i] = require(`./raw_article_data/2019-${i > 9 ? "" : "0"}${i}.json`);
}

async function getData() {
  console.log("".padStart(100, "-"));
  for (let j = 1; j <= 12; j++) {
    const file = data[j];
    const articles = file.response.docs;
    for (let i = 0; i < articles.length; i += BATCH_SIZE) {
      const urls = articles.slice(i, i + BATCH_SIZE).map((d) => d.web_url);
      const batch = await new Promise(makeRequest(urls));
      fs.writeFileSync(
        `./transformed_articles/batch_${j}_${i + 1}.json`,
        JSON.stringify(batch, null, 2)
      );
    }
  }
}

function makeRequest(anyWorks) {
  return function(resolve) {
    const querystring = JSON.stringify({
      query: fullQuery,
      operationName: "getTimesTags",
      variables: { urls: anyWorks },
    });

    const req = https.request(
      "https://samizdat-graphql.nytimes.com/graphql/v2",
      {
        method: "POST",
        headers,
      },
      (res) => {
        console.log(`statusCode: ${res.statusCode} ${res.statusMessage}`);
        if (res.statusCode !== 200) return resolve();
        let chunks = [];
        res.on("data", (buffer) => chunks.push(buffer));

        res.on("end", () => {
          console.log("end", chunks.length);
          zl.gunzip(Buffer.concat(chunks), (err, buf) => {
            let { data } = JSON.parse(buf);
            const articles = data.anyWorks.map((w) => new Article(w).pretty());

            resolve(articles);
          });
        });
      }
    );

    req.write(querystring);

    req.on("error", (e) => {
      console.error(e);
    });
    req.end();
  };
}

getData();
