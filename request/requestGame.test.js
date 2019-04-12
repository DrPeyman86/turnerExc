const config = require('config');
const expect = require('chai').expect;
const request = require('supertest');
const axios = require('axios');

const app = require('../app')

const gamesToGenerate = config.get('gameIds');
const lastGameToGenerate = Math.max.apply(Math,gamesToGenerate.map(function(game){return game.gameDate}));//get last game based on gameDate value

describe('/Post Request Get Game Dates', ()=> {
    //1. should include the 2 properties included in response template games and meta
    it('1. should include properties from response template',(done)=>{
        request(app)
        .post('/getGames')
        .send({gameDates: gamesToGenerate})
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err,res)=>{
             if(err) return done(err)   
             res = JSON.parse(res.text);
             expect(res).to.have.property('games');
             expect(res).to.have.property('meta');
             done();
        })
    })


    //2. the games property should be an array and count of array should be count of array of object requested
    it('2. the games property should be an array and count of array should be count of array of object requested',(done)=>{
        request(app)
        .post('/getGames')
        .send({gameDates: gamesToGenerate})
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err,res)=>{
             if(err) return done(err)  
             res = JSON.parse(res.text); 
             expect(res.games).to.be.an('array');
             expect(res.games).to.have.lengthOf(gamesToGenerate.length); 
             done();
        })
    })

    //3. the games property nested objects should include the properties defined in the response template
    it('3. the games property nested objects should include the properties defined in the response template',(done)=>{
        request(app)
        .post('/getGames')
        .send({gameDates: gamesToGenerate})
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err,res)=>{
             if(err) return done(err)  
             res = JSON.parse(res.text); 
             for(i=0; i < res.games.length; i++) {
                expect(res.games[i]).to.have.all.keys('gameId','startTimeUTC','vTeam','hTeam','deeplinkUrls');
                expect(res.games[i].vTeam).to.have.all.keys('teamId','tricode','score');
                expect(res.games[i].hTeam).to.have.all.keys('teamId','tricode','score');
                expect(res.games[i].deeplinkUrls).to.have.all.keys('mobile','web');
             }
             done();
        })
    })

    //before next test, run request to get last seriesSummaryText to compare with .post('/getGames') request of API. 
    before(()=>{
        return axios.get(config.get('scoreboardUrl') + lastGameToGenerate + '/scoreboard.json').then((res)=>{
             lastGameSeriesResponse = res.data;
        })
    })

    //4. the game series of dates requested should match the last game series seriesSumaryText made from separate request above
    it('4. the last game in series of the array provided to request should match the seriesSummaryText from last game in series made on separate request',(done)=>{
        request(app)
        .post('/getGames')
        .send({gameDates: gamesToGenerate})
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err,res)=>{
             if(err) return done(err)  
             res = JSON.parse(res.text); 
             expect(res.meta.seriesStatus).to.equal(lastGameSeriesResponse.games[0].playoffs.seriesSummaryText)
             done();
        })
    })

})