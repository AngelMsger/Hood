/**
 * @author  i@angelmsger.com
 * @date    2019/12/22
 */

import _ from 'lodash';
import moment from 'moment-timezone';
import { Moment } from 'moment-timezone/moment-timezone';
import { EnvConf, WakatimeConf } from '../conf';
import { WakatimeSummaryDao, WakatimeSummaryDaoSymbol } from '../dao/wakatime/Summary';
import { Autowired, Service } from '../decorator';
import { Cache } from '../decorator/Cache';
import { IWakatimeSummary, IWakatimeSummaryData } from '../entity/wakatime/Summary';
import { WakatimeSummaryType } from '../enum';
import { fetchWakatimeApi } from '../util/Wakatime';
import { IWakatimeService } from './Wakatime';

/**
 * wakatime service
 * @class WakatimeService
 * @implements IWakatimeService
 */
@Service
export class WakatimeService implements IWakatimeService {
    protected wakatimeSummaryDao: WakatimeSummaryDao;

    /**
     * constructor
     * @param wakatimeSummaryDao - wakatime summary dao instance
     * @constructor
     */
    public constructor(
        @Autowired(WakatimeSummaryDaoSymbol)
            wakatimeSummaryDao: WakatimeSummaryDao
    ) {
        this.wakatimeSummaryDao = wakatimeSummaryDao;
    }

    /**
     * fetch wakatime summary api by date
     * @param date - summary date
     * @async
     */
    public async fetchAndPersistSummaryByDate(
        date: string | Date | moment.Moment
    ): Promise<void> {
        date = moment(date);
        const payload = await fetchWakatimeApi({
            method: 'GET',
            path: 'api/v1/users/current/summaries',
            query: {
                start: date
                    .startOf('day')
                    .tz(EnvConf.tz)
                    .format('YYYY-MM-DD'),
                end: date
                    .endOf('day')
                    .tz(EnvConf.tz)
                    .format('YYYY-MM-DD'),
                timezone: EnvConf.tz
            }
        });
        const data = _.get(payload, ['data']);
        const summaries: IWakatimeSummary[] = [];
        _.forEach(data, (dataChunk) => {
            const resultDate = _.get(dataChunk, ['range', 'date']);
            const time = moment(resultDate)
                .tz(EnvConf.tz)
                .toDate();
            _.forEach(WakatimeSummaryType, (type: WakatimeSummaryType) => {
                const contentKey = _.snakeCase(type);
                const resultContent = _.get(dataChunk, [contentKey]);
                _.forEach(resultContent, (summaryContent) => {
                    const summary = this.getSummaryFromResultContent(summaryContent);
                    summary.username = WakatimeConf.username;
                    summary.time = time;
                    summary.type = type;
                    summaries.push(summary);
                });
            });
        });
        await this.wakatimeSummaryDao.insertOrUpdateSummaries(summaries);
    }

    /**
     * get structured data from raw api result
     * @param resultContent - raw api result
     */
    public getSummaryFromResultContent(
        resultContent: object
    ): IWakatimeSummary {
        return _.reduce(resultContent, (memo, val, key) =>
            _.set(memo, [_.camelCase(key)], val), {} as IWakatimeSummary);
    }

    /**
     * query summary from db by date range
     * @param dateStart - date start
     * @param dateEnd - date end
     * @async
     */
    @Cache(moment.duration(1, 'minute').asSeconds())
    public async getSummariesByDateRange(
        dateStart: string | Date | Moment,
        dateEnd: string | Date | Moment
    ): Promise<{
        _id: string;
        data: IWakatimeSummaryData;
    }[]> {
        const { wakatimeSummaryDao } = this;
        return await wakatimeSummaryDao.findByUsername(
            WakatimeConf.username,
            moment(dateStart).tz(EnvConf.tz).toDate(),
            moment(dateEnd).tz(EnvConf.tz).toDate()
        );
    }
}
