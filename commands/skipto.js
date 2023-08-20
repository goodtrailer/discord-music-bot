const { SlashCommandBuilder } = require("discord.js");
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
        const queue = useQueue(interaction.guild.id);
        const desiredPosition = interaction.options.getString("position", true);
        try {
            if (desiredPosition < queue.getSize()) {
                queue.node.jump(desiredPosition);
                await interaction.reply(
                    `Jumping to position ${queue.node.getTrackPosition()} in queue, ${
                        queue.currentTrack
                    }!`
                );
            } else {
                await interaction.reply("That position is not in the queue!");
            }
        } catch (e) {
            await interaction.reply("Please enter a valid position!");
        }
    },
};
