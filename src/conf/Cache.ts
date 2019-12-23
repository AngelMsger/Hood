import _ from 'lodash';
import { getFlag, getPort, getProperty } from './Common';

export const CacheConf = {
    enable: getFlag('CACHE_ENABLE', true),
    host: getProperty('REDIS_HOST', 'localhost'),
    port: getPort('REDIS_PORT', 6379),
    db: _
        .chain(getProperty('REDIS_DB', '0'))
        .toInteger()
        .clamp(0, 15)
        .value(),
    pass: getProperty('REDIS_PASS')
};
