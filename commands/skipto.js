const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skipto')
        .setDescription('Skips to the position in queue')
        .addStringOption(option => option
            .setName('position')
            .setDescription('The position in queue of the song you want to skip to (queue starts at position 1)')
            .setRequired(true)),

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

        const desiredPosition = Number(interaction.options.getString('position', true)) - 1;
        try
        {
            if (desiredPosition >= queue.getSize()
                || desiredPosition < 0
                || desiredPosition === queue.node.getTrackPosition(queue.currentTrack))
            {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription('That position is not in the queue!'),
                    ],
                });
            }

            const desiredSong = queue.tracks.toArray()[desiredPosition].title;
            queue.node.skipTo(desiredPosition);

            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`Jumping to position **${desiredPosition + 1}** in queue, **${desiredSong}**!`),
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
