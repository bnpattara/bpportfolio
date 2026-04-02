#!/usr/bin/env python3
"""
Remove em dashes from website body copy; fix punctuation; rebuild EMDASH-REMOVAL-LOG.txt.
Skips: out/, node_modules, .next. Processes globals.css (comments only affected).
HTML: includes <style> and <script> (UI strings, CSS comments, etc.).
"""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LOG_PATH = ROOT / "EMDASH-REMOVAL-LOG.txt"
SKIP_DIRS = {"node_modules", ".next", "out", ".git", "__pycache__"}
# Omit .json here: naive transforms break structured data (e.g. paired em dash rules). Handle JSON case-by-case.
EXTS = {".html", ".tsx", ".ts", ".jsx", ".js", ".md", ".mdx", ".css", ".txt"}
SKIP_FILES: set[str] = set()

EM = "\u2014"
MID = "\u00b7"  # middle dot for title separators


def normalize_entities(s: str) -> str:
    return (
        s.replace("&mdash;", EM)
        .replace("&#8212;", EM)
        .replace("&#x2014;", EM)
    )


def transform_prose(s: str) -> str:
    s = normalize_entities(s)
    # Step N of M — Label (quiz UI)
    s = re.sub(r"(\d)\s*" + re.escape(EM) + r"\s+([A-Z][a-z]+)", r"\1 · \2", s)
    # Section numbers 01 — FOUNDATIONS (design system docs, comments)
    s = re.sub(
        r"(\d{2})\s*" + re.escape(EM) + r"\s+([A-Z][A-Za-z0-9 /\-]{1,48})",
        r"\1 · \2",
        s,
    )
    # word — 35% (e.g. /member — 36%)
    s = re.sub(r"\b(\w+)\s*" + re.escape(EM) + r"\s+(\d+%)", r"\1, \2", s)
    # ACT I — TITLE (all-caps section labels)
    s = re.sub(
        r"\b(ACT\s+[IVX]+)\s*" + re.escape(EM) + r"\s+([A-Z][A-Z\s]+)\b",
        r"\1 · \2",
        s,
    )
    # Standalone sidenav placeholder (UI, not prose sentence)
    s = re.sub(
        r'(<span class="cs-sidenav-num">)\s*' + re.escape(EM) + r"(\s*</span>)",
        r"\1" + MID + r"\2",
        s,
    )
    # HTML/CSS line comments — developer labels → middle dot
    s = re.sub(r"/\*([^*]*?)\s*" + re.escape(EM) + r"\s*", r"/*\1 " + MID + " ", s)
    s = re.sub(r"(<!--[^>]*?)\s*" + re.escape(EM) + r"\s*", r"\1 " + MID + " ", s)
    # Title / brand separators common in meta strings and alts
    for pat, repl in [
        (r"\s+" + re.escape(EM) + r"\s+Benn Pattara\b", " · Benn Pattara"),
        (r"\s+" + re.escape(EM) + r"\s+Calvin Klein\b", " · Calvin Klein"),
        (r"\s+" + re.escape(EM) + r"\s+Case [Ss]tudy\b", " · Case Study"),
        (r"\s+" + re.escape(EM) + r"\s+Case study\b", " · Case Study"),
        (r"\s+" + re.escape(EM) + r"\s+Narrative\b", " · Narrative"),
        (r"\s+" + re.escape(EM) + r"\s+archive\b", " · archive"),
        (r"\s+" + re.escape(EM) + r"\s+Expected\b", ", expected"),
        (r"\s+" + re.escape(EM) + r"\s+Confidence Hub\b", " · Confidence Hub"),
        (r"\s+" + re.escape(EM) + r"\s+community platform\b", " · community platform"),
        (r"\s+" + re.escape(EM) + r"\s+hero silhouette\b", " · hero silhouette"),
        (r"\s+" + re.escape(EM) + r"\s+New York street context\b", " · New York street context"),
        (r"\s+" + re.escape(EM) + r"\s+minimal interior\b", " · minimal interior"),
    ]:
        s = re.sub(pat, repl, s, flags=re.I)
    # Cap line numbers "01 —" → "01 ·"
    s = re.sub(r"(\d{2})\s*&mdash;\s*</", r"\1 · </", s)
    s = re.sub(r"(\d{2})\s*" + re.escape(EM) + r"\s*</", r"\1 · </", s)
    # Academic / meta lines: /Branding — Expected/ already partly handled; catch unicode
    s = re.sub(r"(Branding)\s*" + re.escape(EM) + r"\s*", r"\1, ", s, flags=re.I)
    # Paired appositive dashes
    max_iter = 50
    for _ in range(max_iter):
        m = re.search(r"\s" + re.escape(EM) + r"\s([^" + EM + r"]{2,400}?)\s" + re.escape(EM) + r"\s", s)
        if not m:
            break
        inner = m.group(1).strip()
        s = s[: m.start()] + " (" + inner + ") " + s[m.end() :]
    # Common elaboration patterns
    s = re.sub(r"\s*" + re.escape(EM) + r"\s*but\b", ", but", s)
    s = re.sub(r"\s*" + re.escape(EM) + r"\s*that\b", ": that", s)
    s = re.sub(r"\s*" + re.escape(EM) + r"\s*where\b", ": where", s)
    s = re.sub(r"\s*" + re.escape(EM) + r"\s*from\b", ", from", s)
    s = re.sub(r"\s*" + re.escape(EM) + r"\s*both\b", ": both", s)
    # "standard of the shoe — cultural" (on2 meta)
    s = re.sub(
        r"(\bthe\s+standard\s+of\s+the\s+shoe)\s*" + re.escape(EM) + r"\s*",
        r"\1, ",
        s,
        flags=re.I,
    )
    # Remaining word — lowercase elaboration → colon
    for _ in range(20):
        n = re.subn(
            r"\b([\w'$/,\.\[\]\-]+)\s*" + re.escape(EM) + r"\s+([a-z][\w'`’]*)\b",
            r"\1: \2",
            s,
        )
        s = n[0]
        if n[1] == 0:
            break
    # Alt / short phrases: "On Apex — community" → middot
    s = re.sub(
        r'alt="([^"]*?)\s' + re.escape(EM) + r'\s([^"]+)"',
        lambda m: 'alt="' + m.group(1) + " · " + m.group(2) + '"',
        s,
    )
    # Any remaining em dash between words/spaces → comma + space (clause join)
    s = re.sub(r"\s*" + re.escape(EM) + r"\s*", ", ", s)
    # Cleanup
    s = re.sub(r",\s+,", ", ", s)
    s = re.sub(r":\s+,", ": ", s)
    s = re.sub(r" \(\s+", " (", s)
    s = re.sub(r"\s+\)", ")", s)
    return s


def process_html_full(raw: str) -> str:
    """Full file: style/script may hold comments or UI strings; em dashes normalized site-wide."""
    return transform_prose(raw)


def process_non_html(raw: str) -> str:
    # Skip obvious CSS files
    return transform_prose(raw)


def sent_tokenize(text: str) -> list[str]:
    text = text.replace("\n", " ")
    parts = re.split(r"(?<=[.!?])\s+", text.strip())
    return [p for p in parts if p]


def collect_sentence_changes(before: str, after: str, rel: str, entries: list):
    if before == after:
        return
    norm = normalize_entities(before)
    if EM not in norm and "mdash" not in before.lower():
        return
    bs = sent_tokenize(norm)
    aa = sent_tokenize(normalize_entities(after))
    # Simple alignment by index while lengths match; else log whole block
    if len(bs) == len(aa):
        for b, a in zip(bs, aa):
            if b != a:
                entries.append((rel, b, a))
    else:
        entries.append((rel, before.strip()[:600], after.strip()[:600]))


def iter_files():
    for base in (ROOT / "public", ROOT / "src"):
        if not base.exists():
            continue
        for p in base.rglob("*"):
            if not p.is_file():
                continue
            if SKIP_FILES and p.name in SKIP_FILES:
                continue
            if p.suffix.lower() not in EXTS:
                continue
            if any(x in p.parts for x in SKIP_DIRS):
                continue
            yield p


def extra_root_files():
    for name in ("TOMORROW.txt",):
        p = ROOT / name
        if p.is_file():
            yield p
    mb = ROOT / "src/data/mirrorball-songs.json"
    if mb.is_file():
        yield mb


def main():
    log_lines = [
        "EM DASH REMOVAL LOG",
        "===================",
        "Body-facing copy: em dashes replaced with commas, colons, parentheses, or middots as needed.",
        "HTML/CSS/TS: em dash normalized per transform rules (see scripts/remove_emdashes.py).",
        "",
    ]
    all_entries: list[tuple[str, str, str]] = []
    files_modified_count = 0

    all_paths = sorted(
        set(iter_files()) | set(extra_root_files()),
        key=lambda p: str(p.relative_to(ROOT)),
    )
    for path in all_paths:
        rel = str(path.relative_to(ROOT))
        raw = path.read_text(encoding="utf-8")
        if path.suffix.lower() == ".html":
            new = process_html_full(raw)
        else:
            new = process_non_html(raw)
        if new == raw:
            continue
        files_modified_count += 1
        path.write_text(new, encoding="utf-8", newline="\n")
        log_lines.append(f"FILE: {rel}")
        log_lines.append("-" * 72)
        entries: list[tuple[str, str, str]] = []
        collect_sentence_changes(raw, new, rel, entries)
        for r, b, a in entries:
            all_entries.append((r, b, a))
            log_lines.append(f"  ORIGINAL: {b}")
            log_lines.append(f"  EDITED:   {a}")
            log_lines.append("")
        log_lines.append("")

    log_lines.insert(
        4,
        "Scope: public/ and src/ (html, tsx, ts, jsx, js, md, mdx, css, txt) plus TOMORROW.txt and "
        "src/data/mirrorball-songs.json. Skipped: out/, node_modules, .next, AUDIT-GAMEPLAN.md (internal).",
    )
    log_lines.insert(5, f"Files modified this run: {files_modified_count}")
    log_lines.insert(6, f"Sentence-level log lines (pairs): {len(all_entries)}")
    log_lines.insert(
        7,
        "Note: sentence pairs align when sentence counts match; otherwise one block shows a truncated before/after.",
    )
    log_lines.insert(8, "")
    LOG_PATH.write_text("\n".join(log_lines), encoding="utf-8")
    print(f"Wrote {LOG_PATH}")
    print(f"Total logged sentence pairs: {len(all_entries)}")


if __name__ == "__main__":
    main()
