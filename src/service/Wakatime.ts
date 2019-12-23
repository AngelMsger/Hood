/**
 * @author  i@angelmsger.com
 * @date    2019/12/22
 */

import { Moment } from 'moment-timezone';
import { IWakatimeSummary, IWakatimeSummaryData } from '../entity/wakatime/Summary';
import { IIoCContext } from '../IoC';

/**
 * wakatime service interface
 * @interface IWakatimeService
 */
export interface IWakatimeService {
    /**
     * fetch wakatime summary api by date
     * @param date - summary date
     */
    fetchAndPersistSummaryByDate(
        date: string | Date | Moment
    ): Promise<void>;

    /**
     * get structured data from raw api result
     * @param resultContent - raw api result
     */
    getSummaryFromResultContent(
        resultContent: unknown
    ): IWakatimeSummary;

    /**
     * query summary from db by date range
     * @param dateStart - date start
     * @param dateEnd - date end
     */
    getSummariesByDateRange(
        dateStart: string | Date | Moment,
        dateEnd: string | Date | Moment
    ): Promise<{
        _id: string;
        data: IWakatimeSummaryData;
    }[]>;
}

/**
 * wakatime service and its factory symbol(for ioc usage)
 */
export const WakatimeServiceSymbol = Symbol.for('WakatimeService');
export const WakatimeServiceFactorySymbol = Symbol.for('WakatimeServiceFactory');

/**
 * factory function to wakatime service
 * @param context - ioc context
 */
export function getWakatimeServiceFactory(context: IIoCContext<IWakatimeService>) {
    return (): IWakatimeService => {
        const { container } = context;
        return container.get<IWakatimeService>(WakatimeServiceSymbol);
    };
}
