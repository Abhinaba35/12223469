const { Log } = require('./loggingMiddleware');

class Logger {
    static async info(packageName, message) {
        return await Log('backend', 'info', packageName, message);
    }
    
    static async debug(packageName, message) {
        return await Log('backend', 'debug', packageName, message);
    }
    
    static async warn(packageName, message) {
        return await Log('backend', 'warn', packageName, message);
    }
    
    static async error(packageName, message) {
        return await Log('backend', 'error', packageName, message);
    }
    
    static async fatal(packageName, message) {
        return await Log('backend', 'fatal', packageName, message);
    }
}

module.exports = Logger;