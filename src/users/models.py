from src.utils.db import Base
from sqlalchemy import Column,Integer,String

class UserModel(Base):
    __tablename__ = "user_table"

    id = Column(Integer,primary_key = True)
    name = Column(String)
    username = Column(String)
    password = Column(String)
    email = Column(String)