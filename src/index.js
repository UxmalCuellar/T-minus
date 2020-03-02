const { ipcRenderer } = require('electron');
const electron = require('electron');
const path = require('path');
const BrowserWindow = electron.remote.BrowserWindow;

var dateToCountDown
var timerId;

ipcRenderer.on('run-insert-dates', function (event, arg) {
    // fill select tag with options and values
    document.getElementById("dateOpt").innerHTML = arg
})

function updateTimer() {
    // stops and removes the current setinterval (timer)
    console.log("Removing id:", timerId);
    clearInterval(timerId);
}

function abortTask() {
    // Stop the currnt running timer and set to default
    console.log("Removing id(abort):", timerId);
    document.getElementById("timer").innerHTML = "00:00:00"
    document.getElementById("dateOpt").selectedIndex = 0;
    clearInterval(timerId);
}

function formatEventName(str) {
    str = str.substring(str.indexOf(",") + 1);
    return str
}

function formattedDateTime(str) {
    newTime = str.slice(-8);
    newDate = str.slice(0, -8);
    newTime = newTime.slice(0, 5);
    newStr = 'Date<br> ' + newDate + '<br>' + 'End Time<br> ' + newTime;
    return newStr;
}

function startTimer() {
    // BUG previous timer does not get cancelled sometimes
    // Gets users selection and begins countdown 
    var val = document.getElementById('dateOpt');
    var x = val.options[val.selectedIndex].value;
    var text = document.getElementById('dateOpt');
    var y = text.options[text.selectedIndex].text;
    var formatName = formatEventName(y);
    var formatDate = formattedDateTime(x);

    console.log(x)
    document.getElementById('eventDetails').innerHTML = formatDate;
    document.getElementById('eventName').innerHTML = formatName;
    dateToCountDown = x

    if (dateToCountDown == '') {
        dateToCountDown = new Date().getTime();
        document.getElementById("timer").innerHTML = "00:00:00"
        console.log('Date not selected');
    } else {
        console.log(dateToCountDown)

        var countDownDateTime = new Date(dateToCountDown).getTime();

        timerId = setInterval(function () {

            var now = new Date().getTime();

            var difference = countDownDateTime - now;
            var days = Math.floor(difference / (1000 * 60 * 60 * 24));
            var hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
            var minutes = Math.floor((difference / 1000 / 60) % 60);
            var seconds = Math.floor((difference / 1000) % 60);

            document.getElementById("timer").innerHTML = isDaysOrDay(days) + addZero(hours) + ":" + addZero(minutes) + ":" + addZero(seconds);

            if (difference < 0) {
                clearInterval(timerId);
                document.getElementById("timer").innerHTML = "00:00:00"
            }
            console.log("New timerId created", timerId);
        }, 1000);
    }
    console.log("finished running timerId", timerId);
}

function isDaysOrDay(d) {
    // check how many days are left in timer and return appropriate grammar
    if (d == 0) {
        return ("")
    }
    return (d == 1 ? d + " day\n" : d + " days\n")
}

function addZero(n) {
    // make timer hour, minutes and seconds double digits 
    return (n < 10 ? "0" : "") + n;
}

function getDates() {
    // Let Main process know 'sync' btn has been clicked
    ipcRenderer.send('sync-google-cal', 'Running sync from renderer')
}

function formatDates() {
    // converts selected date to RFC3339 format
    var input = document.getElementById("fromDate").value;
    var dateEntered = new Date(input);
    console.log(dateEntered.toISOString());
}