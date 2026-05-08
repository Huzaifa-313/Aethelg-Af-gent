# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: agent-zero-main\api\backup_get_defaults.py
# Merge Date: 2026-05-07T19:26:28.446432
# ---

from helpers.api import ApiHandler, Request, Response
from helpers.backup import BackupService


class BackupGetDefaults(ApiHandler):
    @classmethod
    def requires_auth(cls) -> bool:
        return True

    @classmethod
    def requires_loopback(cls) -> bool:
        return False

    async def process(self, input: dict, request: Request) -> dict | Response:
        try:
            backup_service = BackupService()
            default_metadata = backup_service.get_default_backup_metadata()

            return {
                "success": True,
                "default_patterns": {
                    "include_patterns": default_metadata["include_patterns"],
                    "exclude_patterns": default_metadata["exclude_patterns"]
                },
                "metadata": default_metadata
            }

        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
