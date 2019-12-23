/**
 * @author  i@angelmsger.com
 * @date    2019/12/22
 */

import { SchemaOptions, Types } from 'mongoose';
import ObjectId = Types.ObjectId;

/**
 * default options
 * @desc disable __v in mongodb schema by default
 */
export const defaultSchemaOptions: SchemaOptions = {
    useNestedStrict: true,
    versionKey: false
};

/**
 * mongodb ObjectId type or string
 * @type MongoId
 */
export type MongoId = string | ObjectId;

/**
 * abstract mongodb entity
 * @interface IMongoDBEntity
 */
export interface IMongoDBEntity {
    _id?: MongoId;
}
