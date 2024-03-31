import ShowWhenAuthenticated from "~/components/ShowWhenAuthenticated";
import supabase from "~/utils/supabase";

import { createResource, For, Show } from "solid-js";

/**
 * Liste des articles dans la base de données.
 * Permet de visualiser les articles enregistrés.
 * 
 * @route `/articles`
 */
export default function ArticlesView () {
  const [articles, { refetch }] = createResource(async () => {
    const response = await supabase.from("articles").select();
    return response.data;
  });

  return (
    <ShowWhenAuthenticated>
      <h1>Articles</h1>

      <a href="/articles/nouveau">
        Créer un article
      </a>

      <button
        type="button"
        onClick={() => refetch()}
      >
        Rafraîchir
      </button>

      <Show when={!articles.loading} fallback={<p>Chargement des articles...</p>}>
        <For each={articles()} fallback={<p>Aucun article à afficher.</p>}>
          {article => (
            <article>
              <a href={`/articles/edition/${article.id}`}>
                <h2>{article.title}</h2>
                <p>Crée le {article.created_at} et mis à jour le {article.updated_at}.</p>
              </a>
            </article>
          )}
        </For>
      </Show>
    </ShowWhenAuthenticated>
  )
};
