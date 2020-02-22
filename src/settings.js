const electron = require('electron');
const {ipcRenderer} = require('electron');
const path = require('path');
const remote = electron.remote;

function closeWin() {
    //close settings window
    var window = remote.getCurrentWindow();
    window.close();
}

function applySettings() {
    // get the selected values from setting then send them to ipcmain
    var past = Number(document.querySelector('input[name="Past"]:checked').value);
    var future = Number(document.querySelector('input[name="Future"]:checked').value);
    var res = Number(document.getElementById('range_weight').value);

    ipcRenderer.send('update-settings', 'settings changed', past, future, res)
}

function setValues() {
    // Load the users/default settings from json file
    console.log("loading values for settings");
    ipcRenderer.send('get-settings-values', 'loading settings values');
}

ipcRenderer.on('return-setting-values',  function(event, future, past, maxR) {
    document.getElementById('radioFuture'+future).checked = true;
    document.getElementById('radioPast'+past).checked = true;
    document.getElementById('range_weight').value = maxR;
    document.getElementById('range_weight_disp').innerHTML = maxR;
}) 