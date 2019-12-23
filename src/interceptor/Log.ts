/**
 * @author  i@angelmsger.com
 * @date    2019/12/22
 */

import chalk from 'chalk';
import { Next, ParameterizedContext } from 'koa';
import moment from 'moment-timezone';
import { container } from '../IoC';
import { IPrometheusService, PrometheusServiceFactorySymbol } from '../service/Prometheus';
import { logger } from '../util/Logger';

/**
 * service factory
 * @function
 */
const prometheusServiceFactory = container
    .get<() => IPrometheusService>(PrometheusServiceFactorySymbol);

/**
 * simply log request information
 * @param context - http context
 * @param next - function to next interceptor
 * @async
 */
export async function LogInterceptor(
    context: ParameterizedContext,
    next: Next
): Promise<void> {
    const start = moment();
    const prometheusService = prometheusServiceFactory();
    await prometheusService.requestLog(context.path);
    try {
        await next();
        logger.info(`${
            chalk.bgGray.green.bold('[ success ]')
        } ${
            context.originalUrl
        } ${
            moment().diff(start, 'ms')
        }ms`);
    } catch (err) {
        logger.warn(`${
            chalk.bgGray.red.bold('[ failed ]')
        } ${
            context.originalUrl
        } ${
            moment().diff(start, 'ms')
        }ms`);
        logger.error(chalk.bgRed.gray.bold(err.message), err);
        context.throw(502, err.message);
    }
}
