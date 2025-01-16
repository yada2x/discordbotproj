"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const path = require("path");
const fs = require("fs");
const discord_js_1 = require("discord.js");
const BotClient_1 = require("./BotClient");
const client = new BotClient_1.BotClient({
    intents: [discord_js_1.GatewayIntentBits.Guilds],
});
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);
for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(path.join(foldersPath, folder))
        .filter(file => file.endsWith('.ts'));
    for (const file of commandFiles) {
        const filePath = path.join(foldersPath, folder, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        }
        else {
            console.log(`[WARNING] The command at ${filePath} is missing a required 'data' or 'execute' property.`);
        }
    }
}
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath)
    .filter(file => file.endsWith('.ts'));
for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    }
    else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}
client.login(process.env.TOKEN);
