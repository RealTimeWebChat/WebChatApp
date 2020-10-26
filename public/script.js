const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const myPeer  = new Peer(undefined, {
    host : '/',
    port: '3001'
})



const myVideo = document.createElement('video')
myVideo.muted = true
const peers = {}

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    addVideoStream(myVideo, stream)




//YUVRAJ1
//add listeners for saving video/audio
let start = document.getElementById('btnStart');
let stop = document.getElementById('btnStop');
let vidSave = document.getElementById('vid2');
//let vidUpload = document.getElementById('btnUpload');
//let mediaRecorder = new MediaRecorder(stream);
let chunks = [];
let mRecorder, screenStream, voiceStream, fullStream;

//new-19/oct
const audioToggle = document.getElementById('audioToggle');
const micAudioToggle = document.getElementById('micAudioToggle');

const mergeAudioStreams = (screenStream, voiceStream) => {
    const context = new AudioContext();
    const destination = context.createMediaStreamDestination();
    let hasDesktop = false;
    let hasVoice = false;
    if (screenStream && screenStream.getAudioTracks().length > 0) {
      // If you don't want to share Audio from the desktop it should still work with just the voice.
      const source1 = context.createMediaStreamSource(screenStream);
      const desktopGain = context.createGain();
      desktopGain.gain.value = 0.7;
      source1.connect(desktopGain).connect(destination);
      hasDesktop = true;
    }
    
    if (voiceStream && voiceStream.getAudioTracks().length > 0) {
      const source2 = context.createMediaStreamSource(voiceStream);
      const voiceGain = context.createGain();
      voiceGain.gain.value = 0.7;
      source2.connect(voiceGain).connect(destination);
      hasVoice = true;
    }
      
    return (hasDesktop || hasVoice) ? destination.stream.getAudioTracks() : [];
  };

async function startRecording() {
    const audio = audioToggle.checked || true;
    const mic = micAudioToggle.checked || true;

    screenStream = await navigator.mediaDevices.getDisplayMedia({
      video: { mediaSource: "screen" },
      audio: audio
    });

    if (mic === true) {
        voiceStream = await navigator.mediaDevices.getUserMedia({ video: false, audio: mic });
      }

    const tracks = [
      ...screenStream.getVideoTracks(), 
      ...mergeAudioStreams(screenStream, voiceStream)
    ];

    fullStream = new MediaStream(tracks);
    mRecorder = new MediaRecorder(fullStream);

    //const chunks = [];
    mRecorder.ondataavailable = function(ev) {
        chunks.push(ev.data);
    }

    mRecorder.onstop = (ev)=>{
        let blob = new Blob(chunks, { 'type' : 'video/mp4;' });
        chunks = [];
        let videoURL = window.URL.createObjectURL(blob);
        vidSave.src = videoURL;                                                                                         
    }
    mRecorder.start();
}

start.addEventListener('click', (ev)=>{
    //mRecorder.start();
    startRecording();
    //console.log(mRecorder.state);
})
stop.addEventListener('click', (ev)=>{
    mRecorder.stop();
    //console.log(mRecorder.state);
});


/*start.addEventListener("click", () => {
    start.setAttribute("disabled", true);
    stop.removeAttribute("disabled");
  
    startRecording();
  });

  stop.addEventListener("click", () => {
    stop.setAttribute("disabled", true);
    start.removeAttribute("disabled");
  
    mediaRecorder.stop();
    screenStream.getVideoTracks()[0].stop();
  });
*/  
//new-19/oct-end

//yuvraj2
//vidUpload.addEventListener('click', (ev)=>{
 //   mediaRecorder.stop();
 //   console.log(mediaRecorder.state);
//});

//const CLOUD_BUCKET = 'projectyuvi-1576333215876';

//const {Storage} = require('@google-cloud/storage')

//const storage =new Storage({ projectId: CLOUD_BUCKET, keyFilename: 'D:/Robert_Internship/RTChatApp/projectyuvi-1576333215876-1f74fa3d8e21.json' });
//const bucket = storage.bucket(CLOUD_BUCKET);

//storage .getBuckets().then(x => console.log(x))

//const web_chat_app_bucket = storage.bucket('web_chat_app')




//yuvraj3



    myPeer.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideostream => {
            addVideoStream(video, userVideostream)
        })
    })

    socket.on('user-connected', userId =>{
        connectToNewUser(userId, stream)
    })
})

socket.on('user-disconnected', userId => {
    if (peers[userId]) peers[userId].close()
})

myPeer.on('open', id => {
    socket.emit('join-room',ROOM_ID,id)
})

function connectToNewUser(userId, stream) {
    const call = myPeer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideostream => {
        addVideoStream(video, userVideostream)
    })
    call.on('close', () => {
        video.remove()
    })

    peers[userId] = call
}

function addVideoStream(video, stream) {
    video.srcObject = stream
    video.addEventListener('loadedmetadata',() => {
        video.play()
    })
    videoGrid.append(video)
}