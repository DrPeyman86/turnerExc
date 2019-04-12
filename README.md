We use many external APIs to help generate the services we provide to our clients.

Please use the following data feed along with the below config and response template to genrate a dynamic deeplink feed.

1) 
* [https://data.nba.net/prod/v2/20180531/scoreboard.json]() should contain game details for ***0041700401***

* ***gameId*** and ***gameDate*** are available in gameIds. 

* Call the scoreboardUrl with gameDate. 

* scoreboardUrl would have data of all games available on a day. 


2) The Deeplink should be generated dynamicaly from gameDetails and replaced in the pattern provided in config and added to gameObject.

3) publish the key value for “***_seriesSummaryText_***” (games.playoffs.seriesSummaryText)  for the last game that is present. 

For example, if the “gameIds” array has 3 games [“001”, “002", “003”] and after building the games array only “001" and “002” exist in scoreboard.json then the “seriesSummaryText” value for “002” is published for “seriesStatus” in the feed.

#### 4) Write a unit test for your code

## Config

    {
        "scoreboardUrl": "https://data.nba.net/prod/v2/{{gameDate}}/scoreboard.json",
        "gameIds": [{
            "gameId": "0041700401",
            "gameDate": "20180531"
        }, {
            "gameId": "0041700402",
            "gameDate": "20180603"
        }, {
            "gameId": "0041700403",
            "gameDate": "20180606"
        }],
        "gameDeeplinks": {
            "mobile": "gametime://games/{{gameId}}",
            "web": "https://www.nba.com/games/{{gameDateEastern}}/{{vTeamTricode}}{{hTeamTricode}}"
        }
    }

### Response template
    {
        "games": [{
            "gameId": "0041800401",
            "startTimeUTC": "2018-06-01T01:00:00.000Z",
            "vTeam": {
                "teamId": "1610612739",
                "tricode": "CLE",
                "score": ""
            },
            "hTeam": {
                "teamId": "1610612744",
                "tricode": "GSW",
                "score": ""
            },
            "deeplinkUrls": {
                "mobile": "gametime://games/0041700401",
                "web": "https://www.nba.com/games/20180531/CLEGSW"
            }
        }, .............],
        "meta": {
            "seriesStatus": ".......",
        }
    }


Generates response in responseFeed.json
