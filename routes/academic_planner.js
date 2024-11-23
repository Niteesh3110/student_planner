import express from "express";
const router = express.Router();
import {
  getCourseByCourseCode,
  getCourseNameAndPrereq,
  getUserTree,
} from "../data/academic_planner.js";

router.route("/").get(async (req, res) => {
  return res.status(200).render("academic_planner");
});

router.route("/addCourse/:courseCode").get(async (req, res) => {
  try {
    let courseCode = req.params.courseCode;
    let courseData = await getCourseByCourseCode(courseCode);
    if (courseData.boolean) {
      res.status(200).json(courseData);
    } else {
      res.status(400).json({ error: courseData.error });
    }
  } catch (error) {
    res.status(500).json({ error: `Something went wrong ${error}` });
  }
});

router.route("/getCourse").get(async (req, res) => {
  try {
    let courses = await getCourseNameAndPrereq();
    if (courses.boolean) {
      res.status(200).json(courses);
    } else {
      res.status(400).json({ error: courses.error });
    }
  } catch (error) {
    res.status(500).json({ error: `Something went wrong ${error}` });
  }
});

router.route("/getTree/:userId").get(async (req, res) => {
  try {
    let userId = req.params.userId;
    let result = await getUserTree(userId);
    if (result.boolean) {
      return res.status(200).json(result.data);
    } else {
      return res.status(400).json({ error: `Tree not found` });
    }
  } catch (error) {
    res.status(500).json({ error: `Something went wrong ${error}` });
  }
});

export default router;
