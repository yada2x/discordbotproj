"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotClient = void 0;
const discord_js_1 = require("discord.js");
class BotClient extends discord_js_1.Client {
    commands;
    constructor(options) {
        super(options);
        this.commands = new discord_js_1.Collection();
    }
}
exports.BotClient = BotClient;
