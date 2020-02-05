const {ipcRenderer} = require('electron')

// Show count down timer
var countDownDateTime = new Date("Mar 1, 2020 00:00:00").getTime();

var x = setInterval(function() {

    var now = new Date().getTime();

    var difference = countDownDateTime - now;
    var days = Math.floor(difference / (1000 * 60 * 60 * 24));
    var hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    var minutes = Math.floor((difference / 1000 / 60 ) % 60);
    var seconds = Math.floor((difference / 1000) % 60);

    document.getElementById("countdown-timer").innerHTML = isDaysOrDay(days) + addZero(hours) + ":" + addZero(minutes) + ":" + addZero(seconds);

    if(difference < 0) {
        clearInterval(x);
        document.getElementById("countdown-timer").innerHTML = "Expired"
    }
}, 1000);

function isDaysOrDay(d) {
    // check how many days are left in timer and return appropriate grammar
    if(d == 0) {
    return ("")
    } 
    return ( d == 1 ? d + " day\n" : d + " days\n")
}

function addZero(n) {
    // make timer hour, minutes and seconds double digits 
    return (n < 10 ? "0" : "") + n;
}

var new_dates = document.getElementById("datelist");

function getDates() {
    // Let Main process know 'sync' btn has been clicked
    ipcRenderer.send('sync-google-cal', 'Running sync from renderer')
}

ipcRenderer.on('run-insert-dates', function(event, arg) {
    document.getElementById("test").innerHTML = arg
})