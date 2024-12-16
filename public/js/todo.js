document.addEventListener('DOMContentLoaded', () => {
    const addTaskForm = document.getElementById('addTaskForm');
    const taskContainer = document.getElementById('taskContainer');

    async function fetchTasks() {
        try {
            taskContainer.innerHTML = '<p>Loading tasks...</p>';

            const response = await fetch('/todo/getTasks');
            const tasks = await response.json();

            taskContainer.innerHTML = '';

            if(tasks.length === 0) {
                taskContainer.innerHTML = '<p>No tasks found. Add your first task!</p>';
            } 
            else{
                tasks.forEach(task => {
                    const taskCard = document.createElement('div');
                    taskCard.classList.add('col-md-3');

                    taskCard.innerHTML = `
                        <div class="card text-bg-light">
                            <div class="card-header">
                                <input class="form-control border-0" value="${task.header}" readonly>
                            </div>
                            <div class="card-body">
                                <textarea class="form-control border-0" rows="2" readonly>${task.text}</textarea>
                                <div class="d-flex justify-content-end mt-2">
                                    <!-- Edit Button -->
                                    <button class="btn btn-sm btn-secondary me-2" onclick="startEditTask('${task._id}', this)">
                                        <i class="bi bi-pen"></i>
                                    </button>
                                    <!-- Delete Button -->
                                    <button class="btn btn-sm btn-danger" onclick="deleteTask('${task._id}')">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;
                    taskContainer.appendChild(taskCard);
                });
            }
        } 
        catch(error){
            console.error('Error fetching tasks:', error);
            taskContainer.innerHTML = '<p>Failed to load tasks. Please try again later.</p>';
        }
    }

    addTaskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const header = document.getElementById('taskHeader').value.trim();

        if(!header){
            alert('Task header is required!');
            return;
        }

        try{
            const response = await fetch('/todo/addTask', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ header }),
            });

            if(response.ok){
                fetchTasks();
                addTaskForm.reset();
            } 
            else{
                alert('Failed to add task. Please try again.');
            }
        } 
        catch(error) {
            console.error('Error adding task:', error);
        }
    });

    window.startEditTask = (taskId, editButton) => {
        const taskCard = editButton.closest('.card');
        const headerInput = taskCard.querySelector('.card-header input');
        const textInput = taskCard.querySelector('.card-body textarea');
        const deleteButton = taskCard.querySelector('.btn-danger');

        headerInput.removeAttribute('readonly');
        headerInput.classList.add('border');
        textInput.removeAttribute('readonly');
        textInput.classList.add('border');

        editButton.innerHTML = 'Save';
        editButton.classList.replace('btn-secondary', 'btn-success');
        editButton.onclick = () => submitEditTask(taskId, editButton);

        deleteButton.innerHTML = 'Cancel';
        deleteButton.classList.replace('btn-danger', 'btn-warning');
        deleteButton.onclick = () => cancelEditTask(taskCard, editButton, deleteButton, taskId);
    };

    async function submitEditTask(taskId, submitButton) {
        const taskCard = submitButton.closest('.card');
        const headerInput = taskCard.querySelector('.card-header input');
        const textInput = taskCard.querySelector('.card-body textarea');

        const updatedHeader = headerInput.value.trim();
        const updatedText = textInput.value.trim();

        if(!taskId || taskId.length !== 24){
            alert('Invalid Task ID.');
            return;
        }

        try{
            const response = await fetch(`/todo/updateTask/${taskId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ header: updatedHeader, text: updatedText }),
            });

            if(response.ok){
                fetchTasks();
            } 
            else{
                alert('Failed to update task. Please try again.');
            }
        } 
        catch(error){
            console.error('Error updating task:', error);
        }
    }

    function cancelEditTask(taskCard, editButton, deleteButton, taskId) {
        const headerInput = taskCard.querySelector('.card-header input');
        const textInput = taskCard.querySelector('.card-body textarea');

        headerInput.setAttribute('readonly', true);
        headerInput.classList.remove('border');
        textInput.setAttribute('readonly', true);
        textInput.classList.remove('border');

        editButton.innerHTML = '<i class="bi bi-pen"></i>';
        editButton.classList.replace('btn-success', 'btn-secondary');
        editButton.onclick = () => startEditTask(taskId, editButton);

        deleteButton.innerHTML = '<i class="bi bi-trash"></i>';
        deleteButton.classList.replace('btn-warning', 'btn-danger');
        deleteButton.onclick = () => deleteTask(taskId);
    }

    window.deleteTask = async (taskId) => {
        if(!taskId || taskId.length !== 24){
            alert('Invalid task ID.');
            return;
        }

        try{
            const response = await fetch(`/todo/deleteTask/${taskId}`, { method: 'DELETE' });
            if(response.ok){
                fetchTasks();
            } 
            else{
                alert('Failed to delete task.');
            }
        } 
        catch(error){
            console.error('Error deleting task:', error);
        }
    };
    fetchTasks();
});