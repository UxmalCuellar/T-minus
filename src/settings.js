
let i = document.getElementById('getRange'),
o = document.getElementById('slider_value');

o.innerHTML = document.getElementById('getRange').value;


i.addEventListener('input', function () {
    o.innerHTML = document.getElementById('getRange').value;
}, false);