# AETHELGARD MERGED FILE
# Origin Repository: OpenJarvis-main
# Original Path: src\openjarvis\learning\intelligence\__init__.py
# Merge Date: 2026-05-07T19:12:48.474458
# ---

"""Intelligence learning — model fine-tuning via SFT and GRPO."""

from __future__ import annotations

# Import trainers so their @LearningRegistry.register decorators execute.
try:
    from openjarvis.learning.intelligence import sft_trainer as _sft  # noqa: F401
except ImportError:
    pass
try:
    from openjarvis.learning.intelligence import grpo_trainer as _grpo  # noqa: F401
except ImportError:
    pass
