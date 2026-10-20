# Un faux test par persona, sur la page fraude sociale

Date : 2026-10-20. Pages testées : `index.html`, niveaux « Termes de l'État » et FALC. Complète `2026-10-20-validation-comprehension.md`.

## Ce que c'est, et ce que ce n'est pas

Ces tests sont simulés. Aucune personne n'a lu le site. Pour chacun des neuf rôles de la page (citoyen, journaliste, décideur, ministre, immigrant, commerçant, salarié, freelance, agent de caisse), un script a joué le parcours que la page propose : choisir le rôle, cliquer l'étape qui répond à sa question, puis vérifier que la réponse est là, lisible, et à quelle distance.

Il mesure donc ce qu'une machine peut mesurer : le nombre de clics, la présence de la réponse, le nombre de mots à parcourir avant de la voir. Il ne dit rien sur ce qu'un lecteur comprend, ni sur ce qu'il ressent en lisant. Les remarques sur chaque rôle plus bas sont des hypothèses tirées de ces mesures et des fiches personas. Le vrai test reste à faire (carte B-017).

Les « rôles » de la page fraude sont distincts des neuf personas politiques (Carinne, Louis, Martin, etc.). Les premiers décrivent une position face au sujet, les seconds un public politique.

## Résultats

Chaque test : une question, une étape de parcours, deux clics (le rôle, puis l'étape). « Mots avant » compte les mots qu'il faut lire dans la section avant d'arriver à la réponse.

| Rôle | Question posée | Étape | Mots avant (État / FALC) | Longueur de la section (État / FALC) | Ce que la page répond |
|---|---|---|---|---|---|
| Citoyen·ne | Le chiffre de 14 milliards entendu à la télé, de quoi parle-t-il ? | 1 | 36 / 58 | 162 / 187 | 14 Md€ par an est une estimation de la fraude sociale totale (HCFiPS, janvier 2026). 3,1 Md€ ont été détectés. |
| Journaliste | D'où vient le chiffre de 3,1 Md€ trouvés, et avec quel niveau de confiance ? | 2 | 25 / 25 | 776 / 776 | Communiqué de Bercy du 8 avril 2026, niveau V, premier de la liste. |
| Décideur | Quelle est la dernière loi votée contre la fraude, et quand ? | 2 | 375 / 274 | 454 / 339 | Loi promulguée le 25 juin 2026, publiée au Journal officiel le 26. |
| Ministre | Quelle branche trouve le plus de fraude ? | 1 | 58 / 54 | 630 / 592 | L'Urssaf, 1,5 Md€ redressés pour le travail dissimulé, devant l'assurance maladie (723 M€). |
| Immigrant | Combien de temps attend-on son numéro de sécu quand on est né à l'étranger ? | 3 | 148 / 95 | 276 / 182 | Le délai n'est pas publié. |
| Commerçant | Quelle part de la fraude vient des entreprises ? | 1 | 41 / 75 | 367 / 428 | 52 % pour les entreprises et indépendants, 36 % pour les assurés, 12 % pour les professionnels de santé. |
| Salarié | Les personnes comme moi sont-elles davantage contrôlées ? | 2 | 117 / 124 | 1 095 / 903 | Pour les familles monoparentales : 16 % des bénéficiaires de la CAF et 36 % des vérifications. Rien sur les salariés en général. |
| Freelance | Combien l'Urssaf récupère-t-elle sur le travail dissimulé ? | 1 | 63 / 61 | 630 / 592 | 100 M€ recouvrés sur 1,5 Md€ redressés. Aucun chiffre pour les indépendants seuls. |
| Agent de caisse | Combien de contrôles se révèlent injustifiés ? | 3 | 182 / 102 | 276 / 182 | Le taux de faux positifs n'est pas publié. |

Dix-huit parcours joués (neuf rôles, deux niveaux). Dans les dix-huit, la section visée s'ouvre, la mention « pour vous » est posée sur le titre, et la réponse est présente. Tous prennent deux clics.

La réponse n'est pas de même nature selon les cas :

- Six questions reçoivent une réponse chiffrée : citoyen, journaliste, décideur, ministre, commerçant, freelance.
- Deux reçoivent une réponse « non publié » : immigrant et agent de caisse. C'est la bonne réponse, puisque le chiffre n'existe pas, mais elle ressemble à un échec si la lectrice n'a pas été prévenue.
- Une reçoit une réponse partielle : le salarié obtient le cas des familles monoparentales, pas celui des salariés.

## Remarques par rôle

Ce sont des hypothèses à confronter à de vraies personnes.

**Citoyen·ne.** Le meilleur parcours : la réponse arrive après 36 mots et la section est courte. En FALC elle arrive plus tard (58 mots) parce que le texte explique d'abord ce qu'est une estimation, ce qui paraît utile. Le risque est de retenir 14 sans le mot « estimation », puisque le chiffre est lu avant la phrase qui le qualifie.

**Journaliste.** La source cherchée est le premier élément d'une liste de 776 mots, avec son niveau V. Ce rôle trouve vite, mais les pastilles V, S, D et A doivent être comprises : sans la légende, « V » ne dit rien.

**Décideur.** La réponse est tout en bas de la frise : 375 mots à lire en niveau État. La frise est chronologique, la loi la plus récente arrive donc en dernier. Quelqu'un qui cherche « la dernière » devra tout lire ou deviner qu'il faut aller à la fin.

**Ministre.** La réponse est dans un graphique, pas dans une phrase. Elle se lit si l'on sait que la première colonne est le montant redressé et la seconde le montant recouvré. Sinon « 100 M€ » à côté de « 1,5 Md€ » peut passer pour deux fraudes différentes.

**Immigrant.** Le parcours conduit à la rubrique des trous de mesure, et la réponse est que l'information n'existe pas. C'est honnête, mais ce rôle a peut-être besoin de savoir à qui s'adresser pour son propre dossier, et le site n'en parle pas.

**Commerçant.** Le 52 % regroupe entreprises et indépendants, sans distinguer un patron qui emploie vingt personnes d'un auto-entrepreneur. Le commerçant peut se sentir visé : la page dit seulement que 52 % de la fraude estimée vient d'un ensemble où il figure.

**Salarié.** La section est la plus longue du site : 1 095 mots en niveau État, 903 en FALC. La réponse qui s'en approche concerne les parents isolés. Un salarié sans enfant n'y trouve pas de chiffre sur lui, et rien ne le lui dit.

**Freelance.** La page dit clairement qu'il n'existe pas de chiffre de fraude pour les indépendants seuls, ce qui est une bonne chose. La question testée, sur l'Urssaf, trouve sa réponse, mais ce n'est pas la question que se pose un freelance, qui voudrait savoir si on le contrôle plus qu'un salarié.

**Agent de caisse.** Même situation que l'immigrant : le chiffre n'est pas publié. Pour un agent qui connaît les dossiers de l'intérieur, cette absence peut être lue comme un manque de la page plutôt que des données. La formulation change entre niveaux (« injustifiés » en État, « se trompent » en FALC) sans conséquence sur la réponse.

## Ce qui ressort

1. Le parcours par rôle fait son travail : neuf rôles, deux niveaux, deux clics, la réponse est toujours là.
2. Trois sections ont une réponse enfouie ou une longueur qui complique la tâche : la frise (réponse à la fin), la section « contrepoids » (1 095 mots en État), le graphique des branches (deux colonnes sans légende dans la phrase).
3. Deux réponses sur neuf sont des « non publié » et une est partielle. Aucune n'est fausse, mais un lecteur pressé peut les lire comme des échecs de la page. Un bandeau « Ce qu'on ne sait pas » identique dans les trois cas aiderait.
4. Les rôles « salarié » et « freelance » posent la question de leur propre situation, que les données actuelles ne couvrent pas. Ce n'est pas un défaut de la page, c'est une limite des données, qu'il faut dire en tête de section.

## Limites de ces tests

- Les critères de réponse sont des motifs de texte. Ils vérifient qu'une phrase attendue est présente, pas qu'elle est claire. Le premier jet de ces critères était trop large (un simple mot comme « délai » suffisait) et j'ai relu à la main chaque extrait avant de conclure.
- Les deux clics sont ceux que la page prévoit. Un lecteur peut aussi faire défiler ou chercher dans les onglets, et prendre plus de temps.
- Les mots « avant la réponse » donnent une idée de l'effort de lecture, pas du temps réel.
- Les tests portent uniquement sur la page fraude. Les pages médias et forces de l'ordre n'ont pas de parcours par rôle.

## Ce que je propose

Trois changements, chacun avec un critère vérifiable.

1. Mettre « Dernière mesure » en tête de la frise, ou inverser l'ordre. Critère : la loi du 25 juin 2026 est dans les 100 premiers mots de la section, mesuré par le même script.
2. Couper la section « contrepoids » en deux blocs avec un résumé en tête. Critère : moins de 500 mots avant le premier graphique, la réponse du salarié dans les 60 premiers mots.
3. Ajouter un encart « Ce qu'on ne sait pas » sur chaque question sans chiffre publié. Critère : en test avec de vraies personnes, aucun lecteur ne dit que la page « n'a pas la réponse ».

Ces changements restent des propositions : le test réel (B-017) dira s'ils sont les bons.
