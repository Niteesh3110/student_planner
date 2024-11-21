import mongodb from "mongodb";
import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import { courses } from "../config/mongoCollection.js";
import { validateCourseCode } from "../tasks/academic_planner_helper.js";

const db = await dbConnection();
const courseCol = await courses();

export async function getCourseByCourseCode(courseCode) {
  try {
    let courseValidation = await validateCourseCode(courseCode);
    if (!courseValidation.boolean) throw { error: courseValidation.error };
    let result = await courseCol.findOne({ courseCode: courseCode });
    if (result && Object.keys(result).length !== 0) {
      result["_id"] = result["_id"].toString();
      return { boolean: true, courseData: result };
    } else {
      throw { boolean: false, error: "course not found" };
    }
  } catch (error) {
    console.error(error);
  }
}

await closeConnection();
