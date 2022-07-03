module.exports= {
    async execute(reaction, client) {
        const queue = await client.player.getQueue(reaction.message.guild);
        if (!queue) return;
        queue.back()
    }
}