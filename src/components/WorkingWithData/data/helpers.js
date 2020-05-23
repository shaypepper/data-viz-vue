const sw = require("stopword");
const {
  PorterStemmer,
  SentimentAnalyzer,
  WordTokenizer,
  SentenceTokenizer,
  Lexicon,
  RuleSet,
  BrillPOSTagger,
} = require("natural");

const stemmer = PorterStemmer;
const Analyzer = SentimentAnalyzer;
const analyzer = new Analyzer("English", stemmer, "afinn");

const wordTokenizer = new WordTokenizer();
const sentenceTokenizer = new SentenceTokenizer();

const lexicon = new Lexicon("EN", "N", "NNP");
const ruleSet = new RuleSet("EN");
const tagger = new BrillPOSTagger(lexicon, ruleSet);
const abbrList = [
  "Mr",
  "Dr",
  "Ms",
  "Mrs",
  "Lt",
  "Col",
  "Maj",
  "Gov",
  "Gen",
  "Sgt",
  "Adm",
  "Ds",
  "Rs",
  "Jr",
  "Inc",
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
  "Rev",
  "E.P.A",
  "U.S.A",
  "D.C",
  "No",
  "F.D.A",
  "U.S.A.A",
  "H.H.S",
  "F.B.I",
  "St",
  "Ave",
  "N.J",
  "N.Y",
  ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
  ...[
    "Ala",
    "Ariz",
    "Ark",
    "Calif",
    "Colo",
    "Conn",
    "Del",
    "Fla",
    "Ga",
    "H.I",
    "Ida",
    "Ill",
    "Ind",
    "Kan",
    "Ky",
    "L.a",
    "L.A",
    "Md",
    "Mass",
    "Mich",
    "Minn",
    "Miss",
    "Mo",
    "Mont",
    "Neb",
    "Nev",
    "N.H",
    "N.J",
    "N.M",
    "Okla",
    "Ore",
    "Penn",
    "Pa",
    "R.I",
    "S.C",
    "Dak",
    "Tenn",
    "Tex",
    "Vt",
    "Va",
    "Wash",
    "W.V.",
    "Wis",
    "Wyo",
  ],
];

class Sentence {
  constructor(sentence) {
    this.sentence = sentence.replace("*", ".");
    this.tokens = wordTokenizer.tokenize(sentence);
    this.sentiment = analyzer.getSentiment(this.tokens);
  }
}

class Counter {
  constructor(entries) {
    this.counts = {};
    this.totalCount = 0;

    if (entries) {
      this.addEntries(entries);
    }
  }
  addEntries(newEntries) {
    for (let key of newEntries) {
      if (this.counts[key]) {
        this.counts[key]++;
      } else {
        this.counts[key] = 1;
      }
      this.totalCount++;
    }
  }
  getTopCounts(n = 1) {
    const { counts } = this;
    return Object.keys(counts)
      .sort((a, b) => counts[b] - counts[a])
      .map((w) => [w, counts[w], counts[w] / this.totalCount])
      .slice(0, n);
  }

  getTopCountsObject(n = 1) {
    const counts = this.getTopCounts(n);
    const countsObject = {};
    counts.forEach((arr) => {
      countsObject[arr[0]] = arr.slice(1);
    });
    return countsObject;
  }
  addCounter(newCounter) {
    for (let key in newCounter.counts) {
      this.counts[key] = this.counts[key] || 0;
      this.counts[key] += newCounter.counts[key];
      this.totalCount += newCounter.counts[key];
    }
  }
}

class Article {
  constructor({
    body,
    url,
    timesTags,
    promotionalHeadline,
    section,
    slug = "",
  }) {
    this.headline = promotionalHeadline;
    this.url = url;
    this.section = section.displayName;
    this.body = this.compressBody(body);
    this.timesTags = this.mapTimesTags(timesTags);
    this.slug = slug;

    return this;
  }

  pretty() {
    const { headline, url, section, timesTags, slug } = this;
    return {
      headline,
      url,
      section,
      slug,
      timesTags,
      sentences: this.sentences,
    };
  }

  compressBody(body) {
    return body.content
      .filter((cBlock) => cBlock.content)
      .map((cBlock) => {
        return cBlock.content
          .filter((pBlock) => Object.keys(pBlock).length)
          .map((text) => {
            let t = text.text;
            abbrList.forEach((abbr) => {
              t = t.replace(new RegExp(`${abbr}\\.`, "g"), ` ${abbr}\*`);
            });
            return t;
          })
          .join(" ");
      })
      .join("\n");
  }

  mapTimesTags(timesTags) {
    return timesTags.map((t) => t && t.displayName);
  }

  get tokens() {
    let tokens = wordTokenizer.tokenize(this.body.toLowerCase());
    tokens = sw.removeStopwords(tokens);
    return tokens;
  }

  get sentences() {
    if (this._sentences) return this._sentences;
    this._sentences = sentenceTokenizer
      .tokenize(this.body)
      .map((s) => new Sentence(s));
    return this._sentences;
  }

  get stems() {}

  getPosTags(filterCallback = (d) => d, mapCallback = (d) => d.tag) {
    const tags = new Counter();
    for (let sentence of this.sentences) {
      const { taggedWords } = tagger.tag(sentence.tokens);

      tags.addEntries(taggedWords.filter(filterCallback).map(mapCallback));
    }
    return tags;
  }

  maxSentiment() {
    let maxSentiment = 0;
    let maxSentimentSentence = 0;
    for (let sentence of this.sentences) {
      const sentiment = analyzer.getSentiment(sentence.tokens);
      if (Math.abs(maxSentiment) < Math.abs(sentiment)) {
        maxSentiment = sentiment;
        maxSentimentSentence = sentence;
      }
    }
    return [maxSentiment, maxSentimentSentence.sentence];
  }

  getSentiment() {
    for (let sentence of this.sentences) {
      const sentiment = analyzer.getSentiment(sentence);
      console.log(sentiment);
    }
  }
}

class ArticleAnalyzer {
  constructor(article) {
    Object.assign(this, article);
    return this;
  }

  getPosTags(filterCallback = (d) => d, mapCallback = (d) => d.tag) {
    const tags = new Counter();
    for (let sentence of this.sentences) {
      const { taggedWords } = tagger.tag(sentence.tokens);
      const keys = taggedWords.filter(filterCallback).map(mapCallback);
      tags.addEntries(keys);
    }
    return tags;
  }

  maxSentiment() {
    let maxSentiment = 0;
    let maxSentimentSentence = 0;
    for (let sentence of this.sentences) {
      const sentiment = analyzer.getSentiment(sentence.tokens);
      if (Math.abs(maxSentiment) < Math.abs(sentiment)) {
        maxSentiment = sentiment;
        maxSentimentSentence = sentence;
      }
    }
    return [maxSentiment, maxSentimentSentence.sentence, this.url];
  }

  getSentiment() {
    for (let sentence of this.sentences) {
      const sentiment = analyzer.getSentiment(sentence);
      console.log(sentiment);
    }
  }
}

module.exports = {
  Article,
  Counter,
  ArticleAnalyzer,
};
