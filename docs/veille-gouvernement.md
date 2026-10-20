# Veille sur les sites officiels du Gouvernement

Procédure répétée par la boucle (`/loop`, rythme dynamique). Une itération traite **trois ministères** non encore vérifiés, puis planifie la suivante. But : pour chaque ministère, relever ce qu'un citoyen doit comprendre et connaître, avec source, date et niveau de confiance.

## Source de vérité

- `data/gouvernement.json` : ministères (`ministeres`), autres acteurs (`autres_acteurs`), rattachement aux pages (`pages`), actualités (`actualites`).
- `dashboard/gouvernement.js` : généré par `node scripts/build-gouvernement.mjs`. Ne jamais l'éditer à la main.
- Un ministère est « à traiter » tant que `verifie_le` vaut `null`.

## Une itération

1. Lire `data/gouvernement.json` et choisir les trois premiers ministères (puis l'autre acteur `cyber`) dont `verifie_le` est `null`, dans l'ordre du fichier.
2. Pour chacun, ouvrir **le site officiel** avec le navigateur (outil Playwright : certains sites bloquent les requêtes automatiques, pas un vrai navigateur). Trouver l'adresse officielle en partant d'`info.gouv.fr` ou d'une recherche, jamais de mémoire. Renseigner `site` et `site_verifie_le`.
3. Relever, **uniquement ce qui est lu sur la page** :
   - 2 à 4 informations « à savoir pour les citoyens » : démarche, aide, droit, échéance, numéro utile, changement récent qui touche la vie quotidienne. Formulation en une phrase simple, dans les mots de Politik (pas de copier-coller long), avec `texte`, `url` de la page exacte, `source` (nom du site), `niveau` (`V` si c'est le fait publié par l'institution elle-même, `D` si c'est une annonce ou une position), `lu_le`.
   - jusqu'à 3 actualités récentes (date, titre, résumé d'une phrase, url) à ajouter dans `actualites` avec `ministeres: [id]` et, si une page Politik est directement concernée, `pages`.
4. Si le site est inaccessible ou vide : ne rien inventer, laisser `verifie_le` à `null`, écrire la raison dans `data/gouvernement-veille.log` et passer au suivant.
5. Renseigner `verifie_le` (date du jour) pour chaque ministère traité.
6. Lancer, dans l'ordre : `node scripts/build-gouvernement.mjs`, `node scripts/registre-sources.mjs`, `node scripts/verifier-croisements.mjs`. Corriger jusqu'à « Tout passe ».
7. Mettre à jour `.claude/memory/STATE.md` (ligne « Veille Gouvernement : n/21 ») et `JOURNAL.md` (une entrée par itération).
8. S'il reste des ministères à traiter : planifier la prochaine itération (ScheduleWakeup, 20 à 30 minutes). Sinon, passer au mode « actualités » : relire les cinq sites les plus consultés (Intérieur, Justice, Économie, Travail, Santé) et ne garder que les nouveautés ; planifier toutes les 6 heures ; arrêter la boucle si l'utilisatrice le demande.

## Règles de fond

- Rien de mémoire : tout fait vient d'une page lue pendant l'itération, avec son adresse.
- Neutralité : une annonce n'est pas un fait établi ; elle porte le niveau `D`. Pas d'appréciation de politique publique.
- Une information par ligne, lisible par une personne qui ne connaît pas l'administration. Les sigles sont développés par `acronymes.js` ; ajouter les nouveaux dans son dictionnaire.
- Pas de données personnelles, pas de formulaire rempli, pas de connexion.
- Ne pas commiter. Ne pas toucher au dépôt hors de `Politik/`.
- Ministères sans lien direct avec les pages actuelles (Armées, Outre-mer, Sports, etc.) : les traiter quand même, car la page « Le Gouvernement » est la porte d'entrée de tous les citoyens.

## Ordre de traitement

Intérieur, Justice, Économie, Action et Comptes publics, Travail, Santé, PME-Commerce, Culture (liés aux pages existantes), puis Éducation, Transition écologique, Transports, Ville et Logement, Aménagement du territoire, Agriculture, Armées, Europe et Affaires étrangères, Outre-mer, Enseignement supérieur, Sports, Premier ministre, enfin Cyber.gouv.fr.
