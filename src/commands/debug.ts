import { Client, Message } from 'discord.js';
import { Effect } from '../helpers/effect';
import { Registry } from '../core/Registry';
import { CommandContext } from '../core/Dispatcher';
import { smallCodeblock, inspectCodeblock } from '../helpers/formating';

@Effect()
export class Debug {

    constructor(
        private client: Client,
        registry: Registry,
    ) {
        registry.addCommand({
            id: 'debug',
            triggers: ['debug'],
            execute: this.execute,
            description: 'Debug aspects of the bot',
            usage: [
                'debug',
                `debug <${Object.keys(this.subcommands).join('|')}>`,
            ],
        });
    }

    execute = async (context: CommandContext) => {

        // Don't destruct context in args because we need context for some subcmds
        const { message, args } = context;

        // Get subcommand from match object
        const subcommand = this.subcommands[args[0]];

        if (!subcommand) return this.help(message);

        return subcommand(context);
    }

    // Display subcommands if not a valid one
    help(message: Message) {

        const help = Object.keys(this.subcommands).map(smallCodeblock).join(', ');

        message.channel.send(
            `Available debug subcommands are: ${help}`,
        );
    }

    subcommands: Subcommands = {

        async guildConfig({ message }) {

            const config = await message.guild!.getConfig();
            
            message.channel.send(inspectCodeblock(config));
        },

        commandContext(context) {

            context.message.channel.send(inspectCodeblock(context));
        },
    };
}

interface Subcommands {
    [subcmd: string]: undefined | ((ctx: CommandContext) => any);
}
