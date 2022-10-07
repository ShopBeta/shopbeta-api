const server = require("./app")
const port = process.env.PORT

server.listen(port, (err) => {
    console.log(`Server is on port ${port}`)
})