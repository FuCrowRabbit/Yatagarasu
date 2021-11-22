"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
module.exports = function (config) {
    const isWatch = process.argv.includes('watch');
    const isProd = process.argv.includes('prod');
    const fs = require("fs");
    const path = require("path");
    const sass = require("sass");
    const postcss = require("postcss");
    const autoprefixer = require("autoprefixer");
    const stylelint = require("stylelint");
    const glob = require("glob");
    const makeDir = require("make-dir");
    const chokidar = require("chokidar");
    const srcDir = `${utils_1.utils.get(config, 'inputDirPath')}/${utils_1.utils.get(config, 'scss.inputDirName')}`;
    const distDir = `${utils_1.utils.get(config, 'outputDirPath')}/${utils_1.utils.get(config, 'scss.outputDirName')}`;
    const getTimeString = () => (new Date).toLocaleTimeString('ja', { timeZone: `${utils_1.utils.get(config, 'timeZone')}` });
    if (!fs.existsSync(`${utils_1.utils.get(config, 'cacheDirPath')}`))
        fs.mkdirSync(`${utils_1.utils.get(config, 'cacheDirPath')}`);
    glob(`**/*.s?(a|c)ss`, {
        cwd: srcDir,
        ignore: `**/_*.s?(a|c)ss`,
    }, (er, files) => {
        for (let fileName of files) {
            convert(fileName, srcDir, distDir);
        }
    });
    const convert = (fileName, srcDir, distDir) => {
        const distPath = path.resolve(distDir, fileName);
        // Sass
        const result = sass.renderSync({
            file: path.resolve(srcDir, fileName),
            outFile: path.basename(distPath, ".scss") + '.css',
            sourceMap: !isProd,
            sourceMapEmbed: !isProd,
            outputStyle: isProd ? `${utils_1.utils.get(config, 'scss.outputStyle.production')}` : `${utils_1.utils.get(config, 'scss.outputStyle.development')}`,
        });
        let css = result.css.toString();
        let cssMap = result.map;
        let cache = fs.existsSync(`${utils_1.utils.get(config, 'cacheDirPath')}/scss.json`) ? JSON.parse(fs.readFileSync(`${utils_1.utils.get(config, 'cacheDirPath')}/scss.json`).toString()) : null;
        result.stats.includedFiles.forEach(function (path) {
            if (cache !== null && cache.files !== null) {
                if (Array.isArray(cache.files[path])) {
                    if (cache.files[path].filter(_path => result.stats.entry === _path).length === 0)
                        cache.files[path].push(result.stats.entry);
                }
                else {
                    cache.files[path] = [];
                    cache.files[path].push(result.stats.entry);
                }
            }
            else {
                cache = { files: {} };
                cache.files[path] = [];
                cache.files[path].push(result.stats.entry);
            }
        });
        // Delete Property
        // @ts-ignore
        for (let [file] of Object.entries(cache.files).filter(p => p[1].filter(_path => _path === result.stats.entry).length !== 0)) {
            if (result.stats.includedFiles.filter(_path => _path === file).length === 0) {
                cache.files[file] = cache.files[file].filter(_path => _path !== result.stats.entry);
            }
        }
        // Refresh Cache file
        const newCache = { files: {} };
        // @ts-ignore
        for (let [file, targets] of Object.entries(cache.files).filter(p => p[1].length !== 0)) {
            newCache.files[file] = targets;
        }
        fs.writeFileSync(`${utils_1.utils.get(config, 'cacheDirPath')}/scss.json`, JSON.stringify(newCache));
        const cssPath = path.format({
            dir: path.dirname(distPath),
            name: path.basename(distPath, ".scss"),
            ext: ".css",
        });
        const cssMapPath = path.format({
            dir: path.dirname(distPath),
            name: path.basename(distPath, ".scss"),
            ext: ".css.map",
        });
        // PostCSS
        postcss([autoprefixer()]).process(css, { from: undefined, map: !isProd }).then(_result => {
            _result.warnings().forEach(warn => {
                console.warn(warn.toString());
            });
            css = _result.css;
        });
        if (!isWatch) {
            // Stylelint
            stylelint.lint({
                files: '**/*.s?(a|c)ss',
                formatter: 'verbose',
                fix: !isWatch,
            }).then(function (resultObject) {
                console.log(resultObject.output);
            }).catch(function (err) {
                console.error(err.stack);
            });
        }
        makeDir(path.dirname(distPath)).then(() => {
            fs.writeFile(cssPath, css, () => {
            });
            if (isProd) {
                fs.unlink(cssMapPath, () => {
                });
            }
            else {
                fs.writeFile(cssMapPath, cssMap, () => {
                });
            }
        });
        console.log(`[${getTimeString()}] Compiled: ${fileName} (${result.stats.duration}ms)`);
    };
    if (isWatch) {
        const watcher = chokidar.watch(`${utils_1.utils.get(config, 'inputDirPath')}/${utils_1.utils.get(config, 'scss.inputDirName')}/**/*.scss`, {
            usePolling: true,
        });
        watcher.on('change', changePath => {
            try {
                if (/_(.*).scss/.test(path.basename(changePath))) {
                    const cache = fs.existsSync(`${utils_1.utils.get(config, 'cacheDirPath')}/scss.json`) ? JSON.parse(fs.readFileSync(`${utils_1.utils.get(config, 'cacheDirPath')}/scss.json`).toString()) : null;
                    if (cache !== null && cache.files !== null) {
                        if (cache.files[changePath] !== undefined && Array.isArray(cache.files[changePath])) {
                            for (let fileName of cache.files[changePath]) {
                                if (fs.existsSync(fileName)) {
                                    convert(path.relative(srcDir, fileName), srcDir, distDir);
                                }
                            }
                        }
                    }
                }
                else {
                    convert(path.relative(srcDir, changePath), srcDir, distDir);
                }
            }
            catch (e) {
                console.error(e);
            }
        });
    }
};
