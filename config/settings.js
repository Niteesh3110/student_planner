import dotenv from "dotenv";

dotenv.load();

MONGODB_URL = process.env.MONGODB_URL;

export const mongoConfig = {
  serverUrl: MONGODB_URL,
  database: "student_planner",
};
