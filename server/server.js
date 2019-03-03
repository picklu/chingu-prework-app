const express = require('express');
const helmet = require('helmet');

const app = express();

app.use(helmet());

require('dotenv').config();

const port = process.env.PORT || 5000;

app.use((req, res, next) => {
    res.send("Hello, Express!");
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});