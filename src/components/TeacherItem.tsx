import type { Database } from "~/utils/database.types"
import { Show, type Component, createSignal, batch } from "solid-js";
import supabase from "~/utils/supabase";

type Teacher = Database["public"]["Tables"]["teachers"]["Row"];
const TeacherItem: Component<{
  teacher: Teacher
  refetch: () => Promise<void>;
}> = (props) => {
  const [editing, setEditing] = createSignal(false);

  // Valeurs pour les champs éditables.
  const [editedFirstName, setEditedFirstName] = createSignal("");
  const [editedLastName, setEditedLastName] = createSignal("");

  /** Supprime l'enseignant(e) de la base de données. */
  const removeFromRemote = async (): Promise<void> => {
    const { error } = await supabase.from("teachers").delete().eq("id", props.teacher.id);
    if (error) console.error(error);
    else await props.refetch();
  };
  
  const startEditing = () => batch(() => {
    // On met les valeurs par défaut aux valeurs actuelles.
    setEditedFirstName(props.teacher.first_name);
    setEditedLastName(props.teacher.last_name);
    // On active le mode édition.
    setEditing(true);
  })

  const pushToRemote = async (): Promise<void> => {
    const firstNameValue = editedFirstName();
    const lastNameValue = editedLastName();

    if (!firstNameValue || !lastNameValue) {
      throw new Error("Veuillez remplir tous les champs.");
    }

    const { error } = await supabase.from("teachers").update({
      first_name: firstNameValue,
      last_name: lastNameValue,
    }).eq("id", props.teacher.id);

    if (error) console.error(error);
    else {
      batch(() => {
        // On réinitialise les champs.
        setEditedFirstName("");
        setEditedLastName("");
        // On désactive le mode édition.
        setEditing(false);
      });

      // On rafraîchit les données du composant parent.
      await props.refetch();
    }
  };

  return (
    <div class="flex">
      <div class="flex flex-col">
        <Show when={!editing()} fallback={
          <div>
            <input
              type="text"
              value={editedFirstName()}
              onInput={e => setEditedFirstName(e.currentTarget.value)}
            />
            <input
              type="text"
              value={editedLastName()}
              onInput={e => setEditedLastName(e.currentTarget.value)}
            />
          </div>
        }>
          <h2>{props.teacher.first_name} {props.teacher.last_name}</h2>
        </Show>
      </div>

      <div class="ml-auto flex gap-4">
        <Show when={!editing()}
          fallback={
            <button type="button" onClick={pushToRemote}>
              Sauvegarder
            </button>
          }
        >
          <button type="button" onClick={startEditing}>
            Éditer
          </button>
        </Show>

        <button type="button" onClick={removeFromRemote}>
          Supprimer
        </button>
      </div>
    </div>
  )
};

export default TeacherItem;
