/* Statistics tracker (in memory)*/

var gameStats =
{
    //since : Date.now(), /** Keep track when the object was created */
    gamesInitialized: 0,
    ongoingGames: 0,
    gamesCompleted: 0,
    activeGamers: 0
}

module.exports = gameStats;