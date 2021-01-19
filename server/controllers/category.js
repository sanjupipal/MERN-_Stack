const Category  = require('../models/category')
const Link = require('../models/links')
const slugify = require('slugify')
const formidable = require('formidable')
const AWS = require('aws-sdk')
const { v4: uuidv4 } = require('uuid')
const fs = require('fs')
const category = require('../models/category')

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKeyId: process.env.AWS_SECRET_ACCESS_KEY_ID,
    region: process.env.AWS_REGION
})

exports.create = (req, res) =>{
    const {name, image, content} =  req.body
     
    const base64Data = new Buffer.from(image.replace(/^data:image\/\w+;base64,/,''), 'base64')
    const type = image.split(';')[0].split('/')[1]

    const slug = slugify(name)
    let category = new Category({name,content,slug})

    const params = {
        Bucket: 'hacker-sanju',
        Key: `category/${uuidv4()}.${type}`,
        Body: base64Data,
        ACL: 'public-read',
        ContentEncoding: 'base64',
        ContentType: `image/${type}`
    }

    s3.upload(params, (err, data)=>{
        if(err){
            console.log(err);
            return res.status(400).json({
                error: "Image upload to s3 failed"
            })
        }

        category.image.url = data.Location
        category.image.key = data.Key
        category.postedBy = req.user._id
        // save to db
        category.save((err, success )=>{
            if(err){
                console.log(err);
                return res.status(400).json({
                    error : 'Duplicate category'
                })
            }
            res.json(success );
        })
    })
}



exports.list = (req, res) =>{
    Category.find({}).exec((err, data)=>{
        if(err){
            return res.status(400).json({
                error:'Categories could not load'
            })
        }
        res.json(data)
    })
}

exports.read = (req, res) =>{
    const {slug } = req.params

    let limit = req.body.limit ? parseInt(req.body.limit) : 10
    let skip = req.body.skip ? parseInt(req.body.skip) : 0
    Category.findOne({slug})
        .populate('postedBy', '_id name username ')
        .exec((err, category)=>{
            if(err){
                return res.status(400).json({
                    error: 'could not load category'
                })
            }
            // res.json(category)
            Link.find({categories: category})
            .populate('postedBy', '_id name username')
            .populate('categories', 'name')
            .sort({createdAt: -1})
            .limit(limit)
            .skip(skip)
            .exec((err,links)=>{
                if(err){
                    return res.status(400).json({
                        error: 'could not load links of this category'
                    })
                }
                res.json({category, links})
            })
        })

}

exports.update = (req, res) =>{
    const {slug} = req.params
    const {name , image , content} =req.body

    const base64Data = new Buffer.from(image.replace(/^data:image\/\w+;base64,/,''), 'base64')
    const type = image.split(';')[0].split('/')[1]
    
    Category.findOneAndUpdate({slug}, {name, content}, {new: true}).exec((err, updated)=>{
        if(err){
            return res.status(400).json({
                error: 'could not find category to update'
            })
        }
        if(image){
            const deleteParams ={
                Bucket: 'hacker-sanju',
                Key: `${updated.image.key}`
            }
            s3.deleteObject(deleteParams, (err,data) => {
                if(err){
                    console.log('error during update'.err);
                }else{
                    console.log('update to s3'.data);
                }
            }) 
            const params = {
                Bucket: 'hacker-sanju',
                Key: `category/${uuidv4()}.${type}`,
                Body: base64Data,
                ACL: 'public-read',
                ContentEncoding: 'base64',
                ContentType: `image/${type}`
            }
            s3.upload(params, (err, data)=>{
                if(err){
                    console.log(err);
                    return res.status(400).json({
                        error: "Image upload to s3 failed"
                    })
                }
        
                updated.image.url = data.Location
                updated.image.key = data.Key
                // save to db
                updated.save((err, success )=>{
                    if(err){
                        console.log(err);
                        return res.status(400).json({
                            error : 'Duplicate category'
                        })
                    }
                    res.json(success );
                })
            })
        }else{
            res.json(updated)
        }
    })
}


exports.remove = (req, res) =>{
    const {slug} = req.params
    Category.findOneAndRemove({slug}).exec((err,data)=>{
        if(err){
            return res.status(400).json({
                error: 'could not delete category'
            })
        }

        const deleteParams ={
            Bucket: 'hacker-sanju',
            Key: `${data.image.key}`
        }
        s3.deleteObject(deleteParams, (err,data) => {
            if(err){
                console.log('error during update'.err);
            }else{
                console.log('deleted to s3'.data);
            }
        }) 
        res.json({
            message:'Category deleted Successfully'
        })
    })
}