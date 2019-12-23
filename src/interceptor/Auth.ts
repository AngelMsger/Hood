/**
 * @author  i@angelmsger.com
 * @date    2019/12/22
 */

import { Next, ParameterizedContext } from 'koa';

/**
 * auth interceptor
 * todo: implement this function if it is needed
 * @param context - http context
 * @param next - function to next interceptor
 * @async
 */
export async function AuthInterceptor(
    context: ParameterizedContext,
    next: Next
): Promise<void> {
    await next();
}
