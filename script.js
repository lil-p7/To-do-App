// Current active filter
let currentFilter = "all";

// Stores all tasks
let tasks = [];

// Add a new task
function addTask(title) {
  const newTask = {
    id: Date.now(), // Unique task ID
    title: title,
    isCompleted: false,
  };

  tasks.push(newTask);
  updateApp();
  taskInput.focus();
}

// Toggle task completion
function toggleTask(id) {
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
  );
  updateApp();
}

// Delete a task
function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  updateApp();
}

// DOM elements
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const filterButtons = document.querySelectorAll(".filters button");

// Render tasks based on current filter
function renderTasks() {
  taskList.innerHTML = "";

  const filteredTasks = tasks.filter((task) => {
    if (currentFilter === "active") return !task.isCompleted;
    if (currentFilter === "completed") return task.isCompleted;
    return true;
  });

  filteredTasks.forEach((task) => {
    const li = document.createElement("li");
    li.textContent = task.title;

    // Apply completed style
    if (task.isCompleted) {
      li.classList.toggle("completed", task.isCompleted);
    }

    // Toggle task on click
    li.addEventListener("click", () => {
      toggleTask(task.id);
    });

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "❌";

    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent toggle
      deleteTask(task.id);
    });

    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });
}

// Add task button
addBtn.addEventListener("click", handleAddTask);

// Handle task submission
function handleAddTask() {
  const title = taskInput.value.trim();
  if (!title) return;

  addTask(title);
  taskInput.value = "";
}

// Submit on Enter key
taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    handleAddTask();
  }
});

// Filter button logic
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;

    // Update active filter UI
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    renderTasks();
  });
});

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasks() {
  const storedTasks = localStorage.getItem("tasks");
  if (storedTasks) {
    tasks = JSON.parse(storedTasks);
  }
}

// Central update function
function updateApp() {
  saveTasks();
  renderTasks();
}

// Initial load
loadTasks();
renderTasks();
