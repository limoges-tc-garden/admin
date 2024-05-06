import ShowWhenAuthenticated from "~/components/ShowWhenAuthenticated";
import supabase from "~/utils/supabase";

import { createResource, For, Show } from "solid-js";
import timestampToReadable from "~/utils/timestamp-to-readable";

/**
 * Liste des tournois dans la base de données.
 * Permet de visualiser les tournois enregistrés.
 * 
 * @route `/tournois`
 */
export default function TournamentsView () {
  const [tournaments, { refetch }] = createResource(async () => {
    const response = await supabase.from("tournaments").select();
    return response.data;
  });

  return (
    <ShowWhenAuthenticated>
      <h1 class="text-center text-2xl font-medium">
        Tournois
      </h1>

      <div class="flex items-center gap-4 justify-center py-6">
        <a href="/tournois/nouveau" class="bg-orange text-white px-4 py-2 rounded-lg">
          Créer un résultat de tournoi
        </a>

        <button
          type="button"
          onClick={() => refetch()}
        >
          Rafraîchir
        </button>
      </div>

      <Show when={!tournaments.loading} fallback={<p class="text-center">Chargement des tournois...</p>}>
        <For each={tournaments()} fallback={<p class="text-center">Aucun tournoi à afficher.</p>}>
          {tournament => (
            <a href={`/tournois/edition/${tournament.id}`} class="hover:bg-gray-1 px-4 py-2 rounded-lg">
              <h2 class="text-medium font-medium">{tournament.title}</h2>
              <p>Crée le {timestampToReadable(tournament.created_at)} et mis à jour le {timestampToReadable(tournament.updated_at)}.</p>
            </a>
          )}
        </For>
      </Show>
    </ShowWhenAuthenticated>
  )
};
