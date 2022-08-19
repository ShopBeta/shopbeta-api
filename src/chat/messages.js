const generateMessage = (text) => {
    return {
        text,
        createdAt: new Date().getTime()
    }
}

const generateLocationMessage = (url) => {
    return {
        url,
        createdAt: new Date().getTime()
    }
}


const generateMediaMessage = (buffer) => {
    return {
        buffer,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    generateMessage,
    generateMediaMessage,
    generateLocationMessage
}