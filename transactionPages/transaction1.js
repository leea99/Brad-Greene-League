var week = 1
var filters = { "players": { "limit": 1500, "sortDraftRanks": { "sortPriority": 100, "sortAsc": true, "value": "STANDARD" } } }
var nflTeams = [{id: 0, name:"Free Agent"}, //Used to convert team ids into names
                {id: 1, name:"Falcons"},    //Some of these I'm unsure on
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
                {id: 28, name:"Washington"},
                {id: 29, name:"Panthers"},
                {id: 30, name:"Jaguars"},
                {id: 33, name:"Ravens"},
                {id: 34, name:"Texans"}]
var list = new Array()

main()
function main()
{
    var url = "https://fantasy.espn.com/apis/v3/games/ffl/seasons/2020/segments/0/leagues/1001965?view=kona_player_info&view=mTransactions2&view=mTeam&view=mStatus&scoringPeriodId=" + week

    $.ajax({    //GET request that gets the list of all players and transactions
        url: url,
        type: 'GET',
        dataType: 'json',
        headers: {"x-fantasy-filter": JSON.stringify(filters)},
        success: function (result) {
            getPlayers(result);
        },
    });
}

//Gets a list of all transactions as well subsitute the playerIds with names
function getPlayers(result)
{
    let currentWeek = result['status']['transactionScoringPeriod']
    for (i in result['transactions'])
    {
        if (result['transactions'][i]['status'] == "EXECUTED")
        {
            let id = result['transactions'][i]['id']
            let time = result['transactions'][i]['proposedDate']
            let team = result['transactions'][i]['teamId']
            
            for (j in result['transactions'][i]['items'])
            {
                let type = result['transactions'][i]['items'][j]['type']
                if (type != "LINEUP" && type != "DRAFT")
                {
                    let playerId = result['transactions'][i]['items'][j]['playerId']
                    for(k in result['players'])
                    {
                        if (playerId == result['players'][k]['player']['id'])
                        {
                            let name = result['players'][k]['player']['fullName']
                            let pos = result['players'][k]['player']['defaultPositionId']
                            if (pos == 1)
                                pos = 'QB'
                            else if (pos == 2)
                                pos = 'RB'
                            else if (pos == 3)
                                pos = 'WR'
                            else if (pos == 4)
                                pos = 'TE'
                            else if (pos == 16)                 
                                pos = 'D/ST'
                            let proTeam = result['players'][k]['player']['proTeamId']
                            for (t in result['teams'])
                            {
                                if (result['teams'][t]['id'] == team)
                                    team = result['teams'][t]['location'] + " " + result['teams'][t]['nickname']
                            }
                            for (entry in nflTeams)
                            {
                                if (nflTeams[entry]["id"] == proTeam)
                                {
                                    proTeam = nflTeams[entry]["name"]
                                    break
                                }             
                            }   
                            list.push({Id:id, Type:type, Name:name, Team:team, proTeam:proTeam, Pos:pos, Time:time})
                            break;
                        }
                    }
                }
            }
        }
    }
    if (++week <= currentWeek)
    {
        main()  //Gets the next week transactions if that week hasn't started
    }
    else
    {
        list.sort((a,b) => (a.Time <= b.Time) ? 1 : -1) //Sorts the transactions with the most recent first   
        generatePages()  
        fillTable()                            
    }       
}

//Fills the table on the website with transactions
function fillTable() 
{
    let table = document.getElementById("transTable")
    table.innerHTML = ""
    let i = 0
    
    i = document.getElementById("pageNum").value * 25

    let limit = i+25
    while (i < limit)
    {
        let row = table.insertRow()
        let cell = row.insertCell()
        dateObj = new Date(list[i]['Time'])
        utcString = dateObj.toLocaleString()
        let entry = document.createTextNode(utcString)
        cell.appendChild(entry)
        cell = row.insertCell()
        entry = document.createTextNode(list[i]['Team'] + " " + list[i]['Type'] + " " + list[i]["Name"] + ", " + list[i]["proTeam"]
        + " " + list[i]["Pos"])
        cell.appendChild(entry)
        i++
        if (i > list.length - 1)
            break
    }
}


//Creates the page options at the bottom of the page
function generatePages()
{
    const pageItems = 25
    let pages = Math.ceil(list.length / pageItems)
    let select = document.getElementById("pageNum")

    for (let i = 1; i <= pages; i++)
    {
        let option = document.createElement("OPTION")
        option.value = i - 1
        option.innerHTML = i
        select.append(option)
    }
}

