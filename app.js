const express = require("express")
require('./src/db/mongoose')
const http = require('http')
const cors = require('cors')
const socketio = require('socket.io')
const bodyParser = require("body-parser")
const userRouter = require('./src/routers/user')
const productRouter = require('./src/routers/products')
const feedRouter = require('./src/routers/feed')
const cartRouter = require('./src/routers/cart')
const chatRouter = require('./src/routers/chat')
const WebSockets = require('./src/chat/WebSockets')

const app = express()
const router = new express.Router()
const server = http.createServer(app)

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(userRouter)
app.use(productRouter)
app.use(feedRouter)
app.use(cartRouter)
app.use(chatRouter)

/** Create socket connection */
global.io = socketio(server);
global.io.on('connection', WebSockets.connection)

/** Keeping server up always */
setInterval(function() {
    router.get("https://shopbeta-app.herokuapp.com");
}, 200000); // every 5 minutes (300000)

// module.exports = server
module.exports = server