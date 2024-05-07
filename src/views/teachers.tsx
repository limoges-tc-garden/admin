import { For, Show, Suspense, createResource, createSignal } from "solid-js";

import ShowWhenAuthenticated from "~/components/ShowWhenAuthenticated";
import TeacherCreationModal from "~/components/TeacherCreationModal";
import TeacherItem from "~/components/TeacherItem";

import supabase from "~/utils/supabase";

const fetchTeachers = async () => {
  const response = await supabase.from("teachers").select("*");
  return response.data;
}

/**
 * Permet de visualiser et modifier les enseignant.e.s du club.
 * @route `/enseignants`
 */
export default function TeachersView () {
  const [teachers, { refetch }] = createResource(fetchTeachers);
  const [creationOpened, setCreationOpened] = createSignal(false);

  return (
    <ShowWhenAuthenticated>
      <TeacherCreationModal
        open={creationOpened()}
        setOpen={setCreationOpened}
        refetch={async () => void refetch()}
      />

      <h1 class="text-center text-2xl font-medium">
        Enseignants
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


      <Show when={teachers.loading}>
        <p>Chargement des enseignant(e)s...</p>
      </Show>

      <div class="flex flex-col gap-4 mb-8">
        <Suspense>
          <For each={teachers()} fallback={<p>Aucun enseignant(e) à afficher.</p>}>
            {teacher => (
              <TeacherItem
                teacher={teacher}
                refetch={async () => void refetch()}
              />
            )}
          </For>
        </Suspense>
      </div>
    </ShowWhenAuthenticated>
  )
}