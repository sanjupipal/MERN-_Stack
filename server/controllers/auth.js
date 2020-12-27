const AWS = require('aws-sdk')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { registerEmailParams } = require('../helpers/email')
const shortId = require('shortid')
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKeyId: process.env.AWS_SECRET_ACCESS_KEY_ID,
    region: process.env.AWS_REGION
})

const ses = new AWS.SES({apiVersion:'2010-12-01'})

exports.register = (req,res)=>{
   
    // console.log('REGISTER CONTROLLER', req.body)
    const {name, email, password} = req.body

    User.findOne({email:email}).exec((err,user)=>{
        if(user){
            console.log(err);
            return res.status(400).json({
                error: 'Email is taken'
            })
        }
        // generate jwt 
        const token = jwt.sign({name,email,password}, process.env.JWT_ACCOUNT_ACTIVATION, {
            expiresIn: '10m'
        })

        //send email
        const params = registerEmailParams(email, token)
        
        const sendEmailOnRegister = ses.sendEmail(params).promise()
    
        sendEmailOnRegister
        .then(data =>{
            console.log('email submitted to ses',data);
            res.json({
                message: `Email has been sent to ${email},Follow the instructions to complete your registration`
            })
        })
        .catch(error =>{
            console.log('ses email on register', error);
            res.json({
                message: `We could not verify your email. please try again`
            })
        })
    
    })

}


exports.registerActivate = (req,res) =>{
    const {token} = req.body
    jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, function(err , decoded){
        if(err){
            return res.status(401).json({
                error: 'Expired link, try again'
            })
        }

        const {name, email, password }  =  jwt.decode(token)
        const username = shortId.generate()

        User.findOne({email}).exec((err, user) =>{
            if(user){
                return res.status(401).json({
                    error: 'email is taken'
                })
            }
            // create new user 
            const newUser = new User({username, name, email, password})
            newUser.schema.method.
                newUser.save((err, result)=>{
                if(err){
                    return res.status(401).json({
                        error: 'Error saving user in database. Try again later'
                    })
                }
                return res.json({
                    message:'Registration success. Please login.'
                })
            })
        })
    })
}