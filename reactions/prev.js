module.exports= {
    async execute(reaction, client) {
        const queue = await client.player.getQueue(reaction.message.guild);
        if (!queue) return;
        if (queue.previousTracks.length === 1) return;
        queue.back()
    }
}