const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { useQueue } = require("discord-player");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("np")
        .setDescription("Displays information about the current playing song"),
    async execute(interaction) {
        try {
            const queue = useQueue(interaction.guild.id);
            if (!queue) {
                return await interaction.reply({
                    embeds: [
                        new EmbedBuilder().setDescription(
                            "The queue is empty! Please add some songs to use this command"
                        ),
                    ],
                });
            }
            await interaction.deferReply();
            const song = queue.currentTrack;
            const songInfo = new EmbedBuilder()
                .setTitle(song.title)
                .setDescription(
                    `Requested by: ${song.requestedBy.avatar} ${song.requestedBy.username}\n\nDuration:${song.duration}`
                )
                .setThumbnail(song.thumbnail);
            return interaction.followUp({ embeds: [songInfo] });
        } catch (e) {
            return await interaction.reply(`Something went wrong!\n ${e}`);
        }
    },
};
