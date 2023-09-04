const { useQueue } = require('discord-player');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('queue')
		.setDescription('Lists all the songs in the queue'),
	async execute(interaction) {
		const queue = useQueue(interaction.guild.id);
		if (!queue) {
			return interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setDescription(
							'The queue is empty! Please add some songs to use this command',
						)
						.setColor('e8d5ac'),
				],
			});
		}
		try {
			await interaction.deferReply();
			const currentTrack = queue.currentTrack;
			const songsPerPage = 10;
			const tracks = [];
			const queuePage = 0;
			// divide the list of tracks into a 2d array with 10 songs per element
			for (let i = 0; i < queue.getSize(); i += songsPerPage) {
				const songs = queue.tracks.toArray().slice(i, i + songsPerPage);
				tracks.push(songs);
			}
			const queueDisplay = createQueueEmbed(
				interaction,
				queue,
				tracks,
				queuePage,
			);
			queueDisplay.createReactionCollector;

			const message = await interaction.editReply({
				embeds: [queueDisplay],
			});

			// this ensures that the reactions are always placed in order
			message
				.react('⏪')
				.then(() => message.react('◀️'))
				.then(() => message.react('▶️'))
				.then(() => message.react('⏩'))
				.catch((e) => console.log(e));

			// reactions only work for the person who used the cmd
			const collectorFilter = (reaction, user) => {
				return (
					['⏪', '◀️', '▶️', '⏩'].includes(reaction.emoji.name) &&
                    user.id === interaction.user.id
				);
			};
			handleReactions(
				interaction,
				message,
				collectorFilter,
				queuePage,
				tracks,
				currentTrack,
				queue,
			);
		} catch (e) {
			console.log(e);
			return await interaction.editReply(`Something went wrong: ${e}`);
		}
	},
};

function handleReactions(
	interaction,
	message,
	collectorFilter,
	queuePage,
	tracks,
	currentTrack,
	queue,
) {
	try {
		message
			.awaitReactions({
				filter: collectorFilter,
				max: 1,
				time: 15000,
			})
			.then(async (collected) => {
				console.log('test');
				console.log(collected.first());
				const reaction = collected.first();
				let edited = false;

				// need to remove user's emoji after
				if (reaction.emoji.name === '⏪') {
					queuePage = 0;
					edited = true;
				} else if (reaction.emoji.name === '◀️' && queuePage > 0) {
					queuePage--;
					edited = true;
				} else if (
					reaction.emoji.name === '▶️' &&
                    queuePage < tracks.length - 1
				) {
					queuePage++;
					edited = true;
				} else if (reaction.emoji.name === '⏩') {
					queuePage = tracks.length - 1;
					edited = true;
				}
				if (edited) {
					// update the queue embed display
					const editedQueueDisplay = createQueueEmbed(
						interaction,
						queue,
						tracks,
						queuePage,
					);
					interaction.editReply({ embeds: [editedQueueDisplay] });
					handleReactions(
						interaction,
						message,
						collectorFilter,
						queuePage,
						tracks,
						currentTrack,
						queue,
					);
				}
			})
			.catch((collected) => {
				message.reply(`reaction collector error: ${collected}`);
				console.log('stack trace:');
				console.log(collected, collected.stack);
			});
	} catch (e) {
		return interaction.editReply(`Something went wrong: ${e}`);
	}
}

function createQueuePageString(tracks, queuePage) {
	let page = '';
	const queueExists = tracks[queuePage]?.length ?? false;
	if (queueExists) {
		for (let i = 1; i <= tracks[queuePage].length; i++) {
			page += `**${i + queuePage * 10}**. ${tracks[queuePage][i - 1]}\n`;
		}
	}
	return page;
}

function createQueueEmbed(interaction, queue, tracks, queuePage) {
	const currentTrack = queue.currentTrack;
	const queueString = `🔊  Current Track: **${currentTrack}**\n\n🔊  Queue:\n${createQueuePageString(
		tracks,
		queuePage,
	)}`;
	return new EmbedBuilder()
		.setAuthor({
			name: `${interaction.guild.name}'s Queue`,
			// iconURL: interaction.guild.icon,
		})
		.setDescription(queueString)
		.setThumbnail(currentTrack.thumbnail)
		.setFooter({
			text: `Page ${queuePage + 1} of ${
				tracks.length
			}  |  Tracks Queued: ${queue.getSize()}  |  Total Duration: ${
				queue.durationFormatted
			}`,
		})
		.setColor('e8d5ac');
}
