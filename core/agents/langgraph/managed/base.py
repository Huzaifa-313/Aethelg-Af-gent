# MERGED FROM: langgraph-main
# SOURCE PATH: langgraph-main/libs/langgraph/langgraph/
# DATE: 2026-05-08T12:43:47.237360Z

from abc import ABC, abstractmethod
from inspect import isclass
from typing import (
    Any,
    Generic,
    TypeGuard,
    TypeVar,
)

from langgraph._internal._scratchpad import PregelScratchpad

V = TypeVar("V")
U = TypeVar("U")

__all__ = ("ManagedValueSpec", "ManagedValueMapping")


class ManagedValue(ABC, Generic[V]):
    @staticmethod
    @abstractmethod
    def get(scratchpad: PregelScratchpad) -> V: ...


ManagedValueSpec = type[ManagedValue]


def is_managed_value(value: Any) -> TypeGuard[ManagedValueSpec]:
    return isclass(value) and issubclass(value, ManagedValue)


ManagedValueMapping = dict[str, ManagedValueSpec]
