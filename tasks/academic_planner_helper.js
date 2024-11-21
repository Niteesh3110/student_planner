import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import { courses } from "../config/mongoCollection.js";

const db = await dbConnection();
const courseCol = await courses();

export async function validateCourseCode(courseCode) {
  if (!courseCode || typeof courseCode !== "string" || courseCode.trim === "") {
    return { boolean: false, error: "Invalid Course Code" };
  }
  if (courseCode.includes("_")) {
    let courseCodeBreakDownList = courseCode.split("_");
    console.log(courseCodeBreakDownList);
    if (courseCodeBreakDownList[0] !== "CS")
      return { boolean: false, error: "Invalid Course Code" };
    if (
      Number(courseCodeBreakDownList[courseCodeBreakDownList.length - 1]) <
        500 ||
      Number(courseCodeBreakDownList[courseCodeBreakDownList.length - 1] > 700)
    )
      return { boolean: false, error: "Invalid Course Code" };
  }
  return { boolean: true, error: "" };
}

export async function checkCourseExists(courseCode) {
  let checkCourseCode = await validateCourseCode(courseCode);
  if (!checkCourseCode.boolean) return checkCourseCode.error;
  try {
    let result = await courseCol.findOne({ courseCode: courseCode });
    if (!result) {
      return { boolean: false, error: "Course not found" };
    }
    return { boolean: true, course: result };
  } catch (error) {
    return {
      boolean: false,
      error: `Something went wrong when finding course ${error.message}`,
    };
  }
}

console.log(await checkCourseExists("CS_546"));
await closeConnection();
