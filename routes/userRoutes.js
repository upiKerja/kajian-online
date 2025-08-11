const express = require('express');
const router = express.Router();
const { cache } = require("../middleware/cache");

/* GET user info. */
router.get('/', cache, function(req, res, next) {
  res.send(req.user)
});

module.exports = router;