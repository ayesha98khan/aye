const { uploadBuffer, hasCloudinaryConfig } = require('./uploader');

async function uploadToCloudinary(buffer, folder, resource_type = 'image', options = {}) {
  return uploadBuffer(buffer, {
    folder,
    resourceType: resource_type,
    originalName: options.originalName || '',
    mimeType: options.mimeType || '',
  });
}

module.exports = { uploadToCloudinary, hasCloudinaryConfig, uploadBuffer };
