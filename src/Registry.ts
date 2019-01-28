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
        const commandMeta = this.commands.find(meta => meta.triggers.includes(trigger));
        if (!commandMeta) return;

        // Run the command
        commandMeta.execute(message, args)
        
        // Respond with any errors
        .catch(e => message.channel.send(
            `There was an error when trying to run that: \`\`\`${e}\`\`\` (You should report this)`,  
        ));
    }
}

export interface CommandMeta {
    id: string;
    triggers: string[];
    execute: (message: Message, args: string[]) => Promise<unknown>;
}
