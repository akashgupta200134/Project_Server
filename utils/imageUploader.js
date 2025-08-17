
const cloudinary = require("cloudinary").v2;

exports.imageUploader = async (file, folder, height, quality) => {
  try {
    const options = { folder };

    if (height) {
      options.height = height;
      options.crop = "scale";
    }

    if (quality) {
      options.quality = quality;
    }

    options.resource_type = "auto"; 

    
    return await cloudinary.uploader.upload(file.tempFilePath, options);

  }
   catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw new Error("Image upload failed");
  }
};
