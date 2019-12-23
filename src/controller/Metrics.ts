/**
 * @author  i@angelmsger.com
 * @date    2019/12/22
 */

import { ParameterizedContext } from 'koa';
import { container } from '../IoC';
import { IPrometheusService, PrometheusServiceFactorySymbol } from '../service/Prometheus';

/**
 * service factory
 * @function
 */
const prometheusServiceFactory = container
    .get<() => IPrometheusService>(PrometheusServiceFactorySymbol);

/**
 * metrics router
 * @param context - http context
 */
export async function doGetMatrix(
    context: ParameterizedContext
): Promise<void> {
    const prometheusService = prometheusServiceFactory();
    const metrics = await prometheusService.getMetrics();
    context.header['Content-Type'] = metrics.type;
    context.body = metrics.content;
}
