from pydantic import BaseModel
from typing import Union,List

class UserRegisterSchema(BaseModel):
    name : str
    username : str
    password : str
    email : str

class UserResponseSchema(BaseModel):
    id : int
    name : str
    username : str
    # password : str
    email : str

class UserLoginSchema(BaseModel):
    username : str
    password : str

class APIResponseSchema(BaseModel):
    message : str
    data : Union[UserResponseSchema,List[UserResponseSchema]]