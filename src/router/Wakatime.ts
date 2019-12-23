/**
 * @author  i@angelmsger.com
 * @date    2019/12/22
 */

import Router from '@koa/router';
import * as WakatimeController from '../controller/Wakatime';

/**
 * wakatime router
 */
export const wakatimeRouter = new Router();

wakatimeRouter.get('/user/summary', WakatimeController.doGetUserSummary);
