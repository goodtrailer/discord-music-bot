const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('loop')
        .setDescription('Loops the queue'),

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
            queue.setRepeatMode(2);
            return interaction.reply({
                embeds: [
                    new EmbedBuilder().setDescription('Looping the queue'),
                ],
            });
        }
        catch (e)
        {
            console.error(e, e.stack);
            return interaction.reply(`Something went wrong: ${e}`);
        }
    },
};
