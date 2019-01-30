import { Client, Message } from 'discord.js';
import { bind } from 'bind-decorator';
import { Effect } from '../random';

@Effect()
export class Ready {

    constructor(
        private client: Client,
    ) {
        client.on('ready', this.onReady);
    }

    @bind
    onReady() {

        console.log('Ready mate');
    }
}
