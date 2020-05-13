// - for none
// c - categorical - blue
// d - diverging - yellow
// h - highlight - dot
// q - sequentional - red

export const colorUseWaffle = {
  name: "colorUse",
  pattern: [
    "q q q q q q q q q q dq d",
    "c c c c c c c c c c d d",
    "c c c c c c c c c c cd d",
    "- c c c c c c c c c cd d",
    "- - - h h h h h h h cdh d",
    "- - - - - - - - - - - -",
    "- - - - - - - - - - - -",
    "- - - - - - - - - - -",
  ],
};

export const colorUsePaths = [
  {
    path: "M2.5,2.5 m0,15 v30 h15 v15 h135 v15 h15 v-45 h-15 v-15 Z",
    type: "colorUse",
    name: "categorical",
  },
  {
    path: "M 2.5,2.5 m150,0 h30 v75 h-30 Z",
    type: "colorUse",
    name: "diverging",
  },
  {
    path: "M 2.5,2.5 m45,60 v15 h120 v-15 Z",
    type: "colorUse",
    name: "highlight",
  },
  {
    path: "M 2.5,2.5 v15 h165 v-15 Z",
    type: "colorUse",
    name: "sequential",
  },
];
export const chartTypeWaffle = {
  name: "chartType",
  pattern: [
    "n n n n n n n n n n s s",
    "n n b b b b bs s s s s s",
    "n n b b b b bs s s s s s",
    "n n b b b bl bls ls ls ls ls ls",
    "n n b b b bl bl l l l l l",
    "n n b b b bl bl l l l l l",
    "n n b b b bl bl l l l l l",
    "n n b b b bl bl l l l l",
  ],
};

export const chartTypePaths = [
  {
    path: "M2.5,2.5 m30,15 h75 v105 h-75 Z",
    type: "chartType",
    name: "bar",
  },
  {
    path: "M2.5,2.5 m90,15 h60 v-15 h30 v60 h-90 Z",
    type: "chartType",
    name: "scatter",
  },
  {
    path: "M2.5 2.5 m75,45 h105 v60 h-15 v15 h-90 Z",
    type: "chartType",
    name: "line",
  },
  {
    path: "M2.5 2.5 h150 v15 h-120 v105 h-30 Z",
    type: "chartType",
    name: "other",
  },
];

// hv - hover - blue
// f - filter - yellow
// qz - quiz - red
export const interactionTypeWaffle = {
  name: "interactionType",
  pattern: [
    "hv hv hv hv hv hv hv hv hv hv hv hv",
    "hv hv hv hv hv hv hv hv hv hv hv hv",
    "hv hv hv hv hvf hvf f f f qz qz qz",
    "* * * * * * * * * * * qz",
    "* * * * * * * * * * * *",
    "* * * * * * * * * * * *",
    "* * * * * * * * * * * *",
    "* * * * * * * * * * *",
  ],
};

export const interactionTypePaths = [
  {
    path: "M2.5,2.5 h180 v30 h-90 v15 h-90 Z",
    type: "interactionType",
    name: "hover",
  },
  {
    path: "M2.5,2.5 m60,30 v15 h75 v-15 Z",
    type: "interactionType",
    name: "filter",
  },
  {
    path: "M2.5,2.5 m135,30 v15 h45 v-15 Z",
    type: "interactionType",
    name: "quiz",
  },
];

export const highlightBoxPaths = [
  ...interactionTypePaths,
  ...colorUsePaths,
  ...chartTypePaths,
];

export function getChartTypesKey(chart_types) {
  let chartTypesKey = "";

  if (chart_types.includes("bar")) chartTypesKey += "b";
  if (chart_types.includes("line")) chartTypesKey += "l";
  if (chart_types.includes("scatter")) chartTypesKey += "s";
  chartTypesKey = chartTypesKey || "n";
  return chartTypesKey;
}

export function getColorUseKey(color_use) {
  let colorUseKey = "";
  if (color_use) {
    if (color_use.includes("categorical")) colorUseKey += "c";
    if (color_use.includes("diverging")) colorUseKey += "d";
    if (color_use.includes("highlight")) colorUseKey += "h";
    if (color_use.includes("sequential")) colorUseKey += "q";
  }
  colorUseKey = colorUseKey || "-";
  return colorUseKey;
}

export function getInteractionTypesKey(interaction_types) {
  let interactionTypesKey = "";
  if (interaction_types) {
    if (interaction_types.includes("hover")) interactionTypesKey += "hv";
    if (interaction_types.includes("filter")) interactionTypesKey += "f";
    if (interaction_types.includes("quiz")) interactionTypesKey += "qz";
  }
  interactionTypesKey = interactionTypesKey || "*";
  return interactionTypesKey;
}

export const cardState = [
  { currentWaffle: chartTypeWaffle, highlightBox: null },
  { currentWaffle: chartTypeWaffle, highlightBox: null },
  { currentWaffle: chartTypeWaffle, highlightBox: null },
  { currentWaffle: chartTypeWaffle, highlightBox: "bar" },
  { currentWaffle: chartTypeWaffle, highlightBox: "line" },
  { currentWaffle: chartTypeWaffle, highlightBox: "scatter" },
  { currentWaffle: chartTypeWaffle, highlightBox: null },
  { currentWaffle: colorUseWaffle, highlightBox: null },
  { currentWaffle: colorUseWaffle, highlightBox: "categorical" },
  { currentWaffle: colorUseWaffle, highlightBox: "diverging" },
  { currentWaffle: colorUseWaffle, highlightBox: "highlight" },
  { currentWaffle: colorUseWaffle, highlightBox: "sequential" },
  { currentWaffle: colorUseWaffle, highlightBox: null },
  { currentWaffle: interactionTypeWaffle, highlightBox: null },
  { currentWaffle: interactionTypeWaffle, highlightBox: "hover" },
  { currentWaffle: interactionTypeWaffle, highlightBox: "quiz" },
  { currentWaffle: interactionTypeWaffle, highlightBox: "filter" },
  { currentWaffle: interactionTypeWaffle, highlightBox: null },
];
