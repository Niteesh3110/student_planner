import express from "express";
import { ObjectId } from "mongodb";
import * as calendarFunctions from "../data/calendar.js"; // Import your database functions

const router = express.Router();

// Render the calendar page
router.get('/', (req, res) => {
    try {
        return res.status(200).render("calendar");
    } catch (error) {
        res.status(500).send({ error: 'An error occurred while loading the calendar page.' });
    }
});

// Fetch all events for the calendar
router.get('/getEvents', async (req, res) => {
    try {
        const events = await calendarFunctions.getAllEvents();

        // Format events for FullCalendar
        const formattedEvents = events.map(event => ({
            id: event._id.toString(), // Convert ObjectId to string
            title: event.title,
            start: `${event.date}T${event.time}`, // Combine date and time
        }));

        res.status(200).json(formattedEvents);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch events from the database.' });
    }
});

// Add a new event
router.post('/addEvent', async (req, res) => {
    try {
        const { title, date, time } = req.body;

        // Validate inputs
        if (!title || !date || !time) {
            return res.status(400).json({ error: 'All fields (title, date, and time) are required.' });
        }

        // Add event to the database
        const newEvent = await calendarFunctions.addEvent({ title, date, time });

        res.status(200).json({
            success: true,
            message: 'Event added successfully!',
            eventId: newEvent._id.toString(),
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete an event by ID
router.delete('/deleteEvent/:id', async (req, res) => {
    try {
        const eventId = req.params.id;

        // Validate the ID
        if (!ObjectId.isValid(eventId)) {
            return res.status(400).json({ error: 'Invalid event ID.' });
        }

        // Delete the event from the database
        const deleteResult = await calendarFunctions.deleteEvent(eventId);

        if (!deleteResult) {
            return res.status(404).json({ error: 'Event not found.' });
        }

        res.status(200).json({ success: true, message: 'Event deleted successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete the event.' });
    }
});

export default router;
