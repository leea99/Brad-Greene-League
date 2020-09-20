var load
var week = 1
var currentGame = 0
var url = "https://fantasy.espn.com/apis/v3/games/ffl/seasons/2020/segments/0/leagues/1001965?view=mMatchup&view=mMatchupScore&view=mTeam&scoringPeriodId=1"
slotcodes = {
    0 : 'QB', 2 : 'RB', 4 : 'WR',
    6 : 'TE', 16: 'D/ST', 17: 'K',
    20: 'Bench', 21: 'IR', 7: 'Flex'
}

getJson()

function getJson()
{
    var request = new XMLHttpRequest()
    week = document.getElementById("week").value;
    url = "https://fantasy.espn.com/apis/v3/games/ffl/seasons/2020/segments/0/leagues/1001965?view=mMatchup&view=mMatchupScore&view=mTeam&scoringPeriodId=" + week
         
    request.onreadystatechange = function()
    {
        if (request.status >= 200 && request.status < 400)
        {
            if (request.readyState === XMLHttpRequest.DONE)
            {
                data = JSON.parse(this.response)
                getScores(data)
            }
        }
        else
        {
            if (request.readyState === XMLHttpRequest.DONE)
                console.log('error')
        }
    }
request.open('GET', url, true)
request.send()
}

function getScores(data) 
{
    var matchup = new Array()
    var players = new Array()
        
    for (i in data['schedule'])
    {
        var sched = data['schedule'][i]
        if (sched['matchupPeriodId'] == week)
        {
            let teamId = sched['away']['teamId']
            let teamName = getTeamName(teamId)
            let teamLogo = getTeamLogo(teamId)
            let playerEntry = getPlayers(teamId)
            let score = 0
            for (j in playerEntry)
            {
                let name = playerEntry[j]['Name']
                let slot = playerEntry[j]['Slot']
                let points = playerEntry[j]['Points']
                points = Math.round(points * 100) / 100
                //Calculates current score for teams
                if (slot < 20)
                    score += points
                //Converts numeric lineup values into real positions
                slot = slotcodes[slot]
                players.push({Name:name, Slot:slot, Points:points})
            }
            score = Math.round(score * 100) / 100
            matchup.push({Logo:teamLogo, Team:teamName, Score:score})
            teamId = sched['home']['teamId']
            teamName = getTeamName(teamId)
            teamLogo = getTeamLogo(teamId)
            playerEntry = getPlayers(teamId)
            score = 0
            for (j in playerEntry)
            {
                let name = playerEntry[j]['Name']
                let slot = playerEntry[j]['Slot']
                let points = playerEntry[j]['Points']
                points = Math.round(points * 100) / 100
                //Calculates current score for teams
                if (slot < 20)
                {
                    score += points
                }
                //Converts numeric lineup values into real positions
                slot = slotcodes[slot]
                players.push({Name:name, Slot:slot, Points:points})
            }
            score = Math.round(score * 100) / 100
            matchup.push({Logo:teamLogo, Team:teamName, Score:score})
        }
    }
    let table = document.getElementById('gameNav')
    table.innerHTML = ''
    generateRows(table, matchup)

    let tab = document.getElementsByClassName('scores')[0]
    let tab2 = document.getElementsByClassName('scores')[1]
    let tab3 = document.getElementsByClassName('scores')[2]
    let tab4 = document.getElementsByClassName('scores')[3]
    let tab5 = document.getElementsByClassName('scores')[4]
    let tab6 = document.getElementsByClassName('scores')[5]
    tab.classList = "current"
    boxScore(tab, players, 0)
    tab.onclick = function () {
        tab.classList = "current"
        tab2.classList = "scores"
        tab3.classList = "scores"
        tab4.classList = "scores"
        tab5.classList = "scores"
        tab6.classList = "scores"
        boxScore(tab, players, 0)
    }
    tab2.onclick = function () {
        tab.classList = "scores"
        tab2.classList = "current"
        tab3.classList = "scores"
        tab4.classList = "scores"
        tab5.classList = "scores"
        tab6.classList = "scores"
        boxScore(tab2, players, 1)
    }
    tab3.onclick = function () {
        tab.classList = "scores"
        tab2.classList = "scores"
        tab3.classList = "current"
        tab4.classList = "scores"
        tab5.classList = "scores"
        tab6.classList = "scores"
        boxScore(tab3, players, 2)
    }
    tab4.onclick = function () {
        tab.classList = "scores"
        tab2.classList = "scores"
        tab3.classList = "scores"
        tab4.classList = "current"
        tab5.classList = "scores"
        tab6.classList = "scores"
        boxScore(tab4, players, 3)
    }
    tab5.onclick = function () {
        tab.classList = "scores"
        tab2.classList = "scores"
        tab3.classList = "scores"
        tab4.classList = "scores"
        tab5.classList = "current"
        tab6.classList = "scores"
        boxScore(tab5, players, 4)
    }
    tab6.onclick = function () {
        tab.classList = "scores"
        tab2.classList = "scores"
        tab3.classList = "scores"
        tab4.classList = "scores"
        tab5.classList = "scores"
        tab6.classList = "current"
        boxScore(tab6, players, 5)
    }
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

function getPlayers(teamId)
{
    i = 0
    let points = 0
    let playerEntry = new Array()
    
    roster = data['teams'][teamId-1]['roster']['entries']
    for (i in roster)
    {
        let name = roster[i]['playerPoolEntry']['player']['fullName']
        let slot = roster[i]['lineupSlotId']
        //Changes flex players to slotId 7 so they can be sorted correctly
        if (slot == 23)
            slot = 7

        let hasPlayed = false
        points = 0
        j = 0
        for(j in roster[i]['playerPoolEntry']['player']['stats'])
        {
            tempYear = roster[i]['playerPoolEntry']['player']['stats'][j]['scoringPeriodId']
            tempSource = roster[i]['playerPoolEntry']['player']['stats'][j]['statSourceId']
            if ((tempYear == week) && (tempSource == 0))
                points = roster[i]['playerPoolEntry']['player']['stats'][j]['appliedTotal']
        }
        if (slot != 21)
            playerEntry.push({Name:name, Slot:slot, Points:points})
    }
    playerEntry.sort((a,b) => (a.Slot >= b.Slot) ? 1 : -1)
    return playerEntry
}

function generateRows(table, data)
{
    let row = table.insertRow()

    let i = 0
    for (let element of data)
    {
        if ((i % 2) == 0)
        {
            var tab = document.createElement("TABLE")
            row.appendChild(tab)
            tab.className = "scores"
        }
        let row2 = tab.insertRow()
        j = 0
        for (key in element) 
        {
            let cell = row2.insertCell()
            if (j % 3 == 0)
            {
                cell.className = 'logo'   
                let img = document.createElement('img')
                img.src = element[key]
                cell.appendChild(img)
            }
            else
            {
                let text = document.createTextNode(element[key])
                cell.appendChild(text)
            }
            j++
        }
        i++
    }
}

function boxScore(game, players, id)
{
    let playerCount = 15
    let gamePlayers = (playerCount * 2) * id

    let table = document.getElementById("scoreTable")
    table.innerHTML = ""
    let row = table.insertRow()
    let th = document.createElement("TH")
    th.innerHTML = game.getElementsByTagName("td")[0].innerHTML
    th.className = "bScoreImage"
    row.appendChild(th)
    th = document.createElement("TH")
    th.innerHTML = game.getElementsByTagName("td")[1].innerHTML
    th.colSpan = 2
    row.appendChild(th)
    th = document.createElement("TH")
    th.innerHTML = game.getElementsByTagName("td")[3].innerHTML
    th.className = "bScoreImage"
    row.appendChild(th)
    th = document.createElement("TH")
    th.innerHTML = game.getElementsByTagName("td")[4].innerHTML
    th.colSpan = 2
    row.appendChild(th)
    for (let i = gamePlayers; i < (gamePlayers + playerCount); i++)
    {
        row = table.insertRow()
        for (let j = 0; j < 6; j++) 
        {
            let cell = row.insertCell()
            if (j % 3 == 0)
            {
                let text = document.createTextNode(players[i]['Slot'])
                cell.appendChild(text)
            }
            else if (j % 3 == 1)
            {
                let text = document.createTextNode(players[i]['Name'])
                cell.appendChild(text)
            }
            else
            {
                let text = document.createTextNode(players[i]['Points'])
                cell.appendChild(text)
            }
            if (j == 2)
            {
                var temp = i
                i = i + 15
            }
            if (j == 5)
                i = temp
        }
        if (i == gamePlayers + 8)
        {
            row = table.insertRow()
            let cell = row.insertCell()
            let text = document.createTextNode("Score: " + game.getElementsByTagName("td")[2].innerHTML)
            cell.appendChild(text)
            cell.className = "totalScore"
            cell.colSpan = 3
            cell = row.insertCell()
            text = document.createTextNode("Score: " + game.getElementsByTagName("td")[5].innerHTML)
            cell.appendChild(text)
            cell.className = "totalScore"
            cell.colSpan = 3
        }
    }
}
