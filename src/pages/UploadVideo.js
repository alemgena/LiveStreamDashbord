import React, { Component, Fragment } from 'react'
import {
  Grid,
  Container,
  Paper,
  TextField,
  Button,
  CssBaseline,
} from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import PhotoCamera from '@material-ui/icons/PhotoCamera'
import Videocam from '@material-ui/icons/Videocam'
import { CircularProgress } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import axios from 'axios'
import Menu from '@mui/material/Menu'
import Layout from '../components/layout/Layout'
import MenuItem from '@mui/material/MenuItem'
import { toast } from 'react-toastify'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
//import customerList from '../assets/JsonData/customers-list.json'
import { url } from '../utiles/url'
import { ProgressBar } from 'react-bootstrap'
import { useHistory } from 'react-router'
import Alert from '@mui/material/Alert'
import Collapse from '@mui/material/Collapse'
import CloseIcon from '@mui/icons-material/Close'
import AlertTitle from '@mui/material/AlertTitle'
let imageFile, videoFile
const useStyles = makeStyles((theme) => ({
  select: {
    '&:before': {
      borderColor: 'teal',
    },
    '&:after': {
      borderColor: 'teal',
    },
    '&:not(.Mui-disabled):hover::before': {
      borderColor: 'teal',
    },
  },
  icon: {
    fill: 'teal',
  },
  roo: {
    color: 'teal',
  },
  root: {
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '700px',
  },
  container: {
    opacity: '0.8',
    height: '90%',
    marginTop: theme.spacing(3),
    [theme.breakpoints.down(400 + theme.spacing(2) + 2)]: {
      marginTop: 0,
      width: '100%',
      height: '100%',
    },
  },
  div: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '40px',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  button: {
    margin: theme.spacing(3, 0, 2),
    backgroundColor: 'teal',
    color: 'white',
    '&:hover': {
      backgroundColor: 'brown',
      color: 'white',
    },
  },
  customTooltip: {
    // I used the rgba color for the standard "secondary" color
    backgroundColor: 'rgba(220, 0, 78, 0.8)',
  },

  customNeweTooltip: {
    // I used the rgba color for the standard "secondary" color
    backgroundColor: 'teal',
  },
  //
  customArrow: {
    color: 'teal',
  },
  grow: {
    flexGrow: 1,
  },
  butttonWith: {
    display: 'flex',
    width: '100%',
  },
  fragment: {
    alignItems: 'center',
    marginRight: '40px',
    marginBottom: '60px',
  },
  hover: {
    '&:hover': {
      backgroundColor: 'brown',
      color: 'white',
    },
  },
  borderTextField: {
    // - The TextField-root

    // (Note: space or no space after & matters. See SASS "parent selector".)
    '& .MuiOutlinedInput-root': {
      // - The Input-root, inside the TextField-root
      '& fieldset': {
        // - The <fieldset> inside the Input-root
        borderColor: 'teal',
        border: 'solid 3px ', // - Set the Input border
      },
      '&:hover fieldset': {
        borderColor: 'teal',
        border: 'solid 3px ', // - Set the Input border when parent has :hover
      },
      '&.Mui-focused fieldset': {
        // - Set the Input border when parent is focused
        borderColor: 'teal',
        border: 'solid 3px ',
      },
    },
  },
  input: {
    display: 'none',
  },
  faceImage: {
    color: theme.palette.primary.light,
  },
  customHoverFocus: {
    '&:hover, &.Mui-focusVisible, &:active': {
      backgroundColor: 'teal',
    },
    '&$buttonDisabled': {
      color: 'brown',
    },
  },
}))
const UploadVideo = (props) => {
  const history = useHistory()
  const [progressValue, setProgressVlue] = React.useState()
  const [categoriey, setCategory] = React.useState('')
  console.log(categoriey)
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [sub, setSub] = React.useState([])
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const [CategorieInfo, setCategorieInfo] = React.useState([])
  const [SubsubCategory, setSubsubCategory] = React.useState([])
  const classes = useStyles()
  React.useEffect(() => {
    if (
      !localStorage.getItem('Adminuser_id') ||
      !localStorage.getItem('tokenAdmin')
    ) {
      console.log('no token')
      props.history.push('/login')
    }

    axios.get(`${url}catagorey/getMainCategorie`).then((response) => {
      if (response.data.data) {
        console.log(response.data)
        setCategorieInfo(response.data.data)
      } else {
        console.log('error to get categoriey')
      }
    })
  }, [])
  const [Subscrieption, setSubscrieption] = React.useState('Free')
  const [form, setFormData] = React.useState({
    Title: '',
    Descrieption: ' ',
    video: null,
  })

  const [newData, setNewData] = React.useState({
    image: null,
  })
  const [forVideo, setVideo] = React.useState({ video: null })
  const [imageAlert, setOpenImageAlert] = React.useState(false)
  const [videoAlert, setVideoAlert] = React.useState(false)
  function imageUploadHandler(event) {
    imageFile = event.target.files[0]
    const inputValue =
      event.target.name === 'image' ? event.target.files[0] : event.target.value
    setNewData({
      ...newData,
      [event.target.name]: inputValue,
    })
    setOpenImageAlert(true)
  }
  function videoHandler(event) {
    videoFile = event.target.files[0]
    console.log(videoFile)
    const inputValue = event.target.files[0]
    setVideo({
      ...forVideo,
      [event.target.name]: inputValue,
    })
    setVideoAlert(true)
  }
  function handleChange(event) {
    //  videoFile=event.target.files[0]
    const inputValue = event.target.value
    setFormData({
      ...form,
      [event.target.name]: inputValue,
    })
  }

  const getSubCategory = (id, type) => {
    console.log(id)
    axios.get(`${url}catagorey/getAllSubCatagory/${id}`).then((response) => {
      if (response.data.data) {
        console.log(response.data)
        if (type === 'one') {
          setSub(response.data.data)
        }
        if (type === 'two') {
          setSubsubCategory(response.data.data)
        }
      } else {
        console.log('error to get categoriey')
      }
    })
  }
  const user = JSON.parse(localStorage.getItem('AdminloginInfo'))
  const [openAlert, setOpen] = React.useState(true)
  const [isLoading, setLoadign] = React.useState(false)
  const [inValidIMage, setInvaliedImage] = React.useState(null)
  const [isDone, setDone] = React.useState(false)
  const [openScu, setOpenScu] = React.useState(true)
  const [isDOne, setIsDone] = React.useState(false)
  console.log(categoriey)
  const validate = (e) => {
    e.preventDefault()

    let isValid = true
    if (!imageFile) {
      setInvaliedImage('Please select image.')
      setOpen(true)

      isValid = false
    }
    if (form.Title.length < 0) {
      setInvaliedImage('Title is required')
      isValid = false
      setOpen(true)
    }
    if (!videoFile) {
      setInvaliedImage('Please select video.')
      isValid = false
      setOpen(true)
    } //mp4|mkv|ts|mkv
    if (videoFile && !videoFile.name.match(/\.(mp4|mkv|ts|mkv)$/)) {
      setInvaliedImage('Please select valid video format.')
      isValid = false
      setOpen(true)
    }
    if (categoriey.length < 0) {
      setInvaliedImage('Please select categorey')
      isValid = false
      setOpen(true)
    }

    console.log(forVideo.video)
    if (imageFile && !imageFile.name.match(/\.(jpg|jpeg|png|gif)$/)) {
      setInvaliedImage('Please select valid image.')
      isValid = false
      setOpen(true)
    }
    if (isValid) {
      onSubmit()
    }
  }
  const token = localStorage.getItem('tokenAdmin')
  console.log(user.username)
  async function onSubmit() {
    setLoadign(true)
    const imageAppend = new FormData()
    imageAppend.append('image', newData.image)
    console.log(newData.image)
    axios.post(`${url}video/thumbnail`, imageAppend).then((response) => {
      console.log(response.data)
      console.log(response.data.imageName)
      console.log(response.data.imagePath)
      const videoAppend = new FormData()
      videoAppend.append('Title', form.Title)
      videoAppend.append('Descrieption', form.Descrieption)
      videoAppend.append('video', forVideo.video)
      videoAppend.append('username', user.userName)
      videoAppend.append('categorie', categoriey)
      videoAppend.append('thumbnialFilePath', response.data.imagePath)
      videoAppend.append('subscrieptionType', Subscrieption)
      videoAppend.append('thumbnialFileName', response.data.imageName)
      console.log(form.Title)
      console.log(form.video)
      // console.log(username)
      console.log(form.Descrieption)
      axios
        .post(`${url}video/uploadVideo`, videoAppend, {
          onUploadProgress: (data) => {
            //Set the progress value to show the progress bar
            setProgressVlue(Math.round((100 * data.loaded) / data.total))
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log(response)
          if (response.data.resualt) {
            setIsDone(true)
            setOpenScu(true)

            toast('Your video upload successfully', {
              position: 'top-right',
              autoClose: 3500,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            })
          } else if (response.data.message === 'no user') {
            toast('Your video is not upload successfully', {
              position: 'top-right',
              autoClose: 3500,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            })
          } else if (response.data.msg === 'Token is not valid') {
            history.push('/login')
            localStorage.clear()
            toast.info('token is expired! ', {
              position: 'top-right',
              autoClose: 2000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            })
          }
        })
    })
  }

  return (
    <Layout>
      <div>
        {!localStorage.getItem('Adminuser_id') ||
        !localStorage.getItem('tokenAdmin') ? (
          toast.info('Log to  upload video! ', {
            position: 'top-left',
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          })
        ) : (
          <Grid container component="main" className={classes.root}>
            <CssBaseline />
            <Container
              component={Paper}
              elevation={5}
              maxWidth="xs"
              className={classes.container}
            >
              <div className={classes.div}>
                {inValidIMage && (
                  <Collapse in={openAlert}>
                    <Alert
                      severity="error"
                      action={
                        <IconButton
                          aria-label="close"
                          color="inherit"
                          size="small"
                          onClick={() => {
                            setOpen(false)
                          }}
                        >
                          <AlertTitle></AlertTitle>
                          <CloseIcon fontSize="inherit" />
                        </IconButton>
                      }
                      sx={{ mb: 2 }}
                    >
                      {inValidIMage}
                    </Alert>
                  </Collapse>
                )}
                {isDOne && (
                  <Collapse in={openScu}>
                    <Alert
                      severity="success"
                      action={
                        <IconButton
                          aria-label="close"
                          color="inherit"
                          size="small"
                          onClick={() => {
                            setOpenScu(false)
                          }}
                        >
                          <AlertTitle></AlertTitle>
                          <CloseIcon fontSize="inherit" />
                        </IconButton>
                      }
                      sx={{ mb: 2 }}
                    >
                      Your video is upload successfully
                    </Alert>
                  </Collapse>
                )}
                <form className={classes.form}>
                  <Fragment className={classes.fragment}>
                    <input
                      accept="image/*"
                      className={classes.input}
                      id="icon-button-photo"
                      // onChange={this.handleCapture}
                      type="file"
                      name="image"
                      onChange={imageUploadHandler}
                    />
                    <Tooltip
                      classes={{
                        tooltip: classes.customTooltip,
                        arrow: classes.customArrow,
                      }}
                      style={{ marginLeft: '130px' }}
                      followCursor
                      disableInteractive
                      arrow
                      title="Select Image"
                    >
                      <label htmlFor="icon-button-photo">
                        <IconButton
                          color="primary"
                          // className={classes.customHoverFocus}

                          component="span"
                          size="large"
                          aria-label="upload picture"
                        >
                          {imageFile ? (
                            <PhotoCamera style={{ color: 'teal' }} />
                          ) : (
                            <PhotoCamera color="primary" />
                          )}
                        </IconButton>
                      </label>
                    </Tooltip>
                    <input
                      accept="video/*"
                      capture="camcorder"
                      className={classes.input}
                      id="icon-button-video"
                      //  onChange={this.handleCapture}
                      type="file"
                      size="large"
                      onChange={videoHandler}
                      name="video"
                    />
                    <Tooltip
                      followCursor
                      disableInteractive
                      arrow
                      classes={{
                        tooltip: classes.customTooltip,
                        arrow: classes.customArrow,
                      }}
                      title="Select Video"
                    >
                      <label htmlFor="icon-button-video">
                        <IconButton
                          color="primary"
                          //  className={classes.customHoverFocus}
                          component="span"
                        >
                          {videoFile ? (
                            <Videocam style={{ color: 'teal' }} />
                          ) : (
                            <Videocam color="primary" />
                          )}
                        </IconButton>
                      </label>
                    </Tooltip>
                  </Fragment>
                  {imageFile && (
                    <Collapse in={imageAlert}>
                      <Alert
                        severity="success"
                        action={
                          <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => {
                              setOpenImageAlert(false)
                            }}
                          >
                            <AlertTitle></AlertTitle>
                            <CloseIcon fontSize="inherit" />
                          </IconButton>
                        }
                        sx={{ mb: 2 }}
                      >
                        {imageFile.name}
                      </Alert>
                    </Collapse>
                  )}
                  {videoFile && (
                    <Collapse in={videoAlert}>
                      <Alert
                        severity="success"
                        action={
                          <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => {
                              setVideoAlert(false)
                            }}
                          >
                            <CloseIcon fontSize="inherit" />
                          </IconButton>
                        }
                        sx={{ mb: 2 }}
                      >
                        {videoFile.name}
                      </Alert>
                    </Collapse>
                  )}
                  <TextField
                    fullWidth
                    autoFocus
                    color="primary"
                    className={classes.borderTextField}
                    margin="normal"
                    variant="outlined"
                    placeholder="Title"
                    name="Title"
                    // value={}
                    //onChange={(e) => {setEmaileAdmin(e.target.value)   }}
                    onChange={handleChange}
                  />
                  <div className="form-error">{}</div>
                  <TextField
                    fullWidth
                    onChange={handleChange}
                    className={classes.borderTextField}
                    color="primary"
                    margin="normal"
                    variant="outlined"
                    placeholder="Descrieption"
                    name="Descrieption"
                    //  value={password}
                    //onChange={(e) => {  setPassword(e.target.value); }}
                  />
                  <div className="form-error">{}</div>
                  <FormControl
                    fullWidth
                    style={{ marginTop: '20px', borderColor: 'teal' }}
                  >
                    <InputLabel style={{ marginTop: '10px', color: 'teal' }}>
                      {' '}
                      Select Categorie
                    </InputLabel>
                    <Select
                      style={{ borderColor: 'teal' }}
                      className={classes.select}
                      inputProps={{
                        classes: {
                          icon: classes.icon,
                          root: classes.root,
                        },
                      }}
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={categoriey}
                      onChange={(e) => {
                        setCategory(e.target.value)
                      }}
                    >
                      {CategorieInfo.map((iteam, index) => (
                        <MenuItem
                          value={iteam.catagory_Name}
                          onClick={(e) => {
                            getSubCategory(iteam.id, 'one')
                          }}
                        >
                          {iteam.catagory_Name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {sub.length > 0 && (
                    <FormControl fullWidth style={{ marginTop: '20px' }}>
                      <InputLabel style={{ marginTop: '10px', color: 'teal' }}>
                        {' '}
                        Select Categorie
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={categoriey}
                        onChange={(e) => {
                          setCategory(e.target.value)
                        }}
                      >
                        {sub.map((iteam, index) => (
                          <MenuItem
                            value={iteam.catagory_Name}
                            onClick={(e) => {
                              getSubCategory(iteam.id, 'two')
                            }}
                          >
                            {iteam.catagory_Name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                  {SubsubCategory.length > 0 && (
                    <FormControl fullWidth style={{ marginTop: '20px' }}>
                      <InputLabel style={{ marginTop: '10px', color: 'teal' }}>
                        {' '}
                        Select Categorie
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={categoriey}
                        onChange={(e) => {
                          setCategory(e.target.value)
                        }}
                      >
                        {SubsubCategory.map((iteam, index) => (
                          <MenuItem
                            value={iteam.catagory_Name}
                            onClick={(e) => {
                              getSubCategory(iteam.id, 'three')
                            }}
                          >
                            {iteam.catagory_Name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                  {isDone ? (
                    <span>
                      {progressValue && (
                        <ProgressBar
                          striped
                          animated
                          variant="success"
                          now={progressValue}
                          label={`${progressValue}%`}
                        />
                      )}
                    </span>
                  ) : (
                    <span>
                      {progressValue && (
                        <ProgressBar
                          striped
                          animated
                          variant="warning"
                          now={progressValue}
                          label={`${progressValue}%`}
                        />
                      )}
                    </span>
                  )}
                  <Button
                    fullWidth
                    variant="contained"
                    style={{ marginBottom: '20px' }}
                    color="teal"
                    className={classes.button}
                    onClick={(event) => validate(event)}
                  >
                    Submit
                  </Button>
                </form>
              </div>
            </Container>
          </Grid>
        )}
      </div>
    </Layout>
  )
}
export default UploadVideo
