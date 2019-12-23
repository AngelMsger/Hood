/**
 * @author  i@angelmsger.com
 * @date    2019/12/22
 */

import os from 'os';
import { getProperty } from './Common';

/**
 * configuration for base environment
 * @constant
 */
export const EnvConf = {
    tz: getProperty('TIMEZONE', 'Asia/Shanghai'),
    logPath: getProperty('LOG_PATH', os.tmpdir())
};
