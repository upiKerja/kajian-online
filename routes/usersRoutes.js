const express = require('express');
const router = express.Router();
const supabase = require("../database/supabase")

/* GET users listing. */
router.get('/', function(req, res, next) {
  supabase.client
  res.send('respond with a resource');
});

module.exports = router;