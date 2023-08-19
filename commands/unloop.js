const { useQueue } = require('discord-player');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unloop')
		.setDescription('Un-loops the queue'),
	async execute(interaction) {
		const queue = useQueue(interaction.guild.id);
		queue.setRepeatMode(0);
	},
};