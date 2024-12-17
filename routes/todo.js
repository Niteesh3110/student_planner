import express from "express";
import { getUserByUserId } from "../data/users.js";
import { getUserTasks, addTask, updateTask, deleteTask } from "../data/todo.js";
import xss from "xss";
const sanitize = (input) => xss(input);

const router = express.Router();

router.use(async (req, res, next) => {
  try {
    if (!req.session.user) {
      return res
        .status(401)
        .json({ error: "Unauthorized: Please log in to access tasks." });
    }

    const userId = req.session.user.userId;
    const userValidationResult = await getUserByUserId(userId);

    if (!userValidationResult.boolean) {
      return res.status(401).json({ error: userValidationResult.error });
    }
    next();
  } catch (error) {
    console.error("Authentication middleware error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const userId = req.session.user.userId;
    console.log("Fetching tasks for user:", userId);

    const tasks = await getUserTasks(userId);
    console.log("Fetched tasks:", tasks);

    return res.status(200).render("todo", { tasks });
  } catch (error) {
    console.error("Error rendering todo page:", error);
    return res.status(500).render("error", {
      error: "An error occurred while loading the to-do list.",
    });
  }
});

router.get("/getTasks", async (req, res) => {
  try {
    const userId = req.session.user.userId;
    console.log("Fetching tasks for user:", userId);

    const tasks = await getUserTasks(userId);
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Failed to fetch tasks." });
  }
});

router.post("/addTask", async (req, res) => {
  try {
    let userId = req.session.user.userId;
    let { header } = req.body;

    if (!header || typeof header !== "string" || header.trim().length === 0) {
      return res.status(400).json({ error: "Task header is required." });
    }

    header = header.trim();
    header = sanitize(header);

    console.log("Adding task for user:", userId, "Header:", header);

    const newTask = await addTask(userId, header.trim());
    res.status(201).json(newTask);
  } catch (error) {
    console.error("Error adding task:", error);
    res.status(500).json({ error: "Failed to add task." });
  }
});

router.put("/updateTask/:id", async (req, res) => {
  try {
    let taskId = req.params.id;
    let { header, text } = req.body;
    const userId = req.session.user.userId;

    console.log("Updating task ID:", taskId, "Header:", header, "Text:", text);

    if (!header || !text) {
      return res
        .status(400)
        .json({ error: "Header and text are required to update a task." });
    }

    header = header.trim();
    header = sanitize(header);
    text = text.trim();
    text = sanitize(text);

    const updatedTask = await updateTask(userId, taskId, {
      header: header.trim(),
      text: text.trim(),
    });
    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Failed to update task." });
  }
});

router.delete("/deleteTask/:id", async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.session.user.userId;

    console.log("Deleting task ID:", taskId);

    const result = await deleteTask(userId, taskId);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "Failed to delete task." });
  }
});

export default router;
