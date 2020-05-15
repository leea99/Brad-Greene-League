var request = new XMLHttpRequest()
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
        if (i % 2 == 0)
        {
            teams1.push({Logo:logo, Team:team})
        }
        else
        {
            teams2.push({Logo:logo, Team:team})
        }
        i++
    }
    teams1.sort((a,b) => (a.Team > b.Team) ? 1 : -1)
    teams2.sort((a,b) => (a.Team > b.Team) ? 1 : -1)
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
                let text = document.createTextNode(element[key]);
                cell.appendChild(text);
            }
            i++
        }
    }
}