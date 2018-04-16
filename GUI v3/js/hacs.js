var requestDomainName = 'http://api.bartrug.me/';

function getEventsByDate(deviceName, month, day, year) 
{
    var requestPath = 'get-events-by-date/';
    var requestURL = requestDomainName + requestPath + deviceName + '-' + month + day + year;

    var r = new XMLHttpRequest();
    r.open('GET', requestURL);
    r.responseType = 'json';
    r.send();

    r.onload = function() 
    {

/*
        Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
        Chart.defaults.global.defaultFontColor = '#292b2c';
        // -- Area Chart Example
        var ctx = document.getElementById("deviceChart");
        var myLineChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: ["Mar 1", "Mar 2", "Mar 3", "Mar 4", "Mar 5", "Mar 6", "Mar 7", "Mar 8", "Mar 9", "Mar 10", "Mar 11", "Mar 12", "Mar 13"],
            datasets: [{
              label: "Sessions",
              lineTension: 0.3,
              backgroundColor: "rgba(2,117,216,0.2)",
              borderColor: "rgba(2,117,216,1)",
              pointRadius: 5,
              pointBackgroundColor: "rgba(2,117,216,1)",
              pointBorderColor: "rgba(255,255,255,0.8)",
              pointHoverRadius: 5,
              pointHoverBackgroundColor: "rgba(2,117,216,1)",
              pointHitRadius: 20,
              pointBorderWidth: 2,
              data: [10000, 30162, 26263, 18394, 18287, 28682, 31274, 33259, 25849, 24159, 32651, 31984, 38451],
            }],
          },
          options: {
            scales: {
              xAxes: [{
                time: {
                  unit: 'date'
                },
                gridLines: {
                  display: false
                },
                ticks: {
                  maxTicksLimit: 7
                }
              }],
              yAxes: [{
                ticks: {
                  min: 0,
                  max: 40000,
                  maxTicksLimit: 5
                },
                gridLines: {
                  color: "rgba(0, 0, 0, .125)",
                }
              }],
            },
            legend: {
              display: false
            }
          }
        });
        // -- Bar Chart Example
        var ctx = document.getElementById("myBarChart");
        var myLineChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ["January", "February", "March", "April", "May", "June"],
            datasets: [{
              label: "Revenue",
              backgroundColor: "rgba(2,117,216,1)",
              borderColor: "rgba(2,117,216,1)",
              data: [4215, 5312, 6251, 7841, 9821, 14984],
            }],
          },
          options: {
            scales: {
              xAxes: [{
                time: {
                  unit: 'month'
                },
                gridLines: {
                  display: false
                },
                ticks: {
                  maxTicksLimit: 6
                }
              }],
              yAxes: [{
                ticks: {
                  min: 0,
                  max: 15000,
                  maxTicksLimit: 5
                },
                gridLines: {
                  display: true
                }
              }],
            },
            legend: {
              display: false
            }
          }
        });
        // -- Pie Chart Example
        var ctx = document.getElementById("myPieChart");
        var myPieChart = new Chart(ctx, {
          type: 'pie',
          data: {
            labels: ["Blue", "Red", "Yellow", "Green"],
            datasets: [{
              data: [12.21, 15.58, 11.25, 8.32],
              backgroundColor: ['#007bff', '#dc3545', '#ffc107', '#28a745'],
            }],
          },
        });
        **/
    }

    r.onerror = function() 
    {
        console.log('There was an error while processing getEventsByDate(' + deviceName + '-' + month + day + year + ')');
    }

}

function getEventsByMonth(deviceName, month) 
{
    var requestPath = 'get-events-for-month/';
    var requestURL = requestDomainName + requestPath + deviceName + '-' + month;

    var r = new XMLHttpRequest();
    r.open('GET', requestURL);
    r.responseType = 'json';
    r.send();

    r.onload = function() 
    {
        var data = r.response;

        var time = [];
        var temp = [];
        var humi = [];

        for (var obj in data)
        {
            for (var key in data[obj])
            {

                //console.log(key); // Times
                var d = JSON.parse(data[obj][key].values);
                //console.log(d.temp); // Temperature
                //console.log(d.humidity); // Humidity
                time.push(key);
                temp.push(d.temp);
                humi.push(d.humidity);
            }
        }


        console.log(time);
        console.log(temp);
        console.log(humi);
        Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
        Chart.defaults.global.defaultFontColor = '#292b2c';

        var ctx = document.getElementById("deviceChart");
        var myLineChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: time,
            datasets: [{
              label: "Temperature",
              lineTension: 0.3,
              backgroundColor: "rgba(2,117,216,0.2)",
              borderColor: "rgba(2,117,216,1)",
              pointRadius: 5,
              pointBackgroundColor: "rgba(2,117,216,1)",
              pointBorderColor: "rgba(255,255,255,0.8)",
              pointHoverRadius: 5,
              pointHoverBackgroundColor: "rgba(2,117,216,1)",
              pointHitRadius: 20,
              pointBorderWidth: 2,
              data: temp,
            }],
          },
          options: {
            scales: {
              xAxes: [{
                time: {
                  unit: 'date'
                },
                gridLines: {
                  display: false
                },
                ticks: {
                  maxTicksLimit: 7
                }
              }],
              yAxes: [{
                ticks: {
                  min: -10,
                  max: 100,
                  maxTicksLimit: 5
                },
                gridLines: {
                  color: "rgba(0, 0, 0, .125)",
                }
              }],
            },
            legend: {
              display: false
            }
          }
        });
    }

    r.onerror = function() 
    {
        console.log('There was an error while processing getEventsByMonth(' + deviceName  + '-' + month + ')');
    }

}

function getUser(username) 
{
    var requestPath = 'users/';
    var requestURL = requestDomainName + requestPath + username;

    var r = new XMLHttpRequest();
    r.open('GET', requestURL);
    r.responseType = 'json';
    r.send();

    r.onload = function() 
    {

    }

    r.onerror = function() 
    {
        console.log('There was an error while processing getUser(' + username  + ')');
    }

}

function getUsers() 
{
    var requestPath = 'users/';
    var requestURL = requestDomainName + requestPath;
    var r = new XMLHttpRequest();
    r.open('GET', requestURL);
    r.responseType = 'json';
    r.send();

    r.onload = function() 
    {
        var users = r.response;

        var usernames = [];
        for (var key in users.users)
        {
            usernames.push(users.users[key].username);
        }

        console.log( usernames);
        
    }

    r.onerror = function() 
    {
        console.log('There was an error while processing getUser()');
    }
}

function getDeviceAttribute(deviceName) 
{
    var requestPath = 'devices-get-currData/';
    var requestURL = requestDomainName + requestPath + deviceName;

    var r = new XMLHttpRequest();
    r.open('GET', requestURL);
    r.responseType = 'json';
    r.send();

    r.onload = function() 
    {

    }

    r.onerror = function() 
    {
        console.log('There was an error while processing getDeviceAttribute(' + deviceName  + ')');
    }

}

function putsUser() 
{
    var requestPath = 'post-user/';

}

function putsUserAttribute() 
{
    var requestPath = 'post-user-attribute/';

}

function getDevice(deviceName) 
{
    var requestPath = 'get-device/';
    var requestURL = requestDomainName + requestPath + deviceName;

    var r = new XMLHttpRequest();
    r.open('GET', requestURL);
    r.responseType = 'json';
    r.send();

    r.onload = function() 
    {

    }

    r.onerror = function() 
    {
        console.log('There was an error while processing getDeviceWS(' + deviceName  + ')');
    }

}

function putsDevice() 
{
    var requestPath = 'post-device/';

}

function deleteDevice(deviceName) 
{
    var requestPath = 'delete-device/';

}

function deleteUser(username) 
{
    var requestPath = 'delete-user/';

}

function getDevices() 
{
    var requestPath = 'devices/';
    var requestURL = requestDomainName + requestPath;

    var r = new XMLHttpRequest();
    r.open('GET', requestURL);
    r.responseType = 'json';
    r.send();

    r.onload = function() 
    {
        devInfo = document.getElementById("devInfo");
        devices = r.response;

        var names = []
        for (var key in devices.devices)
        {
            var tr = document.createElement("tr");
            var td = document.createElement("td");
            var txt = document.createTextNode(key);

            for (var i in devices.devices[key])
            {
                if (typeof devices.devices[key][i] === "string")
                {
                    td = document.createElement("td");
                
                    txt = document.createTextNode(devices.devices[key][i]);
                    td.appendChild(txt);    
                    tr.appendChild(td); 
                }
            }

            var div = document.createElement("div");
            txt = document.createTextNode("Delete");
            div.appendChild(txt);
            div.classList.add('btn');
            div.classList.add('btn-danger');
            div.classList.add('table-btn');
            td = document.createElement("td");
            td.appendChild(div);
            tr.appendChild(td);

            div = document.createElement("div");
            txt = document.createTextNode("Edit");
            div.appendChild(txt);
            div.classList.add('btn');
            div.classList.add('btn-info');
            div.classList.add('table-btn');
            td = document.createElement("td");
            td.appendChild(div);
            tr.appendChild(td);

            devInfo.appendChild(tr);
        }   
        
    }

    r.onerror = function() 
    {
        console.log('There was an error while processing getDevices()');
    }

}