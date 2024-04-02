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

      <h1>Enseignants</h1>

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

      <Show when={teachers.loading}>
        <p>Chargement des enseignant(e)s...</p>
      </Show>

      <div>
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