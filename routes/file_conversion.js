import express from "express";
import {
    listOptions,
    startConversion,
    clearDir
} from "../data/file_conversion.js";
import { virusScan } from "../tasks/virus_scanning.js";

const router = express.Router();

router.route("/").get(async (req, res) => {
  return res.status(200).render("file_conversion");
});

router
    .route("/upload")
    .post(async (req, res) => {
        try {
            let currFile = req.files.file;
            let uploadPath = "./public/toConvert/" + currFile.name;
            await clearDir();
            currFile.mv(uploadPath, function(err) {
                if (err)
                  return res.status(400).render("file_conversion", { badUpload: true });
            });
            let checkFile = await virusScan(uploadPath);
            if (!(checkFile.CleanResult)) {
                await clearDir();
                return res.status(400).render("file_conversion", { badFile: true });
            }
            const options = await listOptions(req.files.file);
            if (options.length === 0) {
                await clearDir();
                return res.status(400).render("file_conversion", { noOptions: true });
            }
            return res.status(200).render("file_conversion", { options, fileName: req.files.file.name, filePath: uploadPath });
        }
        catch (e) {
            return res.status(404).render("file_conversion", { noFile: true });
        }
    });

router.route("/convert").post(async (req, res) => {
  try {
    const conversionLink = await startConversion(
      req.body.filePath,
      req.body.option
    );
    await clearDir();
    return res
        .status(200)
        .render("file_conversion", {
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
