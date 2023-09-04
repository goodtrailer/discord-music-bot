const { SlashCommandBuilder, EmbedBuilder, User } = require("discord.js");
const { useMainPlayer, useQueue } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Play a song in your voice channel")
        .addStringOption((option) =>
            option
                .setName("query")
                .setDescription("The name or link to the song or playlist")
                .setRequired(true)
        ),
    async execute(interaction) {
        const player = useMainPlayer();
        const channel = interaction.member.voice.channel;
        if (!channel)
            return interaction.reply({
                embeds: [
                    new EmbedBuilder().setDescription(
                        "You are not connected to a voice channel!"
                    ),
                ],
            });

        const query = interaction.options.getString("query", true); // we need input/query to play
        await interaction.deferReply();

        try {
            const queue = useQueue(interaction.guild.id);

            // checks size of queue before and after adding items to see if a single song was added or multiple
            let beforeSize;
            try {
                beforeSize = queue.getSize();
            } catch {
                beforeSize = 0;
            }

            const { track } = await player.play(channel, query, {
                nodeOptions: {
                    metadata: interaction,
                },
            });

            let afterSize;
            try {
                afterSize = queue.getSize();
            } catch {
                afterSize = 0;
            }
            const songsAddedToQueue = afterSize - beforeSize;
            // first usage of player
            if (songsAddedToQueue == 0) {
                track.requestedBy = interaction.user;
            } else if (songsAddedToQueue > 1) {
                // handles cases of multiple songs (playlist) being loaded at once
                for (let i = beforeSize; i < afterSize; i++) {
                    queue.tracks.toArray()[i].requestedBy = interaction.user;
                }
            } else {
                queue.tracks.toArray()[queue.getSize() - 1].requestedBy =
                    interaction.user;
            }
            return interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `Added **${track.title}** to the queue!`
                        )
                        .setColor("e8d5ac"),
                ],
            });
        } catch (e) {
            return await interaction.followUp(`Something went wrong: ${e}`);
        }
    },
};
