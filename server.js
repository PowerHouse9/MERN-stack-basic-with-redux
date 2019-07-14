const express = require('express');
//executing the express package
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('config');
// dotenv can also be used to connect to database other than config by entering process.env.DB_CONNECTION
// require('dotenv/config');

//to use it on everytime we hit a request we use middleware like this
// to be able to access it from different domain
app.use(cors());
//need a body parser every time to parse data to json or it will give undefined
// app.use(bodyParser.json());

// now latest express have their own bodyparser
app.use(express.json());

//Import Routes
const tourAPIRoute = require('./routes/api/tour_Packages');
app.use('/api/tour_packages', tourAPIRoute);

const userAPIRoute = require('./routes/api/users');
app.use('/api/users', userAPIRoute);

const authAPIRoute = require('./routes/api/auth');
app.use('/api/auth', authAPIRoute);

const orderAPIRoute = require('./routes/api/order');
app.use('/api/order', orderAPIRoute);

//Middlewares example
//sample
// app.use('/posts', () => {
//     console.log('This is middleware running in posts');
// });

// Route
app.get('/', (req, res) => {
    res.send('we are on Home');
});

//Connecto to DB, taking url from .env file
mongoose.connect(config.get('DB_CONNECTION'), { useNewUrlParser: true, useCreateIndex: true }, () => {
    console.log('Connected to DB !');
})

//How to start listening to the server
app.listen(5000);