import express from "express";
const router = express.Router();

router.route("/").get((req, res) => {
  return res.status(200).render("academic_planner");
});

export default router;
