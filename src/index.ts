import 'reflect-metadata';
import { Container } from 'typedi';
import { Client } from 'discord.js';
import { importful } from 'importful';
import { effectToken } from './random';

void async function() {

    const client = new Client({});

    Container.set(Client, client);

    await importful(__dirname);

    Container.getMany(effectToken);

    client.login(process.env.DISCORD_TOKEN);
}();
