const Category  = require('../models/category')
const slugify = require('slugify')
const formidable = require('formidable')
const AWS = require('aws-sdk')
const uuidv4 = require('uuid/v4')
const fs = require('fs')

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKeyId: process.env.AWS_SECRET_ACCESS_KEY_ID,
    region: process.env.AWS_REGION
})

exports.create = (req, res) =>{

    let form = new formidable.IncomingForm()
    form.parse(req, (err, fields, files)=>{
        if(err){
            console.log(err);
            return res.status(400).json({
                error: "Image could not upload"
            })
        }
        const {name, content} = fields
        const {image} = files

        const slug = slugify(name)

        let category = new Category({name,content,slug})

        if(image.size > 2000000){
            return res.status(400).json({
                error: "Image should be less than 2mb"
            })
        }

        const params = {
            Bucket: 'hacker-sanju',
            Key: `category/${uuidv4()}`,
            Body: fs.readFileSync(image.path),
            ACL: 'public-read',
            ContentType: `image/jpg`
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

    })

    // const {name, content} = req.body

    // const image = {
    //     url :`https://via.placeholder.com/150.png?text=${process.env.CLIENT_URL}`,
    //     key :'123'
    // }

    // const category = new Category({slug,image,name})

    // category.postedBy = req.user._id
} 

exports.read = (req, res) =>{

}

exports.update = (req, res) =>{

}

exports.list = (req, res) =>{

}

exports.remove = (req, res) =>{

}