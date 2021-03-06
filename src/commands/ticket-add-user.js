const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { botLogs, staffRole, ticketsChannel, ticketsCategory } = require('./commands_config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('add-user')
		.setDescription('Adiciona um user ao ticket onde é chamado')
        .addUserOption(option =>
			option
				.setName('user')
				.setDescription('Pessoa a adicionar')
				.setRequired(true),
			),
	async execute(interaction) {
		if (!interaction.member.roles.cache.has(staffRole)) {
			return interaction.reply({
				content: 'Não tens permissões para usar este comando.',
				ephemeral: true,
			});
		}
        if (interaction.channel.parentId != ticketsCategory ||
            interaction.channel.id == ticketsChannel) {
            return interaction.reply({
                content: 'Isto não é um ticket!',
                ephemeral: true,
           });
        }
        await interaction.channel.permissionOverwrites.edit(interaction.options.getUser('user'), {
			VIEW_CHANNEL: true,
		});
		const date = new Date();
		const cDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
		const cTime = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
		const dateTime = cDate + ' | ' + cTime;
		interaction.guild.channels.fetch(botLogs).then(logChannel =>
			{ logChannel.send(`${dateTime}: <@${interaction.user.id}> added ${interaction.options.getUser('user')} to ${interaction.channel.name}.`);
		});
		fs.appendFile('logs.txt', `${dateTime}: ${interaction.user.username} added ${interaction.options.getUser('user')} to ${interaction.channel.name}.\n`, err => {
			if (err) {
				return console.error(err);
			}
		});
		return interaction.reply({
			content: 'User adicionado!',
			ephemeral: true,
		});
	},
};