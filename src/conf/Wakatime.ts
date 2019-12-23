/**
 * @author  i@angelmsger.com
 * @date    2019/12/22
 */

import { getFlag, getProperty } from './Common';

/**
 * configuration for wakatime
 * @constant
 */
export const WakatimeConf = {
    enable: getFlag('WAKATIME_ENABLE', true),
    endpoint: getProperty('WAKATIME_ENDPOINT', 'https://wakatime.com'),
    username: getProperty('WAKATIME_USERNAME', 'angelmsger'),
    secretKey: getProperty('WAKATIME_SECRET_KEY'),

    cron: getProperty('WAKATIME_CRON', '* * 1 * * *')
};
