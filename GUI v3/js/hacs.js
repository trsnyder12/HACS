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

    }

    r.onerror = function() 
    {
        console.log('There was an error while processing getEventsByDate(' + deviceName + '-' + month + day + year + ')');
    }

}

function populateChart(deviceName, month, value, diction, time)
{   
    Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
        Chart.defaults.global.defaultFontColor = '#292b2c';

        var ctx = document.getElementById("deviceChart");
        ctx.remove();

        var con = document.getElementById("con");

        var can = document.createElement("canvas");
        can.setAttribute("id", "deviceChart");
        can.setAttribute("width", "100%");
        can.setAttribute("height", "30");
        con.appendChild(can);

        ctx = document.getElementById('deviceChart');

        /*
        <div class="card-body">
            <canvas id="deviceChart" width="100%" height="30"></canvas>
        </div>
        **/

        var myLineChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: time,
            datasets: [{
              label: value,
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
              data: diction[value],
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
                  min: Math.min.apply(null, (diction[value])) - Math.sqrt(Math.min.apply(null,diction[value])),
                  max: Math.max.apply(null, (diction[value])) + Math.sqrt(Math.max.apply(null,diction[value])),
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
        var del = document.getElementById('tit');
        if (del != null)
        {
            del.remove();
        }

        var head = document.getElementById("deviceCardHeader");
        var tit = document.createElement("a");
        var header = document.createTextNode(deviceName);
        tit.setAttribute("id", "tit");
        tit.appendChild(header);
        head.appendChild(tit);

        var data = r.response;

        var time = [];
        var values = [];
        var diction = {};

        for (var obj in data)
        {
            if (obj == '162018') 
            {
                for (var key in data[obj])
                {
                    //console.log(key); // Times
                    var d = JSON.parse(data[obj][key].values);
                    //console.log(d.temp); // Temperature
                    //console.log(d.humidity); // Humidity
                    time.push(key);


                    //Object.keys(d)
                    values = Object.keys(d);

                    for (var i in values)
                    {
                        if (!(values[i] in diction))
                        {
                            diction[values[i]] = [];
                        }
                        diction[values[i]].push(d[values[i]]);
                    }



                }
            }   
        }



        valDrop = document.getElementById('valuesDrop');
        valDrop.innerHTML = '';
        for (var i in values)
        {
            let it = values[i];
            var a = document.createElement("a");

            a.classList.add('dropdown-item');
            var txt = document.createTextNode(values[i]);
            a.appendChild(txt);
            a.addEventListener('click', function(){ 
                populateChart(deviceName, month, it, diction, time); 
            });
            valDrop.appendChild(a);

        }

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

function populateDevicesDropdown()
{
    var requestPath = 'devices/';
    var requestURL = requestDomainName + requestPath;

    var r = new XMLHttpRequest();
    r.open('GET', requestURL);
    r.responseType = 'json';
    r.send();

    r.onload = function() 
    {
        var drop = document.getElementById("devicesDrop");
        devices = r.response;

        var names = []
        for (var key in devices.devices)
        {
            let keyo = key;
            var a = document.createElement("a");

            a.classList.add('dropdown-item');
            var txt = document.createTextNode(devices.devices[key].nickname);
            a.appendChild(txt);
            a.addEventListener('click', function(){ 
                getEventsByMonth(keyo, 'April'); 
            });

            drop.appendChild(a);
        }   
        
    }

    r.onerror = function() 
    {
        console.log('There was an error while processing getDevices()');
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
            div.addEventListener('click', function(){ 
                var alert = document.createElement("div");
                alert.setAttribute("id", "alert");
                var btnMessage = document.createElement("a");
                var btnMessageNo = document.createElement("a");
                var alertMessage = document.createTextNode("Are you sure you want to delete this device?");
                var yes = document.createTextNode("Yes");
                var no = document.createTextNode("No");


                alert.classList.add("alert");
                alert.classList.add("alert-danger");
                btnMessage.classList.add("btn");
                btnMessage.classList.add("btn-sm");
                btnMessage.classList.add("btn-danger");
                btnMessage.classList.add("pull-right");
                btnMessage.classList.add("align-middle");
                btnMessage.addEventListener('click', function(){
                    var al = document.getElementById("alert");
                    al.remove(); 
                    //key is the name of device that
                                 
                })
                btnMessage.appendChild(yes);
                btnMessageNo.classList.add("btn");
                btnMessageNo.classList.add("btn-sm");
                btnMessageNo.classList.add("btn-danger");
                btnMessageNo.classList.add("pull-right");
                btnMessageNo.addEventListener('click', function(){
                    var al = document.getElementById("alert");
                    al.remove(); 
                })
                btnMessageNo.appendChild(no);

                alert.appendChild(btnMessage);
                alert.appendChild(btnMessageNo);
                alert.appendChild(alertMessage);

                var devCon = document.getElementById("devCon");

                devCon.appendChild(alert);
                /*
                    <div class="alert alert-danger">
                        <a href="#" class="btn btn-xs btn-danger pull-right">don't do an action</a>
                        <strong>Danger:</strong> you shouldn't do an action!
                    </div>
                **/
            });
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