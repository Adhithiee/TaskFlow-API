const BASE_URL = "http://127.0.0.1:8000";

let token = localStorage.getItem("token") || "";
let username = localStorage.getItem("username") || "";
let displayName = localStorage.getItem("displayName") || "";
let currentFilter = "all";
let allTasks = [];

// Initialize Page
document.addEventListener("DOMContentLoaded", () => {
    // Check local storage for dark theme
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
    updateThemeIcon(savedTheme);

    // Setup Theme Toggle Listener
    const themeBtn = document.getElementById("theme-toggle");
    if (themeBtn) {
        themeBtn.addEventListener("click", toggleTheme);
    }

    // Setup Description Char Counter
    const descTextarea = document.getElementById("desc");
    const charCounter = document.getElementById("desc-char-count");
    if (descTextarea && charCounter) {
        descTextarea.addEventListener("input", () => {
            charCounter.textContent = descTextarea.value.length;
        });
    }

    // Check if user is already logged in
    if (token) {
        setupAuthenticatedView();
        getTasks();
    } else {
        setupLoggedOutView();
    }

    // Initial render of icons
    lucide.createIcons();
});

// Toast Notifications System
function showToast(message, type = "info") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    
    // Choose icon based on type
    let iconName = "info";
    if (type === "success") iconName = "check-circle";
    if (type === "warning") iconName = "alert-triangle";
    if (type === "error") iconName = "alert-circle";

    toast.innerHTML = `
        <i data-lucide="${iconName}"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);
    lucide.createIcons();

    // Trigger slide-in transition
    setTimeout(() => {
        toast.classList.add("show");
    }, 10);

    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Light / Dark Theme Control
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    updateThemeIcon(newTheme);
    
    showToast(`Switched to ${newTheme} mode`, "info");
}

function updateThemeIcon(theme) {
    const sunIcon = document.querySelector(".theme-icon-light");
    const moonIcon = document.querySelector(".theme-icon-dark");
    if (!sunIcon || !moonIcon) return;

    if (theme === "dark") {
        sunIcon.style.display = "block";
        moonIcon.style.display = "none";
    } else {
        sunIcon.style.display = "none";
        moonIcon.style.display = "block";
    }
}

// Auth Tabs Toggle
function switchAuthTab(tab) {
    const tabLogin = document.getElementById("tab-login");
    const tabRegister = document.getElementById("tab-register");
    const formLogin = document.getElementById("login-form");
    const formRegister = document.getElementById("register-form");

    if (tab === "login") {
        tabLogin.classList.add("active");
        tabRegister.classList.remove("active");
        formLogin.style.display = "block";
        formRegister.style.display = "none";
    } else {
        tabLogin.classList.remove("active");
        tabRegister.classList.add("active");
        formLogin.style.display = "none";
        formRegister.style.display = "block";
    }
}

// Set auth state views
function setupAuthenticatedView() {
    document.getElementById("auth-container").style.display = "none";
    document.getElementById("dashboard-container").style.display = "flex";
    
    // Set Profile UI
    const profileDiv = document.getElementById("user-profile");
    const userBadge = document.getElementById("user-badge");
    const userDisplayName = document.getElementById("user-display-name");
    
    if (profileDiv && userDisplayName) {
        userDisplayName.textContent = displayName || username || "Active User";
        if (userBadge) {
            userBadge.textContent = (displayName || username || "U").substring(0, 1).toUpperCase();
        }
        profileDiv.style.display = "flex";
    }
}

function setupLoggedOutView() {
    document.getElementById("auth-container").style.display = "flex";
    document.getElementById("dashboard-container").style.display = "none";
    document.getElementById("user-profile").style.display = "none";
    
    // Clear forms
    document.getElementById("login-form").reset();
    document.getElementById("register-form").reset();
}

// Login Controller
async function login() {
    const btn = document.getElementById("btn-login");
    const btnText = btn.querySelector("span");
    const btnIcon = btn.querySelector("i");
    
    const originalText = btnText.innerHTML;
    btnText.textContent = "Logging In...";
    btn.disabled = true;

    const usernameVal = document.getElementById("username").value.trim();
    const passwordVal = document.getElementById("password").value;

    try {
        const response = await fetch(`${BASE_URL}/users/login_user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username: usernameVal, password: passwordVal })
        });

        const data = await response.json();
        
        if (!response.ok || !data.token) {
            showToast(data.message || "Invalid credentials. Please try again.", "error");
            btnText.innerHTML = originalText;
            btn.disabled = false;
            return;
        }

        // Store Token & Info
        token = data.token;
        username = usernameVal;
        
        // Let's deduce user full name from user info if available or use capital username
        displayName = data.username || usernameVal;
        
        localStorage.setItem("token", token);
        localStorage.setItem("username", username);
        localStorage.setItem("displayName", displayName);

        showToast("Login Successful! Welcome to TaskFlow.", "success");
        
        setupAuthenticatedView();
        getTasks();

    } catch (error) {
        console.error("Login error:", error);
        showToast("Server unreachable. Please start the backend.", "error");
    } finally {
        btnText.innerHTML = originalText;
        btn.disabled = false;
    }
}

// Register Controller
async function register() {
    const btn = document.getElementById("btn-register");
    const btnText = btn.querySelector("span");
    
    const originalText = btnText.innerHTML;
    btnText.textContent = "Creating Account...";
    btn.disabled = true;

    const name = document.getElementById("reg-name").value.trim();
    const email = document.getElementById("reg-email").value.trim();
    const usernameVal = document.getElementById("reg-username").value.trim();
    const passwordVal = document.getElementById("reg-password").value;

    try {
        const response = await fetch(`${BASE_URL}/users/register_user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, username: usernameVal, email, password: passwordVal })
        });

        const data = await response.json();
        
        if (response.status === 201) {
            showToast("Registration Successful! Please log in.", "success");
            // Switch to login tab and fill username
            switchAuthTab("login");
            document.getElementById("username").value = usernameVal;
            document.getElementById("password").value = "";
            document.getElementById("password").focus();
        } else {
            showToast(data.detail || data.message || "Registration failed. Username or email might exist.", "error");
        }
    } catch (error) {
        console.error("Registration error:", error);
        showToast("Connection failed. Please check your backend connection.", "error");
    } finally {
        btnText.innerHTML = originalText;
        btn.disabled = false;
    }
}

// Logout Controller
function logout() {
    token = "";
    username = "";
    displayName = "";
    allTasks = [];
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("displayName");
    
    showToast("Signed out successfully.", "info");
    setupLoggedOutView();
}

// Create Task Controller
async function addTask() {
    const btn = document.getElementById("btn-add-task");
    const btnText = btn.querySelector("span");
    const btnIcon = btn.querySelector("i");
    
    btn.disabled = true;
    btnText.textContent = "Creating...";

    const title = document.getElementById("title").value.trim();
    const desc = document.getElementById("desc").value.trim();
    const due_date = document.getElementById("due_date").value;

    try {
        const response = await fetch(`${BASE_URL}/tasks/create_task`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                title,
                desc,
                due_date: due_date || null,
                status: "pending"
            })
        });

        const data = await response.json();

        if (response.status === 201) {
            showToast("Task added successfully!", "success");
            // Reset task form
            document.getElementById("create-task-form").reset();
            const charCounter = document.getElementById("desc-char-count");
            if (charCounter) charCounter.textContent = "0";
            
            getTasks();
        } else {
            showToast(data.detail || data.message || "Failed to create task", "error");
        }
    } catch (error) {
        console.error("Add task error:", error);
        showToast("Error communicating with server.", "error");
    } finally {
        btn.disabled = false;
        btnText.textContent = "Add Task";
    }
}

// Get All Tasks Controller
async function getTasks() {
    const refreshBtn = document.querySelector(".refresh-btn");
    if (refreshBtn) refreshBtn.classList.add("spinning");

    try {
        const response = await fetch(`${BASE_URL}/tasks/get_all_tasks`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        // Handle Session Expiration / Unauthorized
        if (response.status === 401) {
            showToast("Session expired. Please log in again.", "warning");
            logout();
            return;
        }

        if (!response.ok) {
            showToast("Failed to fetch task list.", "error");
            return;
        }

        const result = await response.json();
        allTasks = result.data || [];
        
        // If result.data is single object instead of array (should be array based on API)
        if (!Array.isArray(allTasks)) {
            allTasks = [allTasks];
        }

        updateDashboardStats();
        renderTasks();

    } catch (error) {
        console.error("Get tasks error:", error);
        showToast("Unable to fetch tasks. Backend might be down.", "error");
        
        const listContainer = document.getElementById("task-cards-list");
        if (listContainer) {
            listContainer.innerHTML = `
                <div class="empty-state">
                    <i data-lucide="alert-circle" class="empty-icon" style="color: var(--danger)"></i>
                    <p>Unable to connect to Server dashboard</p>
                    <button onclick="getTasks()" class="btn primary-btn" style="width: auto; margin-top: 12px;">Retry</button>
                </div>
            `;
            lucide.createIcons();
        }
    } finally {
        if (refreshBtn) {
            setTimeout(() => {
                refreshBtn.classList.remove("spinning");
            }, 600);
        }
    }
}

// Toggle Task Status (Checkbox Click)
async function toggleTaskStatus(id, currentStatus) {
    const task = allTasks.find(t => t.id === id);
    if (!task) return;

    const nextStatus = currentStatus === "completed" ? "pending" : "completed";
    
    // Optimistic Update
    task.status = nextStatus;
    updateDashboardStats();
    renderTasks();

    try {
        const response = await fetch(`${BASE_URL}/tasks/edit_task/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                status: nextStatus
            })
        });

        if (!response.ok) {
            throw new Error("Update status failed");
        }
        
        showToast(`Task marked as ${nextStatus}`, "success");
        // Fresh pull from database to stay in sync
        getTasks();

    } catch (error) {
        console.error("Status toggle error:", error);
        showToast("Failed to update status. Rolling back...", "error");
        // Revert Optimistic Update
        task.status = currentStatus;
        updateDashboardStats();
        renderTasks();
    }
}

// Delete Task Controller
async function deleteTask(id) {
    if (!confirm("Are you sure you want to delete this task?")) {
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/tasks/delete_task/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (response.status === 204 || response.ok) {
            showToast("Task deleted successfully", "success");
            getTasks();
        } else {
            showToast("Failed to delete task", "error");
        }
    } catch (error) {
        console.error("Delete task error:", error);
        showToast("Error deleting task", "error");
    }
}

// Render Tasks to UI
function renderTasks() {
    const listContainer = document.getElementById("task-cards-list");
    if (!listContainer) return;

    listContainer.innerHTML = "";

    const searchStr = document.getElementById("search-input").value.toLowerCase().trim();

    // Filter Tasks
    let filtered = allTasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchStr) || 
                              task.desc.toLowerCase().includes(searchStr);
        
        if (currentFilter === "all") return matchesSearch;
        return matchesSearch && task.status === currentFilter;
    });

    // Render Empty State
    if (filtered.length === 0) {
        listContainer.innerHTML = `
            <div class="empty-state">
                <i data-lucide="folder-open" class="empty-icon"></i>
                <p>${searchStr ? "No tasks match your search criteria." : "No tasks found. Get started by adding a task!"}</p>
            </div>
        `;
        lucide.createIcons();
        return;
    }

    // Sort: Pending first, then due date chronological
    filtered.sort((a, b) => {
        if (a.status !== b.status) {
            return a.status === "pending" ? -1 : 1;
        }
        if (!a.due_date) return 1;
        if (!b.due_date) return -1;
        return new Date(a.due_date) - new Date(b.due_date);
    });

    filtered.forEach(task => {
        const card = document.createElement("div");
        card.id = `task-card-${task.id}`;
        card.className = `task-card ${task.status === 'completed' ? 'task-completed' : ''}`;

        // Compute Due Date Badge
        let dueBadgeHTML = "";
        if (task.due_date) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            // API returns date in YYYY-MM-DD
            const parts = task.due_date.split('-');
            const dueDate = new Date(parts[0], parts[1] - 1, parts[2]);
            dueDate.setHours(0, 0, 0, 0);

            const diffTime = dueDate.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            let badgeClass = "upcoming";
            let badgeText = "";
            let icon = "calendar";

            if (task.status === "completed") {
                badgeClass = "upcoming";
                badgeText = `Due ${task.due_date}`;
            } else if (diffDays < 0) {
                badgeClass = "overdue";
                badgeText = `Overdue (${Math.abs(diffDays)}d ago)`;
                icon = "alert-circle";
            } else if (diffDays === 0) {
                badgeClass = "today";
                badgeText = "Today";
                icon = "clock";
            } else if (diffDays === 1) {
                badgeClass = "upcoming";
                badgeText = "Tomorrow";
            } else {
                badgeClass = "upcoming";
                badgeText = `In ${diffDays} days`;
            }

            dueBadgeHTML = `
                <span class="due-badge ${badgeClass}" title="Due date: ${task.due_date}">
                    <i data-lucide="${icon}"></i>
                    <span>${badgeText}</span>
                </span>
            `;
        } else {
            dueBadgeHTML = `
                <span class="due-badge no-date">
                    <i data-lucide="minus"></i>
                    <span>No due date</span>
                </span>
            `;
        }

        const isChecked = task.status === "completed" ? "checked" : "";

        card.innerHTML = `
            <div class="task-checkbox-wrapper">
                <input type="checkbox" 
                       id="check-${task.id}" 
                       class="task-checkbox" 
                       ${isChecked} 
                       onclick="toggleTaskStatus(${task.id}, '${task.status}')"
                       aria-label="Toggle completion">
            </div>
            
            <div class="task-details" id="details-container-${task.id}">
                <div class="task-main-row">
                    <h3 class="task-title">${task.title}</h3>
                    <div class="task-actions">
                        <button onclick="editTask(${task.id})" class="action-btn edit-btn" title="Edit Task">
                            <i data-lucide="edit-3"></i>
                        </button>
                        <button onclick="deleteTask(${task.id})" class="action-btn delete-btn" title="Delete Task">
                            <i data-lucide="trash-2"></i>
                        </button>
                    </div>
                </div>
                <p class="task-description">${task.desc || ""}</p>
                <div class="task-meta">
                    ${dueBadgeHTML}
                    <span class="status-badge ${task.status}">
                        ${task.status}
                    </span>
                </div>
            </div>
        `;

        listContainer.appendChild(card);
    });

    lucide.createIcons();
}

// Inline edit layout rendering
function editTask(id) {
    const task = allTasks.find(t => t.id === id);
    if (!task) return;

    const detailsDiv = document.getElementById(`details-container-${id}`);
    if (!detailsDiv) return;

    // Convert date string for input element
    const rawDate = task.due_date ? task.due_date : "";

    detailsDiv.innerHTML = `
        <form class="task-edit-form" onsubmit="event.preventDefault(); saveTaskEdit(${id});">
            <div class="input-group" style="margin-bottom: 8px;">
                <input type="text" id="edit-title-${id}" value="${task.title}" required style="padding: 6px 10px;">
            </div>
            <div class="input-group" style="margin-bottom: 8px;">
                <textarea id="edit-desc-${id}" rows="2" maxlength="100" style="padding: 6px 10px;">${task.desc || ""}</textarea>
            </div>
            <div class="input-group" style="margin-bottom: 8px;">
                <input type="date" id="edit-date-${id}" value="${rawDate}" style="padding: 6px 10px;">
            </div>
            
            <div class="task-edit-actions">
                <button type="button" onclick="cancelTaskEdit(${id})" class="btn task-edit-btn" style="background-color: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color);">Cancel</button>
                <button type="submit" class="btn task-edit-btn success-btn">Save</button>
            </div>
        </form>
    `;

    lucide.createIcons();
}

// Save Inline Edit task
async function saveTaskEdit(id) {
    const editedTitle = document.getElementById(`edit-title-${id}`).value.trim();
    const editedDesc = document.getElementById(`edit-desc-${id}`).value.trim();
    const editedDateVal = document.getElementById(`edit-date-${id}`).value;
    const editedDate = editedDateVal || null;

    try {
        const response = await fetch(`${BASE_URL}/tasks/edit_task/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                title: editedTitle,
                desc: editedDesc,
                due_date: editedDate
            })
        });

        const data = await response.json();

        if (response.ok) {
            showToast("Task updated successfully", "success");
            getTasks();
        } else {
            showToast(data.detail || data.message || "Failed to update task", "error");
        }
    } catch (error) {
        console.error("Edit save error:", error);
        showToast("Error updating task.", "error");
    }
}

// Cancel Inline Edit task
function cancelTaskEdit(id) {
    renderTasks();
}

// Update Dashboard Statistics Card Numbers
function updateDashboardStats() {
    const totalEl = document.getElementById("stat-total");
    const pendingEl = document.getElementById("stat-pending");
    const completedEl = document.getElementById("stat-completed");

    if (!totalEl || !pendingEl || !completedEl) return;

    const total = allTasks.length;
    const pending = allTasks.filter(t => t.status === "pending").length;
    const completed = allTasks.filter(t => t.status === "completed").length;

    totalEl.textContent = total;
    pendingEl.textContent = pending;
    completedEl.textContent = completed;
}

// Change Filtering Pillar Tabs
function setFilter(filter) {
    currentFilter = filter;
    
    // Update active tab styling
    document.querySelectorAll(".pill-tab").forEach(tab => {
        tab.classList.remove("active");
    });
    
    const activeTab = document.getElementById(`filter-${filter}`);
    if (activeTab) activeTab.classList.add("active");

    renderTasks();
}

// Handle search text change
function filterTasks() {
    const searchVal = document.getElementById("search-input").value.trim();
    const clearBtn = document.getElementById("search-clear-btn");
    
    if (clearBtn) {
        clearBtn.style.display = searchVal ? "flex" : "none";
    }
    
    renderTasks();
}

function clearSearch() {
    const searchInput = document.getElementById("search-input");
    if (searchInput) searchInput.value = "";
    
    const clearBtn = document.getElementById("search-clear-btn");
    if (clearBtn) clearBtn.style.display = "none";
    
    renderTasks();
}