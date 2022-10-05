const Sib = require('sib-api-v3-sdk')
require('dotenv').config()

const client = Sib.ApiClient.instance

const apiKey = client.authentications['api-key']

apiKey.apiKey = process.env.SENDINBLUE_API_KEY

const tranEmailApi = new Sib.TransactionalEmailsApi()

const sender = {
    email: 'shopbeta22@gmail.com',
    name: 'Ronel Michael Emmanuel'
}

const receivers = [
    {
        email: 'ronelmichael14@gmail.com'
    }
]

tranEmailApi.sendTransacEmail({
    sender,
    to: receivers,
    subject: 'Subscrie to Cules coding to become a developer',
    textContent: `Cules coding will teach you how to become developer`,
    htmlContent: `<h1>Cules Coding</h1>
    <a href="https://cules-coding.vercel.app/">Visit</a>`,
    params: {
        role: 'Frontend',
    },
})
.then(console.log)
.catch(console.log)

const sendWelcomeEmail = (email, name) => {
    tranEmailApi.sendTransacEmail.send({
        sender,
        to: email,
        subject: 'Thanks for joining in!',
        textContent: `Welcome to the app, ${name}. Let me know how you get along with the app.`
    })
    .then(console.log)
    .catch(console.log)
}

module.exports = {
    sendWelcomeEmail
}