#!/usr/bin/env python3
"""Redact plant-identifying text from project screenshots. Keeps originals untouched."""

from pathlib import Path

from PIL import Image, ImageDraw

PROJECTS = Path(__file__).resolve().parent.parent / "images" / "projects"


def redact_ovation(src: Path, dst: Path) -> None:
    im = Image.open(src).convert("RGB")
    draw = ImageDraw.Draw(im)
    # Legend tag names (2MAX11CG…) — leave numeric values and curves visible
    boxes = [
        (165, 226, 900, 251),
        (165, 252, 930, 277),
        (165, 278, 820, 303),
    ]
    for box in boxes:
        draw.rectangle(box, fill=(0, 0, 0))
    im.save(dst, "JPEG", quality=82, progressive=True)


def redact_substation(src: Path, dst: Path) -> None:
    im = Image.open(src).convert("RGB")
    draw = ImageDraw.Draw(im)
    w, h = im.size
    boxes = [
        # Blue line-name labels on single-line diagram
        (int(w * 0.15), int(h * 0.22), int(w * 0.30), int(h * 0.275)),
        (int(w * 0.62), int(h * 0.22), int(w * 0.76), int(h * 0.275)),
        # Alarm text line in header bar (bay identifier)
        (int(w * 0.38), int(h * 0.195), int(w * 0.96), int(h * 0.235)),
    ]
    for box in boxes:
        draw.rectangle(box, fill=(192, 192, 192))
    im.save(dst, "JPEG", quality=82, progressive=True)


def main() -> None:
    redact_ovation(
        PROJECTS / "ovation-turbine-trend.jpg",
        PROJECTS / "ovation-turbine-trend-redacted.jpg",
    )
    redact_substation(
        PROJECTS / "substation-220kv-scada.jpg",
        PROJECTS / "substation-220kv-scada-redacted.jpg",
    )
    print("Wrote redacted copies (originals unchanged)")


if __name__ == "__main__":
    main()
