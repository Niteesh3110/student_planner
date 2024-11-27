import express from "express";
const router = express.Router();

router.route("/").get(async (req, res) => {
  return res.status(200).render("qna");
});

router.route("/ans/:courseCode").get(async (req, res) => {
  let courseCode = req.params.courseCode;
  console.log(courseCode);
  return res.status(200).render("qnaCourseAnswers", { courseCode: courseCode });
});

export default router;
