#!/usr/bin/env python3
"""Politik — crée data/gouvernement.json (structure du Gouvernement) si le fichier n'existe pas.

Source de la composition : https://www.info.gouv.fr/composition-du-gouvernement (annoncée le 26/02/2026, lue le
2026-10-20). Le fichier est ensuite enrichi à la main et par la veille (« à savoir » et actualités vérifiées sur les
sites officiels). Ce script ne l'écrase jamais.

Chaque ministère a : id, nom officiel, nom court, ministre, délégués, pictogramme (SVG 48x48 en traits, `currentColor`),
famille de couleur, pages Politik concernées, site officiel (vide tant qu'il n'est pas vérifié), « à savoir pour les
citoyens » et date de vérification.
"""
import json
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "data" / "gouvernement.json"
if OUT.exists():
    raise SystemExit(f"{OUT.name} existe déjà : rien écrit (édition à la main ou par la veille).")

S = 'fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"'
def svg(inner): return f'<g {S}>{inner}</g>'
ICONES = {
 "premier-ministre": svg('<circle cx="24" cy="24" r="17"/><path d="M24 12l3.5 7.3 8 1.1-5.8 5.6 1.4 8-7.1-3.8-7.1 3.8 1.4-8-5.8-5.6 8-1.1z"/>'),
 "interieur": svg('<path d="M24 6l14 5v12c0 9-6 16-14 19-8-3-14-10-14-19V11z"/><path d="M18 24l4 4 8-9"/>'),
 "armees": svg('<path d="M12 18l12-8 12 8"/><path d="M12 28l12-8 12 8"/><path d="M12 38l12-8 12 8"/>'),
 "travail-solidarites": svg('<rect x="8" y="16" width="32" height="22" rx="3"/><path d="M18 16v-4h12v4M8 26h32"/>'),
 "transition-ecologique": svg('<path d="M12 36C12 20 22 10 38 10c0 16-10 26-26 26z"/><path d="M12 36l16-16"/>'),
 "justice": svg('<path d="M24 8v30M14 40h20M10 14h28"/><path d="M10 14L4 26h12zM38 14l-6 12h12z"/>'),
 "economie": svg('<ellipse cx="24" cy="14" rx="12" ry="5"/><path d="M12 14v8c0 3 5 5 12 5s12-2 12-5v-8M12 22v8c0 3 5 5 12 5s12-2 12-5v-8M12 30v8c0 3 5 5 12 5s12-2 12-5v-8"/>'),
 "pme-commerce": svg('<path d="M8 18l4-10h24l4 10"/><path d="M8 18c0 4 6 4 8 0 2 4 6 4 8 0 2 4 6 4 8 0 2 4 8 4 8 0"/><path d="M10 25v15h28V25"/><rect x="20" y="30" width="8" height="10"/>'),
 "agriculture": svg('<path d="M24 42V18"/><path d="M24 18c-4-2-4-6 0-10 4 4 4 8 0 10z"/><path d="M24 26c-5-1-7-4-7-8 4 0 7 3 7 8zM24 34c-5-1-7-4-7-8 4 0 7 3 7 8zM24 26c5-1 7-4 7-8-4 0-7 3-7 8zM24 34c5-1 7-4 7-8-4 0-7 3-7 8z"/>'),
 "education": svg('<path d="M24 14c-5-4-12-4-18-2v26c6-2 13-2 18 2 5-4 12-4 18-2V12c-6-2-13-2-18 2z"/><path d="M24 14v26"/>'),
 "europe-affaires-etrangeres": svg('<circle cx="24" cy="24" r="16"/><ellipse cx="24" cy="24" rx="7" ry="16"/><path d="M8 24h32M10 15h28M10 33h28"/>'),
 "sante": svg('<circle cx="24" cy="24" r="17"/><path d="M24 15v18M15 24h18"/>'),
 "culture": svg('<path d="M6 16L24 6l18 10z"/><path d="M12 20v14M20 20v14M28 20v14M36 20v14M6 38h36"/>'),
 "outre-mer": svg('<path d="M22 42c0-12 2-18 6-26"/><path d="M28 16c-6-6-14-4-18 2M28 16c4-8 12-8 14-2M28 16c2 4 8 6 12 12M28 16c-4 4-10 4-14 10"/><path d="M10 42h28"/>'),
 "amenagement-territoire": svg('<path d="M24 42S12 30 12 20a12 12 0 0124 0c0 10-12 22-12 22z"/><circle cx="24" cy="20" r="4"/>'),
 "action-comptes-publics": svg('<path d="M8 40h32"/><rect x="10" y="28" width="8" height="12" rx="1"/><rect x="20" y="16" width="8" height="24" rx="1"/><rect x="30" y="22" width="8" height="18" rx="1"/>'),
 "enseignement-superieur": svg('<ellipse cx="24" cy="24" rx="17" ry="7" transform="rotate(45 24 24)"/><ellipse cx="24" cy="24" rx="17" ry="7" transform="rotate(-45 24 24)"/><circle cx="24" cy="24" r="2.6" fill="currentColor"/>'),
 "sports-jeunesse": svg('<circle cx="24" cy="29" r="10"/><path d="M17 8l5 12M31 8l-5 12"/><path d="M24 24l2 4 4 .6-3 3 .8 4-3.8-2-3.8 2 .8-4-3-3 4-.6z"/>'),
 "transports": svg('<rect x="10" y="8" width="28" height="26" rx="6"/><rect x="15" y="13" width="18" height="9" rx="2"/><circle cx="17" cy="29" r="2"/><circle cx="31" cy="29" r="2"/><path d="M14 41l4-7M34 41l-4-7"/>'),
 "ville-logement": svg('<path d="M8 22L24 8l16 14v18H8z"/><rect x="20" y="28" width="8" height="12"/>'),
 "cyber": svg('<rect x="11" y="21" width="26" height="19" rx="4"/><path d="M16 21v-6c0-6 16-6 16 0v6"/><circle cx="24" cy="30" r="2.6"/><path d="M24 33v3"/>'),
}
def M(id, nom, court, ministre, delegues, famille, pages, site=None):
    return {"id": id, "nom": nom, "court": court, "ministre": ministre, "delegues": delegues, "famille": famille,
            "icone": ICONES[id], "pages": pages, "site": site, "site_verifie_le": None, "a_savoir": [], "verifie_le": None}
D = lambda n, r: {"nom": n, "role": r}
data = {
 "composition": {"annoncee_le": "2026-02-26", "lue_le": "2026-10-20", "source": "https://www.info.gouv.fr/composition-du-gouvernement"},
 "familles": {"regalien": "c1", "territoires": "c3", "economie": "c2", "societe": "c4", "autres": "c5"},
 "ministeres": [
  M("premier-ministre", "Premier ministre", "Premier ministre", "Sébastien Lecornu", [D("Laurent Panifous", "Relations avec le Parlement"), D("Maud Bregeon", "Porte-parole du Gouvernement ; Énergie (auprès du ministre de l'Économie)"), D("Aurore Bergé", "Égalité entre les femmes et les hommes, lutte contre les discriminations")], "regalien", ["17-octobre-2026.html", "presidentielle-2027.html"]),
  M("interieur", "Ministère de l'Intérieur", "Intérieur", "Laurent Nunez", [D("Jean-Didier Berger", "Ministre délégué"), D("Marie-Pierre Vedrenne", "Citoyenneté")], "regalien", ["forces.html", "17-octobre-2026.html", "presidentielle-2027.html", "index.html"]),
  M("armees", "Ministère des Armées et des Anciens combattants", "Armées", "Catherine Vautrin", [D("Alice Rufo", "Ministre déléguée")], "regalien", []),
  M("travail-solidarites", "Ministère du Travail et des Solidarités", "Travail et Solidarités", "Jean-Pierre Farandou", [D("Sabrina Roubache", "Enseignement et formation professionnels, apprentissage")], "economie", ["index.html", "17-octobre-2026.html", "secteurs.html"]),
  M("transition-ecologique", "Ministère de la Transition écologique, de la Biodiversité et des Négociations internationales sur le climat et la nature", "Transition écologique", "Monique Barbut", [D("Catherine Chabaud", "Mer et Pêche"), D("Mathieu Lefèvre", "Transition écologique")], "territoires", ["secteurs.html"]),
  M("justice", "Ministère de la Justice", "Justice", "Gérald Darmanin", [], "regalien", ["forces.html", "17-octobre-2026.html"]),
  M("economie", "Ministère de l'Économie, des Finances et de la Souveraineté industrielle, énergétique et numérique", "Économie et Finances", "Roland Lescure", [D("Maud Bregeon", "Énergie"), D("Sébastien Martin", "Industrie"), D("Anne Le Henanff", "Intelligence artificielle et Numérique")], "economie", ["index.html", "17-octobre-2026.html", "donnees.html", "benchmark-usa.html", "secteurs.html"]),
  M("pme-commerce", "Ministère des Petites et moyennes entreprises, du Commerce, de l'Artisanat et du Tourisme et du Pouvoir d'achat", "PME, Commerce et Pouvoir d'achat", "Serge Papin", [], "economie", ["17-octobre-2026.html"]),
  M("agriculture", "Ministère de l'Agriculture, de l'Agro-alimentaire et de la Souveraineté alimentaire", "Agriculture", "Annie Genevard", [], "territoires", ["secteurs.html"]),
  M("education", "Ministère de l'Éducation nationale", "Éducation nationale", "Édouard Geffray", [D("Sabrina Roubache", "Enseignement et formation professionnels, apprentissage")], "societe", ["secteurs.html"]),
  M("europe-affaires-etrangeres", "Ministère de l'Europe et des Affaires étrangères", "Europe et Affaires étrangères", "Jean-Noël Barrot", [D("Benjamin Haddad", "Europe"), D("Nicolas Forissier", "Commerce extérieur et Attractivité"), D("Éléonore Caroit", "Francophonie, partenariats internationaux, Français de l'étranger")], "regalien", ["secteurs.html"]),
  M("sante", "Ministère de la Santé, des Familles, de l'Autonomie et des Personnes handicapées", "Santé et Familles", "Stéphanie Rist", [D("Camille Galliard-Minier", "Autonomie et Personnes handicapées")], "societe", ["index.html", "secteurs.html"]),
  M("culture", "Ministère de la Culture", "Culture", "Catherine Pégard", [], "societe", ["medias.html"]),
  M("outre-mer", "Ministère des Outre-mer", "Outre-mer", "Naïma Moutchou", [], "autres", ["secteurs.html"]),
  M("amenagement-territoire", "Ministère de l'Aménagement du territoire et de la Décentralisation", "Aménagement du territoire", "Françoise Gatel", [], "territoires", ["secteurs.html"]),
  M("action-comptes-publics", "Ministère de l'Action et des Comptes publics", "Action et Comptes publics", "David Amiel", [], "economie", ["index.html", "secteurs.html"]),
  M("enseignement-superieur", "Ministère de l'Enseignement supérieur, de la Recherche et de l'Espace", "Enseignement supérieur et Recherche", "Philippe Baptiste", [], "societe", []),
  M("sports-jeunesse", "Ministère des Sports, de la Jeunesse et de la Vie associative", "Sports et Jeunesse", "Marina Ferrari", [], "societe", []),
  M("transports", "Ministère des Transports", "Transports", "Philippe Tabarot", [], "territoires", ["secteurs.html"]),
  M("ville-logement", "Ministère de la Ville et du Logement", "Ville et Logement", "Vincent Jeanbrun", [], "territoires", ["secteurs.html"]),
 ],
 "autres_acteurs": [
  {"id": "cyber", "nom": "Cyber.gouv.fr (Agence nationale de la sécurité des systèmes d'information)", "court": "Cybersécurité", "ministre": None, "delegues": [], "famille": "autres",
   "icone": ICONES["cyber"], "pages": ["forces.html"], "site": "https://cyber.gouv.fr/", "site_verifie_le": None, "a_savoir": [], "verifie_le": None}
 ],
 "pages": {
  "index.html": ["action-comptes-publics", "economie", "travail-solidarites", "sante", "interieur", "justice"],
  "simple.html": ["action-comptes-publics", "economie", "travail-solidarites", "sante", "interieur", "justice"],
  "medias.html": ["culture"],
  "forces.html": ["interieur", "justice", "cyber"],
  "17-octobre-2026.html": ["premier-ministre", "interieur", "justice", "pme-commerce", "travail-solidarites", "economie"],
  "presidentielle-2027.html": ["interieur", "premier-ministre"],
  "secteurs.html": ["premier-ministre", "interieur", "justice", "economie", "action-comptes-publics", "travail-solidarites", "sante", "education"],
  "donnees.html": ["economie"],
  "benchmark-usa.html": ["economie"]
 },
 "actualites": []
}
OUT.parent.mkdir(exist_ok=True)
OUT.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"OK : {OUT.name} créé ({len(data['ministeres'])} ministères, {len(data['autres_acteurs'])} autre acteur)")
