import "mongodb";
import { dbConnection, closeConnection } from "../config/mongoConnection.js";

const db = await dbConnection();

courses = [
  {
    courseCode: "CS_501",
    courseName: "Introduction to JAVA Programming",
    prerequisite: [],
    type: "path",
  },
  {
    courseCode: "CS_570",
    courseName: "Intro to Programming, Data Structures & Algo",
    prerequisite: [],
    type: "path",
  },
  {
    courseCode: "CS_515",
    courseName: "Fundamentals of Computing",
    prerequisite: [],
    type: "path",
  },
  {
    courseCode: "CS_590",
    courseName: "Algorithms",
    prerequisite: [],
    type: "path",
  },
  {
    courseCode: "CS_546",
    courseName: "Web Programming",
    prerequisite: ["CS_590"],
    type: "core",
  },
  {
    courseCode: "CS_522",
    courseName: "Mobile Systems and Applications",
    prerequisite: ["CS_385", "CS_590"],
    type: "core",
  },
  {
    courseCode: "CS_556",
    courseName: "Mathematical Foundations of Machine Learning",
    prerequisite: [],
    type: "core",
  },
  {
    courseCode: "CS_559",
    courseName: "Machine Learning: Fund & Apps",
    prerequisite: ["CS_556"],
    type: "core",
  },
  {
    courseCode: "CS_541",
    courseName: "Artificial Intelligence",
    prerequisite: ["CS_556"],
    type: "core",
  },
  {
    courseCode: "CS_511",
    courseName: "Concurrent Programming",
    prerequisite: ["CS_520"],
    type: "core",
  },
  {
    courseCode: "CS_516",
    courseName: "Compiler Design & Implementatio",
    prerequisite: ["CS_510"],
    type: "core",
  },
  {
    courseCode: "CS_554",
    courseName: "Web Programming 2",
    prerequisite: ["CS_546"],
    type: "core",
  },
];
