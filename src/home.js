var request = new XMLHttpRequest()
var div1 = new Array()
var div2 = new Array()
var div3 = new Array()
var div4 = new Array()

request.open('GET', 'https://fantasy.espn.com/apis/v3/games/ffl/seasons/2020/segments/0/leagues/1001965?view=standings', true)
request.onload = function()
{
    var i = 0
    data = JSON.parse(this.response)

  if (request.status >= 200 && request.status < 400) {
    for (id in data['teams'])
    {
      let team = data['teams'][i]['location'] + " " + data['teams'][i]['nickname']
      let wins = data['teams'][i]['record']['overall']['wins']
      let losses= data['teams'][i]['record']['overall']['losses']
      let ties = data['teams'][i]['record']['overall']['ties']
      let seed = data['teams'][i]['playoffSeed']

      if (data['teams'][i]["divisionId"] == 3)
      {
        div1.push({Team:team, Wins:wins, Losses:losses, Ties:ties, Seed:seed})
      }
      else if (data['teams'][i]["divisionId"] == 2)
      {
        div2.push({Team:team, Wins:wins, Losses:losses, Ties:ties, Seed:seed})
      }
      else if (data['teams'][i]["divisionId"] == 1)
      {
        div3.push({Team:team, Wins:wins, Losses:losses, Ties:ties, Seed:seed})
      }
      else
      {
        div4.push({Team:team, Wins:wins, Losses:losses, Ties:ties, Seed:seed})
      }
      i++
    }
  } else {
    console.log('error')
  }

  div1.sort((a,b) => (a.Seed > b.Seed) ? 1 : -1)
  div2.sort((a,b) => (a.Seed > b.Seed) ? 1 : -1)
  div3.sort((a,b) => (a.Seed > b.Seed) ? 1 : -1)
  div4.sort((a,b) => (a.Seed > b.Seed) ? 1 : -1)

  for (var i in div1) {
    delete div1[i]["Seed"]
  }
  for (var i in div2) {
    delete div2[i]["Seed"]
  }
  for (var i in div3) {
    delete div3[i]["Seed"]
  }
  for (var i in div4) {
    delete div4[i]["Seed"]
  }

  let table = document.getElementById('t1')
  let info = Object.keys(div2[0])
  generateTableHead(table, info)
  generateTable(table, div2)
  table = document.getElementById('t2')
  info = Object.keys(div4[0])
  generateTableHead(table, info)
  generateTable(table, div4)
  table = document.getElementById('t3')
  info = Object.keys(div3[0])
  generateTableHead(table, info)
  generateTable(table, div3)
  table = document.getElementById('t4')
  info = Object.keys(div1[0])
  generateTableHead(table, info)
  generateTable(table, div1)
}

request.send()
  
function generateTableHead(table, data) {
  let thead = table.createTHead();
  let row = thead.insertRow();
  let first = true
  for (let key of data) {
    let th = document.createElement("th");
    let text = document.createTextNode(key);
    if (first == true)
    {
      th.className = 'test'
      first = false
    }
    th.appendChild(text);
    row.appendChild(th);
  }
}

function generateTable(table, data) {
  for (let element of data) {
    let row = table.insertRow();
    for (key in element) 
    {
      let cell = row.insertCell();
      let text = document.createTextNode(element[key]);
      cell.appendChild(text);
    }
  }
}

window.onscroll = function() {myFunction()};

var navbar = document.getElementById("navbar");
var sticky = navbar.offsetTop;

function myFunction() {
  if (window.pageYOffset >= sticky) {
    navbar.classList.add("sticky")
    console.log('add')
  } else {
    navbar.classList.remove("sticky");
    console.log('remove')
  }
}
  