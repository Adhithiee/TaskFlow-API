from fastapi import APIRouter,HTTPException,Depends,status
from sqlalchemy.orm import Session
from src.tasks.schemas import APIResponseSchema,TaskCreateSchema,TaskEditSchema
from src.utils.db import get_db
from src.tasks import controller
from typing import List
from src.tasks.enum import StatusEnum
from datetime import date
from src.users.models import UserModel
from src.utils.helper import is_auth

task_routes = APIRouter(prefix = "/tasks")

@task_routes.post("/create_task",response_model=APIResponseSchema,status_code=status.HTTP_201_CREATED)
def create_task(body : TaskCreateSchema,db : Session = Depends(get_db),user: UserModel = Depends(is_auth)):
    print(user.id)
    return controller.create_task(body,db,user)

@task_routes.get("/get_all_tasks",response_model=APIResponseSchema,status_code=status.HTTP_200_OK)
def get_all_tasks(db : Session = Depends(get_db), status:StatusEnum | None = None, due_date:date | None=None,user: UserModel = Depends(is_auth)):
    return controller.get_all_tasks(db,status,due_date,user)

@task_routes.get("/get_task_by_id/{id}",response_model=APIResponseSchema,status_code=status.HTTP_200_OK)
def get_task_by_id(id : int,db : Session = Depends(get_db),user: UserModel = Depends(is_auth)):
    return controller.get_task_by_id(id,db,user)

@task_routes.put("/edit_task/{id}",response_model=APIResponseSchema,status_code=status.HTTP_200_OK)
def edit_task(id : int, body : TaskEditSchema,db : Session = Depends(get_db),user: UserModel = Depends(is_auth)):
    return controller.edit_task(id,body,db,user)

@task_routes.delete("/delete_task/{id}",status_code=status.HTTP_204_NO_CONTENT)
def delete_task(id : int,db : Session = Depends(get_db),user: UserModel = Depends(is_auth)):
    return controller.delete_task(id,db,user)