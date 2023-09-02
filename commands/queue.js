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
            await interaction.deferReply();
            const currentTrack = queue.currentTrack;
            console.log(currentTrack);
            const songsPerPage = 10;
            let tracks = [];
            let queuePage = 0;
            for (let i = 0; i < queue.getSize(); i += songsPerPage) {
                const songs = queue.tracks.toArray().slice(i, i + songsPerPage);
                tracks.push(songs);
            }

            // need to find a way to dynamically print queue incase there's only like 4 songs in queue, if you display hard coded 10, then it'll error so find a workaround
            let test = new EmbedBuilder()
                .setDescription(
                    `Notice: Reactions are not supported yet\nQueue: ${tracks[queuePage]}\n\nCurrent track: **${currentTrack}**`
                )
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

            // probs put this in a method, need to find a way to repeatedly call this portion, rn it just stops after first reaction interaction
            message
                .awaitReactions({
                    filter: collectorFilter,
                    max: 1,
                    time: 60000,
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
                        test = new EmbedBuilder().setDescription(
                            `Notice: Reactions are not supported yet\nQueue: ${tracks[queuePage]}\n\nCurrent track: **${currentTrack}**`
                        ).setColor("e8d5ac");
                        interaction.editReply({ embeds: [test] });
                    }
                })
                .catch((collected) => {
                    message.reply(`reaction collector error: ${collected}`);
                    console.log(collected);
                });
        } catch (e) {
            return await interaction.editReply(`Something went wrong: ${e}`);
        }
    },
};
