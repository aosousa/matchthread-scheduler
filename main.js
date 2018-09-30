// Modules
const matches = require('./modules/matches');
const utils = require('./modules/utils');

// Configuration
const config = require('./config.json');

utils.log(`${config.subreddit} Match Thread Scheduler is running`);

// update matches array manually the first time. 
matches.updateMatches();
utils.log("Matches array was updated.");

// setInterval will perform the other checks every 24 hours afterwards
setInterval(function() {
    matches.updateMatches()
    utils.log("Matches array was updated.");
}, 86400000);

// check matches array manually for the first time
matches.checkMatchesStatus();

// setInterval will perform the other checks every minute afterwards
setInterval(function() {
    matches.checkMatchesStatus();
}, 60000);