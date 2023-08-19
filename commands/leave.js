const { useQueue } = require('discord-player');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leave')
		.setDescription('Stops playing music and leaves the voice channel'),
	async execute(interaction) {
		const queue = useQueue(interaction.guild.id);
		if (!queue) {
			return interaction.reply("A queue does not exist!");
		}
		queue.delete();
		return interaction.reply("Goodbye, thanks for using me!");
	},
};