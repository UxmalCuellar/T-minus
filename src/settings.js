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
    var past = document.querySelector('input[name="Past"]:checked').value;
    var future = document.querySelector('input[name="Future"]:checked').value;
    var res = document.getElementById('range_weight').value;

    ipcRenderer.send('update-settings', 'settings changed', past, future, res)
}