<p align="center">
  <img src="dashboard/logo.png" alt="Politik" width="320">
</p>

<h3 align="center">Lire les données publiques sur le pouvoir, l'argent et la sécurité, sans qu'on vous dise quoi en penser.</h3>

<p align="center">
  Tableau de bord citoyen · français · aucun traceur · chaque chiffre porte sa source
</p>

---

## L'enjeu, en une image

Imaginez le réseau d'eau d'une ville. Chacun entend dire qu'« il y a des fuites ». Les uns les chiffrent à quelques gouttes, les autres à un fleuve. Personne ne montre les tuyaux, ni qui a mesuré, ni avec quel compteur.

Sur la fraude sociale, la propriété des médias, la police ou les cyberattaques, c'est la même situation. Les chiffres existent, ils sont publics, mais ils sont dispersés, écrits dans la langue de l'administration, et souvent cités sans leur périmètre. Le lecteur reçoit un nombre et une émotion, rarement une méthode.

**Politik remet les compteurs à côté des tuyaux.** Pour chaque chiffre affiché, le site dit :

- qui l'a produit, en quelle année, sur quel périmètre ;
- à quel point on peut s'y fier (voir les niveaux ci-dessous) ;
- ce que les sources ne disent pas encore.

Le site ne tranche pas. Il ne cherche ni à rassurer ni à alarmer.

## Les quatre niveaux de confiance

Chaque donnée porte une pastille.

| Pastille | Sens |
|---|---|
| **V** | Vérifié : publié par l'institution elle-même |
| **S** | Source secondaire : presse, étude, association |
| **D** | Déclaratif : annonce ou position d'un responsable, pas un fait établi |
| **A** | À vérifier : chiffre cité sans source retrouvée |

## Ce qu'on y trouve

| Page | Question à laquelle elle répond |
|---|---|
| `accueil.html` | Par où commencer ? Sept sujets, trois chiffres sourcés chacun, l'actualité vérifiée et des raccourcis par rôle. |
| `gouvernement.html` | Qui compose le Gouvernement, quels sont les 20 ministères, que faut-il savoir de chacun ? |
| `index.html` | Combien coûte la fraude sociale, qui la mesure, et où les mesures divergent-elles ? |
| `medias.html` | À qui appartiennent les médias, et quelles aides publiques reçoivent-ils ? |
| `forces.html` | Que disent les sources sur la police, la gendarmerie et les violences enregistrées ? |
| `17-octobre-2026.html` | Que savons-nous des événements du 17 octobre 2026, et qui dit quoi ? |
| `cybersecurite.html` | Que fait l'État contre les vols de données, et que constate l'ANSSI ? |
| `presidentielle-2027.html` | Où en est l'élection de 2027, et quels candidats sont déclarés ? |
| `secteurs.html` | Comment va la France, sujet par sujet ? |
| `benchmark-usa.html` | Qu'est-ce que les États-Unis publient pour leurs décideurs ? |
| `donnees.html` | D'où vient chaque donnée ? Registre complet des sources et crédits des images. |

Chaque page existe en deux niveaux de lecture : **termes de l'État** (les intitulés officiels) et **FALC** (facile à lire et à comprendre). Le niveau FALC suit la méthode, mais il n'a pas encore été relu par des personnes concernées : il ne porte donc pas le logo FALC.

## Pour qui

Le site est écrit pour neuf lecteurs : citoyen·ne, journaliste, décideur, ministre, immigrant, commerçant, salarié, freelance et agent de caisse. La page d'accueil oriente chacun vers ce qu'il vient chercher, et chaque page propose un petit test (QCM) qui renvoie à la source de sa réponse.

## Principes de fabrication

- **Texte pour le lecteur.** Chaque phrase dit qui parle, quand, et d'où vient le chiffre.
- **Aucun axe tronqué, aucun rouge d'alarme.** Un contrepoids accompagne chaque chiffre (non-recours, faux positifs).
- **Aucun traceur, aucune dépendance.** HTML, CSS et JavaScript simples, lisibles dans n'importe quel navigateur.
- **Photos et logos sous licence libre seulement**, avec crédit (voir `donnees.html`). Pour une personne, pas de licence libre, pas de photo.
- **Accessibilité.** Navigation au clavier, repères de section visibles, contrastes soignés.

## Le travail réalisé

État au 20 octobre 2026.

| Élément | Valeur |
|---|---|
| Pages | 12 |
| Entrées du registre des sources | 188 |
| Images avec crédit et licence | 140 |
| Ministères structurés | 20 |
| Ministères et acteurs relus sur leur site officiel | 11 sur 21 |
| Actualités officielles vérifiées | 15 |
| Personas documentés | 9 |

Les données chiffrées viennent d'API publiques (data.gouv.fr, OFPRA, DGFiP, geo.api.gouv.fr), de la base départementale du service statistique du ministère de l'Intérieur (SSMSI, 2016 à 2025) et des aides à la presse. Une vérification croisée contrôle que chaque donnée collectée est présente, affichée et sourcée.

## Lancer le site en local

```bash
python3 -m http.server -d dashboard 8765
# puis ouvrir http://127.0.0.1:8765/accueil.html
```

## Mise à jour des données

Un workflow GitHub Actions (`.github/workflows/mise-a-jour-donnees.yml`) relance la collecte **tous les 2 jours**, régénère les pages dérivées, exécute la vérification croisée et ne commite que si elle passe. Il peut aussi être lancé à la main depuis l'onglet *Actions*.

À la main :

```bash
python3 scripts/fetch-donnees.py          # API publiques
python3 scripts/fetch-aides-presse.py     # aides à la presse
python3 scripts/fetch-violences.py        # violences enregistrées (SSMSI)
node dashboard/build-simple.mjs           # version « simple » générée
node scripts/build-gouvernement.mjs       # après édition de data/gouvernement.json
node scripts/registre-sources.mjs         # registre des sources
node scripts/verifier-croisements.mjs     # contrôle final
```

Les actualités gouvernementales ne sont pas mises à jour automatiquement : elles sont relues sur les sites officiels selon `docs/veille-gouvernement.md`.

## Organisation du dépôt

```
dashboard/   pages HTML, CSS et scripts communs, images
data/        données collectées et registres (JSON)
scripts/     collecte, génération et vérification
docs/        personas, découverte UX, sources, veille
.github/     mise à jour programmée des données
```

## Limites connues

- Le niveau FALC n'a pas été relu par des personnes concernées.
- Les tests par persona sont des simulations, pas des essais avec de vrais lecteurs.
- La veille des sites officiels couvre 5 acteurs sur 21.
- Certaines personnalités n'ont pas de photo : aucune image libre n'a été trouvée.
- Plusieurs sites officiels refusent les requêtes automatiques ; leurs pages ont été lues dans un navigateur, à une date donnée, et ne se mettent pas à jour seules.

## Licence et crédits

Aucune licence n'est encore choisie pour le code et les textes : tous droits réservés tant que ce choix n'est pas fait. Les données publiques gardent leur licence d'origine, et les crédits des images figurent sur `donnees.html`.
