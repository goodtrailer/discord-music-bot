const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { useMainPlayer } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Play a song in your voice channel")
        .addStringOption((option) =>
            option
                .setName("query")
                .setDescription("The name or link to the song")
                .setRequired(true)
        ),
    async execute(interaction) {
        const player = useMainPlayer();
        const channel = interaction.member.voice.channel;
        if (!channel)
            return interaction.reply({
                embeds: [
                    new EmbedBuilder().setDescription(
                        "You are not connected to a voice channel!"
                    ),
                ],
            });
        const query = interaction.options.getString("query", true); // we need input/query to play

        // let's defer the interaction as things can take time to process
        await interaction.deferReply();

        try {
            const { track } = await player.play(channel, query, {
                nodeOptions: {
                    // nodeOptions are the options for guild node (aka your queue in simple word)
                    metadata: interaction, // we can access this metadata object using queue.metadata later on
                },
            });
            return interaction.followUp({
                embeds: [
                    new EmbedBuilder().setDescription(
                        `Added **${track.title}** to the queue!` 
                    ),
                ],
            });
        } catch (e) {
            // let's return error if something failed
            return await interaction.followUp(`Something went wrong: ${e}`);
        }
    },
};
