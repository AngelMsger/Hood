/**
 * @author  i@angelmsger.com
 * @date    2019/12/22
 */

import _ from 'lodash';
import mongoose, { Connection } from 'mongoose';
import { promisify } from 'util';
import { MongoDBConf } from '../conf';
import { ComponentName, IComponent } from './Common';

/**
 * db singleton
 */
export let db: Connection;

/**
 * connect to mongodb
 * @class MongoDBComponent
 * @implements IComponent
 */
class MongoDBComponent implements IComponent {
    public enable = true;
    public name = ComponentName.mongodb;
    public relyOn = [ComponentName.banner];

    /**
     * start mongodb component
     * @override
     * @async
     */
    public async start(): Promise<Connection> {
        mongoose.set('useNewUrlParser', true);
        mongoose.set('useFindAndModify', false);
        mongoose.set('useCreateIndex', true);
        const auth = _
            .chain([
                MongoDBConf.user,
                MongoDBConf.pass
            ])
            .compact()
            .join(':')
            .value();
        const domain = _
            .chain([
                auth, `${ MongoDBConf.host }:${ MongoDBConf.port }`
            ])
            .compact()
            .join('@')
            .value();
        const url = `mongodb://${ domain }/${ MongoDBConf.db }`;
        return await promisify<Connection>((callback) => {
            const options = {
                autoReconnect: true,
                reconnectTries: Number.MAX_VALUE,
                reconnectInterval: 5000,
                connectTimeoutMS: 5000,
                socketTimeoutMS: 5000
            };
            const reconnect = _.debounce(() => {
                db.openUri(url, options).catch(reconnect);
            }, 5000);
            const conn = mongoose.createConnection(url, options);
            db = conn;
            db.once('connected', () => {
                reconnect.cancel();
                return callback(null, db);
            });
            conn.catch(reconnect);
            db.on('err', reconnect);
        })();
    }

    /**
     * stop mongodb component
     * @override
     * @async
     */
    public async stop(): Promise<void> {
        return await mongoose.disconnect();
    }
}

/**
 * mongodb component
 */
export const mongodbComponent = new MongoDBComponent();

/**
 * db instance factory
 */
export function getMongoDBInstance() {
    return (): Connection => db;
}

/**
 * factory symbol(for ioc usage)
 */
export const MongoDBFactorySymbol = Symbol.for('MongoDBInstance');
