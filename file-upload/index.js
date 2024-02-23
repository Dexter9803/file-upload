//app creation
const express = require("express")
const app = express()

//port from the env file
require("dotenv").config()
const port = process.env.PORT

//middleware add
app.use(express.json())
//package for file interaction
const fileupload = require("express-fileupload")
app.use(fileupload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}))       //(middleware)

//connection with db
const db = require("./config/database")
db.connect()

//cloud connection
const cloudinary = require("./config/cloudinary")
cloudinary.cloudinaryConnect()

//api route mounting
const Upload = require("./routes/FileUpload")
app.use("/api/v1/upload", Upload)

//activate server
app.listen(port, () => {
    console.log(`App is running at port ${port}`)
})
