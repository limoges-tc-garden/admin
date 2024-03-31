import ShowWhenAuthenticated from "~/components/ShowWhenAuthenticated";
import { Navigate, useParams } from "@solidjs/router";
import { Show, createResource } from "solid-js";
import supabase from "~/utils/supabase";

const fetchArticle = async (id: string) => {
  const response = await supabase.from("articles").select().eq("id", id).single();
  return response.data;
}

/**
 * Permet de modifier le contenu d'un article en particulier.
 * @route `/articles/edition/:id`
 */
export default function ArticleEditorView () {
  const params = useParams<{ id: string }>();
  
  const [article, { mutate, refetch }] = createResource(() => params.id, fetchArticle);
  const mutateRemoteArticle = async () => {
    const articleInstance = article();
    if (!articleInstance) return;

    const { error } = await supabase.from("articles").update({
      draft: articleInstance.draft,
      title: articleInstance.title,
      content: articleInstance.content,
      updated_at: "now()" // On utilise la fonction PostgreSQL `now()` pour obtenir le timestamp actuel.
    }).eq("id", params.id);

    if (error) {
      console.error("error", error);
      return;
    }

    await refetch();
  }

  return (
    <ShowWhenAuthenticated>
      <a href="/articles">
        Revenir à la liste d'articles
      </a>

      <Show when={!article.loading} fallback={<p>Chargement de l'article...</p>}>
        <Show when={article()} fallback={<Navigate href="/articles" />}>
          {article => (
            <>
              <h1>
                {article().title}
              </h1>

              <p>
                Crée le: {article().created_at}
              </p>
              <p>
                Dernière mise à jour: {article().updated_at}
              </p>

              <input type="text" value={article().content}
                onInput={(event) => {
                  mutate((prev) => prev ? ({
                    ...prev,
                    content: event.target.value
                  }) : prev);
                }}
              />

              <input type="checkbox" checked={article().draft}
                onChange={(event) => {
                  mutate((prev) => prev ? ({
                    ...prev,
                    draft: event.target.checked
                  }) : prev);
                }}
              />

              <button
                type="button"
                onClick={mutateRemoteArticle}
              >
                Enregistrer
              </button>
            </>
          )}
        </Show>
      </Show>
    </ShowWhenAuthenticated>
  )
};
