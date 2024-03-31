# Contribution

> Ensemble de règles pour les futurs contributeurs.

## Mettre à jour [les types de la base PostgreSQL](./src/utils/database.types.ts)

Il faut avoir le [CLI Supabase](https://github.com/supabase/cli) installé, [connecté](https://supabase.com/docs/reference/cli/supabase-login) et [lié au projet](https://supabase.com/docs/reference/cli/supabase-link) avant d'effectuer cette opération.

```bash
# Voir <https://supabase.com/docs/reference/cli/supabase-gen-types-typescript>.
supabase gen types typescript --project-id abcdefghijklmnopqrst > ./src/utils/database.types.ts
```

## Langue

On utilise de l'anglais et du français dans le projet, ainsi il faut savoir quand utiliser l'une ou l'autre langue.

### Français

- Les commentaires (dans le code)
- La documentation (comme pour ce fichier `CONTRIBUTING.md`) ;
- Le nom des routes (`/tournois` et pas `/tournaments`) ;
- Le contenu des pages, `<meta>` et `<title>`, tout ce qui est visible par l'utilisateur.

### Anglais

- Les noms de variables, fonctions, classes, fichiers, etc. ;
- Les commits et branches du dépôt.

### Pourquoi ?

Il est plus facile de ne pas mélanger le code anglais (imposé par la spécification JavaScript : `if`, `else`, `function`, ...) avec des mots français.
