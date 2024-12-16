document.addEventListener('DOMContentLoaded', function (){
            const calendarElement = document.getElementById('calendar');
            const eventModalElement = document.getElementById('eventModal');
            const modalInstance = new bootstrap.Modal(eventModalElement);
            const notificationElement = document.getElementById('notification');

            const calendar = new FullCalendar.Calendar(calendarElement,{
                initialView: 'dayGridMonth',
                headerToolbar: {
                    left: 'prev,next today',
                    center: 'title',
                    right: '',
                },
                events: '/calendar/getEvents',
                dateClick: function (info) {
                    resetModal();
                    document.getElementById('modalTitle').innerText = 'Add Event';
                    document.getElementById('eventDate').value = info.dateStr;
                    document.getElementById('saveEventButton').dataset.mode = 'add';
                    modalInstance.show();
                },
                eventClick: function (info){
                resetModal();
                document.getElementById('modalTitle').innerText = 'Update or Delete Event';
                document.getElementById('eventTitle').value = info.event.title;

                document.getElementById('eventDate').value = info.event.startStr.split('T')[0];

                const time = info.event.startStr.split('T')[1]; // Get the time portion
                document.getElementById('eventTime').value = time ? time.slice(0, 5) : ''; // Format as HH:mm

                document.getElementById('saveEventButton').dataset.mode = 'edit';
                document.getElementById('saveEventButton').dataset.eventId = info.event.id;
                document.getElementById('deleteEventButton').dataset.eventId = info.event.id;
                document.getElementById('deleteEventButton').style.display = 'inline-block';

                modalInstance.show();
                }
            });

            calendar.render();

            // Save Event
            document.getElementById('saveEventButton').addEventListener('click', async function (){
                const mode = this.dataset.mode;
                const eventId = this.dataset.eventId;
                const title = document.getElementById('eventTitle').value.trim();
                const date = document.getElementById('eventDate').value;
                const time = document.getElementById('eventTime').value;

                if(!title || !date){
                    alert('Title and Date are required.');
                    return;
                }

                if(mode === 'add'){
                    const response = await fetch('/calendar/addEvent',{
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ title, date, time }),
                    });
                    if(response.ok){
                        showNotification('Event added successfully!');
                        calendar.refetchEvents();
                        modalInstance.hide();
                    } 
                    else{
                        alert('Error adding event.');
                    }
                } 
            // Update event
                else if(mode === 'edit'){
                    if(!eventId){
                        alert("Event ID not found.");
                        return;
                    }

                    const response = await fetch(`/calendar/updateEvent/${eventId}`,{
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ title, date, time }),
                    });
                    if(response.ok){
                        showNotification('Event updated successfully!');
                        calendar.refetchEvents(); // Refresh the calendar
                        modalInstance.hide();
                    } 
                    else{
                        alert('Error updating event.');
                    }
                }
                resetModal();
            });

            // Delete Event
            document.getElementById('deleteEventButton').addEventListener('click', async function (){
                const eventId = this.dataset.eventId;

                if(!eventId){
                    alert("Event ID not found.");
                    return;
                }

                const response = await fetch(`/calendar/deleteEvent/${eventId}`,{
                    method: 'DELETE',
                });

                if(response.ok){
                    showNotification('Event deleted successfully!');
                    calendar.refetchEvents();
                    modalInstance.hide();
                } 
                else{
                    alert('Error deleting event.');
                }
                resetModal();
            });

            function showNotification(message) {
                notificationElement.innerText = message;
                notificationElement.style.display = 'block';
                setTimeout(() => {
                    notificationElement.style.display = 'none';
                }, 3000);
            }

            function resetModal() {
                document.getElementById('eventTitle').value = '';
                document.getElementById('eventDate').value = '';
                document.getElementById('eventTime').value = '';
                document.getElementById('saveEventButton').dataset.mode = '';
                document.getElementById('saveEventButton').dataset.eventId = '';
                document.getElementById('deleteEventButton').dataset.eventId = '';
                document.getElementById('deleteEventButton').style.display = 'none';
            }
        });
