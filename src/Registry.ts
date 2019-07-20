import { Collection } from 'discord.js';
import { CommandContext } from './Dispatcher';

export class Registry {

    // Store commands
    public commands = new Collection<string, CommandMeta>();

    addCommand(command: CommandMeta) {
        this.commands.set(command.id, command);
    }

    // For some reason discord.js types don't mark this as undfined
    getFromTrigger(trigger: string): CommandMeta | undefined {
        return this.commands.find(
            meta => meta.triggers.includes(trigger),
        );
    }
}

// The info of a command itself
export interface CommandMeta {
    id: string;
    triggers: string[];
    execute: (context: CommandContext) => Promise<unknown>;

    description: string;
    usage: string | string[];
}
