const { contextBridge, ipcRenderer } = require('electron');
const accessCode = process.argv.find(argument => argument.startsWith('--mooz-access='))?.slice(14) || '';
contextBridge.exposeInMainWorld('moozDesktop', Object.freeze({ accessCode, version: '0.5.2', platform: process.platform, arch: process.arch, copyText: text => ipcRenderer.invoke('mooz:copy-text', text) }));
