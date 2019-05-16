import { Entity, PrimaryColumn, Column, BaseEntity, getRepository } from 'typeorm';
import { Structures } from 'discord.js';

@Entity()
class GuildConfig {

    @PrimaryColumn()
    id: string;

    @Column()
    prefix: string;
}

const defaultConfig = {
    prefix: '`',
};

export const Guild = Structures.extend('Guild', Base => class extends Base {

    async getConfig(): Promise<GuildConfig> {

        const repo = getRepository(GuildConfig);
        
        const config = await repo.findOne(this.id);

        if (config) return config;

        const newConfig: GuildConfig = {
            ...defaultConfig,
            id: this.id,
        };

        await repo.save(newConfig);

        return newConfig;
    }

    async setConfig(newConfig: Partial<GuildConfig>): Promise<void> {

        const repo = getRepository(GuildConfig);

        await repo.save(newConfig);
    }
});

declare module 'discord.js' {

    interface Guild {

        getConfig(): Promise<GuildConfig>
    }
}
