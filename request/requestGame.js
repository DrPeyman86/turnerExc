const request = require('request');
const config = require('config');
const gamesModel = require('../models/gameModel')
const log4js = require('log4js');
const logger = log4js.getLogger('turnerExc')

let requestGames = async function(eventGames) {
    let gamesArr = []
    let metaArr = []
    let responseObj = new Object()

    try {
        //eventGames =  [...new Set(eventGames.map(x => x.gameDate))];//remove potential duplicates
        //console.log(eventGames);
        eventGames.sort((a,b)=>a - b);
        for(let i=0; i < eventGames.length; i++) {
            let url = config.get('scoreboardUrl') + eventGames[i].gameDate + '/scoreboard.json';
            
            let results = await fetchResults(url);
            logger.debug(results.body.games);
            
            if(results.status){
                const distinctGames = [...new Set(results.body.games.map(x=>x.gameId))]
                //console.log(distinctGames);
                
                // distinctGames.forEach((gameSeries)=>{
                //     var result = results.body.games.filter(obj=>obj.gameId === gameSeries) 
                //     console.log(result[0].gameId);
                // })

                console.log(getCount(results.body.games));

                let gameObj = gamesModel.formatGames(results.body.games);
                //console.log(gameObj);

                gamesArr.push(gameObj);

                metaArr.push({ seriesStatus: results.body.games[0].playoffs.seriesSummaryText});
            } else {
                logger.debug(` No games found on ${eventGames[i]} date`)
            }
                     
            
        }     
        responseObj.games = gamesArr;
        responseObj.meta = metaArr[metaArr.length-1];//get the last index of the meta array to get the last seriesSummaryText

        return responseObj;
    } catch (e) {
        logger.debug(e);       
        return e;
    } 
    
}

function getCount(array) {
    var count = {};
    array.forEach(function (a) {
        // count[a.gameId] = (count[a.gameId] || 0) + 1;
        count[a.gameId] = (count[a.gameId] || 0) + 1;
    });
    return Object.keys(count).map(function (k) {
        return { parts: { uniquePart: k, timesListed: count[k] } };
    });
}


function fetchResults(url){
    return new Promise((resolve,reject)=>{
        request({
            url: url,
            method: 'GET',
            headers: {'Accept': 'application/json'}
        }, (error,response,body)=>{
            if(error) {             
                reject(error)
            }
            else if (!body) {
                resolve({status:false, body: null});
            }
            else{
                let game = JSON.parse(body);
                resolve({status:true, body: game});
            }

        })
    })
}


module.exports.requestGames = requestGames;