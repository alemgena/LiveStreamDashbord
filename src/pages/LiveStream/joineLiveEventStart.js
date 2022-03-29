import React, { useEffect, useRef, useState } from 'react'

import { Device } from 'mediasoup-client'
import socketClient from 'socket.io-client'
import { promise } from '../../utiles/SocketPromise'
import { useSelector } from 'react-redux'
import { url } from '../../utiles/url'
import SubscriptionsIcon from '@mui/icons-material/Subscriptions'
import Button from '@material-ui/core/Button'
import { IconButton } from '@material-ui/core'
import { Close } from '@material-ui/icons'
import { useHistory } from 'react-router'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@mui/material/Box'
import { v4 as uuidv4 } from 'uuid'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import UnsubscribeIcon from '@mui/icons-material/Unsubscribe'
import Layout from '../../components/layout/Layout'
let videoConsumer
let audioConsumer
//global variables
let device, consumerId, flag
let live_media_stream
const opts = {
  secure: true,
  reconnect: true,
  rejectUnauthorized: false,
}
let username
let eventname, transport, eventType
let socket = socketClient('https://ethiolive.net', { path: '/socket.io' })
const serverUrl = `${url}`
socket.request = promise(socket)
const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
    marginLeft: '30px',
    color: 'white',
    backgroundColor: 'teal',
    '&:hover': {
      backgroundColor: 'brown',
    },
  },
  subscribe: {
    color: 'teal',
    '&:hover': {
      backgroundColor: 'brown',
    },
  },
}))
let producerUsername
function JoinCreateEvent(props) {
  function generate_consumerId() {
    return uuidv4()
  }
  consumerId = generate_consumerId()
  const [open, setOpen] = React.useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const history = useHistory()
  function refres() {
    //we will auto-triggering js function
    //to refresh once after first load
    ;(function () {
      if (window.localStorage) {
        //check if reloaded once already
        if (!localStorage.getItem('firstLoad')) {
          //if not reloaded once, then set firstload to true
          localStorage['firstLoad'] = true
          //reload the webpage using reload() method
          window.location.reload()
        } else localStorage.removeItem('firstLoad')
      }
    })()
  }
  useEffect(() => {
    refres()
    username = props.match.params.username
    console.log(username)
    eventname = props.match.params.eventname
    producerUsername = props.match.params.producer
    eventType = props.match.params.eventType
    console.log(producerUsername)
    socket.on('connect', async () => {
      console.log(`connected to ${serverUrl}`)
      console.log(`connected user : ${username} event : ${eventname}`)
      const data = await socket.request('getRouterRtpCapabilitiesConsumer', {
        username,
        consumerId,
        eventname,
        producerUsername,
      })
      console.log('data@connect: ', data)
      await loadDevice(data)
    })
    console.log('device@useEffect: ', device)
    socket.on('disconnect', () => {
      console.log(`disconnected from ${serverUrl}`)
      props.history.push('/joinEvent')
    })

    socket.on('connect_error', (error) => {
      console.error('could not connect to %s%s (%s)', serverUrl, error.message)
    })
    socket.emit('join_event', {
      username,
      consumerId,
      eventname,
      producerUsername,
      eventType,
    })

    async function loadDevice(routerRtpCapabilities) {
      try {
        device = new Device()
        console.log(device)
      } catch (error) {
        if (error.name === 'UnsupportedError') {
          console.error('browser not supported')
        }
      }
      await device.load({ routerRtpCapabilities })
    }
  }, [])
  // event_name=dataEvent.evenetName;
  const classes = useStyles()
  const myVideo = useRef()

  console.log('error')
  console.log('the video', myVideo)
  async function subscribe() {
    console.log('this is consumer')
    const data = await socket.request('createConsumerTransport', {
      forceTcp: false,
    })
    console.log(data)
    if (data.error) {
      console.error(data.error)
      return
    }
    await resolveAfterXSeconds(3)
    transport = device.createRecvTransport(data)

    console.log('transport: ', transport)

    transport.on('connect', ({ dtlsParameters }, callback, errback) => {
      socket
        .request('connectConsumerTransport', {
          transportId: transport.id,
          dtlsParameters,
        })
        .then(callback)
        .catch(errback)
      console.log(
        `consumer -> transport Connectionstate --> ${transport.connectionState}`,
      )
    })

    transport.on('connectionstatechange', async (state) => {
      console.log(`transport-->consumer connectionState --> ${state}`)

      switch (state) {
        case 'connecting':
          // sub_status.innerHTML = 'subscribing...';
          //Subscribtion_Control.disabled = true;
          break
        case 'connected':
          await resolveAfterXSeconds(3)
          myVideo.current.srcObject = live_media_stream
          myVideo.current.play()
          console.log(live_media_stream)
          await socket.request('resume')
          console.log('live media stream: ', live_media_stream)

          //   sub_status.innerHTML = 'subscribed';
          // btn_subscribe.disabled = true
          //btn_unsubscribe.disabled = false
          break
        case 'disconnected':
          let iceparameters = await socket.request('restartConsumerIce', {
            consumerId,
          })
          if (iceparameters) {
            console.log('restartIce::iceparameters ', { ...iceparameters })
            transport.restartIce({ iceParameters: { ...iceparameters } })
          } else {
            flag = true
            transport.close()
          }
          break
        case 'failed':
          if (flag) {
            transport.close()
            // publish_status.innerHTML =  `connectionstatechange --> ${state} `;
          } else {
            let iceparams = await socket.request('restartConsumerIce', {
              consumerId,
            })
            if (iceparams) {
              console.log('restartIce::iceparameters ', { ...iceparams })
              transport.restartIce({ iceParameters: { ...iceparams } })
            }
          }
          break
        default:
          break
      }
    })
    console.log('this is consumer')
    live_media_stream = await consume(transport)
    // myVideo.current.srcObject=live_media_stream
    //myVideo.current.srcObject =live_media_stream;
    console.log('live media stream: ', live_media_stream)
  }

  async function consume(transport) {
    const { rtpCapabilities } = device
    let dataJsonString = await socket.request('consume', {
      rtpCapabilities,
      eventType,
      consumerId,
    })

    const data = parseJsonText(dataJsonString)

    console.log('consumerParams ', data)

    let videoConsumerParams = data.videoParams
    let audioConsumerParams = data.audioParams

    console.log({ ...videoConsumerParams })
    console.log({ ...videoConsumerParams })

    let stream = new MediaStream()
    if (videoConsumerParams) {
      videoConsumer = await transport.consume({ ...videoConsumerParams })
      stream.addTrack(videoConsumer.track)
    }
    if (audioConsumerParams) {
      audioConsumer = await transport.consume({ ...audioConsumerParams })
      stream.addTrack(audioConsumer.track)
    }
    // console.log('consumer track : ',{videoConsumer.track,  audioConsumer.track})
    console.log('stream: ', stream)
    return stream
  }
  function parseJsonText(jsonText) {
    let map = JSON.parse(jsonText)

    return map
  }

  function resolveAfterXSeconds(x) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(x)
      }, x * 10 ** 3)
    })
  }
  async function unsubscribe() {
    let unsubscribe_status = await socket.request('unsubscribe', {
      username,
      eventname,
      producerUsername,
    })
    if (unsubscribe_status) {
      socket.emit('consumerLeave', { username, consumerId })
      await resolveAfterXSeconds(2)
      history.push({
        pathname: '/joinEvent',
        search: '?id',
      })
    }
  }
  return (
    <Layout>
      <div>
        <div className="video-container">
          <video ref={myVideo} controls autoplay playsinline></video>
        </div>
        <div className="liveStream">
          <Button
            size=""
            className={classes.button}
            startIcon={<SubscriptionsIcon />}
            onClick={() => {
              subscribe()
            }}
          >
            SUbscribe
          </Button>
          <Button
            size=""
            className={classes.button}
            startIcon={<UnsubscribeIcon />}
            onClick={() => {
              handleClickOpen()
            }}
          >
            Unsubscribe
          </Button>
        </div>
        <Dialog
          maxWidth="sm"
          fullWidth
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
            <Button
              onClick={() => {
                handleClose()
                unsubscribe()
              }}
              color="secondary"
              variant="contained"
            >
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </Layout>
  )
}

export default JoinCreateEvent
