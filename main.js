const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('path');

// Müzik/video oynatma kullanıcı dokunuşu beklemeden çalışsın
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 860,
    minWidth: 900,
    minHeight: 600,
    backgroundColor: '#000000',
    title: 'Klip Stüdyo',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      backgroundThrottling: false // pencere arkadayken dışa aktarma yavaşlamasın
    }
  });
  Menu.setApplicationMenu(null);
  win.loadFile(path.join(__dirname, 'app', 'index.html'));

  // Dış bağlantıları varsayılan tarayıcıda aç
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:/.test(url)) shell.openExternal(url);
    return { action: 'deny' };
  });

  // F11 tam ekran, F12 geliştirici araçları, Ctrl+R yenile
  win.webContents.on('before-input-event', (e, i) => {
    if (i.type !== 'keyDown') return;
    if (i.key === 'F11') win.setFullScreen(!win.isFullScreen());
    if (i.key === 'F12') win.webContents.toggleDevTools();
    if (i.control && i.key.toLowerCase() === 'r') win.reload();
  });
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
