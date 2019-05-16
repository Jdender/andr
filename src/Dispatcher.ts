import { Effect } from './random';
import { Client, Collection, Message } from 'discord.js';
import bind from 'bind-decorator';
import { Registry } from './Registry';

// CONFIG
const prefix = '`';

@Effect()
export class Dispatcher {

    constructor(
        private client: Client,
        private registry: Registry,
    ) {
        client.on('message', this.handle);
    }

    @bind
    handle(message: Message) {

        // Basic checks
        if (!message.content.startsWith(prefix) || message.author.bot) return;

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
}

// Used to provide extra info to a execute
export interface CommandContext {
    message: Message;
    args: string[];
    prefix: string;
    trigger: string;
}
