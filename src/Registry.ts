import { Effect } from './random';
import { Client, Collection, Message } from 'discord.js';
import bind from 'bind-decorator';

// CONFIG
const prefix = '`';

@Effect()
export class Registry {

    // Store commands
    public commands = new Collection<string, CommandMeta>();

    constructor(
        private client: Client,
    ) {
        client.on('message', this.handle);
    }

    //-- Register Command --//

    addCommand(command: CommandMeta) {
        this.commands.set(command.id, command);
    }

    // For some reason discord.js types don't mark this as undfined
    getFromTrigger(trigger: string): CommandMeta | undefined {
        return this.commands.find(
            meta => meta.triggers.includes(trigger),
        );
    }

    //-- Handle command --//
    // (May split into other class)

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
        const commandMeta = this.getFromTrigger(trigger);
        if (!commandMeta) return;

        // Provide extra info for commands
        const extra: CommandExtra = {
            prefix,
            trigger,
        };

        // Run the command
        commandMeta.execute(message, args, extra)
        
        // Respond with any errors
        .catch(e => message.channel.send(
            `There was an error when trying to run that: \`\`\`${e}\`\`\` (You should report this)`,  
        ));
    }
}

// The info of a command itself
export interface CommandMeta {
    id: string;
    triggers: string[];
    execute: (message: Message, args: string[], extra: CommandExtra) => Promise<unknown>;

    description: string;
    usage: string | string[];
}

// Used to provide extra info to a execute
export interface CommandExtra {
    prefix: string;
    trigger: string;
}
