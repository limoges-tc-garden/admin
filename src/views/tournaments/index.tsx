import ShowWhenAuthenticated from "~/components/ShowWhenAuthenticated";
import supabase from "~/utils/supabase";

import { createResource, For, Show } from "solid-js";

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
      <h1>Tournois</h1>

      <a href="/tournois/nouveau">
        Créer un résultat de tournoi
      </a>

      <button
        type="button"
        onClick={() => refetch()}
      >
        Rafraîchir
      </button>

      <Show when={!tournaments.loading} fallback={<p>Chargement des tournois...</p>}>
        <For each={tournaments()} fallback={<p>Aucun tournoi à afficher.</p>}>
          {tournament => (
            <article>
              <a href={`/tournois/edition/${tournament.id}`}>
                <h2>{tournament.title}</h2>
                <p>Crée le {tournament.created_at} et mis à jour le {tournament.updated_at}.</p>
              </a>
            </article>
          )}
        </For>
      </Show>
    </ShowWhenAuthenticated>
  )
};
