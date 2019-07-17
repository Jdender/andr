import 'dotenv/config';
import 'reflect-metadata';
import { Container } from 'typedi';
import { Client } from 'discord.js';
import { importful } from 'importful';
import { effectToken } from './random';
import { createConnection } from 'typeorm';

// [Important] Import structures before creating client
import './db/Guild';

void async function() {

    const client = new Client({});

    Container.set(Client, client);

    await createConnection({
        type: 'sqlite',
        database: __dirname + '/../.data/db.sqlite',
        synchronize: true,
        entities: [
            __dirname + '/**/*.entity.ts'
        ],
    });

    // Register and load services
    await importful(__dirname);

    Container.getMany(effectToken);

    client.login(process.env.DISCORD_TOKEN);
}();
