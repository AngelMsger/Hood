/**
 * @author  i@angelmsger.com
 * @date    2019/12/22
 */

import winston from 'winston';
import { EnvConf } from '../conf';

export const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({
            format: winston.format.cli({
                level: true,
                message: false
            })
        }),
        new winston.transports.File({
            dirname: EnvConf.logPath,
            format: winston.format.simple()
        })
    ]
});
