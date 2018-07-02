const {desktopCapturer, ipcRenderer} = require('electron')
const {eth, key} = require('keychain');
console.log(key);
const domify = require('domify')
console.log(domify)

let config = null

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#config-cancel').addEventListener('click', cancelConfig)
  document.querySelector('#create-keys').addEventListener('click', createKeys)
})

const cancelConfig = () => {
  ipcRenderer.send('source-id-selected', null)
  console.log("press esc key");
}

const createKeys = () => {
  if(config !== null) {
    console.log('config', config);
    key.createSplitKeysAndVerifyResults(config['walletName'], config['entropy'], config['numShares'], config['threshold']);
    alert("Wallet created successfully");
  }
  else {
    alert("Wallet config is not found.");
  }
  ipcRenderer.send('source-id-selected', null)
}



ipcRenderer.on('open-scanner', (event, content) => {
  console.log(content);
  config = JSON.parse(content);
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
