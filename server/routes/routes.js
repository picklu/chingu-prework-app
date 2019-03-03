const Router = require('express').Router;
const router = new Router();
const controller = require('../controllers/controllers');

// For test
router.route('/test').get((req, res, next) => {
    res.send("Testing API routes!");
});

// For getting all the books
router.route('/get').get(controller.getBooks);

// For adding a new book
router.route('/add').post(controller.addBooks);

// For resetting the books collection
router.route('/reset').post(controller.resetBooks);

module.exports = router;