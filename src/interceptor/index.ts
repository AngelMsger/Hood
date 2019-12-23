/**
 * @author  i@angelmsger.com
 * @date    2019/12/22
 */

import { Middleware } from 'koa';
import bodyParser from 'koa-bodyparser';
import { AuthInterceptor } from './Auth';
import { LogInterceptor } from './Log';

/**
 * interceptors
 */
export const interceptors: Middleware[] = [
    bodyParser({ enableTypes: ['json'] }),
    LogInterceptor,
    AuthInterceptor
];
