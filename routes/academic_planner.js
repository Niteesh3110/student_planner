import express from "express";
const router = express.Router();
import {
  getCourseByCourseCode,
  getCourseNameAndPrereq,
  getUserTree,
  getAllCorePathCourses,
  addTree,
  checkDuplicate,
  removeCourseTree,
} from "../data/academic_planner.js";

router.route("/").get(async (req, res) => {
  return res.status(200).render("academic_planner");
});

router.route("/getCourse/:courseCode").get(async (req, res) => {
  try {
    let courseCode = req.params.courseCode;
    let courseData = await getCourseByCourseCode(courseCode);
    if (courseData.boolean) {
      res.status(200).json(courseData);
    } else {
      res.status(400).json({ error: courseData.error });
    }
  } catch (error) {
    res.status(500).json({
      boolean: false,
      error: `Something went wrong ${error}`,
    });
  }
});

router.route("/getCourse").get(async (req, res) => {
  try {
    let course = await getCourseNameAndPrereq();
    if (course.boolean) {
      res.status(200).json(course);
    } else {
      res.status(400).json({ error: course.error });
    }
  } catch (error) {
    res.status(500).json({
      boolean: false,
      error: `Something went wrong ${error}`,
    });
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
    res.status(500).json({
      boolean: false,
      error: `Something went wrong ${error}`,
    });
  }
});

router.route("/getCorePathCourses").get(async (req, res) => {
  try {
    let result = await getAllCorePathCourses();
    if (result.boolean) {
      return res.status(200).json(result.data);
    } else {
      return res.status(200).json({ error: result.error });
    }
  } catch (error) {
    res.status(500).json({
      boolean: false,
      error: `Something went wrong ${error}`,
    });
  }
});

router.route("/addTree").put(async (req, res) => {
  try {
    const { userId, tree } = req.body;
    console.log(`UserId: ${userId}`);
    console.log(JSON.stringify(tree));
    if (!userId || !tree) {
      return res
        .status(400)
        .json({ boolean: false, error: "Missing userId or tree" });
    }
    let result = await addTree(userId, tree);
    if (result.boolean) {
      return res.status(200).json({ boolean: result.boolean });
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    return res.status(500).json({
      boolean: false,
      error: `Something went wrong ${error}`,
    });
  }
});

router.route("/checkDuplicate").get(async (req, res) => {
  try {
    const { courseCode, userId } = req.query;
    let result = await checkDuplicate(courseCode, userId);
    if (result.error === "User not found") {
      return res
        .status(404)
        .json({ boolean: result.boolean, message: result.message });
    }
    if (result.boolean) {
      return res
        .status(200)
        .json({ boolean: result.boolean, message: result.message });
    } else {
      return res
        .status(200)
        .json({ boolean: result.boolean, message: result.message });
    }
  } catch (error) {
    return res.status(500).json({
      boolean: false,
      message: `Something went wrong ${error}`,
    });
  }
});

router.route("/deleteCourse").get(async (req, res) => {
  try {
    const { userId, courseCode } = req.query;
    let response = await removeCourseTree(userId, courseCode);
    console.log(response);
    if (response.boolean) {
      return res
        .status(200)
        .json({ boolean: response.boolean, error: response.error });
    } else {
      if (response.error === "Cannot remove course course not found")
        return res.status(404).json({ boolean: false, error: response.error });
      if (response.error === "Course Removal Failed")
        return res.status(400).json({ boolean: false, error: response.error });
      return res.status(500).json({ boolean: false, error: response.error });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ boolean: false, error: `Something went wrong ${error}` });
  }
});

export default router;
