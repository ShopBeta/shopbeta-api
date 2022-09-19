const users = []
const User = require('../models/user')

const addUser = ({ id, username, room }) => {
    // Store user
    const user = User.findById({...req.body, id: req.params.id})
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
    return users.find((user) => user.id === id)
}

const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    return users.filter((user) => user.username === room)
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}