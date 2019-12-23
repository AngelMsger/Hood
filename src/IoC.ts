/**
 * @author  i@angelmsger.com
 * @date    2019/12/22
 */

import { Container, interfaces } from 'inversify';
import { Connection } from 'mongoose';
import { getMongoDBInstance, MongoDBFactorySymbol } from './component/MongoDB';
import { WakatimeSummaryDao, WakatimeSummaryDaoSymbol } from './dao/wakatime/Summary';
import { WakatimeSummaryEntity, WakatimeSummaryEntitySymbol } from './entity/wakatime/Summary';
import {
    getPrometheusServiceFactory,
    IPrometheusService,
    PrometheusServiceFactorySymbol,
    PrometheusServiceSymbol
} from './service/Prometheus';
import { PrometheusService } from './service/PrometheusImpl';
import {
    getWakatimeServiceFactory,
    IWakatimeService,
    WakatimeServiceFactorySymbol,
    WakatimeServiceSymbol
} from './service/Wakatime';
import { WakatimeService } from './service/WakatimeImpl';

/**
 * ioc context
 * @interface IIoCContext
 */
export interface IIoCContext<T> {
    container: {
        get<T>(identifier: string | symbol | Function): T;
    };
}

const container = new Container();

// Entity

container
    .bind<WakatimeSummaryEntity>(WakatimeSummaryEntitySymbol)
    .to(WakatimeSummaryEntity)
    .inSingletonScope();

// Dao

container
    .bind<WakatimeSummaryDao>(WakatimeSummaryDaoSymbol)
    .to(WakatimeSummaryDao);

// Service

container
    .bind<IWakatimeService>(WakatimeServiceSymbol)
    .to(WakatimeService);

container
    .bind<interfaces.Factory<IWakatimeService>>(WakatimeServiceFactorySymbol)
    .toFactory<IWakatimeService>(getWakatimeServiceFactory);

container
    .bind<IPrometheusService>(PrometheusServiceSymbol)
    .to(PrometheusService);

container
    .bind<interfaces.Factory<IPrometheusService>>(PrometheusServiceFactorySymbol)
    .toFactory<IPrometheusService>(getPrometheusServiceFactory);

// Other

container
    .bind<Connection>(MongoDBFactorySymbol)
    .toFactory(getMongoDBInstance);

export { container };
