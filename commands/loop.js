const { useQueue } = require('discord-player');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('loop')
		.setDescription('Loops the queue'),
	async execute(interaction) {
		const queue = useQueue(interaction.guild.id);
		queue.setRepeatMode(2);
	},
};