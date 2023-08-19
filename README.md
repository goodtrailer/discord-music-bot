# Discord Youtube Bot

A discord bot used to play songs and videos from YouTube and Spotify in your server. Most of the code is sourced from the DiscordJS and Discord Player documentation located at https://discordjs.guide/#before-you-begin and https://discord-player.js.org/guide/welcome/welcome.

## Usage Instructions
1. Clone the repository
2. Run 'npm install .'
3. Download ffmpeg (I recommend this one for Windows users: https://blog.gregzaal.com/how-to-install-ffmpeg-on-windows/)
4. Make a .env file in the main directory with the following contents
    - DISCORD_TOKEN=your-token-here
    - CLIENT_ID=application-id-of-the-bot
    - GUILD_ID=id-of-your-server (this one is optional and not used by default, but can be easily changed in deploy-commands.js)
5. Invite the bot to your server
6. Run 'node deploy-commands.js' and enjoy

*Linting rules can be modified in .eslintrc.json and commands are stored in the commands folder.