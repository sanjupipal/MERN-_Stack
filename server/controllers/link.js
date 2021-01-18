const Link = require('../models/links')
const slugify = require('slugify')

exports.create = (req, res) =>{
    const {title,url,categories, type, medium} = req.body
    // console.table({title,url,categories});
    const slug = url
    let link = new Link({title,url,categories, type, medium, slug})
    link.postedBy = req.user._id
    
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

exports.clickCount = (req, res) =>{
    const {linkId} = req.body
    Link.findByIdAndUpdate(linkId,{$inc: {clicks: 1}}, {new: true, upsert: true}).exec((err, result) =>{
        if(err){
            return res.status(400).json({
                error: 'Could not update view count'
            })
        }
        res.json(result)
    })
}

exports.read = (req, res) =>{
    const {id} = req.params
    Link.findOne({_id: id}).exec((err, data)=>{
        if(err){
            return res.status(400).json({
                error: 'Error finding link'
            })
        }
        res.json(data)
    })
}

exports.update = (req, res) =>{
    const {id} = req.params
    const {title, url ,categories, type, medium} = req.body 
    const updatedLink = {title, url ,categories, type, medium}
    Link.findOneAndUpdate({_id: id},updatedLink, {new:true}).exec((err, updated)=>{
        if(err){
            return res.status(400).json({
                error: 'Error updating link'
            })
        }
        res.json(updated)
    })
}

exports.remove = (req, res) =>{
    const {id} = req.params
    Link.findOneAndRemove({_id: id}).exec((err, data)=>{
        if(err){
            return res.status(400).json({
                error: 'Error removing link'
            })
        }
        res.json({
            message: 'Link removed successfully'
        })
    })
}