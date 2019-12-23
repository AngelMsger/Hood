/**
 * @author  i@angelmsger.com
 * @date    2019/12/22
 */

import _ from 'lodash';

/**
 * project name
 */
export const PROJECT_NAME = require('../../package.json').name;

/**
 * get boolean value from environment
 * @param key - environment key
 * @param defaultVal - default value
 */
export function getFlag(
    key: string,
    defaultVal = false
): boolean {
    const property = process.env[key];
    if (_.isUndefined(property)) {
        return defaultVal;
    } else {
        return _.chain(property)
            .trim()
            .toLower()
            .eq('true')
            .value();
    }
}

/**
 * get string value from environment
 * @param key - environment key
 * @param defaultVal - default value
 */
export function getProperty(
    key: string,
    defaultVal = ''
): string {
    return _.chain(process.env)
        .get([key], defaultVal)
        .trim()
        .value();
}

/**
 * get unix socket port from environment
 * @param key - environment key
 * @param defaultVal - default value
 */
export function getPort(
    key: string,
    defaultVal: number
): number {
    return _.chain(process.env)
        .get([key], defaultVal)
        .toInteger()
        .clamp(1, 65535)
        .value();
}
