import mongodb from "mongodb";
import { ObjectId } from "mongodb";
import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import { questions, users } from "../config/mongoCollection.js";

const db = await dbConnection();
const qCol = await questions();
const userCol = await users();

// Question
async function getQuestionsByUserId(userId) {
  // Get Question
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
    userName: "ABC",
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
          questions.userName = data.userName;
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
      console.log(likedQuestionUpdate);
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
}

export async function deleteQuestion(userId, questionId) {
  try {
    let checkIfUserAskedTheQuestion = await qCol.findOne({
      userId: userId,
      questions: { $elemMatch: { questionId } },
    });
    if (checkIfUserAskedTheQuestion) {
      const result = await qCol.updateOne(
        { userId: userId },
        { $pull: { questions: { questionId } } }
      );
      if (result.acknowledged && result.modifiedCount > 1) {
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
    return {
      boolean: false,
      status: 500,
      error: `Something went wrong ${error}`,
    };
  }
}
