
const {ipcRenderer} = require('electron')
const Instascan = require('instascan');
console.log(process.versions);

let scanner = null
let scans = []
let cameras = []
let activeCameraId = null 

scanner = new Instascan.Scanner({ video: document.getElementById('preview'), scanPeriod: 5 });
scanner.addListener('scan', function (content, image) {
  console.log('content', content);
  alert(content);
  content = JSON.parse(content);
  if (!obj.hasOwnProperty('from')) {
    ipcRenderer.send('show-signer', content);
  } else {
    ipcRenderer.send('show-config', content); 
  }
  
});
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

// this method is used to display real-time video stream on the first page
navigator.mediaDevices.getUserMedia({video: true})
  .then(function(stream) {
    document.getElementById('preview').src = URL.createObjectURL(stream);
  }).catch(function() {
    alert('could not connect stream');
  });

