import mongodb from "mongodb";
import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import { courses, tree } from "../config/mongoCollection.js";
import { validateCourseCode } from "../tasks/academic_planner_helper.js";

const db = await dbConnection();
const courseCol = await courses();
const treeCol = await tree();

export async function getCourseByCourseCode(courseCode) {
  try {
    let courseValidation = await validateCourseCode(courseCode);
    if (!courseValidation.boolean) throw { error: courseValidation.error };
    let result = await courseCol.findOne({ courseCode: courseCode });
    if (result && Object.keys(result).length !== 0) {
      result["_id"] = result["_id"].toString();
      return { boolean: true, courseData: result };
    } else {
      return { boolean: false, error: "course not found" };
    }
  } catch (error) {
    console.error(error);
  }
}

export async function getCourseNameAndPrereq() {
  try {
    let result = await courseCol
      .find({})
      .project({ courseCode: 1, courseName: 1, prerequisite: 1 })
      .toArray();
    if (result) {
      return { boolean: true, data: result };
    }
  } catch (error) {
    console.log(error);
  }
}

export async function getUserTree(userID) {
  try {
    let result = await treeCol.findOne({ userID: "123" });
    if (!result) {
      return { boolean: false, error: "User not found" };
    }
    return { boolean: true, data: result };
  } catch (error) {
    return { boolean: false, error: `Something went wrong ${error}` };
  }
}

// console.log(await getCourseByCourseCode("CS_546"));
// console.log(await getCourseNameAndPrereq());
// await closeConnection();
