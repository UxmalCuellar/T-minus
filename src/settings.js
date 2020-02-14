const electron = require('electron');
const path = require('path');
const remote = electron.remote;

function closeWin() {
    //close settings window
    var window = remote.getCurrentWindow();
    window.close();
}