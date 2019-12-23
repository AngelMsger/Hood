/**
 * @author  i@angelmsger.com
 * @date    2019/12/22
 */

import async, { AsyncAutoTasks, AsyncResultCallback } from 'async';
import chalk from 'chalk';
import _ from 'lodash';
import { callbackify } from 'util';
import { logger } from '../util/Logger';
import { bannerComponent } from './Banner';
import { cacheComponent } from './Cache';
import { ComponentName, IComponent } from './Common';
import { mongodbComponent } from './MongoDB';
import { wakatimeComponent } from './Wakatime';
import { webComponent } from './Web';

/**
 * component tasks
 * @type ComponentTasks
 */
type ComponentTasks = AsyncAutoTasks<Partial<Record<ComponentName, unknown>>, Error>;

/**
 * backend application
 * @class App
 */
export class App {
    /**
     * components
     * @protected
     */
    protected components: IComponent[] = [
        bannerComponent,
        mongodbComponent,
        wakatimeComponent,
        webComponent,
        cacheComponent
    ];

    /**
     * start enabled components ordered by dependency
     * @async
     */
    public async start(): Promise<Partial<Record<ComponentName, unknown>>> {
        const { components } = this;
        const tasks = components.reduce((memo, component) => {
            const { name, relyOn } = component;
            const startComponent = (
                callback: AsyncResultCallback<unknown>
            ): void => {
                callbackify(async (): Promise<void> => {
                    if (!component.enable) return;
                    await component.start();
                    logger.info(`component ${ chalk.green(component.name) } started...`);
                })(callback);
            };
            return _.set(memo, [name], relyOn && relyOn.length > 0
                ? [...relyOn, (
                    results: unknown,
                    callback: AsyncResultCallback<unknown>
                ): void => startComponent(callback)]
                : startComponent);
        }, {} as ComponentTasks);
        return new Promise((onResolve, onReject) => {
            async.auto(tasks, (err, results): void => {
                if (err || !results) {
                    logger.error(chalk.bgRed.gray.bold(err?.message || 'component start failed.'), err);
                    onReject(err);
                } else {
                    logger.info(chalk.green.bold('all component start success.'));
                    logger.info(chalk.magenta.bold(_.repeat('=', 64)));
                    onResolve(results);
                }
            });
        });
    }

    /**
     * stop enabled components ordered by dependency
     * @async
     */
    public async stop(): Promise<void> {
        const { components } = this;
        const refs: Record<string, ComponentName[]> = {};
        const tasks: ComponentTasks = {};
        components.forEach((component) => {
            _.forEach(component.relyOn, (dependency) => {
                _.defaults(refs, { [dependency]: [] });
                refs[dependency].push(component.name);
            });
        });
        components.forEach((component) => {
            const stopComponent = (
                callback: AsyncResultCallback<unknown>
            ): void => {
                callbackify(async (): Promise<void> => {
                    if (!component.enable) return;
                    await component.stop();
                    logger.info(`component ${ chalk.green(component.name) } stopped...`);
                })(callback);
            };
            const ref = refs[component.name];
            tasks[component.name] = ref && ref.length > 0
                ? [...ref, (results, callback): void => stopComponent(callback)]
                : stopComponent;
        });
        return new Promise((onResolve, onReject) => {
            async.auto(tasks, (err) =>
                (err) ? onReject(err) : onResolve()
            );
        });
    }
}
