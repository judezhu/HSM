const {desktopCapturer, ipcRenderer} = require('electron')
const domify = require('domify')

document.onkeydown = function (evt) {
  evt = evt || window.event
  // Press esc key.
  if (evt.keyCode === 27) {
    ipcRenderer.send('source-id-selected', null)
  }
  console.log("press esc key");
}

ipcRenderer.on('open-scanner', (event, options) => {
  
})
