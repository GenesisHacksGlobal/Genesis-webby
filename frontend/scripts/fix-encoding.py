#!/usr/bin/env python3
"""Replace common UTF-8/Latin-1 mojibake sequences in frontend source."""

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EXTS = {".jsx", ".js", ".tsx", ".ts", ".html", ".css", ".md", ".json"}

REPLACEMENTS = [
    ("\u00e2\u2020\u2019", "\u2192"),  # â†’ → →  (if double-encoded oddly)
    ("â†’", "→"),
    ("â†", "←"),
    ("â†—", "↗"),
    ("Â·", "·"),
    ("Â©", "©"),
    ("â€™", "'"),
    ("â€œ", '"'),
    ("â€", '"'),
    ("â€“", "–"),
    ("â€”", "—"),
    ("Ã—", "×"),
]


def main() -> int:
    changed_files = []
    total = 0
    for path in ROOT.rglob("*"):
        if path.suffix.lower() not in EXTS:
            continue
        if "node_modules" in path.parts or ".git" in path.parts:
            continue
        try:
            text = path.read_text(encoding="utf-8")
        except OSError:
            continue
        original = text
        file_count = 0
        for bad, good in REPLACEMENTS:
            n = text.count(bad)
            if n:
                text = text.replace(bad, good)
                file_count += n
        if text != original:
            path.write_text(text, encoding="utf-8", newline="\n")
            changed_files.append((path.relative_to(ROOT).as_posix(), file_count))
            total += file_count

    print(f"Replaced {total} sequences in {len(changed_files)} files:")
    for rel, n in changed_files:
        print(f"  {n:3d}  {rel}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
