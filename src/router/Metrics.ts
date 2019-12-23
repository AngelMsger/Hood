/**
 * @author  i@angelmsger.com
 * @date    2019/12/22
 */

import Router from '@koa/router';
import * as MetricsController from '../controller/Metrics';

/**
 * matrix router
 */
export const matrixRouter = new Router();

matrixRouter.get('/', MetricsController.doGetMatrix);
