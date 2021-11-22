"use strict";
import {IConfig} from "config";
import {utils} from "./utils";

module.exports = function (config: IConfig) {
    const stylelint = require("stylelint");

    const srcDir = `${utils.get(config, 'inputDirPath')}/${utils.get(config, 'scss.inputDirName')}`;

    stylelint.lint({
                       files:     `${srcDir}/**/*.s?(a|c)ss`,
                       formatter: 'verbose',
                       fix:       true,
                   }).then(function (resultObject) {
        console.log(resultObject.output);
    }).catch(function (err) {
        console.error(err.stack);
    });
}
