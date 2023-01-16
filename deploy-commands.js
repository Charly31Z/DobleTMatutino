require('dotenv').config();

const { REST, Routes } = require('discord.js');
const fs = require('fs');

const TOKEN = process.env.TOKEN;
const ID = process.env.ID;

const commands = [];

const commandsFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandsFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
    try {
        console.log(`Empezando a recargar ${commands.length} comandos...`);

        const data = await rest.put(
            Routes.applicationCommands(ID),
            { body: commands },
        );

        console.log(`Se recargo ${data.length} comandos exitosamente.`);
    } catch(error) {
        console.error(error);
    }
})();