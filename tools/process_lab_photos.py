#!/usr/bin/env python3
"""Process laboratory photographs for the compliance page."""
from __future__ import annotations

import json
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "images"
OUT = ROOT / "src/assets/img/lab"
MANIFEST = ROOT / "src/assets/img/_manifest.json"


def orient(im: Image.Image) -> Image.Image:
    return ImageOps.exif_transpose(im)


def crop_box(im: Image.Image, box: tuple[int, int, int, int]) -> Image.Image:
    return im.crop(box)


def resize_longest(im: Image.Image, max_edge: int) -> Image.Image:
    w, h = im.size
    longest = max(w, h)
    if longest <= max_edge:
        return im
    scale = max_edge / longest
    return im.resize((max(1, round(w * scale)), max(1, round(h * scale))), Image.Resampling.LANCZOS)


def save_jpeg(im: Image.Image, path: Path, max_edge: int = 1600) -> dict:
    im = orient(im).convert("RGB")
    im = resize_longest(im, max_edge)
    path.parent.mkdir(parents=True, exist_ok=True)
    im.save(
        path,
        format="JPEG",
        quality=82,
        progressive=True,
        optimize=True,
    )
    return {"width": im.width, "height": im.height, "bytes": path.stat().st_size}


def white_label_bbox(im: Image.Image, threshold: int = 185) -> tuple[int, int, int, int]:
    rgb = im.convert("RGB")
    w, h = rgb.size
    px = rgb.load()
    minx, miny, maxx, maxy = w, h, 0, 0
    for y in range(h):
        for x in range(w):
            r, g, b = px[x, y]
            if r >= threshold and g >= threshold and b >= threshold:
                minx = min(minx, x)
                miny = min(miny, y)
                maxx = max(maxx, x)
                maxy = max(maxy, y)
    pad = 8
    return (
        max(0, minx - pad),
        max(0, miny - pad),
        min(w, maxx + pad + 1),
        min(h, maxy + pad + 1),
    )


CALIBRATION_CROPS: dict[str, tuple[int, int, int, int]] = {
    "photo_2026-09-01_17-23-45.jpg": (203, 688, 756, 948),
    "photo_2026-09-01_17-23-42.jpg": (330, 695, 710, 920),
}


def find_label_line_bands(label: Image.Image) -> list[tuple[int, int]]:
    """Detect one band per printed line on a tight label crop."""
    w, h = label.size
    px = label.load()
    margin = int(w * 0.05)
    counts = [
        sum(1 for x in range(margin, w - margin) if sum(px[x, y]) < 300)
        for y in range(h)
    ]
    avg = sum(counts) / len(counts)
    threshold = avg + 5

    bands: list[tuple[int, int]] = []
    in_band = False
    gap_rows = 0
    start = 0

    for y, count in enumerate(counts):
        if count > threshold:
            if not in_band:
                start = y
                in_band = True
            gap_rows = 0
        elif in_band:
            gap_rows += 1
            if gap_rows >= 8:
                bands.append((start, y - gap_rows + 1))
                in_band = False

    if in_band:
        bands.append((start, h))

    return [band for band in bands if band[1] - band[0] >= 12]


def normalize_content_bands(
    bands: list[tuple[int, int]], label_height: int
) -> list[tuple[int, int]]:
    if len(bands) >= 6 and bands[0][0] < label_height * 0.2:
        bands = bands[1:]
    if len(bands) > 5:
        bands = bands[:5]
    return bands


def remove_tel_line(label: Image.Image) -> Image.Image:
    """Drop the telephone contact line; keep company name, serial, CE and validity."""
    bands = normalize_content_bands(find_label_line_bands(label), label.height)
    if len(bands) < 2:
        return label

    drop = 1  # second line on METROCERT labels
    w = label.width
    keep = [band for idx, band in enumerate(bands) if idx != drop]
    pad = 2
    parts = [label.crop((0, start, w, end)) for start, end in keep]

    total_h = sum(part.height for part in parts) + max(0, len(parts) - 1) * pad
    out = Image.new("RGB", (w, total_h), (255, 255, 255))
    y = 0
    for idx, part in enumerate(parts):
        out.paste(part, (0, y))
        y += part.height
        if idx < len(parts) - 1:
            y += pad
    return out


def process_calibration(src: Path, dest: Path) -> dict:
    im = orient(Image.open(src)).convert("RGB")
    label = crop_box(im, CALIBRATION_CROPS[src.name])
    label = remove_tel_line(label)
    return save_jpeg(label, dest, max_edge=800)


def main() -> None:
    jobs = []

    im12 = orient(Image.open(SRC / "photo_12_2026-05-01_12-39-05.jpg"))
    jobs.append(
        (
            "hipot-test-4244v-pass.jpg",
            crop_box(im12, (110, 35, 1165, 705)),
            1600,
        )
    )

    im13 = orient(Image.open(SRC / "photo_13_2026-05-01_12-39-05.jpg"))
    jobs.append(
        (
            "module-under-hipot-test.jpg",
            crop_box(im13, (170, 110, 1110, 660)),
            1600,
        )
    )

    im38 = orient(Image.open(SRC / "photo_2026-09-01_17-23-38.jpg"))
    jobs.append(
        (
            "miniplc-under-hipot-test.jpg",
            crop_box(im38, (70, 90, 860, 1180)),
            1600,
        )
    )

    im_pcb = orient(Image.open(SRC / "P1 Myrra 48027 - Copy (5).bmp"))
    jobs.append(
        (
            "clearance-measurement-pcb.jpg",
            crop_box(im_pcb, (0, 360, 448, 760)),
            1600,
        )
    )

    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    report = []

    for name, image, max_edge in jobs:
        meta = save_jpeg(image, OUT / name, max_edge=max_edge)
        key = f"/assets/img/lab/{name}"
        manifest[key] = meta
        report.append((name, meta))

    for src_name, dest_name in (
        ("photo_2026-09-01_17-23-45.jpg", "calibration-label-1.jpg"),
        ("photo_2026-09-01_17-23-42.jpg", "calibration-label-2.jpg"),
    ):
        meta = process_calibration(SRC / src_name, OUT / dest_name)
        key = f"/assets/img/lab/{dest_name}"
        manifest[key] = meta
        report.append((dest_name, meta))

    MANIFEST.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")

    print("Processed lab photographs:")
    for name, meta in report:
        print(f"  {name}: {meta['width']}x{meta['height']}, {meta['bytes']} bytes")


if __name__ == "__main__":
    main()
