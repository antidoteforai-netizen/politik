# Spécifications fonctionnelles : KPI et DATA sur la santé mentale, les violences subies et le maintien de l'ordre (police et gendarmerie, France)

> Document transmis par la responsable du projet le 20 octobre 2026 (`02-specifications-fonctionnelles-kpi-data.md`), recopié ici sans modification. Son document compagnon `01-synthese-session-sante-mentale-police.md` (index des sources S1 à S76) n'a pas été transmis : les références `[S#]` ci-dessous ne sont donc pas résolues dans Politik et les valeurs sont reprises avec le grade proposé par le document (A, B, C, D), affiché à côté du niveau V/S/D/A du site. Implémentation : `dashboard/forces.html`.

- Version : 1.0
- Date : 20 octobre 2026
- Statut : cahier des charges fonctionnel proposé. Les valeurs de référence sont sourcées ; la structure des KPI, les règles et les grilles de qualité sont des **propositions** de conception (marquées `[Proposition]`).

> **Note de sensibilité.** Le sujet inclut le suicide. Toute restitution doit respecter la section 8 (règles éthiques et de restitution). Le 3114 est le numéro national de prévention du suicide.

## 1. Objectifs et périmètre

1. Suivre de façon traçable un ensemble d'indicateurs sur : la santé mentale et le suicide des forces de sécurité, les ressources de soutien de l'État, les violences et blessures subies, et les blessures en manifestation.
2. Rendre visibles les écarts de définition et de périmètre entre sources, plutôt que de les lisser.
3. Distinguer ce qui est **officiel**, **parlementaire**, **associatif ou syndical**, et **dérivé** (calculé).

Périmètre : police nationale (cœur), gendarmerie nationale (comparaison), police municipale et administration pénitentiaire signalées quand elles apparaissent ; France entière, pas de maille locale ; séries 2004-2026. Hors périmètre : données individuelles, prévision de risque individuel, jugement sur la légitimité de l'usage de la force.

## 2. Glossaire

ITT (incapacité totale de travail, seuils variables), RBD (recensement des particuliers blessés ou décédés, IGPN, depuis 2017), RSU / BDS (rapport social unique et base de données sociales, remplacent le bilan social en 2021), SSPO (service de soutien psychologique opérationnel, 1996), K6 / Kessler (échelle de détresse en 6 questions, baromètre MGP), TSPT, ETP / ETPT, valeur dérivée (calculée par l'équipe, jamais présentée comme officielle).

## 3. Modèle de données

Table `observation` : `obs_id`, `kpi_id`, `periode_debut` / `periode_fin`, `perimetre` (PN, GN, PN+GN, PN+GN+pénitentiaire, population générale, autre), `valeur`, `qualificatif` (exact, au moins, environ, partiel, estimation), `unite`, `source_id`, `type_source`, `grade_qualite` (A à D), `est_derivee`, `formule`, `conflit_avec`, `date_collecte`, `commentaire`. Table `source` : `S#`, titre, url, éditeur, date, type, accès, statut de lecture. Table `definition` : une ligne par couple (KPI, source).

## 4. Catalogue des KPI (valeurs de référence)

### Famille A : suicide et mortalité

KPI-A1, suicides police nationale par an : 2008 : 49 (B, S11) ; 2017 : 50 (B, S12) ; 2018 : 35 (C presse, S55) ; 2019 : 59 (B, S53 S54) et 70 (D, périmètre non précisé, S16) ; 2021 : 48 (C, PN+GN ambigu, S54) ; 2022 : 78 (C, France avec pénitentiaire, S9) ; 2024 : 27 (B, S4 S5) et 23 partiel au 8 octobre (B, S52) ; 2025 : au moins 16 (C amendement, S51) et 12 partiel début juillet (C syndicat, S56) ; 2026 : au moins 8 fin mai (D, S8). Les divergences sont conservées et reliées par `conflit_avec`.

KPI-A2, gendarmerie : 2019 : 21 ; 2024 : 26 (S4) ; 2026 : au moins 7 en deux mois et demi (S5).

KPI-A3, taux pour 100 000 : police 29, gendarmerie 25, population générale environ 14, moyennes sur dix ans (Sénat 2018, S12) ; 16 contre 30 (interview Roché, S6) ; dérivé 2024 : 27 / 150 000 ≈ 18, non comparable sans standardisation.

KPI-A4, surrisque standardisé : +36 % police nationale 2005-2009 (S12 S14), Inserm 2010 +36 % (S15), environ +50 % baromètre MGP sans méthode précisée (S2). Ne jamais mélanger taux brut et standardisé.

KPI-A5, variation : 2019 → 2024 : 27 / 59 − 1 ≈ −54 % (S4), seulement entre valeurs `exact` de même périmètre.

### Famille B : santé mentale déclarée

B1 détresse K6 : 39 % (MGP, 6 246 répondants, vers 2021, S2 S3 ; 40 % dans la presse). B2 pensées suicidaires personnelles ou entendues : 24 %, 46 % si ambiance pas conviviale, 32 % si tensions avec le public (S2). B3 dépression : 11,8 % (thèse Lyon 1, 2026, S10). B4 TSPT : 6,6 % exposition directe (n=182), 1,2 % indirecte (n=81), 0,9 % non exposé (n=212), total 475 (S10). B5 recours aux soins : jugé insuffisant, pas de chiffre (S10). B6 : 62,2 % manque d'accomplissement, 80 % fierté, 70 % « seuls ceux qui font du chiffre sont reconnus » (CNRS et Alliance 2011-2012, environ 13 000 répondants, S15).

### Famille C : ressources de soutien

C1 psychologues SSPO : 82 postes (2018, S13), 73 psychologues et 18 postes décidés sur trois ans (2018, S13), 122 aujourd'hui (S49). C2 ratio : 1 pour 1 200 au SSPO (S49) ; dérivé 152 000 / 310 ≈ 1 pour 490 si 310 couvre tous les psychologues (S50). C3 : 11 postes (8 ETP) jusqu'en 2028 (S49) ; cible parlementaire 400 (S51) ; cible de loi d'orientation 85, dépassée (S52). C4 crédits prévention : 2,89 M€ en 2024 → 1,6 M€ en 2025 (allégation d'amendement, S51, grade C). C5 sentinelles formées : 2 537 (S51). C6 dispositifs : SSPO, numéro vert externalisé, plateforme d'écoute, plan 2025-2029 en réflexion (S52), suivi périodique inconnu, enquête de causalité post-suicide absente en gendarmerie selon un chercheur (S4).

### Famille D : violences subies

D1 agressions : 30 000 à 32 000 (2020), près de 38 000 (estimation 2025) (S58, grade C). D2 ITT : 1 800 à 2 300 (2020), 3 200 à 3 800 (2025) (S58). D3 blessés en service police et gendarmerie : 3 842 (2004), 7 399 (2019) (S59). D4 : pas de statistique nationale pour les policiers municipaux en 2018 (S60).

### Famille E : manifestations

E1 manifestants blessés : gilets jaunes 2 549 recensés par les forces de sécurité intérieure (S63) ; Sainte-Soline plus de 200 (S65). E2 forces de l'ordre blessées : 575 gendarmes du 17 nov. 2018 au 18 févr. 2020 (S63) ; 1 528 blessés, institution tronquée (S63) ; 441 policiers et gendarmes plus 47 à Sainte-Soline, 2023 (S64). E3 RBD toutes opérations : 2020 : 78 blessés, 32 décès ; 2021 : 79 blessés, 37 décès (S66), faits avec enquête judiciaire et ITT ≥ 9 jours. E4 enquêtes IGPN : 212 (gilets jaunes, S68) ; 24 affaires en octobre 2026 pour les manifestations lycéennes (secondaire, S67) ; 959 dossiers en 2024 toutes catégories (S69). E5 usage des armes : TSUA, accessibilité inconnue (S70).

## 5. Registre des jeux de données

DS-01 bilans sociaux puis RSU/BDS (Intérieur, à explorer) ; DS-02 rapports annuels IGPN (PDF) ; DS-03 fichier RBD (non publié en jeu ouvert) ; DS-04 centre de veille (chiffres via réponses ministérielles) ; DS-05 TSUA (inconnu) ; DS-06 Interstats (à explorer) ; DS-07 baromètre MGP (communiqué, pas de microdonnées) ; DS-08 thèse Lyon 1 2026 (theses.fr) ; DS-09 autopsie psychologique 2008 (Inserm, résumé) ; DS-10 questions parlementaires (PDF) ; DS-11 SNDS gestes auto-infligés (DREES, population générale) ; DS-12 jeu privé « arrêts maladie » (exclu). Constat : aucun jeu dédié aux suicides de policiers ni aux blessés en manifestation sur data.gouv.

## 6. Règles de qualité

Grades : A publication officielle primaire lue en entier (aucune dans la session) ; B chiffre officiel rapporté par une réponse ministérielle, un rapport parlementaire ou une publication de recherche ; C association, syndicat, mutuelle, presse ou allégation parlementaire non recoupée ; D source secondaire, non datée ou en contradiction. Règles : pas d'écrasement, périmètre explicite, qualificatif obligatoire, dérivés balisés, pas de comparaison brut / standardisé ni détresse / dépression, sources non datées plafonnées à C, auteur d'une question parlementaire précisé, indicateur d'ancienneté au-delà de cinq ans. Contrôles : partiel > annuel (alerte), périmètres différents dans un taux (blocage), doublon, source manquante (rejet), écart > 10 % entre deux « exact » (conflit).

## 7. Exigences fonctionnelles

FR-01 à FR-04 saisie et historique ; FR-05 FR-06 calcul des dérivés avec refus si périmètres différents ; FR-07 chaque valeur avec périmètre, qualificatif, grade, source ; FR-08 conflits côte à côte ; FR-09 séries par institution avec avertissement de périmètre ; FR-10 filtre par grade ; FR-11 âge de la donnée visible ; FR-12 export CSV/JSON ; FR-13 rappel annuel ; FR-14 suivi des « à vérifier ». Acceptation : pas de valeur sans source ; 2019 affiche 59 et 70 avec alerte de conflit.

## 8. Règles éthiques

Aucune donnée nominative ; aucun détail de méthode ; pas de maille fine (seuil de 5, pas de ventilation par unité) ; cadrage non sensationnaliste ; mention du 3114 ; attribution des propos ; neutralité sur les blessures en manifestation (chiffres côte à côte, définitions différentes, sans qualification de responsabilité).

## 9. Points ouverts

1. Arrêté du 8 mars 2022 sur Légifrance (haute, S41 S42). 2. Séries suicides dans bilans sociaux et RSU (haute, S61 S74). 3. 2019 : 59 contre 70 (haute). 4. Date et méthode du baromètre MGP (haute). 5. data.gouv : Interstats, BDS, RSU, IGPN, maintien de l'ordre (haute). 6. Institution des 1 528 blessés (moyenne). 7. Manifestations lycéennes d'octobre 2026 à la source primaire (moyenne). 8. Existence et accès du TSUA (moyenne). 9. Arrêtés des concours (moyenne). 10. Article HAL « Le Saulnier » (à définir). 11. Crédits de prévention dans les documents budgétaires (moyenne). 12. Enquêtes d'investigation (basse).

## 10. Source complémentaire

[S79] Assemblée nationale, audition de la directrice de l'IGPN devant la commission d'enquête sur le maintien de l'ordre (15e législature) : https://www.assemblee-nationale.fr/dyn/15/comptes-rendus/ceordre/l15ceordre2021011_compte-rendu.pdf
