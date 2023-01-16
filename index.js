require('dotenv').config();

const fs = require('fs');
const path = require('path');

const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');
const TOKEN = process.env.TOKEN;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandsFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandsFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[Advertencia] El comando ${filePath} no contiene la propiedad "data" o "execute".`);
    }
}

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No se encontro el comando ${interaction.commandName}.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (err) {
        console.error(err);
        await interaction.reply({ content: 'Hubo un error al ejecutar el comando...', ephemeral: true });
    }
});

client.once(Events.ClientReady, c => {
    console.log("Ando listo");
});

client.login(TOKEN);