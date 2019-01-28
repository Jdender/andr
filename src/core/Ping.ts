import { Client, Message } from 'discord.js';
import { bind } from 'bind-decorator';
import { Effect } from '../random';
import { Registry } from '../Registry';

@Effect()
export class EventTest {

    constructor(
        private client: Client,
        private registry: Registry,
    ) {
        registry.addCommand({
            id: 'ping',
            triggers: ['ping', 'pong'],
            execute: this.execute,
        });
    }

    @bind
    async execute(message: Message, args: string[]) {

        message.channel.send(`Pong ${args}`);
    }
}
