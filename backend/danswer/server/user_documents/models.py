from typing import List

from fastapi import APIRouter
from pydantic import BaseModel

from danswer.db.models import UserFile
from danswer.db.models import UserFolder


router = APIRouter()


class FolderResponse(BaseModel):
    id: int
    name: str
    parent_id: int | None = None

    def dict(self):
        return self.model_dump()

    @classmethod
    def from_model(cls, model: UserFolder):
        return cls(id=model.id, name=model.name, parent_id=model.parent_id)


class FolderDetailResponse(FolderResponse):
    children: List[FolderResponse]
    files: List[dict]


class FolderFullDetailResponse(FolderDetailResponse):
    parents: List[FolderResponse]


class FileResponse(BaseModel):
    id: int
    name: str
    document_id: str
    parent_folder_id: int | None = None

    def dict(self):
        return self.model_dump()

    @classmethod
    def from_model(cls, model: UserFile):
        return cls(
            id=model.id,
            name=model.name,
            parent_folder_id=model.parent_folder_id,
            document_id=model.document_id,
        )


class MessageResponse(BaseModel):
    message: str
