const {app, BrowserWindow, ipcMain} = require('electron')

let mainWindow
let pickerDialog
let signerDialog

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    height: 500,
    width: 600
  });

  pickerDialog = new BrowserWindow({
    parent: mainWindow,
    skipTaskbar: true,
    modal: true,
    show: false,
    height: 390,
    width: 680
  })

  signerDialog = new BrowserWindow({
    parent: mainWindow,
    skipTaskbar: true,
    modal: true,
    show: false,
    height: 390,
    width: 680
  })
  mainWindow.loadURL('file://' + __dirname + '/index.html')
  pickerDialog.loadURL('file://' + __dirname + '/picker.html')
  signerDialog.loadURL('file://' + __dirname + '/signer.html')
});

ipcMain.on('show-config', (event, content) => {
  pickerDialog.show()
  pickerDialog.webContents.send('config', content)
})

ipcMain.on('show-signer', (event, content) => {
  signerDialog.show()
  signerDialog.webContents.send('sign', content)
})

ipcMain.on('hide-config', (event, sourceId) => {
  pickerDialog.hide()
})

ipcMain.on('hide-signer', (event, sourceId) => {
  signerDialog.hide()
})

