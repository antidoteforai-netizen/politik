# Découverte UX : refonte de l'accueil autour de « Que puis-je faire ? »

Date : 2026-10-21. Statut : brouillon relu par l'équipe Politik. Périmètre : amélioration d'un site existant (page d'accueil et rubrique pratique).

## 1. Problème

- **Problème** : un visiteur arrive avec une situation (« mon propriétaire garde ma caution », « je viens d'être licencié ») et trouve des chiffres d'État, pas une marche à suivre.
- **Qui** : toute personne qui cherche une démarche ou un droit, avant de chercher un chiffre. Les profils déjà documentés restent valables (citoyenne curieuse, journaliste, décideur, commerçant, salarié, freelance, immigrant, agent de caisse) : ce qui change, c'est l'entrée par l'intention.
- **Alternatives aujourd'hui** : service-public.gouv.fr (fiches complètes, longues), moteurs de recherche, assistants d'IA (qui peuvent répondre avec aplomb et se tromper).
- **Pourquoi elles échouent** : les fiches officielles répondent bien mais supposent de savoir quoi chercher ; l'IA ne cite pas toujours sa source ; Politik, lui, n'oriente pas.
- **Indice de départ** : l'étude « Legal Guidance in the Wild » (arXiv 2610.25159, octobre 2026) sur 2 122 conversations d'IA en anglais : 52 % des demandes juridiques sont du type « quels sont mes droits et mes options ? » (62 % en comptant les demandes secondaires), 21 % « explique-moi », 13 % « comment faire concrètement ». Limites : échantillon enrichi (pas une mesure de fréquence), étiquettes posées par une IA, public non français. C'est une hypothèse de travail, pas une preuve pour la France.
- **Périmètre** : amélioration d'un site existant.

## 2. Personas (priorités)

1. **La personne avec une situation** (primaire) : adulte, souvent sur téléphone, pressé, veut savoir quoi faire et vers qui aller. Preuve : hypothèse à valider (étude citée ci-dessus).
2. **La curieuse de données** (secondaire) : veut vérifier un chiffre ou comprendre un dossier. Preuve : personas du 20 octobre.
3. **Le relais** (tertiaire) : journaliste, élu, agent d'accueil qui renvoie vers Politik. Preuve : personas du 20 octobre.

## 3. Jobs à accomplir

| Intention | Quand… | Je veux… | Pour pouvoir… |
|---|---|---|---|
| Comprendre | un sujet public revient dans l'actualité | une explication courte et sourcée | me faire ma propre idée |
| Connaître mes droits | j'ai un litige, un doute sur ce que la loi m'accorde | la règle officielle, en une phrase | savoir si j'ai raison de m'inquiéter |
| Faire une démarche | je dois agir (aide, inscription, réclamation) | le bon site officiel et ce qu'il faut préparer | agir sans me tromper de guichet |
| Vérifier un chiffre | un chiffre circule | sa source, sa date, son niveau de confiance | le croire ou le laisser |

Émotionnel : se sentir guidé, pas jugé. Social : ne pas passer pour quelqu'un qui n'a pas compris. Politik **n'est pas un conseil juridique** : il oriente vers la source officielle.

## 4. Parcours

Actuel : arrivée sur l'accueil → hero sur les données publiques → liste de ministères et d'états des lieux → la démarche reste à deviner.

Désiré : arrivée → « Que voulez-vous faire ? » (quatre intentions) → choix d'un sujet (logement, travail, consommation, famille) → trois ou quatre éléments utiles avec lien officiel → bouton « Cette page vous a-t-elle aidé ? ».

Lacunes prioritaires : orientation par intention (forte), contenu pratique sur logement, travail, consommation, famille (forte), mesure de l'utilité (moyenne).

## 5. Mesure (données minimales, sans identifiant)

- **Indicateur central (North Star)** : part des visites de l'accueil qui débouchent sur un clic utile (une intention ouverte, une page pratique ou un lien vers un site officiel). Mesure approchée : (événements d'intention + événements de sortie) ÷ pages vues de l'accueil. Valeur de départ : inconnue, à établir sur 30 jours.
- **Garde-fous** : taux « Oui » du bouton d'aide par page (on n'interprète pas sous 20 réponses) ; pages par visite (Cloudflare) ; part de trafic mobile.
- **Indicateurs d'entrée** : clics par intention ; clics sur les listes « les plus lues » et « jeux de données les plus téléchargés » ; clics sortants par domaine officiel.
- **Événements** (aucune donnée personnelle, aucun cookie) : envoyés comme pages virtuelles à Cloudflare Web Analytics, sous le préfixe `/__a/` :
  - `/__a/aide/oui/<page>` et `/__a/aide/non/<page>` ;
  - `/__a/intention/<comprendre|droits|demarche|chiffre>` ;
  - `/__a/sortie/<domaine>` pour un clic vers un site officiel ;
  - `/__a/populaire/<demarche|donnees>`.
  Ils ne partent que si la mesure est active : pas en local, pas avec Do Not Track, pas avec le drapeau `no-analytics`.
- **Réserve (testée le 21 octobre 2026)** : Cloudflare compte chaque changement d'adresse comme une page vue, y compris le retour à la vraie adresse. Chaque événement ajoute donc une vue à la vraie page. Correction : vues réelles = vues affichées − nombre d'événements `/__a/` ; et on filtre le préfixe `/__a/` dans le rapport « Chemins ». Le test a été fait avec le script réel de Cloudflare, envoi bloqué ; l'affichage dans le tableau de bord reste à confirmer après déploiement.
- **Qualitatif** : si « Non », un lien pré-rempli vers un signalement GitHub (adresse de la page, pas de texte libre collecté par Politik).
- **Décisions** : si le « Oui » d'une page est sous 60 % avec 20 réponses ou plus → réécrire la page ; si une intention reste sous 5 % des clics → la fusionner ou la reformuler ; si les clics sortants sont proches de zéro → vérifier que les liens sont visibles.

## 6. Principes de conception

1. **Une question d'abord** : l'accueil ouvre sur « Que voulez-vous faire ? », les données viennent ensuite. *Parce que* les demandes sont surtout « que faire ? ». *Ce que cela interdit* : un accueil qui commence par des chiffres.
2. **Orienter, ne pas conseiller** : chaque fiche renvoie à la source officielle, avec la date de lecture. *Interdit* : un avis personnalisé, un chatbot juridique.
3. **Court et vérifiable** : une phrase par droit, un lien par démarche, un niveau V/S/D/A. *Interdit* : un paragraphe sans source.
4. **Utile sur téléphone** : cibles de 44 px, ordre de lecture simple. *Interdit* : une vue qui exige de zoomer.
5. **Mesurer sans pister** : pas de cookie, pas d'identifiant, événements groupés par page.

## 7. Hypothèses et risques

- **Hypothèse non validée** : les visiteurs de Politik se comportent comme les utilisateurs d'IA de l'étude. Validation : 30 jours de mesure ; test avec des lecteurs réels.
- **Risque** : contenu pratique périmé (les règles changent). Mitigation : date de lecture affichée, relecture automatique des listes populaires tous les deux jours, contenu pratique limité à des faits stables et à des liens.
- **Risque** : assimiler Politik à un service d'État. Mitigation : mention « site indépendant, liens vers les sources officielles ».
- **Risque** : mesure par pages virtuelles imprécise. Mitigation : documentée, à vérifier avant d'en tirer des décisions.

## 8. Prochaines étapes

- [x] Écrire les contenus pratiques à partir de fiches officielles lues.
- [x] Refondre l'accueil (intentions, listes les plus consultées, bouton d'aide).
- [ ] Mesurer 30 jours, puis relire ce document.
- [ ] Tester avec cinq personnes sur téléphone.
