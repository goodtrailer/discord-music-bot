const { useQueue } = require("discord-player");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("Lists all the songs in the queue"),
    async execute(interaction) {
        const queue = useQueue(interaction.guild.id);
        if (!queue) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder().setDescription(
                        "The queue is empty! Please add some songs to use this command"
                    ),
                ],
            });
        }
        try {
            const currentTrack = queue.currentTrack;
            const songsPerPage = 10;
            let tracks = [];
            for (let i = 0; i < queue.getSize(); i += songsPerPage) {
                const songs = queue.tracks.toArray().slice(i, i + songsPerPage);
                tracks.push(songs);
            }
            console.log(tracks);

            await interaction.reply({
                embeds: [
                    new EmbedBuilder().setDescription(
                        `Queue: **${tracks}**\n\nCurrent track: **${currentTrack}**`
                    ),
                ],
            });
        } catch (e) {
            return await interaction.reply(`Something went wrong: ${e}`);
        }
    },
};
