const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
});

function hasCloudinaryConfig() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );
}

function ensureUploadsDir(subdir = '') {
  const dir = path.join(process.cwd(), 'uploads', subdir);
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function extFromMime(mimeType = '', fallback = '') {
  const map = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/gif': '.gif',
    'application/pdf': '.pdf',
    'application/msword': '.doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
  };

  if (map[mimeType]) return map[mimeType];
  return fallback || '';
}

function getPublicBaseUrl() {
  return (
    process.env.SERVER_PUBLIC_URL ||
    process.env.RENDER_EXTERNAL_URL ||
    `http://localhost:${process.env.PORT || 5000}`
  );
}

async function saveBufferToLocal(buffer, { folder = 'files', originalName = '', mimeType = '' } = {}) {
  const ext = path.extname(originalName) || extFromMime(mimeType);
  const fileName = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`;
  const dir = ensureUploadsDir(folder);
  const absPath = path.join(dir, fileName);
  await fs.promises.writeFile(absPath, buffer);
  return `${getPublicBaseUrl()}/uploads/${folder}/${fileName}`;
}

async function uploadBuffer(buffer, { folder = 'files', resourceType = 'image', originalName = '', mimeType = '' } = {}) {
  if (!buffer) throw new Error('No file data found');

  if (!hasCloudinaryConfig()) {
    return saveBufferToLocal(buffer, { folder, originalName, mimeType });
  }

  const dataUri = `data:${mimeType || (resourceType === 'raw' ? 'application/octet-stream' : 'image/png')};base64,${buffer.toString('base64')}`;
  const res = await cloudinary.uploader.upload(dataUri, {
    folder,
    resource_type: resourceType,
    use_filename: true,
    unique_filename: true,
  });
  return res.secure_url;
}

module.exports = { uploadBuffer, hasCloudinaryConfig };
