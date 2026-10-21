#!/usr/bin/env python3
"""Politik : démarches les plus lues (service-public.gouv.fr) et jeux de données les plus téléchargés (data.gouv.fr).
Écrit data/populaires.json, lu par l'accueil (dashboard/populaires.js, via build-populaires.mjs).
 - service-public.gouv.fr : blocs « Fiches pratiques les plus lues » et « Démarches et outils » de la page d'accueil.
   Le second bloc est une sélection de l'éditeur, pas un classement : il est affiché comme tel.
 - data.gouv.fr : l'API ne sait pas trier par téléchargements. On rassemble les jeux les plus vus, les plus
   réutilisés et les plus suivis (≈ 300 jeux), puis on trie sur metrics.resources_downloads (cumul du compteur).
Python stdlib. En cas d'échec réseau, le fichier précédent est conservé et le script sort en 1.
   python3 Politik/scripts/fetch-populaires.py"""
import html, json, re, sys, time, urllib.request
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "data" / "populaires.json"
UA_NAV = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36", "Accept": "text/html", "Accept-Language": "fr-FR,fr;q=0.9"}
UA_API = {"User-Agent": "PolitikSite/1.0 (https://politik-eta.vercel.app; github antidoteforai-netizen/politik)", "Accept": "application/json"}

def get(url, headers, tries=3, timeout=60):
    err = None
    for _ in range(tries):
        try:
            return urllib.request.urlopen(urllib.request.Request(url, headers=headers), timeout=timeout).read().decode("utf-8", "ignore")
        except Exception as e:  # réseau, 429, délai
            err = e; time.sleep(3)
    raise err

def bloc(page, classe, fin=None, limite=7000):
    i = page.find(classe)
    if i < 0:
        raise ValueError("bloc introuvable : " + classe)
    j = page.find(fin, i + len(classe)) if fin else -1
    zone = page[i:j] if j > 0 else page[i:i + limite]
    out, seen = [], set()
    for href, txt in re.findall(r'<a[^>]+href="([^"]+)"[^>]*>(.*?)</a>', zone, flags=re.S):
        t = re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", txt))).strip()
        if not t or href.startswith("#") or "/theme" in href or "recherche?" in href or t.lower().startswith("voir toutes"):
            continue
        u = href if href.startswith("http") else "https://www.service-public.gouv.fr" + href
        if u not in seen:
            seen.add(u); out.append({"titre": t, "url": u})
    return out

def main():
    today = date.today().isoformat()
    try:
        home = get("https://www.service-public.gouv.fr/", UA_NAV)
        plus_lues = bloc(home, "sp-home-fiche-pratiques", "sp-home-demarches-outils")
        outils = bloc(home, "sp-home-demarches-outils", limite=5000)
        if len(plus_lues) < 3 or len(outils) < 3:
            raise ValueError("blocs service-public trop courts")
        seen = {}
        for tri, pages in (("-views", 4), ("-reuses", 4), ("-followers", 2)):
            for p in range(1, pages + 1):
                d = json.loads(get(f"https://www.data.gouv.fr/api/2/datasets/?sort={tri}&page_size=50&page={p}", UA_API))
                for y in d["data"]:
                    seen[y["id"]] = y
        seen = {k: y for k, y in seen.items() if not re.match(r'^(OLD|ANCIEN|\[?ARCHIV)', y['title'].strip(), re.I)}
        top = sorted(seen.values(), key=lambda y: (y.get("metrics") or {}).get("resources_downloads") or 0, reverse=True)[:8]
        jeux = [{"titre": re.sub(r"\s+", " ", y["title"]).strip(), "url": y["page"], "producteur": ((y.get("organization") or {}).get("name") or (y.get("owner") or {}).get("slug") or "").strip(),
                 "telechargements": y["metrics"].get("resources_downloads") or 0, "vues": y["metrics"].get("views") or 0, "reutilisations": y["metrics"].get("reuses") or 0} for y in top]
    except Exception as e:
        print("ÉCHEC, fichier précédent conservé :", e, file=sys.stderr)
        sys.exit(1)
    data = {
        "lu_le": today,
        "service_public": {"source": "https://www.service-public.gouv.fr/", "plus_lues": plus_lues, "outils_mis_en_avant": outils},
        "datagouv": {"source": "https://www.data.gouv.fr/", "echantillon": len(seen), "note": "Téléchargements cumulés affichés par data.gouv.fr, parmi les jeux les plus vus, réutilisés ou suivis. Ils incluent les téléchargements automatiques (applications, programmes), pas seulement ceux de personnes.", "jeux": jeux},
    }
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"OK : {len(plus_lues)} fiches les plus lues, {len(outils)} démarches mises en avant, {len(jeux)} jeux de données (sur {len(seen)}) → {OUT.relative_to(ROOT)}")

if __name__ == "__main__":
    main()
