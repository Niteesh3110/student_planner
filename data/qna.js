import mongodb from "mongodb";
import { dbConnection, closeConnection } from "../config/mongoConnection.js";

const db = await dbConnection();

// Question
async function getQuestionsByUserId(userId) {
  // Get Question
}

async function addQuestionByUserId(userId) {
  /*
    {
        _id: ObjectId()
        userId:
        questions: [
                    {
                        questionId: ObjectId(),
                        title: 
                        description: 
                        meTooCount:
                        courseCode: 
                        createdAt: 
                    }
                    ]
    }
*/
}
