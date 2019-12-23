/**
 * @author  i@angelmsger.com
 * @date    2019/12/22
 */

/**
 * component interface
 * @interface IComponent
 */
export interface IComponent {
    name: ComponentName;
    enable: boolean;
    relyOn?: string[];

    /**
     * start component
     */
    start(): Promise<unknown>;

    /**
     * stop component
     */
    stop(): Promise<void>;
}

/**
 * component names enum
 * @enum ComponentName
 */
export enum ComponentName {
    banner = 'banner',
    web = 'web',
    mongodb = 'mongodb',
    wakatime = 'wakatime',
    cache = 'cache'
}
