// 3rd party packages
const cron = require('cron-job-manager');

// Modules
const matches = require('./modules/matches');

matches.getCurrentMatchday().then(function(matchday) {
    matches.getMatchdayMatches(matchday).then(function(matches) {
        console.log(matches);
    });
});