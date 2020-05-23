var request = new XMLHttpRequest()
var teams = new Array()
var teams1 = new Array()
var teams2 = new Array()

request.open('GET', 'https://fantasy.espn.com/apis/v3/games/ffl/seasons/2020/segments/0/leagues/1001965?view=standings', true)
request.onload = function()
{
    var i = 0
    data = JSON.parse(this.response)

  if (request.status >= 200 && request.status < 400)
  {
    //Gets the necessary data from ESPN
    for (id in data['teams'])
    {
        let team = data['teams'][i]['location'] + " " + data['teams'][i]['nickname']
        let logo = data['teams'][i]['logo']
        let id = data['teams'][i]['id']
        teams.push({Logo:logo, Team:team, Id:id})
        i++
    }
    //Sorts teams alphabetically
    teams.sort((a,b) => (a.Team > b.Team) ? 1 : -1)
    
    //Used for small screen devices, puts half of the teams
    //in one table, the rest in another.
    for (i = 0; i < teams.length; i++)
    {
        if (i < 6)
        {
            teams1.push(teams[i])
        }
        else
        {
            teams2.push(teams[i])
        }
    }
  }
  else
  {
    console.log('error')
  }
    let table = document.getElementById('t1')
    generateRows(table, teams1)
    table = document.getElementById('t2')
    generateRows(table, teams2)
}

request.send()

//Generates the table for the website
function generateRows(table, data)
{
    for (let element of data)
    {
        let row = table.insertRow()
        let i = 0
        //Inserts the logo and team name into the table
        for (key in element) 
        {
            if (key != 'Id')
            {
                let cell = row.insertCell();
                if (i % 2 == 0)
                {
                    cell.className = 'logo'   
                    var img = document.createElement('img')
                    img.src = element[key]
                    cell.appendChild(img)
                }
                else
                {
                    cell.className = 'teamName' 
                    let text = document.createTextNode(element[key])
                    cell.appendChild(text);
                }
            }
            i++
        }
        //Inserts roster links and schedule links
        let cell = row.insertCell()
        cell.className = 'link'   
        var link = document.createElement('a')
        var text = document.createTextNode('Roster')
        link.appendChild(text)
        //Sets the appropriate page links here
        if (element[key] == 1)
            link.setAttribute('href', 'team1roster.html')
        cell.appendChild(link)
        cell = row.insertCell()
        cell.className = 'link'   
        link = document.createElement('a')
        text = document.createTextNode('Schedule')
        link.appendChild(text)
        cell.appendChild(link)
    }
}