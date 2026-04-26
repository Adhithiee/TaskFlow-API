from src.utils.db import Base
from sqlalchemy import Column,String,Integer,Date,Enum,ForeignKey
from src.tasks.enum import StatusEnum

class TaskModel(Base):
    __tablename__ = "task_table"

    id = Column(Integer, primary_key=True)
    title = Column(String)
    desc = Column(String)
    status = Column(Enum(StatusEnum),default=StatusEnum.pending)
    due_date = Column(Date, nullable=True)
    user_id = Column(Integer, ForeignKey("user_table.id", ondelete="CASCADE"))