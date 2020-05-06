const express = require('express');
const app = express();
const cors = require('cors')
const path = require('path')
const stripe = require('stripe')('sk_live_GNJ2VHpoWt8oSTVgXqqRF4jo');


const PORT = process.env.PORT || 8080; 

app.use(cors())
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static('views'));
app.get('/', (req, res) => res.sendFile(path.resolve(__dirname, 'views', 'index.html')))

app.get('/paysuccess', (req, res) => res.sendFile(path.resolve(__dirname, 'views', 'success.html')))
app.get('/payfailed', (req, res) => res.sendFile(path.resolve(__dirname, 'views', 'payfailed.html')))


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
            receipt_email: email

        });
       
            res.redirect('/paysuccess')
        
    } catch (error) {
        res.redirect('/payfailed')
        console.log(error)
    }
})
 


// const session = await stripe.checkout.sessions.create({
//     payment_method_types: ['card'],
//     line_items: [{
//       name: 'T-shirt',
//       description: 'Comfortable cotton t-shirt',
//       images: ['https://example.com/t-shirt.png'],
//       amount: 1899,
//       currency: 'usd',
//       quantity: 1,
//     }],
//     success_url: 'https://example.com/success?session_id={CHECKOUT_SESSION_ID}',
//     cancel_url: 'https://example.com/cancel',
//   });


app.listen (PORT, () => console.log('Server is starting at PORT, ', 8080))

