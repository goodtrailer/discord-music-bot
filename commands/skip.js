const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('skip')
		.setDescription('Skips to the next track in the queue'),
	async execute(interaction) {
		try {
			const queue = useQueue(interaction.guild.id);
			if (!queue) {
				return interaction.reply("The queue is empty! Please add some songs to use this command");
			}
			const skippedTrack = queue.currentTrack.title;
			queue.node.skip();
			let endMessage = "";
			if (queue.getSize() == 0) {
				endMessage = "No more songs left in queue, leaving the voice channel!"
			}
			return interaction.reply(`Skipped **${skippedTrack}**\n${endMessage}`);
		} catch (e) {
			return interaction.reply(`Something went wrong: ${e}`);
		}
	},
};