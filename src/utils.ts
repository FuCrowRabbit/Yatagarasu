"use strict"
import {IConfig} from "config";

export const utils = {
    get : (config: IConfig, key: string) => config.has(`${key}`) ? config.get(`${key}`) : config.get(`default.${key}`),
}