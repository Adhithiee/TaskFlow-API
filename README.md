# 🌊 TaskFlow API

> **Your personal, smart API for managing tasks and boosting productivity.** 

Welcome to **TaskFlow**! This is a backend REST API built with FastAPI, designed to handle users and their daily tasks smoothly and efficiently. Whether you're building a sleek frontend task manager or just need a robust backend to keep your to-do lists in check, TaskFlow has you covered.

![Python](https://img.shields.io/badge/python-3.10+-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=flat&logo=fastapi)
![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-black?style=flat&logo=sqlalchemy)

---

## ✨ What does it do?

TaskFlow provides a clean, fast, and structured way to:
- 👤 **Manage Users:** Create and handle user accounts seamlessly.
- 📝 **Track Tasks:** Keep track of what needs to be done. 
- 🚀 **Stay Fast:** Built on top of FastAPI, it's incredibly quick and comes with auto-generated documentation out of the box.

## 🛠 What's under the hood?

We kept the stack modern, fast, and reliable:
- **Framework:** FastAPI (Python)
- **Database:** SQLAlchemy ORM (compatible with SQLite, PostgreSQL, etc.)
- **Migrations:** Alembic
- **Architecture:** Clean, modularized routing for `users` and `tasks`

---

## 🚀 Let's get it running!

Want to spin this up on your own machine? It's super easy. 

### 1. Grab the code
First, clone the repo and jump into the directory:
```bash
git clone <your-repo-url>
cd TaskFlow-API
```

### 2. Set up your environment
It's always best to use a virtual environment so we don't mess with your global Python setup:
```bash
python -m venv env
# On Windows:
env\Scripts\activate
# On Mac/Linux:
source env/bin/activate
```

### 3. Install the good stuff
Make sure to install the required dependencies (assuming you have a `requirements.txt` file!):
```bash
pip install -r requirements.txt
```

### 4. Set up your Database 
Make sure you create a `.env` file to hold your database URLs and any secret keys. 

TaskFlow uses Alembic for database migrations. To ensure your database schema is up to date, run:
```bash
alembic upgrade head
```
*(Note: We also have `Base.metadata.create_all` running in `main.py` which will act as a fallback to create tables automatically!)*

### 5. Fire it up 🔥
Run the development server:
```bash
fastapi dev main.py
```
Or, if you're using Uvicorn directly:
```bash
uvicorn main:app --reload
```

---

## 🎮 How to use it

Once the server is running, the magic happens in your browser. FastAPI automatically generates beautiful, interactive API documentation that you can use to test everything instantly.

Head over to:
👉 **[http://localhost:8000/docs](http://localhost:8000/docs)**

From there, you can interact with all the endpoints for:
- `/users/` 
- `/tasks/`

Happy coding, and may your to-do lists always be completed! 🚀
