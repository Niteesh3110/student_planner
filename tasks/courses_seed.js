import mongodb from "mongodb";
import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import { tree } from "../config/mongoCollection.js";
import { Children } from "react";

const db = await dbConnection();
const treeCol = await tree();

let result = await treeCol.insertOne({
  userID: "123",
  tree: { name: "CS", Children: [] },
});

// let courseList = [
//   {
//     courseCode: "CS_501",
//     courseName: "Introduction to JAVA Programming",
//     prerequisite: [],
//     type: "path",
//     category: "",
//   },
//   {
//     courseCode: "CS_570",
//     courseName: "Intro to Programming, Data Structures & Algo",
//     prerequisite: [],
//     type: "path",
//     category: "",
//   },
//   {
//     courseCode: "CS_515",
//     courseName: "Fundamentals of Computing",
//     prerequisite: [],
//     type: "path",
//     category: "",
//   },
//   {
//     courseCode: "CS_590",
//     courseName: "Algorithms",
//     prerequisite: [],
//     type: "path",
//     category: "",
//   },
//   {
//     courseCode: "CS_546",
//     courseName: "Web Programming",
//     prerequisite: ["CS_590"],
//     type: "core",
//     category: "SD",
//   },
//   {
//     courseCode: "CS_522",
//     courseName: "Mobile Systems and Applications",
//     prerequisite: ["CS_385", "CS_590"],
//     type: "core",
//     category: "SD",
//   },
//   {
//     courseCode: "CS_556",
//     courseName: "Mathematical Foundations of Machine Learning",
//     prerequisite: [],
//     type: "core",
//     category: "AIML",
//   },
//   {
//     courseCode: "CS_559",
//     courseName: "Machine Learning: Fund & Apps",
//     prerequisite: ["CS_556"],
//     type: "core",
//     category: "AIML",
//   },
//   {
//     courseCode: "CS_541",
//     courseName: "Artificial Intelligence",
//     prerequisite: ["CS_556"],
//     type: "core",
//     category: "AIML",
//   },
//   {
//     courseCode: "CS_511",
//     courseName: "Concurrent Programming",
//     prerequisite: ["CS_520"],
//     type: "core",
//     category: "SYS",
//   },
//   {
//     courseCode: "CS_516",
//     courseName: "Compiler Design & Implementatio",
//     prerequisite: ["CS_510"],
//     type: "core",
//     category: "SYS",
//   },
//   {
//     courseCode: "CS_554",
//     courseName: "Web Programming 2",
//     prerequisite: ["CS_546"],
//     type: "core",
//     category: "SD",
//   },
//   {
//     courseCode: "CS_548",
//     courseName: "Enterprise Software Arch. & Dsgn",
//     prerequisite: ["CS_590"],
//     type: "regular",
//     category: "SD",
//   },
//   {
//     courseCode: "CS_555",
//     courseName: "Agile Methods for Software Dev",
//     prerequisite: ["CS_546"],
//     type: "regular",
//     category: "SD",
//   },
//   {
//     courseCode: "CS_561",
//     courseName: "Database Management Systems 1",
//     prerequisite: [],
//     type: "core",
//     category: "SD",
//   },
//   {
//     courseCode: "CS_562",
//     courseName: "Database Management Systems 2",
//     prerequisite: ["CS_561"],
//     type: "core",
//     category: "SD",
//   },
//   {
//     courseCode: "CS_513",
//     courseName: "Knowledge Disc & Data Mining",
//     prerequisite: [],
//     type: "core",
//     category: "AIML",
//   },
//   {
//     courseCode: "CS_544",
//     courseName: "Health Informatics",
//     prerequisite: [],
//     type: "core",
//     category: "AIML",
//   },
//   {
//     courseCode: "CS_583",
//     courseName: "Deep Learning",
//     prerequisite: ["CS_556"],
//     type: "regular",
//     category: "AIML",
//   },
//   {
//     courseCode: "CS_584",
//     courseName: "Natural Language Processing",
//     prerequisite: ["CS_556"],
//     type: "regular",
//     category: "AIML",
//   },
//   {
//     courseCode: "CS_589",
//     courseName: "Text Mining and Information Retrieval",
//     prerequisite: ["CS_115"],
//     type: "regular",
//     category: "AIML",
//   },
//   {
//     courseCode: "CS_560",
//     courseName: "Statistical Machine Learning",
//     prerequisite: ["CS_559"],
//     type: "regular",
//     category: "AIML",
//   },
//   {
//     courseCode: "CS_576",
//     courseName: "Systems Security",
//     prerequisite: ["CS_631"],
//     type: "regular",
//     category: "SYS",
//   },
//   {
//     courseCode: "CS_521",
//     courseName: "TCP/IP Networking",
//     prerequisite: ["CS_520"],
//     type: "regular",
//     category: "SYS",
//   },
//   {
//     courseCode: "CS_516",
//     courseName: "Compiler Design & Implementation",
//     prerequisite: ["CS_510"],
//     type: "regular",
//     category: "TH",
//   },
//   {
//     courseCode: "CS_579",
//     courseName: "Foundations of Cryptography",
//     prerequisite: ["CS_590", "CS_570"],
//     type: "regular",
//     category: "TH",
//   },
//   {
//     courseCode: "CS_600",
//     courseName: "Adv. Algorithm Dsgn & Implementation",
//     prerequisite: ["CS_590"],
//     type: "regular",
//     category: "TH",
//   },
//   {
//     courseCode: "CS_601",
//     courseName: "Algorithmic Complexity",
//     prerequisite: ["CS_600"],
//     type: "regular",
//     category: "TH",
//   },
// ];

// let result = await courseCol.insertMany(courseList);

await closeConnection();
/*
{
  courseCode: "",
  courseName: "",
  prerequisite: [],
  type: ""
}
  */
