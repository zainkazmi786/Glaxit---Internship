const allowedExtensions = ['.png', '.jpg', '.jpeg', '.gif'];

function allowedFile(filename) {
  const ext = filename.substring(filename.lastIndexOf('.')).toLowerCase();
  return allowedExtensions.includes(ext);
}

module.exports = { allowedFile };
