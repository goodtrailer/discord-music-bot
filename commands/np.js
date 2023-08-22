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
            // console.log("a------------------");
            // console.log(song.requestedBy.username);
            const songInfo = new EmbedBuilder()
                .setTitle(song.title)
                .setURL(song.url)
                .setDescription(
                    `Requested by: ${song.requestedBy.username}\n\nDuration: ${song.duration}`
                )
                .setThumbnail(song.thumbnail);
            return interaction.followUp({ embeds: [songInfo] });
        } catch (e) {
            return interaction.followUp(`Something went wrong!\n ${e}`);
        }
    },
};
