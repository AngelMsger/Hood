/**
 * @author  i@angelmsger.com
 * @date    2019/12/22
 */

import url from 'url';
import { getFlag, getPort, getProperty } from './Common';

/**
 * configuration for web
 * @constant
 */
export const WebConf = {
    enable: getFlag('WEB_ENABLE', true),
    protocol: getProperty('WEB_PROTOCOL', 'http'),
    host: getProperty('WEB_HOST', 'localhost'),
    port: getPort('WEB_PORT', 3000),
    path: getProperty('WEB_PATH')
};

/**
 * self endpoint
 * @constant
 */
export const WebEndpoint = url.format({
    protocol: WebConf.protocol,
    hostname: WebConf.host,
    port: WebConf.port,
    pathname: WebConf.path
});
