const { check, validationResult} = require('express-validator')

exports.userRegisterValidator = [
    check('name')
    .not()
    .isEmpty()
    .withMessage('Name is required'),
    check('email')
    .isEmail()
    .withMessage('Must be valid email'),
    check('password')
    .isLength({min:6})
    .withMessage('Password must be at least 6 digit'),
];

exports.userLoginValidator = [
     check('email')
    .isEmail()
    .withMessage('Must be valid email'),
    check('password')
    .isLength({min:6})
    .withMessage('Password must be at least 6 digit'),
];