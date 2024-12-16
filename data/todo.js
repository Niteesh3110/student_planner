import { ObjectId } from "mongodb";
import { todo } from "../config/mongoCollection.js";

export async function getUserTasks(userId) {
    if(!userId || typeof userId !== "string") 
        throw "Invalid user ID.";

    const todoCollection = await todo();
    const tasks = await todoCollection.find({ userId }).toArray();

    return tasks.map(task => ({
        _id: task._id.toString(),
        userId: task.userId,
        header: task.header,
        text: task.text || "",
    }));
}

export async function addTask(userId, header) {
    if(!userId || typeof userId !== "string") 
        throw "Invalid user ID.";
    if(!header || typeof header !== "string" || header.trim().length === 0)
        throw "Task header is required.";

    const task = {
        userId,
        header,
        text: "",
    };

    const todoCollection = await todo();
    const insertInfo = await todoCollection.insertOne(task);

    if(!insertInfo.acknowledged || !insertInfo.insertedId){
        throw "Failed to add task.";
    }

    return { insertedId: insertInfo.insertedId.toString() };
}

export async function updateTask(userId, taskId, updatedData) {
    if (!ObjectId.isValid(taskId)) 
        throw new Error("Invalid Task ID.");

    const { header, text } = updatedData;

    if (!header || !text) 
        throw new Error("Header and text are required.");

    const todoCollection = await todo();
    const result = await todoCollection.updateOne(
        { _id: new ObjectId(taskId), userId },
        { $set: { header, text } }
    );

    if(result.matchedCount === 0) 
        throw new Error("Task not found.");
    return { success: true, message: "Task updated successfully." };
}

export async function deleteTask(userId, taskId) {
    if (!ObjectId.isValid(taskId)) 
        throw new Error("Invalid Task ID.");

    const todoCollection = await todo();
    const result = await todoCollection.deleteOne({ _id: new ObjectId(taskId), userId });

    if (result.deletedCount === 0) 
        throw new Error("Task not found.");
    return { success: true, message: "Task deleted successfully." };
}