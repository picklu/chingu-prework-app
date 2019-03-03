const books = require('../models/books');

const controller = {};

controller.getBooks = (req, res, next) => {
    books.find({})
        .then(data => res.json(data))
        .catch(next);
};

controller.addBooks = (req, res, next) => {
    if (req.body.book) {
    books.create(req.body)
        .then(data => res.json(data))
        .catch(next);
    } else {
        res.json({
            error: "The field was empty"
        });
    }
};

controller.resetBooks = (req, res, next) => {
    books.deleteMany({})
        .then(data => res.json(data))
        .catch(next);    
};

module.exports = controller;