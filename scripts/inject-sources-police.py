#!/usr/bin/env python3
"""Injecte data/sources-police.json (index S1-S79) dans dashboard/forces.html entre /* SRCP-START */ et /* SRCP-END */."""
import json, re, sys
from pathlib import Path
root = Path(__file__).resolve().parent.parent
d = json.loads((root / "data/sources-police.json").read_text(encoding="utf-8"))
rows = [[s["id"][1:], s["titre"], s["url"], s["niveau"], s["categorie"]] for s in d["sources"]]
block = "/* SRCP-START */\nconst SRCP = " + json.dumps(rows, ensure_ascii=False, separators=(",", ":")) + ";\n/* SRCP-END */"
p = root / "dashboard/forces.html"
t = p.read_text(encoding="utf-8")
if "/* SRCP-START */" in t:
    t = re.sub(r"/\* SRCP-START \*/.*?/\* SRCP-END \*/", lambda m: block, t, flags=re.S)
else:
    sys.exit("marqueurs SRCP absents de forces.html")
p.write_text(t, encoding="utf-8")
print(f"OK : {len(rows)} sources injectées dans forces.html")
