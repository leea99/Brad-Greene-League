var request = new XMLHttpRequest()
var roster = new Array()
var nflTeams = [{id: 0, name:"Free Agent"}, //Look into this
                {id: 1, name:"Falcons"},
                {id: 2, name:"Bills"},
                {id: 3, name:"Bears"},
                {id: 4, name:"Bengals"},
                {id: 5, name:"Browns"},
                {id: 6, name:"Cowboys"},
                {id: 7, name:"Broncos"},
                {id: 8, name:"Lions"},
                {id: 9, name:"Packers"},
                {id: 10, name:"Titans"},
                {id: 11, name:"Colts"},
                {id: 12, name:"Chiefs"},
                {id: 13, name:"Raiders"},
                {id: 14, name:"Rams"},
                {id: 15, name:"Dolphins"},
                {id: 16, name:"Vikings"},
                {id: 17, name:"Patriots"},
                {id: 18, name:"Saints"},
                {id: 19, name:"Giants"},
                {id: 20, name:"Jets"},
                {id: 21, name:"Eagles"},
                {id: 22, name:"Cardinals"},
                {id: 23, name:"Steelers"},
                {id: 24, name:"Chargers"},
                {id: 25, name:"49ers"},
                {id: 26, name:"Seahawks"},
                {id: 27, name:"Buccaneers"},
                {id: 28, name:"Redskins"},
                {id: 29, name:"Panthers"},
                {id: 30, name:"Jaguars"},
                {id: 33, name:"Ravens"},
                {id: 34, name:"Texans"}]


request.open('GET', 'https://fantasy.espn.com/apis/v3/games/ffl/seasons/2020/segments/0/leagues/1001965?view=mRoster', true)
request.onload = function()
{
    data = JSON.parse(this.response)
    data = data['teams'][0]

    let i = 0
    for (playerId in data['roster']['entries'])
    {
        let name = data['roster']['entries'][i]['playerPoolEntry']['player']['fullName']
        let pos = data['roster']['entries'][i]['playerPoolEntry']['player']['defaultPositionId']
        if (pos == 1)
            pos = 'QB'
        else if (pos == 2)
            pos = 'RB'
        else if (pos == 3)
            pos = 'WR'
        else if (pos == 4)
            pos = 'TE'
        else
            pos = 'D/ST'
        
        //TODO look into sorting by lineup stats
        let team = data['roster']['entries'][i]['playerPoolEntry']['player']['proTeamId']

        let j = 0
        for (id in nflTeams)
        {
            if (team == nflTeams[j]['id'])
                team = nflTeams[j]['name']
            j++
        }
        i++
        
        roster.push({Name:name, Position:pos, NFLTeam:team})
    }
    console.log(roster)
    let table = document.getElementById('rosterBody')
    generateRows(table, roster)
}
request.send()

function generateRows(table, data)
{
    for (let element of data)
    {
        let row = table.insertRow()
        let i = 0
        for (key in element) 
        {
            let cell = row.insertCell();
            let text = document.createTextNode(element[key]);
            cell.appendChild(text);
        }
    }
}