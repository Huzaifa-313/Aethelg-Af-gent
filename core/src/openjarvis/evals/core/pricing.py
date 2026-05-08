# AETHELGARD MERGED FILE
# Origin Repository: OpenJarvis-main
# Original Path: src\openjarvis\evals\core\pricing.py
# Merge Date: 2026-05-07T19:12:34.388453
# ---

"""Cost computation for agentic eval runs — wraps engine/cloud.py pricing."""

from __future__ import annotations

from openjarvis.engine.cloud import PRICING, estimate_cost


def compute_turn_cost(model: str, input_tokens: int, output_tokens: int) -> float:
    """Compute USD cost for a single agent turn.

    Delegates to the canonical ``estimate_cost()`` from ``engine/cloud.py``.
    Returns 0.0 for models not in the pricing table (e.g. local models).
    """
    return estimate_cost(model, input_tokens, output_tokens)


__all__ = ["PRICING", "compute_turn_cost", "estimate_cost"]
