/**
 * Centralized logging utility for consistent log formatting across the application
 */

/**
 * Format date to local time string: YYYY-MM-DD HH:MM:SS
 * @param {Date} date - The date to format
 * @returns {string} Formatted date string
 */
function formatTimestamp(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * Log a message with timestamp and context
 * @param {string} context - The context/module name (e.g., 'SMS', 'Courses', 'Payments')
 * @param {string} message - The log message
 * @param {...any} args - Additional arguments to log
 */
function log(context, message, ...args) {
    const timestamp = formatTimestamp();
    const paddedContext = context.padEnd(12, ' ');
    if (args.length > 0) {
        console.log(`${timestamp} | ${paddedContext} | ${message}`, ...args);
    } else {
        console.log(`${timestamp} | ${paddedContext} | ${message}`);
    }
}

/**
 * Log an error message with timestamp and context
 * @param {string} context - The context/module name (e.g., 'SMS', 'Courses', 'Payments')
 * @param {string} message - The error message
 * @param {...any} args - Additional arguments to log
 */
function error(context, message, ...args) {
    const timestamp = formatTimestamp();
    const paddedContext = context.padEnd(12, ' ');
    if (args.length > 0) {
        console.error(`${timestamp} | ${paddedContext} | ${message}`, ...args);
    } else {
        console.error(`${timestamp} | ${paddedContext} | ${message}`);
    }
}

module.exports = {
    log,
    error
};
