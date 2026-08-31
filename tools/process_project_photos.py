#!/usr/bin/env python3
"""Process project photographs for isa-site publication."""

from __future__ import annotations

import io
from pathlib import Path
from typing import Callable

from PIL import Image, ImageEnhance, ImageOps

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "images"
OUT = ROOT / "images" / "projects"
PREVIEW = ROOT / ".processing-preview"

JPEG_OPTS = {
    "format": "JPEG",
    "quality": 82,
    "progressive": True,
    "optimize": True,
    "subsampling": "4:2:0",
}


def load_rgb(path: Path) -> Image.Image:
    with Image.open(path) as im:
        return ImageOps.exif_transpose(im).convert("RGB")


def save_jpeg(im: Image.Image, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    buf = io.BytesIO()
    im.save(buf, **JPEG_OPTS)
    clean = Image.open(io.BytesIO(buf.getvalue())).convert("RGB")
    clean.save(dest, **JPEG_OPTS)
    if clean.getexif():
        raise RuntimeError(f"EXIF remained in {dest}")


def center_crop_banner(im: Image.Image, width: int = 1920, height: int = 480) -> Image.Image:
    target_ratio = width / height
    w, h = im.size
    src_ratio = w / h
    if src_ratio > target_ratio:
        new_w = int(h * target_ratio)
        left = (w - new_w) // 2
        box = (left, 0, left + new_w, h)
    else:
        new_h = int(w / target_ratio)
        top = (h - new_h) // 2
        box = (0, top, w, top + new_h)
    return im.crop(box).resize((width, height), Image.Resampling.LANCZOS)


def crop_bottom_percent(im: Image.Image, percent: float) -> Image.Image:
    w, h = im.size
    keep_h = int(h * (1 - percent / 100))
    return im.crop((0, 0, w, keep_h))


def enhance_rotor(im: Image.Image) -> Image.Image:
    step = ImageEnhance.Brightness(im).enhance(2.2)
    step = ImageEnhance.Contrast(step).enhance(1.65)
    return ImageEnhance.Color(step).enhance(1.15)


def side_by_side(before: Image.Image, after: Image.Image) -> Image.Image:
    target_h = 720

    def fit_height(img: Image.Image) -> Image.Image:
        w, h = img.size
        return img.resize((int(w * target_h / h), target_h), Image.Resampling.LANCZOS)

    b = fit_height(before)
    a = fit_height(after)
    gap = 12
    canvas = Image.new("RGB", (b.width + a.width + gap, target_h), (24, 24, 24))
    canvas.paste(b, (0, 0))
    canvas.paste(a, (b.width + gap, 0))
    return canvas


Transform = Callable[[Image.Image], Image.Image]


def process(
    src_name: str,
    out_name: str,
    transform: Transform | None = None,
    banner_name: str | None = None,
) -> list[Path]:
    src = SRC / src_name
    if not src.exists():
        raise SystemExit(f"Missing source: {src}")

    raw = load_rgb(src)
    produced: list[Path] = []

    if src_name == "P91017-112718.jpg":
        before = raw.copy()
        processed = enhance_rotor(raw)
        preview_path = PREVIEW / "generator-rotor-removal-before-after.jpg"
        save_jpeg(side_by_side(before, processed), preview_path)
        print(f"Preview: {preview_path}")
        im = processed
    else:
        im = transform(raw) if transform else raw

    main_dest = OUT / out_name
    save_jpeg(im, main_dest)
    produced.append(main_dest)
    print(f"Wrote {out_name} from {src_name} ({im.size[0]}x{im.size[1]})")

    if banner_name:
        wide_dest = OUT / banner_name
        save_jpeg(center_crop_banner(im), wide_dest)
        produced.append(wide_dest)
        print(f"Wrote {banner_name} banner 1920x480 from {src_name}")

    return produced


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    PREVIEW.mkdir(parents=True, exist_ok=True)

    produced: list[Path] = []
    produced += process("P10129-123315.jpg", "control-room-combined-cycle.jpg", banner_name="control-room-combined-cycle-wide.jpg")
    produced += process("P91102-104354.jpg", "yokogawa-centum-cabinet.jpg")
    produced += process("P00110-105955.jpg", "redundant-network-cabinet.jpg")
    produced += process("P91122-114040.jpg", "atex-zone2-barriers.jpg")
    produced += process("P00731-123821.jpg", "marshalling-cable-marking.jpg", transform=lambda im: crop_bottom_percent(im, 8))
    produced += process("P01104-082706.jpg", "steam-turbine-generator-hall.jpg", banner_name="steam-turbine-generator-hall-wide.jpg")
    produced += process("P10129-123925.jpg", "steam-turbine-casing.jpg")
    produced += process("P00214-131243.jpg", "turbine-installation.jpg")
    produced += process("P00129-140137.jpg", "turbine-diaphragm.jpg")
    produced += process("P91017-112718.jpg", "generator-rotor-removal.jpg")
    produced += process("20160124_111013.jpg", "ovation-turbine-trend.jpg")
    produced += process("20161006_114122.jpg", "emissions-monitoring-display.jpg")
    produced += process("P10205-152911.jpg", "substation-220kv-scada.jpg")

    print("\n=== Output files ===")
    for p in sorted(produced):
        with Image.open(p) as im:
            print(f"{p.relative_to(ROOT)}  {im.size[0]}x{im.size[1]}  {p.stat().st_size:,} bytes")

    # Verify marshalling watermark crop
    with Image.open(SRC / "P00731-123821.jpg") as orig:
        orig_h = orig.size[1]
    with Image.open(OUT / "marshalling-cable-marking.jpg") as out:
        out_h = out.size[1]
    print(f"\nMarshalling crop: {orig_h}px -> {out_h}px (removed {orig_h - out_h}px bottom)")


if __name__ == "__main__":
    main()
