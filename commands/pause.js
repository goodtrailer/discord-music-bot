const { SlashCommandBuilder } = require("discord.js");
const { useQueue } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("pause")
        .setDescription("Pauses the current song being played"),
    async execute(interaction) {
        // await interaction.deferReply();
        try {
            const queue = useQueue(interaction.guild.id);
            if (queue.node.isPaused()) {
                return interaction.reply("Queue is already paused!");
            } else {
                queue.node.setPaused(true);
                return interaction.reply("Queue has been paused!");
            }
        } catch (e) {
            return interaction.reply(`Something went wrong: ${e}`);
        }
    },
};
