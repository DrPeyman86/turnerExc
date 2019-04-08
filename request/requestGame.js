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
        eventGames =  [...new Set(eventGames.map(x => x.gameDate))];//remove potential duplicates
        eventGames.sort((a,b)=>a - b);
        for(let i=0; i < eventGames.length; i++) {
            let url = config.get('scoreboardUrl') + eventGames[i] + '/scoreboard.json';
            
            let results = await fetchResults(url);
            logger.debug(results);
            if(results.status){
                let gameObj = gamesModel.formatGames(results.body);
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