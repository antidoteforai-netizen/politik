#!/usr/bin/env python3
"""Politik — photos des personnes citées et logos des institutions, médias et entreprises.

Pour chaque entité de la liste ci-dessous, interroge l'API REST de Wikipédia (résumé de la page), télécharge
l'image principale en local (dashboard/img/ent/), relève sa licence et son auteur auprès de l'API de
Wikimedia Commons (ou de Wikipédia pour les fichiers locaux), puis écrit data/entites.json et
dashboard/entites.js (window.ENTITES) que lit dashboard/visuels.js.

Règles :
- Personnes : seules les photos hébergées sur Wikimedia Commons (licences libres) sont gardées. Une photo non
  libre (fichier local de Wikipédia) est écartée : mieux vaut un avatar d'initiales qu'une photo sans droit.
- Institutions, médias, entreprises : le logo de la page Wikipédia est gardé tel quel et signalé comme marque de
  son détenteur, utilisé uniquement pour identifier l'organisation.
- Aucun appel réseau depuis les pages : les images sont servies depuis le dossier du site.
- Chaque image porte son crédit (auteur, licence, page source) affiché sur la page Sources et données.

Stdlib seulement.   python3 Politik/scripts/fetch-visuels.py
"""
import json, re, time, urllib.parse, urllib.request, urllib.error, datetime, html
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
IMG = ROOT / "dashboard" / "img" / "ent"
UA = {"User-Agent": "PolitikBot/0.7 (tableau de bord citoyen; https://github.com/antidoteforai-netizen/politik) python-urllib"}
WP = "https://fr.wikipedia.org/api/rest_v1/page/summary/"

# (slug, nom affiché, type, titre Wikipédia, alias à reconnaître dans les textes)
P, O, M, E = "personne", "institution", "media", "entreprise"
ENTITES = [
    # propriétaires et dirigeants
    ("vincent-bollore", "Vincent Bolloré", P, "Vincent_Bolloré", []),
    ("bernard-arnault", "Bernard Arnault", P, "Bernard_Arnault", []),
    ("rodolphe-saade", "Rodolphe Saadé", P, "Rodolphe_Saadé", []),
    ("martin-bouygues", "Martin Bouygues", P, "Martin_Bouygues", []),
    ("xavier-niel", "Xavier Niel", P, "Xavier_Niel", []),
    ("daniel-kretinsky", "Daniel Křetínský", P, "Daniel_Křetínský", ["Daniel Kretinsky"]),
    ("delphine-arnault", "Delphine Arnault", P, "Delphine_Arnault", []),
    ("matthieu-pigasse", "Matthieu Pigasse", P, "Matthieu_Pigasse", []),
    ("arnaud-lagardere", "Arnaud Lagardère", P, "Arnaud_Lagardère", []),
    ("yannick-bollore", "Yannick Bolloré", P, "Yannick_Bolloré", []),
    ("cyrille-bollore", "Cyrille Bolloré", P, "Cyrille_Bolloré", []),
    ("arnaud-de-puyfontaine", "Arnaud de Puyfontaine", P, "Arnaud_de_Puyfontaine", []),
    ("maxime-saada", "Maxime Saada", P, "Maxime_Saada", []),
    ("jean-christophe-thiery", "Jean-Christophe Thiery", P, "Jean-Christophe_Thiery", []),
    ("geoffroy-lejeune", "Geoffroy Lejeune", P, "Geoffroy_Lejeune", []),
    # responsables publics cités
    ("emmanuel-macron", "Emmanuel Macron", P, "Emmanuel_Macron", []),
    ("brigitte-macron", "Brigitte Macron", P, "Brigitte_Macron", []),
    ("sebastien-lecornu", "Sébastien Lecornu", P, "Sébastien_Lecornu", ["Lecornu"]),
    ("maud-bregeon", "Maud Bregeon", P, "Maud_Bregeon", ["Bregeon"]),
    ("laurent-nunez", "Laurent Nuñez", P, "Laurent_Nuñez", ["Nuñez"]),
    ("emmanuel-gregoire", "Emmanuel Grégoire", P, "Emmanuel_Grégoire", []),
    ("nicolas-sarkozy", "Nicolas Sarkozy", P, "Nicolas_Sarkozy", []),
    # institutions
    ("arcom", "Arcom", O, "Autorité_de_régulation_de_la_communication_audiovisuelle_et_numérique", ["Arcom"]),
    ("ministere-culture", "Ministère de la Culture", O, "Ministère_de_la_Culture_(France)", []),
    ("elysee", "Élysée", O, "Palais_de_l'Élysée", ["Élysée"]),
    ("urssaf", "Urssaf", O, "Union_de_recouvrement_des_cotisations_de_sécurité_sociale_et_d'allocations_familiales", ["Urssaf", "Open Urssaf"]),
    ("caf", "CAF", O, ["Caisse_d'allocations_familiales_(France)", "Caisse_d'allocations_familiales"], ["CAF", "CNAF"]),
    ("cnav", "CNAV", O, "Caisse_nationale_d'assurance_vieillesse", ["CNAV"]),
    ("insee", "INSEE", O, "Institut_national_de_la_statistique_et_des_études_économiques", ["INSEE"]),
    ("ofpra", "OFPRA", O, "Office_français_de_protection_des_réfugiés_et_apatrides", ["OFPRA", "Ofpra"]),
    ("drees", "DREES", O, "Direction_de_la_recherche,_des_études,_de_l'évaluation_et_des_statistiques", ["DREES"]),
    ("igpn", "IGPN", O, "Inspection_générale_de_la_Police_nationale", ["IGPN"]),
    ("senat", "Sénat", O, "Sénat_(France)", ["Sénat"]),
    ("assemblee-nationale", "Assemblée nationale", O, "Assemblée_nationale_(France)", ["Assemblée nationale"]),
    ("conseil-etat", "Conseil d'État", O, "Conseil_d'État_(France)", ["Conseil d'État"]),
    ("cour-des-comptes", "Cour des comptes", O, "Cour_des_comptes_(France)", ["Cour des comptes"]),
    ("dgfip", "DGFiP", O, "Direction_générale_des_Finances_publiques", ["DGFiP"]),
    ("ministere-interieur", "Ministère de l'Intérieur", O, "Ministère_de_l'Intérieur_(France)", ["Ministère de l'Intérieur"]),
    ("cncdh", "CNCDH", O, "Commission_nationale_consultative_des_droits_de_l'homme", ["CNCDH"]),
    ("ville-de-paris", "Ville de Paris", O, "Paris", ["Ville de Paris"]),
    ("prefecture-police", "Préfecture de police de Paris", O, "Préfecture_de_police_de_Paris", ["préfecture de police de Paris", "Préfecture de police"]),
    ("gendarmerie", "Gendarmerie nationale", O, "Gendarmerie_nationale_(France)", ["Gendarmerie nationale"]),
    ("police-nationale", "Police nationale", O, "Police_nationale_(France)", ["Police nationale"]),
    ("data-gouv", "data.gouv.fr", O, "Data.gouv.fr", ["data.gouv.fr"]),
    ("defenseur-des-droits", "Défenseur des droits", O, ["Défenseur_des_droits", "Défenseur_des_droits_(France)"], ["Défenseur des droits"]),
    ("bercy", "Ministère de l'Économie", O, "Ministère_de_l'Économie_et_des_Finances_(France)", ["Ministère de l'Économie", "Bercy"]),
    ("conseil-constitutionnel", "Conseil constitutionnel", O, "Conseil_constitutionnel_(France)", ["Conseil constitutionnel"]),
    ("cnrs", "CNRS", O, "Centre_national_de_la_recherche_scientifique", ["CNRS"]),
    ("inserm", "Inserm", O, "Institut_national_de_la_santé_et_de_la_recherche_médicale", ["Inserm"]),
    ("acrimed", "Acrimed", O, "Acrimed", ["Acrimed"]),
    ("rsf", "Reporters sans frontières", O, "Reporters_sans_frontières", ["RSF", "Reporters sans frontières"]),
    ("oxfam-france", "Oxfam France", O, "Oxfam_France", ["Oxfam France"]),
    ("mgp", "Mutuelle générale de la police", O, "Mutuelle_générale_de_la_police", ["MGP"]),
    ("usafacts", "USAFacts", O, "USAFacts", ["USAFacts"]),
    # médias
    ("cnews", "CNews", M, "CNews", ["CNews"]),
    ("bfmtv", "BFMTV", M, "BFM_TV", ["BFMTV", "BFM TV"]),
    ("rmc", "RMC", M, ["RMC_(radio)", "RMC", "RMC_(station_de_radio)"], ["RMC"]),
    ("tf1", "TF1", M, "TF1", ["TF1"]),
    ("lci", "LCI", M, ["LCI_(chaîne_de_télévision)", "LCI_(chaîne)", "LCI"], ["LCI"]),
    ("canal-plus", "Canal+", M, "Canal+", ["Canal+"]),
    ("c8", "C8", M, "C8_(chaîne_de_télévision)", ["C8"]),
    ("france-televisions", "France Télévisions", M, "France_Télévisions", ["France Télévisions"]),
    ("franceinfo", "franceinfo", M, "Franceinfo", ["franceinfo"]),
    ("public-senat", "Public Sénat", M, "Public_Sénat", ["Public Sénat"]),
    ("lcp", "LCP", M, "La_Chaîne_parlementaire", ["LCP"]),
    ("le-monde", "Le Monde", M, "Le_Monde", ["Le Monde"]),
    ("les-echos", "Les Échos", M, ["Les_Échos_quotidien", "Les_Échos_(quotidien)"], ["Les Échos"]),
    ("le-parisien", "Le Parisien", M, "Le_Parisien", ["Le Parisien"]),
    ("le-figaro", "Le Figaro", M, "Le_Figaro", ["Le Figaro"]),
    ("liberation", "Libération", M, "Libération_(quotidien)", ["Libération"]),
    ("le-jdd", "Le JDD", M, "Le_Journal_du_dimanche", ["JDD", "Le JDD"]),
    ("europe-1", "Europe 1", M, "Europe_1", ["Europe 1"]),
    ("paris-match", "Paris Match", M, "Paris_Match", ["Paris Match"]),
    ("marianne", "Marianne", M, "Marianne_(hebdomadaire)", ["Marianne"]),
    ("la-provence", "La Provence", M, ["La_Provence", "La_Provence_(quotidien)"], ["La Provence"]),
    ("la-tribune", "La Tribune", M, "La_Tribune_(France)", ["La Tribune"]),
    ("ouest-france", "Ouest-France", M, "Ouest-France", ["Ouest-France"]),
    ("le-monde-diplomatique", "Le Monde diplomatique", M, "Le_Monde_diplomatique", ["Le Monde diplomatique"]),
    ("humanite", "L'Humanité", M, "L'Humanité", ["L'Humanité"]),
    ("la-croix", "La Croix", M, "La_Croix", ["La Croix"]),
    ("radio-france", "Radio France", M, "Radio_France", ["Radio France"]),
    ("arte", "Arte", M, "Arte", ["Arte"]),
    # entreprises
    ("lvmh", "LVMH", E, "LVMH", ["LVMH"]),
    ("bouygues", "Bouygues", E, "Bouygues", ["Bouygues"]),
    ("cma-cgm", "CMA CGM", E, "CMA_CGM", ["CMA CGM"]),
    ("bollore-se", "Bolloré", E, ["Groupe_Bolloré", "Bolloré_(entreprise)"], ["Bolloré SE"]),
    ("vivendi", "Vivendi", E, "Vivendi", ["Vivendi"]),
    ("lagardere", "Lagardère", E, "Lagardère_(entreprise)", ["Lagardère"]),
    ("louis-hachette-group", "Louis Hachette Group", E, "Louis_Hachette_Group", ["Louis Hachette Group"]),
    ("havas", "Havas", E, "Havas", ["Havas"]),
    ("iliad", "Iliad", E, ["Iliad", "Iliad_(entreprise)"], ["Iliad"]),
    ("ep-group", "EP Group", E, "EP_Group", ["EP Group"]),
    ("altice", "Altice", E, "Altice_(entreprise)", ["Altice"]),
    ("prisma-media", "Prisma Media", E, "Prisma_Media", ["Prisma Media"]),
    ("hachette-livre", "Hachette Livre", E, "Hachette_Livre", ["Hachette Livre"]),
    ("editis", "Editis", E, "Editis", ["Editis"]),
    ("sciences-po", "Sciences Po", O, ["Sciences_Po"], ["Sciences Po"]),
]

def get(url, binary=False, retries=3):
    last = None
    for i in range(retries):
        try:
            r = urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60)
            data = r.read()
            return (data, r.headers.get("Content-Type", "")) if binary else json.loads(data.decode("utf-8"))
        except urllib.error.HTTPError as e:
            last = e
            if e.code == 404:
                return None
            time.sleep(1.5 * (i + 1))
        except Exception as e:  # coupure réseau passagère
            last = e
            time.sleep(1.5 * (i + 1))
    raise last

def licence_info(file_name, host):
    """Auteur, licence et page du fichier, via l'API MediaWiki du site qui héberge le fichier."""
    api = f"https://{host}/w/api.php?action=query&format=json&prop=imageinfo&iiprop=extmetadata%7Curl&titles=" + urllib.parse.quote("File:" + file_name)
    d = get(api)
    if not d:
        return {}
    for page in d.get("query", {}).get("pages", {}).values():
        ii = (page.get("imageinfo") or [{}])[0]
        m = ii.get("extmetadata", {})
        def val(k):
            v = (m.get(k) or {}).get("value", "")
            return html.unescape(re.sub(r"<[^>]+>", "", v)).strip()
        return {"auteur": val("Artist")[:140], "licence": val("LicenseShortName") or val("UsageTerms"), "credit": val("Credit")[:140],
                "page_fichier": ii.get("descriptionurl", ""), "libre": val("LicenseShortName").lower().startswith(("cc", "public domain", "domaine public", "pd", "licence ouverte", "open licence", "etalab"))}
    return {}

# Candidats à la présidentielle : noms lus dans la page (même ordre alphabétique, même traitement pour tous)
try:
    page = (ROOT / "dashboard" / "presidentielle-2027.html").read_text(encoding="utf-8")
    deja = {e[0] for e in ENTITES}
    for nom in re.findall(r'\{nom:"([^"]+)", parti:', page):
        slug = re.sub(r"[^a-z0-9]+", "-", html.unescape(nom).lower().translate(str.maketrans("àâäéèêëîïôöùûüçñ", "aaaeeeeiioouuucn"))).strip("-")
        if slug not in deja:
            ENTITES.append((slug, nom, P, [nom.replace(" ", "_")], [])); deja.add(slug)
except FileNotFoundError:
    pass
# Ministres et délégués (composition du Gouvernement lue sur info.gouv.fr)
try:
    gv = json.loads((ROOT / "data" / "gouvernement.json").read_text(encoding="utf-8"))
    deja = {e[0] for e in ENTITES}
    def _slug(n): return re.sub(r"[^a-z0-9]+", "-", html.unescape(n).lower().translate(str.maketrans("àâäéèêëîïôöùûüçñ", "aaaeeeeiioouuucn"))).strip("-")
    noms = []
    for m in gv.get("ministeres", []):
        if m.get("ministre"): noms.append(m["ministre"])
        noms += [d["nom"] for d in m.get("delegues", [])]
    for nom in dict.fromkeys(noms):
        sl = _slug(nom)
        if sl not in deja:
            ENTITES.append((sl, nom, P, [nom.replace(" ", "_"), nom.replace(" ", "_") + "_(homme_politique)", nom.replace(" ", "_") + "_(femme_politique)"], [])); deja.add(sl)
except FileNotFoundError:
    pass
IMG.mkdir(parents=True, exist_ok=True)
result, echecs, ecartes = {}, [], []
for slug, nom, typ, titre, alias in ENTITES:
    s = None
    try:
        for t in (titre if isinstance(titre, list) else [titre]):
            c = get(WP + urllib.parse.quote(t, safe="()_,'"))
            if c and c.get("type") == "standard":
                s = c; titre_ok = t; break
    except Exception as e:
        echecs.append((slug, f"réseau : {e}")); continue
    if not s:
        echecs.append((slug, "page absente ou ambiguë")); continue
    th = (s.get("thumbnail") or {}).get("source")
    entry = {"nom": nom, "type": typ, "alias": [nom] + alias, "wiki": (s.get("content_urls", {}).get("desktop", {}) or {}).get("page", ""),
             "desc": (s.get("description") or "").strip(), "img": None, "credit": None}
    if th:
        orig = (s.get("originalimage") or {}).get("source", th)
        m = re.search(r"upload\.wikimedia\.org/wikipedia/(commons|fr)/(?:thumb/)?[0-9a-f]/[0-9a-f]{2}/([^/?]+)", orig)
        host = "commons.wikimedia.org" if (m and m.group(1) == "commons") else "fr.wikipedia.org"
        fname = urllib.parse.unquote(m.group(2)) if m else None
        lic = licence_info(fname, host) if fname else {}
        libre = host == "commons.wikimedia.org" and lic.get("libre", False)
        if typ == P and not libre:
            ecartes.append((slug, f"photo non libre ou licence inconnue ({lic.get('licence') or host})"))
        else:
            try:
                data, ctype = get(th, binary=True)
                ext = {"image/png": "png", "image/jpeg": "jpg", "image/webp": "webp", "image/svg+xml": "svg"}.get(ctype.split(";")[0], "png")
                (IMG / f"{slug}.{ext}").write_bytes(data)
                entry["img"] = f"img/ent/{slug}.{ext}"
                entry["credit"] = {"auteur": lic.get("auteur", ""), "licence": lic.get("licence") or ("logo : marque de son détenteur, utilisé pour identifier l'organisation" if typ != P else ""),
                                   "source": lic.get("page_fichier") or entry["wiki"], "type_image": "photo" if typ == P else "logo"}
            except Exception as e:
                echecs.append((slug, f"image : {e}"))
    elif typ != P:
        try:  # repli : fichier « logo » parmi les images de la page
            d = get("https://fr.wikipedia.org/w/api.php?action=query&format=json&prop=images&imlimit=80&titles=" + urllib.parse.quote(titre_ok))
            files = [im["title"] for pg in d["query"]["pages"].values() for im in pg.get("images", [])]
            cand = [f for f in files if re.search(r"logo", f, re.I) and not re.search(r"\.(ogg|webm|ogv|oga)$", f, re.I)]
            if cand:
                fn = cand[0][len("Fichier:"):] if cand[0].startswith("Fichier:") else cand[0].split(":", 1)[-1]
                ii = get("https://fr.wikipedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=url%7Cextmetadata&iiurlwidth=240&titles=" + urllib.parse.quote("File:" + fn))
                info = next(iter(ii["query"]["pages"].values())).get("imageinfo", [{}])[0]
                thumb = info.get("thumburl") or info.get("url")
                if thumb:
                    data, ctype = get(thumb, binary=True)
                    ext = {"image/png": "png", "image/jpeg": "jpg", "image/webp": "webp", "image/svg+xml": "svg"}.get(ctype.split(";")[0], "png")
                    (IMG / f"{slug}.{ext}").write_bytes(data)
                    entry["img"] = f"img/ent/{slug}.{ext}"
                    entry["credit"] = {"auteur": "", "licence": "logo : marque de son détenteur, utilisé pour identifier l'organisation", "source": info.get("descriptionurl", entry["wiki"]), "type_image": "logo"}
            if not entry["img"]:
                ecartes.append((slug, "pas de logo trouvé sur la page"))
        except Exception as e:
            ecartes.append((slug, f"repli logo : {e}"))
    else:
        ecartes.append((slug, "pas d'image sur la page"))
    result[slug] = entry
    time.sleep(0.15)

out = {"genere_le": datetime.date.today().isoformat(), "entites": result}
(ROOT / "data").mkdir(exist_ok=True)
(ROOT / "data" / "entites.json").write_text(json.dumps(out, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
(ROOT / "dashboard" / "entites.js").write_text("/* Politik — photos et logos : généré par scripts/fetch-visuels.py. Ne pas éditer. */\nwindow.ENTITES = " + json.dumps(result, ensure_ascii=False) + ";\n", encoding="utf-8")
avec = [k for k, v in result.items() if v["img"]]
print(f"OK : {len(result)} entités, {len(avec)} avec image ; écartées : {len(ecartes)} ; échecs : {len(echecs)}")
for slug, why in ecartes: print("  écartée", slug, "|", why)
for slug, why in echecs: print("  échec", slug, "|", why)
