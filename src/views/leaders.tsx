import { For, Show, Suspense, createResource, createSignal } from "solid-js";

import ShowWhenAuthenticated from "~/components/ShowWhenAuthenticated";
import supabase from "~/utils/supabase";
import LeaderCreationModal from "~/components/LeaderCreationModal";
import LeaderItem from "~/components/LeaderItem";

const fetchLeaders = async () => {
  const response = await supabase.from("leaders").select("*");
  return response.data;
}

/**
 * Permet de visualiser et modifier les dirigeants du club.
 * @route `/dirigeants`
 */
export default function LeadersView () {
  const [leaders, { refetch }] = createResource(fetchLeaders);
  const [creationOpened, setCreationOpened] = createSignal(false);

  return (
    <ShowWhenAuthenticated>
      <LeaderCreationModal
        open={creationOpened()}
        setOpen={setCreationOpened}
        refetch={async () => void refetch()}
      />

      <h1>Dirigeants</h1>

      <button
        type="button"
        onClick={() => refetch()}
      >
        Rafraîchir
      </button>

      <button
        type="button"
        onClick={() => setCreationOpened(true)}
      >
        Ajouter
      </button>

      <Show when={leaders.loading}>
        <p>Chargement des dirigeants...</p>
      </Show>

      <div>
        <Suspense>
          <For each={leaders()} fallback={<p>Aucun dirigeant à afficher.</p>}>
            {leader => (
              <LeaderItem
                leader={leader}
                refetch={async () => void refetch()}
              />
            )}
          </For>
        </Suspense>
      </div>
    </ShowWhenAuthenticated>
  )
};
