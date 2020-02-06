const {ipcRenderer} = require('electron')
var dateToCountDown

ipcRenderer.on('run-insert-dates', function(event, arg) {
    // fill select tag with values
    document.getElementById("dateOpt").innerHTML = arg
})
 function selectVal() {
     var val = document.getElementById('dateOpt');
     var x = val.options[val.selectedIndex].value;
     console.log(x)
     dateToCountDown = x

    // var countDownDateTime = new Date(dateToCountDown.value).getTime();
    if(dateToCountDown == null) {
        dateToCountDown = new Date().getTime()
        console.log('Date not selected');
    } else {
        console.log(dateToCountDown)
    }

    var countDownDateTime = new Date(dateToCountDown).getTime();

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
            document.getElementById("countdown-timer").innerHTML = "00:00:00"
        }
    }, 1000);
}

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

function getDates() {
    // Let Main process know 'sync' btn has been clicked
    ipcRenderer.send('sync-google-cal', 'Running sync from renderer')
}
