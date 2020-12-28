const express = require('express')

const router = express.Router()

const {userRegisterValidator, userLoginValidator, forgotPasswordValidator, restPasswordValidator} = require('../validators/auth')
const {runValidation} = require('../validators')

const {register, registerActivate, login, forgotPassword, restPassword} = require('../controllers/auth')

router.post('/register', userRegisterValidator, runValidation, register)
router.post('/register/activate',registerActivate)

router.post('/login', userLoginValidator, runValidation, login)

router.put('/forgot-password', forgotPasswordValidator, runValidation, forgotPassword)
router.post('/rest-password', restPasswordValidator, runValidation, restPassword)

module.exports = router;