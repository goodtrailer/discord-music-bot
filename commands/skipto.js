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
                    "The position in queue of the song you want to skip to (queue starts at position 1)"
                )
                .setRequired(true)
        ),
    async execute(interaction) {
        const queue = useQueue(interaction.guild.id);
        const desiredPosition =
            Number(interaction.options.getString("position", true)) - 1;
        if (!queue) {
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder().setDescription(
                        "The queue is empty! Please add some songs to use this command"
                    ),
                ],
            });
        }
        try {
            // checks if the input is a valid position # -> we need the third conditional incase the queue is looped
            if (
                desiredPosition < queue.getSize() &&
                desiredPosition >= 0 &&
                desiredPosition !=
                    queue.node.getTrackPosition(queue.currentTrack)
            ) {
                const desiredSong =
                    queue.tracks.toArray()[desiredPosition].title;
                // for debugging
                // console.log("-----------------------------");
                // console.log(queue.tracks.toArray().length);
                // console.log(desiredPosition);
                queue.node.skipTo(desiredPosition);
                return await interaction.reply({
                    embeds: [
                        new EmbedBuilder().setDescription(
                            `Jumping to position **${
                                desiredPosition + 1
                            }** in queue, **${desiredSong}**!`
                        ),
                    ],
                });
            } else {
                return await interaction.reply({
                    embeds: [
                        new EmbedBuilder().setDescription(
                            "That position is not in the queue!"
                        ),
                    ],
                });
            }
        } catch (e) {
            return await interaction.reply(`Something went wrong!\n ${e}`);
        }
    },
};
