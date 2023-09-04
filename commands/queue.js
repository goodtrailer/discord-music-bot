const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

function getNextPage(currPage, tracks, reaction)
{
    if (reaction.emoji.name === '⏪')
        return 0;
    if (reaction.emoji.name === '◀️' && currPage > 0)
        return currPage - 1;
    if (reaction.emoji.name === '▶️' && currPage < tracks.length - 1)
        return currPage + 1;
    if (reaction.emoji.name === '⏩')
        return tracks.length - 1;

    return currPage;
}

function updateQueueEmbed(interaction, queue, currPage, tracks, currTrack)
{
    const embed = new EmbedBuilder()
        .setAuthor({
            name: `${interaction.guild.name}'s Queue`,
            // iconURL: interaction.guild.icon,
        })
        .setDescription(`Notice: Reactions are not supported yet\nQueue: ${tracks[currPage]}\n\nCurrent track: **${currTrack}**`)
        .setThumbnail(currTrack.thumbnail)
        .setFooter({
            text: `Page ${currPage + 1} of ${tracks.length} | Tracks Queued: ${queue.getSize()} | Total Duration: ${queue.durationFormatted}`,
        })
        .setColor('e8d5ac');

    return interaction.editReply({ embeds: [embed] });
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Lists all the songs in the queue'),

    async execute(interaction)
    {
        const queue = useQueue(interaction.guild.id);
        if (!queue)
        {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription('The queue is empty! Please add some songs to use this command'),
                ],
            });
        }

        try
        {
            await interaction.deferReply();
            const { currentTrack: currTrack } = queue;
            const songsPerPage = 10;
            const tracks = [];
            let currPage = 0;
            // divide the list of tracks into a 2d array with 10 songs per element
            for (let i = 0; i < queue.getSize(); i += songsPerPage)
            {
                const songs = queue.tracks.toArray().slice(i, i + songsPerPage);
                tracks.push(songs);
            }

            const message = await updateQueueEmbed(interaction, queue, currPage, tracks, currTrack);
            const filter = (reaction, user) => ['⏪', '◀️', '▶️', '⏩'].includes(reaction.emoji.name)
                && user.id === interaction.user.id;

            const collector = message.createReactionCollector({ filter, time: 30_000 });
            collector.on('collect', reaction =>
            {
                currPage = getNextPage(currPage, tracks, reaction);
                updateQueueEmbed(interaction, queue, currPage, tracks, currTrack);
            });

            return message.react('⏪')
                .then(() => message.react('◀️'))
                .then(() => message.react('▶️'))
                .then(() => message.react('⏩'))
                .catch(e => console.error(e, e.stack));
        }
        catch (e)
        {
            console.error(e, e.stack);
            return interaction.editReply(`Something went wrong: ${e}`);
        }
    },
};
