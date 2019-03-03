const Router = require('express').Router;
const router = new Router();
const controller = require('../controllers/controllers');

router.route('/searched').get(controller.getBooks);

router.route('/add').post(controller.addBooks);

router.route('/reset').post(controller.resetBooks);

module.exports = router;