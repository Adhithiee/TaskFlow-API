from fastapi import FastAPI
from src.tasks.routes import task_routes
from src.users.routes import user_routes
from src.utils.db import Base,engine

Base.metadata.create_all(engine)

app = FastAPI(title="TaskFlow - Smart Task & Productivity API")

app.include_router(task_routes)
app.include_router(user_routes)