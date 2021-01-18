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
    check('categories')
    .isLength({min:6})
    .withMessage('Pick at least one category'),
];

exports.userLoginValidator = [
     check('email')
    .isEmail()
    .withMessage('Must be valid email'),
    check('password')
    .isLength({min:6})
    .withMessage('Password must be at least 6 digit'),
];

exports.forgotPasswordValidator = [
    check('email')
    .isEmail()
    .withMessage('Must be valid email'),
];

exports.restPasswordValidator = [
    check('newPassword')
    .isLength({min:6})
    .withMessage('Password must be at least 6 digit'),
    check('resetPasswordLink')
    .not()
    .isEmpty()
    .withMessage('token is require  '),
];

exports.userUpdateValidator = [
    check('name')
    .not()
    .isEmpty()
    .withMessage('Name is required'),
];
