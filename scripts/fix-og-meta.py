#!/usr/bin/env python3
"""Restore index.html Cyrillic and set absolute OG meta for link previews."""

from __future__ import annotations

import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "index.html"
BASE = "https://yehhialeksandra.github.io/portfolio"

OG_TITLE = "Yehhi Aleksandra | \u043c\u0435\u0434\u0438\u0430-\u0430\u0432\u0442\u043e\u043c\u0430\u0442\u0438\u0437\u0430\u0446\u0438\u044f"
OG_DESC = (
    "\u041c\u0435\u0434\u0438\u0430-\u0430\u0432\u0442\u043e\u043c\u0430\u0442\u0438\u0437\u0430\u0446\u0438\u044f "
    "\u0438 B2B-\u043a\u043e\u043d\u0442\u0435\u043d\u0442 \u0438\u0437 \u041c\u0438\u043d\u0441\u043a\u0430. "
    "\u0421\u0435\u0442\u043a\u0430 \u043a\u0430\u043d\u0430\u043b\u043e\u0432, \u0430\u0432\u0442\u043e\u043f\u0443\u0431\u043b\u0438\u043a\u0430\u0446\u0438\u044f "
    "\u0438 Telegram."
)
OG_ALT = (
    "Yehhi Aleksandra \u2014 \u043c\u0435\u0434\u0438\u0430-\u0430\u0432\u0442\u043e\u043c\u0430\u0442\u0438\u0437\u0430\u0446\u0438\u044f "
    "\u0438 B2B-\u043a\u043e\u043d\u0442\u0435\u043d\u0442"
)

OLD_BLOCK = """    <meta property="og:type" content="website" />
    <meta property="og:url" content="/" />
    <meta property="og:locale" content="ru_RU" />
    <meta property="og:locale:alternate" content="en_US" />
    <meta property="og:image" content="./assets/og-preview.png" />
    <link rel="canonical" href="/" id="canonical-link" />
    <link rel="alternate" hreflang="ru" href="/" id="hreflang-ru" />
    <link rel="alternate" hreflang="en" href="/" id="hreflang-en" />
    <link rel="alternate" hreflang="x-default" href="/" id="hreflang-default" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image" content="./assets/og-preview.png" />"""

NEW_BLOCK = f"""    <meta property="og:type" content="website" />
    <meta property="og:url" content="{BASE}/" />
    <meta property="og:locale" content="ru_RU" />
    <meta property="og:locale:alternate" content="en_US" />
    <meta property="og:image" content="{BASE}/assets/og-preview.png" />
    <meta property="og:image:alt" content="{OG_ALT}" />
    <link rel="canonical" href="{BASE}/" id="canonical-link" />
    <link rel="alternate" hreflang="ru" href="{BASE}/" id="hreflang-ru" />
    <link rel="alternate" hreflang="en" href="{BASE}/" id="hreflang-en" />
    <link rel="alternate" hreflang="x-default" href="{BASE}/" id="hreflang-default" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="{OG_TITLE}" />
    <meta name="twitter:description" content="{OG_DESC}" />
    <meta name="twitter:image" content="{BASE}/assets/og-preview.png" />"""


def main() -> None:
    text = subprocess.check_output(
        ["git", "show", "4061bcb:index.html"],
        cwd=ROOT,
        text=True,
        encoding="utf-8",
    )
    if OLD_BLOCK not in text:
        raise SystemExit("Expected OG block not found in restored index.html")

    text = text.replace(
        'content="Yehhi Aleksandra | \u043c\u0435\u0434\u0438\u0430-\u0430\u0432\u0442\u043e\u043c\u0430\u0442\u0438\u0437\u0430\u0446\u0438\u044f"',
        f'content="{OG_TITLE}"',
        1,
    )
    text = text.replace(OLD_BLOCK, NEW_BLOCK, 1)
    INDEX.write_text(text, encoding="utf-8")
    print(f"Wrote {INDEX} ({INDEX.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
