const express = require('express');
const app = express();
const cors = require('cors')
const sendMail = require('./mail')
const path = require('path')


const PORT = process.env.PORT || 8080; 

app.use(cors())
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post('/email', (req, res) => {
    //TODO
    //send email here
    console.log(req.body)
    res.json({ message: 'Message received!!' })
});


app.listen (PORT, () => console.log('Server is starting at PORT, ', 8080))

