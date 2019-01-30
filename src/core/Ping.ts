import { Client, Message } from 'discord.js';
import { bind } from 'bind-decorator';
import { Effect } from '../random';
import { Registry } from '../Registry';

@Effect()
export class Ping {

    constructor(
        private client: Client,
        registry: Registry,
    ) {
        registry.addCommand({
            id: 'ping',
            triggers: ['ping', 'pong'],
            execute: this.execute,
            description: 'Check the my latency.',
            usage: 'ping',
        });
    }

    @bind
    async execute(message: Message, args: string[]) {

        // Used for roundTrip
        const pingMessage = await message.channel.send('Pinging...') as Message;

        // Calculate pings
        const roundTrip = Math.abs(pingMessage.createdTimestamp - message.createdTimestamp);

        const heartbeat = Math.round(this.client.ws.ping);

        // The best way I could think of is a string array
        pingMessage.edit([
            'Pong!',
            `Message round-trip was **${roundTrip} ms**.`,
            this.client.ws.ping ? `Heartbeat was **${heartbeat} ms**.` : '',
        ].join(' '));
    }
}
