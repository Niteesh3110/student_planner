import express from "express";
import {
  addEvent,
  getUserEvents,
  updateEvent,
  deleteEvent,
} from "../data/calendar.js";
import { getUserByUserId } from "../data/users.js";

const router = express.Router();
import xss from "xss";
const sanitize = (input) => xss(input);

// Middleware to check if the user is authenticated or not
router.use(async (req, res, next) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({
        error: "Unauthorized: Please log in to access your calendar.",
      });
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
    if (!req.session.user || !req.session.user.userId) {
      console.error("User session not found.");
      return res
        .status(403)
        .render("error", { error: "User not authenticated." });
    }

    const userId = req.session.user.userId;

    const events = await getUserEvents(userId);

    console.log("Fetched events:", events);
    return res.status(200).render("calendar", { userId });
  } catch (error) {
    console.error("Error rendering calendar page:", error);
    return res.status(500).render("error", {
      error: "An error occurred while loading the calendar.",
    });
  }
});

router.get("/getEvents", async (req, res) => {
  try {
    const userId = req.session.user.userId;
    const events = await getUserEvents(userId);
    return res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return res.status(500).json({ error: "Failed to fetch events." });
  }
});

router.post("/addEvent", async (req, res) => {
  try {
    let userId = req.session.user.userId;
    let { title, date, time } = req.body;

    title = title.trim();
    date = date.trim();
    time = time.trim();
    title = sanitize(title);
    date = sanitize(date);
    time = sanitize(time);

    const newEvent = await addEvent(userId, title, date, time);
    console.log("Event created:", newEvent);
    return res.status(201).json(newEvent);
  } catch (error) {
    console.error("Error adding event:", error);
    return res.status(500).json({ error: "Failed to add event." });
  }
});

router.delete("/deleteEvent/:id", async (req, res) => {
  try {
    const userId = req.session.user.userId;
    const eventId = req.params.id;

    await deleteEvent(userId, eventId);
    console.log(`Deleted event with ID ${eventId}`);
    return res.status(200).json({ message: "Event deleted successfully." });
  } catch (error) {
    console.error("Error deleting event:", error);
    return res.status(500).json({ error: "Failed to delete event." });
  }
});

router.put("/updateEvent/:id", async (req, res) => {
  try {
    const userId = req.session.user.userId;
    const eventId = req.params.id;
    let { title, date, time } = req.body;

    title = title.trim();
    date = date.trim();
    time = time.trim();
    title = sanitize(title);
    date = sanitize(date);
    time = sanitize(time);

    let updatedEvent = await updateEvent(userId, eventId, title, date, time);

    console.log("Event updated successfully:", updatedEvent);

    return res.json(updatedEvent);
  } catch (error) {
    console.error("Error updating event:", error);
    return res.status(500).json({ error: "Failed to update event." });
  }
});

export default router;
