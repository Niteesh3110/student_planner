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
  console.log(inputObj);
  let result = await qCol.insertOne(inputObj);
  console.log(result);
  if (result.acknowledged) {
    return { boolean: true, questionId };
  } else {
    return { boolean: false, error: "Could not add the question" };
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
    console.log(response);
    if (response) {
      return { boolean: true, response: response };
    } else {
      return { boolean: false, error: "Could not get questions" };
    }
  } catch (error) {
    return { boolean: false, error: `Something went wrong ${error}` };
  }
}
