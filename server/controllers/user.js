const User = require('../models/user')
const Link = require('../models/links')
exports.read = (req, res) =>{
    User.findOne({_id: req.user._id}).exec((err, user)=>{
        if(err){
            return req.status(400).json({
                error: "User not found"
            })
        }
        Link.find({postedBy: user})
        .populate('categories','name slug')
        .populate('postedBy','name')
        .sort({createdAt: -1})
        .exec((err,links)=>{
            if(err){
                console.log(err);
                return req.status(400).json({
                    error: "links not found"
                })
                return
            }
            user.hashed_password = undefined
            user.salt = undefined
            res.json({user, links})
        })
    })
}