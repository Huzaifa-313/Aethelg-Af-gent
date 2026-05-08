# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: agent-zero-main\api\chat_files_path_get.py
# Merge Date: 2026-05-07T19:26:30.102432
# ---

from helpers.api import ApiHandler, Request, Response
from helpers import files, projects, settings


class GetChatFilesPath(ApiHandler):
    async def process(self, input: dict, request: Request) -> dict | Response:
        ctxid = input.get("ctxid", "")
        if not ctxid:
            raise Exception("No context id provided")
        context = self.use_context(ctxid)

        project_name = projects.get_context_project_name(context)
        if project_name:
            folder = files.normalize_a0_path(projects.get_project_folder(project_name))
        else:
            folder = settings.get_settings()["workdir_path"]

        return {
            "ok": True,
            "path": folder,
        }