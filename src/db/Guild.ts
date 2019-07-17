import { getRepository } from 'typeorm';
import { Structures } from 'discord.js';
import { GuildConfig } from './GuildConfig.entity';

const defaultConfig = {
    prefix: ',',
};

// "It's not prototype overloading if it's suported by the library!"

export const Guild = Structures.extend('Guild', Base => class extends Base {

    async getConfig(): Promise<GuildConfig> {

        // I don't know if getting a repo every time is good or not
        const repo = getRepository(GuildConfig);
        
        const config = await repo.findOne(this.id);

        if (config) return config;

        // If not existing config:

        // Entity's id same as the discord id
        const newConfig: GuildConfig = {
            ...defaultConfig,
            id: this.id,
        };

        await repo.save(newConfig);

        return newConfig;
    }

    async setConfig(newConfig: Partial<GuildConfig>): Promise<void> {

        const repo = getRepository(GuildConfig);

        // I think save is okay with a Partial
        await repo.save(newConfig);
    }
});

// Here's some type overloading to go along with the prototype overloading
declare module 'discord.js' {

    interface Guild {

        getConfig(): Promise<GuildConfig>;

        setConfig(newConfig: Partial<GuildConfig>): Promise<void>;
    }
}
