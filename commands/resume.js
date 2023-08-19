const { SlashCommandBuilder } = require("discord.js");
const { useQueue } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("Resumes the queue"),
    async execute(interaction) {
        // await interaction.deferReply();
        try {
            const queue = useQueue(interaction.guild.id);
            if (!queue.node.isPaused()) {
                return interaction.reply("The queue is already playing!");
            } else {
                queue.node.setPaused(false);
                return interaction.reply("The queue has been resumed!");
            }
        } catch (e) {
            return interaction.reply(`Something went wrong: ${e}`);
        }
    },
};
