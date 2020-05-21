# Explanatory project: Inspiration from The Upshot

This project had a mix of something called interactives, which are stories with custom html/css, as well as more traditional articles. The generic term for these is "work". So when I queried the NYT database, I queried for "anyWork". I manipulated the json into a few different files to decrease duplicate code as much as possible.

### Works

For the list of works, I used an object with the article URL as the key. The lists for `timesTags` and `credits` just use ids and there is another json file with that data.

```json
{
  "https://www.nytimes.com/2019/12/05/upshot/impeachment-biggest-issue-voters-poll.html": {
    "promotionalHeadline": "What Is Voters’ Highest Priority? There’s a Way to Find Out",
    "url": "https://www.nytimes.com/2019/12/05/upshot/impeachment-biggest-issue-voters-poll.html",
    "promotionalMedia": {
      "width": 640,
      "height": 640,
      "url": "https://static01.nyt.com/images/2019/12/03/upshot/up-vavreck1-1575504369739/up-vavreck1-1575504369739-square640.png",
      "name": "square640"
    },
    "timesTags": [
      "nyt://subject/ab2ce501-c350-5a1b-84b6-207da603c658",
      "nyt://subject/bd1ee2e7-9487-57ae-8a98-79a97a4f7416",
      "nyt://subject/6802f721-c0b7-5d51-900b-c87a450f58f7",
      "nyt://subject/5fddc6c6-cafa-5eee-bcba-c2e0b6e40ce7",
      "nyt://subject/aa87b919-5ba3-5f29-8b78-e3a88f443793"
    ],
    "credits": [
      "UGVyc29uOm55dDovL3BlcnNvbi82MWE0Y2ZhNC0wZTUzLTVlMmMtYmM3OC03YTg0MWQ2ODlmNDM=",
      "UGVyc29uOm55dDovL3BlcnNvbi9jODlhN2IzMS1hYTJjLTU1MTItYmU3YS02YTZjNmZiN2ExNWU=",
      "UGVyc29uOm55dDovL3BlcnNvbi81ZTY0NGRiYS02YzVkLTVlM2EtOTNlZS0xOWY4YWZlOWJhNWQ="
    ],
    "pub_date": "2019-12-05T00:00:00.000Z",
    "byline": "By Lynn Vavreck, John Sides and Chris Tausanovitch",
    "interactive": false,
    "data_viz": {
      "chart_types": ["scatter"],
      "color_use": ["categorical"],
      "interaction_types": ["hover"],
      "data": ["%"]
    },
    "first_of_type": true
  }
}
```

## Times Tags

```json
{
  "nyt://subject/ab2ce501-c350-5a1b-84b6-207da603c658": {
    "__typename": "Subject",
    "displayName": "Trump-Ukraine Whistle-Blower Complaint and Impeachment Inquiry",
    "promotionalMedia": null,
    "uri": "nyt://subject/ab2ce501-c350-5a1b-84b6-207da603c658",
    "works": [
      "https://www.nytimes.com/2019/12/05/upshot/impeachment-biggest-issue-voters-poll.html",
      "https://www.nytimes.com/2019/10/21/upshot/polls-impeachment-battlegrounds-Trump.html",
      "https://www.nytimes.com/2019/11/27/upshot/impeachment-facts-faq-thanksgiving.html",
      ...
    ]
  },
}
```

## Credits (journalists)

```json
{
   "UGVyc29uOm55dDovL3BlcnNvbi82MjM2NTY3My0zYjM0LTUwZTktODMyMi02OWM1NTMxODFjNGI=": {
    "id": "UGVyc29uOm55dDovL3BlcnNvbi82MjM2NTY3My0zYjM0LTUwZTktODMyMi02OWM1NTMxODFjNGI=",
    "displayName": "Nate Cohn",
    "bioUrl": "https://www.nytimes.com/by/nate-cohn",
    "promotionalMedia": {
      "width": 640,
      "height": 640,
      "url": "https://static01.nyt.com/images/2018/06/13/multimedia/author-nate-cohn/author-nate-cohn-square640.jpg",
      "name": "square640"
    },
    "works": [
      "https://www.nytimes.com/2019/10/21/upshot/polls-impeachment-battlegrounds-Trump.html",
      "https://www.nytimes.com/2019/08/07/upshot/trump-approval-rating-rise.html",
      ...
    ]
  }
}
```

## Others

There are also various json files to list works based on chart type, color use, and interaction types.
