const fs = require("fs");
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

const config = JSON.parse(fs.readFileSync("./config/config.json", "utf-8"));

async function getRobloxStats() {
  try {
    const { placeId } = config;

    // Ambil data utama game
    const res = await fetch(`https://games.roblox.com/v1/games?universeIds=${placeId}`);
    const data = await res.json();
    const game = data.data[0];

    // Ambil icon
    const iconRes = await fetch(`https://thumbnails.roblox.com/v1/games/icons?universeIds=${placeId}&size=512x512&format=Png&isCircular=false`);
    const iconData = await iconRes.json();
    const icon = iconData.data && iconData.data.length ? iconData.data[0].imageUrl : null;

    // Ambil data vote
    const voteRes = await fetch(`https://games.roblox.com/v1/games/votes?universeIds=${placeId}`);
    const voteData = await voteRes.json();
    const votes = voteData.data[0] || { upVotes: 0, downVotes: 0 };

    return {
      name: game.name,
      description: game.description || "Tidak ada deskripsi.",
      creator: game.creator.name,
      genre: game.genre,
      playing: game.playing,
      visits: game.visits,
      favorites: game.favoritedCount,
      updated: game.updated,
      created: game.created,
      like: votes.upVotes,
      dislike: votes.downVotes,
      icon,
      id: game.id
    };
  } catch (err) {
    console.error("❌ Gagal mengambil data Roblox:", err);
    return null;
  }
}

module.exports = { getRobloxStats };
