# AETHELGARD MERGED FILE
# Origin Repository: collection-claude-code-source-code
# Original Path: clawspring\skill\__init__.py
# Merge Date: 2026-05-07T19:19:02.840686
# ---

"""skill package — reusable prompt templates (skills)."""
from .loader import (  # noqa: F401
    SkillDef,
    load_skills,
    find_skill,
    substitute_arguments,
    register_builtin_skill,
    _parse_skill_file,
    _parse_list_field,
)
from .executor import execute_skill  # noqa: F401

# Importing builtin registers the built-in skills
from . import builtin as _builtin  # noqa: F401
