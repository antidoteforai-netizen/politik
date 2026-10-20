# Audit de structure et de qualité web, 20 octobre 2026

Méthode : exploration automatisée des 11 pages dans un vrai navigateur (bureau 1 280 px et mobile 400 px), grille d'architecture de l'information (profondeur, navigation, plan du site, maillage) et grille de qualité web (titres, descriptions, accessibilité, erreurs console).

## Constats mesurés

| Constat | Avant | Après |
|---|---|---|
| Entrées du menu principal | 9 | 7 (les 4 dernières dans « Plus ») |
| Meta description par page | 0 sur 11 | 11 sur 11 |
| Titres | 3 ambigus (« Politik », « Politik simple », « Politik 2027 ») | tous explicites, 50 à 60 caractères |
| Plan du site en pied de page | absent | 10 liens en 4 groupes sur chaque page |
| Erreurs console, ancres cassées, liens internes cassés | 0 | 0 |
| Images sans texte alternatif, titres h1 multiples, ids dupliqués | 0 | 0 |
| Débordement horizontal à 400 px | aucun | aucun |

## Décisions

- Le menu garde les sujets les plus consultés (Gouvernement, Fraude, Médias, Police, Cyber, 17 octobre). « Plus » regroupe Présidentielle, France, États-Unis, Sources. Sans JavaScript, le menu complet reste affiché.
- Le pied de page regroupe les 10 pages en quatre familles : L'État, Argent et médias, Sécurité, Comprendre.

## Restant

- Les boutons de glossaire dans le texte de la page fraude mesurent 16 à 24 px de haut : ils sont dans des phrases (cas toléré par WCAG 2.2) mais restent petits au doigt.
- Pas de page d'accueil qui oriente vers les neuf rôles : la page Fraude joue ce rôle. À décider.
- Pas de mesure Lighthouse (poids des images, LCP) : à lancer sur le site publié.
- Pas de fil d'Ariane : deux pages en ont un, les autres non.
