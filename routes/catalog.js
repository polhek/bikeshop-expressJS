var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
  res.render('index', { title: 'Welcome to the tailwind' });
});

module.exports = router;
