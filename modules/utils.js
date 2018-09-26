//------------------------------------------------------------------------------
// Utilities module that contains useful re-usable methods
//------------------------------------------------------------------------------

// Moment.js library
const moment = require('moment');

module.exports = {
    /**
     * Builds the current date in DD-MM-YYYY HH:mm:ss format using the moment.js library
     * @returns {string} Date in DD-MM-YYYY HH:mm:ss format
     */
    buildCurrentDate: function() {
        return moment().format("DD-MM-YY HH:mm:ss");
    },

    /**
     * Logs a message with the current date/time
     */
    log: function(message) {
        console.log("[" + this.buildCurrentDate() + "] " + message);
    }
}