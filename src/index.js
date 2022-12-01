const server = require("./app")
const port = process.env.PORT || 3000

// setInterval(function() {
//     server.get("https://shopbeta-app.herokuapp.com");
// }, 300000); // every 5 minutes (300000)

server.listen(port, (err) => {
    console.log(`Server is on port ${port}`)
})