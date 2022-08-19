// const sgMail = require('@sendgrid/mail')

// sgMail.setApiKey(process.env.SENDGRID_API_KEY)

// const sendWelcomeEmail = (email, name) => {
//     sgMail.send({
//         to: email,
//         from: 'ronelmichael14@gmail.com',
//         subject: 'Thanks for joining in!',
//         text: `Welcome to the app, ${name}. Let me know how you get along with the app.`,
//         // html: 'you can write all sort of stuffs with styling and media files '
//     })
// }

// const sendCancelationEmail = (email, name) => {
//     sgMail.send({
//         to: email,
//         from: 'ronelmichael14@gmail.com',
//         subject: 'Sorry to see you go!',
//         text: `Goodbye, ${name}. I hope to see you back sometime soon.`
//     })
// }

// const sendNewProductEmail = (email, name) => {
//     sgMail.send({
//         to: email,
//         from: 'ronelmichael14@gmail.com',
//         subject: 'Thanks for your services!',
//         text: `Welcome to the app, ${name}. We hope you have the best expereince on our platform. Let us know how you get along with the app.`,
//         // html: 'you can write all sort of stuffs with styling and media files '
//     })
// }

// const sendDeleteProductEmail = (email, name) => {
//     sgMail.send({
//         to: email,
//         from: 'ronelmichael14@gmail.com',
//         subject: 'Sure you have a new product!',
//         text: `It's important to update some new products to engage more social shoppers, ${name}. We hope to see your updates sometime soon.`
//     })
// }

// module.exports = {
//     sendWelcomeEmail,
//     sendCancelationEmail,
//     sendNewProductEmail,
//     sendDeleteProductEmail
// }