const Link = require('../models/links')
const slugify = require('slugify')

exports.create = (req, res) =>{
    const {title,url,categories, type, medium} = req.body
    // console.table({title,url,categories});
    const slug = url
    let link = new Link({title,url,categories, type, medium, slug})
    link.postedBy = req.user._id
    let arrayOfCategories = categories && categories.split(",")
    link.categories =  arrayOfCategories

    link.save((err,data)=>{
        if(err){
            return res.status(400).json({
                error: 'Link already exist'
            })
        }
        res.json(data)
    })
}

exports.list = (req, res) =>{
    Link.find({}).exec((err,data)=>{
        if(err){
            return res.status(400).json({
                error: 'Could not list links'
            })
        }
        res.json(data)
    })
}

exports.read = (req, res) =>{

}

exports.update = (req, res) =>{

}

exports.remove = (req, res) =>{

}