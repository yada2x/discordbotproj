import 'dotenv/config';
import path = require('path');
import fs = require('fs');
import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { BotClient } from './BotClient';

const client = new BotClient({
    intents: [GatewayIntentBits.Guilds], 
});

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(path.join(foldersPath, folder))
        .filter(file => file.endsWith('.ts'));

    for (const file of commandFiles) {
        const filePath = path.join(foldersPath, folder, file)
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required 'data' or 'execute' property.`);
        }
    }
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath)
    .filter(file => file.endsWith('.ts'));
for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath)
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

client.login(process.env.TOKEN);
