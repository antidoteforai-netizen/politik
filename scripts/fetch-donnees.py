#!/usr/bin/env python3
"""Politik — collecte par API et croisements calculés.

Appelle les API et fichiers ouverts (data.gouv.fr, OFPRA, geo.api.gouv.fr, DGFiP, INSEE Filosofi,
Open Urssaf, data.caf.fr, data.gov), calcule les croisements, écrit data/donnees-api.json puis
injecte le résultat dans dashboard/index.html entre /* API-DATA-START */ et /* API-DATA-END */.
Relancer ensuite dashboard/build-simple.mjs.

Stdlib seulement : le xlsx de l'IFI et le zip Filosofi sont lus avec zipfile + XML/CSV.

    python3 Politik/scripts/fetch-donnees.py
"""
import csv, io, json, re, urllib.request, urllib.parse, zipfile, datetime
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "data" / "donnees-api.json"
HTML = ROOT / "dashboard" / "index.html"
UA = {"User-Agent": "Mozilla/5.0 Politik/0.4 (tableau de bord citoyen)", "Accept": "application/json,*/*"}

def get(url, timeout=120):
    import time
    last = None
    for attempt in range(3):  # l'INSEE renvoie parfois un 500 passager
        try:
            return urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=timeout).read()
        except urllib.error.HTTPError as e:
            last = e
            if e.code < 500:
                raise
            time.sleep(2 + 2 * attempt)
        except (urllib.error.URLError, ConnectionError, TimeoutError) as e:  # coupure réseau passagère
            last = e
            time.sleep(2 + 2 * attempt)
    raise last

def get_json(url):
    return json.loads(get(url).decode("utf-8"))

def get_csv(url):
    return list(csv.reader(io.StringIO(get(url).decode("utf-8"))))

def resource(dataset_slug, pattern):
    d = get_json(f"https://www.data.gouv.fr/api/1/datasets/{dataset_slug}/")
    for r in d["resources"]:
        if re.search(pattern, r["title"] or "", re.I):
            return r["url"], d["last_update"][:10]
    raise SystemExit(f"ressource introuvable : {dataset_slug} / {pattern}")

def num(x):
    try:
        return float(str(x).replace(",", "."))
    except (TypeError, ValueError):
        return None

result = {"calcule_le": datetime.date.today().isoformat(), "sources": {}, "erreurs": []}

def step(name, fn):
    try:
        fn()
        print("ok  ", name)
    except Exception as e:  # une source en panne ne doit pas bloquer les autres
        msg = (str(e) or repr(e))[:200]
        result["erreurs"].append({"etape": name, "erreur": msg})
        print("ECHEC", name, "->", msg[:120])

# 1. Stock de personnes protégées (OFPRA) : série et top nationalités
def protection():
    slug = "beneficiaires-de-la-protection-internationale"
    d = get_json(f"https://www.data.gouv.fr/api/1/datasets/{slug}/")
    years = {}
    for r in d["resources"]:
        m = re.search(r"bpi[-_]nat[-_](\d{4})", r["title"], re.I)
        if m:
            years[int(m.group(1))] = r["url"]
    serie, top = [], []
    for y in sorted(years):
        rows = get_csv(years[y]); h = rows[0]
        tot = next(x for x in rows if x[0] == "Total")
        serie.append({"annee": y, "total": int(tot[h.index("total_bpi")]),
                      "refugies": int(tot[h.index("bpi_refugie")]),
                      "subsidiaire": int(tot[h.index("bpi_protection_subsidiaire")])})
        if y == max(years):
            nat = sorted((x for x in rows if x[0] == "Nationalité"), key=lambda x: -int(x[h.index("total_bpi")]))
            top = [{"nationalite": x[3], "iso": x[2], "total": int(x[h.index("total_bpi")])} for x in nat[:10]]
    result["protection"] = {"serie": serie, "top": top, "dernier": serie[-1]}
    result["sources"]["protection"] = {"jeu": slug, "maj": d["last_update"][:10], "url": f"https://www.data.gouv.fr/datasets/{slug}"}
step("protection OFPRA", protection)

# 2. Premières demandes d'asile par département / population légale
def asile_dept():
    slug = "demandes-dasile-et-de-statut-dapatride-deposees-devant-lofpra"
    url, maj = resource(slug, r"demandes[-_]dept[-_]2025")
    rows = get_csv(url); h = rows[0]
    deps = [{"code": x[3], "nom": x[4], "demandes": int(x[h.index("premiere_demande")])} for x in rows if x[0] == "Département"]
    communes = get_json("https://geo.api.gouv.fr/communes?fields=population,codeDepartement&format=json")
    pop = {}
    for c in communes:
        if c.get("codeDepartement"):
            pop[c["codeDepartement"]] = pop.get(c["codeDepartement"], 0) + (c.get("population") or 0)
    joint = []
    for x in deps:
        if pop.get(x["code"]):
            x["population"] = pop[x["code"]]; x["pour_10000"] = round(1e4 * x["demandes"] / x["population"], 1); joint.append(x)
    joint.sort(key=lambda x: -x["pour_10000"])
    td, tp = sum(x["demandes"] for x in joint), sum(x["population"] for x in joint)
    result["asile_departements"] = {"top": joint[:8], "bas": joint[-4:], "departements_joints": len(joint), "departements_source": len(deps),
        "france": {"demandes": td, "population": tp, "pour_10000": round(1e4 * td / tp, 1)}}
    result["sources"]["asile_departements"] = {"jeu": slug, "maj": maj, "population": "geo.api.gouv.fr/communes (population légale INSEE, agrégée par département)"}
step("asile par département × geo.api", asile_dept)

# 3. IFI 2025 par commune (xlsx DGFiP) × Filosofi 2020 (INSEE, médiane et taux de pauvreté)
def ifi_filosofi():
    slug = "impot-de-solidarite-sur-la-fortune-impot-sur-la-fortune-immobiliere-par-collectivite-territoriale"
    url, maj = resource(slug, r"IFI 2025")
    z = zipfile.ZipFile(io.BytesIO(get(url)))
    ns = {"m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
    shared = ["".join(t.text or "" for t in si.iter("{%s}t" % ns["m"]))
              for si in ET.fromstring(z.read("xl/sharedStrings.xml")).findall("m:si", ns)] if "xl/sharedStrings.xml" in z.namelist() else []
    table = []
    for r in ET.fromstring(z.read("xl/worksheets/sheet1.xml")).iter("{%s}row" % ns["m"]):
        vals = []
        for c in r.findall("m:c", ns):
            v = c.find("m:v", ns)
            vals.append(None if v is None else (shared[int(v.text)] if c.get("t") == "s" else v.text))
        table.append(vals)
    head_i = next(i for i, r in enumerate(table) if r and r[0] == "Région")
    ifi = []
    for r in table[head_i + 1:]:
        if len(r) >= 7 and r[4] and num(r[4]) is not None:
            ifi.append({"commune": r[3], "departement": r[1], "code": (r[2] or "").replace(" ", ""),
                        "redevables": int(num(r[4])), "patrimoine_moyen": round(num(r[5])), "impot_moyen": round(num(r[6]))})
    ifi.sort(key=lambda x: -x["redevables"])
    # Filosofi 2020 : communes (COM) et arrondissements municipaux (ARR), médiane MED20 et taux de pauvreté TP6020
    fz = zipfile.ZipFile(io.BytesIO(get("https://www.insee.fr/fr/statistiques/fichier/6692392/base-cc-filosofi-2020_CSV.zip")))
    filo = {}
    for name in ("cc_filosofi_2020_COM.csv", "cc_filosofi_2020_ARR.csv"):
        rows = list(csv.reader(io.StringIO(fz.read(name).decode("latin-1")), delimiter=";"))
        h = rows[0]; ci, mi, ti = h.index("CODGEO"), h.index("MED20"), h.index("TP6020")
        for r in rows[1:]:
            if len(r) > max(mi, ti):
                filo[r[ci]] = {"mediane": num(r[mi]), "taux_pauvrete": num(r[ti])}
    metro = list(csv.reader(io.StringIO(fz.read("cc_filosofi_2020_METRO.csv").decode("latin-1")), delimiter=";"))
    hm = metro[0]; nat = {"mediane": num(metro[1][hm.index("MED20")]), "taux_pauvrete": num(metro[1][hm.index("TP6020")])}
    joints = 0
    for x in ifi:
        f = filo.get(x["code"])
        if f:
            x.update(f); joints += 1
    top = ifi[:10]
    with_tp = [x for x in ifi if x.get("taux_pauvrete") is not None]
    # Redevables IFI par millier de ménages : non disponible ici ; on donne la répartition des communes IFI par taux de pauvreté
    tranches = {"moins de 10 %": 0, "10 à 15 %": 0, "15 à 20 %": 0, "20 % et plus": 0}
    for x in with_tp:
        t = x["taux_pauvrete"]
        k = "moins de 10 %" if t < 10 else "10 à 15 %" if t < 15 else "15 à 20 %" if t < 20 else "20 % et plus"
        tranches[k] += x["redevables"]
    result["ifi_communes"] = {"top": top, "nb_communes": len(ifi), "redevables_cumules": sum(x["redevables"] for x in ifi),
        "communes_jointes_filosofi": joints, "france_2020": nat, "redevables_par_taux_pauvrete": tranches,
        "note": "Communes de plus de 20 000 habitants ayant plus de 50 redevables ; Filosofi 2020 (médiane du niveau de vie, taux de pauvreté) joint sur le code commune ou d'arrondissement."}
    result["sources"]["ifi_communes"] = {"jeu": slug, "maj": maj, "url": f"https://www.data.gouv.fr/datasets/{slug}",
        "filosofi": "INSEE, base-cc-filosofi-2020 (statistiques/6692392), fichiers COM, ARR et METRO"}
step("IFI × Filosofi", ifi_filosofi)

# 4. Open Urssaf : travail dissimulé et contrôle, séries annuelles nationales (API Explore v2.1)
def urssaf():
    base = "https://open.urssaf.fr/api/explore/v2.1/catalog/datasets/"
    q = "records?select=annee,sum(montant_redressements)%20as%20m,sum(nombre_actions)%20as%20a&group_by=annee&order_by=annee&limit=30"
    lcti = get_json(base + "resultats-de-la-lutte-contre-le-travail-illegal/" + q)["results"]
    q2 = "records?select=annee,sum(montant_redressements)%20as%20m,sum(montant_restitutions)%20as%20r,sum(nombre_actions)%20as%20a&group_by=annee&order_by=annee&limit=30"
    ctrl = get_json(base + "resultats-du-controle-par-les-urssaf/" + q2)["results"]
    result["urssaf"] = {
        "travail_dissimule": [{"annee": int(x["annee"][:4]), "redresse_meur": round(x["m"] / 1e6, 1), "actions": x["a"]} for x in lcti],
        "controle": [{"annee": int(x["annee"][:4]), "redresse_meur": round(x["m"] / 1e6, 1), "restitue_meur": round((x["r"] or 0) / 1e6, 1), "actions": x["a"]} for x in ctrl]}
    result["sources"]["urssaf"] = {"api": "open.urssaf.fr Explore v2.1", "jeux": ["resultats-de-la-lutte-contre-le-travail-illegal", "resultats-du-controle-par-les-urssaf"],
        "note": "Sommes nationales de tous les organismes et types d'action, par année."}
step("Open Urssaf", urssaf)

# 5. data.caf.fr : RSA national, dernier mois disponible (foyers, personnes couvertes, montant mensuel)
def caf():
    base = "https://data.caf.fr/api/explore/v2.1/catalog/datasets/rsa_s_type_sitfam_d_nat/records?"
    q = "select=dtreffre,sum(indfoy_rsa)%20as%20f,sum(indnbp_rsa)%20as%20p,sum(indmtt_rsa)%20as%20m&group_by=dtreffre&order_by=-dtreffre&limit=13"
    rows = get_json(base + q)["results"]
    agg = rows[0]
    result["caf_rsa"] = {"mois": agg["dtreffre"][:7], "foyers": int(agg["f"]), "personnes": int(agg["p"]),
        "montant_mensuel_meur": round(agg["m"] / 1e6, 1), "montant_annualise_meur": round(12 * agg["m"] / 1e6),
        "serie_12_mois": [{"mois": r["dtreffre"][:7], "foyers": int(r["f"]), "montant_meur": round(r["m"] / 1e6, 1)} for r in rows]}
    result["sources"]["caf_rsa"] = {"api": "data.caf.fr Explore v2.1", "jeu": "rsa_s_type_sitfam_d_nat", "note": "Somme sur les types de RSA et situations familiales du dernier mois publié ; annualisation = ×12."}
step("data.caf.fr RSA", caf)

# 5 bis. CNAM : remboursements mensuels de soins de ville, régime général (fichiers NTOT, open-data-assurance-maladie.ameli.fr)
def cnam():
    import gzip
    slug = "donnees-nationales-sur-les-depenses-dassurance-maladie-relatives-aux-soins-de-ville"
    d = get_json(f"https://www.data.gouv.fr/api/1/datasets/{slug}/")
    totaux = {}
    for year in (2024, 2025):
        res = next((r for r in d["resources"] if r["title"] == f"NTOT{year}"), None)
        if not res:
            continue
        page = get(res["url"]).decode("latin-1")
        links = re.findall(r'href="\./(download_file\.php\?token=[^"]+)"', page)
        total, mois = 0.0, 0
        for l in links:
            raw = gzip.decompress(get("https://open-data-assurance-maladie.ameli.fr/depenses/" + l.replace("&amp;", "&")))
            rows = csv.reader(io.StringIO(raw.decode("latin-1")), delimiter=";")
            h = next(rows); i = h.index("rem_mon")
            for r in rows:
                v = num(r[i].replace(".", "").replace(",", ".")) if len(r) > i else None
                if v:
                    total += v
            mois += 1
        totaux[year] = {"rembourse_meur": round(total / 1e6), "mois": mois}
    result["cnam"] = {"soins_de_ville": totaux, "ondam_2025_meur": 265400, "ondam_vote_2025_meur": 265900,
        "note": "Soins de ville remboursés par le régime général (hors hôpital), somme des fichiers mensuels NTOT ; ONDAM 2025 : objectif voté 265,9 Md€, exécution provisoire 265,4 Md€ (comité d'alerte, avril 2026)."}
    result["sources"]["cnam"] = {"jeu": slug, "maj": d["last_update"][:10], "ondam": "LFSS 2025 et avis du comité d'alerte du 20 avril 2026 (securite-sociale.fr)"}
step("CNAM soins de ville", cnam)

# 5 ter. Open Urssaf : encaissements annuels (dénominateur des cotisations)
def urssaf_encaissements():
    t = get("https://open.urssaf.fr/api/explore/v2.1/catalog/datasets/encaissements-annuels-des-urssaf/exports/csv?use_labels=true").decode("utf-8-sig")
    rows = list(csv.DictReader(io.StringIO(t), delimiter=";"))
    tot = {}
    for r in rows:
        y = int(r["Année"]); tot.setdefault(y, {"total": 0.0, "activite": 0.0})
        v = num(r["Montant des encaissements"]) or 0.0
        tot[y]["total"] += v
        if r["Catégorie d'encaissements"].startswith("Cotisations et contributions sur revenus d'activité"):
            tot[y]["activite"] += v
    serie = [{"annee": y, "total_meur": round(v["total"] / 1e6), "activite_meur": round(v["activite"] / 1e6)} for y, v in sorted(tot.items())]
    result["urssaf_encaissements"] = {"serie": serie, "dernier": serie[-1], "jeu": "encaissements-annuels-des-urssaf",
        "note": "Encaissements nationaux (somme des organismes), dont cotisations et contributions sur revenus d'activité."}
    result["sources"]["urssaf_encaissements"] = {"api": "open.urssaf.fr export CSV", "jeu": "encaissements-annuels-des-urssaf"}
step("Open Urssaf encaissements", urssaf_encaissements)

# 5 quater. Crimes et délits enregistrés par police et gendarmerie 2012-2021 (archive SSMSI, xlsx) : index liés à la fraude
def crimes():
    slug = "archive-crimes-et-delits-enregistres-par-les-services-de-gendarmerie-et-de-police-depuis-2012"
    url, maj = resource(slug, r"crimes-et-delits.*xlsx")
    z = zipfile.ZipFile(io.BytesIO(get(url)))
    ns = {"m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main", "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships"}
    wb = ET.fromstring(z.read("xl/workbook.xml"))
    sheets = [(s.get("name"), s.get("{%s}id" % ns["r"])) for s in wb.find("m:sheets", ns)]
    relmap = {r.get("Id"): r.get("Target") for r in ET.fromstring(z.read("xl/_rels/workbook.xml.rels"))}
    shared = ["".join(t.text or "" for t in si.iter("{%s}t" % ns["m"])) for si in ET.fromstring(z.read("xl/sharedStrings.xml")).findall("m:si", ns)]
    def col(ref):
        n = 0
        for ch in re.match(r"([A-Z]+)", ref).group(1):
            n = n * 26 + ord(ch) - 64
        return n - 1
    wanted = {"Faux documents d'identité": "faux_identite", "Escroqueries et abus de confiance": "escroqueries",
              "Travail clandestin": "travail_clandestin", "Emploi d'étranger sans titre de travail": "emploi_etranger_sans_titre", "Fraudes fiscales": "fraudes_fiscales"}
    series = {v: {} for v in wanted.values()}
    for name, rid in sheets:
        m = re.match(r"Services (PN|GN) (\d{4})", name)
        if not m:
            continue
        year = int(m.group(2))
        for r in ET.fromstring(z.read("xl/" + relmap[rid].lstrip("/"))).iter("{%s}row" % ns["m"]):
            vals = {}
            for c in r.findall("m:c", ns):
                v = c.find("m:v", ns)
                if v is not None:
                    vals[col(c.get("r"))] = shared[int(v.text)] if c.get("t") == "s" else v.text
            lab = str(vals.get(1, "")).strip()
            if lab in wanted:
                s = sum((num(v) or 0) for k, v in vals.items() if k > 1)
                series[wanted[lab]][year] = series[wanted[lab]].get(year, 0) + s
    result["crimes"] = {k: [{"annee": y, "faits": int(v)} for y, v in sorted(ys.items())] for k, ys in series.items()}
    result["sources"]["crimes"] = {"jeu": slug, "maj": maj, "note": "Police nationale + gendarmerie nationale, France entière, état 4001, index 83, 93, 95, 96 et 107. Jeu archivé en 2022 ; successeur : bases statistiques SSMSI (indicateurs différents)."}
step("crimes et délits 2012-2021", crimes)

# 5 quinquies. INSEE, Insee Focus n° 349 : fichier if349.xlsx (écarts femmes-hommes, série 1995-2023)
def egalite():
    z = zipfile.ZipFile(io.BytesIO(get("https://www.insee.fr/fr/statistiques/fichier/8381248/if349.xlsx")))
    ns = {"m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
    shared = ["".join(x.text or "" for x in si.iter("{%s}t" % ns["m"])) for si in ET.fromstring(z.read("xl/sharedStrings.xml")).findall("m:si", ns)]
    def rows_of(sheet):
        out = []
        for r in ET.fromstring(z.read(sheet)).iter("{%s}row" % ns["m"]):
            vals = []
            for c in r.findall("m:c", ns):
                v = c.find("m:v", ns)
                vals.append(None if v is None else (shared[int(v.text)] if c.get("t") == "s" else v.text))
            out.append(vals)
        return out
    target = None
    for sh in [n for n in z.namelist() if n.startswith("xl/worksheets/sheet")]:
        rws = rows_of(sh)
        if rws and rws[0] and str(rws[0][0]).startswith("Figure 1a"):
            target = rws; break
    if not target:
        raise RuntimeError("figure 1a introuvable")
    serie = []
    for r in target:
        if r and r[0] and re.fullmatch(r"\d{4}", str(r[0])):
            nums = [num(x) for x in r[1:] if num(x) is not None]
            if len(nums) >= 6:
                nums = [nums[1], nums[3], nums[5]]
            if len(nums) >= 3:
                serie.append({"annee": int(r[0]), "revenu_salarial": nums[0], "salaire_eqtp": nums[1], "volume_travail": nums[2]})
    result["egalite"] = {"serie": serie, "dernier": serie[-1], "note": "Écart en % en défaveur des femmes, secteur privé ; figure 1a du fichier if349.xlsx (nouvelle série quand elle existe)."}
    result["sources"]["egalite"] = {"fichier": "https://www.insee.fr/fr/statistiques/fichier/8381248/if349.xlsx", "page": "Insee Focus n° 349, 4 mars 2025 ; portail data.gouv « Égalité femmes-hommes »"}
step("INSEE égalité F-H (if349.xlsx)", egalite)

# 5 sexies. SSMSI, base départementale 2016-2025 : escroqueries et fraudes aux moyens de paiement, France entière
def ssmsi():
    slug = "bases-statistiques-communale-departementale-et-regionale-de-la-delinquance-enregistree-par-la-police-et-la-gendarmerie-nationales"
    url, maj = resource(slug, r"^DEP - Base statistique d")
    rows = list(csv.DictReader(io.StringIO(get(url).decode("utf-8-sig")), delimiter=";"))
    agg = {}
    for r in rows:
        if r["indicateur"].startswith("Escroqueries"):
            y = int(r["annee"]); a = agg.setdefault(y, {"faits": 0, "pop": 0})
            a["faits"] += int(num(r["nombre"]) or 0); a["pop"] += int(num(r["insee_pop"]) or 0)
    serie = [{"annee": y, "faits": v["faits"], "pour_1000": round(1000 * v["faits"] / v["pop"], 2) if v["pop"] else None} for y, v in sorted(agg.items())]
    result["ssmsi"] = {"escroqueries": serie, "indicateur": "Escroqueries et fraudes aux moyens de paiement", "note": "Somme des départements, unité de compte SSMSI ; périmètre différent de l'index 93 de l'état 4001 (archive 2012-2021)."}
    result["sources"]["ssmsi"] = {"jeu": slug, "maj": maj}
step("SSMSI escroqueries 2016-2025", ssmsi)

# 5 septies. RSA par département (data.caf.fr) × taux de pauvreté (Filosofi 2020, DEP) × population (geo.api)
def rsa_departements():
    base = "https://data.caf.fr/api/explore/v2.1/catalog/datasets/rsa_s_type_sitfam_d_dep/records?"
    last = get_json(base + "select=max(dtreffre)%20as%20d&limit=1")["results"][0]["d"][:7]
    rows = []
    for offset in (0, 100):
        page = get_json(base + urllib.parse.urlencode({"select": "numdep,nomdep,sum(indfoy_rsa) as foyers,sum(indnbp_rsa) as personnes", "refine": f"dtreffre:{last}", "group_by": "numdep,nomdep", "limit": 100, "offset": offset}))["results"]
        rows += page
        if len(page) < 100:
            break
    fz = zipfile.ZipFile(io.BytesIO(get("https://www.insee.fr/fr/statistiques/fichier/6692392/base-cc-filosofi-2020_CSV.zip")))
    dep = list(csv.reader(io.StringIO(fz.read("cc_filosofi_2020_DEP.csv").decode("latin-1")), delimiter=";"))
    h = dep[0]; tp = {r[h.index("CODGEO")]: num(r[h.index("TP6020")]) for r in dep[1:]}
    communes = get_json("https://geo.api.gouv.fr/communes?fields=population,codeDepartement&format=json")
    pop = {}
    for c in communes:
        if c.get("codeDepartement"):
            pop[c["codeDepartement"]] = pop.get(c["codeDepartement"], 0) + (c.get("population") or 0)
    joint = []
    for r in rows:
        code = str(r["numdep"]).zfill(2) if str(r["numdep"]).isdigit() else str(r["numdep"])
        if code in pop and pop[code] and tp.get(code) is not None:
            joint.append({"code": code, "nom": r["nomdep"], "foyers": int(r["foyers"]), "personnes": int(r["personnes"]),
                          "foyers_pour_1000": round(1000 * r["foyers"] / pop[code], 1), "taux_pauvrete_2020": tp[code]})
    joint.sort(key=lambda x: -x["foyers_pour_1000"])
    xs = [x["foyers_pour_1000"] for x in joint]; ys = [x["taux_pauvrete_2020"] for x in joint]
    n = len(xs); mx = sum(xs) / n; my = sum(ys) / n
    cov = sum((a - mx) * (b - my) for a, b in zip(xs, ys)); vx = sum((a - mx) ** 2 for a in xs) ** 0.5; vy = sum((b - my) ** 2 for b in ys) ** 0.5
    result["rsa_departements"] = {"mois": last, "top": joint[:8], "bas": joint[-4:], "departements_joints": n, "correlation_pearson": round(cov / (vx * vy), 2) if vx and vy else None,
        "note": "Foyers RSA pour 1 000 habitants (data.caf.fr, dernier mois) et taux de pauvreté 2020 (Filosofi DEP)."}
    result["sources"]["rsa_departements"] = {"api": "data.caf.fr rsa_s_type_sitfam_d_dep", "filosofi": "INSEE base-cc-filosofi-2020, fichier DEP", "population": "geo.api.gouv.fr"}
step("RSA par département × pauvreté", rsa_departements)

# 5 octies. Sailly-lez-Lannoy : la réutilisation envoyée, lue dans son jeu source
def sailly():
    url, maj = resource("part-des-immigres-dans-la-population-sailly-lez-lannoy", r"\.csv$")
    rows = list(csv.DictReader(io.StringIO(get(url).decode("utf-8-sig")), delimiter=";"))
    dw = None
    try:  # le graphique Datawrapper de la réutilisation : même série, version 1
        dwrows = list(csv.DictReader(io.StringIO(get("https://datawrapper.dwcdn.net/ONKPN/1/dataset.csv").decode("utf-8-sig")), delimiter="\t"))
        if not dwrows or "an" not in dwrows[0]:
            dwrows = list(csv.DictReader(io.StringIO(get("https://datawrapper.dwcdn.net/ONKPN/1/dataset.csv").decode("utf-8-sig"))))
        dw = [{"annee": int(r["an"]), "part_immigres": num(r["part_immigres"])} for r in dwrows if r.get("an")]
    except Exception:
        dw = None
    result["sailly"] = {"serie": [{"annee": int(r["an"]), "part_immigres": num(r["part_immigres"])} for r in rows], "commune": rows[0]["libgeo"], "codgeo": rows[0]["codgeo"], "france_2024": 11.3,
        "datawrapper": dw, "datawrapper_identique": dw is not None and [(x["annee"], x["part_immigres"]) for x in dw] == [(int(r["an"]), num(r["part_immigres"])) for r in rows]}
    result["sources"]["sailly"] = {"jeu": "part-des-immigres-dans-la-population-sailly-lez-lannoy", "maj": maj, "reutilisation": "https://www.data.gouv.fr/reuses/part-dimmigres-dans-la-population-sailly-lez-lannoy"}
step("Sailly-lez-Lannoy", sailly)

# 5 nonies. DREES, « Minima sociaux, RSA et prime d'activité » : dépenses de RSA 2009-2024 (xlsx national)
def drees_minima():
    u = "https://data.drees.solidarites-sante.gouv.fr/api/v2/catalog/datasets/336_minima-sociaux-rsa-et-prime-d-activite/attachments/minima_sociaux_donnees_de_depenses_par_dispositif_xlsx"
    z = zipfile.ZipFile(io.BytesIO(get(u)))
    ns = {"m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main", "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships"}
    wb = ET.fromstring(z.read("xl/workbook.xml"))
    sheets = {s.get("name"): s.get("{%s}id" % ns["r"]) for s in wb.find("m:sheets", ns)}
    relmap = {r.get("Id"): r.get("Target") for r in ET.fromstring(z.read("xl/_rels/workbook.xml.rels"))}
    shared = ["".join(t.text or "" for t in si.iter("{%s}t" % ns["m"])) for si in ET.fromstring(z.read("xl/sharedStrings.xml")).findall("m:si", ns)]
    rows = []
    for r in ET.fromstring(z.read("xl/" + relmap[sheets["Tableau 1"]].lstrip("/"))).iter("{%s}row" % ns["m"]):
        vals = []
        for c in r.findall("m:c", ns):
            v = c.find("m:v", ns)
            vals.append(None if v is None else (shared[int(v.text)] if c.get("t") == "s" else v.text))
        if any(vals):
            rows.append(vals)
    def first_text(r):
        return next((i for i, x in enumerate(r) if x is not None), None)
    years_row = next(r for r in rows if any(re.fullmatch(r"2009.*", str(x or "")) for x in r))
    rsa_row = next(r for r in rows if any(str(x or "").startswith("RSA") for x in r))
    y0 = next(i for i, x in enumerate(years_row) if re.fullmatch(r"2009.*", str(x or "")))
    r0 = next(i for i, x in enumerate(rsa_row) if str(x or "").startswith("RSA"))
    serie = []
    for k, y in enumerate(years_row[y0:]):
        yy = re.match(r"(\d{4})", str(y or ""))
        v = rsa_row[r0 + 1 + k] if r0 + 1 + k < len(rsa_row) else None
        if yy and num(v) is not None:
            serie.append({"annee": int(yy.group(1)), "depenses_meur_2024": round(num(v))})
    if not serie:
        raise RuntimeError("série RSA vide : structure du tableau 1 changée")
    unite = next((str(r[0]) for r in rows if r and "euros constant" in str(r[0]).lower()), "")
    result["drees_rsa"] = {"serie": serie, "unite": unite, "note": "Dépenses d'allocation RSA, DREES, tableau 1 du fichier « dépenses par dispositif » (euros constants 2024)."}
    result["sources"]["drees_rsa"] = {"jeu": "minima-sociaux-rsa-et-prime-dactivite", "fichier": u}
step("DREES dépenses RSA 2009-2024", drees_minima)

# 5 decies. Typologie des fraudes documentaires (DCPAF, 2007-2013) : fichiers .xls binaires lus par un lecteur BIFF8 minimal
def _ole_stream(data, wanted):
    import struct
    if data[:8] != b"\xD0\xCF\x11\xE0\xA1\xB1\x1A\xE1":
        raise ValueError("pas un fichier OLE")
    sec = 1 << struct.unpack_from("<H", data, 30)[0]; mini = 1 << struct.unpack_from("<H", data, 32)[0]
    n_fat = struct.unpack_from("<I", data, 44)[0]; dir_start = struct.unpack_from("<I", data, 48)[0]
    mini_cut = struct.unpack_from("<I", data, 56)[0]; minifat_start = struct.unpack_from("<I", data, 60)[0]; n_minifat = struct.unpack_from("<I", data, 64)[0]
    difat_start = struct.unpack_from("<I", data, 68)[0]; n_difat = struct.unpack_from("<I", data, 72)[0]
    difat = list(struct.unpack_from("<109I", data, 76)); s = difat_start
    for _ in range(n_difat):
        ents = struct.unpack_from("<%dI" % (sec // 4), data, (s + 1) * sec); difat += list(ents[:-1]); s = ents[-1]
    fat = []
    for sid in difat[:n_fat]:
        if sid < 0xFFFFFFFE:
            fat += list(struct.unpack_from("<%dI" % (sec // 4), data, (sid + 1) * sec))
    def chain(start):
        out = b""; sid = start
        while sid < 0xFFFFFFFE and len(out) < len(data):
            out += data[(sid + 1) * sec:(sid + 2) * sec]; sid = fat[sid]
        return out
    entries = []
    d = chain(dir_start)
    for i in range(0, len(d) - 127, 128):
        e = d[i:i + 128]; nlen = struct.unpack_from("<H", e, 64)[0]
        entries.append((e[:max(0, nlen - 2)].decode("utf-16-le", "ignore"), e[66], struct.unpack_from("<I", e, 116)[0], struct.unpack_from("<I", e, 120)[0]))
    root = next(e for e in entries if e[1] == 5)
    minifat = list(struct.unpack_from("<%dI" % (len(chain(minifat_start)) // 4), chain(minifat_start))) if n_minifat else []
    ministream = chain(root[2])
    def minichain(start):
        out = b""; sid = start
        while sid < 0xFFFFFFFE and len(out) < len(ministream) + mini:
            out += ministream[sid * mini:(sid + 1) * mini]; sid = minifat[sid]
        return out
    for name, typ, start, size in entries:
        if name == wanted:
            return (minichain(start) if size < mini_cut else chain(start))[:size]
    raise KeyError(wanted)

def _biff_sheets(wb):
    import struct
    recs = []; pos = 0
    while pos + 4 <= len(wb):
        rid, ln = struct.unpack_from("<HH", wb, pos); recs.append((rid, pos + 4, ln)); pos += 4 + ln
    sst, sheets = [], []
    def read_sst(i):
        parts = [wb[recs[i][1]:recs[i][1] + recs[i][2]]]; j = i + 1
        while j < len(recs) and recs[j][0] == 0x003C:
            parts.append(wb[recs[j][1]:recs[j][1] + recs[j][2]]); j += 1
        total = struct.unpack_from("<I", parts[0], 4)[0]; strings = []; seg = 0; data = parts[0]; p = 8
        while len(strings) < total and seg < len(parts):
            if p + 3 > len(data):
                seg += 1
                if seg >= len(parts): break
                data = parts[seg]; p = 0; continue
            cch = struct.unpack_from("<H", data, p)[0]; flags = data[p + 2]; p += 3
            nrich = cext = 0
            if flags & 8: nrich = struct.unpack_from("<H", data, p)[0]; p += 2
            if flags & 4: cext = struct.unpack_from("<I", data, p)[0]; p += 4
            s = ""; rem = cch; uni = flags & 1
            while rem > 0:
                avail = len(data) - p
                if avail <= 0:
                    seg += 1; data = parts[seg]; uni = data[0] & 1; p = 1; continue
                take = min(rem, avail // 2 if uni else avail)
                if take == 0:
                    seg += 1; data = parts[seg]; uni = data[0] & 1; p = 1; continue
                chunk = data[p:p + (take * 2 if uni else take)]
                s += chunk.decode("utf-16-le", "ignore") if uni else chunk.decode("latin-1")
                p += take * 2 if uni else take; rem -= take
            skip = nrich * 4 + cext
            while skip > 0:
                avail = len(data) - p
                if avail >= skip: p += skip; skip = 0
                else: skip -= avail; seg += 1; data = parts[seg] if seg < len(parts) else b""; p = 0
            strings.append(s)
        return strings
    for i, (rid, off, ln) in enumerate(recs):
        if rid == 0x00FC: sst = read_sst(i)
        elif rid == 0x0085:
            bof = struct.unpack_from("<I", wb, off)[0]; cch = wb[off + 6]; fl = wb[off + 7]
            sheets.append((wb[off + 8:off + 8 + (cch * 2 if fl & 1 else cch)].decode("utf-16-le" if fl & 1 else "latin-1", "ignore"), bof))
    def rk(v):
        x = float(v >> 2 if v >> 2 < 2 ** 29 else (v >> 2) - 2 ** 30) if v & 2 else struct.unpack("<d", struct.pack("<Q", (v & ~3) << 32))[0]
        return x / 100 if v & 1 else x
    out = {}
    for name, bof in sheets:
        p = bof; cells = {}
        while p + 4 <= len(wb):
            rid, ln = struct.unpack_from("<HH", wb, p); d = wb[p + 4:p + 4 + ln]
            if rid == 0x000A: break
            if rid == 0x00FD: r, c = struct.unpack_from("<HH", d, 0); idx = struct.unpack_from("<I", d, 6)[0]; cells[(r, c)] = sst[idx] if idx < len(sst) else ""
            elif rid == 0x0203: r, c = struct.unpack_from("<HH", d, 0); cells[(r, c)] = struct.unpack_from("<d", d, 6)[0]
            elif rid == 0x027E: r, c = struct.unpack_from("<HH", d, 0); cells[(r, c)] = rk(struct.unpack_from("<I", d, 6)[0])
            elif rid == 0x00BD:
                r, c0 = struct.unpack_from("<HH", d, 0)
                for k in range((ln - 6) // 6): cells[(r, c0 + k)] = rk(struct.unpack_from("<I", d, 4 + k * 6 + 2)[0])
            p += 4 + ln
        out[name] = cells
    return out

def dcpaf():
    def table(url):
        cells = next(iter(_biff_sheets(_ole_stream(get(url), "Workbook")).values()))
        rows = {}
        for (r, c), v in cells.items():
            rows.setdefault(r, {})[c] = v
        return rows
    def clean(s):
        if isinstance(s, float) and s.is_integer():
            s = int(s)
        return re.sub(r"[ \s]+", " ", str(s)).strip()
    serie = {}
    detail = {}
    for url in ("https://static.data.gouv.fr/08/959a5d54fdccc52040b642ebac6c0b29529c283b21208c0730710d2a7dbbc4.xls",
                "https://static.data.gouv.fr/resources/15080-typologie-des-fraudes-en-nombre-de-faux-documents-decouverts-par-la-dcpaf-1/20150819-180829/15080_Typologie-fraudes-Nb-faux-documents-decouverts-en-metropole.xls"):
        rows = table(url)
        years_row = next(r for r in rows.values() if sum(1 for v in r.values() if re.fullmatch(r"20\d\d", clean(v))) >= 3)
        ycols = {c: int(clean(v)) for c, v in years_row.items() if re.fullmatch(r"20\d\d", clean(v))}
        for r in rows.values():
            label = clean(next((v for c, v in sorted(r.items()) if isinstance(v, str) and clean(v)), ""))
            if not label: continue
            for c, y in ycols.items():
                v = num(clean(r.get(c, "")).replace(" ", ""))
                if v is None: continue
                if label.lower().startswith("total des fraudes"):
                    serie[y] = int(v)
                elif "titres de séj" in label or "carte nationa" in label or "passeport" in label or "acte de naiss" in label:
                    key = "titres de séjour" if "séj" in label else "carte nationale d'identité" if "carte" in label else "passeports" if "passeport" in label else "actes de naissance"
                    detail.setdefault(y, {})[key] = int(v)
    result["dcpaf"] = {"total": [{"annee": y, "faux_documents": v} for y, v in sorted(serie.items())],
        "obtentions_frauduleuses_detail": [{"annee": y, **d} for y, d in sorted(detail.items())],
        "note": "Faux documents découverts (contrefaçons, falsifications, usages frauduleux, obtentions frauduleuses), DCPAF, métropole ; deux fichiers .xls de 2014 et 2015 lus par un lecteur BIFF8 écrit pour l'occasion."}
    result["sources"]["dcpaf"] = {"jeux": ["2013-59-typologie-des-fraudes-en-nombre-de-faux-documents-decouverts", "15080-typologie-des-fraudes-en-nombre-de-faux-documents-decouverts-par-la-dcpaf-1"]}
step("DCPAF faux documents 2007-2013 (.xls)", dcpaf)

# 5 undecies. Jeux « contexte » croisés sur la clé département avec la pauvreté Filosofi : IPS des collèges, revenus des 60 ans et plus
def _filosofi_dep():
    fz = zipfile.ZipFile(io.BytesIO(get("https://www.insee.fr/fr/statistiques/fichier/6692392/base-cc-filosofi-2020_CSV.zip")))
    dep = list(csv.reader(io.StringIO(fz.read("cc_filosofi_2020_DEP.csv").decode("latin-1")), delimiter=";"))
    h = dep[0]
    return {r[h.index("CODGEO")]: {"tp": num(r[h.index("TP6020")]), "med": num(r[h.index("MED20")])} for r in dep[1:]}

def _pearson(xs, ys):
    n = len(xs); mx = sum(xs) / n; my = sum(ys) / n
    cov = sum((a - mx) * (b - my) for a, b in zip(xs, ys))
    vx = sum((a - mx) ** 2 for a in xs) ** 0.5; vy = sum((b - my) ** 2 for b in ys) ** 0.5
    return round(cov / (vx * vy), 2) if vx and vy else None

def ips():
    rows = list(csv.DictReader(io.StringIO(get("https://data.education.gouv.fr/api/explore/v2.1/catalog/datasets/fr-en-ips-colleges-ap2023/exports/csv?use_labels=true").decode("utf-8-sig")), delimiter=";"))
    year = max(r["Année scolaire"] for r in rows)
    agg = {}
    for r in rows:
        if r["Année scolaire"] != year or num(r["IPS"]) is None:
            continue
        a = agg.setdefault(r["Code département"], {"nom": r["Libellé département"], "somme": 0.0, "n": 0, "public": num(r["IPS départemental public"]), "prive": num(r["IPS départemental privé"])})
        a["somme"] += num(r["IPS"]); a["n"] += 1
    filo = _filosofi_dep()
    joint = [{"code": c, "nom": a["nom"].title(), "ips_moyen": round(a["somme"] / a["n"], 1), "colleges": a["n"], "ips_public": a["public"], "ips_prive": a["prive"], "taux_pauvrete_2020": filo[c]["tp"]}
             for c, a in agg.items() if c in filo and filo[c]["tp"] is not None]
    joint.sort(key=lambda x: x["ips_moyen"])
    result["ips"] = {"annee_scolaire": year, "bas": joint[:6], "haut": joint[-6:], "departements_joints": len(joint),
        "correlation_pearson": _pearson([x["ips_moyen"] for x in joint], [x["taux_pauvrete_2020"] for x in joint]),
        "note": "IPS moyen des collèges par département (moyenne simple des établissements) contre taux de pauvreté 2020 ; plus l'IPS est bas, plus le milieu social des élèves est modeste."}
    result["sources"]["ips"] = {"jeu": "ips-colleges-a-partir-de-2023", "api": "data.education.gouv.fr Explore v2.1", "filosofi": "INSEE Filosofi 2020 DEP"}
step("IPS collèges × pauvreté", ips)

def seniors():
    rows = list(csv.DictReader(io.StringIO(get("https://opendata.caissedesdepots.fr/api/explore/v2.1/catalog/datasets/60ans_et_plus_revenu/exports/csv?use_labels=true").decode("utf-8-sig")), delimiter=";"))
    key = next(k for k in rows[0].keys() if k.strip().lstrip("﻿") == "code_dep")
    filo = _filosofi_dep()
    joint = []
    seen = set()
    for r in rows:
        code = r[key].strip().zfill(2) if r[key].strip().isdigit() else r[key].strip()
        tp60 = num(r.get("DEP_FILO_AGE5TP6017")); tpall = num(r.get("DEP_FILO_TP6017"))
        if code in filo and tp60 is not None and code not in seen:  # une ligne par département (le fichier en contient deux)
            seen.add(code)
            joint.append({"code": code, "nom": r["Nom Officiel Département Majuscule"].title(), "pauvrete_60_74_ans_2017": tp60, "pauvrete_tous_ages_2017": tpall, "taux_pauvrete_2020": filo[code]["tp"]})
    joint.sort(key=lambda x: -x["pauvrete_60_74_ans_2017"])
    result["seniors"] = {"haut": joint[:6], "bas": joint[-4:], "departements_joints": len(joint),
        "correlation_pearson": _pearson([x["pauvrete_60_74_ans_2017"] for x in joint], [x["taux_pauvrete_2020"] for x in joint if x["taux_pauvrete_2020"] is not None][:len(joint)]) if all(x["taux_pauvrete_2020"] is not None for x in joint) else None,
        "note": "Taux de pauvreté des 60-74 ans (Filosofi 2017 via la Caisse des Dépôts) contre taux de pauvreté tous âges 2020 (Filosofi)."}
    result["sources"]["seniors"] = {"jeu": "60-ans-et-plus-revenus-et-aides-financieres-par-departement", "api": "opendata.caissedesdepots.fr Explore v2.1"}
step("60 ans et plus × pauvreté", seniors)

# 5 duodecies. Indicateurs ODD (INSEE) : recoupement de l'ODD 10 (inégalités) avec les tuiles INSEE
def odd():
    z = zipfile.ZipFile(io.BytesIO(get("https://www.insee.fr/fr/statistiques/fichier/2654964/liste_nationale_iODD_2025.xlsx")))
    ns = {"m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
    shared = ["".join(t.text or "" for t in si.iter("{%s}t" % ns["m"])) for si in ET.fromstring(z.read("xl/sharedStrings.xml")).findall("m:si", ns)] if "xl/sharedStrings.xml" in z.namelist() else []
    hits = []
    for sh in [n for n in z.namelist() if n.startswith("xl/worksheets/sheet")]:
        for r in ET.fromstring(z.read(sh)).iter("{%s}row" % ns["m"]):
            vals = []
            for c in r.findall("m:c", ns):
                v = c.find("m:v", ns)
                vals.append(None if v is None else (shared[int(v.text)] if c.get("t") == "s" else v.text))
            line = " | ".join(str(x) for x in vals if x is not None)
            if re.search(r"gini|S80|interd[ée]cile|taux de pauvret|niveau de vie m[ée]dian", line, re.I) and not re.match(r"\s*(Objectif|Onglet)", line):
                hits.append(line[:220])
    result["odd"] = {"indicateurs_inegalites": hits[:12], "nb": len(hits), "note": "Lignes de la liste nationale des indicateurs ODD 2025 qui portent sur les inégalités de revenu ; mêmes sources que les tuiles INSEE (Gini, S80/S20, pauvreté)."}
    result["sources"]["odd"] = {"fichier": "https://www.insee.fr/fr/statistiques/fichier/2654964/liste_nationale_iODD_2025.xlsx", "jeu": "indicateurs-pour-le-suivi-national-des-objectifs-de-developpement-durable-17-objectifs"}
step("ODD 10 (INSEE)", odd)

# 5 terdecies. API Recherche d'entreprises : identité des associations citées par la Cour des comptes
def entreprises():
    noms = ["La Cimade", "France Terre d'Asile", "Forum réfugiés", "Coallia", "Groupe SOS Solidarités"]
    tranche = {"NN": "non renseigné", "00": "0 salarié", "01": "1 ou 2", "02": "3 à 5", "03": "6 à 9", "11": "10 à 19", "12": "20 à 49", "21": "50 à 99", "22": "100 à 199", "31": "200 à 249", "32": "250 à 499", "41": "500 à 999", "42": "1 000 à 1 999", "51": "2 000 à 4 999", "52": "5 000 à 9 999", "53": "10 000 et plus"}
    out = []
    for n in noms:
        j = get_json("https://recherche-entreprises.api.gouv.fr/search?q=" + urllib.parse.quote(n) + "&per_page=1")
        r = (j.get("results") or [None])[0]
        if r:
            out.append({"recherche": n, "nom": r.get("nom_complet"), "siren": r.get("siren"), "nature_juridique": r.get("nature_juridique"), "forme": "association déclarée" if str(r.get("nature_juridique", "")).startswith("92") else "autre",
                        "effectif": tranche.get(str(r.get("tranche_effectif_salarie")), str(r.get("tranche_effectif_salarie"))), "siege": (r.get("siege") or {}).get("libelle_commune"), "creation": r.get("date_creation")})
    result["entreprises"] = {"associations": out, "note": "Identité administrative des opérateurs de l'asile cités par la Cour des comptes (tranche d'effectif salarié au sens Sirene)."}
    result["sources"]["entreprises"] = {"api": "https://recherche-entreprises.api.gouv.fr/search"}
step("Recherche d'entreprises (associations de l'asile)", entreprises)

# 6. data.gov (États-Unis) : jeux sur les paiements indus, pour une comparaison internationale future
def datagov():
    u = "https://catalog.data.gov/api/3/action/package_search?q=improper+payments&rows=5"
    try:
        j = get_json(u)
    except Exception as e:
        # Constaté le 2026-10-20 : l'API CKAN de catalog.data.gov répond 404 ; la page data.gov elle-même répond 200.
        result["datagov"] = {"disponible": False, "note": f"API catalogue CKAN injoignable ({str(e)[:60]}). Piste pour la comparaison internationale : PaymentAccuracy.gov (paiements indus fédéraux, GAO)."}
        return
    result["datagov"] = {"disponible": True, "total": j["result"]["count"], "exemples": [{"titre": d["title"], "org": (d.get("organization") or {}).get("title"), "url": "https://catalog.data.gov/dataset/" + d["name"]} for d in j["result"]["results"]]}
    result["sources"]["datagov"] = {"api": u.split("?")[0]}
step("data.gov", datagov)

# 7. Écriture et injection
OUT.parent.mkdir(exist_ok=True)
OUT.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
html = HTML.read_text(encoding="utf-8")
start, end = "/* API-DATA-START */", "/* API-DATA-END */"
if start not in html or end not in html:
    raise SystemExit("marqueurs API-DATA absents de index.html")
html = html[:html.index(start)] + f"{start}\nconst API = {json.dumps(result, ensure_ascii=False)};\n{end}" + html[html.index(end) + len(end):]
HTML.write_text(html, encoding="utf-8")
print(f"OK : {OUT.relative_to(ROOT)} écrit, index.html injecté ; erreurs : {len(result['erreurs'])}")
