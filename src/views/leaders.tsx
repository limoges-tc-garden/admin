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

      <h1 class="text-center text-2xl font-medium">
        Dirigeants
      </h1>

      <div class="flex items-center gap-4 justify-center py-6">
        <button
          type="button"
          class="bg-orange text-white px-4 py-2 rounded-lg"
          onClick={() => setCreationOpened(true)}
        >
          Ajouter
        </button>

        <button
          type="button"
          onClick={() => refetch()}
        >
          Rafraîchir
        </button>
      </div>

      <Show when={leaders.loading}>
        <p>Chargement des dirigeants...</p>
      </Show>

      <div class="flex flex-col gap-4 mb-8">
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
