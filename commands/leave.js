const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leave')
        .setDescription('Stops playing music and leaves the voice channel'),

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

        queue.delete();
        return interaction.reply({
            embeds: [
                new EmbedBuilder().setDescription('Leaving the voice channel!'),
            ],
        });
    },
};
