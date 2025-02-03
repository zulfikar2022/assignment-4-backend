import multer from "multer";
import path from "path";
const allowedExtensions = [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "tiff",
    "tif",
    "bmp",
    "svg",
    "webp",
];
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "temp/"); // Directory where files will be stored
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname); // Naming files
    },
});
const fileFilter = (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase().slice(1);
    if (allowedExtensions.includes(extension)) {
        cb(null, true);
    }
    else {
        cb(new Error(`Unsupported file type: ${extension}`), false);
    }
};
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter,
});
export { upload };
