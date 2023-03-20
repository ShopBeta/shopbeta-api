const express = require("express")
const serverless = require("serverless-http")
require('../src/db/mongoose')
const http = require('http')
const cors = require('cors')
const socketio = require('socket.io')
const bodyParser = require("body-parser")
const userRouter = require('../src/routers/user')
const productRouter = require('../src/routers/products')
const feedRouter = require('../src/routers/feed')
const cartRouter = require('../src/routers/cart')
const chatRouter = require('../src/routers/chat')
const WebSockets = require('../src/chat/WebSockets')

const app = express()
const server = http.createServer(app)
// const serverapp = serverless(app)

const router = new express.Router()

router.get('/', cors(), (req, res) => {
    res.json(
        {
            'id': '001',
            'name': 'Smith',
            'email': 'smith@gmail.com'
        }
    )
})

app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())
app.use(userRouter)
app.use(productRouter)
app.use(feedRouter)
app.use(cartRouter)
app.use(chatRouter)

/** Create socket connection */
global.io = socketio(server);
global.io.on('connection', WebSockets.connection)

// module.exports = server
module.exports.handler = serverless(app)