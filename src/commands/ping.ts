import { Client, Message } from 'discord.js';
import { Effect } from '../helpers/effect';
import { Registry } from '../Registry';
import { CommandContext } from '../Dispatcher';

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

    execute = async ({ message }: CommandContext) => {

        // Used for roundTrip
        const pingMessage = await message.channel.send('Pinging...') as Message;

        // Calculate pings
        const roundTrip = Math.abs(pingMessage.createdTimestamp - message.createdTimestamp);

        const heartbeat = Math.round(this.client.ws.ping);

        // The best way I could think of is a string array
        pingMessage.edit([
            'Vwoop. ',
            `Message round-trip was \`${roundTrip} ms\``,
            this.client.ws.ping ? `, heartbeat was \`${heartbeat} ms\`.` : '.',
        ].join(''));
    }
}
