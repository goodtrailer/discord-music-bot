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
            const songsPerPage = 10;
            let tracks = [];
            // console.log(queue.getSize());
            for (let i = 0; i < queue.getSize(); i += songsPerPage) {
                const songs = queue.tracks.toArray().slice(i, i + songsPerPage);
                tracks.push(songs);
            }
            // console.log(tracks);

            let test = new EmbedBuilder().setDescription(
                `Queue: ${tracks}\n\nCurrent track: **${currentTrack}**`
            );
            test.createReactionCollector;

            message = await interaction.followUp({
                // embeds: [
                //     new EmbedBuilder().setDescription(
                //         `Queue: ${tracks}\n\nCurrent track: **${currentTrack}**`
                //     ),
                // ],
                embeds: [test],
            });

            // this ensures that the reactions are always placed in order
            message
                .react("🔀")
                .then(() => message.react("⏪"))
                .then(() => message.react("◀️"))
                .then(() => message.react("▶️"))
                .then(() => message.react("⏩"))
                .then(() => message.react("🔄"))
                .catch((e) => console.log(e));

            const collectorFilter = (reaction, user) => {
                return ['🔀', '⏪', '◀️', '▶️', '⏩', '🔄'].includes(reaction.emoji.name) && user.id === interaction.user.id;
            };

            message.awaitReactions({ filter: collectorFilter, max: 1, time: 60000, errors: ['time'] })
                .then(async collected => {
                    const reaction = collected.first();

                    if (reaction.emoji.name === '🔀') {
                        const shuffle = require("./shuffle.js");
                        if (!shuffle) {
                            throw new Error("cant read file");
                        }
                        return await shuffle.execute(interaction);
                    } else {
                        message.reply('test');
                    }
                })
                .catch(collected => {
                    message.reply(`test2 ${collected}`);
                });
        } catch (e) {
            return await interaction.followUp(`Something went wrong: ${e}`);
        }
    },
};