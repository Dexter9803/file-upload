const mongoose = require("mongoose")
const nodemailer = require("nodemailer")

const fileSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    imageUrl:{
        type:String
    },
    tags:{
        type:String,
    },
    email:{
        type:String,
    }
})


//post middleware -> must declare before model creation
fileSchema.post("save", async function(doc) {
    try {
        //doc contains the data of entry in db
        console.log("Document: ",doc)

        //transporter
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth:{
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            },
        })

        //send a mail
        let info = await transporter.sendMail({
            from: `Dexter` ,
            to: doc.email,
            subject: "New File Uploaded on Cloudinary",
            html: `<h2>Hello user, New file uploaded on cloudinary database</h2> <p><a href=${doc.imageUrl}>Click Here to view</a></p>`
        })
        console.log("INFO: ",info)
    }
    catch(error) {
        console.error(error)
    }
})

module.exports = mongoose.model("File", fileSchema) 