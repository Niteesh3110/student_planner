import mongodb from "mongodb";
import { ObjectId } from "mongodb";
import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import { questions } from "../config/mongoCollection.js";

const db = await dbConnection();
const qCol = await questions();

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

export async function updateMeToo(questionId) {
  try {
    let result = await qCol.updateOne(
      {
        questions: {
          $elemMatch: {
            questionId: ObjectId.createFromHexString(questionId),
          },
        },
      },
      { $inc: { "questions.$.meTooCount": 1 } }
    );
    if (
      result.acknowledged &&
      result.modifiedCount === 1 &&
      result.matchedCount === 1
    ) {
      return { boolean: true };
    } else {
      return { boolean: false, error: "Could not update me too" };
    }
  } catch (error) {
    return { boolean: false, error: `Something went wrong ${error}` };
  }
}
