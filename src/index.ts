import { Container } from 'typedi';
import { Client } from 'discord.js';
import { importful } from 'importful';
import { effectToken } from './random';

void async function() {

    const client = Container.get(Client);

    await importful(__dirname);

    console.log('Before getMany')

    new Promise(() => Container.getMany(effectToken));

    console.log('After getMany')

    client.login(process.env.DISCORD_TOKEN);
}();
