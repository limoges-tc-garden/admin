import ShowWhenAuthenticated from "~/components/ShowWhenAuthenticated";
import { Navigate, useParams } from "@solidjs/router";
import { Show, createResource } from "solid-js";
import supabase from "~/utils/supabase";
import { createFileUploadToSupabase } from "~/utils/create-file-upload";
import makeStoredFilePath from "~/utils/make-stored-file-path";

const fetchArticle = async (id: string) => {
  const { data } = await supabase.from("articles").select(`
    id,
    title,
    content,
    draft,
    created_at,
    updated_at,
    banner_file_id(id, extension, description)
  `.trim()).eq("id", id).single<{
    id: number,
    title: string,
    content: string,
    draft: boolean,
    created_at: string,
    updated_at: string,
    banner_file_id: { id: number, extension: string, description: string } | null
  }>();
  
  return data;
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

  const handleBannerUpload = async (): Promise<void> => {
    const fileID = await createFileUploadToSupabase(`Bannière de l'article '${article()!.id}'`);
    if (typeof fileID !== "number") return;

    const { error } = await supabase.from("articles").update({
      banner_file_id: fileID,
      updated_at: "now()"
    }).eq("id", article()!.id);

    if (error) console.error(error);
    else await refetch();
  };

  const handleBannerRemove = async (): Promise<void> => {
    if (!article()?.banner_file_id) return;

    const { error } = await supabase.from("articles").update({
      banner_file_id: null,
      updated_at: "now()"
    }).eq("id", article()!.id);

    if (error) console.error(error);
    else await refetch();
  };

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

              <button
                type="button"
                onClick={() => handleBannerUpload()}
              >
                Changer l'image de bannière
              </button>

              <button
                type="button"
                onClick={() => handleBannerRemove()}
              >
                Supprimer l'image de bannière
              </button>

              <Show when={article().banner_file_id}>
                {banner => (
                  <>
                    <img
                      src={supabase.storage.from("files").getPublicUrl(makeStoredFilePath(banner())).data.publicUrl}
                      alt={banner().description}
                    />
                    <p>{banner().description}</p>
                  </>
                )}
              </Show>

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
