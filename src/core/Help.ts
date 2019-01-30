import { Client, Message } from 'discord.js';
import { Effect } from '../random';
import { Registry } from '../Registry';

@Effect()
export class Help {

    constructor(
        private client: Client,
        private registry: Registry,
    ) {
        registry.addCommand({
            id: 'help',
            triggers: ['help', 'commands'],
            description: 'List all my commands or info about a specific command.',
            usage: [
                'help',
                'help <command>',
            ],
            // Replace this when I figure out proper args
            execute: async (msg, [cmd], {prefix}) => cmd 
                ? this.explainCommand(msg, cmd, prefix) 
                : this.listCommands(msg),
        });
    }

    listCommands(message: Message) {

        // Why is this an iterator?!?
        const commands = Array.from(this.registry.commands.keys());

        // Format the list
        const formatedCommands = commands.map(cmd => '» ' + cmd).join('\n');

        // Put together commands' info
        const response = [
            'Here\'s a list of all my commands:',
            formatedCommands,
        ];

        // Send the response
        return message.channel.send(response.join('\n'), { split: true });
    }

    explainCommand(message: Message, trigger: string, prefix: string) {

        // Get the command meta
        const command = this.registry.getFromTrigger(trigger);
        if (!command) return message.channel.send('That\'s not a command I have.');

        // Make sure usage is an array
        const usageArray = Array.isArray(command.usage)
            ? command.usage
            : [command.usage];

        // Format usage into code blocks
        const formatedUsage = usageArray
            .map(use => `\`${prefix}${use}\``)
            .join(', ');

        // Put together the command's info
        const response = [
            `**Name:** ${command.id}`,
            `**Triggers:** ${command.triggers.join(', ')}`,
            `**Description:** ${command.description}`,
            `**Usage:** ${formatedUsage}`,
        ];

        // Send the response
        return message.channel.send(response.join('\n'), { split: true });
    }
}
