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
    if(d == 0) {
    return ("")
    } 
    return ( d == 1 ? d + " day\n" : d + " days\n")
}

function addZero(n) {
    return (n < 10 ? "0" : "") + n;
}