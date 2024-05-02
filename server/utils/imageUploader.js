const cloudinary = require("cloudinary").v2;

exports.uploadImageToCloudinary = async (
  file,
  folder,
  resourceType,
  height,
  quality
) => {
  const options = { folder };

  if (height) {
    options.height = height;
  }
  if (quality) {
    options.quality = quality;
  }
  options.resource_type = resourceType || "auto"; // Default to "auto" if not specified

  return await cloudinary.uploader.upload(file.tempFilePath, options);
};
