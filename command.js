let command;
module.exports = () => {
	if (command) return command;
	try {
		const { name } = require('./package.json');
		if (name.includes('@') || name.includes('/'))
			command = require('../../../../src/modules/commands');
		else
			command = require('../../../src/modules/commands');
	} catch {
		command = require('../../../../src/modules/commands');
	} finally {
		return command;
	}
};