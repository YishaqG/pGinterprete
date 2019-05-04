const { shell, app, protocol, Menu, dialog, BrowserWindow } = require('electron');
const path = require('path');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
function createWindow() {
    mainWindow = new BrowserWindow( {
        width: 800,
        height: 600
    });
    mainWindow.loadFile( './src/app/views/index.html' );
    mainWindow.webContents.openDevTools();

    protocol.registerFileProtocol('nodemodules', (request, callback) => {
        const url = request.url.substr(14)
        callback({ path: path.normalize(`${__dirname}/node_modules/${url}`) })
    }, (error) => {
        if (error) console.error('Failed to register protocol')
    });

    Menu.setApplicationMenu( Menu.buildFromTemplate( [
        {
            label: "&File",
            submenu: [
              {
                label: "New",
                accelerator: "CmdOrCtrl+N",
                click: () => {
                  var focusedWindow = BrowserWindow.getFocusedWindow();
                  focusedWindow.webContents.send('file-new');
                }
              },
              {
                label: "Open",
                accelerator: "CmdOrCtrl+O",
                click: () => {
                  let focusedWindow = BrowserWindow.getFocusedWindow();
                  focusedWindow.webContents.send('file-open');
                }
              },
              {
                label: "Save",
                accelerator: "CmdOrCtrl+S",
                click: () => {
                  let focusedWindow = BrowserWindow.getFocusedWindow();
                  focusedWindow.webContents.send('file-save');
                }
              },
              {
                label: "Save As",
                accelerator: "CmdOrCtrl+Shift+S",
                click: () => {
                  var focusedWindow = BrowserWindow.getFocusedWindow();
                  focusedWindow.webContents.send('file-save-as');
                }
              },
              {
                label: "Quit",
                accelerator: "Command+Q",
                click: app.quit
              }
            ]
        },
        {
            label: "&Edit",
            submenu: [
              {
                label: "Undo",
                accelerator: "CmdOrCtrl+Z",
                role: "undo"
              },
              {
                label: "Redo",
                accelerator: "Shift+CmdOrCtrl+Z",
                role: "redo"
              },
              {
                type: "separator"
              },
              {
                label: "Cut",
                accelerator: "CmdOrCtrl+X",
                role: "cut"
              },
              {
                label: "Copy",
                accelerator: "CmdOrCtrl+C",
                role: "copy"
              },
              {
                label: "Paste",
                accelerator: "CmdOrCtrl+V",
                role: "paste"
              },
              {
                label: "Select All",
                accelerator: "CmdOrCtrl+A",
                role: 'selectall'
              },
              {
                type: "separator"
              },
              {
                label: "Search",
                accelerator: "CmdOrCtrl+F",
                click: () => {
                  let focusedWindow = BrowserWindow.getFocusedWindow();
                  focusedWindow.webContents.send('ctrl+f');
                }
              },
              {
                label: "Replace",
                accelerator: "CmdOrCtrl+Shift+F",
                click: () => {
                  let focusedWindow = BrowserWindow.getFocusedWindow();
                  focusedWindow.webContents.send('ctrl+shift+f');
                }
              }
            ]
        },
        {
            label: "&View",
            submenu: [
            {
                label: "Toggle Full Screen",
                accelerator:"F11",
                click: () => {
                    let focusedWindow = BrowserWindow.getFocusedWindow();
                    let isFullScreen = focusedWindow.isFullScreen();
                    focusedWindow.setFullScreen(!isFullScreen);
                }
             }
            ]
        },
        {
            label: "&Run",
            submenu: [
                {
                    label: "Run",
                    accelerator:"CmdOrCtrl+Alt+R",
                    click: () => {
                      var focusedWindow = BrowserWindow.getFocusedWindow();
                      focusedWindow.webContents.send('interpreter-run');
                    }
                },
                {
                    type: "separator"
                }
            ]
        },
        {
            label: "&Help",
            submenu: [
              {
                label: "Documentación",
                click:  () => {
                  shell.openItem("/home/calsifer/Documents/Materias/Prim19/AppsMult/home.html");
                }
              },
              {
                label: "Información pGInterprete",
                click: () => {
                  dialog.showMessageBox({title: "About pGInterprete", type:"info", message: "A powerfull pequeño Gran Interprete desktop app. \nMIT Copyright (c) 2019 Enrique Y. German Totosaus <yishaq95@gmail.com>\nMIT Copyright (c) 2019 Brisa Isabel M. Romero <brisa.romen@gmail.com>", buttons: ["Close"] });
                }
              }
            ]
        }
    ] ) );
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
