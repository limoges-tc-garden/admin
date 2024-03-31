import ShowWhenAuthenticated from "~/components/ShowWhenAuthenticated";
import { Navigate, useParams } from "@solidjs/router";
import { Show, createResource } from "solid-js";
import supabase from "~/utils/supabase";

const fetchTournament = async (id: string) => {
  const response = await supabase.from("tournaments").select().eq("id", id).single();
  return response.data;
}

/**
 * Permet de modifier le contenu un tournoi en particulier.
 * @route `/tournois/edition/:id`
 */
export default function TournamentEditorView () {
  const params = useParams<{ id: string }>();
  
  const [tournament, { mutate, refetch }] = createResource(() => params.id, fetchTournament);
  const mutateRemoteTournament = async () => {
    const tournamentInstance = tournament();
    if (!tournamentInstance) return;

    const { error } = await supabase.from("tournaments").update({
      draft: tournamentInstance.draft,
      title: tournamentInstance.title,
      content: tournamentInstance.content,
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
      <a href="/tournois">
        Revenir à la liste des tournois
      </a>
      
      <Show when={!tournament.loading} fallback={<p>Chargement du tournois...</p>}>
        <Show when={tournament()} fallback={<Navigate href="/tournois" />}>
          {tournament => (
            <>
              <h1>
                {tournament().title}
              </h1>

              <p>
                Crée le: {tournament().created_at}
              </p>
              <p>
                Dernière mise à jour: {tournament().updated_at}
              </p>

              <input type="text" value={tournament().content}
                onInput={(event) => {
                  mutate((prev) => prev ? ({
                    ...prev,
                    content: event.target.value
                  }) : prev);
                }}
              />

              <input type="checkbox" checked={tournament().draft}
                onChange={(event) => {
                  mutate((prev) => prev ? ({
                    ...prev,
                    draft: event.target.checked
                  }) : prev);
                }}
              />

              <button
                type="button"
                onClick={mutateRemoteTournament}
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
