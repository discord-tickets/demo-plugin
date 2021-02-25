let plugin;
module.exports = () => {
	if (plugin) return plugin;
	try {
		const { name } = require('./package.json');
		if (name.includes('@') || name.includes('/'))
			plugin = require('../../../src/modules/plugins');
		else
			plugin = require('../../src/modules/plugins');
	} catch {
		plugin = require('../../../src/modules/plugins');
	} finally {
		return plugin;
	}
};