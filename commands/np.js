const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { useQueue } = require("discord-player");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("np")
        .setDescription("Displays information about the current playing song"),
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
            await interaction.deferReply();
            const song = queue.currentTrack;
            const songInfo = new EmbedBuilder()
                .setTitle(song.title)
                .setURL(song.url)
                .setDescription(
                    `Requested by: ${await queue.tracks.toArray()[0].requestedBy.username}\n\nDuration: ${song.duration}`
                )
                .setThumbnail(song.thumbnail);
            return interaction.followUp({ embeds: [songInfo] });
        } catch (e) {
            return interaction.reply(`Something went wrong!\n ${e}`);
        }
    },
};
