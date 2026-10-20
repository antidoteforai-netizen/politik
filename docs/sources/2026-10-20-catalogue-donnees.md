# Catalogue des données et API — Politik

Date : 2026-10-20. Méthode : interrogation directe de l'API catalogue de data.gouv.fr
(`/api/1/datasets/?q=` et `/api/1/dataservices/?q=`), lecture des fiches, téléchargement et
calcul sur le fichier OFPRA 2025, puis recherches web pour les chiffres nationaux. Niveaux :
V vérifié dans une source officielle, S secondaire, D position d'acteur, A à vérifier.

## 1. Ce que l'API catalogue de data.gouv renvoie sur le sujet

| Requête | Résultat | Lecture |
|---|---|---|
| `fraude` | 5 jeux, tous du ministère de l'Intérieur, 2013-2015 : typologie des faux documents découverts par la police aux frontières | Rien sur la fraude sociale. Les seules données « fraude » ouvertes datent de dix ans et concernent les faux documents d'identité. |
| `fraude sociale`, `CNAF`, `non-recours`, `asile OFPRA` (en recherche plein texte) | 0 | Le catalogue ne connaît pas ces mots ; les jeux existent sous d'autres titres (voir ci-dessous). |
| `dataservices?q=fraude` | 0 API | Aucune API publique ne porte sur la fraude. |
| `inégalités` | 3 jeux, aucun national sur les revenus | Les inégalités de revenus sont sous « niveau de vie pauvreté » (INSEE). |

## 2. Jeux de données retenus

| Jeu | Producteur | Mise à jour | Clé de jointure | Ce qu'il apporte | Lien |
|---|---|---|---|---|---|
| Demandes d'asile et de statut d'apatride déposées devant l'Ofpra | OFPRA | 2026-08-12 | nationalité (ISO 3166), département, mois, âge | Premières demandes par nationalité, taux de procédure accélérée, mineurs non accompagnés, par département | https://www.data.gouv.fr/datasets/demandes-dasile-et-de-statut-dapatride-deposees-devant-lofpra |
| Bénéficiaires de la protection internationale | OFPRA | à vérifier | nationalité, année | Stock de personnes protégées (réfugiés, protection subsidiaire) | https://www.data.gouv.fr/datasets/beneficiaires-de-la-protection-internationale |
| Immigrés et descendants d'immigrés en France | INSEE | 2026-10-06 | année, origine, département | Portail vers les publications INSEE (part d'immigrés, origines, logement) | https://www.data.gouv.fr/datasets/immigres-et-descendants-d-immigres-en-france |
| Ménages immigrés, statut d'occupation du logement, immigrés hors ménages ordinaires | Ministère de l'Intérieur | 2023-2025 | département | Logement et composition des ménages immigrés | https://www.data.gouv.fr/datasets/2013-menages-immigres |
| Part des immigrés dans la population (Sailly-lez-Lannoy) | commune | 2022 | commune | Exemple de réutilisation locale d'un chiffre INSEE ; montre la granularité communale possible | https://www.data.gouv.fr/reuses/part-dimmigres-dans-la-population-sailly-lez-lannoy |
| Revenus et pauvreté des ménages (Filosofi), données carroyées | INSEE | 2026-10-20 | commune, EPCI, carreau 200 m | Revenu déclaré et disponible, taux de pauvreté, part des prestations dans le revenu, à l'échelle locale | https://www.data.gouv.fr/datasets/revenus-et-pauvrete-des-menages-aux-niveaux-national-et-local-revenus-localises-sociaux-et-fiscaux |
| Indicateurs de pauvreté et de niveau de vie 1975-2024 | INSEE | 2026-10-09 | année | Gini, rapport interdécile, taux de pauvreté, parts S20/S80 | https://www.data.gouv.fr/datasets/indicateurs-de-pauvrete-et-de-niveau-de-vie-de-1975-a-2024-donnees-non-retropolees |
| ISF puis IFI par collectivité territoriale | Ministères économiques et financiers | 2026-04-14 (IFI 2025) | commune de plus de 20 000 habitants | Nombre de redevables, patrimoine moyen, cotisation moyenne, par commune | https://www.data.gouv.fr/datasets/impot-de-solidarite-sur-la-fortune-impot-sur-la-fortune-immobiliere-par-collectivite-territoriale |
| Égalité femmes-hommes | INSEE | 2026-10-20 | année, région | Portail vers les études et jeux INSEE (salaires, emploi, temps partiel) | https://www.data.gouv.fr/datasets/egalite-femmes-hommes |
| Allocataires des minima sociaux ; Minima sociaux, RSA et prime d'activité ; ISD insertion sociale | DREES | 2025-2026 | département, année | Bénéficiaires du RSA, AAH, ASS par département | https://www.data.gouv.fr/datasets/minima-sociaux-rsa-et-prime-dactivite |
| Demandeurs d'emploi bénéficiaires du RSA | France Travail | 2026-10-16 | département, mois | Croisement RSA et chômage | https://www.data.gouv.fr/datasets/demandeurs-demploi-beneficiaires-du-rsa |
| Orientation et accompagnement des bénéficiaires du RSA | DREES | 2025-12-19 | département | Mesure de l'accompagnement réel | https://www.data.gouv.fr/datasets/orientation-et-accompagnement-des-beneficiaires-du-rsa |
| Encaissements annuels des Urssaf ; effectifs par métier | Urssaf | 2023 | année, région | Dénominateur des cotisations ; effectifs (dont contrôle) | https://www.data.gouv.fr/datasets/encaissements-annuels-des-urssaf |
| Open Damir, dépenses d'assurance maladie interrégimes | CNAM | 2026-10-20 | prestation, département, mois | Dénominateur des dépenses de santé pour rapporter les fraudes détectées | https://www.data.gouv.fr/datasets/open-damir-base-complete-sur-les-depenses-dassurance-maladie-interregimes |
| Sécurité sociale (rapports annuels) | Cour des comptes | 2015-2021 | année | Données des rapports de certification et d'évaluation | https://www.data.gouv.fr/datasets/securite-sociale-2021 |
| Typologie des fraudes documentaires (faux documents découverts par la DCPAF) | Ministère de l'Intérieur | 2014-2015 | type de document, année | Seule série ouverte sur la fraude documentaire ; ancienne | https://www.data.gouv.fr/datasets/15080-typologie-des-fraudes-en-nombre-de-faux-documents-decouverts-par-la-dcpaf-1 |

## 3. API (dataservices) utilisables

| API | Producteur | Point d'entrée | Usage pour Politik |
|---|---|---|---|
| API données ouvertes de l'Urssaf (Explore v2.1) | Urssaf | https://open.urssaf.fr/api/explore/v2.1/ | Auto-entrepreneurs par secteur et département, déclarations d'embauche, procédures collectives, effectifs : contexte du travail dissimulé |
| Explore API v2 data.caf.fr | CNAF | https://data.caf.fr/api/explore/v2.1/ | Allocataires et prestations par territoire : dénominateur des fraudes CAF, part des prestations dans les revenus |
| API Recherche d'entreprises | DINUM | https://recherche-entreprises.api.gouv.fr | Vérifier une entreprise citée dans un dossier de fraude |
| API Sirene (bouquet API Entreprise) | INSEE via DINUM | https://entreprise.api.gouv.fr | Accès restreint ; identité des entreprises |
| API Attestation de vigilance Urssaf (bouquet API Entreprise) | Urssaf via DINUM | https://entreprise.api.gouv.fr | Accès restreint ; preuve qu'une entreprise est à jour de cotisations |
| API Quotient familial CAF et MSA (bouquet API Particulier) | CNAF, MSA via DINUM | https://particulier.api.gouv.fr | Accès restreint ; illustre ce que « solidarité à la source » rend possible |
| API catalogue data.gouv | DINUM | https://www.data.gouv.fr/api/1/datasets/?q= | Veille automatique sur les nouveaux jeux (utilisée pour ce catalogue) |

Aucune API ouverte ne porte directement sur la fraude, l'asile ou l'immigration : ces sujets sont
servis par des fichiers annuels, pas des flux.

## 4. KPI nationaux trouvés (pour les sections « Contexte » et « Mettre en regard »)

### Richesses et impôts

| Indicateur | Valeur | Année | Source | Niveau |
|---|---|---|---|---|
| Niveau de vie médian | 2 228 € par mois | 2024 | INSEE, Insee Première n° 2117 | V |
| Indice de Gini | 0,302, maximum depuis 1996 | 2024 | INSEE | V |
| Part des 20 % les plus aisés dans la somme des niveaux de vie | 38,8 % (20 % les plus modestes : 8,4 %) | 2024 | INSEE | V |
| Rapport interdécile | 3,48 | 2024 | INSEE | V |
| Taux de pauvreté monétaire | 15,4 % | 2024 | INSEE | V |
| Part du patrimoine brut détenue par les 10 % les mieux dotés | 47 % (le 1 % : 15 %) | début 2021 | INSEE, Revenus et patrimoine des ménages 2024 | V |
| Foyers redevables de l'IFI | 193 600 | 2025 | DGFiP via presse spécialisée | S |
| Recettes de l'IFI | 2,3 Md€ (+8 %) | 2025 | DGFiP via presse spécialisée | S |
| IFI 2024 | 186 000 foyers, 2,2 Md€, 10 900 € en moyenne ; les 5 % de foyers à plus de 5 M€ paient un tiers | 2024 | DGFiP via presse | S |

### Immigration et asile

| Indicateur | Valeur | Année | Source | Niveau |
|---|---|---|---|---|
| Immigrés vivant en France | 7,7 millions, 11,3 % de la population | 2024 | INSEE, Insee Première n° 2076 (via presse) | S |
| Étrangers | 6,0 millions, 8,8 % (5,1 M nés à l'étranger, 0,9 M nés en France) | 2024 | INSEE, Insee Première n° 2076 | V |
| Titres de séjour valides | 4,47 millions (+3,2 %) | 31 déc. 2025 | DGEF via presse (AFP) | S |
| Premiers titres délivrés | 384 230 (+11 %) ; étudiants en tête ; humanitaires 92 600 (+65 %) ; économiques 51 190 (-13 %) | 2025 | DGEF via presse | S |
| Demandes d'asile (toutes procédures) | 151 665 (-3,7 %) | 2025 | DGEF via presse | S |
| Premières demandes enregistrées à l'OFPRA | 111 343 (130 029 en 2024) | 2025 | OFPRA, fichier data.gouv, calcul Politik | V |
| Premières nationalités (premières demandes OFPRA) | Ukraine 10,8 %, RD Congo 10,2 %, Afghanistan 9,7 %, Guinée 5,3 %, Côte d'Ivoire 4,7 %, Haïti 4,4 %, Turquie 3,6 %, Soudan 3,6 % | 2025 | OFPRA, calcul Politik | V |
| Part des premières demandes venant de pays en conflit armé | environ 49 % (liste indicative de 18 pays : Afghanistan, Ukraine, Syrie, Soudan, RD Congo, Haïti, Somalie, Érythrée, Yémen, Mali, Birmanie, Soudan du Sud, Palestine, Irak, Éthiopie, Burkina Faso, Niger, Cameroun) | 2025 | calcul Politik sur fichier OFPRA ; la liste des « pays en conflit » est un choix, pas une catégorie officielle | A |
| Taux de protection OFPRA | 41 % (39 % en 2024) ; Afghanistan 57 %, Ukraine 89 %, Haïti 89 % | 2025 | OFPRA via EUAA | S |
| Ukrainiens accueillis sous protection temporaire | environ 85 000 | déc. 2024 | circulaire du gouvernement | V |

**Sur la question « quelle part des immigrés sont des réfugiés de guerre »** : réponse
calculée par `scripts/fetch-donnees.py` sur le jeu OFPRA « Bénéficiaires de la protection
internationale » (mis à jour le 2026-08-12) : **736 534 personnes sous protection fin 2025**
(535 105 réfugiés, 201 429 protection subsidiaire), contre 455 295 fin 2020 (+62 %). Rapporté aux
7,7 millions d'immigrés, cela fait **environ 9,6 %, soit un immigré sur dix** (12,3 % des
étrangers). Réserves : deux stocks de sources et de dates différentes ; une personne protégée puis
naturalisée sort du compte OFPRA ; « réfugié de guerre » n'est pas une catégorie, les protégés
viennent d'abord d'Afghanistan (14 %), de Syrie (6 %), de RD Congo (6 %), de Russie (5 %), du Sri
Lanka (5 %), du Soudan (4 %). Le flux 2025 (111 343 premières demandes, environ la moitié depuis des
pays en conflit armé) complète ce stock sans s'y additionner.

**Deux autres croisements calculés par le même script** : premières demandes d'asile 2025 par
département rapportées à la population légale (geo.api.gouv.fr) : 16,3 pour 10 000 habitants en
moyenne, Guyane 124,6, Mayotte 58,2, Paris 36,6, Guadeloupe 36,5, Bas-Rhin 30,0 ; et classement
IFI 2025 des communes par nombre de redevables (xlsx DGFiP lu en stdlib) : Paris 16e 10 159,
Paris 7e 4 558, Paris 17e 4 359, Neuilly-sur-Seine 4 091, sur 237 communes publiées et 106 230
redevables cumulés. Résultats dans `data/donnees-api.json`.

**API à accès restreint renvoyées par la recherche « fraude »** (13 résultats sur la page, 6
restreints) : FICOBA (comptes bancaires), Impôt particulier, API Entreprise, Service national, Liste
des paiements et Statut demandeur d'emploi (France Travail). Ce sont les outils de croisement
réservés aux administrations et aux caisses : ils expliquent ce que « solidarité à la source » et
le RNCPS rendent possible, et pourquoi l'open data ne peut pas détecter de fraude individuelle.

### Associations qui accompagnent les étrangers

| Indicateur | Valeur | Année | Source | Niveau |
|---|---|---|---|---|
| Crédits de la mission « Immigration, asile et intégration » | 2,3 Md€ (+23 % depuis 2019) | 2023 | Cour des comptes, rapport du 11 février 2025, via presse | S |
| Financements publics aux associations du secteur | près de 1,1 Md€ (+52 % depuis 2019) | 2023 | Cour des comptes via presse et amendements | S |
| Dont gestion de l'hébergement des demandeurs d'asile | plus de 850 M€ (+46 %) ; plus de 85 % des financements versés aux opérateurs | 2023 | Cour des comptes ; réponse ministérielle | S |
| Contrat d'intégration républicaine (formations) | 76,3 M€ (+114 %) | 2023 | Cour des comptes via presse | S |
| Subventions publiques à la Cimade | 6,5 M€, dont 2,6 M€ du ministère de l'Intérieur | 2022 | amendement parlementaire ; Ifrap | D |
| Places d'hébergement contre demandes d'asile | +14,7 % de places, +7,4 % de demandes | 2019-2023 | Cour des comptes via presse | S |

Deux amendements donnent des points de départ contradictoires pour 2016 (306 M€ contre 8,6 M€) :
périmètres différents, à vérifier dans les documents budgétaires avant toute courbe.

### Égalité femmes-hommes

| Indicateur | Valeur | Année | Source | Niveau |
|---|---|---|---|---|
| Écart de revenu salarial annuel, secteur privé | 22,2 % | 2023 | INSEE, Insee Focus n° 349 (4 mars 2025) | V |
| Écart de salaire net en équivalent temps plein | 14,2 % | 2023 | INSEE | V |
| Écart à poste et établissement comparables | 3,8 % | 2023 | INSEE | V |

Intérêt pour Politik : un même « écart » avec trois définitions, exactement comme « fraude »
(estimée, détectée, recouvrée). C'est la leçon de méthode du tableau de bord, illustrée sur un
autre sujet.

## 5. Croisements possibles, et impossibles

| Croisement | Faisable ? | Clé | Ce que ça montre | Garde-fou |
|---|---|---|---|---|
| Fraude détectée par branche (Bercy) et dépenses de la branche (Open Damir, CAF, Urssaf) | Oui, au niveau national | année, branche | Un taux : fraude détectée rapportée aux montants versés | Détecté n'est pas réel ; afficher le dénominateur |
| IFI par commune et Filosofi par commune | Oui | code commune (plus de 20 000 habitants) | Où vivent les hauts patrimoines, à côté du taux de pauvreté | Lecture écologique : des communes, pas des personnes |
| Demandes d'asile par département (OFPRA) et RSA par département (DREES) | Oui techniquement | département | Rien de causal : un demandeur d'asile n'a pas droit au RSA | Ne pas suggérer un lien ; afficher la règle de droit |
| Part d'immigrés par commune (INSEE) et fraude | **Non** | aucune | Aucune donnée de fraude n'est publiée par commune ni par origine | Croisement impossible, et interdit par construction (pas de statistique ethnique dans les caisses) |
| Nationalité des demandeurs d'asile et taux de protection | Oui | nationalité | Quelle part des demandes vient de pays en guerre | La liste des pays « en conflit » est un choix éditorial à afficher |
| Financements des associations et nombre de places d'hébergement | Oui, national | année | Coût unitaire d'une place | Les chiffres viennent de comptes rendus du rapport, pas du rapport |
| Écart salarial F/H (INSEE) et fraude | Non pertinent | aucune | Sert de parallèle de méthode, pas de croisement | Ne jamais le présenter comme un lien |
| Décès INSEE et bénéficiaires | Non en open data | identité | Relève du RNCPS dans les caisses | Déjà noté dans le rapport initial |

## 6. Ce que ce catalogue change dans le tableau de bord

- Section « Contexte : richesses, impôts, immigration » : les KPI du §4, chacun avec sa source.
- Section « Mettre en regard » : ordres de grandeur côte à côte (fraude sociale estimée,
  contrôle fiscal, IFI, mission immigration, associations, non-recours), avec un avertissement
  permanent sur les périmètres ; l'asile par nationalité ; les trois écarts femmes-hommes.
- Section « Catalogue » : les jeux et API du §2 et §3, avec clé de jointure.
- Tableau des croisements impossibles (§5), en clair.

## 6 bis. Deuxième passage du script (même jour) : quatre sources de plus, toutes officielles

| Source | Appel | Résultat | Niveau |
|---|---|---|---|
| Open Urssaf, « résultats de la lutte contre le travail dissimulé » | API Explore v2.1, somme nationale par année | 640,8 M€ (2018), 708,3 (2019), 605,8 (2020), 789,4 (2021), 788,1 (2022), 1 177,5 (2023), 1 586,0 (2024) ; actions de 50 358 à 33 082. Retrouve le chiffre Bercy 2024. | V |
| Open Urssaf, « résultats de l'activité du contrôle » | idem | 2024 : 734,0 M€ redressés, 155,8 M€ restitués aux cotisants, 72 978 actions | V |
| data.caf.fr, `rsa_s_type_sitfam_d_nat` | API Explore v2.1, groupé par mois | mars 2026 : 1 847 267 foyers, 3 720 310 personnes, 1 047 M€ par mois, soit 12 564 M€ annualisés | V |
| INSEE Filosofi 2020 (COM, ARR, METRO) joint à l'IFI 2025 sur le code commune | zip CSV | 236 communes IFI sur 237 jointes ; France 2020 : médiane 22 400 €, pauvreté 14,4 % ; Paris 16e : 10 159 redevables, médiane 40 140 €, pauvreté 11 % ; Neuilly : médiane 45 580 €, pauvreté 8 %. Redevables selon la pauvreté de leur commune : moins de 10 % : 25 341 ; 10 à 15 % : 46 282 ; 15 à 20 % : 15 459 ; 20 % et plus : 19 078 (Paris 17e, Lyon, Marseille…). | V |
| Cour des comptes, rapport sur les associations (PDF lu intégralement) | vie-publique.fr, 91 pages | 716 M€ (2019) → 1 094 M€ (2023), +52,7 % ; hébergement > 850 M€ (+46 %) ; CIR 76,3 M€ (+114,4 %) ; mission 2,3 Md€ (+23 %) ; places +14,7 %, demandes +7,4 % ; marché rétention 6,3 M€ dont Cimade 2,6 M€. Les chiffres de presse sont remplacés par ceux du rapport. | V |
| data.gov (États-Unis) | API catalogue CKAN | 404 le 2026-10-20 ; page d'accueil accessible. Piste pour une comparaison internationale : PaymentAccuracy.gov. | — |
| Page data.gouv « Égalité femmes-hommes » et page INSEE associée | lues | portail vers l'ouvrage 2022 et les études ; chiffres 2023 déjà repris (22,2 / 14,2 / 3,8 %) | V |

## 6 ter. Troisième passage : fin des chiffres de presse, statut de chaque jeu

| Indicateur | Avant | Maintenant | Source officielle |
|---|---|---|---|
| IFI 2025 | 193 600 foyers, 2,3 Md€ (presse, S) | 193 600 foyers ayant reçu un avis (+4,0 %), 2,3 Md€ d'avis émis (+8,0 %), patrimoine net imposé 493 Md€, taux effectif 0,47 % ; recettes encaissées par l'État 2 771 M€ en 2025 (2 739 en 2024, 2 354 en 2023) (V) | DGFiP Statistiques n° 45, avril 2026 ; cahier statistique du rapport d'activité DGFiP 2025 |
| Premiers titres de séjour 2025 | 384 230, +11 % (AFP, S) | 377 462, +9,2 %, résultat provisoire au 31 mai 2026 ; l'estimation du 27 janvier 2026 donnait 384 000 (+11,2 %) ; protections subsidiaires plus que doublées, motifs économiques -12,6 % (V) | DGEF, « Les titres de séjour en 2025 », immigration.interieur.gouv.fr ; jeu data.gouv « Stock et flux des titres de séjour, 2023 » |

Le tableau « Catalogue » de la page porte désormais une colonne **Utilisé dans la page** pour
chacun des 25 jeux et API : croisé (par le script), utilisé (chiffre repris), appelé (API),
remplacé, non croisé (avec la raison), inaccessible (accès restreint). Plus aucun chiffre de la
page ne vient de la presse pour la richesse, l'immigration, l'asile ou les associations ; restent
en S le non-recours au RSA (presse spécialisée, à recouper avec la DREES) et les contrôles CAF
(dossier d'associations), qui n'ont pas d'équivalent officiel ouvert.

Reste ouvert : le dénominateur assurance maladie à partir d'Open Damir (base volumineuse, B-011),
et la comparaison internationale (data.gov sans API exploitable le 2026-10-20).

## 6 quater. Quatrième passage : non-recours et contrôles CAF en sources officielles, dénominateurs, fraude et délinquance

| Source | Obtenu | Niveau |
|---|---|---|
| DREES, Dossier n° 92 (février 2022) et Études et Résultats n° 1370 (6 mai 2026, page lue) | Non-recours au RSA : 34 % de non-recours trimestriel en 2018, 750 M€ par trimestre non versés (≈ 3 Md€ par an, champ métropole) ; fin 2021 : 33 à 37 % des foyers éligibles, 560 000 foyers. Remplace le 2,25 Md€ de presse. | V |
| CNAF, dossier de presse « Bilan 2025 » (avril 2026, PDF lu) | 29,2 M de contrôles en 2025 (27,5 M automatisés, 1,6 M sur pièces, 83 196 sur place, 700 contrôleurs), 508,8 M€ de fraudes détectées (+13 %), 1,68 Md€ régularisés dont 1,27 Md€ d'indus et 408,9 M€ de rappels, près de 100 Md€ versés à 13,5 M d'allocataires. Remplace les chiffres du dossier des associations. | V |
| CNAM, fichiers NTOT mensuels (open-data-assurance-maladie.ameli.fr), 24 fichiers lus par le script | Soins de ville remboursés, régime général : 122,5 Md€ (2024), 127,8 Md€ (2025) | V |
| ONDAM 2025 (LFSS 2025 ; avis du comité d'alerte du 20 avril 2026) | 265,9 Md€ voté, 265,4 Md€ exécuté | V |
| Open Urssaf, encaissements annuels | 421,1 Md€ encaissés en 2022 (dont 394,6 Md€ sur revenus d'activité) : le travail dissimulé redressé en 2022 (788 M€) pèse 0,19 % | V |
| Ministère de l'Intérieur, crimes et délits 2012-2021 (xlsx archivé, 21 feuilles lues par le script) | Faux documents d'identité : 5 800 à 7 200 faits par an, stables ; escroqueries : 163 922 → 314 297 ; travail clandestin : 10 468 → 7 840 ; emploi d'étranger sans titre : ≈ 2 900 ; fraudes fiscales : 583 à 810 | V |
| Bercy et MICAF, contrôle fiscal | 2020 : 7,79 Md€ encaissés ; 2021 : 13,4 notifiés / 10,7 encaissés ; 2022 : 14,6 / 10,6 ; 2023 : 15,2 ; 2024 : 16,7 / 11,4 ; 2025 : 17,1 / 11,4. Prolonge la série du Data-Bilan de David Libeau (21 Md€ en 2015, 10 en 2020, S) | V |
| Réutilisations envoyées par la responsable du projet | Data-Bilan (blog + fiche data.gouv) lus : méthode reprise (croiser résultats financiers et faits enregistrés). « Délinquance en France » : fiche lue, le rapport Looker Studio exige un navigateur Google ; son jeu source (bases SSMSI, maj 2026) est catalogué, non croisé (pas de série faux documents). | S |
| Pages demandées, ouvertes dans Chromium (Playwright) | API « fraude » : 13 résultats extraits (FICOBA, Impôt particulier, API Entreprise, Service national, France Travail ×2, puis hors sujet) ; jeux « inégalités » : 44 résultats, titres extraits ; réutilisation Sailly-lez-Lannoy : page, jeu lié et lien Datawrapper extraits | V |

Nouveau graphique « Le dénominateur » : fraude détectée CAF / prestations ≈ 0,5 % ; assurance maladie / ONDAM ≈ 0,27 % (et / soins de ville ≈ 0,57 %) ; Urssaf / encaissements ≈ 0,19 % (2022) ; non-recours RSA / RSA versé ≈ 24 %.

## 6 quinquies. Cinquième passage : chaque jeu du catalogue croisé, exploité, remplacé ou déclaré non croisable avec sa raison

| Jeu | Avant | Maintenant |
|---|---|---|
| Égalité femmes-hommes (data.gouv → INSEE) | chiffres d'une recherche web | fichier `if349.xlsx` de l'Insee Focus n° 349 lu par le script : série 1995-2023, 2023 = 22,2 % (revenu salarial), 14,2 % (EQTP), 9,3 % (volume de travail) ; la page affiche les valeurs du fichier |
| Bases SSMSI 2016-2025 (source du rapport Looker « Délinquance en France ») | non croisé | base départementale lue : escroqueries et fraudes aux moyens de paiement, France entière, 249 477 faits (2016) → 445 463 (2025), 3,74 → 6,52 pour 1 000 habitants ; prolonge la série archivée |
| Minima sociaux DREES (xls 2014) | non croisé | remplacé par data.caf.fr `rsa_s_type_sitfam_d_dep` (mars 2026) : foyers RSA pour 1 000 habitants par département, joint à Filosofi DEP (taux de pauvreté 2020) et geo.api ; 98 départements, corrélation de Pearson 0,85 ; La Réunion 101 foyers pour 1 000 habitants et 35,6 % de pauvreté, Martinique 79 et 26,7 %, Pyrénées-Orientales 54 et 20,7 % |
| Réutilisation Sailly-lez-Lannoy | page lue | jeu source lu (csv) : 5,1 % d'immigrés en 2008, 5,0 % en 2013, 3,1 % en 2018, contre 11,3 % en France en 2024 ; carte « lecture locale » avec l'avertissement de lecture écologique ; le lien Datawrapper ne sert pas de données (404 sur dataset.csv) |
| Demandeurs d'emploi bénéficiaires du RSA (France Travail) | non croisé | non croisable : la ressource est une application web, pas un fichier |
| Open Damir | non croisé | remplacé par les fichiers NTOT (fait au passage 4) |
| Typologie DCPAF 2014-2015 | non croisé | non croisable techniquement (.xls binaire) ; grandeur couverte par l'index 83 de l'archive crimes et délits, croisée |
| IPS écoles et collèges, revenus des 60 ans et plus, indicateurs ODD | non croisé | non croisables : aucune clé commune avec une donnée de fraude ; conservés comme contexte |

Le script compte désormais 13 étapes, toutes en succès le 2026-10-20.

## 6 sexies. Vérification croisée finale

Script `scripts/verifier-croisements.mjs` (sort en 1 au moindre manque). Résultat du 2026-10-20 :
14 étapes de collecte présentes et non vides, chacune rendue dans un conteneur existant de la page ;
bloc `API` injecté cohérent avec `data/donnees-api.json` (même date) ; catalogue de 28 lignes à six
colonnes, statuts : 8 croisé, 5 utilisé, 4 appelée, 2 remplacé, 5 non croisable (raison écrite),
3 inaccessible (accès restreint), 1 doublon ; 121 clés de texte définies aux trois niveaux ; script
de la page valide. Ajout du passage : dépenses d'allocation RSA de la DREES 2009-2024 (xlsx lu,
9,6 → 12,4 Md€ en euros 2024, cohérent avec les 12,6 Md€ annualisés de data.caf.fr), qui fait
passer le jeu « Minima sociaux » de « remplacé » à « croisé ».

Passage suivant : la typologie DCPAF a finalement été lue. Faute de bibliothèque (ni xlrd ni
pandas), le script embarque un lecteur OLE2 + BIFF8 minimal (une centaine de lignes, stdlib) qui
décode les deux fichiers .xls de 2014 et 2015 : 14 363 faux documents découverts en 2007, 12 097 en
2010, 21 618 en 2012, 18 830 en 2013 ; obtentions frauduleuses détaillées 2007-2010 (actes de
naissance 58 à 601 par an, cartes d'identité 143 à 714, passeports 166 à 694, titres de séjour 154
à 421). Carte ajoutée dans la section Immigration, face aux « numéros suspects » et à l'index 83.
Le jeu de données du graphique Datawrapper de Sailly a été retrouvé à sa version 1
(`dwcdn.net/ONKPN/1/dataset.csv`) : identique au jeu source, vérifié par le script.

Huitième passage : les quatre jeux « contexte » restants sont croisés ou appelés.
- IPS des collèges (API data.education.gouv.fr, 2025-2026, 21 000 établissements) : IPS moyen par
  département face au taux de pauvreté Filosofi, 98 départements, corrélation −0,51 ; La Réunion
  89, Ardennes 93, Seine-Saint-Denis 94 en bas de classement.
- Revenus des 60 ans et plus (API Caisse des Dépôts, Filosofi 2017) : pauvreté des 60-74 ans par
  département face à la pauvreté tous âges 2020, 98 départements (le fichier contient deux lignes par
  département, dédoublonnées), corrélation 0,93 ; La Réunion 29,8 %, Martinique 22,4 %,
  Seine-Saint-Denis 22,0 %.
- Liste nationale des indicateurs ODD 2025 (xlsx INSEE) : 14 lignes d'indicateurs d'inégalité de
  revenu (seuils de niveau de vie, Gini, S80/S20), mêmes sources que les tuiles ; recoupement affiché
  sous la carte des écarts femmes-hommes.
- API Recherche d'entreprises : identité Sirene des cinq opérateurs de l'asile cités par la Cour des
  comptes (France Terre d'Asile 1 000 à 1 999 salariés, Forum réfugiés 500 à 999, Coallia 5 000 à
  9 999, Groupe SOS Solidarités 2 000 à 4 999 ; la Cimade ressort sur une entité locale sans
  effectif renseigné), tableau sous la carte des financements.

Restent hors croisement : France Travail « demandeurs d'emploi bénéficiaires du RSA » (la ressource
est une application web ; aucun lien d'export trouvé dans la page, sondée deux fois) et les trois API
à accès restreint (FICOBA, Impôt particulier, France Travail), réservées aux administrations par la
loi : elles ne peuvent pas être appelées depuis un projet citoyen, et c'est précisément ce que la page
explique. Le rapport Looker Studio reste illisible hors navigateur Google ; son jeu source est
croisé. Le script compte 19 étapes, vérification croisée verte.

## 6 septies. Liens envoyés par la responsable du projet en fin de session

| Lien | Nature | Ce qui en est fait |
|---|---|---|
| INSEE, « L'essentiel sur… la pauvreté » (statistiques/5759045) | officielle, V | Trois cartes : taux de pauvreté 2016-2024 (15,4 %, 9,8 M de personnes, seuil 1 337 €) ; effet des prestations (22,3 % avant, 15,4 % après, −6,9 points dont minima sociaux −2,0) ; pauvreté selon le lien avec l'immigration (immigrés 32,8 %, nés en Afrique 39,7 %, descendants 27 %, ni l'un ni l'autre 11 %) |
| Observatoire des inégalités, chiffres-clés sur les riches (2 juin 2026) | association indépendante, S | Carte « qui dit quoi » : 4,8 M de riches (7,5 %, seuil 4 292 €/mois), 11 % de ménages riches en patrimoine, 6,5 % millionnaires, 0,6 % redevables de l'IFI |
| Assemblée nationale, dossier DLR5L17N50819 | proposition de loi « visant à lever les contraintes à l'exercice du métier d'agriculteur » | Hors sujet (agriculture), non intégré ; à confirmer si un autre dossier était visé |

France Travail « demandeurs d'emploi bénéficiaires du RSA » : treize jeux voisins examinés (DARES, séries STMT mensuelles et trimestrielles), aucun ne ventile les inscrits par perception du RSA ; la ressource France Travail reste une application web. Hors croisement, raison affichée.

## 6 octies. Aides à la presse et propriété des médias (page `medias.html`)

| Jeu | Producteur | Période | Usage |
|---|---|---|---|
| Aides à la presse : classement des titres de presse aidés | Ministère de la Culture | 2015-2023 (maj 2026-08-18) | Croisé : rattachement de chaque titre à une famille de propriétaires (colonne « groupe d'appartenance », sinon nom du titre), totaux par famille et par année |
| Aides à la presse : classement des principaux groupes de presse aidés | Ministère de la Culture | 2016-2019 | Croisé : classement des groupes tel que publié (UFIPAR premier chaque année) |
| Aides à la presse, compilation des ressources | Ministère de la Culture | maj 2026-10-19 | Appelée : index des 39 jeux (SPTEL, exemplaire posté, etc.), non exploités un par un |

Points de méthode : le CSV « titres » a 18 colonnes avec un retour à la ligne dans un en-tête ;
l'année est en colonne 17, le groupe en 16 ; avant 2020 la colonne groupe est vide (totaux
2015-2019 = minimums) ; 2023 double le total par changement de périmètre (décret 2023-132).
Absents : aides à l'audiovisuel privé, crédit d'impôt, commande publique par bénéficiaire.

## 7. À faire ensuite

- B-007 : télécharger et exploiter le fichier IFI 2025 par commune (xlsx) et Filosofi par
  commune pour une carte ou un tableau « communes à plus de 1 000 redevables ».
- B-008 : exploiter « Bénéficiaires de la protection internationale » pour le stock de
  personnes protégées, et le rapporter au stock d'immigrés.
- B-009 : brancher l'API Open Urssaf et l'API data.caf.fr dans une version locale du tableau
  de bord (le sandbox des Artifacts bloque les appels réseau ; en local, ça fonctionne).
- Lire le rapport de la Cour des comptes du 11 février 2025 lui-même (ccomptes.fr) pour
  remplacer les chiffres de presse par les chiffres du rapport.
