/**
 * @author  i@angelmsger.com
 * @date    2019/12/22
 */

import Router from '@koa/router';
import * as path from 'path';
import { WebConf } from '../conf';
import { matrixRouter } from './Metrics';
import { wakatimeRouter } from './Wakatime';

/**
 * http root router
 * @desc path is needed when deploy with a prefix
 *       such like http://example.com/prefix
 */
export const rootRouter = new Router({
    prefix: path.join('/', WebConf.path)
});

rootRouter.use('/wakatime', wakatimeRouter.routes());
rootRouter.use('/metrics', matrixRouter.routes());
