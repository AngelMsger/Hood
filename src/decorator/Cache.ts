/**
 * @author  i@angelmsger.com
 * @date    2019/12/22
 */

import crypto from 'crypto';
import _ from 'lodash';
import { getCacheInstance } from '../component/Cache';
import { CacheConf } from '../conf/Cache';
import { IPrometheusService, PrometheusServiceSymbol } from '../service/Prometheus';
import { MethodDescriptorValue } from './IoC';

/**
 * async function
 * @type AsyncFunction
 */
type AsyncFunction<T = unknown> = (...args: unknown[]) => Promise<T>;

/**
 * cache decorator
 * @param ttl - cache ttl
 * @param serialize - serialize function, run before write to cache
 * @param deserialize - deserialize function, run after read from cache
 */
export function Cache(
    ttl = 0,
    serialize = JSON.stringify,
    deserialize = JSON.parse
): MethodDecorator {
    return (
        target, propertyKey, descriptor
    ) => {
        const targetName = target.constructor.name;
        if (!CacheConf.enable || !targetName) return;
        const fetch = descriptor.value as unknown;
        const cachePrefix = _
            .chain([
                _.get(target, ['name']),
                String(propertyKey)
            ])
            .compact()
            .join(':')
            .value();

        /**
         * read with cache
         * @param args - original arguments
         * @async
         */
        async function withCache<T>(
            ...args: unknown[]
        ): Promise<T> {
            const { container } = await import('../IoC');
            const prometheusService = container
                .get<IPrometheusService>(PrometheusServiceSymbol);
            const cache = getCacheInstance()();
            const hash = crypto
                .createHash('sha1')
                .update(JSON.stringify([...args]))
                .digest('base64');
            const cacheKey = `${ cachePrefix }:${ hash }`;
            const cacheVal = await cache.get(cacheKey);
            // fixme: avoid cache penetration
            if (_.isNil(cacheVal)) {
                await prometheusService.cacheLog(cachePrefix, false);
                const fetchVal = await (fetch as AsyncFunction<T>).apply(this, args);
                if (ttl) {
                    await cache.set(cacheKey, serialize(fetchVal), 'EX', ttl);
                } else {
                    await cache.set(cacheKey, serialize(fetchVal));
                }
                return fetchVal;
            } else {
                await prometheusService.cacheLog(cachePrefix, true);
                return deserialize(cacheVal);
            }
        }

        descriptor.value = withCache as MethodDescriptorValue;
    };
}
