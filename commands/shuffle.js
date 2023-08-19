const { useQueue } = require('discord-player');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('shuffle')
		.setDescription('Shuffles the queue'),
	async execute(interaction) {
		try {
			const queue = useQueue(interaction.guild.id);
			if (!queue) {
				return interaction.reply("The queue is empty! Please add some songs to use this command");
			}
			queue.tracks.shuffle();
			return interaction.reply("Shuffling the queue!");
		} catch (e) {
			return interaction.reply(`Something went wrong: ${e}`);
		}
	},
};