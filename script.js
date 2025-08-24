let todos = [];
let button = document.querySelector("#addTaskBtn");
let tasklist = document.querySelector("#taskList");
let form = document.querySelector('.add-task-form');
let taskCount = document.querySelector("#taskCount");
let themeToggle = document.querySelector("#themeToggle");

// Theme Management
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.setTheme(this.currentTheme);
        this.setupEventListeners();
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        localStorage.setItem('theme', theme);
        
        // Update toggle button state
        const lightIcon = document.querySelector("#lightIcon");
        const darkIcon = document.querySelector("#darkIcon");
        
        if (theme === 'dark') {
            lightIcon.style.opacity = '0';
            darkIcon.style.opacity = '1';
        } else {
            lightIcon.style.opacity = '1';
            darkIcon.style.opacity = '0';
        }
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
        
        // Add loading animation
        themeToggle.classList.add('loading');
        setTimeout(() => {
            themeToggle.classList.remove('loading');
        }, 300);
        
        showNotification(`Switched to ${newTheme} theme!`, 'info');
    }

    setupEventListeners() {
        themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });

        // Keyboard shortcut for theme toggle (Ctrl/Cmd + T)
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 't') {
                e.preventDefault();
                this.toggleTheme();
            }
        });
    }
}

// Initialize theme manager
const themeManager = new ThemeManager();

// Update task count display
function updateTaskCount() {
    const totalTasks = todos.length;
    const completedTasks = todos.filter(todo => todo.isCompleted).length;
    const remainingTasks = totalTasks - completedTasks;
    
    if (totalTasks === 0) {
        taskCount.textContent = "No tasks yet";
    } else if (completedTasks === totalTasks) {
        taskCount.textContent = `All ${totalTasks} tasks completed! 🎉`;
    } else {
        taskCount.textContent = `${remainingTasks} of ${totalTasks} tasks remaining`;
    }
}

// Show empty state
function showEmptyState() {
    // Clear any existing content
    tasklist.innerHTML = `
        <div class="empty-state">
            <i class="fas fa-clipboard-list"></i>
            <h3>No tasks yet</h3>
            <p>Add your first task to get started!</p>
        </div>
    `;
}

// Form submission handler
form.addEventListener('submit', (e) => {
    e.preventDefault();
    let input = document.querySelector("#taskInput");
    let taskinput = input.value.trim();
    
    if (taskinput !== '') {
        addTodo(taskinput);
        input.value = "";
        input.focus();
    } else {
        showNotification("Please enter a task!", "info");
    }
});

// Add new todo
function addTodo(taskText) {
    const newTodo = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        input: taskText,
        isCompleted: false,
        createdAt: new Date().toISOString()
    };
    
    todos.push(newTodo);
    addToDom([newTodo]);
    localStorage.setItem('todos', JSON.stringify(todos));
    updateTaskCount();
    showNotification("Task added successfully!", "success");
}

// Clear completed tasks
function clearcompleted() {
    const completedCount = todos.filter(todo => todo.isCompleted).length;
    
    if (completedCount === 0) {
        showNotification("No completed tasks to clear!", "info");
        return;
    }
    
    todos = todos.filter(todo => !todo.isCompleted);
    tasklist.innerHTML = "";
    if (todos.length > 0) {
        addToDom(todos);
    } else {
        showEmptyState();
    }
    localStorage.setItem('todos', JSON.stringify(todos));
    updateTaskCount();
    showNotification(`${completedCount} completed task(s) cleared!`, "success");
}

// Show notification
function showNotification(message, type = "info") {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.remove();
    });

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add tasks to DOM
function addToDom(tasks) {
    tasks.forEach(task => {
        // Check if task already exists in DOM
        if (document.getElementById(task.id)) return;
        
        let newli = document.createElement('li');
        newli.id = task.id;
        newli.className = task.isCompleted ? 'completed' : '';
        
        // Create task content container
        let taskContent = document.createElement('div');
        taskContent.className = 'task-content';
        
        // Create checkbox
        let checkbtn = document.createElement('input');
        checkbtn.className = 'checkbox';
        checkbtn.type = 'checkbox';
        checkbtn.checked = task.isCompleted;
        checkbtn.setAttribute('aria-label', `Mark "${task.input}" as ${task.isCompleted ? 'incomplete' : 'complete'}`);
        
        // Create task text
        let taskText = document.createElement('span');
        taskText.className = 'task-text';
        taskText.textContent = task.input;
        
        // Add checkbox and text to content container
        taskContent.appendChild(checkbtn);
        taskContent.appendChild(taskText);
        
        // Create delete button
        let deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.setAttribute('aria-label', `Delete task "${task.input}"`);
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        
        // Add content and delete button to list item
        newli.appendChild(taskContent);
        newli.appendChild(deleteBtn);
        
        // Add event listeners
        checkbtn.addEventListener('change', () => {
            toggleTaskComplete(task.id);
        });
        
        deleteBtn.addEventListener('click', () => {
            deleteTask(task.id);
        });
        
        // Add to task list
        tasklist.appendChild(newli);
    });
    
    // Don't show empty state here - it's handled in initialization
}

// Toggle task completion
function toggleTaskComplete(taskId) {
    const task = todos.find(t => t.id === taskId);
    const wasCompleted = task.isCompleted;
    
    todos = todos.map(todo => {
        if (todo.id === taskId) {
            return { ...todo, isCompleted: !todo.isCompleted };
        }
        return todo;
    });
    
    // Update DOM
    const taskElement = document.getElementById(taskId);
    if (taskElement) {
        taskElement.className = todos.find(t => t.id === taskId).isCompleted ? 'completed' : '';
        const checkbox = taskElement.querySelector('.checkbox');
        checkbox.checked = todos.find(t => t.id === taskId).isCompleted;
    }
    
    localStorage.setItem('todos', JSON.stringify(todos));
    updateTaskCount();
    
    // Show completion notification
    const newStatus = !wasCompleted ? 'completed' : 'uncompleted';
    showNotification(`Task marked as ${newStatus}!`, "success");
}

// Delete task
function deleteTask(taskId) {
    const task = todos.find(t => t.id === taskId);
    const taskElement = document.getElementById(taskId);
    
    // Add fade out animation
    taskElement.style.transition = 'all 0.3s ease';
    taskElement.style.opacity = '0';
    taskElement.style.transform = 'translateX(-100%)';
    
    setTimeout(() => {
        tasklist.removeChild(taskElement);
        todos = todos.filter(t => t.id !== taskId);
        localStorage.setItem('todos', JSON.stringify(todos));
        updateTaskCount();
        
        if (todos.length === 0) {
            showEmptyState();
        }
        
        showNotification("Task deleted!", "success");
    }, 300);
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to add task
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const input = document.querySelector("#taskInput");
        if (document.activeElement === input) {
            form.dispatchEvent(new Event('submit'));
        }
    }
    
    // Escape to clear input
    if (e.key === 'Escape') {
        const input = document.querySelector("#taskInput");
        if (document.activeElement === input) {
            input.value = "";
            input.blur();
        }
    }
    
    // Ctrl/Cmd + D to clear completed tasks
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        clearcompleted();
    }
});

// Initialize app
document.addEventListener("DOMContentLoaded", () => {
    // Load saved todos
    const savedTODOS = localStorage.getItem("todos");
    if (savedTODOS) {
        try {
            const JSONTODOS = JSON.parse(savedTODOS);
            if (Array.isArray(JSONTODOS)) {
                todos = JSONTODOS;
                addToDom(JSONTODOS);
            }
        } catch (error) {
            console.error('Error loading todos from localStorage:', error);
            localStorage.removeItem('todos');
        }
    }
    
    // Update task count
    updateTaskCount();
    
    // Only show empty state if there are actually no tasks
    if (todos.length === 0) {
        showEmptyState();
    }
    
    // Focus input on load
    const input = document.querySelector("#taskInput");
    input.focus();
    
    // Add input animation
    input.addEventListener('focus', () => {
        input.parentElement.style.transform = 'scale(1.02)';
    });
    
    input.addEventListener('blur', () => {
        input.parentElement.style.transform = 'scale(1)';
    });
    
    // Add welcome message
    if (todos.length === 0) {
        setTimeout(() => {
            showNotification("Welcome! Start by adding your first task.", "info");
        }, 1000);
    }
});


