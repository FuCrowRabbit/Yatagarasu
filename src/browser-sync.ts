"use strict";
import {IConfig} from "config";
import {utils} from "./utils";

module.exports = function (config: IConfig) {
    const browserSync = require('browser-sync').create();

    browserSync.watch(`${utils.get(config, 'outputDirPath')}/**/*`, {usePolling: true,}, function (event, file) {
        console.log(`${event}: ${file}`);
        if (event === "change") {
            browserSync.reload(`${utils.get(config, 'outputDirPath')}/*`);
        }
    });

    browserSync.init({
                         open:  Boolean(utils.get(config, 'browserOpen')),
                         proxy: `${utils.get(config, 'browserProxy')}`,
                     });
}
