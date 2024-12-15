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
  const questionId = new ObjectId();
  let inputObj = {
    userId: userId,
    questions: [
      {
        questionId,
        title: title,
        description: description,
        meTooCount: 0,
        courseCode: courseCode,
        createdAt: createdAt,
      },
    ],
  };
  let checkIfUserExists = await qCol.findOne({ userId });
  if (!checkIfUserExists) {
    let result = await qCol.insertOne(inputObj);
    if (result.acknowledged) {
      return { boolean: true, questionId };
    } else {
      return { boolean: false, error: "Could not add the question" };
    }
  } else {
    let result = await qCol.updateOne(
      { userId: userId },
      { $push: { questions: inputObj.questions[0] } }
    );
    if (result.acknowledged && result.modifiedCount === 1) {
      return { boolean: true, questionId };
    } else {
      return { boolean: false, error: "Could not add the questions" };
    }
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

export async function updateMeToo(userId, questionId, func) {
  try {
    let result;
    let likedQuestionUpdate;
    if (func === "inc") {
      result = await qCol.updateOne(
        {
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
        return {
          boolean: true,
          status: 200,
          message: "Question deleted successfully",
        };
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
    // let answersList = [];
    questionId = ObjectId.createFromHexString(questionId);
    let checkIfUserAskedTheQuestion = await qCol.findOne({
      userId: userId,
      questions: { $elemMatch: { questionId: questionId } },
    });
    if (checkIfUserAskedTheQuestion) {
      let result = await qCol
        .find({
          userId: userId,
          answers: { $elemMatch: { questionId: questionId } },
        })
        .toArray();
      const answers = result[0].answers;
      for (let answer of answers) {
        answer.answerId = answer.answerId.toString();
        answer.questionId = answer.questionId.toString();
      }
      const outputData = {
        userId: result[0].userId,
        answers,
      };
      if (result.length !== 0) {
        return { boolean: true, status: 200, data: outputData };
      } else {
        return { boolean: false, status: 404, error: "No answers found" };
      }
    } else {
      console.log("question not found");
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

export async function removeLikedAnswer(userId, answerId, quesitonId) {
  try {
    let result = await qCol.updateOne(
      {
        userId: userId,
      },
      { $pull: { likedAnswers: { answerId, quesitonId } } }
    );
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

export async function updateLike(userId, answerId, questionId, func) {
  try {
    let result;
    let likedAnswerUpdate;
    if (func === "inc") {
      result = await qCol.updateOne(
        {
          answers: {
            $elemMatch: {
              answerId: ObjectId.createFromHexString(answerId),
              questionId: ObjectId.createFromHexString(questionId),
            },
          },
        },
        { $inc: { "answers.$.likes": 1 } }
      );
      console.log("inc", result);
      likedAnswerUpdate = await addLikedAnswers(userId, answerId, questionId);
      // if (!result) {
      //   return { boolean: false, error: "Could not update likes" };
      // }
      // if (
      //   result.acknowledged &&
      //   result.modifiedCount === 1 &&
      //   result.matchedCount === 1 &&
      //   likedQuestionUpdate
      // ) {
      //   return { boolean: true };
      // } else {
      //   return { boolean: false, error: "Could not update likes" };
      // }
    } else if (func === "dec") {
      result = await qCol.updateOne(
        {
          answers: {
            $elemMatch: {
              answerId: ObjectId.createFromHexString(answerId),
              questionId: ObjectId.createFromHexString(questionId),
            },
          },
        },
        { $inc: { "answers.$.likes": -1 } }
      );
      console.log("dec", result);
      likedQuestionUpdate = await removeLikedAnswer(userId, questionId);
    }
    if (!result) {
      return { boolean: false, error: "Could not update likes" };
    }
    if (
      result.acknowledged &&
      result.modifiedCount === 1 &&
      result.matchedCount === 1 &&
      likedQuestionUpdate
    ) {
      return { boolean: true };
    } else {
      return { boolean: false, error: "Could not update likes" };
    }
  } catch (error) {
    return { boolean: false, error: `Something went wrong ${error}` };
  }
}
