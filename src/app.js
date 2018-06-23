const {desktopCapturer, ipcRenderer, remote} = require('electron')
const domify = require('domify')
//console.log(process.version)
const Instascan = require('instascan');
// const {BrowserWindow} = require('electron')
const electron = require('electron');
const BrowserWindow = electron.remote.BrowserWindow;


// console.log(Instascan);


let localStream
let microAudioStream
let recordedChunks = []
let numRecordedChunks = 0
let recorder
let includeMic = false
let scanner = null
let scans = []
let cameras = []
let activeCameraId = null 


scanner = new Instascan.Scanner({ video: document.getElementById('preview'), scanPeriod: 5 });

scanner.addListener('scan', function (content, image) {
  console.log('content', content);
  alert(content);
  let win = new BrowserWindow({width: 800, height: 600})
  win.on('closed', () => {
    win = null
  })
  
  // Load a remote URL
  win.loadURL('https://github.com')
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

navigator.mediaDevices.getUserMedia({video: true})
  .then(function(stream) {
    document.getElementById('preview').src = URL.createObjectURL(stream);
  }).catch(function() {
    alert('could not connect stream');
  });

document.addEventListener('DOMContentLoaded', () => {
  // document.querySelector('#record-desktop').addEventListener('click', recordDesktop)
  document.querySelector('#record-camera').addEventListener('click', recordCamera)
})

const recordCamera = () => {
  cleanRecord()
  navigator.webkitGetUserMedia({
    audio: false,
    video: { mandatory: { minWidth: 1280, minHeight: 720 } }
  }, getMediaStream, getUserMediaError)
}

const onAccessApproved = (id) => {
  if (!id) {
    console.log('Access rejected.')
    return
  }
  console.log('Window ID: ', id)
  navigator.webkitGetUserMedia({
    audio: false,
    video: { mandatory: { chromeMediaSource: 'desktop', chromeMediaSourceId: id,
      maxWidth: window.screen.width, maxHeight: window.screen.height } }
  }, getMediaStream, getUserMediaError)
}
