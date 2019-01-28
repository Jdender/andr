import { Service, Inject } from 'typedi';
import { Client, Message } from 'discord.js';
import { bind } from 'bind-decorator';
import { Effect } from './random';

@Effect()
export class EventTest {

    constructor(
        private client: Client,
    ) {
        client.on('ready', this.onReady);
        client.on('message', this.onMessage);
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
