# Découverte UX — Politik

Date : 2026-10-20. Source de données : le rapport de recherche du 20 octobre 2026
(`docs/sources/rapport-fraude-sociale-etat-2026.md`), pris comme matériau d'entrée.
Aucun entretien utilisateur n'a eu lieu : tout ce qui suit est une hypothèse à valider par la responsable du projet,
sauf mention contraire.

## 1. Brief du problème

- **Problème** : les chiffres de la fraude sociale circulent sans leur définition, leur année ni
  leur périmètre, ce qui rend impossible de juger qui fraude, combien, et ce que l'État en fait.
- **Qui en souffre** : les citoyens qui veulent se faire une opinion, les journalistes qui doivent
  vérifier vite, les décideurs et leurs collaborateurs qui arbitrent sur des ordres de grandeur.
- **Alternatives actuelles** : communiqués de Bercy (agrègent fiscal et social), infographie du
  HCFiPS (un chiffre global), livres et auditions militantes (chiffres contestés), articles de
  presse (reprennent sans recouper). Aucune vue ne relie estimé, détecté, évité, recouvré.
- **Pourquoi elles échouent** : périmètres différents présentés comme comparables, absence de
  contrepoids (non-recours, faux positifs), trous de mesure invisibles.
- **Périmètre** : nouveau produit, page unique, sans compte ni serveur.

## 2. Personas lecteurs (3) et lentilles (6)

Le skill demande 1 à 3 personas. Les six rôles demandés par la responsable du projet (ministre, immigrant,
commerçant, salarié, freelance, fonctionnaire) ne sont pas des lecteurs du tableau de bord mais des
**positions de lecture** : ils vivent dans la page comme un panneau « Dans la peau de… ».

### Persona : La citoyenne qui veut comprendre (primaire)
- **Rôle et contexte** : designer, lit un livre ou une audition sur la fraude, veut savoir ce qui
  tient et ce qui ne tient pas avant d'en parler autour d'elle.
- **Comportement actuel** : prend des notes à la volée, confond des sigles (RNCPS), retient des
  chiffres chocs sans leur année.
- **But fonctionnel** : situer un chiffre entendu (14 Md€, 1,8 million) dans l'ensemble.
- **But émotionnel** : ne plus se sentir manipulée, ni par un camp ni par l'autre.
- **But social** : pouvoir expliquer calmement à un proche pourquoi deux chiffres ne se comparent pas.
- **Frustrations** : titres qui additionnent fiscal et social, « né à l'étranger » lu comme « étranger », absence du chiffre du non-recours.
- **Outils actuels** : notes, recherche web, ce rapport.
- **Contexte d'usage** : soirée, ordinateur ou téléphone, 10 à 20 minutes.
- **Citation** : « Le 14 milliards, c'est lequel ? »
- **Priorité** : primaire. **Preuve** : hypothèse fondée sur la conversation d'origine.

### Persona : Le vérificateur pressé (secondaire)
- **Rôle et contexte** : journaliste ou fact-checker, doit répondre en une heure à « est-ce vrai ? ».
- **Comportement actuel** : cherche la source primaire, copie le lien, note l'année.
- **But fonctionnel** : retrouver en moins de deux minutes la source et le périmètre d'un chiffre.
- **But émotionnel** : confiance dans ce qu'il publie.
- **But social** : être celui qui cite juste.
- **Frustrations** : infographies sans lien, chiffres « évités » présentés comme « récupérés ».
- **Contexte** : bureau, grand écran, plusieurs onglets ; a besoin d'un tableau brut copiable.
- **Citation** : « Donne-moi le lien et l'année, pas le graphique. »
- **Priorité** : secondaire. **Preuve** : hypothèse.

### Persona : Le collaborateur qui prépare un arbitrage (tertiaire)
- **Rôle et contexte** : collaborateur parlementaire ou de cabinet, prépare une note de deux pages.
- **But fonctionnel** : ordres de grandeur comparables, matrice de qui répond de quoi.
- **But émotionnel** : ne pas faire dire à un chiffre plus qu'il ne dit.
- **Frustrations** : pas de chiffre d'effectifs ni de budget ; pas de série annuelle propre.
- **Contexte** : urgence, impression possible, citations prêtes à copier.
- **Citation** : « Qu'est-ce qu'on peut affirmer sans se faire reprendre ? »
- **Priorité** : tertiaire. **Preuve** : hypothèse.

### Les six lentilles (contenu du panneau « Dans la peau de… »)

| Lentille | Ce qu'elle regarde d'abord | Ce que les chiffres lui disent | Ce qu'ils ne lui disent pas |
|---|---|---|---|
| Ministre | détecté/redressé en hausse (3,1 Md€, +4,1 %), nouvelle loi, nouvel office | la machine produit des résultats mesurables | recouvré reste à 680 M€ ; pas d'audit d'immatriculation depuis 2018 ; moyens (ETP) non publiés |
| Immigrant en attente de NIR | délai d'attribution, numéro provisoire, article 28 ter | 18 M de numéros attribués par le SANDIA ; dans la plupart des anomalies de contrôle interne, pas d'intention frauduleuse (gouvernement, 2019-2020) | délai médian d'attribution : inconnu ; part des dossiers en provisoire plus de X mois : inconnue |
| Commerçant, employeur | travail dissimulé : 1,5 Md€ redressés, 100 M€ recouvrés | 52 % de la fraude estimée vient des entreprises et indépendants | détecter est plus difficile que sur les prestations ; pas de ventilation par taille d'entreprise |
| Salarié, assuré | arrêts de travail (42 à 49 M€), fraudes aux ressources et à la résidence | 36 % des montants estimés côté assurés ; la moitié des fraudes CNAM en nombre | la fréquence des contrôles qu'il subit ; le taux de faux positifs |
| Freelance, auto-entrepreneur | cotisations, Open Urssaf, procédures collectives | contexte territorial disponible en open data | aucun chiffre de fraude spécifique aux indépendants isolés |
| Fonctionnaire de caisse (CAF, CNAV) | 31,5 M de contrôles CAF en 2024, score de risque, rappels de droits 378 M€ | les contrôles rendent aussi des droits | les effectifs, le rendement par agent, la part des contrôles par déclencheur |

## 3. Jobs à faire (format JTBD)

- Quand j'entends un chiffre sur la fraude, je veux savoir ce qu'il mesure et qui l'avance, pour
  ne pas le répéter de travers.
- Quand je compare deux chiffres, je veux qu'on me prévienne s'ils n'ont pas le même périmètre,
  pour ne pas additionner des choux et des carottes.
- Quand je vois un montant « détecté », je veux voir à côté ce qui a été « recouvré » et ce qui
  n'a pas été demandé (non-recours), pour juger l'efficacité et la justice du système.
- Quand on me dit « l'État ne fait rien », je veux voir la frise des réformes et qui est
  responsable de quoi, pour répondre avec des dates.
- Quand il manque une donnée, je veux que le tableau de bord le dise, pour savoir quoi demander.

## 4. Parcours

### Parcours actuel : la citoyenne, « situer un chiffre entendu »

| Phase | Action | Point de contact | Pensée | Émotion | Friction | Durée |
|---|---|---|---|---|---|---|
| Déclencheur | entend « 14 milliards » et « 1,8 million de fantômes » | audition, livre, réseau social | « c'est énorme, c'est vrai ? » | inquiète | chiffre sans définition | 1 min |
| Recherche | tape le chiffre dans un moteur | web | « tout le monde le répète » | confuse | sources secondaires qui se citent entre elles | 15 min |
| Source officielle | tombe sur le communiqué de Bercy | presse.economie.gouv.fr | « 20 milliards, donc c'est pire » | alarmée | le titre additionne fiscal et social | 5 min |
| Contre-lecture | trouve une critique du chiffre de Prats | presse, think tank | « alors qui a raison ? » | frustrée | fourchettes jamais côte à côte | 10 min |
| Conclusion | abandonne ou choisit un camp | aucun | « je ne saurai jamais » | résignée | pas de vue d'ensemble | fin |

**Moments de vérité** : le titre « plus de 20 milliards » (point de bascule vers l'alarme) ; la
rencontre des deux « 14 milliards » (point d'abandon).

### Parcours visé

| Phase | Action | Point de contact | Émotion visée | Ce qu'on construit | Métrique |
|---|---|---|---|---|---|
| Arrivée | lit les quatre chiffres clés avec leur nature (estimé, détecté, recouvré, dernier audit) | tuiles d'en-tête | orientée | tuiles étiquetées, niveau de confiance visible | lecture des quatre tuiles sans défilement (test de 5 secondes) |
| Situer | ouvre « Qui dit quoi » et voit Prats, Sénat, HCFiPS sur la même ligne | comparateur | soulagée | fourchettes, alerte « périmètre différent » | la lectrice peut dire lequel des 14 Md€ est lequel |
| Peser | regarde l'entonnoir estimé → recouvré et le contrepoids non-recours | graphiques | lucide | deux colonnes toujours côte à côte | elle cite spontanément le non-recours |
| Attribuer | lit la frise 2020-2026 et la matrice « qui répond de quoi » | frise, tableau | équipée | dates et articles de la Constitution | elle date au moins une réforme |
| Repartir | copie une source, note les trous de mesure | registre, liste des trous | confiante | liens, niveau V/S/D/A, trous explicites | elle sait quoi demander (CADA) |

### Écarts

| Phase | Aujourd'hui | Visé | Écart | Priorité |
|---|---|---|---|---|
| Arrivée | un chiffre choc | quatre natures de chiffres | étiquetage | haute |
| Situer | sources éparses | comparateur | mise côte à côte | haute |
| Peser | fraude seule | fraude et contrepoids | symétrie | haute |
| Attribuer | polémique | frise et matrice | dates, textes | moyenne |
| Repartir | rien | registre et trous | traçabilité | moyenne |

## 5. Métriques de succès

### Étoile polaire
- **Métrique** : part des lecteurs capables, après lecture, de distinguer estimé, détecté et
  recouvré (test en trois questions, à la fin de la page ou en entretien).
- **Base** : inconnue, à établir sur cinq lecteurs.
- **Cible à 6 mois** : 4 lecteurs sur 5.
- **Pourquoi** : c'est exactement la confusion que la page existe pour lever.

### Garde-fous
| Métrique | Protège contre | Cible | Alerte |
|---|---|---|---|
| Part des chiffres affichés avec source, année et niveau | la dérive vers le chiffre choc | 100 % | tout chiffre sans source |
| Part des blocs « fraude » accompagnés d'un contrepoids | la lecture à charge | 100 % | un bloc sans contrepoids |
| Lisibilité à 400 px et en mode sombre | l'exclusion mobile | aucun débordement | débordement horizontal |
| Contraste et tableau de données pour chaque graphique | l'inaccessibilité (RGAA) | 100 % des graphiques | un graphique sans tableau |

### Indicateurs avancés
| Indicateur | Prédit | Mesure |
|---|---|---|
| Temps passé sur le comparateur « qui dit quoi » | la compréhension des périmètres | observation, pas de traceur |
| Nombre de sources copiées | la réutilisation | compteur local optionnel, jamais envoyé |
| Questions posées après lecture | les trous à combler | entretien |

### Télémétrie
Aucun traceur tiers. La page ne collecte rien par défaut (ligne non manipulatrice du projet).
Si une mesure est un jour nécessaire, un compteur local (localStorage) sur deux événements suffit :
`source_copiee` (id de la source, sans donnée personnelle) et `test_3_questions_reussi` (score).
Consentement : explicite, bouton visible, aucune donnée ne quitte le navigateur.

### Signaux qualitatifs
| Signal | Méthode | Fréquence | Qui |
|---|---|---|---|
| Compréhension | test des trois questions, lecture à voix haute | à chaque version | la responsable du projet |
| Sentiment de manipulation | une question ouverte en fin de lecture | à chaque version | la responsable du projet |
| Erreurs factuelles | relecture par un vérificateur | avant publication | relecteur externe |

### Réponses aux métriques
| Métrique | Si ça monte | Si c'est plat | Si ça baisse |
|---|---|---|---|
| Étoile polaire | publier, ajouter des séries annuelles | revoir l'ordre des blocs | revoir l'étiquetage des tuiles |
| Chiffres sans source | sans objet | sans objet | bloquer la publication |

## 6. Principes de design (issus de la synthèse)

1. Le chiffre n'existe pas sans sa nature : estimé, détecté, évité, redressé, recouvré.
2. Deux nombres égaux ne sont pas le même chiffre : le comparateur prime sur le titre.
3. Chaque bloc « fraude » a son contrepoids visible dans la même vue.
4. L'absence de donnée est une information : elle s'affiche, elle ne se comble pas.
5. Pas de rouge alarmiste, pas d'axe tronqué, pas d'échelle logarithmique qui masque un écart.
6. Les positions d'acteurs (D) sont nommées comme telles, jamais fondues dans les officiels (V).

## 7. Hypothèses et risques

- Les personas sont déduits du rapport, pas d'entretiens : risque de viser à côté. Levée : cinq lectures accompagnées.
- Les séries annuelles 2020-2024 manquent : la frise montre des réformes, pas encore des courbes de résultats. Levée : BACKLOG B-005.
- Les six lentilles peuvent être lues comme des caricatures : chaque case ne contient que des chiffres sourcés ou des « inconnus », jamais une opinion prêtée au rôle.
- Le sujet est inflammable : un graphique sorti de son contexte peut servir un camp. Levée : titre et note « ce que ce chiffre ne dit pas » dans chaque bloc, et mention de la source sur chaque image.

## 8. Prochaines étapes

1. Relecture par la responsable du projet du tableau de bord v0 et de ce document (BACKLOG B-001).
2. Vérification de l'article 28 ter et lecture de la note HCFiPS complète (B-002, B-003).
3. Séries annuelles par branche (B-005), puis demande CADA (B-004).
