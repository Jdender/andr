import { Client, Message } from 'discord.js';
import { bind } from 'bind-decorator';
import { Effect } from '../random';
import { Registry } from '../Registry';

@Effect()
export class VoiceTest {

    constructor(
        private client: Client,
        registry: Registry,
    ) {
        registry.addCommand({
            id: 'join',
            triggers: ['join'],
            description: 'Test if I can join a voice channel.',
            usage: 'join',
            execute: this.join,
        });

        registry.addCommand({
            id: 'leave',
            triggers: ['leave'],
            description: 'Test if I can leave a voice channel.',
            usage: 'leave',
            execute: this.leave,
        });

        registry.addCommand({
            id: 'source',
            triggers: ['source'],
            description: 'Brodcast a channel to everyone else.',
            usage: 'source',
            execute: this.source,
        });

        this.brodcast.on('subscribe', () => console.log('Subscribed to brodcast'))
        this.brodcast.on('unsubscribe', () => console.log('Unsubscribed to brodcast'))
    }

    private brodcast = this.client.createVoiceBroadcast();

    @bind
    async source(message: Message) {

        // Find the voice channel the member is in
        const channel = message.member.voice.channel;
        if (!channel) return message.channel.send('I can\'t find the voice channel you\'re in, check if you\'re in one.');

        const connection = await channel.join();

        const receiver = connection.receiver;

        await message.channel.send('I\'ve set up an receiver and I\'m ready to brodcast.');

        connection.on('speaking', (user, speaking) => {

            if (!speaking) return;

            const stream = receiver.createStream(user);

            this.brodcast.play(stream);         
        });
    }

    @bind
    async join(message: Message) {

        // Find the voice channel the member is in
        const channel = message.member.voice.channel;
        if (!channel) return message.channel.send('I can\'t find the voice channel you\'re in, check if you\'re in one.');
        
        const connection = await channel.join();

        connection.play(this.brodcast);

        return message.channel.send('I joined your voice channel.');
    }

    @bind
    async leave(message: Message) {

        // Find the voice channel the bot is in
        const channel = message.guild.me.voice.channel;
        if (!channel) return message.channel.send('I\'m not in a voice channel though.');

        await channel.leave();

        return message.channel.send('There, I left.');
    }
}
