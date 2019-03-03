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

// Set the routes
app.get('/', (req, res, next) => {
    res.send("Hello, Express Route!");
});

// Set the api routes
app.use('/api', routes);

app.use((err, req, res, next) => {
    console.log(err);
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});