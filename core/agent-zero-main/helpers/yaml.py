# AETHELGARD MERGED FILE
# Origin Repository: other s
# Original Path: agent-zero-main\helpers\yaml.py
# Merge Date: 2026-05-07T19:27:14.207980
# ---

import json
import yaml


def loads(text: str):
    return yaml.safe_load(text)


def dumps(obj, **kwargs) -> str:
    dump_kwargs = {
        "allow_unicode": True,
        "sort_keys": False,
        **kwargs,
    }
    return yaml.safe_dump(obj, **dump_kwargs)


def from_json(text: str, **yaml_dump_kwargs) -> str:
    return dumps(json.loads(text), **yaml_dump_kwargs)


def to_json(text: str, **json_dump_kwargs) -> str:
    obj = loads(text)
    return json.dumps(obj, ensure_ascii=False, **json_dump_kwargs)
