import { Client, Message } from 'discord.js';
import { bind } from 'bind-decorator';
import { Effect } from '../random';
import { Registry } from '../Registry';

@Effect()
export class VoiceTest {

    constructor(
        client: Client,
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
    }

    @bind
    async join(message: Message) {

        const channel = message.member.voice.channel;
        if (!channel) return message.channel.send('I can\'t find the voice channel you\'re in, check if you\'re in one.');
        
        const connection = await channel.join();

        return message.channel.send('I joined your voice channel.');
    }

    @bind
    async leave(message: Message) {

        const channel = message.guild.me.voice.channel;
        if (!channel) return message.channel.send('I\'m not in a voice channel though.');

        channel.leave();

        return message.channel.send('There, I left.');
    }
}
