import express from "express";
const router = express.Router();
import { getCourseNameAndPrereq } from "../data/academic_planner.js";

router.route("/").get(async (req, res) => {
  let coursesData = await getCourseNameAndPrereq();
  if (coursesData.boolean) {
    let courses = coursesData.data;
    return res.status(200).render("qna", { courses: courses });
  }
});

router.route("/questions/:courseCode/:courseName").get(async (req, res) => {
  let courseCodeDisplay = req.params.courseCode;
  let courseNameDisplay = req.params.courseName;
  let courseDisplay = {
    courseCodeDisplay: courseCodeDisplay,
    courseNameDisplay: courseNameDisplay,
  };
  let coursesData = await getCourseNameAndPrereq();
  if (coursesData.boolean) {
    return res.status(200).render("qnaCourseQuestions", {
      courseDisplay: courseDisplay,
      coursesData: coursesData.data,
    });
  }
});

router.route("/ans").get(async (req, res) => {
  return res.status(200).render("qnaCoursesAnswers");
});

export default router;
