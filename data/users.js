import bcrypt from "bcrypt";
import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import { users } from "../config/mongoCollection.js";
import {
  firstNameChecking,
  lastNameChecking,
  validateUserId,
  validatePassword,
  validateEmail,
} from "../tasks/form_validation_helpers.js";

const db = await dbConnection();
const userCol = await users();
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
      return { boolean: true };
    } else {
      return { boolean: false, error: "Cannot add user" };
    }
  } catch (error) {
    return { boolean: false, error: `Something went wrong ${error}` };
  }
}

export async function signIn(userId, password) {
  try {
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
