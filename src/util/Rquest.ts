/**
 * @author  i@angelmsger.com
 * @date    2019/12/22
 */

import request, { CoreOptions, RequiredUriUrl } from 'request';

export async function httpRequest<T = unknown>(
    options: CoreOptions & RequiredUriUrl
): Promise<T> {
    return new Promise((onResolve, onReject) => {
        request(options, (err, res, body): void => {
            if (err || !res || !body) {
                return onReject(err);
            } else {
                if (res.statusCode !== 200) {
                    return onResolve();
                } else {
                    return onResolve(body);
                }
            }
        });
    });
}
