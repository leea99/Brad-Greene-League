var request = new XMLHttpRequest()
var week = 1

request.open('GET', 'https://fantasy.espn.com/apis/v3/games/ffl/seasons/2020/segments/0/leagues/1001965?view=mMatchup&view=mTeam', true)
request.onload = function()
{
    if (request.status >= 200 && request.status < 400)
    {
        data = JSON.parse(this.response)
        getScores(data)
    }
    else
    {
        console.log('error')
    }
}
request.send()

function getWeek() {
    week = document.getElementById("week").value;
    getScores(data)
}

function getScores(data) {
    var matchup = new Array()
        
    for (i in data['schedule'])
    {
        var sched = data['schedule'][i]
        if (sched['matchupPeriodId'] == week)
        {
            let teamId = sched['away']['teamId']
            let teamName = getTeamName(teamId)
            let teamLogo = getTeamLogo(teamId)
            let score = sched['away']['totalPoints']
            matchup.push({Logo:teamLogo, Team:teamName, Score:score})
            teamId = sched['home']['teamId']
            teamName = getTeamName(teamId)
            teamLogo = getTeamLogo(teamId)
            score = sched['home']['totalPoints']
            matchup.push({Logo:teamLogo, Team:teamName, Score:score})
        }
    }
    let table = document.getElementById('scoreTable')
    table.innerHTML = ''
    generateRows(table, matchup)
}

function getTeamName(teamId)
{
    let teamName = data['teams'][teamId-1]['location'] + " " + data['teams'][teamId-1]['nickname']
    return teamName
}

function getTeamLogo(teamId)
{
    let teamLogo = data['teams'][teamId-1]['logo']
    return teamLogo
}

function generateRows(table, data)
{
    var teamNum = 4 //Teams displayed on each line of the table
    var i = 0
    for (let element of data) 
    {
        if ((i % teamNum) == 0)
        {
            var row = table.insertRow()
        }
        if ((i % 2) == 0)
        {
            var tab = document.createElement("TABLE")
            row.appendChild(tab)
        }
        var row2 = tab.insertRow()
        j = 0
        for (key in element) 
        {
            var cell = row2.insertCell()
            if (j % 4 == 0)
            {
                cell.className = 'logo'   
                var img = document.createElement('img')
                img.src = element[key]
                cell.appendChild(img)
            }
            else
            {
                var text = document.createTextNode(element[key])
                cell.appendChild(text)
            }
            j++
        }
        if (i % 2 == 0)
        {
            cell = row2.insertCell()
            var button = document.createElement('button')
            button.innerText = 'Box Score'
            cell.appendChild(button)
            cell.rowSpan = '2'
        }
        i++
    }
    changeRowClass(teamNum)
}

function changeRowClass(teamNum)
{  
    var trMulti = 5 //There are currently 4 nested tr so a mutiple avoids those getting this class
    for (i = 0; i < teamNum-1; i++)
    {
        document.getElementsByTagName('tr')[i*trMulti].className = 'scoreRows'
    }
}