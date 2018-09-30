// Modules
const matches = require('./modules/matches');
const utils = require('./modules/utils');

utils.log("/r/PrimeiraLiga Match Thread Scheduler is running");

// check for matches manually the first time. 
matches.checkMatches();

// setInterval will perform the other checks every minute afterwards
setInterval(function() {
    matches.checkMatches()
}, 60000)
