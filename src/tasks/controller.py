from fastapi import HTTPException,status
from sqlalchemy.orm import Session
from src.tasks.schemas import TaskCreateSchema,TaskEditSchema
from src.tasks.models import TaskModel
from src.tasks.enum import StatusEnum
from datetime import date
from src.users.models import UserModel

def create_task(body : TaskCreateSchema, db : Session, user:UserModel):
    new_task = TaskModel(
        title = body.title,
        desc = body.desc,
        status = body.status,
        due_date = body.due_date,
        user_id = user.id
    )

    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    return {
        "message":"Task Created Successfully",
        "data":new_task
    }

def get_all_tasks(db : Session,status:StatusEnum, due_date:date, user:UserModel):
    query = db.query(TaskModel).filter(TaskModel.user_id == user.id)

    if status:
        query = query.filter(TaskModel.status == status)

    if due_date:
        query = query.filter(TaskModel.due_date == due_date)

    tasks = query.all()

    if not tasks :
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Tasks not found") 

    return {
        "message":"Tasks Fetched Successfully",
        "data":tasks
    }

def get_task_by_id(id : int, db : Session, user : UserModel):
    task = db.query(TaskModel).get(id)
    
    if task.user_id != user.id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="You are not Authorized")

    if not task : 
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Task ID not found")
    
    return {
        "message":"Tasks Fetched Successfully",
        "data":task
    }

def edit_task(id : int ,body : TaskEditSchema, db : Session, user : UserModel):
    task = db.query(TaskModel).get(id)

    if task.user_id != user.id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="You are not Authorized")

    if not task : 
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Task ID not found")
    
    data = body.model_dump(exclude_unset=True)

    for field,value in data.items():
        setattr(task,field,value)

    db.add(task)
    db.commit()
    db.refresh(task)

    return {
        "message":"Tasks Updated Successfully",
        "data":task
    }

def delete_task(id : int, db : Session, user : UserModel):
    task = db.query(TaskModel).get(id)

    if task.user_id != user.id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="You are not Authorized")

    if not task : 
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Task ID not found")
    
    db.delete(task)
    db.commit()

    return None