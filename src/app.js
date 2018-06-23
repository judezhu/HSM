const {ipcRenderer} = require('electron')

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#record-camera').addEventListener('click', recordCamera)
})

const recordCamera = () => {
  ipcRenderer.send('show-picker', { types: ['screen'] })
}
