const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const mongoose = require('mongoose');
const routes = require('./routes/routes');
const path = require('path');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Connect to the database
const authData = {
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    useNewUrlParser: true
};

mongoose.connect(
    process.env.DB_HOST,
    authData,
    err => {
        if (!err) {
            console.log("Successfully connected to the MongoDB");
        } else {
            console.log("Error in MongoDB connection: " + JSON.stringify(err, undefined, 2));
        }
    }
);

// Set default helmet
app.use(helmet());

//  Pase incoming request bodies in a middleware
app.use(bodyParser.json());

// Set the static path
app.use('/static', express.static(path.join(__dirname, '../client/static')));

// Set the routes
app.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

// Set the api routes
app.use('/api', routes);

app.use((req, res, next) => {
    res.status(404);

    if (req.accepts('html')) {
        res.render('404', { url: req.url });
    }

    if (req.accepts('json')) {
        res.send({ erro: 'Not found!' });
    }

    res.type('txt').send('Not found!');
});

app.use((err, req, res, next) => {
    console.log(err);
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});