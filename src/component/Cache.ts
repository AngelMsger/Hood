/**
 * @author  i@angelmsger.com
 * @date    2019/12/22
 */

import IORedis, {Redis} from 'ioredis';
import { CacheConf } from '../conf/Cache';
import { ComponentName, IComponent } from './Common';

/**
 * cache singleton
 */
export let cache: Redis;

/**
 * connect to redis
 * @class CacheComponent
 * @implements IComponent
 */
class CacheComponent implements IComponent {
    public enable = true;
    public name = ComponentName.cache;
    public relyOn = [ComponentName.banner];

    /**
     * start cache component
     * @override
     * @async
     */
    public async start(): Promise<Redis> {
        return (cache = new IORedis({
            host: CacheConf.host,
            port: CacheConf.port,
            db: CacheConf.db,
            // avoid empty string
            password: CacheConf.pass || undefined
        }));
    }

    /**
     * stop cache component
     * @override
     * @async
     */
    public async stop(): Promise<void> {
        await cache.disconnect();
    }
}

/**
 * cache component
 */
export const cacheComponent = new CacheComponent();

/**
 * cache instance factory
 */
export function getCacheInstance() {
    return (): Redis => cache;
}
