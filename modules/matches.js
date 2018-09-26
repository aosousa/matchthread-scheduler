//------------------------------------------------------------------------------
// Module that obtains the information of the Primeira Liga matches 
// in a given matchweek.
//------------------------------------------------------------------------------

// Modules
const utils = require('./utils');

// 3rd party packages
const rp = require('request-promise');

const base_url = "https://api.football-data.org/v2"
const API_KEY = process.env.API_KEY

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
     * Get matches from a given matchweek
     * @param {number} matchday 
     * @returns {Promise<any>}
     */
    getMatchdayMatches(matchday) {
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
}