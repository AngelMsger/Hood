/**
 * @author  i@angelmsger.com
 * @date    2019/12/22
 */

import _ from 'lodash';
import { Document, Model } from 'mongoose';
import { Autowired, Dao } from '../../decorator';
import {
    IWakatimeSummary,
    IWakatimeSummaryData,
    WakatimeSummaryEntity,
    WakatimeSummaryEntitySymbol
} from '../../entity/wakatime/Summary';
import { WakatimeSummaryType } from '../../enum';

/**
 * wakatime dao
 * @class WakatimeSummaryDao
 */
@Dao
export class WakatimeSummaryDao {
    protected wakatimeSummaryModel: Model<Document>;

    /**
     * constructor
     * @param wakatimeSummaryEntity - entity
     * @constructor
     */
    public constructor(
        @Autowired(WakatimeSummaryEntitySymbol)
            wakatimeSummaryEntity: WakatimeSummaryEntity
    ) {
        this.wakatimeSummaryModel = wakatimeSummaryEntity.model;
    }

    /**
     * get user's summary by date range
     * @param username - wakatime username
     * @param dateStart - date range start
     * @param dateEnd - date range end
     * @param type - summary type
     * @async
     */
    public async findByUsername(
        username: string,
        dateStart: Date,
        dateEnd: Date,
        type?: WakatimeSummaryType
    ): Promise<{
        _id: string;
        data: IWakatimeSummaryData;
    }[]> {
        const { wakatimeSummaryModel } = this;
        const filter: Partial<Record<keyof IWakatimeSummary, unknown>> = {
            username,
            time: {
                $gte: dateStart,
                $lt: dateEnd
            }
        };
        if (type) {
            filter.type = type;
        }
        const pipe = [{
            $match: filter
        }, {
            $group: {
                _id: {
                    type: '$type',
                    name: '$name'
                },
                hours: { $sum: '$hours' },
                minutes: { $sum: '$minutes' },
                seconds: { $sum: '$seconds' },
                percent: { $avg: '$percent' },
                totalSeconds: { $sum: '$totalSeconds' }
            }
        }, {
            $group: {
                _id: '$_id.type',
                data: {
                    $push: {
                        name: '$_id.name',
                        hours: '$hours',
                        minutes: '$minutes',
                        seconds: '$seconds',
                        percent: '$percent',
                        totalSeconds: '$totalSeconds'
                    }
                }
            }
        }];
        return wakatimeSummaryModel.aggregate(pipe);
    }

    /**
     * upsert user summaries
     * @param summaries - user wakatime summaries
     * @async
     */
    public async insertOrUpdateSummaries(
        summaries: IWakatimeSummary[]
    ): Promise<void> {
        const { wakatimeSummaryModel } = this;
        const primaryPropertyKeys: (keyof IWakatimeSummary)[] = [
            'username', 'time', 'type', 'name'
        ];
        const ops = summaries.map((summary) => ({
            updateOne: {
                filter: _.pick(summary, primaryPropertyKeys),
                update: {
                    $set: _.omit(summary, primaryPropertyKeys)
                },
                upsert: true
            }
        }));
        if (ops.length > 0) {
            await wakatimeSummaryModel.bulkWrite(ops);
        }
    }
}

/**
 * wakatime dao symbol(for ioc usage)
 */
export const WakatimeSummaryDaoSymbol = Symbol.for(WakatimeSummaryDao.name);
