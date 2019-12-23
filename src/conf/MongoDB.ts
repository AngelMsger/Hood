/**
 * @author  i@angelmsger.com
 * @date    2019/12/22
 */

import { getPort, getProperty, PROJECT_NAME } from './Common';

/**
 * configuration for mongodb
 * @constant
 */
export const MongoDBConf = {
    host: getProperty('MONGO_HOST', 'localhost'),
    port: getPort('MONGO_PORT', 27017),

    db: getProperty('MONGO_DB', PROJECT_NAME),
    user: getProperty('MONGO_USER'),
    pass: getProperty('MONGO_PASS')
};
