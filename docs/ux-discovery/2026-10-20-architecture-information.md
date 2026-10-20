# Architecture de l'information — Politik v1

Date : 2026-10-20. Synthèse (insight-synthesizer) des personas, parcours et retours de la session,
puis décision d'architecture. Statut : appliqué dans les pages le jour même, à relire par la responsable du projet.

## 1. Ce que les personas disent de la navigation actuelle

| Persona | Comment il arrive | Ce qui le perd aujourd'hui | Ce qu'il lui faut |
|---|---|---|---|
| Citoyenne curieuse (primaire) | avec un chiffre entendu (« 14 milliards », « 1,8 million ») | une page de 20 sections, 14 ancres dans le bandeau, aucun point d'entrée par question | une question d'entrée, puis 3 ou 4 écrans, puis sortie |
| Vérificateur pressé | avec un chiffre à vérifier, en moins d'une heure | les sources en bas d'une très longue page ; le comparateur « qui dit quoi » noyé au milieu | « Que vaut ce chiffre ? » en un clic, la source copiable |
| Collaborateur d'un décideur | avec une note à écrire | la matrice de responsabilité et la frise sont en pôle 3, après 12 sections | « Que fait l'État, qui répond de quoi ? » en entrée directe |
| Carinne, Louis, Matthieu (lecture rapide, téléphone) | depuis une vidéo ou un reel | aucune hiérarchie entre les 40 cartes ; le FALC existe mais n'est pas proposé à l'arrivée | un seul pôle visible à la fois, FALC proposé dès l'en-tête |
| Martin, Sofia, Jérôme (sites officiels) | pour la méthode et les sources | catalogue et registre loin de la méthode ; pas de page « méthode » commune aux trois pages | un espace « Sources et méthode » stable, le même sur toutes les pages |
| Les six lentilles (ministre, immigrant, commerçant, salarié, freelance, agent) | avec un rôle | les lentilles sont en fin de page, alors qu'elles devraient orienter la lecture | « Vous êtes… » dès l'entrée, qui propose un parcours de 4 étapes |

## 2. Principes de design retenus

1. **Une question avant une table des matières.** *Parce que* tous les personas arrivent avec une
   question, aucun avec l'envie de lire 20 sections. *Donc* : l'en-tête propose six questions, chacune
   mène à un écran. *Pas* : une liste d'ancres de 14 entrées.
2. **Un pôle à la fois.** *Parce que* la page unique de 40 cartes épuise les lecteurs rapides (Carinne,
   Louis, Matthieu) et noie les lecteurs experts. *Donc* : les quatre pôles deviennent des onglets ;
   un seul est affiché ; les ancres continuent de fonctionner et ouvrent le bon pôle. *Pas* : un
   découpage en pages séparées, qui casserait les liens et le script de vérification.
3. **Le rôle oriente, il ne filtre pas.** *Parce que* les lentilles sont des positions de lecture, pas
   des publics exclusifs. *Donc* : « Vous êtes… » propose un parcours ordonné de quatre étapes et
   marque les cartes concernées ; tout reste accessible. *Pas* : masquer des contenus selon le rôle.
4. **Le même bandeau partout.** *Parce que* trois pages avaient trois bandeaux différents. *Donc* :
   quatre entrées identiques (Fraude sociale, Présidentielle 2027, Comment va la France, Benchmark)
   et le commutateur de niveau au même endroit. *Pas* : des sous-menus différents par page.
5. **La retenue de la marque.** *Parce que* la Loi de l'Anomalie de la responsable du projet (rareté = signal) : filets
   fins, pas d'ombre au repos, une seule action par zone, phrases courtes, pas de tiret cadratin.
   *Donc* : cartes sans ombre, rayon 14 px, une accentuation par bloc. *Pas* : repeindre la palette
   (Host Grotesk et Outfit ont été demandés explicitement).

## 3. Carte du site

```
Politik
├── Fraude sociale (index.html)                       page principale, 4 pôles en onglets
│   ├── Entrée : 6 questions + « Vous êtes… » (parcours de 4 étapes)
│   ├── Pôle 1 Les chiffres : clés · entonnoir · qui fraude · par branche
│   ├── Pôle 2 Le contexte : immigration · richesse et asile · contrepoids · en regard
│   ├── Pôle 3 L'État : frise 2020-2026 · trous · responsabilité
│   └── Pôle 4 Sources et méthode : lentilles · catalogue · registre des sources
├── Présidentielle 2027 (presidentielle-2027.html)   candidats · programmes · historique · méthode
├── Comment va la France (secteurs.html)             15 familles · sujets à exposer · méthode
└── Benchmark États-Unis (benchmark-usa.html)        4 publics · leçons
Chaque page : commutateur Termes de l'État / FALC, même position.
```

## 4. Parcours cibles (quatre étapes, un par rôle)

| Vous êtes… | Étape 1 | Étape 2 | Étape 3 | Étape 4 |
|---|---|---|---|---|
| Citoyen·ne qui a entendu un chiffre | Quatre chiffres, quatre natures | Qui dit quoi (fraude documentaire) | Contrepoids | À retenir |
| Journaliste, vérificateur | Qui dit quoi | Registre des sources | Catalogue des données | Détecteur de titre |
| Décideur, collaborateur | Entonnoir | Frise 2020-2026 | Qui répond de quoi | Trous dans la raquette |
| Ministre | Résultats par branche | Dénominateur | Frise | Trous |
| Immigrant en attente de numéro | SANDIA en chiffres | Pauvreté des immigrés | Personnes protégées | Trous (délai d'attribution) |
| Commerçant, employeur | Travail dissimulé | Séries Urssaf | Dénominateur | Qui fraude |
| Salarié, assuré | Qui fraude | Assurance maladie | Contrôles CAF | Prestations et pauvreté |
| Freelance | Travail dissimulé | Encaissements Urssaf | Catalogue (Open Urssaf) | Qui fraude |
| Agent de caisse | Contrôles et familles monoparentales | RSA versé | Non-recours | Trous (faux positifs) |

## 5. Métriques de l'architecture

| Métrique | Avant | Cible | Mesure |
|---|---|---|---|
| Ancres dans le bandeau | 14 puis 4 pôles | 4 pages + onglets | lecture du DOM |
| Cartes visibles à l'arrivée | environ 40 | 4 pôles, 6 questions, 9 rôles, puis un pôle | lecture du DOM |
| Clics pour « que vaut ce chiffre ? » | défilement long | 1 | test à cinq lecteurs |
| Bandeaux différents entre pages | 3 | 1 | lecture du DOM |

## 6. Hypothèses et risques

- Les parcours par rôle sont déduits des fiches personas, pas d'entretiens : à valider à cinq
  lecteurs (B-006).
- Les onglets cachent du contenu au premier regard : le script de vérification contrôle que chaque
  conteneur existe toujours ; les ancres ouvrent le bon onglet ; l'impression et la recherche dans
  la page montrent tout (règle : `print` affiche tous les pôles).
- Hors périmètre : repeindre aux couleurs d'une autre marque (chartreuse, opales), ajouter un moteur de
  recherche, séparer la page en plusieurs fichiers.
