import { ObjectId } from "mongodb";
import { event } from "../config/mongoCollection.js";

export async function addEvent(userId, title, date, time){
    if(!userId || typeof userId !== "string" || userId.trim().length === 0){
        throw "Invalid user ID.";
    }
    if(!title || typeof title !== "string" || title.trim().length === 0){
        throw "Invalid title.";
    }
    if(!date || isNaN(Date.parse(date))){
        throw "Invalid date.";
    }
    if(time && !/^\d{2}:\d{2}$/.test(time)){
        throw "Invalid time.";
    }

    const eventCollection = await event();
    const newEventId = new ObjectId().toString();

    const newEvent = {
        _id: newEventId,
        userId,
        title: title.trim(),
        date,
        time: time || null,
    };

    const insertInfo = await eventCollection.insertOne(newEvent);
    if(!insertInfo.acknowledged || !insertInfo.insertedId){
        throw "Failed to add event.";
    }
    return newEvent;
}

export async function getUserEvents(userId){
    if(!userId || typeof userId !== "string" || userId.trim().length === 0){
        throw "Invalid user ID.";
    }

    const eventCollection = await event();
    const userEvents = await eventCollection.find({ userId }).toArray();

    return userEvents.map((event) => ({
        id: event._id, // Use `id` to align with FullCalendar
        title: event.title,
        start: `${event.date}${event.time ? `T${event.time}` : ""}`,
    }));
}

export async function deleteEvent(userId, eventId){
    if(!userId || typeof userId !== "string" || userId.trim().length === 0){
        throw "Invalid user ID.";
    }
    if(!eventId || typeof eventId !== "string" || eventId.trim().length === 0){
        throw "Invalid event ID.";
    }

    const eventCollection = await event();
    const deletion = await eventCollection.deleteOne({
        _id: eventId,
        userId,
    });

    if(deletion.deletedCount === 0){
        throw "Event not found or unauthorized to delete.";
    }
    return true;
}
export async function updateEvent(userId, eventId, title, date, time){
    if(!userId || typeof userId !== "string" || userId.trim().length === 0){
        throw "Invalid user ID.";
    }
    if(!eventId || typeof eventId !== "string" || eventId.trim().length === 0){
        throw "Invalid event ID.";
    }
    if(!title || typeof title !== "string" || title.trim().length === 0){
        throw "Invalid title.";
    }
    if(!date || isNaN(Date.parse(date))){
        throw "Invalid date.";
    }
    if(time && !/^\d{2}:\d{2}$/.test(time)){
        throw "Invalid time.";
    }

    const eventCollection = await event();
    const updatedEvent = {
        title: title.trim(),
        date,
        time: time || null,
    };

    const updateInfo = await eventCollection.updateOne(
        { _id: eventId, userId }, // Ensure `_id` is a string
        { $set: updatedEvent }
    );

    if(updateInfo.modifiedCount === 0){
        throw "Event not found or unauthorized to update.";
    }
    return { ...updatedEvent, id: eventId };
}

