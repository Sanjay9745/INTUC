const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");
const adminAuth = require("../middleware/adminAuth");
const multer = require("multer");
const GalleryStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      // destination is used to specify the path of the directory in which the files have to be stored
      cb(null, "./public/galleryImage");
    },
    filename: function (req, file, cb) {
      // It is the filename that is given to the saved file.
      const uniqueSuffix =Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, `${uniqueSuffix}-${file.originalname}`);
      console.log(`${uniqueSuffix}-${file.originalname}`);
      // console.log(file);
    },
  });
  
  // Configure storage engine instead of dest object.
  const galleryImage = multer({
    storage: GalleryStorage,
    limits: {
      fileSize: 20 * 1024 * 1024, // 20MB in bytes
    },
  });
// router.post('/login',adminController.login);
// router.post('/register',adminController.register);
router.get('/user/:id',adminAuth,adminController.getUser);
router.get('/users',adminAuth,adminController.getAllUsers);    
router.post('/gallery',galleryImage.single('image'),adminController.addGallery);
router.delete('/deleteImage/:id',adminController.deleteImage);

module.exports = router;
