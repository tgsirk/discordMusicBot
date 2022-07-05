module.exports= {
    async execute(reaction, client) {
        const queue = await client.player.getQueue(reaction.message.guild);
        if (!queue) return;
        if (queue.tracks.length === 0) return;
        queue.skip()
    }
}