const {desktopCapturer, ipcRenderer} = require('electron')
const domify = require('domify')
const Instascan = require('instascan');


document.onkeydown = function (evt) {
  evt = evt || window.event
  // Press esc key.
  if (evt.keyCode === 27) {
    ipcRenderer.send('source-id-selected', null)
  }
}

ipcRenderer.on('open-scanner', (event, options) => {
  let scanner = null
  let scans = []
  let cameras = []
  let activeCameraId = null 

  scanner = new Instascan.Scanner({ video: document.getElementById('preview'), scanPeriod: 5 });

  scanner.addListener('scan', function (content, image) {
    console.log('content', content);
    alert(content);
    // scans.unshift({ date: +(Date.now()), content: content });
  });
  console.log(Instascan);
  Instascan.Camera.getCameras().then(function (cameras) {
    cameras = cameras;
    console.log(cameras);
    if (cameras.length > 0) {
      activeCameraId = cameras[0].id;
      scanner.start(cameras[0]);
    } else {
      console.error('No cameras found.');
    }
  }).catch(function (e) {
    console.error(e);
  });
})
