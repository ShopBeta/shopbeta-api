const express = require("express")
require('./src/db/mongoose')
// const http = require('http')
const cors = require('cors')
const userRouter = require('./src/routers/user')
const productRouter = require('./src/routers/products')
const feedRouter = require('./src/routers/feed')
const socket = require('socket.io')

const app = express()
// const server = http.createServer(app)

app.use(express.json())
app.use(cors())
app.use(userRouter)
app.use(productRouter)
app.use(feedRouter)
app.use(socket)

module.exports = app
