/**
 * @author  i@angelmsger.com
 * @date    2019/12/22
 */

import { IIoCContext } from '../IoC';

/**
 * prometheus metrics
 * @interface IMetrics
 */
export interface IMetrics {
    type: string;
    content: string;
}

/**
 * prometheus matrix service
 * @class PrometheusService
 */
export interface IPrometheusService {
    /**
     * count request
     * @param path - request path
     */
    requestLog(
        path: string
    ): Promise<void>;

    /**
     * count cache hit/miss
     * @param service - service name
     * @param isHit - if cache is hit
     */
    cacheLog(
        service: string,
        isHit: boolean
    ): Promise<void>;

    /**
     * get prometheus metrics
     */
    getMetrics(): Promise<IMetrics>;
}

/**
 * prometheus service and its factory symbol(for ioc usage)
 */
export const PrometheusServiceSymbol = Symbol.for('PrometheusService');
export const PrometheusServiceFactorySymbol = Symbol.for('PrometheusServiceFactory');

/**
 * factory function to prometheus service
 * @param context - ioc context
 */
export function getPrometheusServiceFactory(context: IIoCContext<IPrometheusService>) {
    return (): IPrometheusService => {
        const { container } = context;
        return container.get<IPrometheusService>(PrometheusServiceSymbol);
    };
}
