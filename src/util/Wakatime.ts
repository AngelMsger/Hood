/**
 * @author  i@angelmsger.com
 * @date    2019/12/22
 */

import url from 'url';
import { WakatimeConf } from '../conf';
import { httpRequest } from './Rquest';

const authorization = `Basic ${ Buffer
    .from(WakatimeConf.secretKey)
    .toString('base64') }`;

export async function fetchWakatimeApi(
    options: {
        method: 'GET' | 'POST';
        path: string;
        query?: object;
        body?: object;
    }
): Promise<unknown> {
    return httpRequest({
        url: `${ url.resolve(WakatimeConf.endpoint, options.path) }`,
        headers: { 'Authorization': authorization },
        qs: options.query,
        body: options.body,
        json: true
    });
}
