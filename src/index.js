const fs = require('node:fs');
const path = require('node:path');
const emojis = require('../emojis.js')
const { Client, Collection } = require('discord.js');
const { token } = require('../config.json');
const { Player } = require("discord-player")

const client = new Client({
    intents: ["GUILDS", "GUILD_VOICE_STATES", "GUILD_MESSAGE_REACTIONS"],
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],});
client.player = new Player(client, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25
    }
})
client.once('ready', c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.commands = new Collection();
const commandsPath = path.join(__dirname, '../commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file)
    const command = require(filePath)
    client.commands.set(command.data.name, command);
}

client.on('interactionCreate', async interaction => {
    console.log(`INTERACTION\t#USER:${interaction.user.tag}\t#CHANNEL:${interaction.channel.name}\t#TYPE:${interaction.type}`)
    if (!interaction.isCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    try {
        await command.execute(interaction, client);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

client.reactions = new Collection();
for(const item in emojis.data){
    const fileName = emojis.data[item]['jsFile'];
    const reaction = emojis.data[item]['emoji'];
    const interaction = require(`../reactions/${fileName}`)
    client.reactions.set(reaction, interaction);
}

client.on('messageReactionAdd', async (reaction, user) => {
    await listenReaction(reaction,user);
})
client.on('messageReactionRemove', async (reaction, user) => {
    await listenReaction(reaction,user);
})
client.login(token);

function listenReaction(reaction, user) {
    console.log(`${reaction.emoji.name} added by user: ${user.tag}`);
    if (user.tag === client.user.tag)  return;
    const emoji = client.reactions.get(reaction.emoji.name);
    if (!emoji) return;
    try {
        emoji.execute(reaction, client);
    } catch (error) {
        console.error(error);
    }
}
