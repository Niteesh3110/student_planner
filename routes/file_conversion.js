import express from "express";
const router = express.Router();

router.route("/").get(async (req, res) => {
    return res.status(200).render("file_conversion");
  });

export default router;