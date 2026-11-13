import { players } from "../data/playerData.js";

/** Local MVP adapter for the winner catalogue; replace its source with an API later. */
export async function getTopWinners() {
  return players.map(player => ({ ...player, dataStatus: "demonstration" }));
}
