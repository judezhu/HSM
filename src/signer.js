const { ipcRenderer } = require('electron')
const { key } = require('keychain');
var QRCode = require('qrcode')
const domify = require('domify')

let config = null

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#sign-cancel').addEventListener('click', cancelSign)
  document.querySelector('#sign-transaction').addEventListener('click', signTransaction)
})

const cancelSign = () => {
  ipcRenderer.send('hide-signer', null);
}

const signTransaction = () => {
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

ipcRenderer.on('sign', (event, content) => {
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
