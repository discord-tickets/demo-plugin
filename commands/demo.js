const { MessageEmbed } = require('discord.js');
const {
	Command,
	OptionTypes
} = require('../command')();

module.exports = class DemoCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'demo',
			description: 'A demo plugin demo command for DiscordTickets',
			options: []
		});
	}

	async execute({ guild, member, channel, args }, interaction) {

		let settings = await guild.settings;
		const i18n = this.plugin.i18n.get(settings.locale);

		channel.send(
			new MessageEmbed()
				.setColor(settings.colour)
				.setTitle(i18n('cmd.demo.title'))
				.setDescription(i18n('cmd.demo.description', this.name, this.plugin.name))
		);

	}
};
