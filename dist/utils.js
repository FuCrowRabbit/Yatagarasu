"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.utils = void 0;
exports.utils = {
    get: (config, key) => config.has(`${key}`) ? config.get(`${key}`) : config.get(`default.${key}`),
};
