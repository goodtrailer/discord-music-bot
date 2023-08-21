const { SlashCommandBuilder } = require("discord.js");
const { useQueue } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("pause")
        .setDescription("Pauses the queue"),
    async execute(interaction) {
        try {
            const queue = useQueue(interaction.guild.id);
            // checks for null queue
            if (!queue) {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder().setDescription(
                            "The queue is empty! Please add some songs to use this command"
                        ),
                    ],
                });
            }
            if (queue.node.isPaused()) {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder().setDescription(
                            "The queue is already paused!"
                        ),
                    ],
                });
            } else {
                queue.node.setPaused(true);
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder().setDescription(
                            "The queue has been paused!"
                        ),
                    ],
                });
            }
        } catch (e) {
            return interaction.reply(`Something went wrong: ${e}`);
        }
    },
};
