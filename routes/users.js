var express = require('express');
var router = express.Router();
var supabase = require("../database/supabase")

/* GET users listing. */
router.get('/', function(req, res, next) {
  supabase.client
  res.send('respond with a resource');
});

module.exports = router;