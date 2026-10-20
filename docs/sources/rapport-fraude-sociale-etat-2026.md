# Rapport de recherche : fraude sociale, fraude documentaire et responsabilité de l'État

**Version du 20 octobre 2026** | Document de travail, non juridique, non exhaustif

## Légende des niveaux de confiance

Chaque information importante est étiquetée :

- **[V] Vérifié** : lu dans une source officielle ou primaire pendant cette session.
- **[S] Source secondaire** : presse, think tank, association, blog juridique. À recouper.
- **[D] Déclaratif ou partisan** : position d'un acteur, pas un fait établi.
- **[A] À vérifier** : issu de connaissances générales ou non retrouvé pendant la session.

---

## 1. Résumé exécutif

1. **Le débat est bloqué par un trou de mesure.** Entre les 1,8 million de numéros de sécurité sociale jugés suspects par Charles Prats (2019) et la fourchette sénatoriale de 245 M€ à 1,17 Md€ pour la fraude documentaire, l'écart vient de la définition du mot "suspect". Le dernier contrôle d'immatriculation que j'ai retrouvé date de 2018 [V].
2. **Chiffres officiels 2026.** Le HCFiPS évalue la fraude sociale totale à 14 Md€ par an (janvier 2026) : 52 % côté entreprises et indépendants, 36 % côté assurés, 12 % côté professionnels de santé [V]. Environ 2 Md€ sont détectés et stoppés, 680 M€ recouvrés [V]. Bercy annonce 3,1 Md€ de fraudes sociales détectées, évitées ou redressées en 2025 [V].
3. **Aucun chiffre 2026 dédié à la fraude documentaire aux numéros de sécu** n'a été trouvé. Elle n'est pas isolée dans les publications consultées.
4. **Le 14 Md€ de Prats et le 14 Md€ du HCFiPS ne sont pas la même chose.** Le premier visait la seule fraude documentaire (estimation contestée), le second la fraude sociale totale [V/S].
5. **Cadre légal.** La loi relative à la lutte contre les fraudes sociales et fiscales a été promulguée le 25 juin 2026 après la décision 2026-904 DC du Conseil constitutionnel (18 juin) [V/S]. Un article adopté sanctionne l'obtention frauduleuse d'un numéro de sécu par la perte de tous les droits [V].
6. **Sociologie.** Les sociologues (Vincent Dubois en tête) étudient la fabrication de la catégorie "fraudeur" et le surcontrôle des précaires, pas la prévalence de la fraude. Les profils de fraudeurs issus des cas détectés dépendent d'où l'on regarde [V/S].
7. **"Personnes racisées" contre "État" : faux binaire.** Les sources trouvées documentent un surcontrôle fondé sur la précarité, pas sur l'origine (les statistiques ethniques sont interdites en France). Prats et Knafo critiquent aussi l'État ; la gauche cible aussi des acteurs privés (entreprises) [V/S].
8. **Constitution.** Le Gouvernement dispose de l'administration (art. 20) et assure l'exécution des lois (art. 21) ; le Parlement contrôle et évalue (art. 24) ; la Cour des comptes assiste l'évaluation des lois de financement (art. 47-2). L'objectif de valeur constitutionnelle de lutte contre la fraude à la protection sociale existe, mais il s'équilibre avec les droits (soins essentiels, vie privée) [V].
9. **Fonctionnel.** Ce rapport propose 12 modules pour un tableau de bord qui relie estimé, détecté, évité, recouvré, avec définitions, intervalles, dénominateurs et sources visibles.
10. **Prochaine étape recommandée :** un baromètre d'audit aléatoire annuel (mesurer d'abord), puis les parcours de bonne foi, puis la graduation des vérifications à l'entrée. La biométrie en dernier.

---

## 2. Déroulé de la conversation

| # | Demande | Résultat principal |
|---|---------|--------------------|
| 1 | Résumer l'article Polémia sur *Le casse du siècle* (Sarah Knafo) | Résumé fait. Source militante, recension très favorable, chiffres de l'auteure non confrontés. [S/D] |
| 2 | Notes sur l'audition de Charles Prats | Corrections : "RN CPS" est le RNCPS (répertoire), "33 % (37 M)" est incohérent (probablement 3,7 M), "49.3" n'est pas l'âge de la retraite, "fabrique de l'assistanat" est une formule de Knafo. Chiffres de Prats variables (1,8 M, 5 M, 2,4 M). |
| 3 | SANDIA et biométrisation du numéro de sécu | La page citée vient de l'Assemblée des Français de l'Étranger (mars 2022), pas de l'Assemblée nationale 2020. Les réponses ministérielles de 2019-2020 sont, elles, à l'Assemblée nationale. |
| 4 | "Où en est la situation aujourd'hui ?" | Loi de 2026, HCFiPS 2026, pas de réforme biométrique trouvée. |
| 5 | "Quelles sont les réelles problématiques ?" | Six nœuds : mesure, entrée (documents), distinction identité/résidence/existence, erreur vs fraude, bonne foi, non-recours. |
| 6 | Concepts de solutions | Sept concepts, de la mesure à la biométrie. |
| 7 | Sociologues, chiffres 2026, cadrage "racisés vs État" | Recherches sur Dubois, HCFiPS, algorithme CNAF, Défenseur des droits. |
| 8 | Ce rapport | Synthèse, spécifications fonctionnelles, KPI, analyse constitutionnelle, API, procédures depuis 2020. |

**Corrections de sources faites pendant la conversation :**

- SANDIA : la dénomination varie selon les sources. Une réponse ministérielle parle de "service administratif national d'immatriculation des assurés", un document parlementaire récent de "service administratif national d'identification des assurés". Le développement "Service d'attribution des numéros d'identification d'attente" n'a pas été retrouvé tel quel. [V]
- Gestion par la CNAV : confirmée par le texte d'un amendement adopté en février 2026 (article 28 ter), qui précise que la procédure d'immatriculation des assurés nés hors de France est assurée par la CNAV. [V]

---

## 3. Décisions et positions de travail

Ces positions viennent de la conversation. Elles ne sont pas des décisions formelles : **à valider par toi**.

| # | Position | Origine | Statut |
|---|----------|---------|--------|
| P1 | Mesurer avant de choisir une solution (baromètre aléatoire annuel) | Proposée par Claude | À valider |
| P2 | Ne pas confondre le 14 Md€ HCFiPS (fraude sociale totale) et le 14 Md€ attribué à Prats (documentaire, estimation contestée) | Établie par recoupement | Retenue |
| P3 | Corriger l'attribution de la source SANDIA (AFE 2022, pas AN 2020) | Établie | Retenue |
| P4 | Traiter "né à l'étranger" et "étranger" comme deux catégories distinctes | Établie | Retenue |
| P5 | Placer la biométrie en dernier : au mieux un dédoublonnage à l'attribution, pas une clé d'accès | Proposée par Claude | À valider avec ton retour de terrain |
| P6 | Évaluer chaque affirmation avec une grille en quatre colonnes : qui est désigné, sur quelle donnée (aléatoire ou détectée), avec quelle définition, quel coût pour la bonne foi | Proposée par Claude | À valider |
| P7 | Présenter le rapport en français, en Markdown, sans tirets cadratins | Demande et préférences | Appliquée |

**Questions ouvertes :**

- Quel était ton rôle dans les projets biométriques, et qu'as-tu observé (taux d'erreur, exclusions, résistances) ?
- Veux-tu que la responsabilité de l'État soit un axe principal, ou une des cinq lectures comparées ? (Voir la section 7 : j'ai gardé les contre-arguments pour que l'analyse tienne.)

---

## 4. Actions

### Réalisées pendant la session

- [x] Lecture de l'article Polémia et résumé.
- [x] Recherches sur la loi 2026, la décision 2026-904 DC, le HCFiPS 2026, la fraude documentaire aux NIR.
- [x] Lecture de la page AFE sur le SANDIA.
- [x] Lecture du communiqué de Bercy (8 avril 2026) sur les résultats 2025.
- [x] Lecture du texte intégral de la Constitution (site du Conseil constitutionnel).
- [x] Consultation de l'accueil de QPC 360 : aucune QPC dédiée à la fraude identifiée dans les éléments visibles (accueil et dernières décisions).
- [x] Recherche de jeux de données et d'API.

### Non réalisées (limites rencontrées)

- [ ] La page de recherche data.gouv.fr (`q=fraude`) bloque l'accès automatisé : je n'ai pas pu parcourir la liste des résultats.
- [ ] La page "Actualités" du Conseil constitutionnel n'a pas été consultée.
- [ ] La vidéo de l'audition de Prats n'a pas pu être visionnée.

### À faire (priorisé)

| Priorité | Action | Outil / méthode |
|----------|--------|-----------------|
| Haute | Parcourir toi-même data.gouv.fr avec les requêtes de la section 10 | Navigateur, ou API catalogue (section 10) |
| Haute | Demander les audits d'immatriculation (dont celui de 2018 mené avec la police aux frontières) et les résultats des campagnes de contrôle interne du SANDIA | Demande CADA à la CNAV et à la DSS |
| Haute | Retrouver le texte final promulgué de la loi du 25 juin 2026 et vérifier le sort de l'article 28 ter (NIR frauduleux) | Légifrance |
| Moyenne | Lire la note annuelle HCFiPS (janvier 2026) en entier, dont annexes sur les taux de fraude par organisme | strategie-plan.gouv.fr |
| Moyenne | Chercher les QPC liées au code de la sécurité sociale (articles L. 114-...) sur QPC 360 | Recherche avancée (section 11) |
| Moyenne | Chercher les effectifs affectés à la lutte contre la fraude par organisme (ETP) | COG 2023-2027, rapports Cour des comptes |
| Basse | Suivre les audiences QPC d'octobre 2026 (affaires 2026-1229 à 2026-1232) pour voir si l'une concerne le sujet | Agenda QPC 360 |
| Basse | Prototyper le tableau de bord (section 9) | Airtable ou Notion pour le modèle de données, puis page web |

---

## 5. Synthèse des recherches

### 5.1 Chiffres de référence 2025-2026

| Indicateur | Valeur | Période | Source | Niveau |
|------------|--------|---------|--------|--------|
| Fraude sociale estimée | 14 Md€ | Note de janvier 2026 | HCFiPS (infographie officielle) | V |
| Répartition par auteur | 52 % entreprises et indépendants, 36 % assurés, 12 % professionnels de santé | Idem | HCFiPS | V |
| Répartition par nature | 52 % travail dissimulé (cotisations), 48 % prestations | Idem | HCFiPS | V |
| Fraudes détectées et stoppées | environ 2 Md€ (2,5 Md€ avec les fraudes évitées) | Données publiées jan. 2026, année probable 2024 | HCFiPS | V |
| Fraudes recouvrées | 680 M€ | Idem | HCFiPS | V |
| Fraudes sociales détectées, évitées ou redressées | 3,1 Md€ (+4,1 % sur 2024, deux fois 2021) | 2025 | Ministère de l'Économie (8 avril 2026) | V |
| Contrôle fiscal | 17,1 Md€ de droits et pénalités notifiés (+3 %), 11,4 Md€ encaissés par la DGFiP | 2025 | Idem | V |
| Branche Famille | 509 M€ détectés (+13 %) ; plus d'un tiers pour dissimulation de ressources ou fausses déclarations, plus d'un quart pour la résidence | 2025 | Idem | V |
| Assurance maladie | 723 M€ détectés ou évités (+15 %), dont 286 M€ évités ; 84 % des montants concernent les professionnels de santé (621 M€) ; la moitié des fraudes détectées (en nombre) est commise par des assurés | 2025 | Idem | V |
| Détails assurance maladie | centres de santé 39 à 138 M€ ; transports sanitaires 42 à 61 M€ ; dispositifs médicaux 18 à 33 M€ ; arrêts de travail 42 à 49 M€ | 2025 | Idem | V |
| Assurance vieillesse (CNAV) | 255 M€ (+18 %), dont 223 M€ évités et 31 M€ mis en recouvrement ; fraudes principales : résidence, ressources, paiements, situation familiale | 2025 | Idem | V |
| Urssaf, travail dissimulé | 1,503 Md€ redressés (contre 1,586 Md€ en 2024) ; 100 M€ recouvrés | 2025 | Idem | V |
| MSA | environ 67 M€ détectés ou recouvrés | 2025 | Idem | V |

**Attention à la lecture du titre de Bercy ("plus de 20 milliards")** : il additionne le fiscal (17,1 Md€) et le social (3 Md€). Le social représente environ 15 % de ce total [V, calcul].

**Autre lecture.** Un think tank (Ifrap) recalcule 17,5 Md€ de fraude estimée en 2024 avec un périmètre différent (titre de son article). À traiter comme une lecture alternative [S].

### 5.2 Indicateurs dérivés (calculs indicatifs)

| Ratio | Calcul | Résultat | Réserve |
|-------|--------|----------|---------|
| Rendement du recouvrement Urssaf (travail dissimulé) | 100 / 1 503 | environ 6,7 % | Montants 2025, périmètre Urssaf seul |
| Recouvré / détecté (HCFiPS) | 680 M€ / 2 Md€ | environ 34 % | Année de référence probablement 2024 |
| Détecté / estimé | 3,1 Md€ / 14 Md€ | environ 22 % | Périmètres et années non strictement identiques |
| Part des fraudes évitées à la CNAV | 223 / 255 | environ 87 % | Dépend de la définition de "fraude évitée" |
| Part des professionnels de santé dans les montants CNAM | 621 M€ / 723 M€ | environ 86 % (Bercy indique 84 %) | Arrondis et périmètre (dont "évités") à vérifier |

### 5.3 Fraude documentaire et SANDIA

- **Rôle du SANDIA** : il attribue les numéros d'inscription au répertoire aux personnes non nées en France, à la demande des organismes de sécurité sociale ; il n'est pas accessible au public [V, page AFE 2022].
- **Volume** : environ 18 millions de numéros attribués (réponse ministérielle de la 15e législature) [V].
- **Estimation Prats** : 1,8 million de numéros attribués sur faux documents, chiffrés par lui à 14 Md€ (rapportés par l'Ifrap) [S/D].
- **Contre-estimation** : fourchette de 245 M€ à 1,17 Md€ (Sénat, rapport Vanlerenberghe, 2019, relayée par l'Ifrap) [S].
- **Position du gouvernement (2019-2020)** : le chiffre de 1,8 million ne correspond pas à des cas de fraude avérés ; un numéro ne suffit pas à lui seul à percevoir des prestations ; dans la plupart des anomalies d'une campagne de contrôle interne, il n'y avait pas d'intention frauduleuse [V, déclaratif d'un acteur].
- **Dernier audit identifié** : 2018, avec la police aux frontières (DCPAF) [V].
- **Évolution 2026** : un article du projet de loi (28 ter) vise l'obtention frauduleuse d'un NIR : perte du droit à toutes les prestations, fin des droits ouverts sur un numéro provisoire, récupération des sommes versées [V, texte d'amendement adopté, février 2026]. **Sort dans le texte final non vérifié** [A].
- **Aucune estimation 2026 isolée** de la fraude documentaire aux NIR n'a été trouvée.

### 5.4 Notes sur l'audition de Charles Prats (corrections)

| Dans les notes | Correction |
|----------------|------------|
| "Le RN CPS" | RNCPS : répertoire national commun de la protection sociale |
| "33 % (37 M)" | Incohérent. 33 % de 12 M donnent environ 4 M, donc probablement 3,7 M |
| "Cela expliquerait le repoussement de la retraite 49.3" | Lien non établi par les données ; "49.3" est un article de la Constitution, pas un âge |
| "Fabrique de l'assistanat" | Formule de Sarah Knafo, pas de Prats |
| "2,4 M de fantômes" | Chiffre variable selon les prises de parole (1,8 M en 2019, 5 M dans un texte de 2020) |
| "Né à l'étranger" | Inclut des Français ; ce n'est pas "étranger" |
| 86 % de prestations santé | Quasi universel : sans comparaison avec les nés en France, ne distingue rien |

### 5.5 Place des sociologues

- **Vincent Dubois** : la fraude devient un "problème public" en France à partir de 1995 ; politique de contrôle des allocataires ; surcontrôle des plus précaires ; auditionné au Sénat (29 avril 2025) [V/S].
- **Biais de détection** : un score algorithmique élevé place les contrôleurs dans la quasi-obligation de trouver quelque chose ; le profil du fraudeur déduit des cas détectés reflète donc d'abord les cibles du contrôle [S].
- **Limite** : sans échantillon aléatoire, ni la critique ni la défense du contrôle ne se vérifient.
- **Chantiers manquants** : sociologie des fraudes organisées et des fraudes d'entreprises (52 % des montants estimés), entretiens avec des personnes en numéro provisoire, observation des guichets d'immatriculation.

### 5.6 Cadrage : "personnes racisées" contre "État"

| Cadrage | Arguments et éléments | Limites |
|---------|----------------------|---------|
| **Faute des individus (étrangers, nés à l'étranger)** | Prats et Knafo : fraude documentaire, "assistanat", fin de prestations non contributives pour les étrangers (15 à 20 Md€ d'économies annoncées dans le livre) [D] | Chiffres contestés ; catégorie "né à l'étranger" ambiguë ; pas de comparaison aux nés en France |
| **Faute du système** | HCFiPS : prévenir en amont ; règles illisibles ; solidarité à la source pour réduire les erreurs déclaratives [V/S] | La prévention ne dit rien de la fraude organisée |
| **Surcontrôle de la précarité** | Défenseur des droits : présomption de discrimination indirecte liée à la vulnérabilité économique ; familles monoparentales : 36 % des vérifications pour 16 % des bénéficiaires ; recours de 15 organisations au Conseil d'État [V/S] | Concerne la précarité, pas l'origine |
| **Fraude des entreprises** | 52 % des montants estimés ; travail dissimulé redressé 1,5 Md€ mais 100 M€ recouvrés [V] | Détecter est plus difficile que sur les prestations |
| **Non-recours** | RSA : environ 34 % de non-recours, 2,25 Md€ par an [S] | À recouper avec la DREES |

**Lecture :** le clivage utile n'est pas "personnes contre État" mais **où l'on place la présomption de suspicion** : sur l'usager, ou sur la conception du système. Les statistiques ethniques étant interdites en France, un ciblage fondé sur l'origine est difficile à documenter par les chiffres ; les sources trouvées ne le démontrent pas ni ne l'infirment.

---

## 6. KPI

### 6.1 KPI disponibles aujourd'hui (voir tableau 5.1)

À suivre chaque année : fraude estimée, détectée, évitée, redressée, recouvrée, par branche et par type d'auteur.

### 6.2 KPI contextuels

| Indicateur | Valeur | Source | Niveau |
|------------|--------|--------|--------|
| Contrôles CAF | 31,5 M en 2024 ; 32,4 M en 2022 dont 134 652 sur place ; 378 M€ de rappels de droits dus aux allocataires (2022) | CNAF via presse et dossier d'associations | S/D |
| Scores de risque CAF | plus de 13 M de scores par mois pour plus de 32 M de personnes | Associations requérantes | D |
| Non-recours RSA | environ 34 % ; 2,25 Md€ | Presse spécialisée | S |
| Familles monoparentales | 36 % des vérifications, 16 % des bénéficiaires | Presse | S |
| Numéros attribués par le SANDIA | environ 18 M | Réponse ministérielle | V |
| Attente de la loi 2026 | 1,5 à 2 Md€ | Presse (LCP) | S |
| Articles critiqués devant le Conseil constitutionnel | 11 sur 115 | Presse spécialisée | S |

### 6.3 KPI à construire (non disponibles)

| KPI proposé | Définition | Données nécessaires | Pourquoi |
|-------------|------------|---------------------|----------|
| Taux d'anomalies critiques à l'immatriculation | Part de dossiers du SANDIA en anomalie critique sur échantillon aléatoire, avec intervalle de confiance | Audit annuel aléatoire | Fermer le trou de mesure |
| Délai médian d'attribution d'un NIR définitif | Médiane en jours, par pays d'origine et type de pièce | Données CNAV | Mesurer le coût pour la bonne foi |
| Part de dossiers restant en NIR provisoire plus de X mois | Pourcentage et ancienneté | Données CNAV | Éviter les zones d'attente durables |
| Taux de contestation réussie | Part des indus annulés après contestation ou recours | Caisses, médiation | Mesurer les faux positifs |
| Part des contrôles par déclencheur | Score, aléatoire, signalement, croisement de fichiers | Caisses | Mesurer le biais de détection |
| Taux de décès non déclarés détectés | Comparaison avec le fichier INSEE des décès | Croisement caisses et INSEE | Distinguer existence et identité |
| Rendement par agent | Montants détectés par équivalent temps plein | ETP et montants | Rapporter les moyens aux résultats |
| Ratio recouvré sur détecté par branche | Pourcentage, série annuelle | Caisses | Efficacité de la chaîne complète |
| Taux de non-recours | Éligibles non bénéficiaires | DREES, CNAF | Contrepoids symétrique |
| Taux d'erreur de versement global | Trop-perçus, non-versements, non-recours | Caisses, DREES | Mesure de la justesse, pas seulement de la fraude |

---

## 7. Analyse constitutionnelle : responsabilité de l'État et moyens mis en place

*Lecture analytique du texte intégral de la Constitution (version en vigueur, révision du 8 mars 2024). Ce n'est pas un avis juridique.*

### 7.1 Les dispositions utiles

| Disposition | Ce qu'elle dit (paraphrase) | Application au sujet | Niveau |
|-------------|-----------------------------|----------------------|--------|
| **Art. 1** | La République est sociale et assure l'égalité devant la loi sans distinction d'origine, de race ou de religion | Cadre de la question des contrôles ciblés et des stéréotypes | V |
| **Art. 20** | Le Gouvernement détermine et conduit la politique de la nation, dispose de l'administration, et est responsable devant le Parlement | L'organisation des caisses, des procédures et des moyens relève de l'exécutif | V |
| **Art. 21** | Le Premier ministre assure l'exécution des lois et exerce le pouvoir réglementaire | Décrets, instructions et conventions d'objectifs qui fixent les procédures de contrôle | V |
| **Art. 24** | Le Parlement vote la loi, contrôle l'action du Gouvernement et évalue les politiques publiques | Responsabilité partagée : le Parlement évalue aussi (commission d'enquête de 2020) | V |
| **Art. 34** | La loi fixe les règles sur l'état et la capacité des personnes, sur les délits et peines, et détermine les principes fondamentaux de la sécurité sociale ; les LFSS fixent les conditions générales d'équilibre | L'identité (état civil), les sanctions et le financement relèvent du législateur | V |
| **Art. 37-1** | La loi et le règlement peuvent comporter des dispositions expérimentales, pour un objet et une durée limités | Base utile pour tester un audit aléatoire ou un dispositif d'immatriculation avant généralisation | V |
| **Art. 47-1** | Vote des lois de financement de la sécurité sociale | Cadre budgétaire de la lutte contre la fraude | V |
| **Art. 47-2** | La Cour des comptes assiste le Parlement et le Gouvernement dans le contrôle de l'application des LFSS et l'évaluation des politiques publiques ; les comptes publics doivent être réguliers et sincères | Lieu naturel d'un audit indépendant des chiffres de fraude | V |
| **Art. 51-2** | Commissions d'enquête | Outil utilisé en 2020 sur la fraude aux prestations sociales | V |
| **Art. 61 et 61-1** | Contrôle de constitutionnalité a priori et par QPC | Décision 2026-904 DC ; QPC futures | V |
| **Art. 71-1** | Le Défenseur des droits veille au respect des droits par les administrations et les organismes chargés d'une mission de service public | Algorithme de la CNAF et surcontrôle des précaires | V |
| **Art. 55** | Les traités ont une autorité supérieure à la loi | Conventions bilatérales de sécurité sociale, pertinentes pour vérifier l'état civil à l'étranger | A (lien à instruire) |
| **Déclaration de 1789, art. 15** | La société peut demander compte à tout agent public de son administration | Fondement de la reddition de comptes sur l'efficacité des contrôles | A (texte non relu en session) |
| **Préambule de 1946** | Droit à la protection de la santé et à la sécurité matérielle | Contrepoids : les contrôles ne doivent pas priver de soins essentiels | A (texte non relu en session) |

### 7.2 Ce que dit la jurisprudence récente (décision 2026-904 DC)

- Le Conseil constitutionnel reconnaît un **objectif de valeur constitutionnelle de lutte contre la fraude en matière de protection sociale** [V].
- Il a validé l'essentiel de la loi (115 articles, 11 critiqués), notamment les suspensions conservatoires de prestations, **sous réserve** de garantir des moyens convenables d'existence (chômage) et l'accès aux soins essentiels (prestations sociales) [S].
- Il a censuré une disposition de l'article 21 sur le recours à un intermédiaire pour les échanges de données entre assurance maladie et mutuelles, ainsi que trois "cavaliers législatifs", dont un numéro d'identification pour les associations et fonds [S].
- Des sources secondaires indiquent aussi qu'il a jugé insuffisantes, pour l'une des mesures, les garanties de vie privée et de secret médical [S, à vérifier dans la décision].
- **Précédent utile sur la carte Vitale numérique :** sa généralisation, votée dans la LFSS 2025, a été censurée comme cavalier (absence d'incidence directe sur les comptes), ce qui a imposé une proposition de loi distincte [S]. Cet épisode montre un défaut de procédure législative (la mesure n'était pas à la bonne place), pas un jugement sur la fraude.

### 7.3 Qui répond de quoi (matrice de responsabilités)

| Acteur | Rôle dans la chaîne | KPI qui lui est naturellement attribuable |
|--------|---------------------|-------------------------------------------|
| Parlement | Vote la loi et les LFSS, évalue, crée des commissions d'enquête | Nombre d'évaluations, suivi des recommandations |
| Gouvernement | Conduit la politique, dispose de l'administration, fixe les moyens | Moyens (ETP, budget), délais de mise en œuvre |
| Direction de la sécurité sociale (DSS) | Tutelle des caisses et conventions d'objectifs et de gestion (COG 2023-2027 intégrant les mesures du plan anti-fraude) [S] | Atteinte des objectifs de COG |
| Caisses (CNAF, CNAM, CNAV, Urssaf, MSA) | Exécution : immatriculation, contrôles, détection, recouvrement | Détecté, évité, recouvré, délais, faux positifs |
| CNAV, SANDIA | Attribution des numéros pour les nés à l'étranger [V] | Anomalies critiques, délai d'attribution |
| MICAF, Office national anti-fraude | Coordination interministérielle et judiciarisation [S] | Dossiers judiciarisés, coordination |
| Cour des comptes | Certification et évaluation | Réserves, recommandations suivies |
| HCFiPS | Estimation annuelle de la fraude | Qualité et stabilité de l'estimation |
| CNIL, Défenseur des droits | Protection des données, droits des usagers | Décisions, réclamations |
| Conseil constitutionnel, Conseil d'État | Contrôle de constitutionnalité, légalité | Décisions rendues |

### 7.4 Ce que l'analyse permet d'avancer sur la responsabilité de l'État

**Éléments qui étayent un grief envers le système (à instruire, pas à conclure) :**

1. Un trou de mesure : dernier audit d'immatriculation identifié en 2018 [V].
2. Un écart massif entre estimé et recouvré : 14 Md€ estimés, environ 2 Md€ détectés, 680 M€ recouvrés ; côté travail dissimulé, 1,5 Md€ redressés pour 100 M€ recouvrés [V].
3. Des travaux parlementaires anciens jugeant les modalités d'attribution du NIR insuffisamment sécurisées [S].
4. Une mise en œuvre législative heurtée (carte Vitale numérique censurée en 2025) [S].
5. Un surcontrôle documenté des précaires par un outil de ciblage de l'administration (CNAF) [V/S].
6. Une fraude des entreprises majoritaire dans les montants estimés mais difficile à détecter [V].

**Garde-fous à garder pour que l'analyse tienne :**

- La Constitution **n'impose pas d'obligation de résultat** sur la fraude ; l'objectif est jurisprudentiel et s'équilibre avec les droits.
- La responsabilité est **partagée** : le Parlement vote et évalue, les caisses exécutent, les fraudeurs restent responsables de leurs actes.
- La responsabilité pénale des ministres (art. 68-1) vise des crimes ou délits, pas la performance administrative.
- L'État a aussi progressé : détections doublées depuis 2021, nouvelles structures, nouvelle loi [V].
- "Moyens" signifie ETP, budgets, outils : **ces chiffres n'ont pas été trouvés** ; il faut les obtenir avant d'affirmer qu'ils manquent.

---

## 8. Procédures et dispositifs depuis 2020

| Date | Dispositif | Nature | Niveau |
|------|-----------|--------|--------|
| 8 sept. 2020 | Rapport de la commission d'enquête sur la fraude aux prestations sociales (rapport n° 3300) | Constat parlementaire ; un rapport ultérieur note que plusieurs constats de 2020 n'avaient pas encore trouvé de réponse adéquate | V |
| 2020 | Création de la MICAF (remplace la DNLF) | Coordination interministérielle | A |
| 2022-2024 | Feuille de route triennale de la stratégie nationale anti-fraude au budget de l'UE ; suite 2025-2027 | Coordination, fonds européens | V |
| 1er juin 2023 | Plan interministériel en 35 mesures (2023-2027) | Plan | V |
| 26 juil. 2023 | Décret 2023-663 élargissant le périmètre de la MICAF | Réglementaire | S |
| 5 déc. 2023 | Cellule de veille interministérielle anti-fraude aux aides publiques | Opérationnel | S |
| 18 mars 2024 | Décret 2024-235 créant l'Office national anti-fraude (10 unités territoriales) | Réglementaire | S |
| Sept. 2024 | Rapport du HCFiPS sur la lutte contre la fraude sociale | Évaluation | V |
| 1er mars 2025 | Généralisation de la solidarité à la source | Réduction des erreurs déclaratives | S |
| 14 mars 2025 | Point d'étape du plan (facturation électronique, base interministérielle de RIB frauduleux) | Évaluation du plan | V |
| 2025 | Mesure LFSS sur la carte Vitale numérique, censurée comme cavalier | Législatif | S |
| Nov. 2025 | Application carte Vitale ouverte à tous les assurés (activation par France Identité ou parcours biométrique) | Identité numérique | V |
| Janv. 2026 | Note annuelle HCFiPS : 14 Md€ | Évaluation | V |
| 20 févr. 2026 | Amendement adopté sur l'article 28 ter (NIR obtenu frauduleusement) | Législatif | V |
| 8 avr. 2026 | Résultats 2025 publiés par Bercy | Communication de résultats | V |
| 5 et 11 mai 2026 | Adoption de la loi (Assemblée puis Sénat) | Législatif | S |
| 18 juin 2026 | Décision 2026-904 DC | Contrôle de constitutionnalité | V |
| 25-26 juin 2026 | Promulgation et publication au Journal officiel | Législatif | V/S |
| Fin 2026 | Appli carte Vitale comme moyen d'authentification à distance (autorisations à partir de juin 2026) | Identité numérique | V/S |
| 2027-2028 | Exploitation des données de facturation électronique contre la fraude aux prestations sous conditions de ressources | Plan 2023 | V |

**Point biométrie.** Une proposition de loi de septembre 2025 évoque l'abandon d'une carte Vitale biométrique en raison d'un coût élevé (plus d'un milliard d'euros, texte tronqué dans l'extrait lu) et prévoit une carte numérique **sans biométrie** [V, à relire en entier]. La biométrie intervient aujourd'hui à l'activation de l'appli (reconnaissance faciale comparée à la pièce d'identité) [V/S]. Je n'ai pas trouvé de projet de biométrisation du numéro de sécurité sociale lui-même.

---

## 9. Spécifications fonctionnelles pour valoriser et croiser les données

Objectif : un tableau de bord qui rend les chiffres lisibles **sans les déformer**. Principe directeur : chaque chiffre affiche sa définition, son dénominateur, son incertitude et sa source.

| # | Module | Valeur apportée | Détail fonctionnel | Garde-fou |
|---|--------|-----------------|--------------------|-----------|
| F1 | **Entonnoir "estimé → détecté → évité → redressé → recouvré"** | Montre l'écart entre fraude supposée et fraude traitée | Graphique en cascade par branche (Famille, Maladie, Vieillesse, Urssaf, MSA) et par année | Afficher l'année et le périmètre de chaque barre |
| F2 | **Sélecteur de définition** | Évite de comparer des choses différentes | Bascule fraude / erreur / fraude évitée / manque à gagner, avec infobulle de glossaire | Alerte "périmètre différent" quand deux chiffres ne se comparent pas (ex. 14 Md€ Prats et 14 Md€ HCFiPS) |
| F3 | **Registre des sources** | Traçabilité | Pour chaque chiffre : source, date, type (officiel, estimé, détecté, presse, partisan), niveau de confiance, lien, version | Les chiffres partisans sont étiquetés comme tels, jamais mélangés aux officiels |
| F4 | **Comparateur "qui dit quoi"** | Rend visible les écarts entre acteurs | Tableau côte à côte : Prats, Sénat, HCFiPS, gouvernement, associations, sur le même indicateur | Afficher les fourchettes (bas, haut) plutôt qu'un point unique |
| F5 | **Vue fourchette d'incertitude** | Évite la fausse précision | Graphique en éventail : ex. fraude documentaire de 245 M€ à 1,17 Md€ contre l'estimation de Prats | Toujours afficher les hypothèses |
| F6 | **Dénominateurs et taux** | Rend les chiffres comparables | Bascule absolu, par bénéficiaire, par agent, par habitant, avec intervalle de confiance quand c'est un échantillon | Ne jamais afficher un pourcentage sans effectif |
| F7 | **Filtres croisés** | Croiser les dimensions | Branche, type d'auteur (assurés, entreprises, professionnels de santé), nature (documentaire, ressources, résidence), année, territoire | Prévenir du risque de lecture écologique quand on croise des données territoriales |
| F8 | **Contrepoids "non-recours" et "faux positifs"** | Symétrie de lecture | Superposer fraude détectée, rappels de droits, non-recours, contestations réussies | Les deux colonnes toujours côte à côte |
| F9 | **Frise des procédures** | Relier actions publiques et résultats | Chronologie 2020 à 2027 (section 8) superposée aux séries de KPI | Mention permanente "corrélation, pas causalité" |
| F10 | **Carte constitutionnelle** | Relier textes, acteurs et dispositifs | Graphe articles de la Constitution, institutions, dispositifs, KPI attribuables (matrice 7.3) | Distinguer ce qui est écrit dans le texte de ce qui est jurisprudence |
| F11 | **Détecteur de titres trompeurs** | Anti-désinformation | Règles : somme de périmètres (fiscal plus social), taux sans dénominateur, détecté présenté comme estimé | Message neutre expliquant le calcul |
| F12 | **Export et partage** | Réutilisation | CSV et JSON, liens permanents par graphique, mode impression, citation prête à copier | Licence ouverte et date d'extraction visibles |

**Exigences transverses**

- **Accessibilité** : RGAA/Opquast, alternatives textuelles aux graphiques, tableaux de données accessibles, glossaire en langage simple.
- **Design non manipulateur** (ligne ANTIDOTE) : pas de rouge alarmiste par défaut, axes non tronqués, incertitudes visibles, ligne systématique "ce que ce chiffre ne dit pas".
- **Modèle de données minimal** : entités *Indicateur*, *Source*, *Mesure publique*, *Acteur*, *Texte juridique*, *Jeu de données*, avec relations Indicateur-Source (n,n), Mesure-Acteur (n,n), Texte-Mesure (n,n). Prototypage possible dans Airtable ou Notion avant de construire la page.

---

## 10. Jeux de données et API

### 10.1 Pistes identifiées

| Jeu / API | Producteur | Intérêt pour le sujet | Clés de jointure | Vérification |
|-----------|------------|-----------------------|------------------|--------------|
| **Fichier des personnes décédées** | INSEE, sur data.gouv.fr | Existence : repérer les décès (depuis 1970) pour contextualiser la question des "fantômes" | Nom, prénom, date et commune de naissance | [V] ; l'INSEE précise que le fichier ne peut pas servir à certifier le statut vital d'une personne |
| **API de recherche des personnes décédées** (réutilisation communautaire de MatchID) | Communauté open source, avec la DNUM | Recherche et traitement en masse du fichier INSEE | Idem | [V] (réutilisation, à examiner avant usage) |
| **API données ouvertes Urssaf (Open Urssaf)** | Urssaf | Auto-entrepreneurs par secteur ou département, déclarations préalables à l'embauche par région, procédures collectives, effectifs : contexte pour la fraude aux cotisations | Département, région, secteur, année | [V] |
| **Tableau de suivi de publication (engagements et demandes)** | data.gouv.fr (DINUM) | Repère les API annoncées ou à accès restreint (CNAF, CNAM, micro-entreprises) | Aucune (veille) | [V] ; certaines API listées sont à accès restreint ou non disponibles |
| **Indicateurs CNAF open data** (ex. part des prestations dans les ressources des foyers par EPCI) | CNAF | Contexte territorial de la dépendance aux prestations | EPCI, année | [V] (publication de décembre 2019, à vérifier pour mises à jour) |
| **Données ouvertes du Conseil constitutionnel** | Conseil constitutionnel | Analyse des décisions et dispositions déclarées conformes | Numéro de décision | [V] (lien en pied de page du site) |
| **QPC 360** | Conseil constitutionnel | Recherche des QPC par mots-clés | Numéro de décision, articles | [V] |
| Base Sirene | INSEE | Entreprises (lien avec fraude des entreprises) | SIREN | [A] |
| Données DREES (minima sociaux, non-recours) | DREES | Contrepoids non-recours | Année, département | [A] |
| Données ouvertes de l'Assurance maladie | CNAM | Dépenses et offre de soins par territoire | Département, année | [A] |
| Légifrance, Assemblée nationale, Sénat (données ouvertes) | DILA, assemblées | Textes, questions écrites, rapports | Numéro de texte | [A] |
| Rapports HCFiPS et Cour des comptes | HCFiPS, Cour des comptes | Séries et annexes sur les taux de fraude | Année, organisme | [V] pour le HCFiPS 2026 |

### 10.2 Comment explorer data.gouv.fr toi-même

La page de recherche (`https://www.data.gouv.fr/datasets/search?q=fraude&last_update_range=last_3_years`) refuse l'accès automatisé. Deux voies :

1. **Navigateur** : ouvrir la page, puis tester les requêtes : `fraude`, `indus`, `contrôle`, `RNCPS`, `immatriculation`, `travail dissimulé`, `décès`, `non-recours`, `minima sociaux`, `bénéficiaires département`. Trier par date de mise à jour.
2. **API du catalogue** : l'endpoint de recherche de jeux de données de data.gouv.fr (de la forme `https://www.data.gouv.fr/api/1/datasets/?q=fraude`) renvoie du JSON. Format exact et filtres à vérifier dans la documentation de l'API [A].

### 10.3 Croisements possibles et limites

| Croisement | Faisable en open data ? | Intérêt | Limite |
|------------|-------------------------|---------|--------|
| Décès (INSEE) et bénéficiaires de prestations | **Non** au niveau individuel : les fichiers de bénéficiaires ne sont pas ouverts. Possible seulement dans les caisses | Existence | Le croisement individuel relève des organismes (RNCPS) |
| Open Urssaf (auto-entrepreneurs par département) et redressements | Partiel | Contexte du travail dissimulé | Redressements non ouverts par territoire (à vérifier) |
| Frise des procédures et séries KPI annuelles | Oui | Lecture avant et après | Pas de causalité |
| Décisions du Conseil constitutionnel et articles de la Constitution | Oui | Carte de la responsabilité | Interprétation juridique requise |
| Prestations par EPCI (CNAF) et indicateurs de précarité | Oui | Contexte | Lecture écologique : ne pas inférer des individus |

**Limite structurante :** l'open data permet de **contextualiser et comparer**, pas de **détecter des fraudes individuelles**. Les affirmations sur des "fantômes" ne peuvent donc pas être vérifiées avec des données ouvertes seules ; elles exigent des audits aléatoires menés par les organismes.

---

## 11. Pistes, instructions et conseils pour poursuivre la recherche

### 11.1 Protocole en cinq étapes

1. **Définir** : fraude, erreur, fraude évitée, manque à gagner (noter la définition de chaque source).
2. **Dater** : année des données, date de publication.
3. **Qualifier la source** : officielle, secondaire, partisane (légende de ce rapport).
4. **Normaliser** : dénominateur, intervalle, périmètre.
5. **Croiser** : au moins deux sources indépendantes, dont une qui contredit.

### 11.2 Fiche d'affirmation (à dupliquer pour chaque chiffre)

| Champ | Contenu |
|-------|---------|
| Affirmation | Texte exact, reformulé |
| Qui l'avance | Acteur, date, contexte |
| Type de donnée | Échantillon aléatoire / cas détectés / extrapolation / opinion |
| Définition utilisée | |
| Dénominateur | |
| Sources corroborantes | |
| Sources contradictoires | |
| Coût pour la bonne foi | |
| Ce que le chiffre ne dit pas | |
| Niveau de confiance | V / S / D / A |

### 11.3 Obtenir ce qui manque

- **Demande CADA** à la CNAV et à la DSS : audits d'immatriculation (2018 et suivants), résultats des campagnes de contrôle interne du SANDIA, méthode d'estimation de la fraude documentaire.
- **Question écrite** via un parlementaire sur : effectifs affectés à l'immatriculation et à la lutte contre la fraude documentaire, date du dernier audit, délai moyen d'attribution du numéro définitif.
- **Entretiens** (avec consentement et pseudonymisation) : agents d'immatriculation, médiateurs de caisses, associations d'accès aux droits, expatriés en attente de numéro, sociologues du contrôle.
- **Rapports à lire** : note annuelle du HCFiPS (annexes sur les taux de fraude), rapport de la commission d'enquête de 2020, travaux de la Cour des comptes sur la sécurité sociale, décisions du Défenseur des droits sur l'algorithme de la CNAF.

### 11.4 Utiliser QPC 360 et le site du Conseil constitutionnel

- Ouvrir la **recherche avancée** de QPC 360 et tester : `fraude`, `prestations sociales`, `numéro d'inscription au répertoire`, `droit de communication`, `suspension` ; filtrer par date et type de décision.
- Consulter les **tables analytiques** et le **recueil des dispositions déclarées conformes** pour retrouver les articles du code de la sécurité sociale déjà examinés.
- Suivre la page **Actualités** du Conseil constitutionnel pour les nouvelles décisions et les audiences.
- Surveiller l'**agenda des audiences QPC** (affaires 2026-1229 à 2026-1232 en octobre 2026) pour voir si l'une touche au sujet (non vérifié).

### 11.5 Conseils de cadrage et de communication

- Présenter **trois lectures côte à côte** (individus, système, entreprises), plutôt que choisir un camp.
- Toujours accompagner un chiffre de fraude d'un **chiffre de contrepoids** (non-recours, faux positifs, rappels de droits).
- Éviter "fantômes", "assistanat", "racisés" comme catégories analytiques non définies : les remplacer par des variables observables (numéro provisoire, résidence, état civil).
- Pour une publication : séparer clairement **faits vérifiés**, **estimations**, **positions d'acteurs**.

### 11.6 Veille

| À surveiller | Fréquence | Pourquoi |
|--------------|-----------|----------|
| Note annuelle HCFiPS (prochaine : début 2027) | Annuelle | Mise à jour des 14 Md€ |
| Résultats annuels de Bercy | Annuelle (avril) | Détecté et redressé |
| Décrets d'application de la loi du 25 juin 2026 | Continue | Mise en œuvre réelle |
| Recours devant le Conseil d'État sur l'algorithme de la CNAF | Continue | Jurisprudence sur le ciblage |
| Décisions QPC liées au code de la sécurité sociale | Mensuelle | Évolution des garanties |
| Rapports de la Cour des comptes sur la sécurité sociale | Annuelle | Évaluation indépendante |

---

## 12. Limites et angles morts

- La vidéo de l'audition de Prats n'a pas été visionnée : les chiffres viennent de tes notes et ont été corrigés par recoupement.
- La page de recherche data.gouv.fr bloque l'accès automatisé : les jeux de données listés sont des **pistes**, pas un inventaire exhaustif.
- Beaucoup de chiffres viennent de sources secondaires ou militantes (associations, think tanks, presse) : ils sont étiquetés comme tels.
- Les années ne sont pas toujours alignées (2024, 2025, 2026) ; les ratios sont **indicatifs**.
- Aucun chiffre sur les **effectifs** et **budgets** de la lutte contre la fraude : la partie "moyens" de la section 7 reste donc incomplète.
- Le sort de l'article 28 ter dans le texte promulgué n'est pas vérifié.
- Les statistiques ethniques sont interdites en France : le cadrage "racisés" ne peut pas être testé par des données quantitatives usuelles. Les travaux qualitatifs existent mais n'ont pas été explorés en profondeur ici.
- Échantillon de sociologues limité (Vincent Dubois principalement).
- Pas de comparaison internationale, et comparaison fraude sociale et fraude fiscale limitée aux chiffres de Bercy et du HCFiPS.
- Cette analyse constitutionnelle est une lecture, pas un avis juridique. Les extraits de la Déclaration de 1789 et du Préambule de 1946 sont cités de mémoire et à relire sur le site du Conseil constitutionnel.

---

## 13. Sources consultées

**Officielles ou primaires**

- Ministère de l'Économie : communiqué du 8 avril 2026, "Fraudes fiscales et sociales : plus de 20 milliards d'euros détectés et redressés en 2025" : https://presse.economie.gouv.fr/fraudes-fiscales-et-sociales-plus-de-20-milliards-deuros-detectes-et-redresses-en-2025/
- Conseil constitutionnel : Constitution du 4 octobre 1958 (texte intégral) : https://www.conseil-constitutionnel.fr/le-bloc-de-constitutionnalite/texte-integral-de-la-constitution-du-4-octobre-1958-en-vigueur
- Conseil constitutionnel : décision n° 2026-904 DC du 18 juin 2026 : https://www.conseil-constitutionnel.fr/decision/2026/2026904DC.htm
- QPC 360 : https://qpc360.conseil-constitutionnel.fr/
- HCFiPS : note annuelle de suivi et d'évaluation des fraudes sociales (janvier 2026) : https://www.strategie-plan.gouv.fr/ (infographie et note, publiées le 13 janvier 2026)
- Assemblée nationale : amendement 906 à l'article 28 ter du projet de loi n° 2250 : https://www.assemblee-nationale.fr/dyn/17/amendements/2250/AN/906.pdf
- Assemblée nationale : questions écrites sur la fraude documentaire (SANDIA) : https://www.assemblee-nationale.fr/dyn/15/questions/QANR5L15QE17171.pdf et https://www.assemblee-nationale.fr/dyn/15/questions/QANR5L15QE15576.pdf
- Assemblée nationale : proposition de loi n° 1815 sur la carte Vitale dématérialisée : https://www.assemblee-nationale.fr/dyn/17/textes/l17b1815_proposition-loi.pdf
- Assemblée des Français de l'Étranger : question orale sur le SANDIA : https://www.assemblee-afe.fr/question/question-orale-sandia/
- Sénat : intervention de Vincent Dubois (29 avril 2025) : https://www.senat.fr/rap/r24-895/r24-89525.html
- ministère de l'Économie : plan de lutte contre les fraudes aux finances publiques : https://www.economie.gouv.fr/agircontrelesfraudes
- data.gouv.fr : fichier des personnes décédées, API Open Urssaf, tableau de suivi de publication : https://www.data.gouv.fr/dataservices/api-donnees-ouvertes-de-lurssaf et https://www.data.gouv.fr/suivi-de-publication/engagements-et-demandes
- Esante.gouv.fr : doctrine de l'appli carte Vitale : https://esante.gouv.fr/doctrine/appli-carte-vitale

**Secondaires (à recouper)**

- LCP, Banque des Territoires, Actu-Juridique, Deloitte Société d'Avocats : comptes rendus de la décision 2026-904 DC et de la loi du 25 juin 2026.
- Previssima : "14 milliards de fraude sociale : qui fraude vraiment, et pour combien ?"
- Ifrap : analyses de la fraude sociale (dont fraude documentaire et estimations Prats / Sénat).
- Next.ink, Amnesty France, La Quadrature du Net, Fondation Abbé Pierre : algorithme de notation de la CNAF.
- Le Monde Informatique : publication du code source des programmes de scoring de la CNAF et constats du Défenseur des droits.
- Sud Radio, Boursedirect (AFP) : présentation du livre *Le casse du siècle*.
- La Vie des idées, revue CREMIS : recensions de *Contrôler les assistés* (Vincent Dubois).

**Partisanes ou militantes (positions, non faits)**

- Polémia : recension du livre de Sarah Knafo.
- Amendement sénatorial COM-80 (groupe écologiste) citant le HCFiPS.
- Communiqués d'associations requérantes devant le Conseil d'État.
