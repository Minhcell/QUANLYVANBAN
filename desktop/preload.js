const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('electronAPI', {
  info: () => ipcRenderer.invoke('info'),
  pickDir: () => ipcRenderer.invoke('pickDir'),
  useDir: (root) => ipcRenderer.invoke('useDir', root),
  read: (p, asText) => ipcRenderer.invoke('read', p, asText),
  write: (p, data) => ipcRenderer.invoke('write', p, data),
  del: (p) => ipcRenderer.invoke('del', p),
  showInFolder: (p) => ipcRenderer.invoke('showInFolder', p)
});
