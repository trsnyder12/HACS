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
    console.log("testing");
    var r = new XMLHttpRequest();
    r.open('GET', requestURL);
    r.responseType = 'json';
    r.send();
    console.log("got the stuff");
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
        alert(1);
    }

    r.onerror = function() 
    {
        console.log('There was an error while processing getDevices()');
    }

}