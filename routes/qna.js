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

router.route("/ans/:courseCode/:courseName").get(async (req, res) => {
  let courseCodeDisplay = req.params.courseCode;
  let courseNameDisplay = req.params.courseName;
  let courseDisplay = {
    courseCodeDisplay: courseCodeDisplay,
    courseNameDisplay: courseNameDisplay,
  };
  let coursesData = await getCourseNameAndPrereq();
  if (coursesData.boolean) {
    console.log(coursesData.data);
    return res.status(200).render("qnaCourseAnswers", {
      courseDisplay: courseDisplay,
      coursesData: coursesData.data,
    });
  }
});

export default router;
