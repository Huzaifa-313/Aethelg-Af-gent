# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: agent-zero-main\helpers\login.py
# Merge Date: 2026-05-07T19:27:05.521979
# ---

from helpers import dotenv
import hashlib


def get_credentials_hash():
    user = dotenv.get_dotenv_value(dotenv.KEY_AUTH_LOGIN)
    password = dotenv.get_dotenv_value(dotenv.KEY_AUTH_PASSWORD)
    if not user:
        return None
    return hashlib.sha256(f"{user}:{password}".encode()).hexdigest()


def is_login_required():
    user = dotenv.get_dotenv_value(dotenv.KEY_AUTH_LOGIN)
    return bool(user)
