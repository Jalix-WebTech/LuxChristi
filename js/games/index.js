import catholicRiddles from "./catholic-riddles.js";
import bibleChallenge from "./bible-challenge.js";
import identifySaint from "./identify-saint.js";
import catholicSymbols from "./catholic-symbols.js";
import scriptureChallenge from "./scripture-challenge.js";
import matchSaintVirtue from "./match-saint-virtue.js";
import { gameCatalog } from "./catalog.js";

const gameRounds = {
  "catholic-riddles": catholicRiddles,
  "bible-challenge": bibleChallenge,
  "identify-saint": identifySaint,
  "catholic-symbols": catholicSymbols,
  "scripture-challenge": scriptureChallenge,
  "match-saint-virtue": matchSaintVirtue,
};

export const games = gameCatalog.map(game => ({ ...game, rounds: gameRounds[game.id] || [] }));
