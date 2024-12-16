import mongodb from "mongodb";
import { ObjectId } from "mongodb";
import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import { questions, users } from "../config/mongoCollection.js";

const db = await dbConnection();
const qCol = await questions();
const userCol = await users();

// Question
export async function getQuestionsByUserId(userId, questionId) {
  try {
    questionId = ObjectId.createFromHexString(questionId);
    let result = await qCol.findOne(
      {
        userId: userId,
        "questions.questionId": questionId,
      },
      {
        projection: { "questions.$": 1 },
      }
    );
    let questionData = result.questions[0];
    questionData.questionId = questionData.questionId.toString();
    if (questionData) {
      return { boolean: true, status: 200, data: questionData };
    } else {
      return {
        boolean: false,
        status: 404,
        error: "Could not find the question",
      };
    }
  } catch (error) {
    return {
      boolean: false,
      status: 500,
      error: `Internal Server Error: ${error}`,
    };
  }
}

export async function addQuestionByUserId(
  userId,
  title,
  description,
  courseCode,
  createdAt
) {
  if (!userId || !title || !description || !courseCode || !createdAt) {
    return { boolean: false, status: 400, error: "Invalid Input Passed" };
  }
  userId = userId.trim().toLowerCase();
  console.log(userId, title, description, courseCode, createdAt);
  const questionId = new ObjectId();
  let checkIfUserExists = await qCol.findOne({
    userId: userId,
  });
  if (checkIfUserExists) {
    let result = await qCol.updateOne(
      { userId: userId },
      {
        $push: {
          questions: {
            questionId,
            title: title,
            description: description,
            meTooCount: 0,
            courseCode: courseCode,
            createdAt: createdAt,
          },
        },
      }
    );
    // let result = await qCol.insertOne(inputObj);
    if (result.acknowledged && result.modifiedCount >= 1) {
      return { boolean: true, questionId };
    } else {
      return { boolean: false, error: "Could not add the question" };
    }
  } else {
    return { boolean: false, status: 404, error: "User not found" };
    // let result = await qCol.updateOne(
    //   { userId: userId },
    //   { $push: { questions: inputObj.questions[0] } }
    // );
    // if (result.acknowledged && result.modifiedCount === 1) {
    //   return { boolean: true, questionId };
    // } else {
    //   return { boolean: false, error: "Could not add the questions" };
    // }
  }
}

export async function getAllQuestions() {
  try {
    let response = await qCol
      .find({})
      .project({
        userName: 1,
        questions: 1,
      })
      .toArray();
    for (let qData of response) {
      for (let data of qData.questions) {
        data.questionId = data.questionId.toString();
      }
    }
    if (response) {
      return { boolean: true, response: response };
    } else {
      return { boolean: false, error: "Could not get questions" };
    }
  } catch (error) {
    return { boolean: false, error: `Something went wrong ${error}` };
  }
}

export async function getQuestionsByCourseCode(courseCode) {
  try {
    let resultArray = [];
    let result = await qCol
      .find(
        {
          questions: { $elemMatch: { courseCode: courseCode } },
        },
        { "questions.$": 1 }
      )
      .toArray();
    for (let data of result) {
      for (let questions of data.questions) {
        if (questions.courseCode === courseCode) {
          questions.userId = data.userId;
          questions.questionId === questions.questionId.toString();
          resultArray.push(questions);
        }
      }
    }
    // console.log(resultArray);
    if (result && result.length > 0) {
      return { boolean: true, data: resultArray };
    } else {
      return {
        boolean: false,
        error: `Could not find questions with courseCode ${courseCode}`,
      };
    }
  } catch (error) {
    return { boolean: false, error: `Something went wrong ${error}` };
  }
}

export async function checkIfQuestionLiked(userId, questionId) {
  try {
    let result = await qCol.findOne({
      userId: userId,
      likedQuestions: { $in: [questionId] },
    });
    if (result) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    throw { boolean: false, error: `Could not check liked quesiton: ${error}` };
  }
}
export async function addLikedQuestion(userId, questionId) {
  try {
    if (await checkIfQuestionLiked(userId, questionId)) {
      return false;
    }
    let result = await qCol.updateOne(
      { userId: userId },
      { $push: { likedQuestions: questionId } }
    );
    if (
      result.acknowledged &&
      result.modifiedCount === 1 &&
      result.matchedCount === 1
    ) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    throw { boolean: false, error: `Could not add liked quesiton: ${error}` };
  }
}
export async function removeLikedQuestion(userId, questionId) {
  try {
    if (!(await checkIfQuestionLiked(userId, questionId))) {
      return false;
    }
    let result = await qCol.updateOne(
      { userId: userId },
      { $pull: { likedQuestions: questionId } }
    );
    if (
      result.acknowledged &&
      result.modifiedCount === 1 &&
      result.matchedCount === 1
    ) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    throw {
      boolean: false,
      error: `Could not remove liked quesiton: ${error}`,
    };
  }
}

export async function updateMeToo(userId, questionUserId, questionId, func) {
  try {
    console.log(
      `UpdateMeToo DataBase: userId: ${userId}, questionUserId: ${questionUserId}, questionId: ${questionId}, func: ${func}`
    );
    let result;
    let likedQuestionUpdate;
    if (func === "inc") {
      result = await qCol.updateOne(
        {
          userId: questionUserId,
          questions: {
            $elemMatch: {
              questionId: ObjectId.createFromHexString(questionId),
            },
          },
        },
        { $inc: { "questions.$.meTooCount": 1 } }
      );
      console.log("inc", result);
      likedQuestionUpdate = await addLikedQuestion(userId, questionId);
    } else if (func === "dec") {
      result = await qCol.updateOne(
        {
          userId: questionUserId,
          questions: {
            $elemMatch: {
              questionId: ObjectId.createFromHexString(questionId),
            },
          },
        },
        { $inc: { "questions.$.meTooCount": -1 } }
      );
      console.log("dec", result);
      likedQuestionUpdate = await removeLikedQuestion(userId, questionId);
    }
    if (!result) {
      return { boolean: false, error: "Could not update me too" };
    }
    if (
      result.acknowledged &&
      result.modifiedCount === 1 &&
      result.matchedCount === 1 &&
      likedQuestionUpdate
    ) {
      return { boolean: true };
    } else {
      return { boolean: false, error: "Could not update me too" };
    }
  } catch (error) {
    return { boolean: false, error: `Something went wrong ${error}` };
  }
  // if (!result) {
  //   return { boolean: false, error: "Could not update me too" };
  // }
  // if (
  //   result.acknowledged &&
  //   result.modifiedCount === 1 &&
  //   result.matchedCount === 1 &&
  //   likedQuestionUpdate
  // ) {
  //   return { boolean: true };
  // } else {
  //   return { boolean: false, error: "Could not update me too" };
  // }
}

export async function removeLikedQuestionAll(questionId) {
  try {
    if (!questionId || typeof questionId !== "string") {
      return { boolean: false, status: 400, error: "Invalid Input" };
    }
    const result = await qCol.updateMany(
      {
        "likedQuestions.questionId": questionId,
      },
      {
        $pull: {
          likedQuestions: { questionId: questionId },
        },
      }
    );
    if (
      result.acknowledged &&
      result.matchedCount >= 1 &&
      result.modifiedCount >= 1
    ) {
      return { boolean: true, status: 200 };
    } else {
      return {
        boolean: false,
        status: 400,
        error: "Could not remove likedQuestions",
      };
    }
  } catch (error) {
    return {
      boolean: false,
      status: 500,
      error: `Something went wrong ${error}`,
    };
  }
}

export async function deleteQuestion(userId, questionId) {
  try {
    if (
      !questionId ||
      typeof questionId !== "string" ||
      questionId.trim().length === 0
    ) {
      throw { status: 400, error: "Invalid question Id" };
    }
    if (!userId || typeof userId !== "string" || userId.trim().length === 0) {
      throw { status: 400, error: "Invalid userID" };
    }
    questionId = questionId.trim();
    questionId = ObjectId.createFromHexString(questionId);
    let checkIfUserAskedTheQuestion = await qCol.findOne({
      userId: userId,
      questions: { $elemMatch: { questionId: questionId } },
    });

    if (checkIfUserAskedTheQuestion) {
      const result = await qCol.updateOne(
        { userId: userId },
        { $pull: { questions: { questionId } } }
      );
      if (result.acknowledged && result.modifiedCount === 1) {
        let result = await removeLikedQuestionAll(questionId);
        if (result.boolean)
          return {
            boolean: true,
            status: 200,
            message: "Question deleted successfully",
          };
        return result;
      } else {
        return {
          boolean: false,
          status: 400,
          error: "Question deletion unseccessful",
        };
      }
    } else {
      return { boolean: false, status: 404, error: "User not found" };
    }
  } catch (error) {
    console.error(error);
    return {
      boolean: false,
      status: 500,
      error: `Something went wrong ${error}`,
    };
  }
}

// Answer
export async function getAnswersByQuestionId(userId, questionId) {
  try {
    let answersList = [];
    questionId = ObjectId.createFromHexString(questionId);
    let result = await qCol
      .find({
        answers: { $elemMatch: { questionId: questionId } },
      })
      .toArray();
    for (let resultData of result) {
      if (resultData.answers) {
        for (let answerData of resultData.answers) {
          console.log("ans data", answerData);
          answerData.answerId = answerData.answerId.toString();
          answerData.questionId = answerData.questionId.toString();
          answerData.answerUserId = resultData.userId;
          answersList.push(answerData);
        }
      }
    }
    console.log("all answers list", answersList);
    if (result.length !== 0) {
      return { boolean: true, status: 200, data: answersList };
    } else {
      return { boolean: false, status: 404, error: "No answers found" };
    }
  } catch (error) {
    console.error(error);
    return {
      boolean: false,
      status: 500,
      error: `Something went wrong ${error}`,
    };
  }
}

export async function addAnswersByUserId(
  userId,
  questionId,
  answer,
  createdAt
) {
  if (!userId || typeof userId !== "string") {
    return { boolean: false, status: 400, error: "Invalid Input userId" };
  }
  if (!questionId || typeof questionId !== "string") {
    return { boolean: false, status: 400, error: "Invalid Input questionId" };
  }
  if (!answer || typeof answer !== "string") {
    return { boolean: false, status: 400, error: "Invalid Input answer" };
  }
  if (!createdAt || typeof createdAt !== "string") {
    return { boolean: false, status: 400, error: "Invalid Input Created At" };
  }
  try {
    questionId = ObjectId.createFromHexString(questionId);
    const answerId = new ObjectId();
    let result = await qCol.updateOne(
      {
        userId: userId,
      },
      {
        $push: {
          answers: {
            answerId,
            questionId: questionId,
            answer: answer,
            likes: 0,
            createdAt: createdAt,
          },
        },
      }
    );
    if (result.acknowledged && result.modifiedCount === 1) {
      return { boolean: true, status: 200 };
    } else {
      return { boolean: false, status: 400, error: "Could not add answer" };
    }
  } catch (error) {
    console.log(error);
    return {
      boolean: false,
      status: 500,
      error: `Something went wrong ${error}`,
    };
  }
}

export async function checkIfAnswerLiked(userId, answerId, questionId) {
  try {
    let result = await qCol.findOne({
      userId: userId,
      likedAnswers: { $in: [{ answerId, questionId }] },
    });
    if (!result) {
      return { boolean: false, status: 404, error: "No answers found" };
    }
    return { boolean: true, status: 200 };
  } catch (error) {
    return {
      boolean: false,
      status: 500,
      error: `Something went wrong: ${error}`,
    };
  }
}

export async function addLikedAnswers(userId, answerId, questionId) {
  try {
    if (!userId || !answerId || !questionId) {
      return {
        boolean: false,
        status: 400,
        error: "Invalid userID or answerId or questionId",
      };
    }
    const flag = await checkIfAnswerLiked(userId, answerId, questionId).boolean;
    if (flag) {
      return false;
    }
    let result = await qCol.updateOne(
      { userId: userId },
      { $push: { likedAnswers: { answerId, questionId } } }
    );
    if (result.acknowledged && result.modifiedCount == 1) {
      return { boolean: true, status: 200 };
    } else {
      return {
        boolean: false,
        status: 400,
        error: "Could not add answer to liked array",
      };
    }
  } catch (error) {
    return {
      boolean: false,
      status: 500,
      error: `Something went wrong ${error}`,
    };
  }
}

export async function removeLikedAnswer(userId, answerId, questionId) {
  try {
    console.log(userId, answerId, questionId);
    if (!userId || !answerId || !questionId) {
      return { boolean: false, status: 400, error: "Invalid Input" };
    }
    const flag = await checkIfAnswerLiked(userId, answerId, questionId);
    answerId = answerId.toString().trim();
    questionId = questionId.toString().trim();
    if (!flag) {
      return false;
    }
    let result = await qCol.updateOne(
      {
        userId: userId,
      },
      {
        $pull: {
          likedAnswers: {
            answerId,
            questionId,
          },
        },
      }
    );
    console.log("remove liked", result);
    if (
      result.acknowledged &&
      result.modifiedCount === 1 &&
      result.matchedCount === 1
    ) {
      return { boolean: true, status: 200 };
    } else {
      return {
        boolean: false,
        status: 400,
        error: "Could not remove liked answer",
      };
    }
  } catch (error) {
    return {
      boolean: false,
      status: 500,
      error: `Something went wrong ${error}`,
    };
  }
}

export async function updateLike(
  userId,
  answerUserId,
  answerId,
  questionId,
  func
) {
  try {
    let result;
    let likedAnswerUpdate;

    if (func === "inc") {
      result = await qCol.updateOne(
        {
          userId: answerUserId,
          answers: {
            $elemMatch: {
              answerId: ObjectId.createFromHexString(answerId),
              questionId: ObjectId.createFromHexString(questionId),
            },
          },
        },
        { $inc: { "answers.$.likes": 1 } }
      );
      console.log("Increment Result:", result);

      likedAnswerUpdate = await addLikedAnswers(userId, answerId, questionId);
    } else if (func === "dec") {
      result = await qCol.updateOne(
        {
          userId: answerUserId,
          answers: {
            $elemMatch: {
              answerId: ObjectId.createFromHexString(answerId),
              questionId: ObjectId.createFromHexString(questionId),
            },
          },
        },
        { $inc: { "answers.$.likes": -1 } }
      );
      console.log("Decrement Result:", result);

      likedAnswerUpdate = await removeLikedAnswer(userId, answerId, questionId);
      console.log("Liked Answer Update:", likedAnswerUpdate);
    }

    if (!result) {
      return { boolean: false, error: "Could not update likes" };
    }

    if (
      result.acknowledged &&
      result.modifiedCount === 1 &&
      result.matchedCount === 1 &&
      likedAnswerUpdate
    ) {
      return { boolean: true };
    } else {
      return { boolean: false, error: "Could not update likes" };
    }
  } catch (error) {
    return { boolean: false, error: `Something went wrong: ${error}` };
  }
}

export async function removeLikedAnswerAll(answerId) {
  try {
    if (!answerId || typeof answerId !== "string") {
      return { boolean: false, status: 400, error: "Invalid Input" };
    }
    const result = await qCol.updateMany(
      {
        "likedAnswers.answerId": answerId,
      },
      {
        $pull: {
          likedAnswers: { answerId: answerId },
        },
      }
    );
    if (
      result.acknowledged &&
      result.matchedCount >= 1 &&
      result.modifiedCount >= 1
    ) {
      return { boolean: true, status: 200 };
    } else {
      return {
        boolean: false,
        status: 400,
        error: "Could not remove likedAnswers",
      };
    }
  } catch (error) {
    return {
      boolean: false,
      status: 500,
      error: `Something went wrong ${error}`,
    };
  }
}

export async function deleteAnswer(userId, answerId, questionId) {
  try {
    if (
      !questionId ||
      !answerId ||
      typeof questionId !== "string" ||
      typeof answerId !== "string" ||
      questionId.trim().length === 0 ||
      answerId.trim().length === 0
    ) {
      throw { status: 400, error: "Invalid question or answer Id" };
    }
    if (!userId || typeof userId !== "string" || userId.trim().length === 0) {
      throw { status: 400, error: "Invalid userId" };
    }
    questionId = questionId.trim();
    answerId = answerId.trim();
    questionId = ObjectId.createFromHexString(questionId);
    answerId = ObjectId.createFromHexString(answerId);
    let checkIfUserAnswered = await qCol.findOne({
      userId: userId,
      answers: { $elemMatch: { questionId: questionId, answerId: answerId } },
    });

    if (checkIfUserAnswered) {
      const result = await qCol.updateOne(
        { userId: userId },
        { $pull: { answers: { questionId, answerId } } }
      );
      if (result.acknowledged && result.modifiedCount === 1) {
        let result = await removeLikedAnswerAll(answerId);
        if (result.boolean)
          return {
            boolean: true,
            status: 200,
            message: "Question deleted successfully",
          };
        return result;
      } else {
        return {
          boolean: false,
          status: 400,
          error: "Question deletion unseccessful",
        };
      }
    } else {
      return { boolean: false, status: 404, error: "User not found" };
    }
  } catch (error) {
    console.error(error);
    return {
      boolean: false,
      status: 500,
      error: `Something went wrong ${error}`,
    };
  }
}
