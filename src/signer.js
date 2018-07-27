const { ipcRenderer } = require('electron')
const { sign } = require('keychain');
var QRCode = require('qrcode')
const domify = require('domify')

let message  = null

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#sign-cancel').addEventListener('click', cancelSign)
  document.querySelector('#sign-transaction').addEventListener('click', signTransaction)
})

const cancelSign = () => {
  var list = document.querySelector('.config-list');
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }
  ipcRenderer.send('hide-signer', null);
}

const signTransaction = () => {
  if (message !== null) {
    let rawTx = {
      nonce: message["nounce"],
      gasPrice: message["gasPrice"],
      gasLimit: message["gasLimit"],
      to: message["to"],
      value: message["value"],
    };
    console.log(rawTx);
    // var rawTx = {
    //   nonce: '0x00',
    //   gasPrice: '0x09184e72a000', 
    //   gasLimit: '0x2710',
    //   to: '0x0000000000000000000000000000000000000000', 
    //   value: '0x00', 
    //   data: '0x7f7465737432000000000000000000000000000000000000000000000000000000600057'
    // }
    sign.signMessage('DHS', message["devices"], rawTx).then(function (data) {
      let canvas = document.querySelector('canvas');
      QRCode.toCanvas(canvas, data, function (error) {
        if (error) {
          console.log(error)
        }
      })
    }).catch(function (err) {
      alert('Please check your usb connection.');
    });
  }
  else {
    alert("There is no message to sign.");
  }
}

ipcRenderer.on('sign', (event, content) => {
  message = content;
  console.log(message);
  let configList = document.querySelector('.config-list');
  for (var key in message) {
    if (message.hasOwnProperty(key)) {
      console.log(key + "'s favorite fruit is " + message[key]);
      let item = `<li>${key}: ${message[key]}</li>`
      configList.appendChild(domify(item))
    }
  }
})
