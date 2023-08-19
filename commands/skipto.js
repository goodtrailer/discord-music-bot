const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skipto")
        .setDescription("Skips to the position in queue"),
    async execute(interaction) {
        await interaction.reply("Pong!");
    },
};
