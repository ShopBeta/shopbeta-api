const express = require("express")
require('./db/mongoose')
const http = require('http')
const cors = require('cors')
const userRouter = require('./routers/user')
const productRouter = require('./routers/products')
const feedRouter = require('./routers/feed')
const cartRouter = require('./routers/cart')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)

app.use(express.json())
app.use(cors())
app.use(userRouter)
app.use(productRouter)
app.use(feedRouter)
app.use(cartRouter)
app.use(socketio)

module.exports = server