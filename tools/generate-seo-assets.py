#!/usr/bin/env python3
"""Generate og-default, page og crops, and PWA icons from the site logo."""
from __future__ import annotations

import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
IMG = ROOT / "src/assets/img"
OG = IMG / "og"
STATIC = ROOT / "static"
ICONS = STATIC / "icons"
BRAND_900 = (6, 58, 99)  # --brand-900 #063A63

OG_CROPS = {
    "combined-cycle.jpg": IMG / "projects/control-room-power-plant-videowall.jpg",
    "island-mode.jpg": IMG / "projects/ovation-turbine-trend-redacted.jpg",
    "plant-performance.jpg": IMG / "projects/emissions-monitoring-display.jpg",
    "compliance.jpg": IMG / "lab/module-under-hipot-test.jpg",
    "references.jpg": IMG / "projects/central-control-room-consoles.jpg",
}


def crop_cover(im: Image.Image, w: int, h: int) -> Image.Image:
    im = im.convert("RGB")
    src_w, src_h = im.size
    scale = max(w / src_w, h / src_h)
    resized = im.resize((round(src_w * scale), round(src_h * scale)), Image.Resampling.LANCZOS)
    left = (resized.width - w) // 2
    top = (resized.height - h) // 2
    return resized.crop((left, top, left + w, top + h))


def load_font(size: int, weight: int = 400) -> ImageFont.FreeTypeFont:
    candidates = [
        "/usr/share/fonts/google-ibm-plex-sans/IBMPlexSans-SemiBold.ttf" if weight >= 600 else "/usr/share/fonts/google-ibm-plex-sans/IBMPlexSans-Regular.ttf",
        "/usr/share/fonts/ibm-plex/IBMPlexSans-SemiBold.ttf" if weight >= 600 else "/usr/share/fonts/ibm-plex/IBMPlexSans-Regular.ttf",
        str(ROOT / "src/assets/fonts/IBMPlexSans-Regular.ttf"),
        "/usr/share/fonts/liberation-sans/LiberationSans-Regular.ttf",
        "/usr/share/fonts/dejavu/DejaVuSans.ttf",
    ]
    for path in candidates:
        if Path(path).exists():
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def save_jpg(path: Path, im: Image.Image, quality: int = 85) -> int:
    path.parent.mkdir(parents=True, exist_ok=True)
    im.save(path, "JPEG", quality=quality, optimize=True)
    return path.stat().st_size


def make_og_default() -> None:
    w, h = 1200, 630
    canvas = Image.new("RGB", (w, h), BRAND_900)
    logo = Image.open(IMG / "isystems-automation-logo.png").convert("RGBA")
    logo_max = 220
    ratio = min(logo_max / logo.width, logo_max / logo.height)
    logo = logo.resize((round(logo.width * ratio), round(logo.height * ratio)), Image.Resampling.LANCZOS)
    canvas.paste(logo, ((w - logo.width) // 2, 120), logo)

    draw = ImageDraw.Draw(canvas)
    title_font = load_font(52, 600)
    sub_font = load_font(30, 400)
    title = "ISYSTEMS AUTOMATION"
    subtitle = "Industrial control systems since 2007"
    tw = draw.textlength(title, font=title_font)
    sw = draw.textlength(subtitle, font=sub_font)
    draw.text(((w - tw) / 2, 360), title, fill=(255, 255, 255), font=title_font)
    draw.text(((w - sw) / 2, 430), subtitle, fill=(200, 220, 235), font=sub_font)

    out = IMG / "og-default.jpg"
    size = save_jpg(out, canvas, quality=88)
    if size > 200_000:
        size = save_jpg(out, canvas, quality=78)
    print(f"og-default.jpg {out.stat().st_size // 1024} KB")


def make_og_crops() -> None:
    OG.mkdir(parents=True, exist_ok=True)
    for name, src in OG_CROPS.items():
        im = crop_cover(Image.open(src), 1200, 630)
        save_jpg(OG / name, im)
        print(f"og/{name}")


def make_icons() -> None:
    logo = Image.open(IMG / "isystems-automation-logo.png").convert("RGBA")
    STATIC.mkdir(parents=True, exist_ok=True)
    ICONS.mkdir(parents=True, exist_ok=True)

    def square_icon(size: int, pad: float = 0.12) -> Image.Image:
        side = int(size * (1 - pad * 2))
        ratio = min(side / logo.width, side / logo.height)
        lw, lh = round(logo.width * ratio), round(logo.height * ratio)
        resized = logo.resize((lw, lh), Image.Resampling.LANCZOS)
        canvas = Image.new("RGBA", (size, size), BRAND_900 + (255,))
        canvas.paste(resized, ((size - lw) // 2, (size - lh) // 2), resized)
        return canvas.convert("RGB")

    square_icon(180).save(STATIC / "apple-touch-icon.png", "PNG", optimize=True)
    square_icon(192).save(ICONS / "icon-192.png", "PNG", optimize=True)
    square_icon(512).save(ICONS / "icon-512.png", "PNG", optimize=True)
    (IMG / "favicon.ico").copy(STATIC / "favicon.ico")
    print("icons + favicon.ico at site root")


def write_manifest() -> None:
    manifest = {
        "name": "ISYSTEMS AUTOMATION",
        "short_name": "ISYSTEMS",
        "theme_color": "#063A63",
        "background_color": "#063A63",
        "display": "standalone",
        "icons": [
            {"src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png"},
            {"src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png"},
        ],
    }
    (STATIC / "site.webmanifest").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print("site.webmanifest")


def main() -> None:
    make_og_default()
    make_og_crops()
    make_icons()
    write_manifest()


if __name__ == "__main__":
    main()
