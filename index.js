const express = require('express');
const app = express();
require('dotenv').config()


app.use(express.static('client'));
// Main route
app.get('/',(req,res) => {
    res.sendFile(__dirname + '/client/index.html')
});

const server = app.listen(process.env.PORT || 3000,() => {
    console.log(`Server started on port ${process.env.PORT || 3000}`)
})

const io = require('socket.io')(server)
require('./sockets')(io);