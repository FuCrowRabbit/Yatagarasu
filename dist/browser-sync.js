"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
module.exports = function (config) {
    const browserSync = require('browser-sync').create();
    browserSync.watch(`${utils_1.utils.get(config, 'outputDirPath')}/**/*`, { usePolling: true, }, function (event, file) {
        console.log(`${event}: ${file}`);
        if (event === "change") {
            browserSync.reload(`${utils_1.utils.get(config, 'outputDirPath')}/*`);
        }
    });
    browserSync.init({
        open: Boolean(utils_1.utils.get(config, 'browserOpen')),
        proxy: `${utils_1.utils.get(config, 'browserProxy')}`,
    });
};
