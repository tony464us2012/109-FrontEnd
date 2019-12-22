const nodemailer = require('nodemailer');
require('dotenv').config()


let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: '109burgerjoint.business@gmail.com',
        pass: process.env.PASSWORD
    }
});

const sendMail = (cb) => {

  
let mailOptions = {
    from: '109burgerjoint.business@gmail.com',
    to: 'tony464us2011@yahoo.com',
    subject: 'Testing and testin',
    text: 'It works'
}

transporter.sendMail(mailOptions, function(err, data) {
    if (err) {
        console.log(err)
    } else {
        console.log('Email')
    }
})
}

module.exports= sendMail
