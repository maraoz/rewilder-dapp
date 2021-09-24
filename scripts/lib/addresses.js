const fs = require("fs");
const path = require('path');
const contractAddressFile = `${config.paths.artifacts}${path.sep}..${path.sep}addresses-${network.name}.json`
module.exports = JSON.parse(fs.readFileSync(contractAddressFile));