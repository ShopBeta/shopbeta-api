// const Sib = require('sib-api-v3-sdk')
require('dotenv').config()
const sgMail = require('@sendgrid/mail')

// const client = Sib.ApiClient.instance

// const apiKey = client.authentications['api-key']

// apiKey.apiKey = process.env.SENDINBLUE_API_KEY

// const tranEmailApi = new Sib.TransactionalEmailsApi()

// const sender = {
//     email: 'shopbeta22@gmail.com',
//     name: 'Ronel Michael Emmanuel'
// }

// const receivers = [
//     {
//         email: 'ronelmichael14@gmail.com'
//     }
// ]

// tranEmailApi.sendTransacEmail({
//     sender,
//     to: receivers,
//     subject: 'Subscrie to Cules coding to become a developer',
//     textContent: `Cules coding will teach you how to become developer`,
//     htmlContent: `<h1>Cules Coding</h1>
//     <a href="https://cules-coding.vercel.app/">Visit</a>`,
//     params: {
//         role: 'Frontend',
//     },
// })
// .then(console.log)
// .catch(console.log)

// const sendWelcomeEmail = (email, name) => {
//     tranEmailApi.sendTransacEmail.send({
//         sender,
//         to: email,
//         subject: 'Thanks for joining in!',
//         textContent: `Welcome to the app, ${name}. Let me know how you get along with the app.`
//     })
//     .then(console.log)
//     .catch(console.log)
// }

// module.exports = {
//     sendWelcomeEmail
// }

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const WelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'shopbeta22@gamil.com',
        subject: 'Thanks for joining in!',
        text: `🎉 Welcome to ShopBeta, ${name}! 🌟

        Congratulations and a warm welcome to the ShopBeta community! We're thrilled to have you on board as our newest member.
        
        At ShopBeta, we're passionate about creating an exceptional shopping experience for you. With our powerful tools and vast selection of merchandise, we're here to make your shopping journey smooth, enjoyable, and rewarding.
        
        Whether you're looking to buy or sell, our platform is designed to connect you with a vibrant community of buyers and sellers, making it easier than ever to find what you need or showcase your products.
        
        Feel free to explore our user-friendly interface, discover exciting deals, and connect with fellow shoppers. We encourage you to take full advantage of the incredible opportunities ShopBeta has to offer.
        
        If you ever need assistance or have any questions, our dedicated support team is here to help. Just reach out, and we'll be more than happy to assist you.
        
        Once again, thank you for choosing ShopBeta. We're excited to have you with us, and we can't wait to see you thrive in our community.
        
        Happy shopping and selling!
        
        Best regards,
        The ShopBeta Team.`
    })
}

const CancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'shopbeta22@gamil.com',
        subject: 'Sorry to see you go!',
        text: `👋 Farewell, ${name}! We're Sad to See You Go.

        It's with a heavy heart that we bid you farewell from the ShopBeta community. We received your request to delete your account, and we've processed it accordingly.
        
        We want to express our gratitude for being a part of ShopBeta and for your support during your time with us. Your presence has contributed to our vibrant community, and we truly appreciate your engagement and trust.
        
        While we understand that circumstances change, we genuinely value each and every user who has been a part of our journey. We hope that your experience with ShopBeta was positive, and we apologize if there were any aspects that fell short of your expectations.
        
        If there's anything we can do to improve or assist you further, please don't hesitate to reach out to us. Your feedback is invaluable to us as we strive to enhance our platform and provide the best possible experience for our users.
        
        Should you ever decide to return, we'll be more than happy to welcome you back into the ShopBeta family. Until then, we wish you the very best in all your future endeavors.
        
        Thank you once again for being a part of our community and for your support along the way.
        
        Sincerely,
        The ShopBeta Team`
    })
}

const DeleteProductEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'shopbeta22@gamil.com',
        subject: 'Sorry to see you go!',
        text: `👋 Farewell, ${name}! We're Sad to See You Go.

        It's with a heavy heart that we bid you farewell from the ShopBeta community. We received your request to delete your account, and we've processed it accordingly.
        
        We want to express our gratitude for being a part of ShopBeta and for your support during your time with us. Your presence has contributed to our vibrant community, and we truly appreciate your engagement and trust.
        
        While we understand that circumstances change, we genuinely value each and every user who has been a part of our journey. We hope that your experience with ShopBeta was positive, and we apologize if there were any aspects that fell short of your expectations.
        
        If there's anything we can do to improve or assist you further, please don't hesitate to reach out to us. Your feedback is invaluable to us as we strive to enhance our platform and provide the best possible experience for our users.
        
        Should you ever decide to return, we'll be more than happy to welcome you back into the ShopBeta family. Until then, we wish you the very best in all your future endeavors.
        
        Thank you once again for being a part of our community and for your support along the way.
        
        Sincerely,
        The ShopBeta Team`
    })
}

const resetPasswordEmail = (email) => {

    const resetURL = `https://shopbeta-online.onrender.com/assets/indexes/ResetPassword`
    const message = `Forgot your password? No need to worry, you can reset your ShopBeta password here: \n ${resetURL}.\n
                     If you didn't forget your password, please ignore this email.
                     All the best,
                    
                     The ShopBeta Team`

    sgMail.send({
        to: `${email}`,
        from: 'shopbeta22@gamil.com',
        subject: "Reset Password",
        text: `${message}`,
        html: `<strong>${resetURL}</strong>`,
    })
}

const passwordSuccessEmail = (email, name) => {

    const message = `${name} your password has been updated successfully!!!\n
    If you didn't forget your password, please ignore this email.`

    sgMail.send({
        to: `${email}`,
        from: 'shopbeta22@gamil.com',
        subject: "Password Reset Successful",
        text: `${message}`,
    })
}


module.exports = {
    WelcomeEmail,
    CancelationEmail,
    resetPasswordEmail,
    passwordSuccessEmail,
    DeleteProductEmail
}