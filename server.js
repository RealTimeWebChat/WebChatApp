const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } =  require('uuid')

//yuv
//import Navbar from './src/components/Navbar';
//Navbar = require('./public/Navbar');
//yuv

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
    //<Router>
    //res.redirect(Navbar)   // <Route path="/" component={Navbar} />
    //</Router>
    res.redirect('/${uuidV4()}')
})

app.get('/:room', (req, res) => {
    res.render('room', {roomId: req.params.room })
})



io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId)
        socket.to(roomId).broadcast.emit('user-connected', userId)

        socket.on('disconnect', () => {
            socket.to(roomId).broadcast.emit('user-disconnected', userId)
        })
    })
})


//yuvraj1
//const CLOUD_BUCKET = 'projectyuvi-1576333215876';
const {Storage} = require('@google-cloud/storage');

//const storage = new Storage({ projectId: CLOUD_BUCKET, keyFilename: 'D:/Robert_Internship/RTChatApp/projectyuvi-1576333215876-1f74fa3d8e21.json' });
//const bucket = storage.bucket(CLOUD_BUCKET);

//storage .getBuckets().then(x => console.log(x))

//const web_chat_app_bucket = storage.bucket('web_chat_app')


//yuvraj3
        

//yuvraj1

server.listen(3000)
