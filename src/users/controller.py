from fastapi import status,Response,HTTPException,Request
from src.users.schemas import UserRegisterSchema,UserLoginSchema
from sqlalchemy.orm import Session
from src.users.models import UserModel
from pwdlib import PasswordHash
from datetime import datetime,timedelta
from src.utils.settings import settings
import jwt
from jwt import InvalidTokenError

password_hash = PasswordHash.recommended()

def get_hashed_password(password):
    return password_hash.hash(password)

def verify_password(plainPassword, hashedPassword):
    return password_hash.verify(plainPassword,hashedPassword)

def register_user(body: UserRegisterSchema,db: Session):
    email = db.query(UserModel).filter(UserModel.email == body.email).first()
    if email:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="User email already exists")
    
    hashed_password = get_hashed_password(body.password)
    
    new_user = UserModel(
        name = body.name,
        username = body.username,
        password = hashed_password,
        email = body.email
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message" : "User Registered Successfully",
        "data" : new_user
    }

def login_user(body: UserLoginSchema, db: Session):
    user = db.query(UserModel).filter(UserModel.username == body.username).first()

    if user:
        if not verify_password(body.password,user.password):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail = "Incorrect Password")
        
        exp_time = datetime.now() + timedelta(minutes = settings.EXP_TIME)
        token = jwt.encode({"id":user.id,"exp":exp_time},settings.SECRET_KEY,settings.ALGORITHM)

        return {
            "message" : "User Logged In Successfully",
            "token" : token,
            "token_type" : "bearer" 
        }
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="User not Found")

def is_auth(request: Request, db:Session):
    try:
        token = request.headers.get("authorization")
        if not token:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="User not authorized")
        
        token = token.split(" ")[-1]
        data = jwt.decode(token,settings.SECRET_KEY,settings.ALGORITHM)
        user_id = data.get("id")

        user = db.query(UserModel).filter(UserModel.id == user_id).first()
        if not user:
            raise HTTPException(status_code = status.HTTP_404_NOT_FOUND,detail = "User not found")
        
        return user
    
    except InvalidTokenError:
        raise HTTPException(status_code = status.HTTP_401_UNAUTHORIZED,detail = "User is not authorized")


def get_all_users(db: Session):
    users = db.query(UserModel).all()

    return {
        "message" : "Users Fetched Successfully",
        "data" : users
    }