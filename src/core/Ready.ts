import { Client, Message } from 'discord.js';
import { Effect } from '../random';

@Effect()
export class Ready {

    constructor(
        private client: Client,
    ) {
        client.on('ready', this.onReady);
    }

    onReady = () => {

        console.log('Ready mate');
    }
}
