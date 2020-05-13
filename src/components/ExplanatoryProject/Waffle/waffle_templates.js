// - for none
// c - categorical - blue
// d - diverging - yellow
// h - highlight - dot
// q - sequentional - red

export const colorUseWaffle = [
  "q q q q q q q q q q dq d",
  "c c c c c c c c c c d d",
  "c c c c c c c c c c cd d",
  "- c c c c c c c c c cd d",
  "- - - h h h h h h h cdh d",
  "- - - - - - - - - - - -",
  "- - - - - - - - - - - -",
  "- - - - - - - - - - -",
];

export const colorTypePaths = {
  categorical: {
    boxPath: "M2.5,2.5 m0,15 v30 h15 v15 h135 v15 h15 v-45 h-15 v-15 Z",
  },
  diverging: { boxPath: "M 2.5,2.5 m150,0 h30 v75 h-30 Z" },
  highlight: { boxPath: "M 2.5,2.5 m45,60 v15 h120 v-15 Z" },
  sequential: { boxPath: "M 2.5,2.5 v15 h165 v-15 Z" },
};

export const chartTypeWaffle = [
  "n n n n n n n n n n s s",
  "n n b b b b bs s s s s s",
  "n n b b b b bs s s s s s",
  "n n b b b bl bls ls ls ls ls ls",
  "n n b b b bl bl l l l l l",
  "n n b b b bl bl l l l l l",
  "n n b b b bl bl l l l l l",
  "n n b b b bl bl l l l l",
];

export const chartTypePaths = {
  bar: {
    boxPath: "M2.5,2.5 m30,15 h75 v105 h-75 Z",
  },
  scatter: {
    boxPath: "M2.5,2.5 m90,15 h60 v-15 h30 v60 h-90 Z",
  },
  line: {
    boxPath: "M2.5 2.5 m75,45 h105 v60 h-15 v15 h-90 Z",
  },
  other: {
    boxPath: "M2.5 2.5 h150 v15 h-120 v105 h-30 Z",
  },
};

// hv - hover - blue
// f - filter - yellow
// qz - quiz - red
export const interactionTypeWaffe = [
  "hv hv hv hv hv hv hv hv hv hv hv hv",
  "hv hv hv hv hv hv hv hv hv hv hv hv",
  "hv hv hv hv hvf hvf f f f qz qz qz",
  "* * * * * * * * * * *qz",
  "* * * * * * * * * * * *",
  "* * * * * * * * * * * *",
  "* * * * * * * * * * * *",
  "* * * * * * * * * * *",
];

export const interactionTypePaths = {
  hover: {
    boxPath: "M2.5,2.5 h180 v30 h-90 v15 h-90 Z",
  },
  filter: {
    boxPath: "M2.5,2.5 m60,30 v15 h75 v-15 Z",
  },
  quiz: {
    boxPath: "M2.5,2.5 m135,30 v15 h45 v-15 Z",
  },
};
