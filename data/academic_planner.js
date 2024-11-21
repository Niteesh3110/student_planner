import mongodb from "mongodb";
import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import { courses } from "../config/mongoCollection.js";

const db = await dbConnection();
const courseCol = await courses();

export async function getCourseByCourseCode(courseCode) {
  try {
    let result = courseCol.findOne({ courseCode: courseCode });
  } catch (error) {}
}
