const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { lyricsExtractor } = require('@discord-player/extractor');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lyrics')
        .setDescription('Displays the lyrics of the current song'),

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

            const lyricsFinder = lyricsExtractor(/* 'optional genius API key' */);

            const lyrics = await lyricsFinder
                .search(queue.currentTrack.title)
                .catch(e => console.error(e, e.stack));

            if (!lyrics)
            {
                return interaction.followUp({
                    content: 'No lyrics found!',
                    ephemeral: false,
                });
            }

            const trimmedLyrics = lyrics.lyrics.substring(0, 1997);

            const embed = new EmbedBuilder()
                .setTitle(lyrics.title)
                .setURL(lyrics.url)
                .setThumbnail(lyrics.thumbnail)
                .setAuthor({
                    name: lyrics.artist.name,
                    iconURL: lyrics.artist.image,
                    url: lyrics.artist.url,
                })
                .setDescription(
                    trimmedLyrics.length === 1997
                        ? `${trimmedLyrics}...`
                        : trimmedLyrics,
                )
                .setColor('Yellow');

            return interaction.followUp({ embeds: [embed] });
        }
        catch (e)
        {
            console.error(e, e.stack);
            return interaction.reply(`Something went wrong!\n ${e}`);
        }
    },
};
