const cloudinary = require("cloudinary").v2;

exports.imageUploader = async (file, folder, height, quality) => {
  try {
    if (!file || !file.tempFilePath) {
      throw new Error("Invalid file input");
    }

    const options = { folder, resource_type: "auto" };

    if (height) {
      options.height = height;
      options.crop = "scale";
    }

    if (quality) {
      options.quality = quality;
    }

    const result = await cloudinary.uploader.upload(file.tempFilePath, options);
    return result;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error.message);
    throw new Error(error.message || "Image upload failed");
  }
};
