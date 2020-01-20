const { app, BrowserWindow } = require('electron')

function createWindow () {

   let win = new BrowserWindow({
      width: 800, 
      height: 600, 
      webPreferences: {
	 nodeItergration: true
      }
   })

win.loadFile('index.html')
}

app.on('ready', createWindow)
