import ShowWhenAuthenticated from "~/components/ShowWhenAuthenticated";
import supabase from "~/utils/supabase";

import { createResource, For, Show } from "solid-js";
import timestampToReadable from "~/utils/timestamp-to-readable";

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
      <h1 class="text-center text-2xl font-medium">
        Articles
      </h1>

      <div class="flex items-center gap-4 justify-center py-6">
        <a href="/articles/nouveau" class="bg-orange text-white px-4 py-2 rounded-lg">
          Créer un article
        </a>

        <button
          type="button"
          onClick={() => refetch()}
        >
          Rafraîchir
        </button>
      </div>

      <Show when={!articles.loading} fallback={<p>Chargement des articles...</p>}>
        <div class="flex flex-col gap-2">
          <For each={articles()} fallback={<p>Aucun article à afficher.</p>}>
            {article => (
              <a href={`/articles/edition/${article.id}`} class="hover:bg-gray-1 px-4 py-2 rounded-lg">
                <h2 class="text-medium font-medium">{article.title}</h2>
                <p>Crée le {timestampToReadable(article.created_at)} et mis à jour le {timestampToReadable(article.updated_at)}.</p>
              </a>
            )}
          </For>
        </div>
      </Show>
    </ShowWhenAuthenticated>
  )
};
