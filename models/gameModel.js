const config = require('config');
//let games = []


let formatGames = (game, lastGameSeries)=>{

    return {
        gameId: game.games[0].gameId,
        startTimeUTC: game.games[0].startTimeUTC,
        vTeam: {
            teamId: game.games[0].vTeam.teamId,
            tricode: game.games[0].vTeam.triCode,
            score: game.games[0].vTeam.score,
        },
        hTeam: {
            teamId: game.games[0].hTeam.teamId,
            tricode: game.games[0].hTeam.triCode,
            score: game.games[0].hTeam.score,
        },
        deeplinkUrls: {
            mobile: config.get('gameDeeplinks.mobile') + '/' + game.games[0].gameId,
            web: config.get('gameDeeplinks.web') + '/' + game.games[0].startDateEastern + '/' + game.games[0].vTeam.triCode + game.games[0].hTeam.triCode
        }
    }

    //games.push(gamesObj)


    //return gameObj;
}

module.exports = {
    formatGames: formatGames  
}