import catholic_riddles from "./catholic-riddles.js";
import bible_challenge from "./bible-challenge.js";
import identify_saint from "./identify-saint.js";
import catholic_symbols from "./catholic-symbols.js";
import scripture_challenge from "./scripture-challenge.js";
import match_saint_virtue from "./match-saint-virtue.js";

export const games = [
  { id: "catholic-riddles", title: "Catholic Riddles", description: "Solve short riddles about Catholic prayer and worship.", icon: "✦", rounds: catholic_riddles },
  { id: "bible-challenge", title: "Bible Challenge", description: "Test your recall of people and events in Scripture.", icon: "▤", rounds: bible_challenge },
  { id: "identify-saint", title: "Identify Saint", description: "Recognise saints through clues about their lives.", icon: "✧", rounds: identify_saint },
  { id: "catholic-symbols", title: "Catholic Symbols", description: "Explore the meaning of familiar Christian symbols.", icon: "◇", rounds: catholic_symbols },
  { id: "scripture-challenge", title: "Scripture Challenge", description: "Complete familiar Scripture phrases and references.", icon: "§", rounds: scripture_challenge },
  { id: "match-saint-virtue", title: "Match Saint Virtue", description: "Connect Christian virtues with everyday choices.", icon: "♡", rounds: match_saint_virtue },
 ];
