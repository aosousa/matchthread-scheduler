// 3rd party packages
const cron = require('cron-job-manager');

// Modules
const matches = require('./modules/matches');
const utils = require('./modules/utils');

/**
 * Check for matches every 10 minutes
 * Cron Job structure: 
 * Seconds: 00-59 (replace with * to run every second)
 * Minutes: 00-59 (replace with * to run every minute)
 * Hours: 00-23 (replace with * to run every hour)
 * Day of the month: 01-31 (replace with * to run every day of the month)
 * Month: 00-11 (replace with * to run every month)
 * Day of the week: 0-6 (replace with * to run every day of the week)
 */
manager = new cron('checkMatches', '* 01 * * * *', function() {
    matches.checkMatches();
});

// start cron job manager
utils.log("/r/PrimeiraLiga Match Thread Scheduler is running");
manager.start("checkMatches");
utils.log("Cron job is running");

// check for matches for the first time. Cron job will perform the other checks
matches.checkMatches();