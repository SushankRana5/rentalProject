import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path"; //helps to work safely with files and paths

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//storage//

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let folder = "uploads/others";

        if (file.mimetype.startsWith("image/")) {
            folder = "uploads/images";
        }
        else if (
            file.mimetype === "application/pdf" ||
            file.mimetype === "application/msword" ||
            file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
            folder = "uploads/documents";
        }
        else if (file.mimetype.startsWith("video/")) {
            folder = "uploads/videos";
        }

        // cchecks if the folder exists if not creates the folder //
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
        }

        cb(null, folder);
    },

    filename: (req, file, cb) => {
        const uniqueName = Date.now() + "-";
        cb(null, uniqueName + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

//upload route//

app.post(
    "/upload",
    upload.fields([
        { name: "file1", maxCount: 10 }, // images
        { name: "file2", maxCount: 1 }   // document
    ]),
    (req, res) => {

        const images = req.files.file1 || [];
        const document = req.files.file2?.[0] || null;

        res.status(200).json({
            message: "Files uploaded successfully",

            images: images.map(img => ({
                originalName: img.originalname,
                savedAs: img.filename,
                path: img.path,
                type: img.mimetype
            })),//upload gareyko image store garxa

            document: document
                ? {
                    originalName: document.originalname,
                    savedAs: document.filename,
                    path: document.path,
                    type: document.mimetype
                }
                : null,
            //document xa vani store garxa xaina vani chai null pathaidinxa

            body: req.body
        });
    }
);

//running the server//

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
