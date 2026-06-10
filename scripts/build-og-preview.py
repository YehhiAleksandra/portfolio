#!/usr/bin/env python3
"""Build a 1200x630 Open Graph card with full character + branding."""

from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"
OUT = ASSETS / "og-preview.png"

W, H = 1200, 630
BG = (247, 247, 239)
FG = (37, 34, 34)
MUTED = (116, 116, 111)
ACCENT = (0, 0, 238)

SERIF = Path("/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf")
SANS = Path("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf")


def load_font(path: Path, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(path), size)


def main() -> int:
    cutout_path = Path(sys.argv[1]) if len(sys.argv) > 1 else ASSETS / "hero-character.png"
    if not cutout_path.is_file():
        print(f"Missing cutout: {cutout_path}", file=sys.stderr)
        return 1

    canvas = Image.new("RGB", (W, H), BG)
    character = Image.open(cutout_path).convert("RGBA")

    max_height = 540
    scale = max_height / character.height
    new_size = (int(character.width * scale), max_height)
    character = character.resize(new_size, Image.Resampling.LANCZOS)

    x_char = W - new_size[0] - 48
    y_char = H - max_height - 24
    canvas.paste(character, (x_char, y_char), character)

    draw = ImageDraw.Draw(canvas)
    title_font = load_font(SERIF, 54)
    sub_font = load_font(SANS, 30)
    tag_font = load_font(SANS, 22)

    left = 72
    draw.rectangle([left, 168, left + 56, 172], fill=ACCENT)
    draw.text((left, 188), "Yehhi Aleksandra", fill=FG, font=title_font)
    draw.text((left, 262), "\u043c\u0435\u0434\u0438\u0430-\u0430\u0432\u0442\u043e\u043c\u0430\u0442\u0438\u0437\u0430\u0446\u0438\u044f", fill=FG, font=sub_font)
    draw.text(
        (left, 308),
        "B2B-\u043a\u043e\u043d\u0442\u0435\u043d\u0442 \u2022 Telegram \u2022 \u0441\u0435\u0442\u043a\u0430 \u043a\u0430\u043d\u0430\u043b\u043e\u0432",
        fill=MUTED,
        font=tag_font,
    )
    draw.text(
        (left, 360),
        "yehhialeksandra.github.io/portfolio",
        fill=MUTED,
        font=tag_font,
    )

    OUT.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(OUT, format="PNG", optimize=True)
    print(f"Wrote {OUT} ({OUT.stat().st_size // 1024} KB)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
