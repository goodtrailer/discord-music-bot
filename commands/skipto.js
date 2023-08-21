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
        try {
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
            
            if (desiredPosition < queue.getSize()) {
                //replace .jump with .skipto after testing queue functionality
                queue.node.skipTo(desiredPosition);
                return await interaction.reply({
                    embeds: [
                        new EmbedBuilder().setDescription(
                            `Jumping to position **${
                                desiredPosition + 1
                            }** in queue, **${
                                await queue.tracks.toArray()[desiredPosition].title
                            }**!`
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
            // return await interaction.reply("Please enter a valid position!");
        }
    },
};
