const express = require('express');
const app = express();
const cors = require('cors')
const path = require('path')
const stripe = require('stripe')('sk_live_GNJ2VHpoWt8oSTVgXqqRF4jo')
const nodemailer = require('nodemailer');
require('dotenv').config()

const PORT = process.env.PORT || 8080; 

app.use(cors())
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static('views'));
app.get('/', (req, res) => res.sendFile(path.resolve(__dirname, 'views', 'index.html')))

app.get('/paysuccess', (req, res) => res.sendFile(path.resolve(__dirname, 'views', 'success.html')))
app.get('/payfailed', (req, res) => res.sendFile(path.resolve(__dirname, 'views', 'payfailed.html')))

let transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: '109burgerjoint.business@gmail.com',
        pass: 'lnovqjbwgfuduwdf'
    }
});

function sendEmail(mail) {
    var mailOptions = {
        from: '109burgerjoint.business@gmail.com',
        to: mail.to,
        subject: mail.subject,
        html: mail.body
    }
    transport.sendMail(mailOptions, function(err, info) {
        if (err) {
            console.log(err)
        } else {
            console.log('Email sent')
        }
    })
}

app.post('/charge',  async (req, res) => {
    const token = req.body.stripeToken;
    const delivery = Number(req.body.delivery);
    const amount = Number(req.body.amount);
    const totalAmount = delivery? amount * 18.99 + 5: amount * 18.99;
    const name = req.body.name[0] + ' ' + req.body.name[1];
    const address = req.body.address; 
    const city = req.body.city;
    const state = req.body.state;
    const postal_code = req.body.postal_code;
    const email = req.body.stripeEmail;
    const phone = req.body.number;
    const tax = (totalAmount * .07).toFixed(2);
    const total = (totalAmount + Number(tax)).toFixed(2);
    const tocharge = total * 100;
    const size = req.body.size;

    mail = {
        to:'109burgerjoint@gmail.com',
        subject: 'New T-Shirt Order',
        body: `Their is a new order. ${amount} ${size} shirt(s) ordered by ${name}. Delivery Amount: $${delivery} Total of $${total}. Email: ${email}. Phone Number: ${phone}. Address: ${address} ${city} ${state} ${postal_code}`
    }
    
    try {
        const customer = await stripe.customers.create(
        {
            name,
            address: {
                line1: address,
                city,
                state,
                postal_code
            },
            phone,
            email,
            source: token
        });

        const charge = await stripe.charges.create({
            amount: tocharge,
            currency: 'usd',
            customer: customer.id,
            receipt_email: email,
            description: `${amount} ${size} Shirt`

        });
            sendEmail(mail)
            res.redirect('/paysuccess')
        
    } catch (error) {
        res.redirect('/payfailed')
        console.log(error)
    }
})
 



app.listen (PORT, () => console.log('Server is starting at PORT, ', 8080))

