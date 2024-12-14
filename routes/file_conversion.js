import express from "express";
import multer from "multer";
import { listOptions, startConversion } from "../data/file_conversion.js";

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./public/toConvert");
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
});

const upload = multer({ storage: storage });
const router = express.Router();

router.route("/").get(async (req, res) => {
  return res.status(200).render("file_conversion");
});

router.route("/upload").post(upload.single("file"), async (req, res) => {
  try {
    const options = await listOptions(req.file);
    if (options.length === 0)
      return res.render("file_conversion", { noOptions: true });
    return res.render("file_conversion", {
      options,
      fileName: req.file.originalname,
      filePath: req.file.path,
    });
  } catch (e) {
    return res.status(400).render("file_conversion", { noFile: true });
  }
});

router.route("/convert").post(async (req, res) => {
  try {
    const conversionLink = await startConversion(
      req.body.filePath,
      req.body.option
    );
    return res.render("file_conversion", {
      conversionComplete: true,
      conversionLink,
    });
  } catch (e) {
    return res
      .status(400)
      .render("file_conversion", { conversionIncomplete: true });
  }
});

export default router;
