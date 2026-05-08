# AETHELGARD MERGED FILE
# Origin Repository: free-claude-code-main
# Original Path: tests\messaging\test_rendering_profiles.py
# Merge Date: 2026-05-07T19:21:05.750803
# ---

from messaging.rendering.profiles import build_rendering_profile


def test_discord_rendering_profile_has_plain_parse_mode():
    profile = build_rendering_profile("discord")

    assert profile.parse_mode is None
    assert profile.limit_chars == 1900
    assert profile.format_status("x", "Working", None).startswith("x")


def test_telegram_rendering_profile_uses_markdown_v2():
    profile = build_rendering_profile("telegram")

    assert profile.parse_mode == "MarkdownV2"
    assert profile.limit_chars == 3900
    assert profile.format_status("x", "Working", None).startswith("x")
