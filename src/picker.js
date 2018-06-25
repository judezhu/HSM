const {desktopCapturer, ipcRenderer} = require('electron')
const domify = require('domify')

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#config-cancel').addEventListener('click', cancelConfig)
})

const cancelConfig = () => {
  ipcRenderer.send('source-id-selected', null)
  console.log("press esc key");
}

ipcRenderer.on('open-scanner', (event, content) => {
  console.log(content);
  var config = JSON.parse(content);
  console.log(config);
  let configList = document.querySelector('.config-list');
  for (var key in config) {
    if (config.hasOwnProperty(key)) {
      console.log(key + "'s favorite fruit is " + config[key]);
      let item = `<li>${key}: ${config[key]}</li>`
      configList.appendChild(domify(item))
    }
  }
})
