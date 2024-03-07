const express = require("express");
const router = express.Router();
const { aviatortest } = require("../controller/Aviator/aviator");
const { loginFun } = require("../controller/Aviator/login");



// aviator game api's
router.get('/testdata',aviatortest)
router.post('/login',loginFun)

module.exports = router;
