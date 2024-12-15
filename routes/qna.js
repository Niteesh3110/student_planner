import express from "express";
import axios from "axios";
const router = express.Router();
import { getCourseNameAndPrereq } from "../data/academic_planner.js";
import { checkUpdateMeTooInput } from "../tasks/qna_helper.js";
import {
  addQuestionByUserId,
  getQuestionsByUserId,
  getAllQuestions,
  updateMeToo,
  getQuestionsByCourseCode,
  checkIfQuestionLiked,
  deleteQuestion,
  getAnswersByQuestionId,
  addAnswersByUserId,
  checkIfAnswerLiked,
  addLikedAnswers,
} from "../data/qna.js";

router.route("/").get(async (req, res) => {
  try {
    let coursesData = await getCourseNameAndPrereq();
    if (coursesData.boolean) {
      let courses = coursesData.data;
      return res.status(200).render("qna", { courses: courses });
    } else {
      return res.status(200).render("qna");
    }
  } catch (error) {
    return res.status(500).render("error");
  }
});

router.route("/questions/:courseCode/:courseName").get(async (req, res) => {
  try {
    // const response = await axios.get("http://localhost:3000/qna/questions/get");
    let courseCodeDisplay = req.params.courseCode;
    let courseNameDisplay = req.params.courseName;
    const result = await getQuestionsByCourseCode(courseCodeDisplay);
    if (result.boolean) {
      let questionData = result.data;
      let courseDisplay = {
        courseCodeDisplay: courseCodeDisplay,
        courseNameDisplay: courseNameDisplay,
      };
      let coursesData = await getCourseNameAndPrereq();
      if (coursesData.boolean) {
        return res.status(200).render("qnaCourseQuestions", {
          courseDisplay: courseDisplay,
          coursesData: coursesData.data,
          questionsData: questionData,
        });
      }
    } else {
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
    }
  } catch (error) {
    console.error(error);
  }
});

router.route("/questions/post").post(async (req, res) => {
  try {
    let { userId, title, description, courseCode, createdAt } = req.body; // TEMP USER ID
    let response = await addQuestionByUserId(
      userId,
      title,
      description,
      courseCode,
      createdAt
    );
    if (response.boolean) {
      return res
        .status(200)
        .json({ boolean: response.boolean, questionId: response.questionId });
    } else {
      return res
        .status(200)
        .json({ boolean: response.boolean, error: response.error });
    }
  } catch (error) {
    return res.status(500).json({
      boolean: false,
      error: `Something went wrong ${error}`,
    });
  }
});

router.route("/questions/get").get(async (req, res) => {
  try {
    let response = await getAllQuestions();
    console.log(response);
    if (response.boolean) {
      return res
        .status(200)
        .json({ boolean: response.boolean, data: response });
    } else {
      return res
        .status(200)
        .json({ boolean: response.boolean, data: response });
    }
  } catch (error) {
    return res.status(500).json({
      boolean: false,
      error: `Something went wrong in /questions/get route ${error}`,
    });
  }
});

router.route("/questions/meToo/:func/:questionId").patch(async (req, res) => {
  try {
    const questionId = req.params.questionId.trim();
    const func = req.params.func.trim();
    let userId = req.session.user.userId;
    await checkUpdateMeTooInput(questionId, func);
    const result = await updateMeToo(userId, questionId, func);
    if (result.boolean) {
      return res.status(200).json({ boolean: true, message: "meTooUpdated" });
    } else {
      return res.status(200).json({ boolean: false, error: result.error });
    }
  } catch (error) {
    console.error("route error", error);
    return res.status(500).json({
      boolean: false,
      error: `Something went wrong in updating meToo ${error}`,
    });
  }
});

router
  .route("/questions/meToo/checkMeTooState/:questionId")
  .get(async (req, res) => {
    try {
      const questionId = req.params.questionId.trim();
      if (!questionId) throw { status: 400, error: "Invalid questionId" };
      const userId = req.session.user.userId;
      const result = await checkIfQuestionLiked(userId, questionId);
      // res.locals.isMeToo = result ? "active" : "";
      // console.log(res.locals.isMeToo);
      return res.status(200).json({ boolean: result });
    } catch (error) {
      if (error.error)
        return res.status(500).json({ boolean: false, error: error.error });
      return res
        .status(500)
        .json({ boolean: false, error: `Something went wrong: ${error}` });
    }
  });

router.route("/questions/delete/:questionId").delete(async (req, res) => {
  try {
    const questionId = req.params.questionId;
    if (!questionId)
      return res.status(400).json({ error: "Invalid quesitonId" });
    const userId = req.session.user.userId;
    let deleted = await deleteQuestion(userId, questionId);
    if (deleted.boolean) {
      return res.status(deleted.status).json({ boolean: true });
    } else {
      return res
        .status(deleted.status)
        .json({ boolean: false, error: deleted.error });
    }
  } catch (error) {
    return res.status(500).json({ error: `Something went wrong ${error}` });
  }
});

// Answers route
router.route("/ans/:questionId/:questionUserId").get(async (req, res) => {
  let { questionId, questionUserId } = req.params;
  if (!questionId || !questionUserId)
    return res
      .status(400)
      .json({ error: "QuestionId or QuestionUserId not passed" });
  if (typeof questionId !== "string" || typeof questionUserId !== "string")
    return res
      .status(400)
      .json({ error: "Invalid questionId or questionUserId" });
  questionId = questionId.trim();
  questionUserId = questionUserId.trim();
  let answersData = await getAnswersByQuestionId(questionUserId, questionId);
  let questionData = await getQuestionsByUserId(questionUserId, questionId);
  const answers = answersData.data;
  const questions = questionData.data;
  questions.questionUserId = questionUserId;
  console.log(answers);
  const inputObj = { answersData: answers, questions };
  console.log(inputObj);
  return res.status(200).render("qnaCoursesAnswers", inputObj);
});

router.route("/ans/post").post(async (req, res) => {
  try {
    let { questionId, answer, createdAt } = req.body;
    if (!questionId || !answer || !createdAt) {
      res.status(400).json({ error: "Invalid input passed" });
    }
    const userId = req.session.user.userId; //TEMP USER ID
    let result = await addAnswersByUserId(
      userId,
      questionId,
      answer,
      createdAt
    );
    if (result.boolean) {
      return res.status(200).json({ boolean: true });
    } else {
      return res.status(400).json({ boolean: false });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ boolean: false, error: `Something went wrong ${error}` });
  }
});

router
  .route("/ans/CheckLikeState/:questionId/:answerId")
  .get(async (req, res) => {
    try {
      const { questionId, answerId } = req.params;
      if (!questionId || !answerId) {
        return res
          .status(400)
          .json({ boolean: false, error: "Invalid questionId or asnwerId" });
      }
      const userId = req.session.user.userId;
      let result = await checkIfAnswerLiked(userId, answerId, questionId);
      return res.status(200).json({ boolean: result.boolean });
    } catch (error) {
      return res
        .status(500)
        .json({ boolean: false, error: `Something went wrong ${error}` });
    }
  });

router.route("");

export default router;
