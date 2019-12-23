/**
 * @author  i@angelmsger.com
 * @date    2019/12/22
 */

import _ from 'lodash';
import chalk from 'chalk';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { EnvConf } from '../conf';
import { logger } from '../util/Logger';
import { ComponentName, IComponent } from './Common';

/**
 * promisify file reader
 * @function
 */
const readFile = promisify(fs.readFile);

/**
 * print banner when startup application
 * @class BannerComponent
 * @implements IComponent
 */
class BannerComponent implements IComponent {
    public enable = true;
    public name = ComponentName.banner;

    /**
     * start banner component
     * @override
     * @async
     */
    public async start(): Promise<void> {
        const banner = await readFile('resource/banner.txt');
        console.log(chalk.magenta.bold(banner));
        logger.info(chalk.magenta.bold(_.repeat('=', 64)));
        logger.info(`logger write to ${
            path.join(EnvConf.logPath, 'winston.log')
        }`);
    }

    /**
     * stop banner component
     * @override
     * @async
     */
    public async stop(): Promise<void> {
        console.log(chalk.magenta.bold('Bye!'));
    }
}

/**
 * banner component
 */
export const bannerComponent = new BannerComponent();
