import ShowWhenAuthenticated from "~/components/ShowWhenAuthenticated";
import { Navigate, useParams } from "@solidjs/router";
import { Show, createEffect, createResource, createSignal, on, onCleanup } from "solid-js";
import supabase from "~/utils/supabase";
import { createFileUploadToSupabase } from "~/utils/create-file-upload";
import makeStoredFilePath from "~/utils/make-stored-file-path";
import EditorJS, { type OutputData } from '@editorjs/editorjs';
import timestampToReadable from "~/utils/timestamp-to-readable";

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
    content: OutputData | null,
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
    const content = await editor?.save() ?? null;

    const articleInstance = article();
    if (!articleInstance) return;

    const { error } = await supabase.from("articles").update({
      draft: articleInstance.draft,
      title: articleInstance.title,
      // @ts-expect-error : pas le même type
      content,
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

  let editor: EditorJS | null = null;
  const [editorElement, setEditorElement] = createSignal<HTMLDivElement | undefined>();
  
  createEffect(on(editorElement, (holder) => {
    if (!holder) return;
    editor = new EditorJS({
      holder,
      // On initialise le contenu de l'éditeur avec le contenu 
      // actuel dans la base de données.
      data: article()?.content ?? void 0
    });

    onCleanup(() => {
      if (editor) {
        editor.destroy();
        editor = null;
      }
    });
  }));

  return (
    <ShowWhenAuthenticated>
      <Show when={!article.loading} fallback={<p>Chargement de l'article...</p>}>
        <Show when={article()} fallback={<Navigate href="/articles" />}>
          {article => (
            <>
              <h1 class="text-center text-2xl font-medium">
                {article().title}
              </h1>

              <div class="text-sm flex flex-col gap-1 text-center py-4">
                <p>
                  Crée le {timestampToReadable(article().created_at)}
                </p>
                <p>
                  Dernière mise à jour le {timestampToReadable(article().updated_at)}
                </p>
              </div>

              <Show when={article().banner_file_id}>
                {banner => (
                  <img
                    src={supabase.storage.from("files").getPublicUrl(makeStoredFilePath(banner())).data.publicUrl}
                    alt={banner().description}
                    class="max-h-[400px] mx-auto rounded-lg border"
                  />
                )}
              </Show>

              <div class="flex justify-center items-center gap-4 pt-6">
                <button
                  type="button"
                  class="border border hover:bg-gray-1  transition rounded-lg px-4 py-2"
                  onClick={() => handleBannerUpload()}
                >
                  {article().banner_file_id ? "Changer l'" : "Ajouter une "}image
                </button>

                <Show when={article().banner_file_id}>
                  <button
                    type="button"
                    class="border border-red hover:bg-red-1 transition rounded-lg px-4 py-2"
                    onClick={() => handleBannerRemove()}
                  >
                    Supprimer l'image
                  </button>
                </Show>
              </div>

              <div class="border rounded-lg p-2 my-4" ref={setEditorElement} />
              
              <div class="mt-6 mb-12 flex gap-6 items-center justify-right">
                <label class="flex gap-2">
                  <input type="checkbox" checked={article().draft}
                    onChange={(event) => {
                      mutate((prev) => prev ? ({
                        ...prev,
                        draft: event.target.checked
                      }) : prev);
                    }}
                  />
                  <p>Brouillon</p>
                </label>

                <button
                  type="button"
                  class="bg-orange-5 text-white px-4 py-1.5 rounded-lg hover:(bg-orange text-white) transition "
                  onClick={mutateRemoteArticle}
                >
                  Enregistrer
                </button>
              </div>
            </>
          )}
        </Show>
      </Show>
    </ShowWhenAuthenticated>
  )
};
