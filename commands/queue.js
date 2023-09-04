const { useQueue } = require("discord-player");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("Lists all the songs in the queue"),
    async execute(interaction) {
        const queue = useQueue(interaction.guild.id);
        console.log(interaction.guild);
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
            let currentTrack = queue.currentTrack;
            // console.log(currentTrack);
            const songsPerPage = 10;
            let tracks = [];
            let queuePage = 0;
            // divide the list of tracks into a 2d array with 10 songs per element
            for (let i = 0; i < queue.getSize(); i += songsPerPage) {
                const songs = queue.tracks.toArray().slice(i, i + songsPerPage);
                tracks.push(songs);
            }

            let queueString = "";

            // need to find a way to dynamically print queue incase there's only like 4 songs in queue, if you display hard coded 10, then it'll error so find a workaround
            let test = new EmbedBuilder()
                .setAuthor({
                    name: `${interaction.guild.name}'s Queue`,
                    // iconURL: interaction.guild.icon,
                })
                .setDescription(
                    `Notice: Reactions are not supported yet\nQueue: ${tracks[queuePage]}\n\nCurrent track: **${currentTrack}**`
                )
                .setThumbnail(currentTrack.thumbnail)
                .setFooter({
                    text: `Page ${queuePage + 1} of ${
                        tracks.length
                    } | Tracks Queued: ${queue.getSize()} | Total Duration: ${
                        queue.durationFormatted
                    }`,
                })
                .setColor("e8d5ac");
            test.createReactionCollector;

            message = await interaction.editReply({
                embeds: [test],
            });

            // this ensures that the reactions are always placed in order
            message
                .react("⏪")
                .then(() => message.react("◀️"))
                .then(() => message.react("▶️"))
                .then(() => message.react("⏩"))
                .catch((e) => console.log(e));

            // reactions only work for the person who used the cmd
            const collectorFilter = (reaction, user) => {
                return (
                    ["⏪", "◀️", "▶️", "⏩"].includes(reaction.emoji.name) &&
                    user.id === interaction.user.id
                );
            };
            handleReactions(
                interaction,
                message,
                collectorFilter,
                queuePage,
                tracks,
                currentTrack,
                queue
            );
        } catch (e) {
            console.log(e);
            return await interaction.editReply(`Something went wrong: ${e}`);
        }
    },
};
// need to update value of current track

function handleReactions(
    interaction,
    message,
    collectorFilter,
    queuePage,
    tracks,
    currentTrack,
    queue
) {
    try {
        message
            .awaitReactions({
                filter: collectorFilter,
                max: 1,
                time: 15000,
                errors: ["time"],
            })
            .then(async (collected) => {
                const reaction = collected.first();
                let edited = false;
                // need to remove user's emoji after
                if (reaction.emoji.name === "⏪") {
                    queuePage = 0;
                    edited = true;
                } else if (reaction.emoji.name === "◀️" && queuePage > 0) {
                    queuePage--;
                    edited = true;
                } else if (
                    reaction.emoji.name === "▶️" &&
                    queuePage < tracks.length - 1
                ) {
                    queuePage++;
                    edited = true;
                } else if (reaction.emoji.name === "⏩") {
                    queuePage = tracks.length - 1;
                    edited = true;
                }
                if (edited) {
                    // update the queue embed display
                    // console.log(currentTrack);
                    test = new EmbedBuilder()
                        .setAuthor({
                            name: `${interaction.guild.name}'s Queue`,
                            // iconURL: interaction.guild.icon,
                        })
                        .setDescription(
                            `Notice: Reactions are not supported yet\nQueue: ${tracks[queuePage]}\n\nCurrent track: **${currentTrack}**`
                        )
                        .setThumbnail(currentTrack.thumbnail)
                        .setFooter({
                            text: `Page ${queuePage + 1} of ${
                                tracks.length
                            } | Tracks Queued: ${queue.getSize()} | Total Duration: ${
                                queue.durationFormatted
                            }`,
                        })
                        .setColor("e8d5ac");
                    interaction.editReply({ embeds: [test] });
                    handleReactions(
                        interaction,
                        message,
                        collectorFilter,
                        queuePage,
                        tracks,
                        currentTrack,
                        queue
                    );
                }
            })
            .catch((collected) => {
                message.reply(`reaction collector error: ${collected}`);
                console.log(collected);
            });
    } catch (e) {
        return interaction.editReply(`Something went wrong: ${e}`);
    }
}

function createQueuePageString(tracks, queuePage) {
    let page = "";
    for (let i = 0; i < tracks[queuePage].length; i++) {}
}
