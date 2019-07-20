import 'dotenv/config';
import 'reflect-metadata';
import { Container } from 'typedi';
import { Client } from 'discord.js';
import { importful } from 'importful';
import { effectToken } from './random';
import { createConnection } from 'typeorm';

void async function() {

    // Register and load services and structures
    await importful(__dirname);

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

    Container.getMany(effectToken);

    client.login(process.env.DISCORD_TOKEN);
}();
