const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('front')
        .setDescription('Moves a song at the provided position to the front of the queue')
        .addStringOption(option => option
            .setName('position')
            .setDescription('The position in queue of the song you want to bring to the front (queue starts at position 1)')
            .setRequired(true)),

    async execute(interaction)
    {
        const queue = useQueue(interaction.guild.id);
        const songPosition = Number(interaction.options.getString('position', true)) - 1;
        if (!queue)

            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription('The queue is empty! Please add some songs to use this command'),
                ],
            });

        try
        {
            if (songPosition < queue.getSize())
            {
                const song = queue.tracks.toArray()[songPosition];
                queue.insertTrack(song, 0);
                return await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription(`Moved **${song.title}** to the front of the queue!`),
                    ],
                });
            }
            return await interaction.reply({
                embeds: [
                    new EmbedBuilder().setDescription('That position is not in the queue!'),
                ],
            });
        }
        catch (e)
        {
            console.error(e, e.stack);
            return interaction.reply(`Something went wrong!\n ${e}`);
        }
    },
};
