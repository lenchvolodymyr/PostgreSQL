const os = require('os');
const net = require('net');
const packageFile = require('../../package.json');

const createLogger = ({ title, logger, hiddenKeys }) => {
    return {
        info(message, additionalData = {}) {
            logger.log('info', { message, ...additionalData }, title, hiddenKeys);
        },

        progress(message, dbName = '', tableName = '') {
            logger.progress({ message, containerName: dbName, entityName: tableName });
        },

        error(error) {
            logger.log('error', prepareError(error), title);
        },
    };
};

const prepareError = error => {
    error = JSON.stringify(error, Object.getOwnPropertyNames(error));
    error = JSON.parse(error);
    return error;
};

const getPluginVersion = () => packageFile.version;

const getSystemInfo = appVersion => {
    return (
        '' +
        `Date: ${new Date()}` +
        '\n' +
        `Application version: ${appVersion}` +
        '\n' +
        `Plugin version: ${getPluginVersion()}` +
        '\n\n' +
        `System information:` +
        '\n' +
        ` Hostname:  ${os.hostname()}` +
        '\n' +
        ` Platform:  ${os.platform()} ${os.arch()}` +
        '\n' +
        ` Release:   ${os.release()}` +
        '\n' +
        ` Uptime:    ${toTime(os.uptime())}` +
        '\n' +
        ` Total RAM: ${(os.totalmem() / 1073741824).toFixed(2)} GB` +
        '\n' +
        ` CPU Model: ${os.cpus()[0].model}` +
        '\n' +
        ` CPU Clock: ${maxClock(os.cpus())} MHZ` +
        '\n' +
        ` CPU Cores: ${os.cpus().length} cores` +
        '\n\n'
    );
};

const maxClock = cpus => {
    return cpus.reduce((highestClock, cpu) => Math.max(highestClock, cpu.speed), 0);
};

const prefixZero = number => (number < 10 ? '0' + number : number);

const toTime = number => {
    return Math.floor(number / 3600) + ':' + prefixZero(parseInt((number / 3600 - Math.floor(number / 3600)) * 60));
};

module.exports = {
    createLogger,
    getSystemInfo,
};
