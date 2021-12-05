const { Client, Message } = require("discord.js");
const { player } = require(".");

/**
 *
 * @param {Client} client
 * @param {Message} message
 */

module.exports = async (client) => {
    console.log(`Events Loaded`);
  // start
  player.on("trackStart", async (queue, track) => {
    queue.metadata.channel.send(`🎵 กำลังเล่น \`${track.title}\``);
  });

  // song added
  player.on("trackAdd", async (queue, track) => {
    queue.metadata.channel.send(`🎵 เพิ่มในรายการเพลง \`${track.title}\``);
  });
};