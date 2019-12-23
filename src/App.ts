/**
 * @author  i@angelmsger.com
 * @date    2019/12/22
 */

import chalk from 'chalk';
import _ from 'lodash';
import 'reflect-metadata';
import { App } from './component';
import { logger } from './util/Logger';

/**
 * bootstrap application
 */
async function bootstrap(): Promise<void> {
    const app = new App();
    try {
        await app.start();
    } catch (err) {
        logger.error(
            chalk.bgRed.gray(`start up failed with: ${ err.message }`)
        );
    }
    process.on('uncaughtException', () => app.stop());
}

_.noop(bootstrap());
