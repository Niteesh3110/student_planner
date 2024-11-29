import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const mongoUrl = process.env.MONGODB_URL;

export const mongoConfig = {
  serverUrl: mongoUrl,
  database: "student_planner",
};
