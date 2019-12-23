/**
 * @author  i@angelmsger.com
 * @date    2019/12/22
 */

import chalk from 'chalk';
import { CronJob } from 'cron';
import _ from 'lodash';
import moment from 'moment-timezone';
import { EnvConf, WakatimeConf } from '../conf';
import { container } from '../IoC';
import { IWakatimeService, WakatimeServiceSymbol } from '../service/Wakatime';
import { logger } from '../util/Logger';
import { ComponentName, IComponent } from './Common';

/**
 * wakatime api fetcher cron job
 * @class WakatimeComponent
 * @implements IComponent
 */
class WakatimeComponent implements IComponent {
    public enable = WakatimeConf.enable;
    public name = ComponentName.wakatime;
    public relyOn = [
        ComponentName.banner,
        ComponentName.mongodb
    ];

    protected job: CronJob;

    /**
     * constructor
     * @constructor
     */
    public constructor() {
        this.job = new CronJob(
            WakatimeConf.cron, async () => this.onTick(),
            _.noop, false, EnvConf.tz, this
        );
    }

    /**
     * start wakatime component
     * @override
     */
    public async start(): Promise<void> {
        await this.onTick();
        return this.job.start();
    }

    /**
     * stop wakatime component
     * @override
     */
    public async stop(): Promise<void> {
        return this.job.stop();
    }

    /**
     * actual cron job runner
     * @protected
     * @async
     */
    protected async onTick(): Promise<void> {
        const wakatimeService = container.get<IWakatimeService>(WakatimeServiceSymbol);
        const now = moment().tz(EnvConf.tz);
        try {
            await wakatimeService.fetchAndPersistSummaryByDate(now);
        } catch (err) {
            logger.error(chalk.bgRed.gray.bold(err.message), err);
        }
    }
}

export const wakatimeComponent = new WakatimeComponent();
