import bcrypt from "bcryptjs";
import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import { users, tree, questions } from "../config/mongoCollection.js";
import {
  firstNameChecking,
  lastNameChecking,
  validateUserId,
  validatePassword,
  validateEmail,
} from "../tasks/form_validation_helpers.js";

const db = await dbConnection();
const userCol = await users();
const treeCol = await tree();
const qCol = await questions();
const saltRounds = 16;

export async function getUserByUserId(userId) {
  try {
    await validateUserId(userId);
    let result = await userCol.findOne({ userId: userId });
    if (result) {
      return { boolean: true, data: result };
    } else {
      return { boolean: false, error: "User not found" };
    }
  } catch (error) {
    return { boolean: false, error: `Something went wrong ${error}` };
  }
}

export async function addUser(firstName, lastName, userId, password, email) {
  try {
    await firstNameChecking(firstName);
    await lastNameChecking(lastName);
    await validateUserId(userId);
    await validatePassword(password);
    await validateEmail(email);
    password = await bcrypt.hash(password, saltRounds);
    userId = userId.toLowerCase();
    const inputObj = {
      firstName,
      lastName,
      userId,
      password,
      email,
      role: "user",
    };
    let result = await userCol.insertOne(inputObj);
    if (result.acknowledged) {
      let initUserResult = await initUser(userId);
      if (initUserResult.boolean) {
        return { boolean: true };
      } else {
        return { boolean: false, error: initUser.error };
      }
    } else {
      return { boolean: false, error: "Cannot add user" };
    }
  } catch (error) {
    return { boolean: false, error: `Something went wrong ${error}` };
  }
}

export async function signIn(userId, password) {
  try {
    await validateUserId(userId);
    await validatePassword(password);
    userId = userId.trim().toLowerCase();
    const result = await getUserByUserId(userId);
    if (result.boolean) {
      const userData = result.data;
      const userPassword = userData.password;
      if (!(await bcrypt.compare(password, userPassword))) {
        return { boolean: false, error: "User name or password invalid" };
      } else {
        return { boolean: true, data: userData };
      }
    }
  } catch (error) {
    if (!error.boolean)
      return { boolean: false, error: `Something went wrong ${error.error}` };
    throw { error: `Something went wrong: Internal Server Error ${error}` };
  }
}

export async function initializeUserTree(userId) {
  try {
    await validateUserId(userId);
    const inputObj = { userId, tree: { name: "CS", children: [] } };
    let result = await treeCol.insertOne(inputObj);
    console.log("initTree", result);
    if (result.acknowledged) {
      return { boolean: true, status: 200 };
    } else {
      return { boolean: false, status: 400, error: "Could not add user tree" };
    }
  } catch (error) {
    return {
      boolean: false,
      status: 500,
      error: `Something went wrong ${error}`,
    };
  }
}

export async function initializeQuestionDoc(userId) {
  try {
    let checkIfUserSignedUp = await userCol.findOne({ userId });
    if (!checkIfUserSignedUp) {
      return { boolean: false, status: 400, error: "Unauthorized" };
    }
    if (!userId || typeof userId !== "string") {
      if (userId.trim().length === 0) {
        return { boolean: false, status: 400, error: "Invalid Input" };
      }
    }
    let inputObj = {
      userId,
      questions: [],
      likedQuestions: [],
      answers: [],
      likedAnswers: [],
    };
    const result = await qCol.insertOne(inputObj);
    console.log("initQues", result);
    if (result) {
      return { boolean: true, status: 200 };
    } else {
      return { boolean: false, error: "Could not add user" };
    }
  } catch (error) {
    return {
      boolean: false,
      status: 500,
      error: `Something went wrong ${error}`,
    };
  }
}

export async function initUser(userId) {
  let userQuestionInit = await initializeQuestionDoc(userId);
  let userTreeInit = await initializeUserTree(userId);
  console.log("Overall Init", userQuestionInit, userTreeInit);
  if (userQuestionInit.boolean && userTreeInit.boolean) {
    return { boolean: true };
  } else {
    return { boolean: false, error: "Could not init tree or question" };
  }
}
