var members = [{id: 1, name:"Avery"},
                {id: 2, name:"Hunter"},
                {id: 3, name:"Dallas"},
                {id: 4, name:"Brian"},
                {id: 5, name:"George"},
                {id: 6, name:"David"},
                {id: 7, name:"Alec"},
                {id: 8, name:"Joe Willie"},
                {id: 9, name:"Zach"},
                {id: 10, name:"Riley"},
                {id: 11, name:"Axel"},
                {id: 12, name:"Christian"}]

main()

function main()
{
    let url = "https://fantasy.espn.com/apis/v3/games/ffl/seasons/2021/segments/0/leagues/1001965?view=mMatchup"

    $.ajax({    //GET request that gets the list of all players and transactions
        url: url,
        type: 'GET',
        dataType: 'json',
        success: function (result) {
            scores = getScores(result)
            fillTable(scores)
        },
    });
}

function getScores(result)
{
    let scores = new Array()
    let schedule = result["schedule"]

    for (i in schedule)
    {
        let awayTeam = "BYE"
        let homeTeam = "BYE"
        let awayScore = 0
        let homeSore = 0
        let week = schedule[i]['matchupPeriodId']
        try
        {
            awayTeam = schedule[i]['away']['teamId']
            awayScore = schedule[i]['away']['totalPoints']
        }
        catch(err)
        {}
        try
        {
            homeTeam = schedule[i]['home']['teamId']
            homeScore = schedule[i]['home']['totalPoints']
        }
        catch(err)
        {}
        if (awayTeam != "BYE")
        {
            for (j in members)
            {
                if (members[j]["id"] == awayTeam)
                {
                    awayTeam = members[j]["name"]
                    break
                }
            }
        }
        if (homeTeam != "BYE")
        {
            for (j in members)
            {
                if (members[j]["id"] == homeTeam)
                {
                    homeTeam = members[j]["name"]
                    break
                }
            }
        }
        scores.push({Week: week, HomeTeam: homeTeam, HomeScore: homeScore, AwayTeam: awayTeam, AwayScore: awayScore})
    }
    return scores
}

function fillTable(scores)
{
    let week = 0
    let table = document.getElementById("content")
    for (i in scores)
    {
        if (scores[i]["Week"] != week)
        {
            week = scores[i]["Week"]
            let row = table.insertRow()
            let th = document.createElement("th")
            th.colSpan = "4"
            let weekText = document.createTextNode("Week " + week)
            th.appendChild(weekText)
            row.appendChild(th)
            row = table.insertRow()
            row.classList.add("header")
            let td = document.createElement("td")
            let text = document.createTextNode("Winning Team")
            td.appendChild(text)
            row.appendChild(td)
            td = document.createElement("td")
            text = document.createTextNode("Score")
            td.appendChild(text)
            row.appendChild(td)
            td = document.createElement("td")
            text = document.createTextNode("Losing Team")
            td.appendChild(text)
            row.appendChild(td)
            td = document.createElement("td")
            text = document.createTextNode("Score")
            td.appendChild(text)
            row.appendChild(td)
        }
        let row = table.insertRow()
        if (i % 2 == 1)
        {
            row.classList.add("odd")
        }
        if (scores[i]["HomeScore"] >= scores[i]["AwayScore"])
        {
            let td = document.createElement("TD")
            let text = document.createTextNode(scores[i]["HomeTeam"])
            td.appendChild(text)
            row.appendChild(td)
            td = document.createElement("TD")
            text = document.createTextNode(scores[i]["HomeScore"])
            td.appendChild(text)
            row.appendChild(td)
            td = document.createElement("TD")
            text = document.createTextNode(scores[i]["AwayTeam"])
            td.appendChild(text)
            row.appendChild(td)
            td = document.createElement("TD")
            text = document.createTextNode(scores[i]["AwayScore"])
            td.appendChild(text)
            row.appendChild(td)
        }
        else
        {
            let td = document.createElement("TD")
            let text = document.createTextNode(scores[i]["AwayTeam"])
            td.appendChild(text)
            row.appendChild(td)
            td = document.createElement("TD")
            text = document.createTextNode(scores[i]["AwayScore"])
            td.appendChild(text)
            row.appendChild(td)
            td = document.createElement("TD")
            text = document.createTextNode(scores[i]["HomeTeam"])
            td.appendChild(text)
            row.appendChild(td)
            td = document.createElement("TD")
            text = document.createTextNode(scores[i]["HomeScore"])
            td.appendChild(text)
            row.appendChild(td)
        }
    }
}