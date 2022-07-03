const {MessageEmbed} = require("discord.js");

module.exports = {
        throwOnChat(queue) {
        const song = queue.previousTracks.at(-1);
        let embed = new MessageEmbed();
        embed.setDescription(`**[${song.title}](${song.url})** has been added to the Queue`)
            .setColor("#ff0099")
            .setThumbnail(song.thumbnail);
        if(queue.tracks.length !== 0) {
            let queueList = "";
            for(const track in queue.tracks){
                queueList += `${track['title']} | ${track['duration']} \n`;
            }
            embed.addField(
                { name: "In Queue",
                    value: queueList}
            )
        }
        return embed
    }
}