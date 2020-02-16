//@flow
import * as JsLogger from 'js-logger';

export type LogLevelObject = {value: number, name: string};
export type LogLevels = {[level: string]: LogLevelObject};
export type LogLevelTypes = {[level: string]: string};

const LogLevel: LogLevels = {
  DEBUG: JsLogger.DEBUG,
  INFO: JsLogger.INFO,
  TIME: JsLogger.TIME,
  WARN: JsLogger.WARN,
  ERROR: JsLogger.ERROR,
  OFF: JsLogger.OFF
};

const LogLevelType: LogLevelTypes = {};

// Build the log level types enums according to the LogLevel object
Object.keys(LogLevel).forEach(key => {
  LogLevelType[key] = key;
});

JsLogger.useDefaults({defaultLevel: JsLogger.ERROR});

/**
 * get a logger
 * @param {?string} name - the logger name
 * @returns {Object} - the logger class
 */
function getLogger(name?: string): Object {
  if (!name) {
    return JsLogger;
  }
  return JsLogger.get(name);
}

/**
 * get the log level
 * @param {?string} name - the logger name
 * @returns {LogLevelObject} - the log level
 */
function getLogLevel(name?: string): LogLevelObject {
  return getLogger(name).getLevel();
}

/**
 * sets the logger level
 * @param {LogLevelObject} level - the log level
 * @param {?string} name - the logger name
 * @returns {void}
 */
function setLogLevel(level: LogLevelObject, name?: string): void {
  getLogger(name).setLevel(level);
}

const Logger = {getLogger, LogLevel, LogLevelType, getLogLevel, setLogLevel};
export {Logger};