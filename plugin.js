module.exports = () => {
	try {
		const { name } = require('./package.json');
		if (name.includes('@') || name.includes('/'))
			return require('../../../src/modules/plugins');
		else
			return require('../../src/modules/plugins');
	} catch {
		return require('../../../src/modules/plugins');
	}
};