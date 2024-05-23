const multer = require('multer');
const upload = multer();


checkFile = (req) => {
    if (!req.files.length && !req.body.image)
        return false;
    return true;
}

checkMimeType = (files) => {
    let mimeTypeValidation = true;
    files.forEach(file => {
        if (!(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/gif' || file.mimetype === 'image/webp'))
            mimeTypeValidation = false;
    })
    return mimeTypeValidation;
}



module.exports.upload = async (req, res, next) => {
    try {
        // check file
        if (!checkFile(req))
            return res.status(400).json({ message: "No image provided" })

        // check mimeType
        if (!checkMimeType(req.files))
            return res.status(400).json({ message: "invalid file type" })

        upload.single('image') 
        next();
    }
    catch (e) {
        res.status(400).json(e)
    }
}