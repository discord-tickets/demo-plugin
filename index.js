const fse = require('fs-extra');
const { join } = require('path');

const I18n = require('@eartharoid/i18n');

module.exports = (Plugin) => {
	return class DemoPlugin extends Plugin {
		constructor(client, id) {
			super(client, id, {
				name: 'Demo Plugin', // your plugin's human-friendly name
				commands: [ // and array of the names of the commands your plugin registers
					'demo'
				]
			});
		}

		// This function is called BEFORE the ready event, use it for setting up your plugin
		preload() {
			this.createDirectory(); // create the plugin directory if it doesn't exist, although the next line does this as well
			this.createConfig(require('./config')); // create config file if it doesn't exist

			fse.copySync(join(__dirname, 'locales'), join(this.directory.path, 'locales'), {
				overwrite: false, // don't reset the user's changes every time!
			}); // copy locale files to plugin directory for easy access so users can edit them

			this.i18n = new I18n(join(this.directory.path, 'locales'), 'en-GB'); // create a new I18n instance that can be accessed in commands (this.plugin.i18n)

			// if your plugin has advanced features, you may need to listen for events from the Client and TicketManager
			// you don't need to do this, but it's cleaner to separate the functions into their own files and load them dynamically 

			const scan = (path, array) => {
				let files = fse.readdirSync(path);
				array = array || [];
				files.forEach(file => {
					if (fse.statSync(`${path}/${file}`).isDirectory()) {
						array = scan(`${path}/${file}`, array);
					} else if (file.endsWith('.js')) {
						array.push(`${path}/${file}`);
					}
				});
				return array;
			}; // get an array of all the listener files (searches subdirectories)

			// load all of the listeners
			const listeners = scan(join(__dirname, 'listeners'));
			for (let listener of listeners) {
				listener = require(listener);
				const exec = (...args) => listener.execute(this.client, ...args);
				switch (listener.emitter.toLowerCase()) {
					case 'client':
						this.client.on(listener.event, exec);
						break;
					case 'client.tickets':
						this.client.tickets.on(listener.event, exec);
						break;
				}
			}
		}

		// This function is called AFTER the ready event, meaning you can create commands here
		load() {
			const {
				Command,
				OptionTypes
			} = this.helpers;
			// client is now ready
			// again, you don't need to do this, but it's cleaner to separate commands into their own files and load them dynamically
			const commands = fse.readdirSync(join(__dirname, 'commands'))
				.filter(file => file.endsWith('.js'));
			for (let command of commands) {
				try {
					command = require(`./commands/${command}`);
					new (command(Command, OptionTypes))(this.client);
				} catch (e) {
					this.client.log.error(e);
				}
			}
		}
	}
};