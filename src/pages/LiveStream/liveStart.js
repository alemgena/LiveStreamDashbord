import React, { useEffect, useRef, useState } from "react"
import { v4 as uuidv4 } from 'uuid';
import { Device } from 'mediasoup-client';
import socketClient from 'socket.io-client';
import{ promise} from '../../utiles/SocketPromise'
import { useSelector } from "react-redux";
import { url } from "../../utiles/url";
import CameraIcon from '@mui/icons-material/Camera';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Camera } from "@material-ui/icons";
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';
import {IconButton} from '@material-ui/core'
 import { Close } from '@material-ui/icons';
 import HardwareIcon from '@mui/icons-material/Hardware';
 import { Container,Row,Col} from 'react-bootstrap';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import './video.css'
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import Layout from '../../components/layout/Layout'
//import { useSelector } from 'react-redux';
const useStyles = makeStyles((theme) => ({
      button:{
      margin: theme.spacing(1),
      marginLeft: '30px',
      color:"white",
      backgroundColor:"teal",
      "&:hover":{
          backgroundColor:"brown",
      }
    },
    subscribe:{
        color:"teal",
      "&:hover":{
          backgroundColor:"brown",
      }
    }
  }));
  
let username,eventname
const opts = {
    secure:true,
  reconnect: true,
  rejectUnauthorized : false
  }
  /*let socket=socketClient(`${url}`,{path: '/socket/'},{
    secure:true,
    reconnect: true,
    rejectUnauthorized : false,
    withCredentials:true,
 
  })*/

let socket=socketClient('https://ethiolive.net',{ path: '/socket.io'})
const serverUrl=`${url}`
//socket = socketClient(serverUrl, opts);
//global variables
let device;
let producer;
let media_stream;
let eventId,flag;
let videoProducer ;
let audioProducer
let mediaRecorder;  // 
let recordedBlobs;
//	myVideo.current.srcObject = stream
socket.request = promise(socket);
function LiveEventOriginal(props) {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    }
    const handleClose = () => {
      setOpen(false);
    };
    const classes = useStyles();
  const [webCameDisabled, setDisabled] = React.useState(false);
  const [screenDisabled, setScreenDisabled] = React.useState(false);
   username = props.match.params.username 
   eventname=props.match.params.eventname
   const event_type=props.match.params.EventType
   console.log(username,eventname)
//  const user = useSelector((state) => state.login.loggedUser);
 // const dataEvent= props.location.state
 // username=dataEvent.userName;
  //console.log(username)
 // eventname=dataEvent.evenetName;
    const myVideo = useRef();
    function generate_eventId (){
        return uuidv4()
      }
      useEffect(() => {
      /*  if(reloadCount < 2) {
          sessionStorage.setItem('reloadCount', String(reloadCount+1));
          window.location.reload();
        } else {
          sessionStorage.removeItem('reloadCount');
        }
        */
        available_Devices()
        socket.on('connect', async () => {

           eventId = generate_eventId ()
        
          console.log (`connected to ${serverUrl}`)
      //  available_Devices()//
       var event_Meta_data = {username, eventname, eventId}
        
          console.log('data :', event_Meta_data )
       
        });
        socket.on('disconnect', () => {
          console.log (`disconnected from ${serverUrl}`)
          props.history.push('/streamVideo');
        //  window.location.replace(`${hostname}/create_live_streams`);
        });
        socket.on('connect_error', (error) => {
          console.error('could not connect to %s%s (%s)', serverUrl, error.message);
          
        });
    
   eventId = generate_eventId ()
  
   socket.emit('create_event', { username, eventname, eventId, event_type })
  console.log(username,eventname,eventId,event_type)
  async function get_room_rtp_capabilities (){
    const data = await socket.request('getRouterRtpCapabilitiesProducer');
    
    await loadDevice(data);
  
  }
  get_room_rtp_capabilities()
  console.log("err")
  
  /** load device rtp capabilities */
  async function loadDevice(routerRtpCapabilities) {
    try {
      device = new Device();
    } catch (error) {
      if (error.name === 'UnsupportedError') {
        console.error('browser not supported');
      }
    }
    await device.load({ routerRtpCapabilities });
  }//end of loadDevice(routerRtpCapabilities)
  
      }, [])
      
    // registerGlobals()
    
console.log(device)
const[audioinput,setAudioinput]=useState([]);
const[videoinput,setVideoinput]=useState([]);
console.log(audioinput)
console.log(videoinput)
let liveEvent = document.getElementById("videoEvent");
const[recordType,setRecordType]=useState('Start Recording')
const[mimType,setMimType]=useState([])
async function publish(type) {
    setScreenDisabled(true);
    setDisabled(true)
  const mediaInputSource = type
  console.log(type)
  console.log('publish--> device: ', device)
  const data = await socket.request('createProducerTransport', {
    forceTcp: false,
    rtpCapabilities: device.rtpCapabilities,
   
  });
  console.log(data)
  if (data.error) {
    console.error(data.error);
    return;
  }
  const transport = device.createSendTransport(data);

  transport.on('connect', async ({ dtlsParameters }, callback, errback) => {
  
    socket.request('connectProducerTransport', {
       transportId    : transport.id, 
       dtlsParameters })
    .then(callback)
    .catch(errback);
  });
  transport.on('produce', async (data, callback, errback) => {
    console.log('produce:: data: ', data)
    try {
      const { id } = await socket.request('produce', {
        transportId: transport.id,
        kind: data.kind,
        rtpParameters: data.rtpParameters,
      });
      console.log ('producer id ', id)
      callback({ id });
    } catch (err) {
      errback(err);
    }
  });

  transport.on('connectionstatechange', async (state) => {
    console.log('connectionstatechange: ', state)
    switch (state) {
      case 'connecting':
     //   publish_status.innerHTML = `connectionstatechange --> ${state} `;

        //fs_publish.disabled = true;
      break;
      case 'connected':
   
        myVideo.current.srcObject = media_stream
        myVideo.current.muted=true
      //  video_live_event.srcObject = media_stream;
       //
       // publish_status.innerHTML = `connectionstatechange --> ${state} transportId ${transport.id}`;
        if (videoProducer && audioProducer){
          videoProducer.resume()
        
          audioProducer.resume()

        }
      break;
      case 'disconnected' :
        let transportId = transport.id
        let iceparameters = await socket.request('restartProducerIce', { transportId });
        if (iceparameters){
            console.log("restartIce::iceparameters ", {...iceparameters})
            transport.restartIce({iceParameters: {...iceparameters} })
           // publish_status.innerHTML =  `connectionstatechange --> ${state} `;
        }
        else{
          flag = true
          transport.close()
        }
        break;
      case 'failed':
        if(flag){
          transport.close()
        //  publish_status.innerHTML =  `connectionstatechange --> ${state} `;
        }
        else{
          let transport_Id = transport.id
          let iceparams = await socket.request('restartProducerIce', { transport_Id });
          if (iceparams){
            console.log("restartIce::iceparameters ", {...iceparameters})
            transport.restartIce({iceParameters: {...iceparams} })
          }
        }
      break;

      default:
         break;
    }
  });
  try {
    media_stream = await getUserMedia(mediaInputSource);
    console.log('media_stream :', media_stream)

    const track = media_stream.getVideoTracks()[0];
    if (media_stream){
      handleSuccess(media_stream)
    }
 
    console.log('track --> ', track)
    const params = { track };
  /*  if (chk_Simulcast.checked) {
      params.encodings = [
        { maxBitrate: 100000 },
        { maxBitrate: 300000 },
        { maxBitrate: 900000 },
      ];
      params.codecOptions = {
        videoGoogleStartBitrate : 1000
      };
    }*/
    producer = await transport.produce(params);
    console.log(producer)
    const videoTrack = media_stream.getVideoTracks()[0]; //video track
    const audioTrack = media_stream.getAudioTracks()[0]; // audio track
    const videoParams = { videoTrack };
    const audioParams = { audioTrack }
    videoProducer = await transport.produce({
      track: media_stream.getVideoTracks()[0],
      encodings   :
      [
        { maxBitrate: 100000 },
        { maxBitrate: 300000 },
        { maxBitrate: 900000 }
      ],
      codecOptions :
      {
        videoGoogleStartBitrate : 1000
      }
    })
    /**
     * producing the audio
    */
    audioProducer = await transport.produce({
      track: media_stream.getAudioTracks()[0],
      codecOptions: {
        opusStereo: 1,
        opusDtx: 1,
      }
    });
  } 
  catch (err) {


  }

};

function startRecordMediaStream(){

  console.log('hello startRecordMediaStream')

  if (recordType === 'Start Recording'){
    startRecording();
  }
  else{
    stopRecording()
  }
 }
 function getSupportedMimeTypes() {
  const possibleTypes = [
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp8,opus',
    'video/webm;codecs=h264,opus',
    'video/mp4;codecs=h264,aac',
  ];
  let supportedMiMeType = possibleTypes.filter(mimeType => {
    return MediaRecorder.isTypeSupported(mimeType);
  })
  console.log('supportedMiMeType: ', supportedMiMeType)
  /**
   * 
   */     let supported = [];
  supportedMiMeType.forEach((device) => {
    console.log(device)
supported.push(device)
  })
  setMimType(supported)
}
function handleSuccess(stream) {
  //recordButton.disabled = false;
  console.log('getUserMedia() got stream:', stream);
  window.stream = stream;
  startRecordMediaStream()
}
function startRecording() {
  console.log('startRecording: ')
  recordedBlobs = [];
 // const mimeType = mimType[0]
 //const options = mimType.split(';', 1)[0];
  //console.log(mimeType)
const options = {mimeType: mimType[0]};
  try {
 
    console.log(options)
    mediaRecorder = new MediaRecorder(window.stream, options);
    console.log('mediaRecorder: ', mediaRecorder)
  } 
  catch (e) {
    console.error('Exception while creating MediaRecorder:', e);
   // recordButton.innerHTML = `Exception while creating MediaRecorder: ${JSON.stringify(e)}`;
    return;
  }
  console.log('Created MediaRecorder', mediaRecorder, 'with options', options);
setRecordType("")
  mediaRecorder.onstop = (event) => {
    console.log('Recorder stopped: ', event);
    console.log('Recorded Blobs: ', recordedBlobs);
  };
  mediaRecorder.start()
  mediaRecorder.ondataavailable =  function(event){
    console.log('jlnjkbjhg')
      console.log('handleDataAvailable', event);
        recordedBlobs.push(event.data);
    }
  console.log(recordedBlobs)
  console.log('hello')
  console.log('MediaRecorder started', mediaRecorder);
}
function stopRecording() {
  console.log(mediaRecorder)
  mediaRecorder.stop();
}
function previewRecordedMediaStream(){
  console.log('helo previewRecordedMediaStream')
  console.log(mimType)
  const mimeType = mimType[0].split(';', 1)[0];
  console.log('mimeType: ', mimeType )
  const superBuffer = new Blob(recordedBlobs, {type: mimeType});
  console.log('superBuffer: ', superBuffer )
  // video_live_event.srcObject = null;
 liveEvent.src=window.URL.createObjectURL(superBuffer);
 liveEvent.controls = true;
 liveEvent.play();
}
function downloadRecordedMediaStream(){
  const blob = new Blob(recordedBlobs, {type: 'video/webm'});
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = `${eventname}.webm`;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 100);
}
async function getUserMedia(mediaInputSource) {
  if (!device.canProduce('video')) {
    console.error('cannot produce video');
    return;
  }
  let stream;
  console.log('mediaInputSource@sw: ', mediaInputSource )
  console.log(stream)
  try {
    switch (mediaInputSource){
      case 'webcam':
        console.log(mediaInputSource)
        stream = await navigator.mediaDevices.getUserMedia({ video: {
          width:  1920 , 
          height: 1080  ,
          aspectRatio: {ideal: 1} 
        },
        audio: { 
          autoGainControl: false,
          googAutoGainControl: false,
          channelCount: 2,
          echoCancellation: false,
          latency: 0,
          noiseSuppression: false,
          sampleRate: 48000,
          sampleSize: 16,
          volume: 1.0
        },}) 
        break
      case 'screen':
        console.log(mediaInputSource)
        stream = await navigator.mediaDevices.getDisplayMedia({  video: {
          width: {max: 1024},
          height: {max: 1024},
          aspectRatio: {ideal: 1}
        },
        audio: { 
          autoGainControl: false,
          googAutoGainControl: false,
          channelCount: 2,
          echoCancellation: false,
          latency: 0,
          noiseSuppression: false,
          sampleRate: 48000,
          sampleSize: 16,
          volume: 1.0
        },});
        break
      case 'externalSource':
        stream = await getStream();
        break
      default:
        break
    }
  } catch (err) {
    console.error('getUserMedia(isWebcam) failed --> ', err.message);
    throw err;
  }
  return stream;
}
async function haltLivestream(){// username, eventname, id, event_type 
  let isProducerTransportClosed = await socket.request('haltliveStream', { username, eventname, eventId,event_type })
  console.log('isProducerTransportClosed: ', isProducerTransportClosed)
  if (isProducerTransportClosed){
console.log('live event is disabled')
setScreenDisabled(false);
setDisabled(false)
setRecordType(null)
handleClickOpenLive()
console.log(setRecordType)
//stopRecording()

  }
  //props.history.push('/streamVideo');
}
async function available_Devices(){

  await navigator.mediaDevices.getUserMedia({ video: true,audio: { 
    autoGainControl: false,
    googAutoGainControl: false,
    channelCount: 2,
    echoCancellation: false,
    latency: 0,
    noiseSuppression: false,
    sampleRate: 48000,
    sampleSize: 16,
    volume: 1.0
}})
  .then((p)=>{
    navigator.mediaDevices.enumerateDevices()
    .then(deviceList =>{
      let audioinputDevice = [];
      let videoInputDevice = [];
      deviceList.forEach((device) => {
        if(device.kind==='audioinput'){
        audioinputDevice.push(device)
          console.log(device.kind)
        }
        if(device.kind==='videoinput'){
          videoInputDevice.push(device)
            console.log(device.kind)
          }
      })
      console.log(audioinputDevice)
      setAudioinput(audioinputDevice)
      setVideoinput(videoInputDevice)
      console.log('the avialable device is ', deviceList)
      console.log(deviceList[0].kind + ": " + deviceList[0].label + " id = " + deviceList[0].deviceId);
    })
    .catch((err) => {
      console.log('error getting MediaDeviceInfo list', err);
    });
  })

}
async function updateDevices(){
  
  await navigator.mediaDevices.getUserMedia({ video: true,audio: { 
    autoGainControl: false,
    googAutoGainControl: false,
    channelCount: 2,
    echoCancellation: false,
    latency: 0,
    noiseSuppression: false,
    sampleRate: 48000,
    sampleSize: 16,
    volume: 1.0
}})
  .then((p)=>{
    navigator.mediaDevices.enumerateDevices()
    .then(deviceList =>{
      let audioinputDevice = [];
      let videoInputDevice = [];
      deviceList.forEach((device) => {
        if(device.kind==='audioinput'){
        audioinputDevice.push(device)
          console.log(device.kind)
        }
        if(device.kind==='videoinput'){
          videoInputDevice.push(device)
            console.log(device.kind)
          }
      })
      console.log(audioinputDevice)
      setAudioinput(audioinputDevice)
      setVideoinput(videoInputDevice)
      console.log('the avialable device is ', deviceList)
      console.log(deviceList[0].kind + ": " + deviceList[0].label + " id = " + deviceList[0].deviceId);
    })
    .catch((err) => {
      console.log('error getting MediaDeviceInfo list', err);
    });
  })

}
navigator.mediaDevices.ondevicechange=function(event){
  setOpenAlert(true)
  updateDevices()
}
function getStream(){
  let audioInput = inputAudieo
  let videoIn = inputVideo
  console.log('external source: '+' audioInput Id:  '+ audioInput +'  videoInput Id: '+videoIn)
  let constraints = {
    audio: { deviceId: audioInput ? { exact: audioInput } : undefined },
    video: { deviceId: videoIn ? { exact: videoIn } : undefined }
  }
  try{
    let stream = navigator.mediaDevices.getUserMedia(constraints)
    return stream;
  }
  catch(error){
    console.log('external src: stream: ', error)
  }

}
const [openInput, setOpenInput] = React.useState(false);

const handleClickOpenInput = () => {
  setOpenInput(true);
};
const handleClickOpenLive = () => {
  setLiveVideo(true);
};
const handleCloseInput = () => {
  setOpenInput(false);
};
const [openAlert, setOpenAlert] = React.useState(false);
const [inputAudieo,setInputAudieo]=useState("");
const[inputVideo,setInputVideo]=useState("")
console.log(inputAudieo)
console.log(window.location.href)
const handleClosedLive=()=>{
  props.history.push('/streamVideo')
}
const host=window.location.host
const invietationLink =`http://${host}/joinEvent?${eventId}`
const [openLiveVideo, setLiveVideo] = React.useState(false);
    return (

      <Layout>
        <div>
          <Container>
        <div>
          <Row  className="justify-content-md-center"><div>   

<video ref={myVideo} controls autoplay playsinline></video>
 </div>  </Row>
<div className='liveStream'>
  <div style={{display:"flex"}}>
             <Col>
              <Button
  disabled={webCameDisabled}
        name ='webcam'
                size=''
                className={classes.button}
                value="webcam"
                startIcon={<Camera/>}
                onClick={(e) => {
                  publish('webcam')
                }}
              >
             webcam
              </Button>
              </Col>
              <Col>
              <Button
    styel={{width:"70px"}}
                size=''
                className={classes.button}
                startIcon={<StopScreenShareIcon/>}
                onClick={() => {
                    handleClickOpen()
                }}
              >
             Halt Stream
              </Button>
              </Col>
              </div>
              <div style={{display:"flex"}}>
              <Col>
              <Button
              disabled={screenDisabled}
             name='screen'
                size=''
                className={classes.button}
                value="screen"
                startIcon={<ScreenShareIcon/>}
                onClick={(e) => {
                    publish('screen')
                }}
              >
             Schere
              </Button>
              </Col>
              <Col>
              <Button
        
                size=''
                className={classes.button}
                startIcon={<HardwareIcon/>}
                onClick={handleClickOpenInput}
              >
            Use External Source
              </Button>
              </Col>
              </div>  
              {event_type==='Private' &&
     <textarea
     styel={{marginLeft:"40px"}}
            className='textarea'
            placeholder='Sent Invietation Link'
          value={invietationLink}
            required
            //onChange={(e) => setText(e.target.value)}
          ></textarea>
        }
 <Dialog maxWidth="sm" fullWidth
        open={openInput}
        onClose={handleCloseInput}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
           <Box position="absolute" top={0} right={0}>
        <IconButton onClick={handleCloseInput}>
          <Close />
        </IconButton>
      </Box>
        <DialogContent>
        <Box sx={{ minWidth: 120 }}>
              <FormControl style={{minWidth: 150,marginLeft:"32px"}}>  
    <InputLabel style={{marginTop:"20px",color:"white"}}>Video Source</InputLabel>
    <Select value={inputVideo}
    style={{ backgroundColor: "teal",color:"white",marginTop:"40px"}}
            onChange={(e) => setInputVideo(e.target.value)}
           >
        {videoinput.map((iteam,index)=>(
      <MenuItem value={iteam.deviceId}>{iteam.label}</MenuItem>
    )) }
    </Select>
</FormControl>
    </Box>
    <Box sx={{ minWidth: 120 }}>
              <FormControl style={{minWidth: 150,marginLeft:"32px"}}> 
            
    <InputLabel style={{marginTop:"20px",color:"white"}}>Audieo Source</InputLabel>
    <Select value={inputAudieo}
    style={{ backgroundColor: "teal",color:"white",marginTop:"40px"}}
            onChange={(e) => setInputAudieo(e.target.value)}
           >
        {audioinput.map((iteam,index)=>(
 <MenuItem value={iteam.deviceId}>{iteam.label}</MenuItem>  
    )) }
    </Select>
</FormControl>
    </Box>
        </DialogContent>
        <DialogActions>
        <Button onClick={handleCloseInput} color="primary" variant="contained">
          No
        </Button>
        <Button  onClick={() => {
   handleCloseInput();
   publish('externalSource')
}} color="secondary" variant="contained">
          Publish
        </Button>
        </DialogActions>
      </Dialog>
           
 </div>
 </div>
 <Dialog maxWidth="sm" fullWidth
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
           <DialogTitle>Confirm the action</DialogTitle>
           <Box position="absolute" top={0} right={0}>
        <IconButton onClick={handleClose}>
          <Close />
        </IconButton>
      </Box>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          would you like to leave the live stream
          </DialogContentText>
        </DialogContent>
        <DialogActions>
        <Button onClick={handleClose} color="primary" variant="contained">
          Now
        </Button>
        <Button  onClick={() => {
   handleClose();
   haltLivestream();
}} color="secondary" variant="contained">
          Yes
        </Button>
        </DialogActions>
      </Dialog>
      <Dialog maxWidth="sm" fullWidth
        open={openLiveVideo}
        onClose={handleClosedLive}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
           <DialogTitle  className={classes.dialogTitle}>
                <IconButton styel={{marginLeft:"20px"}} disableRipple className={classes.titleIcon}>
              
                </IconButton>
            </DialogTitle>
     
           <Box position="absolute" top={0} right={0}>
        <IconButton onClick={handleClosedLive}>
          <Close />
        </IconButton>
      </Box>
        <DialogContent>

          <DialogContentText id="alert-dialog-description">
          would you like to dowunload the live stream
          </DialogContentText>
      
        </DialogContent>
        <DialogActions>
        <Button onClick={handleClosedLive} color="primary" variant="contained">
No
        </Button>
  
        <Button  onClick={downloadRecordedMediaStream} color="secondary" variant="contained">
        Dowunload
        </Button>
        </DialogActions>
      </Dialog>
 
      < Box sx={{ width: '30%' }}>
      <Collapse in={openAlert}>
        <Alert
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpenAlert(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          New Devices is  available
        </Alert>
      </Collapse>
  
    </Box>
      </Container>
       </div>
       </Layout>
    )
}

export default LiveEventOriginal
