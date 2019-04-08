
const express = require('express');
const bodyParser = require('body-parser');
const log4js = require('log4js');
const logger = log4js.getLogger('turnerExc')
const requestGame = require('./request/requestGame')

log4js.configure({
    appenders: { turnerExc: {type: 'file', filename: 'turnerapp.log'}},
    categories: { default: {appenders: ['turnerExc'], level: 'debug'}}
})



const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin', "*");//which domains are able to access the resources from backend
    res.setHeader("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept, Authorization")
    res.setHeader("Access-Control-Allow-Methods", "GET,POST");
    next();//continue.
  })

app.post("/getGames", (req,res,next)=>{
    logger.debug(req.body.gameIds);
    
    requestGame.requestGames(req.body.gameIds)
    .then((results)=>{
            res.status(200).json(results);       
    })
    .catch(err=>{
        res.status(500).send({message: err});
    })

    
})

module.exports = app;

