/**
 * @author  i@angelmsger.com
 * @date    2019/12/22
 */

import Koa from 'koa';
import { WebConf } from '../conf';
import { interceptors } from '../interceptor';
import { rootRouter } from '../router';
import { ComponentName, IComponent } from './Common';

/**
 * start web service
 * @class WebComponent
 * @implements IComponent
 */
class WebComponent implements IComponent {
    public enable = WebConf.enable;
    public name = ComponentName.web;
    public relyOn = [
        ComponentName.banner,
        ComponentName.mongodb,
        ComponentName.cache
    ];

    /**
     * start web component
     * @override
     * @async
     */
    public async start(): Promise<Koa> {
        const app = new Koa();
        app.proxy = true;
        interceptors.forEach((interceptor) =>
            app.use(interceptor));
        app
            .use(rootRouter.routes())
            .use(rootRouter.allowedMethods())
            .listen(WebConf.port);
        return app;
    }

    /**
     * stop web component
     * @override
     * @async
     */
    public async stop(): Promise<void> {
        return;
    }
}

/**
 * web component
 */
export const webComponent = new WebComponent();
