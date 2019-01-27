import { Service, Inject } from 'typedi';
import { Client, Message } from 'discord.js';
import { bind } from 'bind-decorator';
import { effectToken } from './random';

console.log('Effect test module');

@Service({ id: effectToken, multiple: true })
export class EventTest {

    constructor(
        @Inject() private client: Client,
    ) {
        console.log('Client', client);
        client.on('ready', this.onReady);
        client.on('message', this.onMessage);
        console.log('After construtor');
    }

    @bind
    onReady() {

        console.log('Ready mate');
    }

    @bind
    onMessage(message: Message) {

        if (!message.content.startsWith('`ping')) return;

        message.channel.send('Pong');
    }
}
