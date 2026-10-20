# Validation de la compréhension : état des lieux, audit de persuasion, parcours, protocole de test

Date : 2026-10-20 · Pages : fraude sociale, médias, forces de l'ordre, présidentielle 2027, comment va la France, sources et données (le benchmark États-Unis est un document généré, non mesuré ici) · Niveaux : « Termes de l'État » et FALC.
Documents liés : `2026-10-20-politik-discovery.md`, `2026-10-20-architecture-information.md`, `docs/personas/2026-10-20-personas-politiques.md`.

> **Ce que ce document est, et n'est pas.** Aucun lecteur réel n'a encore testé le site. Ce qui est **mesuré** ici, c'est le texte et la structure des pages (script rejouable `scripts/mesurer-clarte.browser.js`). Ce qui est **supposé**, c'est ce que comprennent les neuf personas : leurs fiches sont des composites fictifs. La compréhension elle-même se mesure avec le protocole de la section 6, à faire avec de vraies personnes.

---

## 1. Rapport de validation (grille ux-validate)

**Alignement : partiel.** Fort sur la traçabilité et la neutralité de ton, partiel sur l'accessibilité cognitive en niveau « État », non mesuré sur la compréhension réelle.

| Domaine | Statut | Constat |
|---|---|---|
| Alignement personas | ⚠️ | FALC bien outillé pour Carinne, Louis (×2), Matthieu (lecture en 3 minutes sans sigle). Niveau « État » : bon pour Martin, Sofia, Jérôme officiel. Les personas « Instagram uniquement » n'ont pas de format court partageable : trou. |
| Jobs à accomplir | ✅ | « Que vaut un chiffre que j'ai entendu ? » a son entrée, son comparateur de périmètres et une ligne de lecture par graphique en FALC. |
| Écarts de parcours | ⚠️ | **Défaut mesuré puis corrigé** : en FALC la page fraude double de hauteur (7 969 à 15 531 px) et le navigateur gardait le même décalage ; la lectrice changeait de section sans le voir. `niveau.js` ré-ancre la section visible (testé dans les deux sens : la section reste à la même position). Reste à tester sur les autres pages. |
| Principes de conception | ✅ | Source, année, périmètre, niveau V/S/D/A sur chaque chiffre : tenu. Pas de rouge alarmiste, contrepoids présent. |
| Mesure (télémétrie) | ❌ | Aucune. Choix volontaire (pas de traceur sur un site de lecture de données publiques), mais il n'y a donc aucun signal d'usage : tout passe par le protocole de test. |
| Hypothèses | ⚠️ | Trois hypothèses du cadrage initial n'ont pas été validées (section 7). |

---

## 2. Limpidité des données : mesures du texte

Script : `scripts/mesurer-clarte.browser.js` (se rejoue en une passe). Cibles : FALC, moins de 10 % de phrases au-dessus de 15 mots ; « État », moins de 25 % au-dessus de 20 mots ; tous les sigles développés une fois. Kandel-Moles : adaptation française de l'indice de Flesch, 60-70 standard, au-dessus de 80 facile.

### Après corrections (2026-10-20)

| Page | Niveau | Phrase moy. | > 15 mots | > 20 mots | Kandel-Moles | Sigles développés |
|---|---|---|---|---|---|---|
| Fraude sociale | État | 14,4 | 33 % | 21 % | 69 | 6/8 (RSA, API : glossaire cliquable) |
| Fraude sociale | FALC | 8,3 | 3 % | 0 % | 93 | 7/7 |
| Médias | État | 13,1 | 31 % | 20 % | 70 | 2/2 |
| Médias | FALC | 7,3 | 3 % | 0 % | 82 | 2/2 |
| Forces de l'ordre | État | 12,3 | 33 % | 19 % | 69 | 8/8 |
| Forces de l'ordre | FALC | 7,4 | 1 % | 0 % | 88 | 5/5 |
| Présidentielle 2027 | État | 14,8 | 35 % | 23 % | 61 | 1/1 |
| Présidentielle 2027 | FALC | 8,7 | 9 % | 0 % | 88 | 0/0 |
| Comment va la France | État | 6,8 | 5 % | 2 % | 52 | 21/21 |
| Comment va la France | FALC | 6,0 | 0 % | 0 % | 63 | 21/21 |
| Sources et données | État | 21,7 | 54 % | 46 % | 74 | 17/17 |
| Sources et données | FALC | 9,0 | 0 % | 0 % | 110 | 17/17 |

**Lecture.**

- Toutes les pages FALC passent les deux cibles de phrase. Le niveau FALC est cohérent avec la méthode sur ce critère seulement : la relecture par des personnes concernées reste à faire (DEC-003).
- « Sources et données » en niveau État dépasse les cibles : peu de phrases, toutes dans l'introduction et la méthode, donc quelques phrases longues pèsent lourd. À raccourcir (B-016).
- « Comment va la France » a un indice bas (52, 63) parce que la page est une liste de noms de sujets et de producteurs, pas parce que ses phrases sont longues. Un indice bas y est attendu.
- L'indice de Kandel-Moles est approximatif (syllabes estimées par groupes de voyelles) : il sert à comparer deux versions, jamais comme verdict.

### Avant, et ce que la mesure a révélé

| Défaut | Avant | Action |
|---|---|---|
| Sigles non expliqués en FALC | 3,3 sigles pour 100 mots sur « Comment va la France », 2,3 sur « Médias » | `dashboard/acronymes.js` : chaque sigle est développé à sa première apparition visible (mots simples en FALC, nom officiel en niveau État). |
| Première occurrence cachée | le développement tombait dans un tableau replié | le script ignore le contenu replié. |
| Mesure faussée | phrases FALC paraissant à 40-60 mots | mon propre outil perdait les retours à la ligne ; mesure corrigée, donc cette alerte-là était fausse. |
| Position perdue au changement de niveau | page fraude : 7 969 px en État, 15 531 px en FALC, même décalage conservé | `dashboard/niveau.js` : la section visible est mémorisée puis remise au même endroit après le rendu. |

---

## 3. Audit de persuasion (skill persuasion-audit)

**Cadre.** Un site de lecture de données publiques n'a pas à convaincre. L'audit cherche donc deux choses : les leviers de persuasion présents sans l'avoir voulu, et les affirmations dont le fait sous-jacent n'est pas tenu. Aucune règle du registre de consommation n'est engagée (pas de vente, de prix, de minuteur, de consentement).

**Comportement visé.** Une lectrice (citoyenne, journaliste, décideur) lit un chiffre, regarde sa source, comprend ce qu'il ne dit pas, et repart sans avoir été poussée vers une conclusion. Fini = elle sait répondre à « que mesure ce chiffre, et que ne mesure-t-il pas ? ».

**Frein principal : l'aptitude (L27, L32).** Premier critère qui échoue : jargon et densité. Frictions comptées : 7 entrées de navigation, 20 sections sur la page fraude, 149 pastilles de niveau, 3 953 mots en niveau État. La motivation et l'incitation ne sont pas le problème. Conséquence : réduire la friction avant d'ajouter quoi que ce soit.

### Registre des leviers

| Extrait | Levier | Grade | Légitime seulement si | Verdict |
|---|---|---|---|---|
| Tuiles de tête : « 14 Md€ estimés », « 3 Md€ trouvés », « 680 M€ récupérés » | Ancrage (L02) : le premier chiffre lu fixe les suivants | A | les trois chiffres sont expliqués côte à côte comme de natures différentes | **Garder.** C'est l'objet de la page ; la tuile « Attention : ces 4 chiffres ne mesurent pas la même chose » neutralise l'ancrage. |
| Lignes « Ce qu'on voit » / « À retenir » sous chaque graphique | Cadrage (L03) : la conclusion écrite oriente la lecture du graphique | A (choix risqués) / B | la phrase est vraie à la décimale près et ne dépasse pas ce que le chiffre permet | **Corriger (fait).** Cinq phrases dépassaient les données, voir ci-dessous. |
| « Estimez avant de voir » (page forces) | Aucun levier commercial ; effet d'ancrage de l'estimation personnelle (L02) | A | le retour dit l'écart sans jugement et reste hors sujet suicide | **Garder.** Choix limité à trois réponses : retour immédiat, sans score cumulé. |
| Barre de progression « points vérifiés » | Gradient d'objectif (L08), progrès donné (L09) | B | la liste cochable est un pense-bête local, pas une évaluation | **Garder.** Aucune donnée envoyée. |
| Sept entrées de navigation, vingt sections | Surcharge de choix (L15) | B | — | **Corriger (fait en partie).** Libellés raccourcis ; 4 pôles déjà en place sur la page fraude. |
| « Six familles contrôlent l'essentiel de la presse… » (page médias) | Affirmation d'autorité sans source | C | une source établit le pourcentage de contrôle | **Retirer (fait).** Remplacé par « figurent parmi les principaux propriétaires ». |
| Choix du groupe Bolloré pour le focus | Sélection d'un cas | C | le choix est annoncé comme éditorial | **Corriger (fait).** La phrase dit maintenant « ce choix est éditorial ». |

### Surinterprétations corrigées (recalculées sur les chiffres sourcés)

| Page | Avant | Chiffre réel | Après |
|---|---|---|---|
| Forces | « les arrêts de travail augmentent de moitié » | de 1 800-2 300 à 3 200-3 800 : +65 % à +78 % | « de plus des deux tiers » |
| Forces | « le taux brut double presque » | 29 contre 14 : ×2,07 | « dépasse le double » |
| Forces | « la gendarmerie ne baisse pas comme la police » | 21 → 26, périmètres différents | « sans baisse visible » + avertissement de périmètre |
| Forces | « sept fois plus fréquent » | 6,6 % contre 0,9 % : ×7,3, petit échantillon | « que chez les non exposés, petit échantillon » |
| Médias | « chacune autant que les grands groupes régionaux » | Le Monde 19,7 M€, LVMH 19,1 M€, Ouest-France 14,7 M€ | « plus que le premier groupe régional » |
| Médias | UFIPAR « près du triple du deuxième » | ×1,3 (2016), ×1,5, ×2,2, ×2,5 (2019) | « de 1,3 à 2,5 fois » |
| Médias | « en dix-huit mois… deux décisions de justice » | juil. 2024 à fév. 2025 : 8 mois, un recours rejeté ; l'arrêt du 8 juil. 2026 est en A | « entre juillet 2024 et février 2025… un recours rejeté » |
| Médias | « fréquences (bleu) » | le bleu code la nomination de l'Arcom, le rouge le retrait de C8 | légende corrigée |

### Tests éthiques (divulgation, réversibilité, vérité)

| Élément | Divulgation | Réversibilité | Vérité |
|---|---|---|---|
| Lignes de lecture | pass | pass | **échec avant correction**, pass après |
| Questions d'estimation | pass | pass | pass |
| Registre et pastilles V/S/D/A | pass | pass | pass : niveau attribué par heuristique pour les références sans niveau explicite (signalé dans la méthode de la page Sources) |
| Développement des sigles | pass | pass | pass : dictionnaire visible dans `acronymes.js` |

### Fiches d'hypothèse (les trois premières)

1. **Les lignes de lecture réduisent les erreurs de lecture sans augmenter la certitude.**
   Mesure : 3 questions de compréhension par graphique ; question de certitude « à quel point êtes-vous sûr·e ? ». Succès : au moins 80 % de bonnes réponses avec ligne de lecture, sans hausse de certitude sur les réponses fausses. Garde-fou : si la certitude monte quand les réponses sont fausses, retirer la ligne.
2. **Les sigles développés au premier passage font gagner du temps aux lecteurs « Instagram uniquement ».**
   Mesure : temps pour retrouver « qui a trouvé le chiffre » sur une page FALC, avec et sans développement. Succès : moins de 60 s, aucun lecteur bloqué.
3. **Le comparateur de périmètres corrige « 20 milliards = fraude sociale ».**
   Mesure : avant et après la page, « combien vaut la fraude sociale estimée ? » (réponse attendue : 14 Md€ estimés, 3 Md€ détectés, pas 20). Succès : au moins 4 lecteurs sur 5 distinguent estimé et détecté.

*Mécanismes cités : registre de preuves du skill (L02, L03, L08, L09, L15, L27, L32). Aucun effet chiffré n'est promis. Pas de conseil juridique : aucune ligne du registre de règles n'a été invoquée.*

---

## 4. Parcours : une citoyenne arrive, choisit une question, lit un graphique, vérifie une source, bascule en FALC

Déclencheur : elle a entendu « 14 milliards de fraude » à la télévision. Appareil : téléphone, 3 minutes.

### État actuel

*Parcours reconstitué à partir des pages et des personas : ce sont des hypothèses, aucun lecteur n'a été observé.*

| Phase | Action | Pensée | Émotion | Friction |
|---|---|---|---|---|
| Arrivée | ouvre la page fraude | « c'est quoi tout ça ? » | curieuse, méfiante | 20 sections, 4 pôles à décoder |
| Choix | clique une des six questions | « ma question est là » | rassurée | les six questions mènent chacune à un bloc différent |
| Lecture | lit un graphique | « donc c'est vrai ou faux ? » | impatiente | le graphique donne trois chiffres, pas un verdict : voulu, mais frustrant |
| Vérification | ouvre la source | « d'où ça vient ? » | attentive | pastille V/S/D/A claire, mais le tableau est replié |
| Bascule | passe en FALC | « plus simple, svp » | soulagée | la page double de hauteur ; avant correction la section changeait sans qu'elle le voie (mesuré), désormais ancrée |
| Retour | revient | — | — | rien ne la ramène : pas de mesure, pas de rappel (choix volontaire) |

**Moments décisifs.** Faire ou défaire : les trois premières secondes de l'écran d'accueil et la première phrase « ce chiffre ne mesure pas la même chose ». Frottement maximal : la première occurrence d'un sigle. Bonheur à préserver : la tuile qui oppose estimé, détecté et récupéré.

### État visé

| Phase | Changement | Critère |
|---|---|---|
| Arrivée | une phrase d'ouverture « pourquoi ces chiffres ne sont pas d'accord » avant les sections | une lectrice répond sans scroller à « de quoi parle cette page ? » |
| Lecture | ligne « Ce qu'on voit » en niveau État aussi, sur la page fraude (B-015) | 80 % de bonnes réponses aux questions de compréhension |
| Bascule | section visible conservée au changement de niveau (fait, `niveau.js`) | aucun lecteur ne dit « je me suis perdu » en test |
| Retour | page « Sources et données » comme point de repère stable | la lectrice retrouve en moins de 60 s l'origine d'un chiffre |

---

## 5. Lecture par persona (hypothèses, à valider avec de vraies personnes)

| Persona | Niveau attendu | Ce qui la sert | Risque de compréhension | À vérifier |
|---|---|---|---|---|
| Carinne (CNews, BFM, Facebook) | FALC | tuile estimé / détecté / récupéré, ton sans accusation | se sent visée par la page médias (Bolloré) | neutralité du focus ; test de lecture à voix haute |
| Louis, droite radicale (Instagram) | FALC | format court, ligne « À retenir » | repère vite une mise en scène : la métaphore « deux leviers » peut sonner comme du militantisme | si la ligne de lecture est perçue comme neutre |
| Martin (sites officiels) | État | registre des sources, niveau V/S/D/A | confond encore « détecté » et « avéré » si la tuile n'est pas lue | clic sur la source |
| Jérôme (Le Monde, Le Figaro) | État | comparateur de périmètres | « 20 Md€ = fraude sociale » | question pré/post |
| Louis, centriste (Instagram) | FALC | graphiques simples | peu à l'aise avec les institutions (LFSS) | glossaire |
| Jérôme (sites officiels) | État | tableaux de données | peu de contexte sur la page forces | sigles développés |
| Louise (Le Monde, L'Humanité) | État | contrepoids, page médias | méfiance vis-à-vis du choix éditorial du focus | formulation « choix éditorial » |
| Matthieu (Instagram, extrême gauche) | FALC | sources, « Ce qu'on voit » | défiance : lit un graphique si on lui a montré ce qu'il cache | « ce que le dessin ne dit pas » |
| Sofia (sites officiels) | État | méthode, registre complet | exige l'index des sources S# (page forces) | résoudre S# (B-014) |

Les six lentilles de rôle (ministre, immigrant, commerçant, salarié, freelance, fonctionnaire de caisse) restent utiles pour la page fraude ; les pages médias et forces n'ont pas encore de parcours par rôle (hors périmètre de cette passe).

---

## 6. Protocole de test avec de vraies personnes

**Cible.** 5 lectrices et lecteurs par grappe : (A) lecteurs de formats courts, niveau FALC ; (B) lecteurs de presse, niveau État ; (C) lecteurs de sources officielles, niveau État. Total 15, ou 6 pour une première passe (2 par grappe).

**Déroulé (20 minutes).**

1. Question d'entrée, sans voir le site : « quel est le montant annuel de la fraude sociale en France ? » et « à quel point êtes-vous sûr·e ? » (0 à 10).
2. Trois tâches chronométrées, chacune sur une page :
   - T1 (fraude) : « combien l'État estime-t-il, détecte-t-il et récupère-t-il ? »
   - T2 (médias) : « quel groupe reçoit le plus d'aides à la presse, et sous quelle condition ce chiffre est-il comparable d'une année à l'autre ? »
   - T3 (forces) : « combien y a-t-il eu de suicides de policiers en 2019, et pourquoi y a-t-il deux chiffres ? »
3. Tâche de vérification : « montrez-moi d'où vient ce chiffre » (cible : la source en moins de 60 s).
4. Bascule : lire une section en FALC à voix haute ; noter les mots qui bloquent.
5. Reprise de l'étape 1 : même question, même certitude.

**Critères de réussite (à enregistrer avant le test, pas après).**

| Mesure | Seuil |
|---|---|
| Bonnes réponses T1, T2, T3 | au moins 80 % |
| Source retrouvée | en moins de 60 s pour au moins 80 % |
| Mots bloquants en FALC | au plus 2 par lecteur |
| Distinction estimé / détecté après lecture | au moins 4 sur 5 |
| Certitude sur réponses fausses | pas de hausse entre l'étape 1 et l'étape 5 |

**Éthique.** Aucun enregistrement nominatif, consentement oral, pas de test sur le sujet du suicide avec des personnes concernées sans accompagnement ; le 3114 est rappelé sur la page forces.

**Fiche de saisie** (une ligne par lecteur) : grappe, niveau lu, durée T1-T3, réponses, source en moins de 60 s oui/non, mots bloquants, certitude avant/après, phrase du lecteur en une ligne.

---

## 7. À décider ensemble

1. **Qui teste en premier ?** Proposition : 2 personnes par grappe parmi tes proches, avant toute diffusion. *Critère : 6 fiches de saisie remplies · relire le 2026-11-03.*
2. **Libellés courts de la navigation** (« Médias », « La France », « Sources », « États-Unis ») : on les garde si les testeurs retrouvent chaque page du premier coup.
3. **Ligne « Ce qu'on voit » en niveau État sur la page fraude** : à écrire ensemble, graphique par graphique, car chaque phrase est un cadrage (B-015).

### Hypothèses du cadrage initial, état

| Hypothèse | État |
|---|---|
| Les lecteurs distinguent estimé et détecté s'ils les voient côte à côte | non testée |
| Le FALC suffit pour les lecteurs de formats courts | non testée ; texte conforme, relecture externe manquante |
| Un registre des sources unique réduit la méfiance | non testée ; registre construit (139 entrées) |

---

## 8. Identité visuelle (logo et favicon)

| Fichier | Usage |
|---|---|
| `dashboard/favicon.svg` | favicon moderne (carré arrondi, fond encre) |
| `dashboard/favicon-32.png`, `apple-touch-icon.png`, `icon-512.png` | repli PNG, icône tactile, grand format |
| `dashboard/logo.svg`, `logo.png` | logo complet (repère et mot-symbole en Outfit 700) |

Concept : un P dont le creux est un point de donnée, en bleu clair sur fond encre. Le point rappelle le point du mot-symbole et la pastille de niveau de confiance. Les couleurs viennent des jetons du site (encre `#141A2B`, accent `#2F5BC9` et sa variante claire `#7A9BEC`). Lisibilité du favicon à 16 px : le P reste lisible, le point s'efface, ce qui est voulu. Le logo n'utilise ni rouge, ni forme évoquant un drapeau ou un parti.
