# MERGED FROM: langgraph-main
# SOURCE PATH: langgraph-main/libs/langgraph/langgraph/
# DATE: 2026-05-08T12:43:47.237360Z

"""Exports package version."""

from importlib import metadata

__all__ = ("__version__",)

try:
    __version__ = metadata.version(__package__)
except metadata.PackageNotFoundError:
    # Case where package metadata is not available.
    __version__ = ""
del metadata  # optional, avoids polluting the results of dir(__package__)
