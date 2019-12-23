/**
 * @author  i@angelmsger.com
 * @date    2019/12/22
 */

import _ from 'lodash';
import { Connection, Document, Model, Schema } from 'mongoose';
import { MongoDBFactorySymbol } from '../../component/MongoDB';
import { Autowired, Entity } from '../../decorator';
import { WakatimeSummaryType } from '../../enum';
import { defaultSchemaOptions, IMongoDBEntity } from '../Common';

/**
 * coordinate properties for wakatime summary
 * @interface IWakatimeSummaryCoordinate
 */
export interface IWakatimeSummaryCoordinate {
    username: string;
    time: Date;
    type: WakatimeSummaryType;
    name: string;
}

/**
 * abstract summary of wakatime data
 * @interface IWakatimeSummaryData
 */
export interface IWakatimeSummaryData {
    name: string;

    hours: number;
    minutes: number;
    seconds: number;

    percent: number;
    totalSeconds: number;
}

/**
 * extra description properties for summary data
 * @interface IWakatimeSummaryDesc
 */
export interface IWakatimeSummaryDesc {
    digital: string;
    text: string;
}

/**
 * wakatime summary entity interface
 * @extends IMongoDBEntity, IWakatimeSummaryCoordinate
 *          IWakatimeSummaryData, IWakatimeSummaryDesc
 */
export interface IWakatimeSummary
    extends IMongoDBEntity, IWakatimeSummaryCoordinate,
        IWakatimeSummaryData, IWakatimeSummaryDesc {
}

/**
 * wakatime summary schema
 */
const WakatimeSummarySchema = new Schema({
    username: {
        type: Schema.Types.String,
        required: true
    },
    time: {
        type: Schema.Types.Date,
        required: true
    },
    type: {
        type: Schema.Types.String,
        enum: _.values(WakatimeSummaryType),
        required: true
    },

    name: {
        type: Schema.Types.String,
        required: true
    },

    hours: { type: Schema.Types.Number },
    minutes: { type: Schema.Types.Number },
    seconds: { type: Schema.Types.Number },

    digital: { type: Schema.Types.String },
    text: { type: Schema.Types.String },

    percent: {
        type: Schema.Types.Number,
        required: true
    },
    totalSeconds: {
        type: Schema.Types.Number,
        required: true
    }
}, defaultSchemaOptions);

WakatimeSummarySchema.index({
    username: 1,
    time: -1,
    type: 1,
    name: 1
});

/**
 * wakatime entity symbol(for ioc usage)
 */
export const WakatimeSummaryEntitySymbol = Symbol.for('WakatimeSummaryEntity');

/**
 * wakatime summary entity class
 * @class WakatimeSummaryEntity
 */
@Entity
export class WakatimeSummaryEntity {
    public model: Model<Document>;
    protected db: Connection;

    /**
     * constructor
     * @param mongoDBFactory - factory method of db singleton
     * @constructor
     */
    constructor(
        @Autowired(MongoDBFactorySymbol)
            mongoDBFactory: () => Connection
    ) {
        const db = this.db = mongoDBFactory();
        this.model = db.model('wakatime_summaries', WakatimeSummarySchema);
    }
}
