# AETHELGARD MERGED FILE
# Origin Repository: OpenJarvis-main
# Original Path: src\openjarvis\recipes\__init__.py
# Merge Date: 2026-05-07T19:12:54.191454
# ---

"""Recipe system — composable primitive configurations."""

from openjarvis.recipes.composer import (
    recipe_to_eval_suite,
    recipe_to_operator,
)
from openjarvis.recipes.loader import (
    Recipe,
    discover_recipes,
    load_recipe,
    resolve_recipe,
)

__all__ = [
    "Recipe",
    "discover_recipes",
    "load_recipe",
    "recipe_to_eval_suite",
    "recipe_to_operator",
    "resolve_recipe",
]
