import multer from "multer";

const storageForBeautifulEyewearCollection = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./src/uploads/ui");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const storageForGender = multer.diskStorage({
  destination: function (req, file, cb) {
    // console.log(file,"@222222weqwe");
    cb(null, "./src/uploads/filterProduct/gender");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export const uploadForGender = multer({
  storage: storageForGender,
});

const storageForCategory = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./src/uploads/filterProduct/category");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export const uploadForCategry = multer({
  storage: storageForCategory,
});

const storage = multer.diskStorage({
// console.log(req.files);
  destination: function (req, file, cb) {
    // console.log(file,"@222222weqwe");
    cb(null, "./src/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export const upload = multer({
  storage: storage,
});

const storageOfBestSeller = multer.diskStorage({
  destination: function (req, file, cb) {
    // console.log(file,"@222222weqwe");
    cb(null, "./src/uploads/bestSeller");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export const uploadOfBestSeller = multer({
  storage: storageOfBestSeller,
});

const storageOfFilterProductCategory = multer.diskStorage({
  destination: function (req, file, cb) {
    // console.log(file,"@222222weqwe");
    cb(null, "./src/uploads/category");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export const uploadOfFilterProductCategory = multer({
  storage: storageOfFilterProductCategory,
});

export const uploadOfBeautifulCollection = multer({
  storage: storageForBeautifulEyewearCollection,
});



const educationCertificatestorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/uploads/educationCertificate/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export const educationImage = multer({
  storage: educationCertificatestorage,
});



const storageForFooter = multer.diskStorage({
  destination: function (req, file, cb) {
    // console.log(req.body, "req.bodyyyyyyyyyyyyyyyyy");
    // console.log(req.files, "req.filesllssl");
    // console.log(file,"@222222weqwe");
    cb(null, "./src/uploads/footer/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export const uploadForFooter = multer({
  storage: storageForFooter,
});

const storageForFooter2 = multer.diskStorage({
  destination: function (req, file, cb) {
    // console.log(file,"@222222weqwe");
    console.log(req.files,"req.filessss");
    cb(null, "./src/uploads/footer/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export const uploadForFooter2 = multer({
  storage: storageForFooter2,
});