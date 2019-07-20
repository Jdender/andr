import { Effect } from './helpers/Effect';
import { Client, Message } from 'discord.js';
import { Registry } from './Registry';
import { GuildConfig } from './db/GuildConfig.entity';

@Effect()
export class Dispatcher {

    constructor(
        private client: Client,
        private registry: Registry,
    ) {
        client.on('message', this.handle);
    }

    handle = async (message: Message) => {

        // Might need this later other then just for getPrefix
        const guildConfig = await message.guild.getConfig();

        // Get prefix
        const prefix = this.getPrefix(message, guildConfig);

        // Basic checks
        if (!prefix || !message.content.startsWith(prefix) || message.author.bot) return;

        // Get raw args using regex
        const args = message.content.slice(prefix.length).split(/\s/g);

        // Get trigger as first arg
        const trigger = args.shift()!.toLowerCase();
        if (!trigger) return;

        // Find a command that has the trigger
        const commandMeta = this.registry.getFromTrigger(trigger);
        if (!commandMeta) return;

        // Provide extra info for commands
        const context: CommandContext = {
            message,
            args,
            prefix,
            trigger,
        };

        // Run the command
        commandMeta.execute(context)
        
        // Respond with any errors
        .catch(e => message.channel.send(
            `There was an error when trying to run that: \`\`\`${e}\`\`\` (You should report this)`,  
        ));
    }

    getPrefix(message: Message, guildConfig: GuildConfig): string | undefined {

        // Could add more if needed
        const prefixes = [
            guildConfig.prefix, 
            `<@!?${this.client.user!.id}> `, // Mention
        ];

        // Yay RegExp
        const prefixRegex = new RegExp(`^(${prefixes.join('|')})`);

        // Unyay RegExpMatchArray
        const prefix = message.content.match(prefixRegex);

        // Flatten the null
        return (prefix || [])[0];
    }
}

// Used to provide extra info to a execute
export interface CommandContext {
    message: Message;
    args: string[];
    prefix: string;
    trigger: string;
}
