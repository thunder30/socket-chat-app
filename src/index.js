const path = require('path')
const express = require('express')
const handlebars = require('express-handlebars')
const http = require('http')
const { Server } = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = new Server(server)
const PORT = 3030

// config static file
app.use(express.static(path.join(__dirname, 'public'))) // __dirname là thư mục chứa index.js

// template engine
app.engine(
    'hbs',
    handlebars({
        extname: 'hbs',
        defaultLayout: 'main',
        layoutsDir: path.join(__dirname, 'resources/views/layouts'),
        partialsDir: [
            // path dir partials
            path.join(__dirname, 'resources/views/partials'),
        ],
    })
)

app.set('views', path.join(__dirname, 'resources/views'))
app.set('view engine', 'hbs') // Sử dụng hbs làm view engine

// routing
app.get('/', (req, res) => {
    res.render('home')
})

const users = []
const socketId = []
let amountUser = 0
// websocket
io.sockets.on('connection', (socket) => {
    //console.log(socket.id)

    socketId.push(socket.id)
    console.log('Amount user connecting: ', socketId.length)

    socket.on('disconnect', () => {
        let index = socketId.indexOf(socket.id)
        socket.broadcast.emit('member-join', {
            // thông báo cho các user khác
            name: users[index],
            join: false,
        })

        console.log(`${users[index]} out socket!`)
        socketId.splice(index, 1)
        users.splice(index, 1)
        console.log(users)
    })
    socket.on('set-user', (data) => {
        users.push(data.name)
        socket.broadcast.emit('member-join', {
            // thông báo cho các user khác
            name: data.name,
            join: true,
        })
        console.log(users)
    })
    socket.on('chat-message', (data) => {
        socket.broadcast.emit('chat-message', data)
    })
    socket.on('user', (username) => {
        socket.emit('user', { username, message: `Hello ${username}` })
    })
})

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})
