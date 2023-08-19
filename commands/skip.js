const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('skip')
		.setDescription('Skips to the next track in the queue'),
	async execute(interaction) {
		// if 
		try {
			const queue = useQueue(interaction.guild.id);
			if (!queue) {
				return interaction.reply("The queue is empty! Please add some songs to use this command");
			}
			const skippedTrack = queue.currentTrack;
			queue.node.skip();
			return interaction.reply(`Skipped ${skippedTrack}`);
		} catch (e) {
			return interaction.reply(`Something went wrong: ${e}`);
		}
	},
};