// Require the necessary discord.js classes
const {
    Client,
    Collection,
    Events,
    GatewayIntentBits,
    EmbedBuilder,
} = require('discord.js');
const { Player } = require('discord-player');
const {
    YouTubeExtractor,
    SpotifyExtractor,
} = require('@discord-player/extractor');
const fs = require('node:fs');
const path = require('node:path');
const dotenv = require('dotenv');

dotenv.config();

// Create a new client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        'GuildVoiceStates',
    ],
});

const player = new Player(client);

async function setupPlayer()
{
    await player.extractors.register(YouTubeExtractor, {});
    await player.extractors.register(SpotifyExtractor, {});
    // await player.extractors.loadDefault();
}

setupPlayer().then(() =>
{
    player.events.on('playerStart', (queue, track) =>
    {
        // we will later define queue.metadata object while creating the queue
        // queue.metadata.channel.send(`Started playing **${track.title}**!`);
        queue.metadata.channel.send({
            embeds: [
                new EmbedBuilder().setDescription(
                    `Started playing **${track.title}**!`,
                ),
            ],
        });
    });

    /*
        Dynamic command retrieval -> Looks in the commands subdirectory and filters out all the
        non-js files. Afterwards, set the js files as commands Sourced from DiscordJS documentation
    */
    client.commands = new Collection();

    const commandsPath = path.join(__dirname, 'commands');
    const commandFiles = fs
        .readdirSync(commandsPath)
        .filter(file => file.endsWith('.js'));

    commandFiles.forEach(file =>
    {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);

        // Set a new item in the Collection with the key as the command name and the value as the
        // exported module
        if ('data' in command && 'execute' in command)
            client.commands.set(command.data.name, command);
        else
            console.warn(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    });

    // Error handling incase something goes wrong while executing the command
    // Sourced from DiscordJS documentation
    client.on(Events.InteractionCreate, async interaction =>
    {
        if (!interaction.isChatInputCommand())
            return;

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command)
        {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try
        {
            await command.execute(interaction);
        }
        catch (e)
        {
            console.error(e, e.stack);
            // Ephemeral means to display the message only to the user executing the command
            if (interaction.replied || interaction.deferred)
            {
                await interaction.followUp({
                    content: 'There was an error while executing this command!',
                    ephemeral: true,
                });
            }
            else
            {
                await interaction.reply({
                    content: 'There was an error while executing this command!',
                    ephemeral: true,
                });
            }
        }
    });

    // When the client is ready, run this code (only once)
    // We use 'c' for the event parameter to keep it separate from the already defined 'client'
    client.once(Events.ClientReady, c =>
    {
        console.log(`Ready! Logged in as ${c.user.tag}`);
    });

    // Log in to Discord with your client's token
    client.login(process.env.DISCORD_TOKEN);
});
