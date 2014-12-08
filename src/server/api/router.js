var express = require('express');
var router = express.Router();

router.use('/user', require('./user.authentication'));
router.use('/user', require('./user'));
router.use('/page', require('./page'));

module.exports = router;