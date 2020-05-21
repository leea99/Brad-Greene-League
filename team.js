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
    for (id in data['teams'])
    {
        let team = data['teams'][i]['location'] + " " + data['teams'][i]['nickname']
        let logo = data['teams'][i]['logo']
        teams.push({Logo:logo, Team:team})
        i++
    }
    teams.sort((a,b) => (a.Team > b.Team) ? 1 : -1)
    
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

function generateRows(table, data)
{
    for (let element of data)
    {
        let row = table.insertRow()
        let i = 0
        for (key in element) 
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
                let text = document.createTextNode(element[key]);
                cell.appendChild(text);
            }
            i++
        }
        let cell = row.insertCell()
        cell.className = 'link'   
        var link = document.createElement('a')
        let text = document.createTextNode('Roster')
        link.appendChild(text)
        cell.appendChild(link)
        cell = row.insertCell()
        cell.className = 'link'   
        link = document.createElement('a')
        text = document.createTextNode('Schedule')
        link.appendChild(text)
        cell.appendChild(link)
    }
}