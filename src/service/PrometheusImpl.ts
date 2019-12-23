/**
 * @author  i@angelmsger.com
 * @date    2019/12/22
 */

import { Counter, Registry } from 'prom-client';
import { Service } from '../decorator';
import { IMetrics, IPrometheusService } from './Prometheus';

const registry = new Registry();

const requestCounter = new Counter({
    name: 'request',
    help: 'request counter',
    labelNames: ['path']
});

const cacheCounter = new Counter({
    name: 'cache',
    help: 'cache counter',
    labelNames: ['service', 'hit']
});

registry.registerMetric(requestCounter);
registry.registerMetric(cacheCounter);

/**
 * prometheus matrix service
 * @class PrometheusService
 * @implements IPrometheusService
 */
@Service
export class PrometheusService implements IPrometheusService {
    /**
     * count request
     * @param path - request path
     * @override
     */
    public async requestLog(
        path: string
    ): Promise<void> {
        requestCounter
            .labels(path)
            .inc(1);
    }

    /**
     * count cache hit/miss
     * @param service - service name
     * @param isHit - if cache is hit
     * @override
     */
    public async cacheLog(
        service: string,
        isHit: boolean
    ): Promise<void> {
        cacheCounter
            .labels(service, isHit ? 'H' : 'M')
            .inc(1);
    }

    /**
     * get prometheus metrics
     * @override
     */
    public async getMetrics(): Promise<IMetrics> {
        return {
            type: registry.contentType,
            content: registry.metrics()
        };
    }
}
