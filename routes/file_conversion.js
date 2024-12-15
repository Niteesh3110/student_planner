import express from "express";
import {
    listOptions,
    startConversion
} from "../data/file_conversion.js";

const router = express.Router();

router.route("/").get(async (req, res) => {
  return res.status(200).render("file_conversion");
});

router
    .route("/upload")
    .post(async (req, res) => {
        try {
            let currFile = req.files.file;
            let uploadPath = './public/toConvert/' + currFile.name;
            currFile.mv(uploadPath, function(err) {
                if (err)
                    return res.status(400).render("file_conversion", { noFile: true });
            });
            const options = await listOptions(req.files.file);
            if (options.length === 0)
                return res.render("file_conversion", { noOptions: true });
            return res.render("file_conversion", { options, fileName: req.files.file.name, filePath: uploadPath });
        }
        catch (e) {
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
