const emojis = require("../emojis.js")
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { QueryType } = require("discord-player")

const row = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId('primary')
            .setLabel('Play')
            .setStyle('PRIMARY'),
    );


function getEmbed (info) {
    return new MessageEmbed()
        .setColor('#ff00ff')
        .setTitle(title)
        .setURL('https://discord.js.org/')
        .setAuthor({name: author.user, iconURL: "https://i.ytimg.com/vi/Iy-dJwHVX84/hqdefault.jpg", url: url})
        .setThumbnail('https://i.imgur.com/AfFp7pu.png')
        .addFields(
            {name: 'Regular field title', value: 'Some value here'},
            {name: '\u200B', value: '\u200B'},
            {name: 'Inline field title', value: 'Some value here', inline: true},
            {name: 'Inline field title', value: 'Some value here', inline: true},
        )
        .addField('Inline field title', 'Some value here', true)
        .setImage('https://i.imgur.com/AfFp7pu.png')
        .setTimestamp()
        .setFooter({text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png'})
}

function getActionRow() {

    let row = new MessageActionRow()

    let playPauseButton = new MessageButton()
        .setCustomId("playPauseButton")
        .setStyle("PRIMARY")
        .setLabel("\:play_pause:");

    let nextTrackButton = new MessageButton()
        .setCustomId("nextTrack")
        .setStyle("SUCCESS")
        .setLabel('\:track_next:');

    let prevTrackButton = new MessageButton()
        .setCustomId("previousTrack")
        .setStyle("SUCCESS")
        .setLabel("\:track_previous:");

    return row.addComponents(playPauseButton,prevTrackButton,nextTrackButton)

}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('yt')
        .setDescription('play music form youtube!')
        .addStringOption(option =>
        option.setName('url').setRequired(true).setDescription('link to youtube video')),


    async execute(interaction, client) {

        if(!interaction.member.voice.channel) return interaction.reply({content: `you're not in VC`})


        const ytUrl = interaction.options.getString('url').toString()
        const result = await client.player.search(ytUrl, {
            requestedBy: interaction.user,
            searchEngine: QueryType.YOUTUBE_VIDEO
        })
        if (result.tracks.length === 0) {
            return interaction.reply("No results")
        }

        const queue = await client.player.createQueue(interaction.guild);

        const song = result.tracks[0]
        await queue.addTrack(song)

        let embed = new MessageEmbed()
        embed.setDescription(`**[${song.title}](${song.url})** has been added to the Queue`)
            .setColor("#ff0099")
            .setThumbnail(song.thumbnail)
            .setFooter({ text: `Duration: ${song.duration}`})

        if (!queue.connection) await queue.connect(interaction.member.voice.channel)
        if (!queue.playing) await queue.play()
        const message = await interaction.reply({embeds: [embed], fetchReply: true});
        message.react(emojis.data.PLAY_STOP_EMOJI.emoji)
        message.react(emojis.data.PREV_TRACK_EMOJI.emoji)
        message.react(emojis.data.NEXT_TRACK_EMOJI.emoji)
        message.react(emojis.data.STOP_BOT_EMOJI.emoji)
        message.react(emojis.data.QUEUE_LIST_EMOJI.emoji)

    }
};