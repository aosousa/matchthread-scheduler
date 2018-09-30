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

var matchesArr;
var messagesSent = [];
var currentMatchday;

/**
 * Get matches from a given matchweek
 * @param {number} matchday 
 * @returns {Promise<any>}
 */
function getMatchdayMatches(matchday) {
    var reqOptions = {
        uri: `${base_url}/competitions/${config.competitionId}/matches?matchday=${matchday}`,
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
            uri: `${base_url}/competitions/${config.competitionId}`,
            headers: {
                'X-Auth-Token': API_KEY
            },
            json: true
        };

        return rp(reqOptions)
            .then(function (res) {
                // clear messagesSent array if matchday has changed
                if (currentMatchday != res.currentSeason.currentMatchday) {
                    messagesSent = [];
                    currentMatchday = res.currentSeason.currentMatchday;
                }

                return res.currentSeason.currentMatchday;
            })
            .catch(function (err) {
                utils.log("Error occurred while obtaining the current matchday: " + err);
            })
    },

    /**
     * Method that will be used in the setInterval to check for matches
     * every minute
     */
    updateMatches() {
        this.getCurrentMatchday().then(function(matchday) {
            getMatchdayMatches(matchday).then(function(mMatches) {
                matchesArr = mMatches;
            });
        });
    },

    /**
     * Checks on the status of matches every minute
     */
    checkMatchesStatus() {
        var numMatches = 0;

        if (matchesArr !== undefined) {
            matchesArr.forEach(match => {
                var messageAlreadySent = messagesSent.includes(match.id);

                if (!messageAlreadySent) {
                    var matchDate = moment.utc(match.utcDate);
                    var now = moment.utc(moment.now());
                    var diff  = moment.duration(matchDate.diff(now));
                    var diffMinutes = Math.floor(diff.asMinutes());

                    // send message if match has started in the last 5 minutes
                    // the reason for this is that the MatchThreadder bot doesn't seem to respond
                    // consistently to messages made 5 minutes before a match.
                    if (diffMinutes <= 0 && diffMinutes >= -5) {
                        numMatches++
                        var homeTeam = match.homeTeam.name;
                        var awayTeam = match.awayTeam.name;
                        
                        message.sendMessage(homeTeam, awayTeam);
                        messagesSent.push(match.id);
                        utils.log(`Sent message for ${homeTeam} vs ${awayTeam}.`);
                    }
                }
            });

            if (numMatches === 0) {
                utils.log("No new matches in progress.");
            }
        }
    }
}