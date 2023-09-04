const { useQueue } = require('discord-player');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unloop')
        .setDescription('Un-loops the queue'),
    async execute(interaction)
    {
        const queue = useQueue(interaction.guild.id);
        if (!queue)

            return interaction.reply({
                embeds: [
                    new EmbedBuilder().setDescription(
                        'The queue is empty! Please add some songs to use this command',
                    ),
                ],
            });

        try
        {
            queue.setRepeatMode(0);
            return interaction.reply({
                embeds: [
                    new EmbedBuilder().setDescription(
                        'The queue has been un-looped!',
                    ),
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
