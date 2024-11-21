import dotenv from "dotenv";

dotenv.config({ path: "/Users/nits/Desktop/student_planner/.env" });

const mongoUrl = process.env.MONGODB_URL;

export const mongoConfig = {
  serverUrl: mongoUrl,
  database: "student_planner",
};
