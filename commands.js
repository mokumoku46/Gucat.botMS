const { Client, Message } = require("discord.js");
const { player } = require(".");

/**
 *
 * @param {Client} client
 * @param {Message} message
 * @param {String[]} args
 */
module.exports = async (client, message, cmd, args) => {
  if (cmd === "ping") {
    message.reply(`Ping :- ${client.ws.ping}`);
  } else if (cmd === "play") {
    let voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.reply(`คุณต้องอยู่ในห้องก่อนนะ`);

    let search_Song = args.join(" ");
    if (!search_Song) return message.reply(`ใส่ ชื่อเพลง หรือ ลิงค์`);

    let queue = player.createQueue(message.guild.id, {
      metadata: {
        channel: message.channel,
      },
    });

    
    try {
      if (!queue.connection) await queue.connect(voiceChannel);
    } catch {
      queue.destroy();
      return await message.reply({
        content: "ไม่สามารถเข้าร่วมห้องของคุณได้",
        ephemeral: true,
      });
    }

    let song = await player
      .search(search_Song, {
        requestedBy: message.author,
      })
      .then((x) => x.tracks[0]);

    if (!song) return message.reply(` ฉันไม่สามารถเปิด \`${search_Song}\` `);

    queue.play(song);

    message.channel.send({ content: `⏱️ | กำลังเปิด **${song.title}**!` });
  } else if (cmd === "skip") {
    let queue = player.getQueue(message.guild.id);
    queue.skip();
    message.channel.send(`ข้ามเพลงเรียบร้อย`);
  } else if (cmd === "stop") {
    let queue = player.getQueue(message.guild.id);
    queue.stop();
    message.channel.send(`หยุดการเล่นเพลง`);
  } else if (cmd === "loop") {
    let queue = player.getQueue(message.guild.id);
    queue.setRepeatMode(queue);
    message.channel.send(`เปิดการวนเพลง`);
  } else if (cmd === "pause") {
    let queue = player.getQueue(message.guild.id);
    queue.setPaused(true);
    message.channel.send(`หยุดเพลงชั่วคราว`);
  } else if (cmd === "resume") {
    let queue = player.getQueue(message.guild.id);
    queue.setPaused(false);
    message.channel.send(`เล่นเพลงต่อดีกว่า`);
  } else if (cmd === "volume") {
    let queue = player.getQueue(message.guild.id);
    let amount = parseInt(args[0]);
    queue.setVolume(amount);
    message.channel.send(`ตั่งค่าเสียงไว้ที่ \`${amount}\``);
  } else if (cmd === 'help') {
    message.channel.send('สั่งการโดยใช้เครื่องหมาย --')
    message.channel.send('มี play, stop, skip, loop');
    
    
  }
};