// v.0.5
console.log("StudySync'95 client v.0.5 loaded.");
console.log("a opensource project by https://github.com/vstechno-official");
document.addEventListener('DOMContentLoaded', () => {
    // Get all task completion forms
    const completeTaskForms = document.querySelectorAll('.complete-task-form');

    completeTaskForms.forEach(form => {
        // Add event listener to the checkbox within each form
        const checkbox = form.querySelector('input[type="checkbox"]');
        if (checkbox) {
            checkbox.addEventListener('change', async (event) => {
                event.preventDefault(); // Prevent default form submission

                const taskId = form.action.split('/').pop(); // Extract task ID from form action URL
                const isCompleted = event.target.checked; // Get the new checked state

                try {
                    const response = await fetch(form.action, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        // Send the completed status in the request body
                        body: JSON.stringify({ completed: isCompleted }),
                    });

                    if (response.ok) {
                        const data = await response.json();
                        console.log('Task completion status updated:', data.task);
                        // Visually update the task item on the page
                        const taskItem = form.closest('.task-item') || form.closest('.reminder-item');
                        if (taskItem) {
                            if (data.task.completed) {
                                taskItem.style.textDecoration = 'line-through';
                                taskItem.style.opacity = '0.7';
                                // If it was a reminder, remove it from the reminder list visually
                                if (form.closest('.reminder-item')) {
                                     taskItem.remove(); // Or hide it
                                }
                            } else {
                                taskItem.style.textDecoration = 'none';
                                taskItem.style.opacity = '1';
                                // If it was completed and now uncompleted, it might need to reappear in reminders
                                // This requires more complex client-side logic or a partial page update.
                                // For now, uncompleting a task won't automatically add it back to reminders without a refresh.
                            }
                        }
                         // Removed window.location.reload(); to prevent full page refresh
                    } else {
                        console.error('Failed to update task completion status.');
                        // Revert checkbox state if update fails
                        event.target.checked = !isCompleted;
                        alert('Failed to update task completion status.');
                    }
                } catch (error) {
                    console.error('Error updating task completion status:', error);
                     // Revert checkbox state if error occurs
                    event.target.checked = !isCompleted;
                    alert('An error occurred while updating task completion status.');
                }
            });
        }
    });
});