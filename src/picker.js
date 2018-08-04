const { ipcRenderer } = require('electron')
const { key } = require('keychain');
var QRCode = require('qrcode')
const domify = require('domify')


let config = null // config for creating public/private key pairs

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#config-cancel').addEventListener('click', cancelConfig)
  document.querySelector('#create-keys').addEventListener('click', createKeys)
})

const cancelConfig = () => {
  var list = document.querySelector('.config-list');

  // remove the previous config
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }

  ipcRenderer.send('hide-config', null);
}

const createKeys = () => {
  if (config !== null) {
    try {
      key.createSplitKeys(config['walletName'], config['entropy'], config['numShares'], config['threshold']).then(function (data) {
        createWalletQR(data.address);
      }).catch(function (err) {
        alert(err.message);
      });
    } catch (err) {
      alert(err.message);
    }


    key.verifyKeys(config['walletName'], config['entropy'], config['numShares'], config['threshold']).then(function (isValid) {
      if(isValid){
        alert('Keys verification success');
      } else {
        alert('Keys verification failed');
      }
    }).catch(function (err) {
      alert('Please check your usb connection. Err when verify keys');
    });
  }
  else {
    alert("Wallet config is not found.");
  }
}

ipcRenderer.on('config', (event, content) => {
  config = content;
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

//util functions
const createWalletQR = (address) => {
  let canvas = document.querySelector('canvas');
      let wallet = {};
      wallet.address = address;
      wallet.threshold = config['threshold'];
      wallet.numShares = config['numShares'];
      let walletMessage = JSON.stringify(wallet);
      QRCode.toCanvas(canvas, walletMessage, function (error) {
        if (error) {
          console.log(error)
        }
      })
}
