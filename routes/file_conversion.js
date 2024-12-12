import express from "express";
import multer from "multer";
import {
    makeAPIRequest,
    startConversion
} from "../data/file_conversion.js";
const upload = multer({ dest: "./public/toConvert" });
const router = express.Router();

router
    .route("/")
    .get(async (req, res) => {
        return res.status(200).render("file_conversion");
    });

router
    .route("/upload")
    .post(upload.single("file"), async (req, res) => {
        try {
            //return res.json({ message: 'File uploaded successfully', filename: req.file});
            return res.json(await startConversion(await makeAPIRequest(), req.file));
        }
        catch (e) {
            return res.status(400).json("No file uploaded");
        }
    });

export default router;