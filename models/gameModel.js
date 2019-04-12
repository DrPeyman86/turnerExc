const config = require('config');

let formatGames = (games)=>{
    let gamesOnDate = [];

    games.map((game)=>{
        //console.log(game);
        let gameOnDate = {
            gameId: game.gameId,
            startTimeUTC: game.startTimeUTC,
            vTeam: {
                teamId: game.vTeam.teamId,
                tricode: game.vTeam.triCode,
                score: game.vTeam.score,
            },
            hTeam: {
                teamId: game.hTeam.teamId,
                tricode: game.hTeam.triCode,
                score: game.hTeam.score,
            },
            deeplinkUrls: {
                mobile: config.get('gameDeeplinks.mobile') + '/' + game.gameId,
                web: config.get('gameDeeplinks.web') + '/' + game.startDateEastern + '/' + game.vTeam.triCode + game.hTeam.triCode
            }
        }
        gamesOnDate.push(gameOnDate);
    })

    return gamesOnDate;
     
}

module.exports = {
    formatGames: formatGames  
}