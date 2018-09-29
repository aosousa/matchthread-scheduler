//------------------------------------------------------------------------------
// Module responsible for sending Reddit messages to MatchThreadder to create
// match threads in the /r/PrimeiraLiga subreddit.
//------------------------------------------------------------------------------

// 3rd party
const snoowrap = require('snoowrap');

// Config
const config = require('../config.json');

const r = new snoowrap({
    userAgent: config.userAgent,
    clientId: config.clientId,
    clientSecret: config.clientSecret,
    username: config.username,
    password: config.password
})

module.exports = {
    sendMessage: function(homeTeam, awayTeam) {
        r.composeMessage({
            to: 'MatchThreadder',
            subject: 'Match Thread',
            text: `${homeTeam} vs ${awayTeam} for /r/PrimeiraLiga`
        })
    }
}
