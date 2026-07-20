#!/usr/bin/env python3
"""Convert PNG/JPEG brand logos in public/logo images → public/brand-logos/*.webp"""

from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "public" / "logo images"
DST = ROOT / "public" / "brand-logos"

SLUG = {
    "azure-logo.png": "microsoft-azure",
    "duality-logo.png": "duality-ai",
    "ETHINDIA-logo.png": "ethindia",
    "google-logo.png": "google",
    "pw-logo.png": "physics-wallah",
    "ton-png.png": "ton",
    "cokestudio-logo.png": "coke-studio",
    "geeksforgeeks-logo.png": "geeksforgeeks",
    "knor-png.png": "knorr",
    "nestle-logo.png": "nestle",
    "youtube-logo.png": "youtube",
}

MAX_EDGE = 480
QUALITY = 78


def main():
    DST.mkdir(parents=True, exist_ok=True)
    if not SRC.is_dir():
        raise SystemExit(f"Missing source folder: {SRC}")

    for p in sorted(SRC.iterdir()):
        if p.suffix.lower() not in {".png", ".jpg", ".jpeg", ".webp"}:
            continue
        slug = SLUG.get(p.name) or (
            p.stem.lower().replace(" ", "-").replace("_", "-")
        )
        out = DST / f"{slug}.webp"
        im = Image.open(p)
        if im.mode not in ("RGB", "RGBA"):
            im = im.convert("RGBA")
        w, h = im.size
        scale = min(1.0, MAX_EDGE / max(w, h))
        if scale < 1.0:
            im = im.resize(
                (max(1, int(w * scale)), max(1, int(h * scale))),
                Image.Resampling.LANCZOS,
            )
        im.save(out, "WEBP", quality=QUALITY, method=6)
        print(f"{p.name} -> {out.name} ({p.stat().st_size} -> {out.stat().st_size} B)")


if __name__ == "__main__":
    main()
