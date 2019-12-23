/**
 * @author  i@angelmsger.com
 * @date    2019/12/22
 */

import { ParameterizedContext } from 'koa';
import moment from 'moment-timezone';
import { EnvConf } from '../conf';
import { container } from '../IoC';
import { IWakatimeService, WakatimeServiceFactorySymbol } from '../service/Wakatime';

/**
 * service factory
 * @function
 */
const wakatimeServiceFactory = container
    .get<() => IWakatimeService>(WakatimeServiceFactorySymbol);

/**
 * get user wakatime summary
 * @param context - http context
 * @async
 */
export async function doGetUserSummary(
    context: ParameterizedContext
): Promise<void> {
    const wakatimeService = wakatimeServiceFactory();
    const now = moment().tz(EnvConf.tz);
    context.body = await wakatimeService.getSummariesByDateRange(
        moment(now).startOf('day'),
        moment(now).endOf('day')
    );
}
