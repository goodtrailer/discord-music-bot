# Discord Youtube Bot

A discord bot used to play songs and videos from YouTube and Spotify in your server.

## Usage Instructions
Clone the repository
Run 'npm install .'
Download ffmpeg (I recommend this one for Windows users: https://blog.gregzaal.com/how-to-install-ffmpeg-on-windows/)
Make a .env file in the main directory with the following contents
    DISCORD_TOKEN=your-token-here
    CLIENT_ID=application-id-of-the-bot
    GUILD_ID=id-of-your-server (this one is optional and not used by default, but can be easily changed in deploy-commands.js)
Invite the bot to your server
Run 'node deploy-commands.js' and enjoy

*Linting rules can be modified in .eslintrc.json and commands are stored in the commands folder.