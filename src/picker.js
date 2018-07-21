const { ipcRenderer } = require('electron')
const { key } = require('keychain');
var QRCode = require('qrcode')
const domify = require('domify')

let config = null

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#config-cancel').addEventListener('click', cancelConfig)
  document.querySelector('#create-keys').addEventListener('click', createKeys)
})

const cancelConfig = () => {
  var list = document.querySelector('.config-list');
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }

  ipcRenderer.send('source-id-selected', null);
}

const createKeys = () => {
  if (config !== null) {
    key.createSplitKeys(config['walletName'], config['entropy'], config['numShares'], config['threshold']).then(function (data) {
      let canvas = document.querySelector('canvas');
      QRCode.toCanvas(canvas, data.address, function (error) {
        if (error) {
          console.log(error)
        }
      })
    }).catch(function (err) {
      alert('Please check your usb connection.');
    });
  }
  else {
    alert("Wallet config is not found.");
  }
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
