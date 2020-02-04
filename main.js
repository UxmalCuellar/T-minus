const electron = require('electron');
const url = require('url');
const path = require('path');
const ipc = require('electron').ipcMain

const {app, BrowserWindow, Menu} = electron

let mainWindow;

app.on('ready', function(){
   // create nre window
   mainWindow = new BrowserWindow({
      webPreferences: {
         nodeIntegration: true
      }
   });
   // Load html into window
   mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, 'src/index.html'),
      protocol: 'file:', 
      slashes: true
   }));

   // build menu from template
   const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
   // insert menu
   Menu.setApplicationMenu(mainMenu);
   //get events from google calendar
   var python = require('child_process').spawn('python', ['./src/calendarRequest.py']);
   python.stdout.on('data', function(data){
      console.log("data: ", data.toString('utf8'));
   });
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
// if mac, add empty object to menu
if (process.platform  == 'darwin') {
   mainMenuTemplate.unshift({});
}
if(process.env.NODE_ENV != 'production'){
   mainMenuTemplate.push({
      label: 'Developer Tools', 
      submenu:[
        {
            label: 'Toggle DevTools',
            accelerator: process.platform == 'darwin' ? 'Command+I' :
            'Ctrl+I',
            click(item, focusedWindow){
            focusedWindow.toggleDevTools();
            }
         },
         {
            role: 'reload'
         }
      ]
   }) 
}

ipc.on('sync-google-cal', function(event, arg) {
   var python = require('child_process').spawn('python', ['./src/calendarRequest.py']);

   python.stdout.on('data', function(data){
      console.log("data: ", data.toString('utf8'));
   });
})