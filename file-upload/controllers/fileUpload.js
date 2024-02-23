const File = require("../models/File");
const cloudinary = require("cloudinary").v2;

//localfileupload -> handlerFunction
exports.localFileUpload = async (req, res) => {
  try {
    //fetch file
    const file = req.files.file;
    console.log("file:", file);

    let path =
      __dirname + "/files/" + Date.now() + `.${file.name.split(".")[1]}`;
    console.log("Path:", path);

    file.mv(path, (err) => {
      console.log(err);
    });

    res.json({
      success: true,
      message: "Local File Uploaded Successfully",
    });
  } catch (error) {
    console.log(error);
  }
};




function isFileTypeSupported(fileType, supportedTypes) {
  return supportedTypes.includes(fileType);
}


async function uploadFileToCloudinary(file, folder, quality) {
  const options = {
    folder,
    resource_type: "auto",
  };

  if (quality) {
    options.quality = quality;
  }

  return await cloudinary.uploader.upload(file.tempFilePath, options);
}

//image upload to cloudinary
exports.imageUpload = async (req, res) => {
  try {
    //data fetch
    const { name, tags, email } = req.body;
    console.log(name, tags, email);

    //get file
    const file = req.files.imageFile;
    console.log(file);

    //validation
    const supportedTypes = ["jpg", "jpeg", "png"];
    const fileType = file.name.split(".")[1].toLowerCase();

    //if filetype not supported
    if (!isFileTypeSupported(fileType, supportedTypes)) {
      return res.status(400).json({
        success: false,
        message: "File format not supported",
      });
    }

    //if filetype supported -> upload to cloudinary
    const response = await uploadFileToCloudinary(file, "FileUploadData"); //folder name is that on a cloudinary
    console.log(response);

    //makee entry in DB
    const fileData = await File.create({
      name,
      tags,
      email,
      imageUrl: response.secure_url,
    });

    res.json({
      success: true,
      message: "Image uploaded successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Image uploading failed",
    });
  }
};

//video uplod handler
exports.videoUpload = async (req, res) => {
  try {
    //fetch data
    const { name, tags, email } = req.body;
    const file = req.files.videoFile;
    console.log(file);

    //validation
    const supportedTypes = ["mp4", "mov"];
    const fileType = file.name.split(".")[1].toLowerCase();
    console.log(fileType);

    //if fileType supported
    if (!isFileTypeSupported(fileType, supportedTypes)) {
      return res.status(400).json({
        success: false,
        message: "File format not supported",
      });
    }

    //if file format supported => uplaod to cloudinary
    const response = await uploadFileToCloudinary(file, "FileUploadData");
    console.log(response);

    res.status(200).json({
      success: true,
      imageUrl: response.secure_url,
      message: "Video uploaded successfully",
    });

    //create db entry
    const fileData = File.create({
      name,
      tags,
      email,
      imageUrl: response.secure_url,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Video uploading failed!",
    });
  }
};




//imageSizeReducer upload
exports.imageSizeReducer = async (req, res) => {
  try {
    const { name, tags, email } = req.body;
    const file = req.files.bigImg;
    console.log(file);

    //validation
    const supportedTypes = ["jpeg", "jpg", "png"];
    const fileType = file.name.split(".")[1].toLowerCase();
    console.log(fileType);

    //if filetype not supported
    if (!isFileTypeSupported(fileType, supportedTypes)) {
      return res.status(400).json({
        success: false,
        message: "File type not supported",
      });
    }

    //if filetype supported -> upload to cloudinary
    const response = await uploadFileToCloudinary(file, "FileUploadData", 10);
    console.log(response);

    res.status(200).json({
        success: true,
        imageUrl: response.secure_url,
        message: "Image uploaded successfully",
      });
  

      //create db entry
      const fileData = File.create({
        name,
        tags,
        email,
        imageUrl: response.secure_url,
      });

    
    } 
    catch (error) {
      console.log(error)
    }
};
