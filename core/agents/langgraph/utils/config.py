# MERGED FROM: langgraph-main
# SOURCE PATH: langgraph-main/libs/langgraph/langgraph/
# DATE: 2026-05-08T12:43:47.237360Z

"""Backwards compat imports for config utilities, to be removed in v1."""

from langgraph._internal._config import ensure_config, patch_configurable  # noqa: F401
from langgraph.config import get_config, get_store  # noqa: F401
