exports.checkMail = (mail) => {
    let re = /\S+@\S+\.\S+/;
    return re.test(mail);
};

exports.winstonLogError = (message) => {
    const winston = require('winston');
    const { combine, timestamp, json } = winston.format;
    const logger = winston.createLogger({
        level: process.env.LOG_LEVEL || 'error',
        format: combine(timestamp(), json()),
        transports: [
            new winston.transports.File({
                filename: 'combined.log',
            }),
        ],
    });
    logger.error(message);
};

exports.winstonLogInfo = (message) => {
    const winston = require('winston');
    const { combine, timestamp, json } = winston.format;
    const logger = winston.createLogger({
        level: process.env.LOG_LEVEL || 'info',
        format: combine(timestamp(), json()),
        transports: [
            new winston.transports.File({
                filename: 'combined.log',
            }),
        ],
    });
    logger.info(message);
};

