var request = new XMLHttpRequest()
//var options = {'x-fantasy-filter': '{"players": {"limit": 500, "sortDraftRanks": {"sortPriority": 100, "sortAsc": true, "value": "STANDARD"}}}'}
var filters = { "players": { "limit": 1500, "sortDraftRanks": { "sortPriority": 100, "sortAsc": true, "value": "STANDARD" } } }

var options = {
  "headers": {
      "x-fantasy-filter": JSON.stringify(filters)
  }
}

var url = "https://fantasy.espn.com/apis/v3/games/ffl/seasons/2020/segments/0/leagues/1001965?view=kona_player_info"

console.log(JSON.stringify(options))
request.open('GET', url, true)
request.setRequestHeader("headers", JSON.stringify(options))
request.onload = function()
{
    if (request.status >= 200 && request.status < 400)
    {
        data = JSON.parse(this.response)
        console.log(data)
    }
    else
    {
        console.log('error')
    }
}
request.send()
