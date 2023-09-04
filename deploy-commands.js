// Command deployment script from DiscordJS documentation

const { REST, Routes } = require('discord.js');
const dotenv = require('dotenv');
const fs = require('node:fs');
const path = require('node:path');

dotenv.config();

const commands = [];

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs
    .readdirSync(commandsPath)
    .filter(file => file.endsWith('.js'));

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
commandFiles.forEach(file =>
{
    const filePath = path.join(commandsPath, file);
    console.log(filePath);
    const command = require(filePath);
    if ('data' in command && 'execute' in command)
        commands.push(command.data.toJSON());
    else
        console.warn(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
});

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(process.env.DISCORD_TOKEN);

// and deploy your commands!
(async () =>
{
    try
    {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        // The put method is used to fully refresh all commands in the guild with the current set
        const data = await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            // Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands },
        );

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    }
    catch (e)
    {
        // And of course, make sure you catch and log any errors!
        console.error(e, e.stack);
    }
})();
