"use strict";
module.exports = {
    timeZone:      'Asia/Tokyo',
    inputDirPath:  `${process.cwd()}/resources`,
    outputDirPath: `${process.cwd()}/public`,
    cacheDirPath:  `${process.cwd()}/.yatagarasu-cache`,
    browserProxy:  `localhost`,
    browserOpen:   false,

    scss: {
        inputDirName:  'scss',
        outputDirName: 'css',
        outputStyle:   {
            development: 'expanded',
            production:  'compressed',
        },
    },
};
