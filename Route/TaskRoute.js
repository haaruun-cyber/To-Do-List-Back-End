const { getalltasks, gettaskbyid, gettaskbycategory, createtask, updatetask, deletetask } = require('../Controllers/TaskContrllrs');
const express = require('express');
const router = express.Router();
const Auth = require('./Middleware/Auth.js');

// Routes
router.get('/alltasks', Auth(['user','admin']), getalltasks);
router.get('/gettasksbyid/:id', Auth(['user','admin']), gettaskbyid);
router.get('/alltasks/:category', Auth(['user','admin']), gettaskbycategory);
router.post('/createtask', Auth(['user','admin']), createtask);
router.put('/updatetask/:id', Auth(['user','admin']), updatetask);
router.delete('/deletetask/:id', Auth(['user','admin']), deletetask);

module.exports = router;