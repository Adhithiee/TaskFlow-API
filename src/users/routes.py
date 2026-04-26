from fastapi import APIRouter,Depends,status,Response,Request
from src.users.schemas import UserRegisterSchema,APIResponseSchema,UserLoginSchema
from sqlalchemy.orm import Session
from src.utils.db import get_db
from src.users import controller

user_routes = APIRouter(prefix="/users")

@user_routes.post("/register_user",response_model=APIResponseSchema,status_code=status.HTTP_201_CREATED)
def register_user(body : UserRegisterSchema,db : Session = Depends(get_db)):
    return controller.register_user(body,db)

@user_routes.post("/login_user",status_code=status.HTTP_200_OK)
def login_user(body: UserLoginSchema,db: Session = Depends(get_db)):
    return controller.login_user(body,db)

@user_routes.get("/get_all_users",response_model=APIResponseSchema,status_code=status.HTTP_200_OK)
def get_all_users(db: Session = Depends(get_db)):
    return controller.get_all_users(db)

@user_routes.post("/is_auth",response_model=APIResponseSchema,status_code=status.HTTP_200_OK)
def is_auth(request: Request,db: Session = Depends(get_db)):
    return controller.is_auth(request,db)
