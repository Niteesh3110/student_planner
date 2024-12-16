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
    } else {
      return { boolean: false, error: "Could not find courses and prereq" };
    }
  } catch (error) {
    console.error(error);
    return { boolean: false, error: `Something went wrong ${error}` };
  }
}

export async function getUserTree(userId) {
  try {
    let result = await treeCol.findOne({ userId }); // TEMP USER
    if (!result) {
      return { boolean: false, error: "User not found" };
    }
    return { boolean: true, data: result };
  } catch (error) {
    return { boolean: false, error: `Something went wrong ${error}` };
  }
}

export async function getAllCorePathCourses() {
  try {
    let result = await courseCol
      .find({
        $or: [{ type: "core" }, { type: "path" }],
      })
      .toArray();
    if (result.length !== 0) {
      return { boolean: true, data: result };
    } else {
      return { boolean: false, error: "Courses not found" };
    }
  } catch (error) {
    return { boolean: false, error: `Something went wrong ${error}` };
  }
}

export async function checkDuplicate(courseCode, userId) {
  try {
    let checkIfTreeExists = await treeCol.findOne({ userId: userId });
    if (!checkIfTreeExists) {
      return { boolean: false, message: "User not found" };
    }
    let checkIfDuplicateExists = await treeCol.findOne({
      userId: userId,
      "tree.children": { $elemMatch: { name: courseCode } },
    });
    if (checkIfDuplicateExists) {
      return { boolean: true, message: "Course Tree Already Exists" };
    } else {
      return { boolean: false, message: "Course Tree Does Not Exists" };
    }
  } catch (error) {
    return { boolean: false, message: `Something went wrong ${error}` };
  }
}

export async function addTree(userId, tree) {
  try {
    // console.log("data file", userId);
    // console.log(JSON.stringify(tree));
    let result = await treeCol.updateOne(
      { userId: userId },
      { $set: { tree: tree } }
    );
    // console.log(result);
    if (result.acknowledged && result.modifiedCount === 1) {
      return { boolean: true };
    } else {
      return { boolean: false, error: "Tree not added" };
    }
  } catch (error) {
    return { boolean: false, error: `Something went wrong ${error}` };
  }
}

export async function removeCourseTree(userId, courseCode) {
  try {
    let checkValueExists = await treeCol.findOne({
      userId: userId,
      "tree.children": { $elemMatch: { name: courseCode } },
    });
    if (!checkValueExists) {
      return { boolean: false, error: "Cannot remove course course not found" };
    }
    let result = await treeCol.updateOne(
      { userId: userId },
      { $pull: { "tree.children": { name: courseCode } } }
    );
    // console.log("Course Remove Callback Data", result);
    if (result.acknowledged && result.modifiedCount === 1) {
      return { boolean: true, error: "Course Removed" };
    } else {
      return { boolean: false, error: "Course Removal Failed" };
    }
  } catch (error) {
    return { boolean: false, error: `Something went wrong ${error}` };
  }
}
// console.log(await getAllCorePathCourses());
// console.log(await getCourseByCourseCode("CS_546"));
// console.log(await getCourseNameAndPrereq());
// await closeConnection();
