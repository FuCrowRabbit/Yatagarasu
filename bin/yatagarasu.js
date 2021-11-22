#!/usr/bin/env node

const config     = require("config");
const baseConfig = require('../dist/config/default');
config.util.setModuleDefaults('default', baseConfig);

const mode = process.argv[2];
if (mode === '-v' || mode === '--version' || mode === 'version') {
    process.stdout.write(
        `Yatagarasu ${require('../package.json').version}\n`
    );
} else if (mode === 'config') {
    console.log(config);
} else if (mode === 'scss') {
    require('../dist/scss')(config);
    if (process.argv.includes('watch')) require('../dist/browser-sync')(config);
} else if (mode === 'stylelint') {
    require('../dist/stylelint')(config);
} else {
    process.stdout.write(
        `Yatagarasu ${require('../package.json').version}\n` +
        '\n' +
        'Options:\n' +
        '  config     :Show configure\n' +
        '  scss       :Compile SCSS for development\n' +
        '  scss prod  :Compile SCSS for production\n' +
        '  scss watch :Compile SCSS and build server\n' +
        '  stylelint  :Format with Stylelint\n' +
        '  version    :Show version number\n' +
        '\n' +
        'Usage:\n' +
        '  yatagarasu scss\n'
    );
}
