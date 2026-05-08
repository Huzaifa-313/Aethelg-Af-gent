# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: agent-zero-main\api\transcribe.py
# Merge Date: 2026-05-07T19:26:39.701431
# ---

from helpers.api import ApiHandler, Request, Response

from helpers import runtime, settings, whisper

class Transcribe(ApiHandler):
    async def process(self, input: dict, request: Request) -> dict | Response:
        audio = input.get("audio")
        ctxid = input.get("ctxid", "")

        if ctxid:
            context = self.use_context(ctxid)

        # if not await whisper.is_downloaded():
        #     context.log.log(type="info", content="Whisper STT model is currently being initialized, please wait...")

        set = settings.get_settings()
        result = await whisper.transcribe(set["stt_model_size"], audio) # type: ignore
        return result
