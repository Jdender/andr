import { Client } from 'discord.js';

const client = new Client();

client.on('ready', () => {
    console.log('Ready mate')
});

client.on('message', message => {

    if (!message.content.startsWith('`ping')) return;

    message.channel.send('Pong')
});

client.login(process.env.DISCORD_TOKEN);
