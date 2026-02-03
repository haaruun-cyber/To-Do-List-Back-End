const { createuser, loginuser, getallusers} = require('../Controllers/UserContrllrs.js');
const express = require('express');
const router = express.Router();
const Auth = require('./Middleware/Auth.js');

// Routes
router.post('/register', createuser);
router.get('/allusers', Auth(['admin','user']), getallusers);
router.post('/login', loginuser);

module.exports = router;