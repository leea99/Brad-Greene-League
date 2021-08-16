var load
var week = 1
var currentGame = 0
var playerAmount = 15
var url = "https://fantasy.espn.com/apis/v3/games/ffl/seasons/2021/segments/0/leagues/1001965?view=mMatchup&view=mMatchupScore&view=mTeam&scoringPeriodId=1"
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
    url = "https://fantasy.espn.com/apis/v3/games/ffl/seasons/2021/segments/0/leagues/1001965?view=mMatchup&view=mMatchupScore&view=mTeam&scoringPeriodId=" + week
         
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
    let gameId = 0
        
    for (i in data['schedule']) //Gets all the players names, slots, points, team, and game for the given week.
    {
        var sched = data['schedule'][i]
        if (sched['matchupPeriodId'] == week)
        {
            let teamId
            let teamName
            let teamLogo
            let playerEntry
            let score
            try
            {
                teamId = sched['away']['teamId']
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
                        score += points
                    //Converts numeric lineup values into real positions
                    slot = slotcodes[slot]
                    players.push({Name:name, Slot:slot, Points:points, Home:false, Game:gameId})
                }
                score = Math.round(score * 100) / 100
                matchup.push({Logo:teamLogo, Team:teamName, Score:score})
            }
            catch(err)
            {
                for (let j = 0; j <= playerAmount; j++ )
                {
                    players.push({Name:"--", Slot:"--", Points:"0", Home:false, Game:gameId})
                }
                matchup.push({Logo:"https://g.espncdn.com/lm-app/lm/img/shell/shield-FFL.svg", Team:"BYE", Score:0})
            }
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
                players.push({Name:name, Slot:slot, Points:points, Home:true, Game:gameId})
            }
            score = Math.round(score * 100) / 100
            matchup.push({Logo:teamLogo, Team:teamName, Score:score})
            gameId++
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
        if (slot != 21) //Prevents players on IR from being displayed
            playerEntry.push({Name:name, Slot:slot, Points:points})
    }
    while (playerEntry.length < 15) //Fills the team with empty slots if a team has less than 15 players
    {
        playerEntry.push({Name:"Empty", Slot:20, Points:0})
    }
    
    let correctQb = false
    let correctRb = 0
    let correctWr = 0
    let correctTe = false
    let correctFlex = 0
    let correctD = false
    for (p in playerEntry) //Checks if each starter slot is filled
    {
        if (playerEntry[p]["Slot"] == 0)
            correctQb = true
        else if (playerEntry[p]["Slot"] == 2)
            correctRb++
        else if (playerEntry[p]["Slot"] == 4)
            correctWr++
        else if (playerEntry[p]["Slot"] == 6)
            correctTe = true
        else if (playerEntry[p]["Slot"] == 7)
            correctFlex++
        else if (playerEntry[p]["Slot"] == 16)
            correctD = true
    }
    //Adds an empty slot if a team is missing a starter
    if (!correctQb)
        playerEntry.push({Name:"Empty", Slot:0, Points:0})
    while (correctRb < 2)
    {
        playerEntry.push({Name:"Empty", Slot:2, Points:0})
        correctRb++
    }
    while (correctWr < 2)
    {
        playerEntry.push({Name:"Empty", Slot:4, Points:0})
        correctWr++
    }
    if (!correctTe)
        playerEntry.push({Name:"Empty", Slot:6, Points:0})
    while (correctFlex < 2)
    {
        playerEntry.push({Name:"Empty", Slot:7, Points:0})
        correctFlex++
    }
    if (!correctD)
        playerEntry.push({Name:"Empty", Slot:16, Points:0})
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

//Generates the detailed boxscore
function boxScore(game, players, id)
{
    let homePlayers = new Array()
    let roadPlayers = new Array()
    let gameTotal = 0

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

    //Splits players into home and road rosters
    for (i in players)
    {
        if (players[i]['Game'] == id)
        {
            if (players[i]['Home'] == true)
                homePlayers.push(players[i])
            else
                roadPlayers.push(players[i])
        }
    }

    //Ensures that home and away arrays are the same length for table row purposes
    while(homePlayers.length > roadPlayers.length)
        roadPlayers.push({Name:"Empty", Slot:"Bench", Points:0, Home:false, Game:id})
    while(homePlayers.length < roadPlayers.length)
        homePlayers.push({Name:"Empty", Slot:"Bench", Points:0, Home:false, Game:id})

    gameTotal = roadPlayers.length + homePlayers.length
        
    //Fills a table with the selected matchup's players and scores
    for (let i = 0; i < gameTotal / 2; i++)
    {
        row = table.insertRow()
        let cell = row.insertCell()
        let text = document.createTextNode(roadPlayers[i]['Slot'])
        cell.appendChild(text)
        cell = row.insertCell()
        text = document.createTextNode(roadPlayers[i]['Name'])
        cell.appendChild(text)
        cell = row.insertCell()
        text = document.createTextNode(roadPlayers[i]['Points'])
        cell.appendChild(text)
        cell = row.insertCell()
        text = document.createTextNode(homePlayers[i]['Slot'])
        cell.appendChild(text)
        cell = row.insertCell()
        text = document.createTextNode(homePlayers[i]['Name'])
        cell.appendChild(text)
        cell = row.insertCell()
        text = document.createTextNode(homePlayers[i]['Points'])
        cell.appendChild(text)
        
        if (i == 8)
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
    if (week == "14")
    {
        let table = document.getElementById("gameNav").getElementsByTagName("table")
        for (let i = 0; i < table.length; i++) 
        {
            table[i].style.width = "14.28%"
        }
    }
}
