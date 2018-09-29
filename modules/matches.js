//------------------------------------------------------------------------------
// Module that obtains the information of the Primeira Liga matches 
// in a given matchweek.
//------------------------------------------------------------------------------

// Modules
const message = require('./message');
const utils = require('./utils');

// 3rd party packages
const moment = require('moment');
const rp = require('request-promise');

// Config
const config = require("../config.json");

const base_url = "https://api.football-data.org/v2"
const API_KEY = config.apiKey

/**
 * Get matches from a given matchweek
 * @param {number} matchday 
 * @returns {Promise<any>}
 */
function getMatchdayMatches(matchday) {
    var reqOptions = {
        uri: `${base_url}/competitions/2017/matches?matchday=${matchday}`,
        headers: {
            'X-Auth-Token': API_KEY
        },
        json: true
    };

    return rp(reqOptions)
        .then(function (res) {
            return res.matches
        })
        .catch(function (err) {
            utils.log("Error occurred while obtaining the current matchday matches: " + err);
        })
}

module.exports = {
    /**
     * Get current matchday in the Primeira Liga
     * @returns {Promise<number>}
     */
    getCurrentMatchday: function() {
        var reqOptions = {
            uri: `${base_url}/competitions/2017`,
            headers: {
                'X-Auth-Token': API_KEY
            },
            json: true
        };

        return rp(reqOptions)
            .then(function (res) {
                return res.currentSeason.currentMatchday;
            })
            .catch(function (err) {
                utils.log("Error occurred while obtaining the current matchday: " + err);
            })
    },

    /**
     * Method that will be used in the cron job to check for matches
     * every 10 minutes
     */
    checkMatches() {
        var numMatches = 0;
        this.getCurrentMatchday().then(function(matchday) {
            getMatchdayMatches(matchday).then(function(mMatches) {
                mMatches.forEach(match => {
                    var matchDate = moment.utc(match.utcDate);
                    var now = moment.utc(moment.now());
                    var diff  = moment.duration(matchDate.diff(now));
                    var diffMinutes = Math.abs(Math.floor(diff.asMinutes()));
                    
                    // send message if match is within 3 minutes
                    if (diffMinutes <= 3) {
                        numMatches++
                        var homeTeam = match.homeTeam.name;
                        var awayTeam = match.awayTeam.name;
    
                        message.sendMessage(homeTeam, awayTeam);
                        utils.log(`Sent message for ${homeTeam} vs ${awayTeam}.`);
                    }
                });

                if (numMatches === 0) {
                    utils.log("No matches in the next 3 minutes.");
                }
            });
        });
    }
}