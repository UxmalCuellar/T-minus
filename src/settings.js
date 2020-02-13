const electron = require('electron');
const path = require('path');
const remote = electron.remote;

function closeWin() {
    var window = remote.getCurrentWindow();
    console.log("trrying to close window");
    window.close();
}