var request = new XMLHttpRequest()

request.open('GET', 'https://fantasy.espn.com/apis/v3/games/ffl/seasons/2020/segments/0/leagues/1001965?view=mDraftDetail&view=kona_player_info', true)
request.onload = function()
{
    data = JSON.parse(this.response)
    var picks = new Array()

    if (request.status >= 200 && request.status < 400)
    {
        for (i in data['draftDetail']['picks'])
        {
            let roundId = data['draftDetail']['picks'][i]['roundId']
            let pickNum = data['draftDetail']['picks'][i]['roundPickNumber']
            let playerId = data['draftDetail']['picks'][i]['playerId']
            let teamId = data['draftDetail']['picks'][i]['teamId']

            for (j in data['players'])
            {
                if (playerId == data['players'][j]['player']['id'])
                {
                    playerId = data['players'][j]['player']['fullName']
                    console.log(data['players'][j]['player']['fullName'])
                }
            }
            
            picks.push({Round:roundId, Pick:pickNum, Player:playerId, Team:teamId})
        }
    }
}
request.send()