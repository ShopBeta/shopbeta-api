const express = require("express")
require('./db/mongoose')
const http = require('http')
const cors = require('cors')
const logger = require('logger')
const socketio = require('socket.io')
const bodyParser = require("body-parser")
const userRouter = require('./routers/user')
const productRouter = require('./routers/products')
const feedRouter = require('./routers/feed')
const cartRouter = require('./routers/cart')
const chatRouter = require('./routers/chat')
const WebSockets = require('./chat/WebSockets')

const app = express()
const server = http.createServer(app)

/** Create socket connection */
global.io = socketio(server);
global.io.on('connection', WebSockets.connection)

app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())
// app.use(logger("dev"))
app.use(cors())
app.use(userRouter)
app.use(productRouter)
app.use(feedRouter)
app.use(cartRouter)
app.use(chatRouter)

module.exports = server