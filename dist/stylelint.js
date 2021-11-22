"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
module.exports = function (config) {
    const stylelint = require("stylelint");
    const srcDir = `${utils_1.utils.get(config, 'inputDirPath')}/${utils_1.utils.get(config, 'scss.inputDirName')}`;
    stylelint.lint({
        files: `${srcDir}/**/*.s?(a|c)ss`,
        formatter: 'verbose',
        fix: true,
    }).then(function (resultObject) {
        console.log(resultObject.output);
    }).catch(function (err) {
        console.error(err.stack);
    });
};
