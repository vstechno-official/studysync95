require('dotenv').config(); // Load environment variables
const express = require('express');
const path = require('path');
const { PrismaClient } = require('@prisma/client'); // Import Prisma Client
const app = express();
const PORT = process.env.PORT || 3000;

const prisma = new PrismaClient(); // Initialize Prisma Client

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse form data and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Helper function to format date for display (YYYY-MM-DD)
const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// --- Routes ---

// GET route for the home page - Displays tasks and upcoming reminders
app.get('/', async (req, res) => {
    try {
        // Fetch all tasks (replace with user-specific tasks later)
        const allTasks = await prisma.task.findMany({
            orderBy: { deadline: 'asc' } // Order by deadline
        });

        // --- In-App Notifications Logic ---
        // Find tasks due within the next 7 days
        const now = new Date();
        const sevenDaysLater = new Date();
        sevenDaysLater.setDate(now.getDate() + 7);
        // Set time to end of day for comparison
        sevenDaysLater.setHours(23, 59, 59, 999);


        const upcomingTasks = allTasks.filter(task => {
            const deadline = new Date(task.deadline);
            // Check if deadline is today or in the future, and within the next 7 days, and not completed
            return deadline >= now && deadline <= sevenDaysLater && !task.completed;
        });
        // --- End In-App Notifications Logic ---

        res.render('index', {
            tasks: allTasks.map(task => ({ // Format tasks for display
                ...task,
                deadline: formatDate(task.deadline)
            })),
            upcomingTasks: upcomingTasks.map(task => ({ // Format upcoming tasks
                 ...task,
                deadline: formatDate(task.deadline)
            }))
        });
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).send("Error loading tasks.");
    }
});

// POST route to add a new task
app.post('/tasks', async (req, res) => {
    try {
        const { name, description, subject, deadline } = req.body;

        // Basic validation
        if (!name || !subject || !deadline) {
            return res.status(400).send("Missing required task fields: name, subject, and deadline are required.");
        }

        // Create task in the database
        const newTask = await prisma.task.create({
            data: {
                name: name,
                description: description || '',
                subject: subject,
                deadline: new Date(deadline), // Convert deadline string to Date object
                completed: false
                // Add userId here later
            }
        });

        console.log('Task added:', newTask);
        res.redirect('/'); // Redirect back to home
    } catch (error) {
        console.error("Error adding task:", error);
        res.status(500).send("Error adding task.");
    }
});

// NEW: POST route to mark a task as complete
app.post('/tasks/complete/:id', async (req, res) => {
    try {
        const taskId = parseInt(req.params.id); // Get task ID from URL
        const completed = req.body.completed === 'on'; // Check if checkbox is checked

        // Update task in the database
        const updatedTask = await prisma.task.update({
            where: { id: taskId },
            data: { completed: completed }
        });

        console.log('Task updated:', updatedTask);
        // Respond with JSON for client-side handling
        res.json({ success: true, task: updatedTask });

    } catch (error) {
        console.error("Error updating task:", error);
        res.status(500).json({ success: false, message: "Error updating task." });
    }
});


// NOTE: Add routes for editing, deleting here later.
// Example:
// app.post('/tasks/delete/:id', async (req, res) => { ... });

// NOTE: Add routes for user authentication (login, register, logout) here later.
// This is essential for a multi-user app and linking tasks to users via Prisma.

// --- End Routes ---

// Start the server
app.listen(PORT, () => {
    console.log(`StudySync '95 server running on port ${PORT}`);
    console.log(`Access the app at http://localhost:${PORT}`);
});

// Handle server shutdown gracefully
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
