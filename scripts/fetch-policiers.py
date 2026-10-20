#!/usr/bin/env python3
"""Salaires et effectifs des policiers depuis data.gouv.fr (Python stdlib).
  - Insee, « Salaires dans la fonction publique par catégorie socioprofessionnelle détaillée » (millésime 2023) :
    PCS 531A agents de police de l'État, 452A inspecteurs et officiers de police, 531B polices municipales, repères FP.
  - Cour des comptes, « La formation des policiers » : effectifs 2020 par corps (texte de présentation du jeu).
Écrit data/policiers.json et injecte `const POL` dans dashboard/forces.html entre /* POL-START */ et /* POL-END */."""
import csv, io, json, re, sys, urllib.request, zipfile
from datetime import date
from pathlib import Path
root = Path(__file__).resolve().parent.parent
UA = {"User-Agent": "PolitikBot/0.7 (https://github.com/antidoteforai-netizen/politik) python-urllib"}
def get(u):
    b = urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=180).read()
    return b
def dataset(slug): return json.loads(get(f"https://www.data.gouv.fr/api/1/datasets/{slug}/"))
SAL = "salaires-dans-la-fonction-publique-par-categorie-socioprofessionnelle-detaillee"
FORM = "la-formation-des-policiers"
ds = dataset(SAL)
res = next(r for r in ds["resources"] if "CSV" in (r["url"] or "").upper() or "csv" in (r.get("title") or "").lower() or "melodi" in r["url"])
z = zipfile.ZipFile(io.BytesIO(get(res["url"])))
data = [n for n in z.namelist() if n.endswith("_data.csv")][0]
rows = list(csv.DictReader(io.StringIO(z.read(data).decode("utf-8-sig")), delimiter=";"))
BASE = dict(CIVILSERVANT_STATUS="_T", QUANTILE="_T", WKTIME="_T", GEO="F", FREQ="A")
def val(measure, pcs="_T", sex="_T", age="_T", plf="_T", status="_T"):
    k = dict(BASE, DERA_MEASURE=measure, PCS_ESE=pcs, SEX=sex, AGE=age, PUBLIC_LEGAL_FORM=plf, CIVILSERVANT_STATUS=status)
    r = [x for x in rows if all(x[a] == b for a, b in k.items())]
    return round(float(r[0]["OBS_VALUE"]), 1) if r else None
S, E = "SALAIRE_NET_EQTP_MENSUEL_MOYENNE", "EFFECTIFS_EQTP"
millesime = int(rows[0]["TIME_PERIOD"])
AGES = ["Y_LT30", "Y30T39", "Y40T49", "Y50T59", "Y_GE60"]
def groupe(pcs, nom):
    return {"nom": nom, "salaire": val(S, pcs), "eqtp": val(E, pcs), "F": val(S, pcs, "F"), "H": val(S, pcs, "M"), "effF": val(E, pcs, "F"), "effH": val(E, pcs, "M"),
            "age": {a: {"salaire": val(S, pcs, age=a), "eqtp": val(E, pcs, age=a)} for a in AGES if val(S, pcs, age=a) is not None}}
g = {"531A": groupe("531A", "Agents de police de l'État"), "452A": groupe("452A", "Inspecteurs et officiers de police"), "531B": groupe("531B", "Agents des polices municipales")}
rep = {"FPE_ensemble": val(S, "_T", plf="1"), "FPE_titulaires": val(S, "_T", plf="1", status="F"), "FPE_A": val(S, "_T", plf="1", status="F_A"), "FPE_B": val(S, "_T", plf="1", status="F_B"), "FPE_C": val(S, "_T", plf="1", status="F_C")}
a, b = g["531A"], g["452A"]
pn = round((a["salaire"] * a["eqtp"] + b["salaire"] * b["eqtp"]) / (a["eqtp"] + b["eqtp"]), 0)
fd = dataset(FORM)
desc = re.sub(r"[\s  ]+", " ", fd.get("description") or "")
m = re.search(r"(\d[\d ]*\d) personnels actifs en (\d{4}), dont (\d[\d ]*\d) commissaires et officiers, (\d[\d ]*\d) gardiens de la paix et (\d[\d ]*\d) policiers adjoints", desc)
n = lambda s: int(s.replace(" ", ""))
eff = {"annee": int(m.group(2)), "actifs": n(m.group(1)), "commissaires_officiers": n(m.group(3)), "gardiens": n(m.group(4)), "adjoints": n(m.group(5)), "formule": "un peu plus de " + m.group(1)} if m else None
if not eff: sys.exit("effectifs Cour des comptes : phrase non retrouvée, vérifier la description du jeu")
out = {
    "genere_le": date.today().isoformat(),
    "salaires": {"millesime": millesime, "unite": "euros nets par mois, en équivalent temps plein", "groupes": g, "reperes": rep, "police_nationale_moyenne_calculee": pn,
                 "source": {"titre": ds["title"], "producteur": "Insee", "url": "https://www.data.gouv.fr/datasets/" + SAL, "licence": ds["license"], "maj": ds["last_update"][:10]}},
    "effectifs": dict(eff, source={"titre": fd["title"].strip(), "producteur": "Cour des comptes", "url": "https://www.data.gouv.fr/datasets/" + FORM, "licence": fd["license"], "maj": fd["last_update"][:10]}),
}
(root / "data/policiers.json").write_text(json.dumps(out, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
p = root / "dashboard/forces.html"; t = p.read_text(encoding="utf-8")
block = "/* POL-START */\nconst POL = " + json.dumps(out, ensure_ascii=False, separators=(",", ":")) + ";\n/* POL-END */"
if "/* POL-START */" in t: t = re.sub(r"/\* POL-START \*/.*?/\* POL-END \*/", lambda mm: block, t, flags=re.S)
else: print("marqueurs POL absents : données écrites seulement dans data/policiers.json"); sys.exit(0)
p.write_text(t, encoding="utf-8")
print(f"OK : millésime {millesime} ; agents de police de l'État {g['531A']['salaire']} € ({g['531A']['eqtp']:.0f} EQTP) ; officiers {g['452A']['salaire']} € ; moyenne pondérée {pn:.0f} € ; effectifs {eff['actifs']} actifs en {eff['annee']}")
