from fastapi import HTTPException,Depends,Request,status
from sqlalchemy.orm import Session
from src.utils.settings import settings
import jwt
from src.users.models import UserModel
from jwt.exceptions import InvalidTokenError
from src.utils.db import get_db

def is_auth(request: Request, db:Session = Depends(get_db)):
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
