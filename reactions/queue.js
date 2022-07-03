const embedHelper = require('../src/embed-helper')
module.exports = {
    async execute(reaction, client) {
        const channel = client.channels.cache.get(reaction.message.channelId);
        channel.send(
            embedHelper.throwOnChat(
                client.player.getQueue(reaction.message.guild)
            )
        )
    }


}