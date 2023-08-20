const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { useQueue } = require("discord-player");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("skipto")
        .setDescription("Skips to the position in queue")
        .addStringOption((option) =>
            option
                .setName("position")
                .setDescription(
                    "The position in queue of the song you want to skip to"
                )
                .setRequired(true)
        ),
    async execute(interaction) {
        try {
            const queue = useQueue(interaction.guild.id);
            const desiredPosition = Number(
                interaction.options.getString("position", true)
            );
            console.log(desiredPosition);
            if (!queue) {
                return await interaction.reply(
                    "The queue is empty! Please add some songs to use this command"
                );
            }
            if (desiredPosition < queue.getSize()) {
                //replace .jump with .skipto after testing queue functionality
                queue.node.jump(desiredPosition);
                const message = new EmbedBuilder().setDescription(
                    `Jumping to position ${queue.node.getTrackPosition()} in queue, ${
                        queue.currentTrack
                    }!`
                );
                return await interaction.reply({ embeds: [message] });
            } else {
                return await interaction.reply(
                    "That position is not in the queue!"
                );
            }
        } catch (e) {
            return await interaction.reply("Please enter a valid position!");
        }
    },
};
