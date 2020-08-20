var request = new XMLHttpRequest()
var schedule = new Array()
var users = [{id: 1, name:"Avery"}, //Used to convert user IDS to readable names
            {id: 2, name:"Hunter"},    
            {id: 3, name:"Dallas"},
            {id: 4, name:"Brian"},
            {id: 5, name:"George"},
            {id: 6, name:"David"},
            {id: 7, name:"Alec"},
            {id: 8, name:"Joe Willie"},
            {id: 9, name:"Zach"},
            {id: 10, name:"Riley"},
            {id: 11, name:"Cedric"},
            {id: 12, name:"Christian"}]

request.open('GET', 'https://fantasy.espn.com/apis/v3/games/ffl/seasons/2020/segments/0/leagues/1001965?view=mBoxscore', true)
request.onload = function()
{
    data = JSON.parse(this.response)

    let i = 0
    for (id in data['schedule'])
    {
        if(data['schedule'][i]['home']['teamId'] == 11 || data['schedule'][i]['away']['teamId'] == 11)
        {
            let week = data['schedule'][i]['matchupPeriodId']
            let homeTeam = data['schedule'][i]['home']['teamId']
            let homePoints = data['schedule'][i]['home']['totalPoints']
            let awayTeam = data['schedule'][i]['away']['teamId']
            let awayPoints = data['schedule'][i]['away']['totalPoints']
            let j = 0
            for (id in users)
            {
                if (homeTeam == users[j]['id'])
                    homeTeam = users[j]['name']
                if (awayTeam == users[j]['id'])
                    awayTeam = users[j]['name']
                j++
            }
            schedule.push({week:week, hTeam:homeTeam, hScore:homePoints, aTeam:awayTeam, aScore:awayPoints})
        }
        i++
    }
    let table = document.getElementById('scheduleBody')
    generateRows(table, schedule)
}

function generateRows(table, data)
{
    let i = 0
    for (let element of data)
    {
        let row = table.insertRow()
        //Assigns class so that row colors alternate
        if (i % 2 == 1)
            {
                row.className = 'odd'  
            }
        if (i == 8)
            {
                row.id = 'starters'
            }
            i++
        for (key in element) 
        {
            let cell = row.insertCell();
            let text = document.createTextNode(element[key]);
            cell.appendChild(text);
        }
    }
}

//Gets the team logo and names at the top of the page.
var request2 = new XMLHttpRequest()
request2.open('GET', 'https://fantasy.espn.com/apis/v3/games/ffl/seasons/2020/segments/0/leagues/1001965?view=standings', true)
request2.onload = function()
{
    data = JSON.parse(this.response)
    if (request.status >= 200 && request.status < 400)
    {
        let team = data['teams'][10]['location'] + " " + data['teams'][10]['nickname']
        let logo = data['teams'][10]['logo']
        
        let pic = document.getElementById('image')
        var img = document.createElement('img')
        img.src = logo
        pic.appendChild(img)

        let name = document.getElementById('teamName')
        var text = document.createTextNode(team)
        name.appendChild(text)
    }
    else
    {
        console.log('Logo and team name not loaded')
    }
}
request.send()
request2.send()