// Tìm Kiếm Văn Bản - bản Windows (Electron), chạy offline hoàn toàn
const { app, BrowserWindow, ipcMain, dialog, shell, Menu } = require('electron');
const path = require('path');
const fs = require('fs');

let win = null;
let dataRoot = null; // thư mục VanBanLuu đang dùng
const cfgFile = () => path.join(app.getPath('userData'), 'config.json');
const readCfg = () => { try { return JSON.parse(fs.readFileSync(cfgFile(), 'utf8')); } catch (e) { return {}; } };
const writeCfg = (c) => { fs.mkdirSync(path.dirname(cfgFile()), { recursive: true }); fs.writeFileSync(cfgFile(), JSON.stringify(c, null, 1)); };
const exeDir = () => process.env.PORTABLE_EXECUTABLE_DIR || path.dirname(app.getPath('exe'));

// chỉ cho phép đọc/ghi bên trong thư mục dữ liệu đã chọn
function safe(p) {
  if (!dataRoot) throw new Error('Chưa chọn thư mục lưu');
  const r = path.resolve(p), root = path.resolve(dataRoot);
  if (r !== root && !r.startsWith(root + path.sep)) throw new Error('Đường dẫn ngoài thư mục dữ liệu');
  return r;
}

ipcMain.handle('info', () => ({ last: readCfg().dataDir || null, exeDir: exeDir(), sep: path.sep }));
ipcMain.handle('pickDir', async () => {
  const r = await dialog.showOpenDialog(win, { title: 'Chọn nơi tạo thư mục VanBanLuu', properties: ['openDirectory', 'createDirectory'] });
  return r.canceled || !r.filePaths.length ? null : r.filePaths[0];
});
ipcMain.handle('useDir', (e, root) => {
  root = path.resolve(root);
  for (const s of ['', 'files', 'noidung']) fs.mkdirSync(path.join(root, s), { recursive: true });
  fs.accessSync(root, fs.constants.W_OK);
  dataRoot = root;
  const c = readCfg(); c.dataDir = root; writeCfg(c);
  return true;
});
ipcMain.handle('read', (e, p, asText) => {
  try { const b = fs.readFileSync(safe(p)); return asText ? b.toString('utf8') : new Uint8Array(b); }
  catch (err) { if (err.code === 'ENOENT') return null; throw err; }
});
ipcMain.handle('write', (e, p, data) => {
  const f = safe(p); fs.mkdirSync(path.dirname(f), { recursive: true });
  const tmp = f + '.tmp';
  fs.writeFileSync(tmp, typeof data === 'string' ? data : Buffer.from(data));
  fs.renameSync(tmp, f);
  return true;
});
ipcMain.handle('del', (e, p) => { try { fs.unlinkSync(safe(p)); } catch (err) { if (err.code !== 'ENOENT') throw err; } return true; });
ipcMain.handle('showInFolder', (e, p) => { shell.showItemInFolder(safe(p)); return true; });

function createWindow() {
  Menu.setApplicationMenu(null);
  win = new BrowserWindow({
    width: 1320, height: 900, minWidth: 900, minHeight: 600, show: false,
    title: 'Tìm Kiếm Văn Bản', backgroundColor: '#eef2f7',
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, nodeIntegration: false, spellcheck: false }
  });
  win.loadFile(path.join(__dirname, 'app', 'index.html'));
  win.once('ready-to-show', () => { win.maximize(); win.show(); });
  win.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  win.webContents.on('will-navigate', (e) => e.preventDefault());
  win.webContents.on('before-input-event', (e, i) => { if (i.key === 'F12' && i.control && i.shift) win.webContents.toggleDevTools(); });
}
app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());
