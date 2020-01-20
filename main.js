const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu} = electron

let mainWindow;

app.on('ready', function(){
   // create nre window
   mainWindow = new BrowserWindow({});
   // Load html into window
   mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:', 
      slashes: true
   }));

   // build menu from template
   const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
   // insert menu
   Menu.setApplicationMenu(mainMenu);
})

const mainMenuTemplate = [
   {
      label:'File', 
      submenu: [
         {
            label: 'add event'
         },
         {
            label: 'Quit',
            accelerator: process.platform == 'darwin' ? 'Command+Q' :
            'Ctrl+Q',
            click(){
               app.quit();
            }
         }
      ]
   }
];
