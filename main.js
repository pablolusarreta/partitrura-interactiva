const { app, BrowserWindow, ipcMain } = require('electron')
//require('@electron/remote/main').initialize()
const path = require('path')
let win
function createWindow() {
  win = new BrowserWindow({
    width: 1230,
    height: 900,
    minWidth: 1230,
    minHeight: 800,
    backgroundColor: '#fff',
    show: true,
    icon: path.join(__dirname, 'assets/icons/win/icon.ico'),
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      worldSafeExecuteJavaScript: false,
      contextIsolation: false
    }
  })
  win.loadURL(`file://${__dirname}/index.html`)
  win.setMenu(null);
  //win.webContents.openDevTools();
  win.on('closed', () => { win = null })
}
app.on('ready', createWindow)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})
if (process.env.NODE_ENV !== 'production') {
  require('electron-reload')(__dirname, {
    electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
  })
}
ipcMain.on('dev', (event, arg) => { win.webContents.openDevTools() })