/**
 * @author  i@angelmsger.com
 * @date    2019/12/22
 */

import _ from 'lodash';
import moment from 'moment-timezone';
import { WebEndpoint } from '../conf/Web';
import { httpRequest } from '../util/Rquest';

/**
 * web service health check
 */
async function healthCheck(): Promise<void> {
    let exitCode = 0;
    try {
        const res = await httpRequest({
            url: `${ WebEndpoint }/health_check`,
            timeout: moment
                .duration(3, 'seconds')
                .asMilliseconds()
        });
        if (!res) {
            exitCode = 1;
        } else {
            const status = _.get(res, ['status'], 'failed');
            if (status !== 'success') {
                exitCode = 2;
            }
        }
    } catch (err) {
        exitCode = 3;
    }
    // adapt with docker HEALTH CHECK exit code
    process.exit(exitCode === 0 ? 0 : 1);
}

_.noop(healthCheck());
