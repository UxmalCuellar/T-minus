const electron = require('electron');
const url = require('url');
const path = require('path');
const ipc = require('electron').ipcMain
const fs = require('fs') 
const shell = require('electron').shell

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
   py_calRequest();
})

const mainMenuTemplate = [
   {
      label:'File', 
      submenu: [
         {
            label: 'Add event'
         },
         {
            label: 'Open Google Calendar', 
            click() {
               shell.openExternal('https://calendar.google.com/calendar/r?tab=rc1')
            }
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
   console.log(arg);
   py_calRequest();
})

function py_calRequest() {
   daysInFuture = 7;
   daysInPast = 3;
   maxResults = 10;
   // Get events info from Google Cal and write to file Output file
   var python = require('child_process').spawn('python', ['./src/calendarRequest.py',
      daysInPast, daysInFuture, maxResults]);

   python.stdout.on('data', function(data){
      console.log("python output to file:\n", data.toString('utf8'));
      
      mainWindow.webContents.send('run-insert-dates', data);
      fs.writeFile('Output.txt', data.toString('utf8'), (err) => { 
         if (err) throw err; 
      }) 
   });
}