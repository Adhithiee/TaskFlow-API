const BASE_URL = "http://127.0.0.1:8000";

let token = localStorage.getItem("token") || "";

async function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const response = await fetch(`${BASE_URL}/users/login_user`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    if (!data.token) {
        alert("Invalid credentials")
        return;
    }

    token = data.token
    localStorage.setItem("token", token);

    console.log("TOKEN: ", token)

    alert("Login Successful")
}

async function createTask() {
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const due_date = document.getElementById("due_date").value;

    const response = await fetch(`${BASE_URL}/tasks/create_task`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            title,
            desc: description,
            due_date: due_date || null,
            status: "pending"
        })
    });
    const data = await response.json()
    alert(data.message)

    getTasks();
}

async function getTasks() {
    const response = await fetch(`${BASE_URL}/tasks/get_all_tasks`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    const result = await response.json()
    const tasks = result.data

    const list = document.getElementById("taskList");
    list.innerHTML = "";

    tasks.forEach(task => {
        const li = document.createElement("li");

        li.innerHTML = `
        <strong>${task.title}</strong> (${task.status}) <br>
            ${task.desc} <br>
            Due: ${task.due_date || "N/A"} <br>
            <button onclick="deleteTask(${task.id})">Delete</button>

        `;

        list.appendChild(li)
    });
}

async function deleteTask(id) {
    await fetch(`${BASE_URL}/tasks/delete_task/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    getTasks();
}